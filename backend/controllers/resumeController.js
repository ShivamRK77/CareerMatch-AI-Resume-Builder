const pdfParse = require('pdf-parse');
const genAI = require('../config/gemini');
const ScanResult = require('../models/ScanResult');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const basicAnalysis = (text, role) => {
    const keywords = {
        'mern': ['react', 'node', 'express', 'mongodb', 'javascript'],
        'datascience': ['python', 'pandas', 'numpy', 'sql', 'machine learning'],
        'java': ['java', 'spring', 'hibernate', 'sql']
    };
    const target = keywords[role.toLowerCase().split(' ')[0]] || keywords['mern'];
    const found = target.filter(k => text.toLowerCase().includes(k));
    const missing = target.filter(k => !text.toLowerCase().includes(k));
    return {
        score: Math.round((found.length / target.length) * 100),
        foundSkills: found,
        missingSkills: missing,
        summary: "Basic scan complete. (AI was unavailable)",
        salary: "$60k - $80k",
        interviewPrep: [{ topic: "Core", q: "Tell me about yourself.", a: "Prepare a STAR answer." }]
    };
};

exports.uploadResume = async (req, res) => {
    try {
        const role = req.body.role || 'MERN Stack Developer';
        const userId = req.body.userId;
        
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // A. Extract Text from PDF
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        // B. Construct AI Prompt
        const prompt = `
        Act as a Senior Tech Recruiter. Analyze this resume for the role of "${role}".
        Resume Text: "${resumeText.slice(0, 3000)}"
        
        Return a valid JSON object strictly matching this structure:
        {
            "score": Number (0-100),
            "summary": "2 sentence professional summary",
            "foundSkills": ["skill1", "skill2"],
            "missingSkills": ["missing1", "missing2"],
            "salary": "Estimated range (e.g. $80k - $100k)",
            "interviewPrep": [
                { "topic": "Hard Skill", "q": "Technical question based on resume", "a": "Short answer" },
                { "topic": "Soft Skill", "q": "Behavioral question", "a": "Short answer" }
            ],
            "learningPath": [
                { "skill": "Missing Skill Name", "title": "Suggested Course/Video Title", "type": "Course", "link": "https://google.com" }
            ]
        }
        `;

        let analysisData;

        try {
            // C. Call Gemini API
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // D. Clean JSON (Remove markdown backticks if AI adds them)
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            analysisData = JSON.parse(cleanJson);
            console.log("✅ AI Scan Successful");

        } catch (aiError) {
            console.error("⚠️ AI Failed, using Fallback:", aiError.message);
            analysisData = basicAnalysis(resumeText, role);
        }

        // E. Save to Database (if user is logged in)
        if(userId && userId !== 'null') {
            await new ScanResult({
                userId, fileName: req.file.originalname, role, 
                score: analysisData.score, 
                foundSkills: analysisData.foundSkills, 
                missingSkills: analysisData.missingSkills
            }).save();
        }

        // F. Return Data to Frontend
        res.json({ 
            message: 'Success', 
            role,
            ...analysisData 
        });

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ message: "Analysis Failed" });
    }
};
