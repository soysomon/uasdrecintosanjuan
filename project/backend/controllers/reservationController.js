const Reservation = require('../models/Reservation');
const User = require('../models/User'); // Needed for checking user roles

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { space, date, startTime, endTime, purpose } = req.body;
    const userId = req.user._id; // Assuming authMiddleware provides req.user

    if (!space || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Basic validation for date (not in the past)
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare date part only
    if (reservationDate < today) {
      return res.status(400).json({ message: 'La fecha de reserva no puede ser en el pasado.' });
    }

    // Basic validation for time (endTime after startTime)
    // Assuming HH:MM format
    const startTimeParts = startTime.split(':').map(Number);
    const endTimeParts = endTime.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(startTimeParts[0], startTimeParts[1]);
    const endDate = new Date(date);
    endDate.setHours(endTimeParts[0], endTimeParts[1]);

    if (endDate <= startDate) {
      return res.status(400).json({ message: 'La hora de finalización debe ser posterior a la hora de inicio.' });
    }

    const newReservation = new Reservation({
      userId,
      space,
      date: reservationDate,
      startTime,
      endTime,
      purpose,
      status: 'pendiente', // Default status
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error al crear la reserva.', error: error.message });
  }
};

// Get all reservations (for admin/superadmin)
exports.getAllReservations = async (req, res) => {
  try {
    // Authorization check should be handled by roleMiddleware before this controller
    const reservations = await Reservation.find().populate('userId', 'username role').sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Error getting all reservations:', error);
    res.status(500).json({ message: 'Error al obtener las reservas.' });
  }
};

// Get reservations for a specific user
exports.getUserReservations = async (req, res) => {
  try {
    const requestUserId = req.user._id.toString(); // ID of the user making the request
    const targetUserId = req.params.userId;       // ID from the URL parameter

    // Allow user to see their own reservations
    // Allow admin/superadmin to see any user's reservations
    if (req.user.role === 'estandar' && requestUserId !== targetUserId) {
      return res.status(403).json({ message: 'Acceso denegado. Solo puedes ver tus propias reservas.' });
    }

    const reservations = await Reservation.find({ userId: targetUserId }).populate('userId', 'username role').sort({ date: -1, startTime: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Error getting user reservations:', error);
    res.status(500).json({ message: 'Error al obtener las reservas del usuario.' });
  }
};

// Update reservation status (for admin/superadmin)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservationId = req.params.id;

    if (!status || !['aprobada', 'rechazada'].includes(status)) {
      return res.status(400).json({ message: 'El estado proporcionado no es válido. Use "aprobada" o "rechazada".' });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Prevent standard users from updating status
    if (req.user.role === 'estandar') {
        return res.status(403).json({ message: 'No tienes permiso para actualizar el estado de la reserva.' });
    }

    // Only allow pending reservations to be updated by admin/superadmin
    if (reservation.status !== 'pendiente' && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        // Allow admin/superadmin to change status even if not pending, e.g., from approved to rejected or vice-versa if needed.
        // However, the primary use case is pending -> approved/rejected.
        // If strict pending->next_state is required, add:
        // return res.status(400).json({ message: `Solo se pueden actualizar reservas con estado 'pendiente'. Estado actual: ${reservation.status}` });
    }


    reservation.status = status;
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la reserva.' });
  }
};

// Get public approved reservations (for calendar)
exports.getPublicApprovedReservations = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const reservations = await Reservation.find({
      status: 'aprobada',
      date: { $gte: today } // Only today or future dates
    })
    .select('space date startTime endTime purpose') // Select only public fields
    .sort({ date: 1, startTime: 1 }); // Sort by date and then start time

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching public approved reservations:', error);
    res.status(500).json({ message: 'Error al obtener las actividades aprobadas.' });
  }
};
