const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    systemName: String,
    title: String,
    logo: String, // Store the path to the uploaded logo file
    favicon: String,
    email: String,
    mobile: String,
    types: Array,
});
module.exports = mongoose.model('SystemSettings', systemSettingsSchema);