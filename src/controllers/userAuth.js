const { db } = require("../databases/index");
const catchAsyncErrors = require("../middlewere/catchAsyncErrors");
const { sendMailler } = require("../utills/sendMailler");
const crypto = require("crypto");
const getUsers = async (req, res) => {
  const data = await db.user.find({}, { name: 1, userName: 1, email: 1 });
  return res.send(data);
};

const getUser = async (req, res) => {
  const userId = req.params._id;
  const data = await db.user.findOne(userId, {
    name: 1,
    userName: 1,
    email: 1,
  });
  return res.send(data);
};

const updateUser = async (req, res) => {
  const userId = req.params._id;
  if (req.user._id != userId) {
    return res.send("user are unothorised");
  }
  const data = await db.user.findByIdAndUpdate(
    { userId },
    { name: 1, userName: 1, email: 1 }
  );
  return res.send(data);
};

const deleteUser = async (req, res) => {
  const userId = req.params._id;
  if (req.user._id != userId) {
    return res.send("user are unothorised");
  }
  const data = await db.user.findByIdAndDelete(userId);
  return res.send({ detail: "User Deleted" });
};

// logOut user
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({ success: true, massage: "Logged Out User" });
});

const forwordPassword = catchAsyncErrors(async (req, res, next) => {
  const findUser = await db.user.findOne({ email: req.body.email });
  if (!findUser) {
    return next(res.status(404).send("user not found"));
  }

  // get Reset Password Token

  const resetToken = findUser.getResetPasswordToken();

  await findUser.save({ validateBeforeSave: false });

  //Create reset password url
  const resetUrl = `http://localhost:5000/api/v1/reset/password/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email, then please ignore.`;

  try {
    await sendMailler({
      email: findUser.email,
      subject: "Ecommerce Password Recovery",
      message,
    });
    return res.status(200).send({
      success: true,
      massage: `Email sent to ${findUser.email}} successfully ${resetUrl}`,
    });
  } catch (error) {
    findUser.resetPasswordToken = undefined;
    findUser.resetPasswordExplre = undefined;

    await findUser.save({ validateBeforeSave: false });
    return next(
      res.status(500).send("email not send " + error.massage + error)
    );
  }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await db.user.findOne({
    resetPasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      res
        .status(404)
        .send("reset password token is invalid or has been expired" + user)
    );
  }

  if (req.body.password !== req.body.comfirmPassword) {
    return next(res.status(404).send("Password dose not match"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExplre = undefined;

  await user.save();
  return next(res.status(200).send(res + user));
});

module.exports = {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  logoutUser,
  forwordPassword,
  resetPassword,
};
