const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a subscription (customer to chit)
router.post('/', async (req, res) => {
  try {
    const { customerId, chitId, startDate } = req.body;
    if (!customerId || !chitId || !startDate) {
      return res.status(400).json({ error: 'customerId, chitId, and startDate are required' });
    }
    const subscription = await prisma.subscription.create({
      data: {
        customerId,
        chitId,
        startDate: new Date(startDate),
        status: 'ACTIVE',
      },
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subscriptions for a customer
router.get('/customer/:id', async (req, res) => {
  const customerId = Number(req.params.id);
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { customerId },
      include: { chit: true },
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subscriptions for a chit scheme
router.get('/chit/:id', async (req, res) => {
  const chitId = Number(req.params.id);
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { chitId },
      include: { customer: true },
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subscription status (e.g., cancel)
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }
  try {
    const updated = await prisma.subscription.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Subscription not found' });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
