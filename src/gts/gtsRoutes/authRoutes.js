const express = require("express");
const authController = require("../gtsControllers/authController");
const router = express.Router();
router.post("/create-user", authController.register);
router.post("/login", authController.login);
module.exports = router;
