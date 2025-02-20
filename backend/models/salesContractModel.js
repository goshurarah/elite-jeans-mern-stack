const mongoose = require('mongoose');

const SalesContractSchema = new mongoose.Schema({
  currentSalesNumber: { type: Number, required: true },
  startDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SalesContract', SalesContractSchema);
