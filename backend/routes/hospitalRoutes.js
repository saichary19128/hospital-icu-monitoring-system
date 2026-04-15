const express = require("express");
const router = express.Router();

const {
  createHospital,
  getHospitals,
} = require("../controllers/hospitalController");

const protect = require("../middlewares/authMiddleware");

// 🔐 Only logged-in users
router.get("/", protect, getHospitals);
router.post("/", protect, createHospital);

module.exports = router;