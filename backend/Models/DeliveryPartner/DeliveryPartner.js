const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema({
    driverId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
    },
    licenseNo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    vehicaleDet: {
        vehicleNo: {
            type: String,
            required: true,
        },
        vehicleType: {
            type: String,
            required: true,
        },
        capacity: {
            type: String,
            required: true,
        },
        yearOfManufact: {
            type: Number,
            required: true,
        },
        freezer: {
            type: String,
            required: true,
        },
    },
    bankDet: {
        name: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
            required: true,
        },
        accNo: {
            type: String,
            required: true,
        },
        branchName: {
            type: String,
            required: true,
        },
        branchNo: {
            type: String,
            required: true,
        },
    }
});

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);