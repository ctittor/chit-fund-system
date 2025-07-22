const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new chit scheme
router.post('/', async (req, res) => {
  try {
    const { name, chitValue, duration, installment } = req.body;
    if (!name || !chitValue || !duration || !installment) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const chit = await prisma.chit.create({
      data: { name, chitValue, duration, installment }
    });
    res.status(201).json(chit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all chit schemes
router.get('/', async (req, res) => {
  try {
    const chits = await prisma.chit.findMany();
    res.json(chits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chit scheme by ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const chit = await prisma.chit.findUnique({ where: { id } });
    if (!chit) return res.status(404).json({ error: 'Chit not found' });
    res.json(chit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update chit scheme by ID
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, chitValue, duration, installment } = req.body;
  try {
    const chit = await prisma.chit.update({
      where: { id },
      data: { name, chitValue, duration, installment }
    });
    res.json(chit);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Chit not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete chit scheme by ID
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.chit.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Chit not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
