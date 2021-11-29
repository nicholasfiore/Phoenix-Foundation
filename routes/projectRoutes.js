const express = require('express');
const router = express.Router();

const db = require('../db');

router.get('/:projectID', async (req, res) => {
    const project = await db.getProjects({_id: req.params.projectID})
        .catch((err) => {});
    if (project === undefined || project.length !== 1) {
        res.redirect('/404');
    } else {
        res.render('project', {project: project[0]});
    }
});

// Contact us submission
router.post('/feedback', async (req, res) => {
    // Get the list of comments submitted and add the submitted comment to the file
    const newFeedback = req.body.feedback;
    newFeedback.country = newFeedback.country.replace(/\$/g, ' ');
    newFeedback.project = newFeedback.project.replace(/\$/g, ' ');

    await db.addFeedbackToProject(newFeedback.project, {
        name: newFeedback.name,
        country: newFeedback.country,
        feedbackText: newFeedback.feedbackText
    });

    // Create the cookie data for the page
    req.session.name = req.body.feedback.name;
    req.session.email = req.body.feedback.email;
    req.session.form = 'feedback';

    res.redirect('/contactUs');
});

module.exports = router;