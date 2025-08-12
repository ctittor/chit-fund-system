const express = require("express");
const router = express.Router();
const BidController = require("../controllers/BidController");
const roleAccess = require("../middleware/roleAccess");

// Place bid (HTTP; for Socket.IO use socket handler)
router.post("/", roleAccess(["CUSTOMER"]), BidController.place);

// List bids in auction (for ADMIN)
router.get("/auction/:auctionId", roleAccess(["ADMIN", "SUPER_ADMIN"]), BidController.listForAuction);

module.exports = router;
