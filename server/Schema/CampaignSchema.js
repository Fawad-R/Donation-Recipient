const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        // required: true,
    },
    endDate: {
        type: Date,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    projections: {
        type: [String], // Array of image URLs for projections
    },
    updates: {
        type: String,
    },
    progress: {
        type: [String], // Array of image URLs for progress
    },
    userId: {
        type: String
    },
    price: {
        type: Number
    },
});
module.exports = mongoose.model('Campaign', campaignSchema);
