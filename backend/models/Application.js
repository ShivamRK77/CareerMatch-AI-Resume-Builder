const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: String,
    jobId: Number,
    title: String,
    company: String,
    location: String,
    salary: String,
    status: { type: String, default: 'Applied' }, 
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
