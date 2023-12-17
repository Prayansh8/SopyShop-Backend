const GtsCandidate = require("../gtsModels/gtsCandidate");
exports.createCandidate = async (req, res) => {
  const { name, category, phone, address } = req.body;
  try {
    const newCandidate = new GtsCandidate({ name, category, phone, address });
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
  const { candidateId, score } = req.body;
  const judgeId = "65745dc3c655fd6e36a65334";
  try {
    const gtsCandidate = await GtsCandidate.findOne({ candidateId });

    if (!gtsCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Check if the judgeId already exists
    const existingScoreIndex = gtsCandidate.scores.findIndex(
      (s) => s.judgeId === judgeId
    );

    if (existingScoreIndex !== -1) {
      // If judgeId exists, update the score
      gtsCandidate.scores[existingScoreIndex].score = score;
    } else {
      // If judgeId doesn't exist, add a new score
      gtsCandidate.scores.push({ judgeId, score });
    }

    // Save the updated GtsCandidate
    await gtsCandidate.save();

    return res
      .status(200)
      .json({ message: "Score saved successfully", gtsCandidate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
