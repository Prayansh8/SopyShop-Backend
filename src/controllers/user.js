const { db } = require("../databases/index");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const bcrypt = require("bcrypt");

const signUp = async (req, res, next) => {
  const { name, userName, password } = req.body;
  const existingUser = await db.user.findOne({ userName: userName });

  if (existingUser) {
    return res
      .status(400)
      .send({ success: false, message: "User email exist" });
  }

  const userNamee = userName.toLowerCase();
  const user = ({
    name,
    username: userNamee,
    password,
  });

  try {
    const newUser = await db.user(user)
    newUser.save();
    return res.status(201).json({ success: true, newUser });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const userEmail = req.body.email;

    const email = userEmail.toLowerCase();
    const password = req.body.password;

    const user = await db.user.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Email not found!" });
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
