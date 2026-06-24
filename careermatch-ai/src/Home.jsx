 import React from 'react'; 
import { Sparkles, CheckCircle, Target, Briefcase, Zap, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-24 animate-fade-in-up">
            
            {/* Hero Section */}
            <div className="text-center space-y-8 py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold uppercase tracking-widest">
                    <Zap size={16} /> Powered by Advanced AI
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                    Stop Applying. <br />
                    Start <span className={NEON_TEXT}>Getting Hired.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                    The only platform that bridges the gap between your resume and your dream job. Optimize, practice, and map your path to success.
                </p>
                <div className="flex flex-wrap justify-center gap-6 pt-8">
                    <div className="flex items-center gap-2 text-slate-300 font-bold bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                        <CheckCircle className="text-emerald-500" size={20} /> 98% ATS Compatibility
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-bold bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                        <TrendingUp className="text-cyan-500" size={20} /> 3x Interview Conversion
                    </div>
                </div>
            </div>

            {/* Feature Grid: Become Job Ready */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className={`${GLASS_CLASSES} p-10 rounded-[3rem] group hover:border-cyan-500/30 transition-all duration-500`}>
                    <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 transition-transform">
                        <Target size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">ATS Optimization</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        Most resumes never reach a human. Our scanner uses industry-standard algorithms to ensure you pass through every gatekeeper.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={14} className="text-cyan-500"/> Keyword Density Analysis</li>
                        <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={14} className="text-cyan-500"/> Formatting Compatibility</li>
                    </ul>
                </div>

                <div className={`${GLASS_CLASSES} p-10 rounded-[3rem] group hover:border-violet-500/30 transition-all duration-500`}>
                    <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 mb-8 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Voice AI Coach</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        Practice makes perfect. Get real-time feedback on your clarity, confidence, and keyword usage during mock interviews.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={14} className="text-violet-500"/> Tone & Sentiment Analysis</li>
                        <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={14} className="text-violet-500"/> STAR Method Guidance</li>
                    </ul>
                </div>

                <div className={`${GLASS_CLASSES} p-10 rounded-[3rem] group hover:border-emerald-500/30 transition-all duration-500`}>
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                        <TrendingUp size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Strategic Roadmaps</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        Know exactly what to learn next. Get personalized paths based on the latest market trends and job requirements.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={14} className="text-emerald-500"/> Curated Learning Resources</li>
                        <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={14} className="text-emerald-500"/> Skill Gap Identification</li>
                    </ul>
                </div>
            </div>

            {/* Information Section: Resume Tips */}
            <div className={`${GLASS_CLASSES} p-12 rounded-[4rem] relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-64 bg-violet-500/5 blur-[120px]"></div>
                <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-8">
                            Make Your Resume <span className={NEON_TEXT}>Bulletproof</span>
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-cyan-400 font-bold border border-white/10">1</div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Quantify Your Achievements</h4>
                                    <p className="text-slate-400">Instead of "Managed a team," use "Led a cross-functional team of 10 to deliver projects 20% ahead of schedule."</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-cyan-400 font-bold border border-white/10">2</div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Tailor Every Application</h4>
                                    <p className="text-slate-400">Use our Job Matcher to find critical keywords and weave them naturally into your professional summary.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-cyan-400 font-bold border border-white/10">3</div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Clean, Minimalist Layout</h4>
                                    <p className="text-slate-400">Fancy designs often confuse ATS. Stick to a clean, single-column layout for maximum compatibility.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/40 p-8 rounded-[3rem] border border-white/10 space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <Users className="text-cyan-400" />
                            <span className="text-white font-bold">Expert Review Tip</span>
                        </div>
                        <p className="text-slate-300 italic leading-loose">
                            "The first 30% of your resume determines if the recruiter reads the rest. Focus heavily on your 'Professional Summary' and 'Core Skills' section. Use our Interview Simulator to practice explaining these skills out loud—it builds the confidence that recruiters can feel through the paper."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-full"></div>
                            <div>
                                <div className="text-sm font-bold text-white">Sarah Jenkins</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Senior Tech Recruiter</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Ready Stats */}
            <div className="flex flex-wrap justify-around gap-12 py-12 border-y border-white/5">
                <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2">10k+</div>
                    <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">Users Hired</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2">4.9/5</div>
                    <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">Average Rating</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2">500+</div>
                    <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">Company Partners</div>
                </div>
            </div>

        </div>
    );
};

export default Home;