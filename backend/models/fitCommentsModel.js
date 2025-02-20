const mongoose = require("mongoose");


const FitCommentsSchema = new mongoose.Schema({
  sampleGradedSpecs_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SampleGradedSpecs',
  },
  workOrder_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workOrder',
  },
  sampleStatus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SampleStatus',
  },
  sampleRequestingStatus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SampleRequestingStatus',
  },
});

module.exports = mongoose.model("FitComments", FitCommentsSchema);
