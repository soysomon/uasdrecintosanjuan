const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  description: { // Campo añadido para más detalles
    type: String,
    trim: true
  },
  isActive: { // Campo para habilitar/deshabilitar espacio
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Space', SpaceSchema);
