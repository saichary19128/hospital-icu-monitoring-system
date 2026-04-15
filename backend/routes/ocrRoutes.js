const express = require("express");
const router = express.Router();

const { updateOCR, getOCR } = require("../controllers/ocrController");

router.post("/ocr", updateOCR); // Python sends
router.get("/ocr", getOCR);     // React fetches

module.exports = router;