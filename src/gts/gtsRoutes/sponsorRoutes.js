const express = require("express");
const sponsorController = require("../gtsControllers/sponsorController");
const { verifyToken } = require("../gtsMiddleware/verifyToken");
const router = express.Router();
router.post("/new", verifyToken, sponsorController.createSponsor);
router.get("/all", verifyToken, sponsorController.getAllSponsor);
router.get("/:id", verifyToken, sponsorController.getSponsor);
router.put("/update/:id", verifyToken, sponsorController.updateSponsor);
module.exports = router;
