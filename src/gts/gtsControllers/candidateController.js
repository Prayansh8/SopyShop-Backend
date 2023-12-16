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
  try {
    const candidate = await GtsCandidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (candidate) {
      return res.json(candidate);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.newScore = async (req, res) => {
  try {
    const { id } = req.params;
    const judgeId = req.user;
    console.log(judgeId);
    const { score } = req.body;

    const updatedCandidate = await GtsCandidate.findByIdAndUpdate(
      id,
      {
        $set: { "scores.$[elem].score": score },
      },
      {
        arrayFilters: [{ "elem.judgeId": judgeId }],
        new: true,
      }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
