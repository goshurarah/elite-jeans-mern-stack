const mongoose = require('mongoose');

const specsTemplateSchema = new mongoose.Schema({
    
    Name: { type: String, required: true },

    Garment_Type: { type: mongoose.Schema.Types.ObjectId, ref: 'GarmentType', required: true },

    Size_Range: { type: mongoose.Schema.Types.ObjectId, ref: 'SizeRange', required: true },

    Point_of_Measure: { type: Number},
    
    pom_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PointOfMeasure',      
    }],

});


const SpecsTemplate = mongoose.model('SpecsTemplate', specsTemplateSchema);

module.exports = SpecsTemplate;