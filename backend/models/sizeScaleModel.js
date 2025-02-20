const mongoose = require('mongoose');

const SizeScaleSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SizeScale', SizeScaleSchema);
