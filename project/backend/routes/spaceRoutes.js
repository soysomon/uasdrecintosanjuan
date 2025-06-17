const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const { authMiddleware } = require('../auth/authMiddleware');
const { roleMiddleware } = require('../auth/roleMiddleware');

// @route   POST api/spaces
// @desc    Crear un nuevo espacio
// @access  Private (Director, Admin)
router.post('/', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  const { name, capacity, description, isActive } = req.body;
  try {
    let space = await Space.findOne({ name });
    if (space) {
      return res.status(400).json({ errors: [{ msg: 'Un espacio con este nombre ya existe.' }] });
    }
    space = new Space({ name, capacity, description, isActive });
    await space.save();
    res.status(201).json(space);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/spaces
// @desc    Obtener todos los espacios
// @access  Private (Autenticado)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const spaces = await Space.find({ isActive: true }).sort({ name: 1 }); // Por defecto solo activos
    res.json(spaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/spaces/all (incluyendo inactivos)
// @desc    Obtener todos los espacios (incluyendo inactivos)
// @access  Private (Director, Admin)
router.get('/all', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  try {
    const spaces = await Space.find().sort({ name: 1 });
    res.json(spaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/spaces/:id
// @desc    Obtener un espacio por ID
// @access  Private (Autenticado)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ msg: 'Espacio no encontrado' });
    }
    // Opcional: if (!space.isActive && req.user.role !== 'admin' && req.user.role !== 'director') return res.status(404).json({ msg: 'Espacio no encontrado' });
    res.json(space);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Espacio no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/spaces/:id
// @desc    Actualizar un espacio
// @access  Private (Director, Admin)
router.put('/:id', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  const { name, capacity, description, isActive } = req.body;
  const spaceFields = {};
  if (name) spaceFields.name = name;
  if (capacity) spaceFields.capacity = capacity;
  if (description !== undefined) spaceFields.description = description;
  if (isActive !== undefined) spaceFields.isActive = isActive;

  try {
    let space = await Space.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ msg: 'Espacio no encontrado' });
    }

    // Verificar si el nuevo nombre ya existe en otro espacio
    if (name && name !== space.name) {
      const existingSpace = await Space.findOne({ name });
      if (existingSpace) {
        return res.status(400).json({ errors: [{ msg: 'Un espacio con este nombre ya existe.' }] });
      }
    }

    space = await Space.findByIdAndUpdate(
      req.params.id,
      { $set: spaceFields },
      { new: true, runValidators: true }
    );
    res.json(space);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Espacio no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE api/spaces/:id
// @desc    Eliminar un espacio (marcar como inactivo o eliminar, por ahora se elimina)
// @access  Private (Director, Admin)
// Considerar si se debe permitir eliminar si hay reservas asociadas. Por ahora se permite.
router.delete('/:id', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ msg: 'Espacio no encontrado' });
    }

    // Opcional: Verificar si hay reservas activas para este espacio antes de eliminar.
    // const activeReservations = await Reservation.find({ spaceId: req.params.id, status: { $in: ['pendiente', 'aprobada'] } });
    // if (activeReservations.length > 0) {
    //   return res.status(400).json({ msg: 'No se puede eliminar el espacio, tiene reservas activas o pendientes.' });
    // }

    await Space.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Espacio eliminado permanentemente' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Espacio no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
