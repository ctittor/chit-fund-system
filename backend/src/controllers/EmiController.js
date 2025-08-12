const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// List all EMIs, paginated (for admin)
exports.listAll = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const emis = await prisma.emiDetail.findMany({
    skip: (page-1)*pageSize,
    take: pageSize,
    include: { customer: true, chit: true },
    orderBy: { dueDate: "desc" }
  });
  const total = await prisma.emiDetail.count();
  res.json({ emis, totalPages: Math.ceil(total/pageSize) });
};

// Create EMI
exports.create = async (req, res) => {
  const { customerId, chitId, amount, dueDate, status } = req.body;
  if (!customerId || !chitId || !amount || !dueDate) return res.status(400).json({ error: "All fields required" });
  const emi = await prisma.emiDetail.create({ data: { customerId, chitId, amount: Number(amount), dueDate: new Date(dueDate), status } });
  res.status(201).json(emi);
};

// Update EMI
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const updated = await prisma.emiDetail.update({ where: { id }, data });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "EMI update failed" });
  }
};

// Delete EMI
exports.delete = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.emiDetail.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Delete failed" });
  }
};
