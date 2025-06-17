const express = require('express');
const router =express.Router();
const reservationController = require('../controllers/reservationController');
const { authMiddleware } = require('../auth/authMiddleware');
const { roleMiddleware } = require('../auth/roleMiddleware');

// POST /api/reservations - Create a new reservation (Standard users)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['estandar', 'admin', 'superadmin']), // Allow admin/superadmin to create too, if desired
  reservationController.createReservation
);

// GET /api/reservations - Get all reservations (Admin, Superadmin)
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin']),
  reservationController.getAllReservations
);

// GET /api/reservations/user/:userId - Get reservations for a specific user (Standard user for their own, Admin/Superadmin for any)
router.get(
  '/user/:userId',
  authMiddleware,
  // Specific logic for authorization is within the controller for this one
  reservationController.getUserReservations
);

// PUT /api/reservations/:id - Update reservation status (Admin, Superadmin)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin']),
  reservationController.updateReservationStatus
);

// GET /api/reservations/public/approved-reservations - Get approved reservations for public calendar
router.get(
  '/public/approved-reservations',
  reservationController.getPublicApprovedReservations
);

module.exports = router;
