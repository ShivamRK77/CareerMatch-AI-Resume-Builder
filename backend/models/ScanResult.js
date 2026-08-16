const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    userId: String,
    fileName: String,
    role: String,
    score: Number,
    foundSkills: [String],
    missingSkills: [String],
    scannedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanResult', ScanSchema);
