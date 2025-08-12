const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// List all users (admin, super admin, customer)
exports.listUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });
  res.json(users);
};

// Create an admin user
exports.createAdmin = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: "All fields required" });

  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, role } });
  res.status(201).json(user);
};
