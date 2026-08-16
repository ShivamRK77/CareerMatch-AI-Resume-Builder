const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const jdController = require('../controllers/jdController');

// Match resume against JD
router.post('/match', upload.single('resume'), jdController.matchJD);

module.exports = router;
