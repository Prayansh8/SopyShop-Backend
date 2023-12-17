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
  const { candidateId, judgeId, scoreValue } = req.body;

  try {
    const candidate = await GtsCandidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const existingScoreIndex = candidate.scores.findIndex(
      (s) => s.judgeId === judgeId
    );

    if (existingScoreIndex !== -1) {
      candidate.scores[existingScoreIndex].score = scoreValue;
    } else {
      candidate.scores.push({ judgeId, score: scoreValue });
    }

    const updatedCandidate = await candidate.save();

    return res.json(updatedCandidate);
  } catch (error) {
    console.error("Error creating/updating candidate score:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
