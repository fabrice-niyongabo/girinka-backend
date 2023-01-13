const mongoose = require("mongoose");

const cowSchema = new mongoose.Schema({
  cowId: { type: String, required: true },
  candidateId: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  sector: { type: String, required: true },
  village: { type: String, required: true },
  description: { type: String, required: true },
  veterinaryName: { type: String, required: true },
  veterinaryPhone: { type: String, required: true },
  date: { type: String, required: true },
  cellApproval: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Approved", "rejected", "Pending"],
  },
  cellApprovalDescription: { type: String },
  sectorApproval: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Approved", "rejected", "Pending"],
  },
  sectorApprovalDescription: { type: String },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("sickCows", cowSchema);
