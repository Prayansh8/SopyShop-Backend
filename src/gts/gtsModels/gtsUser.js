const mongoose = require("mongoose");
const gtsUserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("GtsUser", gtsUserSchema);
module.exports = User;
