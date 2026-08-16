const Application = require('../models/Application');

exports.getApplications = async (req, res) => {
    const userId = req.query.userId;
    if(!userId || userId === 'null') return res.json([]);
    const apps = await Application.find({ userId }).sort({ appliedAt: -1 });
    res.json(apps);
};

exports.createApplication = async (req, res) => {
    try {
        await new Application(req.body).save();
        res.json({ message: "Applied" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
};
