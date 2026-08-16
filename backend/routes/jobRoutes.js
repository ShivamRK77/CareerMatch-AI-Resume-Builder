const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/scan-job', jobController.scanJob);

module.exports = router;
