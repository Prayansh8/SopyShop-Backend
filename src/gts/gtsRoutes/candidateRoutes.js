const express = require("express");
const candidateController = require("../gtsControllers/candidateController");
const router = express.Router();
router.post("/create", candidateController.createCandidate);
router.get("/all", candidateController.getAllCandidates);
router.get("/:id", candidateController.getCandidate);
router.put("/update/:id", candidateController.updateCandidate);
module.exports = router;
