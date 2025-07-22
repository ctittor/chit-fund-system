const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const newCustomer = await prisma.customer.create({
      data: { name, email, phone }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read All Customers
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read One Customer by ID
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Customer by ID
router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone } = req.body;
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone }
    });
    res.json(updatedCustomer);
  } catch (error) {
    if (error.code === 'P2025') {  // Prisma error code: Record not found
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete Customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.customer.delete({ where: { id } });
    res.status(204).send();  // No Content on successful deletion
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
