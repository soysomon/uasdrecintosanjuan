const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Space = require('../models/Space');
// const User = require('../models/User'); // No se usa directamente en estas rutas pero podría ser útil para validaciones futuras
const { authMiddleware } = require('../auth/authMiddleware');
const { roleMiddleware } = require('../auth/roleMiddleware');

// Función auxiliar para verificar conflictos de horarios
async function checkAvailability(spaceId, reservationDate, startTime, endTime, excludeReservationId = null) {
  const newStart = new Date(`${reservationDate.toISOString().split('T')[0]}T${startTime}:00.000Z`);
  const newEnd = new Date(`${reservationDate.toISOString().split('T')[0]}T${endTime}:00.000Z`);

  const query = {
    spaceId,
    reservationDate,
    status: { $in: ['aprobada', 'pendiente'] }, // Considerar también pendientes para evitar doble reserva mientras se aprueba
    $or: [
      { // Nueva reserva empieza durante una existente
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };

  // Si estamos actualizando, excluimos la propia reserva de la comprobación de conflictos
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  // Normalización de tiempos para la comparación directa en la base de datos
  // Esto requiere que startTime y endTime en la BD sean comparables directamente.
  // La lógica actual de $or con $lt y $gt es más flexible si los campos son strings HH:MM.
  // Para una comparación robusta, sería mejor almacenar startTime y endTime como Date objects completos en UTC
  // o como minutos desde el inicio del día. Por ahora, se mantiene la lógica con strings HH:MM.
  // La consulta se simplifica a:
  // Una reserva existente (eS, eE) entra en conflicto con una nueva (nS, nE) si:
  // (eS < nE) y (eE > nS)

  const conflictingReservations = await Reservation.find({
    spaceId: spaceId,
    reservationDate: reservationDate, // Comparamos solo en la misma fecha
    status: { $in: ['aprobada'] }, // Solo consideramos aprobadas para conflictos estrictos, o 'pendiente' si se quiere ser más restrictivo
    startTime: { $lt: endTime }, // La reserva existente comienza antes de que termine la nueva
    endTime: { $gt: startTime }, // La reserva existente termina después de que comience la nueva
    ...(excludeReservationId && { _id: { $ne: excludeReservationId } }) // Excluir la propia reserva si se está actualizando
  });

  return conflictingReservations.length === 0;
}

// @route   POST api/reservations
// @desc    Crear una nueva solicitud de reserva
// @access  Private (Docente, Personal)
router.post('/', [authMiddleware, roleMiddleware(['docente', 'personal', 'admin', 'director'])], async (req, res) => { // Permitido a admin/director para pruebas o casos especiales
  const { spaceId, activityName, reservationDate, startTime, endTime, requestedResources, userComments } = req.body;
  const userId = req.user.id;

  try {
    const space = await Space.findById(spaceId);
    if (!space || !space.isActive) {
      return res.status(404).json({ msg: 'Espacio no encontrado o no disponible.' });
    }

    const dateObj = new Date(reservationDate);
    if (isNaN(dateObj)) {
        return res.status(400).json({ msg: 'Formato de fecha inválido.' });
    }

    // Validar que la fecha de reserva no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    if (dateObj < today) {
        return res.status(400).json({ msg: 'No se pueden crear reservas para fechas pasadas.' });
    }

    const isAvailable = await checkAvailability(spaceId, dateObj, startTime, endTime);
    if (!isAvailable) {
      return res.status(400).json({ msg: 'El espacio no está disponible en el horario seleccionado debido a un conflicto.' });
    }

    const newReservation = new Reservation({
      userId,
      spaceId,
      activityName,
      reservationDate: dateObj,
      startTime,
      endTime,
      requestedResources: requestedResources || [],
      userComments,
      status: (req.user.role === 'admin' || req.user.role === 'director') ? 'aprobada' : 'pendiente' // Auto-aprobar para admin/director
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    console.error('Error al crear reserva:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Error de validación.', errors: err.errors });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/reservations
// @desc    Listar todas las solicitudes (para Admin/Director)
// @access  Private (Admin, Director)
router.get('/', [authMiddleware, roleMiddleware(['admin', 'director'])], async (req, res) => {
  const { status, space, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
  const queryOptions = {};
  if (status) queryOptions.status = status;
  if (space) queryOptions.spaceId = space;
  if (dateFrom || dateTo) {
    queryOptions.reservationDate = {};
    if (dateFrom) queryOptions.reservationDate.$gte = new Date(dateFrom);
    if (dateTo) queryOptions.reservationDate.$lte = new Date(dateTo);
  }

  try {
    const reservations = await Reservation.find(queryOptions)
      .populate('userId', 'name email') // Popula nombre y email del usuario
      .populate('spaceId', 'name')      // Popula nombre del espacio
      .populate('requestedResources', 'name') // Popula nombres de los recursos
      .sort({ reservationDate: -1, startTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Reservation.countDocuments(queryOptions);

    res.json({
      reservations,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/reservations/user
// @desc    Listar solicitudes del usuario autenticado
// @access  Private (Docente, Personal, Admin, Director)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate('spaceId', 'name')
      .populate('requestedResources', 'name')
      .sort({ reservationDate: -1, startTime: 1 });
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/reservations/approved-weekly
// @desc    Obtener reservas aprobadas para un rango de fechas (generalmente una semana)
// @access  Public o Private (Autenticado) - Por ahora Autenticado
router.get('/approved-weekly', authMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query; // Espera fechas en formato YYYY-MM-DD

  if (!startDate || !endDate) {
    return res.status(400).json({ msg: 'Se requieren fecha de inicio y fin.' });
  }
  try {
    const start = new Date(startDate);
    start.setUTCHours(0,0,0,0);
    const end = new Date(endDate);
    end.setUTCHours(23,59,59,999);

    if (isNaN(start.valueOf()) || isNaN(end.valueOf())) {
         return res.status(400).json({ msg: 'Formato de fecha inválido.' });
    }

    const reservations = await Reservation.find({
      status: 'aprobada',
      reservationDate: {
        $gte: start,
        $lte: end
      }
    })
    .populate('spaceId', 'name capacity')
    .populate('userId', 'name') // Solo el nombre del solicitante por privacidad
    .populate('requestedResources', 'name')
    .sort({ reservationDate: 1, startTime: 1 });

    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/reservations/:id
// @desc    Obtener una solicitud específica
// @access  Private (Usuario de la reserva, Admin, Director)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('spaceId', 'name capacity')
      .populate('requestedResources', 'name');

    if (!reservation) {
      return res.status(404).json({ msg: 'Reserva no encontrada' });
    }

    // Permitir acceso si es el usuario que creó la reserva o si es admin/director
    if (reservation.userId._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'director') {
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }
    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Reserva no encontrada (ID inválido)' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/reservations/:id/status
// @desc    Actualizar estado de una solicitud (Aprobar/Rechazar/Cancelar)
// @access  Private (Admin, Director)
router.put('/:id/status', [authMiddleware, roleMiddleware(['admin', 'director'])], async (req, res) => {
  const { status, comments } = req.body;
  const allowedStatuses = ['aprobada', 'rechazada', 'cancelada'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Estado no válido.' });
  }

  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: 'Reserva no encontrada' });
    }

    // Si se aprueba, verificar conflictos nuevamente (excluyendo la propia reserva)
    if (status === 'aprobada') {
      const isAvailable = await checkAvailability(
        reservation.spaceId,
        reservation.reservationDate,
        reservation.startTime,
        reservation.endTime,
        reservation._id
      );
      if (!isAvailable) {
        return res.status(400).json({ msg: 'Conflicto de horario. No se puede aprobar esta reserva.' });
      }
    }

    // No permitir cambiar estado si ya está cancelada por el admin/director o si ya fue procesada (aprobada/rechazada)
    // a menos que sea para cancelar una aprobada.
    if ((reservation.status === 'cancelada' || reservation.status === 'rechazada') && status !== 'pendiente') { // Podría permitirse pasar de rechazada a pendiente?
         // return res.status(400).json({ msg: `La reserva ya está ${reservation.status}. No se puede cambiar a ${status}.` });
    }
    if (reservation.status === 'aprobada' && status === 'rechazada') {
        // return res.status(400).json({ msg: 'No se puede rechazar una reserva ya aprobada. Cancélela en su lugar.' });
    }


    reservation.status = status;
    if (comments) reservation.comments = comments; else reservation.comments = undefined; // Limpiar comentarios si no se envían

    await reservation.save();

    // Aquí se podría añadir lógica de notificación al usuario.

    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Error de validación.', errors: err.errors });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/reservations/:id (Para que el usuario edite su propia reserva PENDIENTE)
// @desc    Actualizar una solicitud de reserva (solo por el propietario y si está pendiente)
// @access  Private (Propietario de la reserva)
router.put('/:id', authMiddleware, async (req, res) => {
    const { spaceId, activityName, reservationDate, startTime, endTime, requestedResources, userComments } = req.body;
    const reservationId = req.params.id;
    const userId = req.user.id;

    try {
        let reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ msg: 'Reserva no encontrada.' });
        }

        if (reservation.userId.toString() !== userId) {
            return res.status(403).json({ msg: 'No autorizado para modificar esta reserva.' });
        }

        if (reservation.status !== 'pendiente') {
            return res.status(400).json({ msg: `Solo se pueden modificar reservas con estado 'pendiente'. Estado actual: ${reservation.status}.` });
        }

        const dateObj = new Date(reservationDate);
        if (isNaN(dateObj)) {
            return res.status(400).json({ msg: 'Formato de fecha inválido.' });
        }

        // Validar que la nueva fecha de reserva no sea en el pasado
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateObj < today) {
            return res.status(400).json({ msg: 'No se pueden modificar reservas para fechas pasadas.' });
        }

        const effectiveSpaceId = spaceId || reservation.spaceId;
        const effectiveDate = reservationDate ? dateObj : reservation.reservationDate;
        const effectiveStartTime = startTime || reservation.startTime;
        const effectiveEndTime = endTime || reservation.endTime;

        const isAvailable = await checkAvailability(effectiveSpaceId, effectiveDate, effectiveStartTime, effectiveEndTime, reservationId);
        if (!isAvailable) {
            return res.status(400).json({ msg: 'El espacio no está disponible en el nuevo horario seleccionado debido a un conflicto.' });
        }

        // Actualizar campos
        if (spaceId) reservation.spaceId = spaceId;
        if (activityName) reservation.activityName = activityName;
        if (reservationDate) reservation.reservationDate = dateObj;
        if (startTime) reservation.startTime = startTime;
        if (endTime) reservation.endTime = endTime;
        if (requestedResources) reservation.requestedResources = requestedResources;
        if (userComments !== undefined) reservation.userComments = userComments;

        // Revalidar el modelo antes de guardar
        await reservation.validate();
        const updatedReservation = await reservation.save();

        res.json(updatedReservation);

    } catch (err) {
        console.error('Error al actualizar reserva:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Error de validación.', errors: err.errors });
        }
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Reserva o recurso/espacio asociado no encontrado.' });
        }
        res.status(500).send('Error del servidor');
    }
});


// @route   DELETE api/reservations/:id (Para que el usuario CANCELE su propia reserva PENDIENTE)
// @desc    Cancelar una solicitud de reserva (solo por el propietario y si está pendiente)
// @access  Private (Propietario de la reserva)
// Nota: Los administradores usan PUT /:id/status con status: 'cancelada'
router.delete('/:id', authMiddleware, async (req, res) => {
    const reservationId = req.params.id;
    const userId = req.user.id;

    try {
        let reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ msg: 'Reserva no encontrada.' });
        }

        if (reservation.userId.toString() !== userId) {
            return res.status(403).json({ msg: 'No autorizado para cancelar esta reserva.' });
        }

        if (reservation.status !== 'pendiente') {
            return res.status(400).json({ msg: `Solo se pueden cancelar reservas con estado 'pendiente'. Estado actual: ${reservation.status}.` });
        }

        // Cambiar estado a 'cancelada' en lugar de eliminarla directamente
        // reservation.status = 'cancelada';
        // reservation.comments = 'Cancelada por el usuario.'; // Opcional
        // await reservation.save();
        // res.json({ msg: 'Reserva cancelada por el usuario.', reservation });

        // O eliminarla si esa es la política para cancelaciones de usuario
        await Reservation.findByIdAndDelete(reservationId);
        res.json({ msg: 'Reserva eliminada por el usuario.' });


    } catch (err) {
        console.error('Error al cancelar/eliminar reserva:', err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
