const mongoose = require("mongoose");

const cowSchema = new mongoose.Schema({
  names: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  attachment: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("announcements", cowSchema);
