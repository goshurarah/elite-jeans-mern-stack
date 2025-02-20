const mongoose = require('mongoose');

const SampleRequestingStatusSchema = new mongoose.Schema({
  sampleRequestingStatus: { 
    name:{type: String},
    comments :{type: String},
    images:{type: String},
    
  },
}, { timestamps: true });

module.exports = mongoose.model('SampleRequestingStatus', SampleRequestingStatusSchema);
