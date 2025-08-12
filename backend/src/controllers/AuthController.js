const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login for all roles
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } }
  });
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid email or password" });

  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

  res.json({ token, role: user.role });
};

// Customer registration with chit ID
exports.register = async (req, res) => {
  const { name, email, phone, chitId, password } = req.body;
  if (!name || !email || !phone || !chitId || !password) return res.status(400).json({ error: "All fields required" });

  const chit = await prisma.chit.findUnique({ where: { id: Number(chitId) }});
  if (!chit) return res.status(404).json({ error: "Invalid chit ID" });

  const exist = await prisma.user.findFirst({ where: { email } });
  if (exist) return res.status(409).json({ error: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);

  const customer = await prisma.customer.create({
    data: { name, phone }
  });
  await prisma.user.create({
    data: {
      email,
      password: hash,
      role: "CUSTOMER",
      customerId: customer.id
    }
  });
  await prisma.subscription.create({
    data: {
      customerId: customer.id,
      chitId: chit.id,
      startDate: new Date(),
      status: "ACTIVE"
    }
  });
  res.json({ success: true, message: "Registration successful" });
};
