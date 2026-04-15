const Hospital = require("../models/Hospital");

// ➕ Add hospital
const createHospital = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Hospital.findOne({ name });
    if (exists) {
      return res.status(400).json({ msg: "Hospital already exists" });
    }

    const hospital = await Hospital.create({ name });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📋 Get all hospitals
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createHospital,
  getHospitals,
};