const mongoose = require("mongoose");
const moment = require("moment");

const gtsSponsor = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: moment.utc().toISOString() },
  updatedAt: { type: Date, default: moment.utc().toISOString() },
});
const Sponsor = mongoose.model("GtsSponsor", gtsSponsor);
module.exports = Sponsor;
