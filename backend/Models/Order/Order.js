const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    weight: {
        type: Number,
        required: true,
    },
    custContactNo: {
        type: String,
        required: true,
    },
    custId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
    },
    district: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    estimatedDeliveryDate: {
        type: Date,
    },
    DeliveredDate: {
        type: Date,
    },
    deliveryPrice: {
        type: Number,
    },
    deliveryPartnerId: {
        type: String,
    },
    deliveryPartnerName: {
        type: String,
    },
    deliveryStatus: {
        type: String,
    },
});

module.exports = mongoose.model("Order", orderSchema);