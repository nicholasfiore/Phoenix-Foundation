const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    name: String,
    country: String,
    reviewText: String
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;