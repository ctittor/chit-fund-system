const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const EmiController = require("../controllers/EmiController");
const AuctionController = require("../controllers/AuctionController");

// Customer management
router.get("/customers", AdminController.customers);
router.post("/customers", AdminController.createCustomer);
router.put("/customers/:id", AdminController.updateCustomer);
router.delete("/customers/:id", AdminController.deleteCustomer);

// Chit management
router.get("/chits", AdminController.chits); // List all chits

// Auctions (reuse AuctionController)
router.get("/auctions", AuctionController.list);
router.post("/auctions", AuctionController.create);
router.put("/auctions/:id", AuctionController.update);
router.delete("/auctions/:id", AuctionController.delete);

// EMI (reuse EmiController)
router.get("/emis", EmiController.listAll);
router.post("/emis", EmiController.create);
router.put("/emis/:id", EmiController.update);
router.delete("/emis/:id", EmiController.delete);

// Auctions CRUD
router.get("/auctions", async (req,res) => { /* Pagination, return { auctions:[], totalPages } */ });
router.post("/auctions", async (req,res) => { /* Create auction */ });
router.put("/auctions/:id", async (req,res) => { /* Edit auction */ });
router.delete("/auctions/:id", async (req,res) => { /* Delete auction */ });

// EMI CRUD
router.get("/emis", async (req,res) => { /* Pagination { emis:[], totalPages } */ });
router.post("/emis", async (req,res) => { /* Add EMI */ });
router.put("/emis/:id", async (req,res) => { /* Edit EMI */ });
router.delete("/emis/:id", async (req,res) => { /* Delete EMI */ });

// Past auctions list for analytics/stats
router.get("/past-auctions", async (req, res) => {
  // Example: List completed auctions with winning bid info
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  const auctions = await prisma.auction.findMany({
    where: { status: "COMPLETED" },
    include: {
      chit: true,
      bids: {
        orderBy: { amount: "desc" }, // assuming highest is winner
        take: 1,
        include: { customer: true }
      }
    }
  });
  res.json(
    auctions.map(a => ({
      id: a.id,
      chitName: a.chit.name,
      auctionDate: a.auctionDate,
      status: a.status,
      winningAmount: a.bids[0]?.amount ?? null,
      winnerName: a.bids[0]?.customer?.name ?? null,
      bidCount: a.bids.length
    }))
  );
});

module.exports = router;
