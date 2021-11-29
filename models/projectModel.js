const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    name: String,
    img: {
        imgData: String,
        contentType: String
    },
    description: String,
    cost: String,
    feedback: [{
        name: String,
        country: String,
        feedbackText: String
    }]
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;