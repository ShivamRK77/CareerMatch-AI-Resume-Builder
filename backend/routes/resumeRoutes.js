const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const resumeController = require('../controllers/resumeController');

router.post('/upload', upload.single('resume'), resumeController.uploadResume);

module.exports = router;
