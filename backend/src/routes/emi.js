const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Record a new EMI payment
router.post('/', async (req, res) => {
  try {
    const { customerId, chitId, amount, status } = req.body;
    if (!customerId || !chitId || !amount) {
      return res.status(400).json({ error: 'customerId, chitId, and amount are required.' });
    }
    const payment = await prisma.emiPayment.create({
      data: {
        customerId,
        chitId,
        amount,
        status: status || 'PENDING',
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all EMI payments of a customer
router.get('/customer/:id', async (req, res) => {
  const customerId = Number(req.params.id);
  try {
    const payments = await prisma.emiPayment.findMany({
      where: { customerId },
      orderBy: { paymentDate: 'desc' },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update EMI payment status by ID
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status field is required.' });
  try {
    const updated = await prisma.emiPayment.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'EMI payment not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
