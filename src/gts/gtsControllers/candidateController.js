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
  const { candidateId, scoreValue } = req.body;
  const judgeId = "65745dc3c655fd6e36a65334";
  try {
    const gtsCandidate = await GtsCandidate.findOne({ candidateId });

    if (!gtsCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const existingScore = gtsCandidate.scores.find(
      (s) => s.judgeId === judgeId
    );

    if (existingScore) {
      existingScore.score = score;
    } else {
      gtsCandidate.scores.push({ judgeId, score });
    }

    await gtsCandidate.save();

    return res
      .status(200)
      .json({ message: "Score saved successfully", gtsCandidate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
