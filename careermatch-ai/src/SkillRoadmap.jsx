import React, { useState } from 'react';
import { Compass, Sparkles, Map, ChevronRight, CheckCircle2, BookOpen, Clock, Target, RefreshCw } from 'lucide-react';

/* --- THEME CONSTANTS --- */
const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const SkillRoadmap = () => {
    const [jobRole, setJobRole] = useState('');
    const [status, setStatus] = useState('idle'); // idle, generating, complete
    const [roadmap, setRoadmap] = useState(null);

    const generateRoadmap = async () => {
        if (!jobRole) return;
        setStatus('generating');

        try {
            // In a real app, this would fetch from an AI endpoint
            // const response = await fetch('http://localhost:5000/api/roadmap', { ... });
            
            // Mock AI Generation for now
            setTimeout(() => {
                const mockRoadmap = {
                    role: jobRole,
                    difficulty: "Intermediate",
                    estimate: "6-8 Months",
                    milestones: [
                        {
                            title: "Foundations & Core Principles",
                            duration: "1 Month",
                            topics: ["Understanding Data Structures", "Logic & Problem Solving", "Version Control (Git)"],
                            resources: "CS50, FreeCodeCamp"
                        },
                        {
                            title: "Specialized Skillset Mastery",
                            duration: "3 Months",
                            topics: ["Advanced JavaScript/Python", "API Design", "Database Modeling"],
                            resources: "Udemy, Coursera"
                        },
                        {
                            title: "Portfolio Development",
                            duration: "2 Months",
                            topics: ["Building 3 Real-world Projects", "Technical Documentation", "UI/UX Basics"],
                            resources: "YouTube, Documentation"
                        },
                        {
                            title: "Interview & Career Readiness",
                            duration: "1 Month",
                            topics: ["System Design", "Mock Interviews", "LinkedIn Optimization"],
                            resources: "LeetCode, Pramp"
                        }
                    ]
                };
                setRoadmap(mockRoadmap);
                setStatus('complete');
            }, 2500);

        } catch (error) {
            console.error("Roadmap generation failed:", error);
            setStatus('idle');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-20 animate-fade-in-up">
            {/* Header Section */}
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider">
                    <Compass size={14} /> Career Path Navigator
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight">
                    Personalized <span className={NEON_TEXT}>Skill Roadmap</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                    Tell us where you want to go. Our AI will map out the exact skills, projects, and resources you need to get there.
                </p>
            </div>

            {/* Input Area */}
            <div className={`${GLASS_CLASSES} p-8 rounded-[2.5rem] mb-16 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-48 bg-cyan-500/5 blur-[100px] group-hover:bg-cyan-500/10 transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"><Target size={20}/></div>
                        <input 
                            type="text" 
                            placeholder="e.g., Full Stack Developer, AI Engineer, UX Designer..." 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-medium placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-all"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={generateRoadmap}
                        disabled={status === 'generating'}
                        className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-2xl text-white font-black shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {status === 'generating' ? <RefreshCw className="animate-spin" /> : <><Sparkles size={20}/> Build Roadmap</>}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {status === 'generating' && (
                <div className="text-center py-20 space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
                        <Map className="absolute inset-0 m-auto text-violet-500 animate-pulse" size={32} />
                    </div>
                    <p className="text-violet-400 font-mono text-sm tracking-widest uppercase">
                        Analyzing Market Trends... <br/> Designing Learning Path...
                    </p>
                </div>
            )}

            {/* Roadmap Results */}
            {status === 'complete' && roadmap && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    
                    {/* Summary Card */}
                    <div className={`${GLASS_CLASSES} p-8 rounded-[2.5rem] flex flex-wrap gap-8 items-center justify-between`}>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400">
                                <Compass size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{roadmap.role}</h3>
                                <p className="text-slate-400">Target Learning Path</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1"><Clock size={10}/> Estimate</div>
                                <div className="text-lg font-bold text-white">{roadmap.estimate}</div>
                            </div>
                            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1"><Target size={10}/> Difficulty</div>
                                <div className="text-lg font-bold text-violet-400">{roadmap.difficulty}</div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative space-y-8 pl-8 md:pl-0">
                        {/* Connecting Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-violet-600 opacity-20 hidden md:block"></div>

                        {roadmap.milestones.map((milestone, i) => (
                            <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                
                                {/* Milestone Point */}
                                <div className="absolute left-[-2rem] md:left-1/2 md:-translate-x-1/2 w-10 h-10 bg-[#0f172a] border-4 border-cyan-500 rounded-full z-10 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                    {i + 1}
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-[45%] ${GLASS_CLASSES} p-8 rounded-[2.5rem] hover:border-cyan-500/30 transition-all duration-500 group`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{milestone.title}</h4>
                                        <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold text-slate-400">{milestone.duration}</span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {milestone.topics.map((topic, j) => (
                                                <span key={j} className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/5 rounded-xl text-xs text-slate-300 font-medium">
                                                    <CheckCircle2 size={12} className="text-emerald-500" /> {topic}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                                                <BookOpen size={14} className="text-violet-400"/> Resources
                                            </div>
                                            <span className="text-xs font-bold text-white bg-violet-600/20 px-3 py-1 rounded-lg border border-violet-500/20">{milestone.resources}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block w-[45%]"></div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="text-center pt-8">
                        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-3 mx-auto">
                            Start Learning Now <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillRoadmap;
