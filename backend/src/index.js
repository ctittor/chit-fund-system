const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import routers from previous steps
const customersRouter = require('./routes/customers');
const emiRouter = require('./routes/emi');
const auctionRouter = require('./routes/auction');
const chitRouter = require('./routes/chit');
const subscriptionRouter = require('./routes/subscription');

// Mount routes
app.use('/api/customers', customersRouter);
app.use('/api/emi', emiRouter);
app.use('/api/auction', auctionRouter);
app.use('/api/chit', chitRouter);
app.use('/api/subscription', subscriptionRouter);

// Health check root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Chit Fund API Running' });
});

// --- Socket.IO Setup ---
const initAuctionSocket = require('./sockets/auctionSocket');
initAuctionSocket(server);

// Start server with Socket.IO support
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});