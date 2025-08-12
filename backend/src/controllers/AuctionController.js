const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// List auctions (with chit & pagination)
exports.list = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const auctions = await prisma.auction.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { chit: true },
    orderBy: { auctionDate: "desc" }
  });
  const total = await prisma.auction.count();
  res.json({ auctions, totalPages: Math.ceil(total / pageSize) });
};

// Create auction
exports.create = async (req, res) => {
  const { chitId, auctionDate, status } = req.body;
  if (!chitId || !auctionDate) return res.status(400).json({ error: "Chit and date required" });
  try {
    const auction = await prisma.auction.create({
      data: {
        chitId: Number(chitId),
        auctionDate: new Date(auctionDate),
        status: status || "SCHEDULED"
      }
    });
    res.status(201).json(auction);
  } catch (e) {
    res.status(400).json({ error: "Create failed" });
  }
};

// Update auction
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.auction.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Update failed" });
  }
};

// Delete auction
exports.delete = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.auction.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Delete failed" });
  }
};

// Get single auction
exports.get = async (req, res) => {
  const auction = await prisma.auction.findUnique({
    where: { id: Number(req.params.id) },
    include: { bids: { include:{ customer:true } }, chit:true },
  });
  if (!auction) return res.status(404).json({ error: "Not found" });
  res.json(auction);
};
