const mongoose = require("mongoose");

const cowSchema = new mongoose.Schema({
  cowId: { type: Number, unique: true, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  sector: { type: String, required: true },
  isTransfered: { type: Boolean, required: true, default: false },
  isReceived: { type: Boolean, required: true, default: false },
  receivedBy: { type: String, required: true, default: "-" },
  transferedTo: { type: String, required: true, default: "-" },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("cows", cowSchema);
