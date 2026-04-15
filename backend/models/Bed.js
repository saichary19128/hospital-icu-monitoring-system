const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  bedNumber: Number,
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  patientName: String,

  status: {
    type: String,
    enum: ["critical", "monitoring", "stable"],
    default: "monitoring",
  },

  cameraStatus: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },

  streamUrl: String,

  ocr: {
    heartRate: Number,
    bp: String,
    spo2: Number,
    temp: Number,
    respiratoryRate: Number,
    updatedAt: Date,
  },
  hospital: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Bed", bedSchema);