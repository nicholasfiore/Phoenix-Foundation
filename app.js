// Import packages
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

const PORT = 3000;

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

const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/reviews', reviewRoutes)

const projectRoutes = require('./routes/projectRoutes');
app.use('/projects', projectRoutes);

app.use(function(req, res, next) {
    res.status(404).render('error404');
})

// Set up the server
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});