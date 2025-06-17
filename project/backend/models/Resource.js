const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: { // Campo añadido para más detalles
    type: String,
    trim: true
  },
  isAvailable: { // Campo para habilitar/deshabilitar recurso
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
