let liveData = {}; // 🔥 store OCR in memory

exports.updateOCR = (req, res) => {
  const { bedId, ocr } = req.body;

  liveData[bedId] = {
    ...ocr,
    updatedAt: new Date(),
  };

  res.json({ msg: "OCR updated" });
};

exports.getOCR = (req, res) => {
  res.json(liveData);
};