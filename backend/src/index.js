require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authenticateUser = require("./middleware/authenticateUser");
const roleAccess = require("./middleware/roleAccess");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// API routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const emiRoutes = require("./routes/emiRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/emi", authenticateUser, emiRoutes);
app.use("/api/bids", authenticateUser, bidRoutes);
app.use("/api/auctions", authenticateUser, auctionRoutes);
app.use("/api/user", authenticateUser, userRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/admin", authenticateUser, roleAccess(["ADMIN", "SUPER_ADMIN"]), adminRoutes);
app.use("/api/super-admin", authenticateUser, roleAccess(["SUPER_ADMIN"]), superAdminRoutes);

// Socket.IO live auction
require("./sockets/auctionSocket")(io);

app.get("/", (req, res) => res.send("ChitFund Backend Ready!"));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
