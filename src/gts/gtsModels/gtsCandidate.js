const mongoose = require("mongoose");
const moment = require("moment");

const gtsCandidateSchema = new mongoose.Schema({
  timestamp: { type: Number, default: new Date().getTime() },
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
  candidateId: { type: String },
  scores: [{ judgeId: String, score: { type: Number, default: 0, max: 10 } }],
  note: { type: String },
  status: {
    type: String,
  },
  createdAt: { type: Date, default: moment.utc().toISOString() },
  updatedAt: { type: Date, default: moment.utc().toISOString() },
});
const GtsCandidate = mongoose.model("GtsCandidate", gtsCandidateSchema);
module.exports = GtsCandidate;
