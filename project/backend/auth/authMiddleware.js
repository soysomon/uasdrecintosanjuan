const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  try {
    // Verificar que JWT_SECRET esté definido
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Acceso denegado. Usuario no válido.' });
    }
    
    // Adjuntar usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error.message);
    return res.status(401).json({ message: 'Token inválido o configuración incorrecta.' });
  }
};