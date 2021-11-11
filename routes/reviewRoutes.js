const express = require('express');
const router = express.Router();

const db = require('../db');
const Review = require('../models/reviewModel');

router.get('/', async (req, res) => {
    const reviews = await db.getReviews();
    res.send(reviews);
});

// Creates a new review for the data file
router.post('/add', (req, res) => {
    const newReview = req.body.review;
    newReview.country = newReview.country.replace(/\$/g, ' ');
    Review.create(newReview);
    
    // Create the session cookie data that will be displayed on the page
    req.session.name = req.body.review.name;
    req.session.email = req.body.review.email;
    req.session.form = 'review';

    res.redirect('/contactUs');
});

module.exports = router;