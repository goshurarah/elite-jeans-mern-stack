const mongoose = require('mongoose');

const WashColorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        workOrder_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
        wash_detail_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WashDetail', default: null },
        comment: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('WashColor', WashColorSchema);
