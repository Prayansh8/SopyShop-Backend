const express = require("express");
const candidateController = require("../controllers/candidateController");
const router = express.Router();
router.post("/create", candidateController.createCandidate);
router.get("/all", candidateController.getAllCandidates);
router.get("/candidate", candidateController.getCandidate);
router.put("/update", candidateController.updateCandidate);
module.exports = router;
