const mongoose = require("mongoose");

const techPackSchema = new mongoose.Schema({
  techPackId: {
    type: String,
    required: true,
    unique: true,
  },
  styleId: {
    type: String,
    // required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  itemType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemType',
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  labelTrim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrimModel",
  },
  pictures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture", // Reference to the picture model
    },
  ],
  buttonImages: [
    {
      image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture", // Reference to the picture model
        // required: true,
      },
      color: { type: String, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      comment: { type: String, required: false },
    },
  ],
  rivetImages: [
    {
      image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture", // Reference to the picture model
        // required: true,
      },
      color: { type: String, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      comment: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("TechPack", techPackSchema);
