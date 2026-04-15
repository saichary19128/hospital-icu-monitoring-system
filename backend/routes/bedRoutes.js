const express = require("express");
const router = express.Router();

const {
  getBeds,
  getBedById,
  updateOCR,
} = require("../controllers/bedController");

const protect = require("../middlewares/authMiddleware");

router.post("/ocr", updateOCR);
router.get("/", protect, getBeds);
router.get("/:id", protect, getBedById);

module.exports = router;