const express = require("express");
const authController = require("../gtsControllers/authController");
const router = express.Router();
router.post("/create-user", authController.register);
router.post("/login", authController.login);
router.get("/users", authController.getAllUsers);
router.get("/:id", authController.getUser);
router.patch("/update/:id", authController.updateUser);
module.exports = router;
