const mongoose = require("mongoose");

const candidatesSchema = new mongoose.Schema(
  {
    names: { type: String, required: true },
    idNo: {
      type: String,
      unique: true,
      required: true,
      minlength: 16,
      maxlength: 16,
    },
    ubudeheCategory: { type: String, required: true },
    phone: { type: String },
    martialStatus: { type: String, required: true },
    cowStatus: {
      type: String,
      required: true,
      default: "Waiting",
      enum: ["Given", "Waiting"],
    },
    assignedCow: { type: String, required: true, default: "-" },
    assignedCowStatus: { type: String, required: true, default: "Normal" },
    province: { type: String, required: true },
    district: { type: String, required: true },
    sector: { type: String, required: true },
    cell: { type: String, required: true },
    village: { type: String, required: true },
    villageApproval: {
      type: String,
      default: "Approved",
      required: true,
      enum: ["Approved", "Rejected", "Pending"],
    },
    villageApprovalDescription: { type: String },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("candidates", candidatesSchema);
