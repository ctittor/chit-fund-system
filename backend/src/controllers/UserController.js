const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  let user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { customer: true }
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    id: user.id,
    email: user.email,
    name: user.customer?.name || "",
    phone: user.customer?.phone || ""
  });
};

exports.updateProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Name and phone are required" });

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.role !== "CUSTOMER") return res.status(403).json({ error: "Only customers can update profile" });

  const updatedCustomer = await prisma.customer.update({
    where: { id: user.customerId },
    data: { name, phone }
  });
  res.json(updatedCustomer);
};
