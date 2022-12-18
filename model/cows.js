const mongoose = require("mongoose");

const cowSchema = new mongoose.Schema({
  cowNumber: { type: Number, unique: true, required: true },
  cowType: { type: String, required: true },
  registrationStatus: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  registrationKg: { type: String, required: true },
  supplierName: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("cows", cowSchema);
