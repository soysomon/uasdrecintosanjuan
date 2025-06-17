const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityName: {
    type: String,
    required: true,
    trim: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  startTime: { // Formato HH:MM (24h)
    type: String,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido. Usar HH:MM']
  },
  endTime: { // Formato HH:MM (24h)
    type: String,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido. Usar HH:MM']
  },
  requestedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  status: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
    default: 'pendiente'
  },
  comments: { // Comentarios del admin/director al aprobar/rechazar
    type: String,
    trim: true
  },
  userComments: { // Comentarios/notas adicionales del usuario al solicitar
    type: String,
    trim: true
  }
}, { timestamps: true });

// Validación para asegurar que endTime sea después de startTime
ReservationSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const [startHour, startMinute] = this.startTime.split(':').map(Number);
    const [endHour, endMinute] = this.endTime.split(':').map(Number);

    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      return next(new Error('La hora de finalización debe ser posterior a la hora de inicio.'));
    }
  }
  next();
});

// Index para optimizar búsquedas por fecha y espacio
ReservationSchema.index({ reservationDate: 1, spaceId: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);
