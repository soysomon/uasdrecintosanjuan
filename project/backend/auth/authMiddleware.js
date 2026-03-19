const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * authMiddleware — reads the access token exclusively from the httpOnly cookie.
 *
 * Rejects tokens that arrive via the Authorization header to prevent
 * XSS-stolen tokens from being replayed by a different client.
 *
 * On 401 with code TOKEN_EXPIRED the frontend will call /api/auth/refresh
 * transparently (handled by the axios interceptor in AuthContext.tsx).
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ message: 'No autenticado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer:   'uasd-api',
      audience: 'uasd-client',
    });

    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Acceso denegado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sesión expirada.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'No autenticado.' });
  }
};
