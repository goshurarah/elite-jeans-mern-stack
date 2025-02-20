const mongoose = require('mongoose');

const SizeBreakSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SizeBreak', SizeBreakSchema);
