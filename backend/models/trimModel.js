const mongoose = require("mongoose");

const trimSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  previewImage: { type: String, required: true }, 
});

module.exports = mongoose.model("TrimModel", trimSchema);
