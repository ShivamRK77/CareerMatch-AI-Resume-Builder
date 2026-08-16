import React from 'react';
import { Book, FileText, Settings, Code, Zap, Target, Mic, Map, ShieldCheck, HelpCircle } from 'lucide-react';

const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const Docs = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-16 animate-fade-in-up">
            
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold uppercase tracking-widest">
                    <Book size={16} /> User Documentation
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight">
                    How to Master <span className={NEON_TEXT}>CareerMatch AI</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
                    Everything you need to know about optimizing your resume and acing your next big interview.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar - Optional but for now just navigation hints */}
                <div className="md:col-span-1 space-y-4">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Quick Start</h4>
                        <nav className="space-y-4">
                            <a href="#job-matcher" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors font-bold text-sm"><FileText size={16}/> Job Matcher</a>
                            <a href="#interview-simulator" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors font-bold text-sm"><Mic size={16}/> Interview Sim</a>
                            <a href="#skill-roadmap" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors font-bold text-sm"><Map size={16}/> Skill Roadmap</a>
                            <a href="#faq" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors font-bold text-sm"><HelpCircle size={16}/> Common FAQs</a>
                        </nav>
                    </div>
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/10">
                        <h4 className="text-sm font-bold text-white mb-2">Need Support?</h4>
                        <p className="text-xs text-slate-400 mb-4">Our team is here to help you get hired.</p>
                        <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-black hover:scale-105 transition-transform">Contact Support</button>
                    </div>
                </div>

                {/* Main Docs Content */}
                <div className="md:col-span-3 space-y-12">
                    
                    {/* Section: Job Matcher */}
                    <section id="job-matcher" className={`${GLASS_CLASSES} p-10 rounded-[3rem] space-y-6`}>
                        <div className="flex items-center gap-4 text-cyan-400">
                            <FileText size={32} />
                            <h3 className="text-2xl font-bold text-white tracking-tight">ATS Optimization Tool</h3>
                        </div>
                        <p className="text-slate-400 leading-loose">
                            Our Job Matcher analyzes your resume against a specific job description. It looks for **hard skills, soft skills, and industry keywords** that Applicant Tracking Systems (ATS) use to rank candidates.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                <h5 className="text-white font-bold mb-2">How to Use:</h5>
                                <p className="text-sm text-slate-500">Paste the URL of a job posting (LinkedIn, Indeed) and click "Scan Job". We'll compare it with your uploaded profile.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                <h5 className="text-white font-bold mb-2">Understanding Scores:</h5>
                                <p className="text-sm text-slate-500">A score of **80% or higher** is excellent. If you're below 60%, look at the "Missing Keywords" section and update your resume.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Interview Simulator */}
                    <section id="interview-simulator" className={`${GLASS_CLASSES} p-10 rounded-[3rem] space-y-6`}>
                        <div className="flex items-center gap-4 text-violet-400">
                            <Mic size={32} />
                            <h3 className="text-2xl font-bold text-white tracking-tight">Voice AI Interview Simulator</h3>
                        </div>
                        <p className="text-slate-400 leading-loose">
                            Practice makes you confident. Our Voice AI simulator listens to your answers and provides a **real-time sentiment and content analysis.**
                        </p>
                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4 items-start">
                                <Zap className="text-yellow-500 flex-shrink-0 mt-1" size={18}/>
                                <div>
                                    <h5 className="text-white font-bold text-sm">Clarity Analysis</h5>
                                    <p className="text-xs text-slate-500">We analyze your speaking pace and enunciation to ensure you're easy to understand.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <ShieldCheck className="text-emerald-500 flex-shrink-0 mt-1" size={18}/>
                                <div>
                                    <h5 className="text-white font-bold text-sm">Keyword Mapping</h5>
                                    <p className="text-xs text-slate-500">The AI checks if you're hitting the critical keywords mentioned in the job description.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Skill Roadmap */}
                    <section id="skill-roadmap" className={`${GLASS_CLASSES} p-10 rounded-[3rem] space-y-6`}>
                        <div className="flex items-center gap-4 text-emerald-400">
                            <Map size={32} />
                            <h3 className="text-2xl font-bold text-white tracking-tight">Career Path Navigator</h3>
                        </div>
                        <p className="text-slate-400 leading-loose">
                            Tell us your target role, and we'll map out a **curated learning path** with resources from across the web. From foundations to expert level.
                        </p>
                        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-6 rounded-2xl border border-white/10">
                            <h5 className="text-white font-bold mb-2">Pro Tip:</h5>
                            <p className="text-sm text-slate-300">Start with the foundations. Most candidates fail at technical interviews because they skipped the basics of their specialized field.</p>
                        </div>
                    </section>

                </div>
            </div>

        </div>
    );
};

export default Docs;
