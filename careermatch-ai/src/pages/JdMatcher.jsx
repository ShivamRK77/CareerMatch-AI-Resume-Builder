import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Search, RefreshCw, Briefcase, Target, Sparkles, AlertTriangle, FileSearch, ArrowRight } from 'lucide-react';

/* --- ENVIRONMENT CONFIG --- */
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/* --- THEME CONSTANTS --- */
const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const JdMatcher = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [status, setStatus] = useState('idle'); // idle, matching, complete
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setResult(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus('idle');
            setResult(null);
        }
    };

    const startMatch = async () => {
        if (!file || !jobDescription) return;
        setStatus('matching');
        
        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jobDescription);

            const response = await fetch(`${API_BASE_URL}/api/jd/match`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `API response was not ok: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
            setStatus('complete');
        } catch (error) {
            console.error("Error matching JD:", error);
            setResult({
                score: 0,
                summary: `API Error: ${error.message}`,
                missingSkills: ["Analysis Failed"],
                foundSkills: [],
                gaps: ["Ensure your API key is valid and you are not being rate limited."],
                suggestions: ["Restart the server if you changed .env", "Check backend console logs"]
            });
            setStatus('complete');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-20 animate-fade-in-up">
            {/* Header */}
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-bold uppercase tracking-widest">
                    <FileSearch size={16} /> Advanced ATS Matcher
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight">
                    JD vs Resume <span className={NEON_TEXT}>Analyzer</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
                    Upload your resume and paste the exact Job Description. We'll show you your ATS match score, gaps, and actionable steps to reach 90%+.
                </p>
            </div>

            {/* Input Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
                
                {/* JD Input */}
                <div className={`${GLASS_CLASSES} rounded-[3rem] p-8 flex flex-col`}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-violet-400"/> Paste Job Description
                    </label>
                    <textarea 
                        className="w-full flex-1 bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-300 font-medium outline-none focus:border-violet-500/50 transition-all resize-none min-h-[250px]"
                        placeholder="Paste the full job description here (requirements, responsibilities, etc.)..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </div>

                {/* File Upload */}
                <div className="flex flex-col gap-8">
                    <div 
                        className={`flex-1 ${GLASS_CLASSES} rounded-[3rem] p-10 flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group min-h-[200px]`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                            {file ? <CheckCircle size={40} /> : <Upload size={40} />}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 text-center">
                            {file ? file.name : "Drop your Resume PDF here"}
                        </h4>
                        <p className="text-slate-500 text-sm font-medium">Click or drag & drop</p>
                    </div>

                    <button 
                        onClick={startMatch}
                        disabled={!file || !jobDescription || status === 'matching'}
                        className="w-full py-5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-black rounded-[2rem] shadow-xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg"
                    >
                        {status === 'matching' ? (
                            <><RefreshCw className="animate-spin" size={24} /> Analyzing Match...</>
                        ) : (
                            <>Match Requirements <ArrowRight size={24}/></>
                        )}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {status === 'matching' && (
                <div className="text-center py-20 space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
                        <Target className="absolute inset-0 m-auto text-violet-500 animate-pulse" size={32} />
                    </div>
                    <p className="text-violet-400 font-mono text-sm tracking-widest uppercase">
                        Cross-Referencing JD Requirements...
                    </p>
                </div>
            )}

            {/* Results View */}
            {status === 'complete' && result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    
                    {/* Score Overview */}
                    <div className={`${GLASS_CLASSES} p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-12 border-t-4 ${result.score >= 80 ? 'border-emerald-500' : result.score >= 60 ? 'border-amber-500' : 'border-rose-500'}`}>
                        <div className="relative w-48 h-48 flex items-center justify-center flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                <circle 
                                    cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" 
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)}
                                    strokeLinecap="round"
                                    className={`transition-all duration-1000 ${result.score >= 80 ? 'text-emerald-500' : result.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}
                                />
                            </svg>
                            <div className="absolute text-center">
                                <div className={`text-5xl font-black ${result.score >= 80 ? 'text-emerald-400' : result.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{result.score}%</div>
                                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">ATS Match</div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Sparkles className={result.score >= 80 ? 'text-emerald-400' : 'text-amber-400'} size={24}/>
                                AI Summary
                            </h3>
                            <p className="text-slate-300 text-lg leading-relaxed">{result.summary}</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Missing Skills */}
                        <div className={`${GLASS_CLASSES} p-8 rounded-[3rem] border-l-4 border-rose-500 relative`}>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><AlertTriangle size={20}/></div>
                                Missing Skills from JD
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {result.missingSkills?.length > 0 ? result.missingSkills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold">
                                        {skill}
                                    </span>
                                )) : (
                                    <p className="text-slate-400 italic">No missing skills detected!</p>
                                )}
                            </div>
                        </div>

                        {/* Found Skills */}
                        <div className={`${GLASS_CLASSES} p-8 rounded-[3rem] border-l-4 border-emerald-500 relative`}>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><CheckCircle size={20}/></div>
                                Matched Skills
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {result.foundSkills?.length > 0 ? result.foundSkills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs font-bold">
                                        {skill}
                                    </span>
                                )) : (
                                    <p className="text-slate-400 italic">No exact skill matches found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gaps & Suggestions */}
                    <div className={`${GLASS_CLASSES} p-8 rounded-[3rem] relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-32 bg-violet-500/5 blur-[80px]"></div>
                        
                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                            <div>
                                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><Search size={20}/></div>
                                    Resume Gaps
                                </h4>
                                <ul className="space-y-4">
                                    {result.gaps?.length > 0 ? result.gaps.map((gap, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                                            {gap}
                                        </li>
                                    )) : (
                                        <p className="text-slate-400 italic">No major gaps identified.</p>
                                    )}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400"><Target size={20}/></div>
                                    Suggestions to reach 90%+
                                </h4>
                                <ul className="space-y-4">
                                    {result.suggestions?.length > 0 ? result.suggestions.map((sug, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                                            {sug}
                                        </li>
                                    )) : (
                                        <p className="text-slate-400 italic">No further suggestions.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default JdMatcher;
