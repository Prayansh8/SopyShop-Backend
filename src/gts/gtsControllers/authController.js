const User = require("../gtsModels/gtsUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully", newUser });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign({ username: user.username }, "secret_key", {
      expiresIn: "4d",
    });
    return res.status(200).json({ token, message:"Login Success" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
