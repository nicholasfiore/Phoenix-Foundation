// Import packages
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const giveMeAJoke = require('give-me-a-joke');

const db = require('./db');
const Review = require('./models/reviewModel');
const Project = require('./models/projectModel')

const app = express();

const PORT = 3000;

const dataPath = './data';

let currentJoke = '';

// Create the cookies for the session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}));

// Set up a bunch of different middlewares and requirements for the project
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Landing page
app.get('/', (req, res) => {
    giveMeAJoke.getRandomDadJoke((joke) => {
        currentJoke = joke;
    });

    res.render('index', {joke: currentJoke});
});

// Who we are page
app.get('/whoWeAre', (req, res) => {
    giveMeAJoke.getRandomDadJoke((joke) => {
        currentJoke = joke;
    });

    res.render('whoWeAre', {joke: currentJoke});
});

// What we do page
app.get('/whatWeDo', async (req, res) => {
    giveMeAJoke.getRandomDadJoke((joke) => {
        currentJoke = joke;
    });

    // Get the projects
    const projects = await db.getProjects();

    res.render('whatWeDo', {projects: projects, joke: currentJoke});
});

// Contact us page
app.get('/contactUs', (req, res) => {
    giveMeAJoke.getRandomDadJoke((joke) => {
        currentJoke = joke;
    });

    const person = {
        name: ''
    }

    // If a form has been submitted, we have the use the form data on the webpage
    if (req.session.name) {
        person.name = req.session.name;
        person.email = req.session.email;
        person.form = req.session.form;

        req.session.destroy();
    }

    // Get a list of countries for the form
    const countries = JSON.parse(fs.readFileSync(path.join(dataPath, 'countries.json')).toString());
    res.render('contactUs', {person: person, countries: countries, joke: currentJoke});
});

// Contact us submission
app.post('/contactUs', (req, res) => {
    // Get the list of comments submitted and add the submitted comment to the file
    const commentsList = JSON.parse(fs.readFileSync(path.join(dataPath, 'comments.json')).toString());
    const newComment = req.body.comment;
    commentsList.push(newComment);

    fs.writeFileSync(path.join(dataPath, 'comments.json'), JSON.stringify(commentsList));

    // Create the cookie data for the page
    req.session.name = req.body.comment.name;
    req.session.email = req.body.comment.email;
    req.session.form = 'comments';

    res.redirect('/contactUs');
});

app.get('/api/reviews', async (req, res) => {
    const reviews = await db.getReviews();
    res.send(reviews);
});

// Gets a specific review from the data file
app.get('/api/reviews/:reviewID', async (req, res) => {
    
    const requestedReview = await db.getReviews({_id: req.params.reviewID});
        
    // Send the review information based on if the review exists or not
    if (requestedReview.length == 1) {
        res.send(requestedReview[0]);
    } else {
        res.send({
            id: -1, 
            error: "requested review not found", 
        });
    }
});

// Creates a new review for the data file
app.post('/api/reviews', (req, res) => {
    Review.create(req.body.review);
    
    // Create the session cookie data that will be displayed on the page
    req.session.name = req.body.review.name;
    req.session.email = req.body.review.email;
    req.session.form = 'review';

    res.redirect('/contactUs');
});

// Set up the server
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});