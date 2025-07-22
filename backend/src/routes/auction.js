const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create/schedule new auction (Admin only)
router.post('/', async (req, res) => {
  try {
    const { chitId, auctionDate } = req.body;
    if (!chitId || !auctionDate) {
      return res.status(400).json({ error: 'chitId and auctionDate are required' });
    }
    const newAuction = await prisma.auction.create({
      data: {
        chitId,
        auctionDate: new Date(auctionDate),
        status: 'SCHEDULED',
      },
    });
    res.status(201).json(newAuction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all auctions with their chit details and bids
router.get('/', async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: { chit: true, bids: true },
      orderBy: { auctionDate: 'desc' },
    });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get details of one auction by ID with all bids
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { bids: { orderBy: { bidTime: 'asc' } }, chit: true },
    });

    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all live auctions
router.get('/live', async (req, res) => {
  try {
    const liveAuctions = await prisma.auction.findMany({
      where: { status: 'LIVE' },
      include: { chit: true },
    });
    res.json(liveAuctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
