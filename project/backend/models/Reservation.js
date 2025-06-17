const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    space: {
      type: String,
      enum: ['aula', 'auditorio'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pendiente', 'aprobada', 'rechazada'],
      default: 'pendiente',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', ReservationSchema);
