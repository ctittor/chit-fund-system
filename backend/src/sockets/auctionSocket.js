const { Server } = require('socket.io');
const prisma = require('../prisma/client'); // Your PrismaClient instance

function initAuctionSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', 
      methods: ["GET", "POST"]
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join auction room
    socket.on('join-auction', (auctionId) => {
      socket.join(`auction_${auctionId}`);
      console.log(`Socket ${socket.id} joined room auction_${auctionId}`);
    });

    // Place a bid
    socket.on('place-bid', async (data) => {
      const { auctionId, customerId, amount } = data;
      // Validate bid logic here...

      // Save bid to DB
      try {
        const bid = await prisma.bid.create({
          data: {
            auctionId,
            customerId,
            amount,
          },
        });
        // Broadcast to room
        io.to(`auction_${auctionId}`).emit('new-bid', bid);
      } catch (e) {
        socket.emit('bid-error', { message: e.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initAuctionSocket;
