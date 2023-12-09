const mongoose = require("mongoose");
const candidateSchema = new mongoose.Schema({
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
const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
