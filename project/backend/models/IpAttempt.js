const mongoose = require('mongoose');

const ipAttemptSchema = new mongoose.Schema({
 //La dirección IP del Usuario.
    ip: {
    type: String,
    required: true,
    index: true,
  },
  //Cantidad de intentos fallidos desde esa IP.
  failedAttempts: {
    type: Number,
    default: 0,
  },
  //Fecha del último intento fallido.
  lastAttempt: {
    type: Date,
    default: Date.now,
  },
  //Fecha hasta la cual la IP está bloqueada
  lockUntil: {
    type: Date,
    default: null,
  },
  blockLevel: {
    type: Number,
    default: 0, // 0: sin bloqueo, 1: 15 min, 2: 30 min, 3: 1 hora, 4: 5 horas
  },
});

module.exports = mongoose.model('IpAttempt', ipAttemptSchema);