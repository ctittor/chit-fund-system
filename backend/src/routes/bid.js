const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all bids in a particular auction
router.get('/auction/:auctionId', async (req, res) => {
  const auctionId = Number(req.params.auctionId);
  try {
    const bids = await prisma.bid.findMany({
      where: { auctionId },
      include: {
        customer: true,  // Provide customer info for context
      },
      orderBy: {
        bidTime: 'asc',
      },
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bids placed by a given customer
router.get('/customer/:customerId', async (req, res) => {
  const customerId = Number(req.params.customerId);
  try {
    const bids = await prisma.bid.findMany({
      where: { customerId },
      include: {
        auction: true,   // Include auction info for reference
      },
      orderBy: {
        bidTime: 'desc',
      },
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optional: Get all bids (admin use, large data volumes - include pagination/filtering)
router.get('/', async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const bids = await prisma.bid.findMany({
      skip: Number(skip),
      take: Number(limit),
      include: {
        auction: true,
        customer: true,
      },
      orderBy: {
        bidTime: 'desc',
      },
    });
    const total = await prisma.bid.count();
    res.json({ total, page: Number(page), limit: Number(limit), bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
