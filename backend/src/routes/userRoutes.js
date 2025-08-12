const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Auth required
router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);

module.exports = router;
