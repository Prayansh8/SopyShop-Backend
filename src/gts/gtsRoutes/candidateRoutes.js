const express = require("express");
const candidateController = require("../gtsControllers/candidateController");
const { authenticateToken } = require("../gtsMiddleware/verifyToken");

const router = express.Router();
router.post("/register", candidateController.createCandidate);
router.get("/all", candidateController.getAllCandidates);
router.get("/:id", candidateController.getCandidate);
router.patch("/update/:id", candidateController.updateCandidate);
router.post("/score/:id", authenticateToken, candidateController.newScore);
module.exports = router;
