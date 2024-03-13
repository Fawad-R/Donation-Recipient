const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const key = 'mkasfakfalfkasfk[p231[2312';
const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        default: 'Recipient',
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
    phone: {
        type: Number,
    },
    recipientType: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    paymentMethod: {
        type: String,
        default: 'stripe',
    },
    subscription: {
        active: {
            type: Boolean,
            default: false,
        },
        planId: String,
        currentPeriodEnd: Date,
        stripeCustomerId: String,
        stripeSubscriptionId: String,
    },
    subscription2: {
        active: {
            type: Boolean,
            default: false,
        },
        status: String,
        id: String,
        create_time: Date,
        links: Array,
    },
    monthlyChargesActive: {
        type: Boolean,
        default: false, // Initially set to true when user subscribes
    },

});

userSchema.methods.generateAuthToken = async function () {
    let e = await jsonwebtoken.sign({ _id: this._id, isAdmin: this.isAdmin }, key);
    this.token = e;
    return e;
};

module.exports = mongoose.model('User', userSchema);
