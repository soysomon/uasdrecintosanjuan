const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generar JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'uasd-secret-key', {
    expiresIn: '8h' // Token expira en 8 horas
  });
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario por username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    
    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    
    // Verificar si el usuario está activo
    if (!user.active) {
      return res.status(401).json({ message: 'Cuenta desactivada. Contacte al administrador.' });
    }
    
    // Actualizar lastLogin
    user.lastLogin = new Date();
    await user.save();
    
    // Generar token JWT
    const token = generateToken(user._id);
    
    // Enviar respuesta
    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener usuario actual
exports.getCurrentUser = async (req, res) => {
  try {
    // El middleware de autenticación ya ha adjuntado el usuario a req
    const user = req.user;
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
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
      .sort({ username: 1 }); // Ordenar por nombre de usuario
    
    // Formatear los datos para enviar al cliente
    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      role: user.role,
      active: user.active,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Validar campos obligatorios
    if (!username || !password) {
      return res.status(400).json({ message: 'El nombre de usuario y la contraseña son obligatorios' });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    // Crear nuevo usuario
    const user = new User({
      username,
      password, // Se hasheará automáticamente en el middleware pre-save
      role: role || 'admin',
      active: true
    });
    
    await user.save();
    
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        active: user.active
      }
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password, role, active } = req.body;
    const userId = req.params.id;
    
    // Buscar el usuario que estamos actualizando
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si se intenta cambiar el username, verificar que no exista otro usuario con ese username
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: user._id } // Excluir el usuario actual de la búsqueda
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'El nombre de usuario ya está en uso por otro usuario' 
        });
      }
      
      // Actualizar el username
      user.username = username;
    }
    
    // Actualizar contraseña si se proporciona
    if (password) {
      user.password = password; // El hash se maneja automáticamente en el middleware pre-save
    }
    
    // Actualizar rol si se proporciona
    if (role) {
      user.role = role;
    }
    
    // Actualizar estado si se proporciona
    if (active !== undefined) {
      user.active = active;
    }
    
    // Guardar los cambios
    await user.save();
    
    // Enviar respuesta (sin incluir la contraseña)
    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        active: user.active,
        lastLogin: user.lastLogin
      }
    });
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