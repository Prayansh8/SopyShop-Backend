const express = require("express");
const sponsorController = require("../gtsControllers/sponsorController");

const router = express.Router();
router.post("/new", sponsorController.createSponsor);
router.get("/all", sponsorController.getAllSponsor);
router.get("/:id", sponsorController.getSponsor);
router.put("/update/:id", sponsorController.updateSponsor);
module.exports = router;
