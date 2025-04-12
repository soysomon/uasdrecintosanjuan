const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Modelo de Estados Financieros
const estadoFinancieroSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  pdfUrl: { type: String, required: true, trim: true },
  pdfPublicId: { type: String, trim: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });


const EstadoFinanciero = mongoose.model('EstadoFinanciero', estadoFinancieroSchema);


// Rutas
router.get('/', async (req, res) => {
  try {
    const items = await EstadoFinanciero.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error al obtener estados financieros:', err);
    res.status(500).json({ message: 'Error interno al obtener los estados financieros' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await EstadoFinanciero.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Estado financiero no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error interno al obtener el estado financiero' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newItem = new EstadoFinanciero(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear el estado financiero', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await EstadoFinanciero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Estado financiero no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar el estado financiero', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await EstadoFinanciero.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Estado financiero no encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el estado financiero' });
  }
});

module.exports = router;
