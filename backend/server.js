require('dotenv').config(); // Load environment variables first
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const chatRoutes = require('./routes/chatRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jdRoutes = require('./routes/jdRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

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
connectDB();

// --- ROUTES ---
app.use('/auth', authRoutes);
app.use('/', resumeRoutes); // Includes /upload
app.use('/applications', applicationRoutes); // Also update /apply below to this router
app.use('/apply', applicationRoutes); // Can be placed in applicationRoutes
app.use('/api/interview', interviewRoutes);
app.use('/api/jd', jdRoutes);
app.use('/chat', chatRoutes);
app.use('/', jobRoutes); // Includes /scan-job

// Start Server
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
