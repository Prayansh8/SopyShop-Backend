const mongoose = require("mongoose");
const moment = require("moment");
const crypto = require("crypto");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Plese Enter Your Name"],
    minLength: [4, "Name should have then 4 characters"],
    maxLength: [30, "Name cannot extract 30 characters"],
  },
  userName: {
    type: String,
    required: [true, "Plese Enter Your username"],
  },
  password: {
    type: String,
    required: [true, "Plese Enter Your Password"],
    minLength: [4, "password should have then 4 characters"],
    maxLength: [100, "password cannot extract 100 characters"],
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: { type: String },
  resetPasswordExplre: { type: Date },
  createdAt: { type: Date, default: moment.utc().toISOString() },
  updatedAt: { type: Date, default: moment.utc().toISOString() },
});

// genrating password forward method

UserSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set token expire time
  this.resetpasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
