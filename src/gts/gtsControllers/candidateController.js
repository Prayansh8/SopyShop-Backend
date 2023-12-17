const GtsCandidate = require("../gtsModels/gtsCandidate");
exports.createCandidate = async (req, res) => {
  const nextCandidateId = await getNextCandidateId();
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
      candidateId: nextCandidateId,
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
  const candidateId = req.params;

  try {
    const candidate = await GtsCandidate.findOne({
      candidateId: toString(candidateId),
    });
    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    res.json({ success: true, candidate });
  } catch (error) {
    console.error("Error fetching candidate:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateCandidate = async (req, res) => {
  const { candidateId } = req.params;
  const updatedFields = req.body;

  const candidateIndex = GtsCandidate.findIndex(
    (candidate) => candidate.candidateId == candidateId
  );

  if (candidateIndex !== -1) {
    GtsCandidate[candidateIndex] = {
      ...GtsCandidate[candidateIndex],
      ...updatedFields,
    };
    res.json({ success: true, message: "Candidate updated successfully" });
  } else {
    res.status(404).json({ success: false, message: "Candidate not found" });
  }
};

exports.newScore = async (req, res) => {
  try {
    const judgeId = req.user;
    console.log(judgeId);
    const { candidateId, score } = req.body;
    console.log(candidateId, score);
    const candidate = await GtsCandidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const existingScore = candidate.scores.find((s) => s.judgeId === judgeId);
    if (existingScore) {
      existingScore.score = score;
    } else {
      candidate.scores.push({ judgeId, score });
    }
    candidate.updatedAt = new Date();
    await candidate.save();
    return res.status(200).json({ message: "Scores saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function getNextCandidateId() {
  try {
    const highestCandidate = await GtsCandidate.findOne({}, { candidateId: 1 })
      .sort({ candidateId: -1 })
      .exec();

    const nextCandidateId = highestCandidate
      ? parseInt(highestCandidate.candidateId) + 1
      : 1;

    return nextCandidateId.toString();
  } catch (error) {
    console.error("Error getting next candidateId:", error);
    throw error;
  }
}
