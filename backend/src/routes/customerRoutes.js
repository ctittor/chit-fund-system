const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController");

// Auth required - for CUSTOMER role (enforced in middleware/roleAccess.js if desired)
router.get("/emi/my", CustomerController.getEMIs);
router.get("/auctions/my", CustomerController.getMyAuctions);

module.exports = router;
