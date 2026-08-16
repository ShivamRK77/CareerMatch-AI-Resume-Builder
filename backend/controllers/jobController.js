exports.scanJob = (req, res) => {
    setTimeout(() => res.json({
        matchScore: 72,
        missingKeywords: ["Docker", "Kubernetes"],
        foundKeywords: ["React", "Node.js"],
        tailoredSummary: "Strong candidate for Frontend, needs Cloud skills."
    }), 1000);
};
