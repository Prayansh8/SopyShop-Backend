const mongoose = require("mongoose");
const moment = require("moment");

const gtsUserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: moment.utc().toISOString() },
  updatedAt: { type: Date, default: moment.utc().toISOString() },
});
const User = mongoose.model("GtsUser", gtsUserSchema);
module.exports = User;
