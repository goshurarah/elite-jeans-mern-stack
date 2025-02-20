const mongoose = require("mongoose");

const StyleDetailSchema = new mongoose.Schema({
  description: { type: String, required: true },
  frontPocket: { type: String, default: null },
  waistband: { type: String, default: null },
  flyArea: { type: String, default: null },
  stitchingThickness: { type: String, default: null },
  inseam: { type: String, default: null },
  zipper: { type: String, default: null },
  samplePicture: { type: String, default: null }, 
  fabric: { type: String, default: null },
  backPocket: { type: String, default: null },
  beltLoop: { type: String, default: null },
  backYoke: { type: String, default: null },
  sewingThreadColor: { type: String, default: null },
  hem: { type: String, default: null },
  summary: { type: String, default: null },
  dynamicAttributes: { type: Map, of: String, default: {} },
  techPackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TechPack",
    // required: true,
  },
  workOrder_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workOrder',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StyleDetail", StyleDetailSchema);

