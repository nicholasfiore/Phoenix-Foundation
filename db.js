const mongoose = require('mongoose');
require('dotenv').config();

const Review = require('./models/reviewModel');
const Project = require('./models/projectModel');

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB error: ' + err.message);
    process.exit(-1);
});

db.once('open', () => {
    console.log('MongoDB connection established');
});

module.exports = {
    getReviews: async (options={}) => Review.find(options),
    getProjects: async (options={}) => Project.find(options)
};