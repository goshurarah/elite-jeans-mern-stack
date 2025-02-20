const mongoose = require("mongoose");

const workOrderSchema = new mongoose.Schema({
    workOrderId: { type: String },
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
    trim_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TrimModel',
        },
    ],
    etd: { type: Date, required: true },
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
    trimImages: [
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
    createdAt: { type: Date, default: Date.now },
});

const workOrder = mongoose.model("workOrder", workOrderSchema);

module.exports = workOrder;

