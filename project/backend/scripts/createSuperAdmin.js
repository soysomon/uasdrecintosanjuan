// Archivo: scripts/createSuperAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// URL de conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mysrox07:idtECcpgXnA7ZL2V@uasd.p9efu.mongodb.net/?retryWrites=true&w=majority&appName=UASD';

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    return false;
  }
};

// Definición del modelo User (copia simplificada para el script)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Antes de guardar, hashear la contraseña
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Solo si el modelo no está ya registrado
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Función para crear el superadmin
const createSuperAdmin = async () => {
  // Conectar a MongoDB
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    const adminUsername = 'superadmin';
    
    // Verificar si ya existe un superadmin
    const existingAdmin = await User.findOne({ 
      username: adminUsername,
      role: 'superadmin'
    });
    
    if (existingAdmin) {
      console.log('=================================================');
      console.log('Ya existe un superadmin en el sistema con username:', adminUsername);
      console.log('Si necesitas restablecer su contraseña, utiliza la función de gestión de usuarios');
      console.log('=================================================');
      return;
    }

    // Opción 1: Contraseña aleatoria
    const generatedPassword = crypto.randomBytes(6).toString('hex');
    
    // Opción 2: Contraseña fija (descomenta si prefieres)
    // const generatedPassword = 'Admin@123456';
    
    // Crear el superadmin
    const superAdmin = new User({
      username: adminUsername,
      password: generatedPassword, // Se hasheará automáticamente por el middleware
      role: 'superadmin',
      active: true
    });

    await superAdmin.save();
    
    console.log('==================================================');
    console.log('¡SUPERADMIN CREADO CON ÉXITO!');
    console.log(`Usuario: ${adminUsername}`);
    console.log(`Contraseña: ${generatedPassword}`);
    console.log('');
    console.log('IMPORTANTE: Guarda esta contraseña en un lugar seguro');
    console.log('y cámbiala inmediatamente después del primer inicio de sesión');
    console.log('navegando a /admin/users después de iniciar sesión.');
    console.log('==================================================');
  } catch (error) {
    console.error('Error al crear superadmin:', error);
  } finally {
    // Desconectar de la base de datos
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
};

// Ejecutar la función
createSuperAdmin();