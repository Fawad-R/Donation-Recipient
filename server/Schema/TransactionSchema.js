const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        // required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Donor model
    },
    // recipient: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User', // Reference to the Recipient model
    // },
    recipient: {
        type: String,
        // ref: 'User', // Reference to the Recipient model
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    description: {
        type: String,
    },
    currency: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});
module.exports = mongoose.model('Transaction', transactionSchema);
