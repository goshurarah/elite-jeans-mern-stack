const mongoose = require('mongoose');

const ItemTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ItemType', ItemTypeSchema);
