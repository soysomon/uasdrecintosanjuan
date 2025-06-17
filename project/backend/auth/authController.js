const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const IpAttempt = require('../models/IpAttempt');
// Generar JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '8h' // Token expira en 8 horas
  });
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Cambiado username a email
    const ip = req.ip || req.connection.remoteAddress; // Obtener IP del cliente

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    // Verificar si la IP está bloqueada
    let ipAttempt = await IpAttempt.findOne({ ip });
    if (ipAttempt && ipAttempt.lockUntil && ipAttempt.lockUntil > Date.now()) {
      const timeLeft = Math.ceil((ipAttempt.lockUntil - Date.now()) / 1000 / 60);
      return res.status(429).json({
        message: `Por razones de seguridad, el acceso ha sido suspendido temporalmente. Podrás volver a intentarlo en ${timeLeft} minuto${timeLeft !== 1 ? 's' : ''}.`
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email }); // Cambiado username a email
    if (!user) {
      await recordFailedIpAttempt(ip);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está bloqueado
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const timeLeft = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(429).json({
        message: `Tu cuenta ha sido suspendida temporalmente por razones de seguridad. Podrás intentarlo de nuevo en ${timeLeft} minuto${timeLeft !== 1 ? 's' : ''}.`
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await recordFailedIpAttempt(ip);
      await recordFailedUserAttempt(user);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Resetear intentos fallidos
    if (ipAttempt) {
      ipAttempt.failedAttempts = 0;
      ipAttempt.lockUntil = null;
      ipAttempt.blockLevel = 0;
      await ipAttempt.save();
    }
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = Date.now();
    await user.save();

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devuelve email y name (si existe), username es opcional ahora
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    if (user.name) {
      userResponse.name = user.name;
    }
    if (user.username) { // Si username aún existe en el modelo y quieres devolverlo
      userResponse.username = user.username;
    }

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registrar intentos fallidos de IP
async function recordFailedIpAttempt(ip) {
  let ipAttempt = await IpAttempt.findOne({ ip });
  if (!ipAttempt) {
    ipAttempt = new IpAttempt({ ip });
  }

  ipAttempt.failedAttempts += 1;
  ipAttempt.lastAttempt = Date.now();

  // Lógica de bloqueo progresivo
  if (ipAttempt.failedAttempts === 5 && ipAttempt.blockLevel === 0) {
    ipAttempt.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    ipAttempt.blockLevel = 1;
  } else if (ipAttempt.failedAttempts === 7 && ipAttempt.blockLevel === 1) {
    ipAttempt.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    ipAttempt.blockLevel = 2;
  } else if (ipAttempt.failedAttempts === 9 && ipAttempt.blockLevel === 2) {
    ipAttempt.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    ipAttempt.blockLevel = 3;
  } else if (ipAttempt.failedAttempts === 11 && ipAttempt.blockLevel === 3) {
    ipAttempt.lockUntil = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 horas
    ipAttempt.blockLevel = 4;
  }

  await ipAttempt.save();
}

// Registrar intentos fallidos de usuario
async function recordFailedUserAttempt(user) {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= 5) {
    user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Bloqueo de 15 min
  }
  await user.save();
}

// Listar IPs bloqueadas (para superadmin)
exports.getBlockedIps = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo para superadministradores.' });
    }

    const blockedIps = await IpAttempt.find({
      $or: [{ lockUntil: { $gt: Date.now() } }, { failedAttempts: { $gt: 0 } }],
    }).select('ip failedAttempts lastAttempt lockUntil blockLevel');

    // Añadir tiempo restante para cada IP bloqueada
    const blockedIpsWithTime = blockedIps.map((ip) => ({
      ip: ip.ip,
      failedAttempts: ip.failedAttempts,
      lastAttempt: ip.lastAttempt,
      lockUntil: ip.lockUntil,
      blockLevel: ip.blockLevel,
      timeLeft: ip.lockUntil && ip.lockUntil > Date.now()
        ? Math.ceil((ip.lockUntil - Date.now()) / 1000 / 60)
        : 0,
    }));

    res.json({ blockedIps: blockedIpsWithTime });
  } catch (error) {
    console.error('Error al obtener IPs bloqueadas:', error);
    res.status(500).json({ message: 'Error al obtener IPs bloqueadas' });
  }
};

