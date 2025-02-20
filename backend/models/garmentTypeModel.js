const mongoose = require('mongoose');
const garmentTypeSchema = new mongoose.Schema({
    Garment_Type: { type: String, required: true }
});
const GarmentType = mongoose.model('GarmentType', garmentTypeSchema);
module.exports = GarmentType;