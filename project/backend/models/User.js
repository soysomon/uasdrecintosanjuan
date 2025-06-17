const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { // Nuevo campo
      type: String,
      trim: true,
    },
    email: { // Nuevo campo
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true, // Permite valores null o no existentes en el índice único
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['director', 'admin', 'superadmin', 'docente', 'personal'], // Enum actualizado
      default: 'admin',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Antes de guardar, hashear la contraseña
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);