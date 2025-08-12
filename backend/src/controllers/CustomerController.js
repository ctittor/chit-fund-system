const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getEMIs = async (req, res) => {
  // Customer: see own EMI details
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || !user.customerId)
    return res.status(403).json({ error: "Only customers can access" });

  const emis = await prisma.emiDetail.findMany({
    where: { customerId: user.customerId },
    orderBy: { dueDate: 'desc' }
  });
  res.json(emis);
};

exports.getMyAuctions = async (req, res) => {
  // Customer: see own chit auctions
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { customer: { include: { subscriptions: true } } }
  });
  if (!user || !user.customer?.subscriptions.length)
    return res.json([]);

  const chitIds = user.customer.subscriptions.map(s => s.chitId);
  const auctions = await prisma.auction.findMany({
    where: { chitId: { in: chitIds } },
    include: { chit: true },
    orderBy: { auctionDate: 'desc' }
  });
  res.json(auctions.map(a => ({
    ...a,
    chitName: a.chit.name
  })));
};
