/**
 * authController.js — Enterprise hardened authentication controller
 *
 * Security model:
 *   - Access token  : JWT, 15 min TTL, delivered via httpOnly Secure cookie
 *   - Refresh token : opaque 64-byte hex, 7-day TTL, stored in DB + httpOnly cookie
 *   - Token rotation: each /refresh issues a new pair and invalidates the old one
 *   - Reuse detection: presenting a used token deletes the entire token family
 *   - Progressive IP lockout: 5 → 15 min, 10 → 30 min, 15 → 1 hr, 20 → 5 hrs
 *   - Progressive user lockout: 5 bad passwords → account locked 15 min
 *   - All security-relevant events written to SecurityEvent audit log
 */

const crypto = require('crypto');
const jwt    = require('jsonwebtoken');

const User         = require('../models/User');
const IpAttempt    = require('../models/IpAttempt');
const RefreshToken = require('../models/RefreshToken');
const auditLogger  = require('./auditLogger');

// ── Environment guards ────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  throw new Error('[AUTH] JWT_SECRET is not defined. Refusing to start.');
}

// ── Cookie configuration ──────────────────────────────────────────────────────
const IS_PROD = process.env.NODE_ENV === 'production';

const ACCESS_TTL_MS  = 15 * 60 * 1000;          // 15 minutes
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const COOKIE_BASE = {
  httpOnly: true,
  secure: IS_PROD,
  // 'strict' in production prevents cross-origin cookie sending (CSRF defence)
  // 'lax' in dev allows localhost cross-port requests
  sameSite: IS_PROD ? 'strict' : 'lax',
};

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, {
    ...COOKIE_BASE,
    maxAge: ACCESS_TTL_MS,
    path: '/',
  });
  // Refresh token cookie scoped to /api/auth only — minimises exposure surface
  res.cookie('refresh_token', refreshToken, {
    ...COOKIE_BASE,
    maxAge: REFRESH_TTL_MS,
    path: '/api/auth',
  });
}

function clearTokenCookies(res) {
  const clearOpts = { ...COOKIE_BASE, maxAge: 0 };
  res.clearCookie('access_token',  { ...clearOpts, path: '/' });
  res.clearCookie('refresh_token', { ...clearOpts, path: '/api/auth' });
}

// ── Token generators ──────────────────────────────────────────────────────────
function generateAccessToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m', issuer: 'uasd-api', audience: 'uasd-client' }
  );
}

async function generateRefreshToken(userId, family) {
  const token     = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  await RefreshToken.create({ token, userId, family, expiresAt });
  return token;
}

// ── IP progressive lockout ────────────────────────────────────────────────────
const BLOCK_SCHEDULE = [
  { threshold: 5,  minutes: 15  },
  { threshold: 10, minutes: 30  },
  { threshold: 15, minutes: 60  },
  { threshold: 20, minutes: 300 },
];

async function recordFailedIpAttempt(ip) {
  try {
    let record = await IpAttempt.findOne({ ip });
    if (!record) record = new IpAttempt({ ip, failedAttempts: 0, blockLevel: 0 });

    record.failedAttempts += 1;
    record.lastAttempt    = new Date();

    for (let i = 0; i < BLOCK_SCHEDULE.length; i++) {
      if (record.failedAttempts >= BLOCK_SCHEDULE[i].threshold) {
        record.blockLevel = i + 1;
        record.lockUntil  = new Date(Date.now() + BLOCK_SCHEDULE[i].minutes * 60 * 1000);
      }
    }

    await record.save();
  } catch (err) {
    console.error('[AUTH] recordFailedIpAttempt:', err.message);
  }
}

async function isIpBlocked(ip) {
  const record = await IpAttempt.findOne({ ip });
  if (!record || !record.lockUntil) return false;

  if (record.lockUntil > new Date()) return true;

  // Lock expired — reset counters
  record.failedAttempts = 0;
  record.blockLevel     = 0;
  record.lockUntil      = null;
  await record.save();
  return false;
}

