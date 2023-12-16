const Sponsor = require("../gtsModels/gtsSponsor");

exports.createSponsor = async (req, res) => {
  const { name, phone, address, shopName, amount, amountStatus, note } =
    req.body;
  try {
    const newsponsor = new Sponsor({
      name,
      phone,
      address,
      shopName,
      amount,
      amountStatus,
      note,
    });
    await newsponsor.save();
    res
      .status(201)
      .json({ message: "New Sponsor created successfully", newsponsor });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllSponsor = async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (sponsor) {
      res.json(sponsor);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (sponsor) {
      res.json(sponsor);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
