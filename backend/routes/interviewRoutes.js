const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/analyze', interviewController.analyzeInterview);

module.exports = router;
