const Bed = require("../models/Bed");

// ✅ MUST export like this
const getBeds = async (req, res) => {
  try {
    let beds;

    if (req.user.role === "admin") {
      const hospital = req.query.hospital;

      if (hospital) {
        beds = await Bed.find({ hospital });
      } else {
        beds = await Bed.find();
      }
    } else {
      beds = await Bed.find({ hospital: req.user.hospital });
    }

    res.json(beds);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getBedById = async (req, res) => {
  const bed = await Bed.findById(req.params.id);
  res.json(bed);
};


const updateOCR = async (req, res) => {
  try {
    const { bedId, ocr } = req.body;

    await Bed.findByIdAndUpdate(bedId, {
      ocr: {
        ...ocr,
        updatedAt: new Date(),
      },
    });

    res.json({ msg: "OCR updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating OCR" });
  }
};

module.exports = {
  getBeds,
  getBedById,
  updateOCR
};