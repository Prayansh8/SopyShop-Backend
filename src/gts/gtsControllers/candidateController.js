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
  try {
    const { id } = req.params;
    const judgeId = req.userId; // Assuming userId is included in the request
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
