const mongoose = require('mongoose');

const ItemDetailSchema = new mongoose.Schema({
    workOrder_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workOrder',
    },
    style_number: {
        type: String,
    },
    client_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    class_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    },
    color_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
    },
    quantity: {
        type: Number,
    },
    size_scale: {
        type: String,
    },
    size_break: {
        type: String,
    },
    number_of_master_polybags_per_master_carton: {
        type: Number,
    },
    number_of_pieces_per_master_carton: {
        type: Number,
    },
    cbm_per_unit: {
        type: Number,
    },
    total_cbm: {
        type: Number,
    },
    individual_poly_bag: {
        type: Boolean,
        default: false,
    },
    price_tickets: {
        type: Boolean,
        default: false,
    },
    hanger: {
        type: Boolean,
        default: false,
    },
    comments: {
        type: String,
    },
    internal_comments: {
        type: String,
    },
    customer_po_number: {
        type: String,
    },
    package_by_size: [
        {
            size: { type: String },
            quantity: { type: Number },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('ItemDetail', ItemDetailSchema);
