const { db } = require("../databases/index");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const bcrypt = require("bcrypt");

// Helper function to validate request data
const validateUserData = (data) => {
  const { firstName, lastName, email, phone, dob, password } = data;

  if (!firstName || firstName.length < 2 || firstName.length > 30) {
    return "First name should have more than 2 and less than 30 characters.";
  }

  if (!lastName || lastName.length < 2 || lastName.length > 30) {
    return "Last name should have more than 2 and less than 30 characters.";
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!email || !emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  const phoneRegex = /^\d{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return "Please enter a valid phone number.";
  }

  if (!dob || isNaN(new Date(dob).getTime())) {
    return "Please enter a valid date of birth.";
  }

  if (!password || password.length < 4 || password.length > 100) {
    return "Password should have more than 4 and less than 100 characters.";
  }

  return null;
};

// User registration (sign up)
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dob, password } = req.body;
    const validationError = validateUserData(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Check if user already exists
    const existingUser = await db.user.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "email or phone number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new db.user({
      firstName,
      lastName,
      email,
      phone,
      dob,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// User login (sign in)
const signIn = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // Validate user data
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Please enter both identifier and password." });
    }
    // Check if user exists (search by phone, email)
    const user = await db.user.findOne({
      $or: [
        { phone: identifier },
        { email: identifier },
      ]
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid identifier or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid identifier or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      config.jwt.jwtSecretKey
    );

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports = { signUp, signIn };
