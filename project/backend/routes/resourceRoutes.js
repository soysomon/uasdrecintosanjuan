const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { authMiddleware } = require('../auth/authMiddleware');
const { roleMiddleware } = require('../auth/roleMiddleware');

// @route   POST api/resources
// @desc    Crear un nuevo recurso
// @access  Private (Director, Admin)
router.post('/', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  const { name, description, isAvailable } = req.body;
  try {
    let resource = await Resource.findOne({ name });
    if (resource) {
      return res.status(400).json({ errors: [{ msg: 'Un recurso con este nombre ya existe.' }] });
    }
    resource = new Resource({ name, description, isAvailable });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/resources
// @desc    Obtener todos los recursos
// @access  Private (Autenticado)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find({ isAvailable: true }).sort({ name: 1 }); // Por defecto solo disponibles
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/resources/all (incluyendo no disponibles)
// @desc    Obtener todos los recursos (incluyendo no disponibles)
// @access  Private (Director, Admin)
router.get('/all', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  try {
    const resources = await Resource.find().sort({ name: 1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/resources/:id
// @desc    Obtener un recurso por ID
// @access  Private (Autenticado)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ msg: 'Recurso no encontrado' });
    }
    // Opcional: if (!resource.isAvailable && req.user.role !== 'admin' && req.user.role !== 'director') return res.status(404).json({ msg: 'Recurso no encontrado' });
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recurso no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/resources/:id
// @desc    Actualizar un recurso
// @access  Private (Director, Admin)
router.put('/:id', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  const { name, description, isAvailable } = req.body;
  const resourceFields = {};
  if (name) resourceFields.name = name;
  if (description !== undefined) resourceFields.description = description;
  if (isAvailable !== undefined) resourceFields.isAvailable = isAvailable;

  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ msg: 'Recurso no encontrado' });
    }

    // Verificar si el nuevo nombre ya existe en otro recurso
    if (name && name !== resource.name) {
      const existingResource = await Resource.findOne({ name });
      if (existingResource) {
        return res.status(400).json({ errors: [{ msg: 'Un recurso con este nombre ya existe.' }] });
      }
    }

    resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: resourceFields },
      { new: true, runValidators: true }
    );
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recurso no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE api/resources/:id
// @desc    Eliminar un recurso
// @access  Private (Director, Admin)
// Considerar si se debe permitir eliminar si está asociado a reservas activas. Por ahora se permite.
router.delete('/:id', [authMiddleware, roleMiddleware(['director', 'admin'])], async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ msg: 'Recurso no encontrado' });
    }

    // Opcional: Verificar si este recurso está en uso en alguna reserva activa.
    // const activeReservations = await Reservation.find({ requestedResources: req.params.id, status: { $in: ['pendiente', 'aprobada'] } });
    // if (activeReservations.length > 0) {
    //   return res.status(400).json({ msg: 'No se puede eliminar el recurso, está en uso en reservas activas o pendientes.' });
    // }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Recurso eliminado permanentemente' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recurso no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
