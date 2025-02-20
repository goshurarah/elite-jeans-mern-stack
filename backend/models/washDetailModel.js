const mongoose = require("mongoose");

const washDetailSchema = new mongoose.Schema({
  wash: { type: String, required: true },
  dryProcess: { type: String, required: true },
  color: { type: String, required: true },
  comments: { type: String },
  washPicture: { type: String },
  dynamicAttributes: { type: Map, of: String },
  techpack: { type: mongoose.Schema.Types.ObjectId, ref: "TechPack"},
  workOrder_Id: { type: mongoose.Schema.Types.ObjectId, ref: "WorkOrder" }, 
});

const WashDetail = mongoose.model("WashDetail", washDetailSchema);

module.exports = WashDetail;

