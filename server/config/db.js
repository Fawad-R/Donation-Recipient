const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Project2:M0YvGlNHYrXssfAI@cluster0.rrftaqb.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;