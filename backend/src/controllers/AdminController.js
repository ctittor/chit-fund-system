const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// List customers (with pagination and filter)
exports.customers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const q = req.query.q || '';
  const where = q
    ? { OR: [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } }
      ] }
    : {};
  const [customers, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy:{ id: "asc" }
    }),
    prisma.customer.count({ where })
  ]);
  res.json({ customers, totalPages: Math.ceil(total / pageSize) });
};

// Create customer
exports.createCustomer = async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Name and phone required" });
  try {
    const c = await prisma.customer.create({ data: { name, phone } });
    res.status(201).json(c);
  } catch {
    res.status(400).json({ error: "Create failed" });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.customer.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Update failed" });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.customer.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Delete failed" });
  }
};

// List chits for admin selection UIs
exports.chits = async (req, res) => {
  const chits = await prisma.chit.findMany({ orderBy: { name: "asc" } });
  res.json(chits);
};
