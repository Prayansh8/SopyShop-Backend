const express = require("express");
const sponsorController = require("../gtsControllers/sponsorController");

const router = express.Router();
router.post("/new", sponsorController.createSponsor);
router.get("/all", sponsorController.getAllSponsor);
router.get("/sponsor", sponsorController.getSponsor);
router.put("/update", sponsorController.updateSponsor);
module.exports = router;
