import React, { useState } from 'react';
import { Link2, XCircle, CheckCircle, Sparkles, Copy, Download, RefreshCw, Briefcase, Building2 } from 'lucide-react';

/* --- THEME CONSTANTS --- */
const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const JobMatcher = ({ userId }) => {
    const [url, setUrl] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [status, setStatus] = useState('idle'); // idle, scanning, complete, error
    const [result, setResult] = useState(null);

    const roles = [
        "MERN Developer",
        "Full Stack Developer",
        "Software Engineer",
        "Data Scientist",
        "Data Analyst",
        "Backend Developer",
        "Frontend Developer",
        "Cloud Architect"
    ];

    const handleScan = async () => {
        if (!url || !jobRole) return;
        setStatus('scanning');

        try {
            // In a real app, this fetches data from your backend
            // const response = await fetch('http://127.0.0.1:5000/scan-job', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ url, userId, jobRole })
            // });
            // const data = await response.json();
            
            // Simulate AI generating role-specific mock data
            setTimeout(() => {
                const mockData = {
                    company: "TechNova Solutions",
                    jobTitle: jobRole,
                    matchScore: Math.floor(Math.random() * 30) + 55, // 55-85
                    missingKeywords: jobRole.includes('Developer') || jobRole.includes('Engineer') 
                        ? ["CI/CD Pipelines", "GraphQL", "AWS EC2", "Microservices Architecture"]
                        : ["Machine Learning Models", "Pandas", "Data Visualization", "ETL Pipelines"],
                    foundKeywords: ["JavaScript", "React", "Node.js", "Git", "Problem Solving"],
                    tailoredSummary: `Experienced ${jobRole} with a strong foundation in building scalable solutions. Proven ability to quickly adapt to new technologies and drive project success. Currently focusing on expanding expertise in cloud architecture to deliver high-performance applications.`
                };
                
                setResult(mockData);
                setStatus('complete');
            }, 2500);

        } catch (error) {
            console.error("Scan failed:", error);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 animate-fade-in-up">
            {/* Header Section */}
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} /> ATS Optimization Tool
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight">
                    Targeted <span className={NEON_TEXT}>Job Match</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                    Paste a LinkedIn or Indeed URL and select the target role. We'll simulate an ATS scan and tell you exactly why you aren't getting hired.
                </p>
            </div>

            {/* Input Area */}
            <div className={`${GLASS_CLASSES} p-4 rounded-3xl mb-16 relative z-20 flex flex-col md:flex-row gap-4`}>
                
                {/* Role Selection */}
                <div className="md:w-1/3 relative">
                    <select 
                        className="w-full h-full min-h-[60px] bg-black/40 border border-white/10 rounded-2xl px-6 text-white font-medium outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                    >
                        <option value="" disabled>Select Target Role...</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {/* URL Input */}
                <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-cyan-500/50 transition-all">
                    <div className="text-slate-500 mr-2"><Link2 size={20}/></div>
                    <input 
                        type="text" 
                        placeholder="Paste job URL here..." 
                        className="w-full bg-transparent border-none outline-none text-white py-4 font-medium placeholder:text-slate-600"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                {/* Scan Button */}
                <button 
                    onClick={handleScan}
                    disabled={status === 'scanning' || !url || !jobRole}
                    className={`px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 md:w-auto w-full ${
                        status === 'scanning' || !url || !jobRole 
                        ? 'bg-slate-800 opacity-50 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:shadow-cyan-500/25 hover:scale-105 active:scale-95'
                    }`}
                >
                    {status === 'scanning' ? <RefreshCw className="animate-spin" /> : 'Scan Job'}
                </button>
            </div>

            {/* Loading State */}
            {status === 'scanning' && (
                <div className="text-center py-20 space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                        <BotIcon className="absolute inset-0 m-auto text-cyan-500 animate-pulse" size={32} />
                    </div>
                    <p className="text-cyan-400 font-mono text-sm tracking-widest">
                        EXTRACTING KEYWORDS... <br/> PARSING REQUIREMENTS...
                    </p>
                </div>
            )}

            {/* Results View */}
            {status === 'complete' && result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-500">
                    
                    {/* Job Header */}
                    <div className={`${GLASS_CLASSES} p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8`}>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                                {result.company.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">{result.jobTitle}</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-lg mt-1">
                                    <Building2 size={18}/> {result.company}
                                </div>
                            </div>
                        </div>
                        <div className="text-center bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 min-w-[180px]">
                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold">Match Score</div>
                            <div className={`text-6xl font-black ${result.matchScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {result.matchScore}%
                            </div>
                        </div>
                    </div>

                    {/* Keywords Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Missing - Critical */}
                        <div className={`${GLASS_CLASSES} p-8 rounded-[2.5rem] border-l-4 border-rose-500 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-32 bg-rose-500/10 blur-[80px]"></div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><XCircle size={20}/></div>
                                Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-3 relative z-10">
                                {result.missingKeywords.map(k => (
                                    <span key={k} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-sm font-bold flex items-center gap-2">
                                        {k} 
                                    </span>
                                ))}
                            </div>
                            <p className="mt-8 text-sm text-slate-400 leading-relaxed relative z-10 bg-black/20 p-4 rounded-xl border border-white/5">
                                <span className="text-rose-400 font-bold">⚠️ Critical Alert:</span> These keywords appear frequently in the job description but are missing from your resume. The ATS may reject your application automatically.
                            </p>
                        </div>

                        {/* Matched - Good */}
                        <div className={`${GLASS_CLASSES} p-8 rounded-[2.5rem] border-l-4 border-emerald-500 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[80px]"></div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><CheckCircle size={20}/></div>
                                Matched Keywords
                            </h4>
                            <div className="flex flex-wrap gap-3 relative z-10">
                                {result.foundKeywords.map(k => (
                                    <span key={k} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-sm font-bold">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Tailored Summary */}
                    <div className={`${GLASS_CLASSES} p-10 rounded-[2.5rem] bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border-white/20`}>
                        <div className="flex justify-between items-start mb-6">
                            <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Sparkles className="text-cyan-400 fill-cyan-400" size={24}/> 
                                Tailored Summary Suggestion
                            </h4>
                            <button 
                                onClick={() => navigator.clipboard.writeText(result.tailoredSummary)}
                                className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500 px-4 py-2 rounded-xl transition-all border border-cyan-500/20"
                            >
                                <Copy size={14}/> Copy
                            </button>
                        </div>
                        <div className="text-lg text-slate-300 leading-loose italic font-light pl-6 border-l-4 border-cyan-500/50">
                            "{result.tailoredSummary}"
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 pt-4">
                        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-white/10">
                            <Download size={20}/> Download Tailored Resume PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const BotIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

export default JobMatcher;