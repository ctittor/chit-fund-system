const express = require("express");
const router = express.Router();
const AuctionController = require("../controllers/AuctionController");
const roleAccess = require("../middleware/roleAccess");

// All authenticated: view list, get detail
router.get("/", AuctionController.list);
router.get("/:id", AuctionController.get);

// Live auctions for customers
router.get("/live", AuctionController.list); // Optionally filter by live status

// Admin CRUD
router.post("/", roleAccess(["ADMIN", "SUPER_ADMIN"]), AuctionController.create);
router.put("/:id", roleAccess(["ADMIN", "SUPER_ADMIN"]), AuctionController.update);
router.delete("/:id", roleAccess(["ADMIN", "SUPER_ADMIN"]), AuctionController.delete);

module.exports = router;
