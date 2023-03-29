const { db } = require("../databases/index");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const bcrypt = require("bcrypt");

const signUp = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  if (name === "") {
    return res.status(400).send({ detail: "first_name are required" });
  }

  if (username === "") {
    return res.status(400).send({ detail: "last_name are required" });
  }

  var ere =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!ere.test(email)) {
    return res
      .status(400)
      .send({ detail: "Please fill the email in email format" });
  }

  var re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,32}$/;
  if (!re.test(password)) {
    return res.status(400).send({
      detail:
        "password should Minimum 4 and maximum 32 characters, at least one uppercase letter, one lowercase letter, one number and one special character: are required",
    });
  }

  const existingUser = await db.user.findOne({ email: email });

  if (existingUser) {
    return res.status(400).send({ detail: "User email exist" });
  }

  const passHash = await bcrypt.hash(password, 10);

  const userData = {
    name,
    username,
    email,
    password: passHash,
  };

  try {
    const user = await db.user(userData);
    user.save();
    return res.status(201).send(user);
  } catch (error) {
    res.send("user not found!");
  }
};

const signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var ere =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!ere.test(email)) {
    return res.status(400).send({ detail: "Please fill email formate" });
  }

  var re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,32}$/;
  if (!re.test(password)) {
    return res.status(400).send({
      detail:
        "Minimum 6 and maximum 32 characters, at least one uppercase letter, one lowercase letter, one number and one special character:",
    });
  }

  const user = await db.user.findOne({ email: email });
  if (!user) {
    return res.status(404).send({ detail: "User not found" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send({ detail: "Invalid credentials" });
  }

  const userData = {
    // id: user._id,
    // name: user.name,
    // username: user.username,
    // email: user.email,
    user,
  };
  const token = jwt.sign(userData, config.jwt.jwtSecretKey);

  const option = {
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }; 
  return res
    .status(200)
    .cookie("token", token, option)
    .send({ detail: "Login success", token: token, userData: userData });
};


module.exports = {
  signUp,
  signIn,
};
