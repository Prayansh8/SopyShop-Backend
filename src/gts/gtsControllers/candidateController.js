const GtsCandidate = require("../gtsModels/gtsCandidate");
const { Types } = require("mongoose");

exports.createCandidate = async (req, res) => {
  const {
    name,
    phoneNumber,
    performance,
    currentLocation,
    socialLinks,
    heardAboutUs,
    note,
  } = req.body;
  try {
    const newCandidate = new GtsCandidate({
      name,
      phoneNumber,
      performance,
      currentLocation,
      socialLinks,
      heardAboutUs,
      note,
    });
    await newCandidate.save();
    return res.status(201).json({ message: "Candidate created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await GtsCandidate.find();
    return res.json(candidates);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCandidate = async (req, res) => {
  try {
    const candidate = await GtsCandidate.findById(req.params.id);
    if (candidate) {
      return res.json(candidate);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCandidate = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  console.log(id, updateData);
  try {
    const candidate = await GtsCandidate.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!candidate) {
      return res.status(404).json({ message: "GtsCandidate not found" });
    }

    return res.json(candidate);
  } catch (error) {
    console.error("Error updating GtsCandidate:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.newScore = async (req, res) => {
  try {
    const Id = req.params;
    const { score } = req.body;
    const judgeId = req.userId;

    const objectIdCandidateId = Types.ObjectId(Id);

    const gtsCandidate = await GtsCandidate.findOne({
      _id: objectIdCandidateId,
    });

    if (!gtsCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    gtsCandidate.scores.push({ judgeId, score });

    await gtsCandidate.save();

    return res
      .status(200)
      .json({ message: "Score saved successfully", gtsCandidate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
