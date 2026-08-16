const pdfParse = require('pdf-parse');
const genAI = require('../config/gemini');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.matchJD = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "No resume file uploaded" });
        }
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is missing" });
        }

        // A. Extract Text from PDF
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        // B. Construct AI Prompt
        const prompt = `
        Act as an expert ATS (Applicant Tracking System) and Senior Recruiter. 
        I am providing you with a Candidate's Resume and a Job Description.

        Job Description:
        """${jobDescription.slice(0, 5000)}"""

        Candidate Resume:
        """${resumeText.slice(0, 5000)}"""
        
        Compare the resume strictly against the requirements in the job description and provide a detailed analysis.
        Return a valid JSON object strictly matching this structure without markdown formatting or backticks:
        {
            "score": Number (0-100, representing how well the resume matches the JD),
            "summary": "A 2-3 sentence summary of the candidate's fit for this role",
            "missingSkills": ["List of explicitly required skills in the JD that are completely missing from the resume"],
            "foundSkills": ["List of required skills in the JD that are found in the resume"],
            "gaps": [
                "Gap 1 (e.g., JD requires 5 years exp, resume shows 3)",
                "Gap 2 (e.g., Missing AWS Certification)"
            ],
            "suggestions": [
                "Suggestion 1 on how to improve the resume to reach a 90%+ ATS score",
                "Suggestion 2 (actionable advice specific to the JD)"
            ]
        }
        `;

        // C. Call Gemini API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // D. Clean JSON (Remove markdown backticks if AI adds them)
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}') + 1;
        
        if (startIdx === -1 || endIdx === 0) {
            throw new Error("Invalid JSON structure returned from AI");
        }
        
        const cleanJson = text.substring(startIdx, endIdx).trim();
        const analysisData = JSON.parse(cleanJson);
        console.log("✅ ATS Match Scan Successful");

        res.json({ 
            message: 'Success', 
            ...analysisData 
        });

    } catch (error) {
        console.error("❌ ATS Match Error:", error);
        res.status(500).json({ message: "Failed to analyze resume against JD.", error: error.message });
    }
};