// Las funciones recordFailedIpAttempt y recordFailedUserAttempt ya están definidas arriba
// Se eliminan las definiciones duplicadas que estaban aquí.

// Obtener usuario actual
exports.getCurrentUser = async (req, res) => {
  try {
    // El middleware de autenticación ya ha adjuntado el usuario a req
    const user = req.user;
    
    res.json({
      user: {
        id: user._id,
        email: user.email, // Devolver email
        name: user.name, // Devolver name si existe
        username: user.username, // Devolver username si aún es relevante
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// CRUD de usuarios (solo para superadmin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ username: 1 });

    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      role: user.role,
      active: user.active,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      isBlocked: user.lockUntil && user.lockUntil > Date.now(), // Indica si está bloqueado
      timeLeft: user.lockUntil && user.lockUntil > Date.now()
        ? Math.ceil((user.lockUntil - Date.now()) / 1000 / 60)
        : 0, // Tiempo restante en minutos
      failedLoginAttempts: user.failedLoginAttempts // Intentos fallidos
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Ahora se espera email y name, username es opcional
    const { email, password, role, name, username } = req.body;
    
    // Validar campos obligatorios
    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios.' });
    }
    
    // Verificar si el usuario ya existe por email
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un usuario con este email ya existe.' });
    }
    // Opcional: verificar por username si se proporciona y es requerido como único
    if (username) {
        existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'Un usuario con este nombre de usuario ya existe.' });
        }
    }
    
    // Crear nuevo usuario
    const user = new User({
      email,
      password, // Se hasheará automáticamente en el middleware pre-save
      name,
      username, // Guardar si se proporciona
      role: role || 'admin', // 'personal' o 'docente' podrían ser defaults más adecuados
      active: true
    });
    
    await user.save();
    
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      active: user.active
    };
    if (user.name) userResponse.name = user.name;
    if (user.username) userResponse.username = user.username;

    res.status(201).json({ user: userResponse });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { email, password, role, active, name, username } = req.body;
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si se intenta cambiar el email, verificar que no exista otro usuario con ese email
    if (email && email !== user.email) {
      const existingUserByEmail = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'El email ya está en uso por otro usuario.' });
      }
      user.email = email;
    }

    // Si se intenta cambiar el username, verificar que no exista otro usuario con ese username
    if (username && username !== user.username) {
      const existingUserByUsername = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso por otro usuario.' });
      }
      user.username = username;
    }
    
    if (password) user.password = password;
    if (role) user.role = role;
    if (active !== undefined) user.active = active;
    if (name !== undefined) user.name = name; // Actualizar name
    
    await user.save();
    
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      active: user.active,
      lastLogin: user.lastLogin
    };
    if (user.name) userResponse.name = user.name;
    if (user.username) userResponse.username = user.username;

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verificar si el usuario existe antes de intentar eliminarlo
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar que no sea el último superadmin
    if (userToDelete.role === 'superadmin') {
      // Contar cuántos superadmins hay en el sistema
      const superadminCount = await User.countDocuments({ role: 'superadmin' });
      
      if (superadminCount <= 1) {
        return res.status(400).json({ 
          message: 'No se puede eliminar el último superadmin del sistema' 
        });
      }
    }
    
    // Proceder con la eliminación
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      success: true,
      message: 'Usuario eliminado correctamente',
      deletedUserId: userId
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

// Cambiar contraseña del usuario actual
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; // Obtenido del middleware de autenticación
    
    // Validar datos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Se requieren la contraseña actual y la nueva' });
    }
    
    // Obtener usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }
    
    // Actualizar contraseña
    user.password = newPassword; // Se hasheará automáticamente
    await user.save();
    
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};