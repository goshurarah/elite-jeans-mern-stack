const mongoose = require('mongoose');
const NewScaleAssignmentSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    packBySize: Boolean,
    itemType: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemType' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    sizeScale: { type: mongoose.Schema.Types.ObjectId, ref: 'SizeScale' },
    sizeBreak: { type: mongoose.Schema.Types.ObjectId, ref: 'SizeBreak' },
    MP_per_MC: String,
    individualPolyBag: Boolean,
    fittingSample: {
      size: String,
      piece: Number,
      daysAfterWorkOrderDate: Number,
      daysBeforeWorkOrderETDDate: Number,
    },
    shippingSample: {
      size: String,
      piece: Number,
      daysAfterWorkOrderDate: Number,
      daysBeforeWorkOrderETDDate: Number,
    },
  });
  module.exports = mongoose.model('NewScaleAssignment', NewScaleAssignmentSchema);