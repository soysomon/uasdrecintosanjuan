const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'uasd-secret-key');
    
    // Buscar usuario
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Acceso denegado. Usuario no válido.' });
    }
    
    // Adjuntar usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};