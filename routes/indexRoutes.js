const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const db = require('../db');

// Landing page
router.get('/', (req, res) => {
    res.render('index');
});

// Who we are page
router.get('/whoWeAre', (req, res) => {
    res.render('whoWeAre');
});

// What we do page
router.get('/whatWeDo', async (req, res) => {
    // Get the projects
    const projects = await db.getProjects();

    res.render('whatWeDo', {projects: projects});
});

// Contact us page
router.get('/contactUs', async (req, res) => {
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

    const projectNames = await db.getProjects({}, {name: 1, _id: 0});
    // Get a list of countries for the form
    const dataPath = './data';
    const countries = JSON.parse(fs.readFileSync(path.join(dataPath, 'countries.json')).toString());
    res.render('contactUs', {person: person, countries: countries, projects: projectNames});
});

module.exports = router;