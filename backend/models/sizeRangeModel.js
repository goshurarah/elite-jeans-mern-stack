const mongoose = require("mongoose");
const rangeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sizes: { type: Map, of: String },
  Pom_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PointOfMeasure",
    required: true
  }
});
const SizeRange = mongoose.model("SizeRange", rangeSchema);
module.exports = SizeRange;