const { db } = require("../databases/index");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

const signUp = async (req, res, next) => {
  const myCloud = cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    height: 100,
    crop: "scale",
  });

  if (!myCloud) {
    return res.status(400).send({ detail: "avatar is not found" });
  }

  const { name, userName, email, password } = req.body;

  if (name === "") {
    return res.status(400).send({ detail: "first_name are required" });
  }

  if (userName === "") {
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
    userName,
    email,
    password: passHash,
    avatar: {
      public_id: (await myCloud).public_id,
      url: (await myCloud).secure_url,
    },
  };

  try {
    const user = await db.user(userData);
    user.save();
    return res.status(201).send(user);
  } catch (error) {
    res.send({ success: true, detail: "user not found!" });
  }
};

const signIn = async (req, res) => {
  try {
    const userEmail = req.body.email;

    const email = userEmail.toLowerCase();
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
      return res.status(404).send({ detail: "User not found email" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ detail: "Invalid credentials" });
    }

    const userData = {
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
      .send({ detail: "Login success", token: token, user});
  } catch (error) {
    return res.status(400).send({ detail: "Login unsuccessful" });
  }
};

module.exports = {
  signUp,
  signIn,
};
