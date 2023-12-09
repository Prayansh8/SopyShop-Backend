const mongoose = require("mongoose");
const gtsCandidateSchema = new mongoose.Schema({
  timestamp: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  performance: {
    type: String,
    required: true,
  },
  currentLocation: {
    type: String,
    required: true,
  },
  socialLinks: {
    type: String,
  },
  heardAboutUs: {
    type: String,
  },
});
const GtsCandidate = mongoose.model("GtsCandidate", gtsCandidateSchema);
module.exports = GtsCandidate;
