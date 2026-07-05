require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse'); // Trigger restart
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "careermatch_super_secret_key_2025"; 

// --- CONFIGURATION ---
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://career-match-ai-resume-builder.vercel.app"];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// --- MONGODB CONNECTION ---
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careermatch';
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// --- GEMINI AI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using Flash for speed

// --- DATA MODELS ---
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const ScanSchema = new mongoose.Schema({
    userId: String,
    fileName: String,
    role: String,
    score: Number,
    foundSkills: [String],
    missingSkills: [String],
    scannedAt: { type: Date, default: Date.now }
});
const ScanResult = mongoose.model('ScanResult', ScanSchema);

const ApplicationSchema = new mongoose.Schema({
    userId: String,
    jobId: Number,
    title: String,
    company: String,
    location: String,
    salary: String,
    status: { type: String, default: 'Applied' }, 
    appliedAt: { type: Date, default: Date.now }
});
const Application = mongoose.model('Application', ApplicationSchema);

// --- UPLOAD SETUP ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- HELPER: FALLBACK REGEX ANALYSIS (If AI Fails) ---
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

// --- ROUTES ---

// 1. THE AI RESUME SCANNER
app.post('/upload', upload.single('resume'), async (req, res) => {
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
});

// 2. AUTH ROUTES
app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new User({ name, email, password: hashedPassword }).save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

// 3. APPLICATION TRACKER ROUTES
app.get('/applications', async (req, res) => {
    const userId = req.query.userId;
    if(!userId || userId === 'null') return res.json([]);
    const apps = await Application.find({ userId }).sort({ appliedAt: -1 });
    res.json(apps);
});

app.post('/apply', async (req, res) => {
    try {
        await new Application(req.body).save();
        res.json({ message: "Applied" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// 4. MOCK ROUTES (For Job Match & Stats)
app.post('/scan-job', (req, res) => {
    setTimeout(() => res.json({
        matchScore: 72,
        missingKeywords: ["Docker", "Kubernetes"],
        foundKeywords: ["React", "Node.js"],
        tailoredSummary: "Strong candidate for Frontend, needs Cloud skills."
    }), 1000);
});

// 5. INTERVIEW ANALYZER ROUTE
app.post('/api/interview/analyze', async (req, res) => {
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
});

// 6. YOGI CHATBOT ROUTE
app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        const systemInstruction = `
        You are Yogi, a friendly and concise career coach chatbot.
        Your primary function is to answer basic questions related to different job roles, skills required, and career paths.
        Keep answers concise (under 3 sentences) unless asked for a detailed explanation.
        If the user greets you, be warm and motivating.
        Never break character. You are an AI mentor, not a general assistant.
        `;

        const chatHistory = [
            {
                role: "user",
                parts: [{ text: systemInstruction }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am Yogi, ready to help." }],
            }
        ];

        if (history && Array.isArray(history)) {
            history.forEach(msg => {
                const mappedRole = msg.role === 'yogi' ? 'model' : 'user';
                const lastMessage = chatHistory[chatHistory.length - 1];
                
                if (lastMessage.role === mappedRole) {
                    lastMessage.parts[0].text += "\n" + msg.content;
                } else {
                    chatHistory.push({
                        role: mappedRole,
                        parts: [{ text: msg.content }]
                    });
                }
            });
        }

        let result;
        let attempt = 0;
        const maxAttempts = 3;
        
        while (attempt < maxAttempts) {
            try {
                const currentModel = attempt < 2 ? model : genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const chat = currentModel.startChat({ history: chatHistory });
                result = await chat.sendMessage(message);
                break;
            } catch (err) {
                attempt++;
                console.log(`⚠️ Gemini API Error on attempt ${attempt}:`, err.status || err.message);
                if (attempt >= maxAttempts) throw err;
                await new Promise(res => setTimeout(res, 2000));
            }
        }

        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ reply: "I'm having trouble connecting right now. Please try again later." });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
