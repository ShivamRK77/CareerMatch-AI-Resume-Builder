import React, { useState, useEffect, useRef } from 'react';
import { Mic, RefreshCw, ChevronRight, StopCircle, Sparkles, Video, VideoOff } from 'lucide-react';

/* --- THEME CONSTANTS --- */
const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const InterviewSimulator = () => {
    const [status, setStatus] = useState('idle'); // idle, listening, processing, feedback, error
    const [transcript, setTranscript] = useState("");
    const [question, setQuestion] = useState("Tell me about a challenging project you worked on.");
    const [feedback, setFeedback] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const recognitionRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

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
            console.warn("Speech recognition not supported in this browser.");
        }

        // Cleanup camera on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleCamera = async () => {
        if (isCameraOn) {
            // Turn off camera
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
        } else {
            // Turn on camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraOn(true);
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access camera. Please check your browser permissions.");
            }
        }
    };

    const startListening = () => {
        setTranscript("");
        setStatus('listening');
        try {
            recognitionRef.current?.start();
        } catch (err) {
            console.error("Failed to start recognition:", err);
            setStatus('idle');
        }
    };

    const stopListening = async () => {
        setStatus('processing');
        recognitionRef.current?.stop();
        
        // Wait briefly to ensure the final transcript chunk is appended
        setTimeout(() => {
             generateFeedback(transcript, question);
        }, 800);
    };

    const generateFeedback = async (currentTranscript, currentQuestion) => {
        if (!currentTranscript.trim()) {
            setFeedback({
                clarity: 0,
                confidence: 0,
                keywords: ["None"],
                suggestion: "We didn't catch any audio. Please try speaking a bit louder or check your microphone settings."
            });
            setStatus('feedback');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/interview/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: currentQuestion,
                    transcript: currentTranscript.trim()
                }),
            });

            if (!response.ok) throw new Error(`API response was not ok: ${response.status}`);

            const data = await response.json();
            
            // Validate that we actually got the data we expect before setting it
            if (data && typeof data.clarity === 'number') {
                setFeedback(data);
                setStatus('feedback');
            } else {
                throw new Error("Invalid format received from AI");
            }

        } catch (error) {
            console.error("Error fetching AI feedback:", error);
            // Fallback for demo purposes if backend isn't running or AI fails
            setFeedback({
                clarity: 85,
                confidence: 78,
                pronunciationScore: 82,
                vocabularyScore: 88,
                keywords: ["Problem Solving", "Communication"],
                suggestion: "Your answer was generally good, but the AI service is currently unreachable to provide an accurate detailed analysis. Make sure the backend server is running and the Gemini API key is properly configured.",
                detailedFeedback: {
                    pronunciation: "Could not be evaluated accurately due to server error.",
                    vocabulary: "Could not be evaluated accurately due to server error.",
                    structure: "Consider using the STAR method (Situation, Task, Action, Result) to structure your response."
                }
            });
            setStatus('feedback');
        }
    };

    const nextQuestion = () => {
        const questions = [
            "Explain the difference between SQL and NoSQL databases.",
            "How do you handle merge conflicts in Git?",
            "What is your greatest strength as a developer?",
            "Describe the React component lifecycle.",
            "How do you optimize a slow web application?",
            "What is the difference between a functional and a class component?"
        ];
        const nextQ = questions[Math.floor(Math.random() * questions.length)];
        setQuestion(nextQ);
        setStatus('idle');
        setTranscript("");
        setFeedback(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-20 animate-fade-in-up">
            
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
                
                {/* Camera Toggle Button */}
                <button
                    onClick={toggleCamera}
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 z-20 group"
                    title={isCameraOn ? "Turn off camera" : "Turn on camera"}
                >
                    {isCameraOn ? <Video size={20} className="text-cyan-400" /> : <VideoOff size={20} className="text-slate-400 group-hover:text-white" />}
                </button>

                {/* Video Feed (Picture in Picture style or Top Center) */}
                <div className={`transition-all duration-500 ease-in-out z-10 relative ${isCameraOn ? 'opacity-100 h-64 mb-8 scale-100' : 'opacity-0 h-0 mb-0 scale-95 pointer-events-none'}`}>
                    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl relative aspect-video bg-black/50">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                        {isCameraOn && (
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Live</span>
                            </div>
                        )}
                    </div>
                </div>

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
                            <button onClick={stopListening} className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors mx-auto animate-pulse cursor-pointer">
                                <StopCircle size={32} className="text-white" />
                            </button>
                            <p className="text-rose-400 font-bold mt-4 tracking-widest uppercase text-sm">Tap to Stop & Analyze</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm min-h-[100px] text-left">
                            <p className="text-slate-300 text-lg leading-relaxed">{transcript || "Listening carefully..."}</p>
                        </div>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="relative z-10 text-center">
                        <RefreshCw size={48} className="text-cyan-400 animate-spin mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white">AI is Analyzing...</h3>
                        <p className="text-slate-400 mt-2">Evaluating clarity, confidence, and context</p>
                    </div>
                )}

                {/* Feedback Report */}
                {status === 'feedback' && feedback && (
                    <div className="relative z-10 w-full max-w-4xl animate-in slide-in-from-bottom-10 duration-500">
                        <div className="grid md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Clarity</div>
                                <div className="text-3xl font-black text-emerald-400">{feedback.clarity}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Confidence</div>
                                <div className="text-3xl font-black text-cyan-400">{feedback.confidence}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Pronunciation</div>
                                <div className="text-3xl font-black text-violet-400">{feedback.pronunciationScore || 80}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Vocabulary</div>
                                <div className="text-3xl font-black text-fuchsia-400">{feedback.vocabularyScore || 85}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center flex flex-col justify-center">
                                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Keywords Hit</div>
                                <div className="flex flex-wrap justify-center gap-1 mt-1">
                                    {feedback.keywords?.slice(0, 2).map((kw, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] text-white whitespace-nowrap">{kw}</span>
                                    ))}
                                    {feedback.keywords?.length > 2 && <span className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] text-white">+{feedback.keywords.length - 2}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6 text-left relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                            <h4 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2">
                                <Mic size={14} className="text-cyan-400" /> Your Transcribed Answer
                            </h4>
                            <p className="text-slate-300 italic text-lg">"{transcript || "No speech detected. Please ensure your microphone is working."}"</p>
                        </div>

                        <div className="bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-2xl p-8 border border-white/10 mb-6 text-left">
                            <h4 className="flex items-center gap-2 text-violet-300 font-bold mb-4"><Sparkles size={18}/> AI Summary & Feedback</h4>
                            <p className="text-white text-lg leading-relaxed">"{feedback.suggestion}"</p>
                        </div>

                        {feedback.detailedFeedback && (
                            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
                                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-violet-400 font-bold mb-2 flex items-center gap-2">🗣️ Pronunciation</div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{feedback.detailedFeedback.pronunciation}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">📚 Vocabulary</div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{feedback.detailedFeedback.vocabulary}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">🏗️ Structure</div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{feedback.detailedFeedback.structure}</p>
                                </div>
                            </div>
                        )}

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
