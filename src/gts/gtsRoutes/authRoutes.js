const express = require("express");
const authController = require("../gtsControllers/authController");
const router = express.Router();
router.post("/create-user", authController.register);
router.post("/login", authController.login);
router.post("/users", authController.getAllUsers);
router.post("/:id", authController.getUser);
router.post("/update/:id", authController.updateUser);
module.exports = router;
