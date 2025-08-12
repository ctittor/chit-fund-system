const express = require("express");
const router = express.Router();
const EmiController = require("../controllers/EmiController");
const roleAccess = require("../middleware/roleAccess");

// ADMIN and SUPER_ADMIN: manage EMIs
router.get("/", roleAccess(["ADMIN", "SUPER_ADMIN"]), EmiController.listAll);
router.post("/", roleAccess(["ADMIN", "SUPER_ADMIN"]), EmiController.create);
router.put("/:id", roleAccess(["ADMIN", "SUPER_ADMIN"]), EmiController.update);
router.delete("/:id", roleAccess(["ADMIN", "SUPER_ADMIN"]), EmiController.delete);

// CUSTOMER: own EMIs handled in customerRoutes

module.exports = router;
