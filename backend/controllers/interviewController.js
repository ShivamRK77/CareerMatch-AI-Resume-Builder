const genAI = require('../config/gemini');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.analyzeInterview = async (req, res) => {
    try {
        const { question, transcript } = req.body;
        if (!transcript) return res.status(400).json({ message: "No transcript provided" });

        const prompt = `
        Act as an expert Interview Coach.
        The interviewer asked: "${question}"
        The candidate answered verbally (transcribed to text): "${transcript}"

        Analyze the answer and provide feedback. Since this is transcribed speech, infer their clarity, vocabulary, and confidence from the phrasing and sentence structure.
        Return a valid JSON object strictly matching this structure without any markdown formatting or extra text:
        {
            "clarity": Number (0-100),
            "confidence": Number (0-100),
            "pronunciationScore": Number (0-100),
            "vocabularyScore": Number (0-100),
            "keywords": ["found1", "found2"],
            "suggestion": "A detailed 3-4 sentence paragraph summarizing the feedback, highlighting specific areas to improve like pronunciation, vocabulary, and structure.",
            "detailedFeedback": {
                "pronunciation": "Feedback on inferred pronunciation or speech flow",
                "vocabulary": "Feedback on word choice and technical terms used",
                "structure": "Feedback on how the answer was structured (e.g. STAR method)"
            }
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Ensure robust parsing by finding the first { and last }
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}') + 1;
        
        if (startIdx === -1 || endIdx === 0) {
            throw new Error("Invalid JSON structure returned from AI");
        }
        
        const cleanJson = text.substring(startIdx, endIdx).trim();
        const analysisData = JSON.parse(cleanJson);
        
        res.json(analysisData);
    } catch (error) {
        console.error("Interview Analysis Error:", error);
        res.status(500).json({ message: "Failed to analyze interview response." });
    }
};
