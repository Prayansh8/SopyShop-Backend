const { db } = require("../databases/index");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const signUp = async (req, res, next) => {
  try {
    const { name, userName, password } = req.body;
    const userNamee = userName.toLowerCase();
    const existingUser = await db.user.findOne({ userName: userNamee });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "User username exist" });
    }
    const user = ({
      name,
      userName: userNamee,
      password,
    });
    const newUser = await db.user(user)
    newUser.save();
    return res.status(201).json({ success: true, newUser });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
const signIn = async (req, res) => {
  try {
    var userName = req.body.username;
    userName = userName.toLowerCase();
    const password = req.body.password;
    const user = await db.user.findOne({ username: userName });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "username not found!" });
    }
    const userPassword = await db.user.findOne({ username: userName, password: password });
    if (!userPassword) {
      return res
        .status(404)
        .send({ success: false, message: "Password not found!" });
    }
    const userData = {
      user,
    };
    const token = jwt.sign(userData, config.jwt.jwtSecretKey);
    return res.status(200).header("token", token).json({
      success: true,
      message: "Login success",
      token: token,
      user: userData,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Login unsuccessful", error });
  }
};

module.exports = {
  signUp,
  signIn,
};
