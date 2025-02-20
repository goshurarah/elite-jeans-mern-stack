const mongoose = require('mongoose');

const SampleGradedSpecsSchema = new mongoose.Schema({
    workOrder_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workOrder',
    },
    garment_type_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GarmentType',
    },
    size_range_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SizeRange',
    },
    spec_template_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SpecsTemplate',
    },
    style_nummber: {
        type: String,
    },
    fabric_content: {
        type: String,
    },
    customer_or_brand: {
        type: String,
    },
    size: {
        type: String,
    },
    garment_specs_details: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('SampleGradedSpecs', SampleGradedSpecsSchema);