async function clearIpAttempts(ip) {
  await IpAttempt.findOneAndUpdate(
    { ip },
    { failedAttempts: 0, blockLevel: 0, lockUntil: null }
  );
}

// ── User account lockout ──────────────────────────────────────────────────────
async function recordFailedUserAttempt(user) {
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  if (user.failedLoginAttempts >= 5) {
    user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  }
  await user.save();
}

async function clearUserAttempts(user) {
  user.failedLoginAttempts = 0;
  user.lockUntil           = null;
  user.lastLogin           = new Date();
  await user.save();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getClientMeta(req) {
  return {
    ip:        req.ip || req.connection?.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || null,
  };
}

// ── Controllers ───────────────────────────────────────────────────────────────

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const { ip, userAgent }      = getClientMeta(req);

  try {
    // 1. IP lockout check
    if (await isIpBlocked(ip)) {
      await auditLogger.log({
        type: 'LOGIN_FAILED', ip, userAgent,
        details: { reason: 'ip_blocked', username },
        severity: 'HIGH',
      });
      return res.status(429).json({ message: 'Demasiados intentos fallidos. Intente más tarde.' });
    }

    // 2. Find user
    const user = await User.findOne({ username: username.toLowerCase().trim() });

    if (!user || !user.active) {
      await recordFailedIpAttempt(ip);
      await auditLogger.log({
        type: 'LOGIN_FAILED', ip, userAgent,
        details: { reason: 'user_not_found', username },
        severity: 'MEDIUM',
      });
      // Generic message — do NOT reveal whether the user exists
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // 3. Account lockout check
    if (user.lockUntil && user.lockUntil > new Date()) {
      await auditLogger.log({
        type: 'ACCOUNT_LOCKED', userId: user._id, username: user.username,
        ip, userAgent, details: { reason: 'account_locked' }, severity: 'HIGH',
      });
      return res.status(423).json({ message: 'Cuenta bloqueada temporalmente. Intente más tarde.' });
    }

    // 4. Password verification
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      await recordFailedIpAttempt(ip);
      await recordFailedUserAttempt(user);
      await auditLogger.log({
        type: 'LOGIN_FAILED', userId: user._id, username: user.username,
        ip, userAgent,
        details: { reason: 'bad_password', attempts: user.failedLoginAttempts },
        severity: 'MEDIUM',
      });
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // 5. Success — reset lockout counters
    await clearIpAttempts(ip);
    await clearUserAttempts(user);

    // 6. Issue tokens (new family = new session)
    const family       = crypto.randomBytes(16).toString('hex');
    const accessToken  = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id, family);

    setTokenCookies(res, accessToken, refreshToken);

    await auditLogger.log({
      type: 'LOGIN_SUCCESS', userId: user._id, username: user.username,
      ip, userAgent, severity: 'LOW',
    });

    return res.json({
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error('[AUTH] login error:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// ── /auth/refresh ─────────────────────────────────────────────────────────────
exports.refresh = async (req, res) => {
  const refreshToken      = req.cookies?.refresh_token;
  const { ip, userAgent } = getClientMeta(req);

  if (!refreshToken) {
    return res.status(401).json({ message: 'No autenticado.' });
  }

  try {
    const record = await RefreshToken.findOne({ token: refreshToken }).populate('userId');

    if (!record) {
      clearTokenCookies(res);
      return res.status(401).json({ message: 'Sesión inválida.' });
    }

    // REUSE DETECTION — token was already rotated: session hijack signal
    if (record.used) {
      await RefreshToken.deleteMany({ family: record.family });
      await auditLogger.log({
        type: 'TOKEN_REUSE_DETECTED', userId: record.userId?._id,
        ip, userAgent,
        details: { family: record.family },
        severity: 'CRITICAL',
      });
      clearTokenCookies(res);
      return res.status(401).json({ message: 'Sesión comprometida. Inicia sesión nuevamente.' });
    }

    if (record.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: record._id });
      clearTokenCookies(res);
      return res.status(401).json({ message: 'Sesión expirada.' });
    }

    const user = record.userId;
    if (!user || !user.active) {
      await RefreshToken.deleteMany({ userId: record.userId });
      clearTokenCookies(res);
      return res.status(401).json({ message: 'Acceso denegado.' });
    }

    // Rotate — mark old token used, issue new pair
    record.used = true;
    await record.save();

    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user._id, record.family);

    setTokenCookies(res, newAccessToken, newRefreshToken);

    await auditLogger.log({
      type: 'TOKEN_REFRESH', userId: user._id, username: user.username,
      ip, userAgent, severity: 'LOW',
    });

    return res.json({
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error('[AUTH] refresh error:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// ── /auth/logout ──────────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  const refreshToken      = req.cookies?.refresh_token;
  const { ip, userAgent } = getClientMeta(req);

  if (refreshToken) {
    try {
      const record = await RefreshToken.findOne({ token: refreshToken });
      if (record) {
        await RefreshToken.deleteMany({ family: record.family });
        await auditLogger.log({
          type: 'LOGOUT', userId: record.userId,
          ip, userAgent, severity: 'LOW',
        });
      }
    } catch (err) {
      console.error('[AUTH] logout error:', err.message);
    }
  }

  clearTokenCookies(res);
  return res.json({ message: 'Sesión cerrada.' });
};

// ── /auth/me ──────────────────────────────────────────────────────────────────
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -failedLoginAttempts -lockUntil');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    return res.json({
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// ── User management (superadmin only) ─────────────────────────────────────────

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -failedLoginAttempts -lockUntil')
      .lean();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
};

exports.createUser = async (req, res) => {
  const { ip, userAgent } = getClientMeta(req);
  try {
    const { username, password, role } = req.body;

    const safeRole = role === 'superadmin' ? 'superadmin' : 'admin';

    const existing = await User.findOne({ username: username.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
    }

    const newUser = new User({
      username: username.toLowerCase().trim(),
      password,
      role: safeRole,
    });
    await newUser.save();

    await auditLogger.log({
      type: 'USER_CREATED', userId: req.user._id, username: req.user.username,
      ip, userAgent,
      details: { createdUser: newUser.username, role: safeRole },
      severity: 'MEDIUM',
    });

    return res.status(201).json({
      message: 'Usuario creado exitosamente.',
      user: { id: newUser._id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear usuario.' });
  }
};

exports.updateUser = async (req, res) => {
  const { ip, userAgent } = getClientMeta(req);
  try {
    const { id } = req.params;
    const { username, password, role, active } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    if (username)                                      user.username = username.toLowerCase().trim();
    if (password)                                      user.password = password;
    if (role && ['admin', 'superadmin'].includes(role)) user.role    = role;
    if (typeof active === 'boolean')                   user.active   = active;

    await user.save();

    if (active === false) {
      await RefreshToken.deleteMany({ userId: id });
    }

    await auditLogger.log({
      type: 'USER_UPDATED', userId: req.user._id, username: req.user.username,
      ip, userAgent,
      details: { updatedUser: user.username, changes: { role, active } },
      severity: 'MEDIUM',
    });

    return res.json({
      message: 'Usuario actualizado.',
      user: { id: user._id, username: user.username, role: user.role, active: user.active },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar usuario.' });
  }
};

exports.deleteUser = async (req, res) => {
  const { ip, userAgent } = getClientMeta(req);
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta.' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    await User.findByIdAndDelete(id);
    await RefreshToken.deleteMany({ userId: id });

    await auditLogger.log({
      type: 'USER_DELETED', userId: req.user._id, username: req.user.username,
      ip, userAgent,
      details: { deletedUser: user.username },
      severity: 'HIGH',
    });

    return res.json({ message: 'Usuario eliminado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar usuario.' });
  }
};

exports.getBlockedIps = async (req, res) => {
  try {
    const blocked = await IpAttempt.find({ lockUntil: { $gt: new Date() } })
      .select('-_id ip failedAttempts blockLevel lockUntil')
      .lean();
    return res.json(blocked);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener IPs bloqueadas.' });
  }
};
