const express = require("express");
const router = express.Router();
const SuperAdminController = require("../controllers/SuperAdminController");

// All users (list)
router.get("/users", SuperAdminController.listUsers);

// Create new admin/superadmin
router.post("/admins", SuperAdminController.createAdmin);

module.exports = router;
