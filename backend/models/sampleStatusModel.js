const mongoose = require('mongoose');

const SampleStatusSchema = new mongoose.Schema({
  sampleStatus: { 
    name:{type: String},
    comments :{type: String},
    images:{type: String},
    
  },
}, { timestamps: true });

module.exports = mongoose.model('SampleStatus', SampleStatusSchema);
