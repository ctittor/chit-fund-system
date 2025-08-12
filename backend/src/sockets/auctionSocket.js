const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-auction", ({ auctionId, customerId }) => {
      socket.join(`auction_${auctionId}`);
      socket.emit("joined", { auctionId });
    });

    socket.on("place-bid", async ({ auctionId, customerId, amount }) => {
      const bid = await prisma.bid.create({
        data: { auctionId, customerId, amount }
      });
      io.to(`auction_${auctionId}`).emit("new-bid", bid);
    });

    socket.on("disconnect", () => {});
  });
};
