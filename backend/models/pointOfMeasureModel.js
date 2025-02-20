const mongoose = require("mongoose");

const pointOfMeasureSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tolerance: { type: String, required: true },
}, { timestamps: true });

const PointOfMeasure = mongoose.model("PointOfMeasure", pointOfMeasureSchema);

module.exports = PointOfMeasure;
