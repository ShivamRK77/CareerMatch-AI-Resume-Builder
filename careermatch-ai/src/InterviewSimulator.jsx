import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, RefreshCw, CheckCircle, AlertCircle, BarChart3, ChevronRight, StopCircle } from 'lucide-react';

/* --- THEME CONSTANTS --- */
const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const InterviewSimulator = () => {
    const [status, setStatus] = useState('idle'); // idle, listening, processing, feedback
    const [transcript, setTranscript] = useState("");
    const [question, setQuestion] = useState("Tell me about a challenging project you worked on.");
    const [feedback, setFeedback] = useState(null);
    const recognitionRef = useRef(null);

    // Initialize Web Speech API
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(prev => prev + event.results[i][0].transcript + ' ');
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setStatus('idle');
            };
        } else {
            alert("Your browser does not support Voice Recognition. Try Chrome or Edge.");
        }
    }, []);

    const startListening = () => {
        setTranscript("");
        setStatus('listening');
        recognitionRef.current?.start();
    };

    const stopListening = () => {
        setStatus('processing');
        recognitionRef.current?.stop();
        
        // Simulate AI Analysis Delay
        setTimeout(() => {
            generateFeedback();
            setStatus('feedback');
        }, 2000);
    };

    const generateFeedback = () => {
        // Mock AI Logic
        const wordCount = transcript.split(" ").length;
        const confidenceScore = Math.min(Math.floor(wordCount * 1.5) + 40, 95); // Fake logic
        
        setFeedback({
            clarity: 85,
            confidence: confidenceScore,
            keywords: ["Scalability", "Teamwork", "React"],
            suggestion: "Your answer was structured well using the STAR method. Try to quantify your results more (e.g., 'improved performance by 20%')."
        });
    };

    const nextQuestion = () => {
        const questions = [
            "Explain the difference between SQL and NoSQL databases.",
            "How do you handle merge conflicts in Git?",
            "What is your greatest strength as a developer?"
        ];
        setQuestion(questions[Math.floor(Math.random() * questions.length)]);
        setStatus('idle');
        setTranscript("");
        setFeedback(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 animate-fade-in-up">
            
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Mic size={14} /> Live Voice Coach
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight mb-4">
                    Ace Your <span className={NEON_TEXT}>Interview</span>
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Practice answering technical questions out loud. Our AI analyzes your speech patterns, clarity, and confidence.
                </p>
            </div>

            {/* Main Interaction Area */}
            <div className={`relative ${GLASS_CLASSES} rounded-[3rem] p-10 overflow-hidden min-h-[500px] flex flex-col items-center justify-center`}>
                
                {/* Background Animation for Listening */}
                {status === 'listening' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 bg-cyan-500/10 rounded-full animate-ping"></div>
                        <div className="absolute w-96 h-96 bg-violet-500/10 rounded-full animate-pulse delay-75"></div>
                    </div>
                )}

                {/* Question Card */}
                <div className="relative z-10 text-center mb-10 w-full max-w-2xl">
                    <h3 className="text-lg text-slate-400 uppercase tracking-widest font-bold mb-4">Current Question</h3>
                    <p className="text-3xl md:text-4xl font-bold text-white leading-tight">"{question}"</p>
                </div>

                {/* Mic Button Area */}
                {status === 'idle' && (
                    <button onClick={startListening} className="relative z-10 group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.5)] group-hover:scale-110 transition-transform">
                            <Mic size={40} className="text-white" />
                        </div>
                        <p className="text-white font-bold mt-6 text-lg">Tap to Speak</p>
                    </button>
                )}

                {status === 'listening' && (
                    <div className="relative z-10 text-center w-full max-w-2xl">
                        <div className="mb-8">
                            <button onClick={stopListening} className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors mx-auto animate-pulse">
                                <StopCircle size={32} className="text-white" />
                            </button>
                            <p className="text-rose-400 font-bold mt-4 tracking-widest uppercase text-sm">Recording...</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm min-h-[100px] text-left">
                            <p className="text-slate-300 text-lg leading-relaxed">{transcript || "Start speaking..."}</p>
                        </div>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="relative z-10 text-center">
                        <RefreshCw size={48} className="text-cyan-400 animate-spin mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white">Analyzing Speech...</h3>
                        <p className="text-slate-400 mt-2">Checking confidence and keywords</p>
                    </div>
                )}

                {/* Feedback Report */}
                {status === 'feedback' && feedback && (
                    <div className="relative z-10 w-full max-w-3xl animate-in slide-in-from-bottom-10 duration-500">
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                                <div className="text-slate-400 text-xs uppercase font-bold mb-2">Clarity</div>
                                <div className="text-4xl font-black text-emerald-400">{feedback.clarity}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                                <div className="text-slate-400 text-xs uppercase font-bold mb-2">Confidence</div>
                                <div className="text-4xl font-black text-cyan-400">{feedback.confidence}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                                <div className="text-slate-400 text-xs uppercase font-bold mb-2">Pace</div>
                                <div className="text-xl font-bold text-white">Perfect</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-2xl p-8 border border-white/10 mb-8">
                            <h4 className="flex items-center gap-2 text-violet-300 font-bold mb-4"><Sparkles size={18}/> AI Feedback</h4>
                            <p className="text-white text-lg leading-relaxed">"{feedback.suggestion}"</p>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={nextQuestion} className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                Next Question <ChevronRight size={18}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewSimulator;