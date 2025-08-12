const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// List bids for auction (admin)
exports.listForAuction = async (req, res) => {
  const auctionId = Number(req.params.auctionId);
  const bids = await prisma.bid.findMany({
    where: { auctionId },
    include: { customer: true },
    orderBy: { amount: "desc" }
  });
  res.json(bids);
};

// Place bid (used for HTTP POST, though Socket.IO is preferred)
exports.place = async (req, res) => {
  const { auctionId, amount } = req.body;
  const customerId = req.user.customerId;
  if (!auctionId || !amount || !customerId) return res.status(400).json({ error: "Missing required data" });

  // Optionally, add auction live window and anti-cheat logic here

  const bid = await prisma.bid.create({ data: { auctionId, customerId, amount: Number(amount) } });
  res.status(201).json(bid);
};
