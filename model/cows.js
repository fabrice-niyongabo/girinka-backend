const mongoose = require("mongoose");

const cowSchema = new mongoose.Schema({
  cowNumber: { type: Number, unique: true, required: true },
  cowType: { type: String, required: true },
  registrationStatus: { type: String, required: true },
  isTransfered: { type: Boolean, required: true, default: false },
  isReceived: { type: Boolean, required: true, default: false },
  receivedBy: { type: String, required: true, default: "-" },
  isGiven: { type: Boolean, required: true, default: false },
  givenTo: { type: String, required: true, default: "-" },
  district: { type: String, required: true },
  province: { type: String, required: true },
  registrationKg: { type: String, required: true },
  supplierName: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
  cowStatus: { type: String, required: true, default: "Normal" },
});

module.exports = mongoose.model("cows", cowSchema);
