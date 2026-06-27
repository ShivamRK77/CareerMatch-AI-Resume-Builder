// import React, { useState, useRef } from 'react';
// import { Upload, FileText, CheckCircle, XCircle, Search, RefreshCw, Briefcase, Target, Sparkles, AlertTriangle, Copy } from 'lucide-react';

// /* --- THEME CONSTANTS --- */
// const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
// const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

// const ResumeScanner = () => {
//     const [file, setFile] = useState(null);
//     const [jobRole, setJobRole] = useState('');
//     const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, complete
//     const [result, setResult] = useState(null);
//     const [isOptimizing, setIsOptimizing] = useState(false);
//     const [optimizedContent, setOptimizedContent] = useState(null);
//     const fileInputRef = useRef(null);

//     const roles = [
//         "MERN Developer",
//         "Full Stack Developer",
//         "Software Engineer",
//         "Data Scientist",
//         "Data Analyst",
//         "Backend Developer",
//         "Frontend Developer",
//         "Cloud Architect"
//     ];

//     const handleFileChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setFile(e.target.files[0]);
//             setStatus('idle');
//             setResult(null);
//             setOptimizedContent(null);
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//             setFile(e.dataTransfer.files[0]);
//             setStatus('idle');
//             setResult(null);
//             setOptimizedContent(null);
//         }
//     };

//     const startAnalysis = async () => {
//         if (!file || !jobRole) return;
//         setStatus('analyzing');
//         setOptimizedContent(null);

//         try {
//             const formData = new FormData();
//             formData.append('resume', file);
//             formData.append('role', jobRole);
//             formData.append('userId', 'demo-user');

//             const response = await fetch('http://localhost:5000/upload', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error(`API response was not ok: ${response.status}`);
//             }

//             const data = await response.json();

//             const mappedResult = {
//                 score: data.score || 0,
//                 role: jobRole,
//                 missingSkills: data.missingSkills || [],
//                 missingKeywords: data.missingSkills ? data.missingSkills.slice(0, 5) : [], 
//                 feedback: data.summary || "Analysis complete."
//             };

//             setResult(mappedResult);
//             setStatus('complete');
//         } catch (error) {
//             console.error("Error analyzing resume:", error);
//             setResult({
//                 score: 0,
//                 role: jobRole,
//                 missingSkills: ["Error analyzing"],
//                 missingKeywords: ["Server connection failed"],
//                 feedback: "There was an error communicating with the AI backend. Please ensure the server is running."
//             });
//             setStatus('complete');
//         }
//     };

//     const handleOptimize = () => {
//         setIsOptimizing(true);

//         // Simulate AI generating an optimized resume summary/bullets
//         setTimeout(() => {
//             const missingSkillsText = result.missingSkills.slice(0, 2).join(" and ");
//             const missingKeywordsText = result.missingKeywords.slice(0, 2).join(" and ");

//             const generatedContent = {
//                 summary: `Dynamic and results-oriented ${result.role} with a proven track record in building scalable applications. Adept at leveraging ${missingSkillsText} to drive performance optimization. Recognized for implementing ${missingKeywordsText} to deliver robust, high-quality software solutions.`,
//                 bullets: result.missingSkills.map(skill => `Spearheaded the integration of ${skill}, enhancing overall system reliability and accelerating deployment cycles.`)
//             };
//             setOptimizedContent(generatedContent);
//             setIsOptimizing(false);
//         }, 2500);
//     };

//     return (
//         <div className="max-w-5xl mx-auto px-6 pt-12 pb-20 animate-fade-in-up">

//             {/* Header */}
//             <div className="text-center mb-12 space-y-4">
//                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold uppercase tracking-widest">
//                     <Target size={16} /> Precision ATS Scanner
//                 </div>
//                 <h2 className="text-5xl font-black text-white tracking-tight">
//                     Optimize for <span className={NEON_TEXT}>Success</span>
//                 </h2>
//                 <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
//                     Upload your resume and select your target role. Our AI will tell you exactly what's missing to land the job.
//                 </p>
//             </div>

//             {/* Input Section */}
//             <div className="grid md:grid-cols-3 gap-8 mb-16">

//                 {/* File Upload */}
//                 <div 
//                     className={`md:col-span-2 ${GLASS_CLASSES} rounded-[3rem] p-10 flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group`}
//                     onDragOver={(e) => e.preventDefault()}
//                     onDrop={handleDrop}
//                     onClick={() => fileInputRef.current.click()}
//                 >
//                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
//                     <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
//                         {file ? <CheckCircle size={40} /> : <Upload size={40} />}
//                     </div>
//                     <h4 className="text-xl font-bold text-white mb-2">
//                         {file ? file.name : "Drop your resume here"}
//                     </h4>
//                     <p className="text-slate-500 text-sm font-medium">Supports PDF, DOCX up to 10MB</p>
//                 </div>

//                 {/* Role Selection */}
//                 <div className={`${GLASS_CLASSES} rounded-[3rem] p-8 flex flex-col justify-between`}>
//                     <div className="space-y-6">
//                         <div>
//                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Target Role</label>
//                             <select 
//                                 className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-medium outline-none focus:border-cyan-500/50 transition-all appearance-none"
//                                 value={jobRole}
//                                 onChange={(e) => setJobRole(e.target.value)}
//                             >
//                                 <option value="" disabled>Select a role...</option>
//                                 {roles.map(r => <option key={r} value={r}>{r}</option>)}
//                             </select>
//                         </div>
//                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
//                             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
//                                 <Sparkles size={12} className="text-cyan-400" /> AI Insights
//                             </div>
//                             <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
//                                 We analyze over 500+ data points including skill density and ATS compatibility for {jobRole || "your role"}.
//                             </p>
//                         </div>
//                     </div>
//                     <button 
//                         onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
//                         disabled={!file || !jobRole || status === 'analyzing'}
//                         className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
//                     >
//                         {status === 'analyzing' ? <RefreshCw className="animate-spin" size={20} /> : "Start AI Scan"}
//                     </button>
//                 </div>
//             </div>

//             {/* Loading State */}
//             {status === 'analyzing' && (
//                 <div className="text-center py-20 space-y-6">
//                     <div className="relative w-24 h-24 mx-auto">
//                         <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
//                         <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
//                         <Search className="absolute inset-0 m-auto text-cyan-500 animate-pulse" size={32} />
//                     </div>
//                     <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
//                         Extracting Text... <br/> Analyzing Skill Gaps...
//                     </p>
//                 </div>
//             )}

//             {/* Results View */}
//             {status === 'complete' && result && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">

//                     {/* Score and Overview */}
//                     <div className={`${GLASS_CLASSES} p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-12`}>
//                         <div className="relative w-48 h-48 flex items-center justify-center">
//                             <svg className="w-full h-full transform -rotate-90">
//                                 <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
//                                 <circle 
//                                     cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" 
//                                     strokeDasharray={2 * Math.PI * 88}
//                                     strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)}
//                                     strokeLinecap="round"
//                                     className={`transition-all duration-1000 ${result.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}
//                                 />
//                             </svg>
//                             <div className="absolute text-center">
//                                 <div className={`text-5xl font-black ${result.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{result.score}%</div>
//                                 <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">ATS Score</div>
//                             </div>
//                         </div>
//                         <div className="flex-1 space-y-6">
//                             <div className="flex items-center gap-4">
//                                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10">
//                                     <Briefcase size={24} />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-2xl font-bold text-white">{result.role} Analysis</h3>
//                                     <p className="text-slate-400 font-medium">Compared against 1,000+ top-tier resumes</p>
//                                 </div>
//                             </div>
//                             <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
//                                 <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
//                                     <Sparkles size={16} className="text-violet-400" /> AI Feedback
//                                 </h4>
//                                 <p className="text-slate-300 text-sm leading-relaxed italic">"{result.feedback}"</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Detailed Analysis */}
//                     <div className="grid md:grid-cols-2 gap-8">

//                         {/* Missing Skills */}
//                         <div className={`${GLASS_CLASSES} p-8 rounded-[3rem] border-l-4 border-rose-500 relative overflow-hidden`}>
//                             <div className="absolute top-0 right-0 p-32 bg-rose-500/5 blur-[80px]"></div>
//                             <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
//                                 <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><AlertTriangle size={20}/></div>
//                                 Missing Critical Skills
//                             </h4>
//                             <div className="flex flex-wrap gap-3 relative z-10">
//                                 {result.missingSkills.map(skill => (
//                                     <span key={skill} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold">
//                                         {skill}
//                                     </span>
//                                 ))}
//                             </div>
//                             <p className="mt-8 text-xs text-slate-500 font-medium leading-relaxed relative z-10">
//                                 These skills are highly sought after for {result.role} positions. Consider adding them to your resume if you have experience with them.
//                             </p>
//                         </div>

//                         {/* Missing Keywords */}
//                         <div className={`${GLASS_CLASSES} p-8 rounded-[3rem] border-l-4 border-amber-500 relative overflow-hidden`}>
//                             <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[80px]"></div>
//                             <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
//                                 <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><Search size={20}/></div>
//                                 Missing Keywords
//                             </h4>
//                             <div className="flex flex-wrap gap-3 relative z-10">
//                                 {result.missingKeywords.map(keyword => (
//                                     <span key={keyword} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-bold">
//                                         {keyword}
//                                     </span>
//                                 ))}
//                             </div>
//                             <p className="mt-8 text-xs text-slate-500 font-medium leading-relaxed relative z-10">
//                                 ATS systems scan for these specific terms. Ensure they appear naturally in your project descriptions and professional summary.
//                             </p>
//                         </div>

//                     </div>

//                     {/* Action Button */}
//                     {!optimizedContent && (
//                         <div className="text-center pt-8">
//                             <button 
//                                 onClick={handleOptimize}
//                                 disabled={isOptimizing}
//                                 className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 mx-auto disabled:opacity-70"
//                             >
//                                 {isOptimizing ? (
//                                     <><RefreshCw size={20} className="animate-spin"/> Optimizing Resume...</>
//                                 ) : (
//                                     <>Optimize Resume Now <RefreshCw size={20}/></>
//                                 )}
//                             </button>
//                         </div>
//                     )}

//                     {/* Optimized Content Display */}
//                     {optimizedContent && (
//                         <div className={`${GLASS_CLASSES} mt-8 p-10 rounded-[3rem] border-t-4 border-cyan-500 relative overflow-hidden animate-slide-up`}>
//                             <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-[80px]"></div>
//                             <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
//                                 <Sparkles className="text-cyan-400" size={24}/> AI Optimized Content
//                             </h4>

//                             <div className="space-y-6 relative z-10">
//                                 <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
//                                     <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Suggested Professional Summary</h5>
//                                     <p className="text-slate-200 leading-relaxed">"{optimizedContent.summary}"</p>
//                                     <button 
//                                         className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-white transition-colors" 
//                                         onClick={() => navigator.clipboard.writeText(optimizedContent.summary)}
//                                     >
//                                         <Copy size={14}/> Copy Summary
//                                     </button>
//                                 </div>

//                                 <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
//                                     <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Suggested Bullet Points</h5>
//                                     <ul className="space-y-3">
//                                         {optimizedContent.bullets.map((bullet, idx) => (
//                                             <li key={idx} className="flex items-start gap-3 text-slate-200">
//                                                 <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1"/>
//                                                 <span>{bullet}</span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                 </div>
//             )}

//         </div>
//     );
// };

// export default ResumeScanner;




import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Search, RefreshCw, Briefcase, Target, Sparkles, AlertTriangle, Copy } from 'lucide-react';

/* --- ENVIRONMENT CONFIG --- */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* --- THEME CONSTANTS --- */
const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const ResumeScanner = () => {
    const [file, setFile] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, complete
    const [result, setResult] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizedContent, setOptimizedContent] = useState(null);
    const fileInputRef = useRef(null);

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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setResult(null);
            setOptimizedContent(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus('idle');
            setResult(null);
            setOptimizedContent(null);
        }
    };

    const startAnalysis = async () => {
        if (!file || !jobRole) return;
        setStatus('analyzing');
        setOptimizedContent(null);

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('role', jobRole);
            formData.append('userId', 'demo-user');

            // Updated fetch request using the environment variable
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API response was not ok: ${response.status}`);
            }

            const data = await response.json();

            const mappedResult = {
                score: data.score || 0,
                role: jobRole,
                missingSkills: data.missingSkills || [],
                missingKeywords: data.missingSkills ? data.missingSkills.slice(0, 5) : [],
                feedback: data.summary || "Analysis complete."
            };

            setResult(mappedResult);
            setStatus('complete');
        } catch (error) {
            console.error("Error analyzing resume:", error);
            setResult({
                score: 0,
                role: jobRole,
                missingSkills: ["Error analyzing"],
                missingKeywords: ["Server connection failed"],
                feedback: "There was an error communicating with the AI backend. Please ensure the server is running."
            });
            setStatus('complete');
        }
    };

    const handleOptimize = () => {
        setIsOptimizing(true);

        // Simulate AI generating an optimized resume summary/bullets
        setTimeout(() => {
            const missingSkillsText = result.missingSkills.slice(0, 2).join(" and ");
            const missingKeywordsText = result.missingKeywords.slice(0, 2).join(" and ");

            const generatedContent = {
                summary: `Dynamic and results-oriented ${result.role} with a proven track record in building scalable applications. Adept at leveraging ${missingSkillsText} to drive performance optimization. Recognized for implementing ${missingKeywordsText} to deliver robust, high-quality software solutions.`,
                bullets: result.missingSkills.map(skill => `Spearheaded the integration of ${skill}, enhancing overall system reliability and accelerating deployment cycles.`)
            };
            setOptimizedContent(generatedContent);
            setIsOptimizing(false);
        }, 2500);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-20 animate-fade-in-up">

            {/* Header */}
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold uppercase tracking-widest">
                    <Target size={16} /> Precision ATS Scanner
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight">
                    Optimize for <span className={NEON_TEXT}>Success</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
                    Upload your resume and select your target role. Our AI will tell you exactly what's missing to land the job.
                </p>
            </div>

            {/* Input Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">

                {/* File Upload */}
                <div
                    className={`md:col-span-2 ${GLASS_CLASSES} rounded-[3rem] p-10 flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
                    <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                        {file ? <CheckCircle size={40} /> : <Upload size={40} />}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                        {file ? file.name : "Drop your resume here"}
                    </h4>
                    <p className="text-slate-500 text-sm font-medium">Supports PDF, DOCX up to 10MB</p>
                </div>

                {/* Role Selection */}
                <div className={`${GLASS_CLASSES} rounded-[3rem] p-8 flex flex-col justify-between`}>
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Target Role</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-medium outline-none focus:border-cyan-500/50 transition-all appearance-none"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                            >
                                <option value="" disabled>Select a role...</option>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                <Sparkles size={12} className="text-cyan-400" /> AI Insights
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                We analyze over 500+ data points including skill density and ATS compatibility for {jobRole || "your role"}.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
                        disabled={!file || !jobRole || status === 'analyzing'}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {status === 'analyzing' ? <RefreshCw className="animate-spin" size={20} /> : "Start AI Scan"}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {status === 'analyzing' && (
                <div className="text-center py-20 space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                        <Search className="absolute inset-0 m-auto text-cyan-500 animate-pulse" size={32} />
                    </div>
                    <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
                        Extracting Text... <br /> Analyzing Skill Gaps...
                    </p>
                </div>
            )}

            {/* Results View */}
            {status === 'complete' && result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">

                    {/* Score and Overview */}
                    <div className={`${GLASS_CLASSES} p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-12`}>
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                <circle
                                    cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)}
                                    strokeLinecap="round"
                                    className={`transition-all duration-1000 ${result.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}
                                />
                            </svg>
                            <div className="absolute text-center">
                                <div className={`text-5xl font-black ${result.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{result.score}%</div>
                                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">ATS Score</div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{result.role} Analysis</h3>
                                    <p className="text-slate-400 font-medium">Compared against 1,000+ top-tier resumes</p>
                                </div>
                            </div>
                            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Sparkles size={16} className="text-violet-400" /> AI Feedback
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed italic">"{result.feedback}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Missing Skills */}
                        <div className={`${GLASS_CLASSES} p-8 rounded-[3rem] border-l-4 border-rose-500 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-32 bg-rose-500/5 blur-[80px]"></div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><AlertTriangle size={20} /></div>
                                Missing Critical Skills
                            </h4>
                            <div className="flex flex-wrap gap-3 relative z-10">
                                {result.missingSkills.map(skill => (
                                    <span key={skill} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-8 text-xs text-slate-500 font-medium leading-relaxed relative z-10">
                                These skills are highly sought after for {result.role} positions. Consider adding them to your resume if you have experience with them.
                            </p>
                        </div>

                        {/* Missing Keywords */}
                        <div className={`${GLASS_CLASSES} p-8 rounded-[3rem] border-l-4 border-amber-500 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[80px]"></div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><Search size={20} /></div>
                                Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-3 relative z-10">
                                {result.missingKeywords.map(keyword => (
                                    <span key={keyword} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-bold">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-8 text-xs text-slate-500 font-medium leading-relaxed relative z-10">
                                ATS systems scan for these specific terms. Ensure they appear naturally in your project descriptions and professional summary.
                            </p>
                        </div>

                    </div>

                    {/* Action Button */}
                    {!optimizedContent && (
                        <div className="text-center pt-8">
                            <button
                                onClick={handleOptimize}
                                disabled={isOptimizing}
                                className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 mx-auto disabled:opacity-70"
                            >
                                {isOptimizing ? (
                                    <><RefreshCw size={20} className="animate-spin" /> Optimizing Resume...</>
                                ) : (
                                    <>Optimize Resume Now <RefreshCw size={20} /></>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Optimized Content Display */}
                    {optimizedContent && (
                        <div className={`${GLASS_CLASSES} mt-8 p-10 rounded-[3rem] border-t-4 border-cyan-500 relative overflow-hidden animate-slide-up`}>
                            <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-[80px]"></div>
                            <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
                                <Sparkles className="text-cyan-400" size={24} /> AI Optimized Content
                            </h4>

                            <div className="space-y-6 relative z-10">
                                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                    <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Suggested Professional Summary</h5>
                                    <p className="text-slate-200 leading-relaxed">"{optimizedContent.summary}"</p>
                                    <button
                                        className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-white transition-colors"
                                        onClick={() => navigator.clipboard.writeText(optimizedContent.summary)}
                                    >
                                        <Copy size={14} /> Copy Summary
                                    </button>
                                </div>

                                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                    <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Suggested Bullet Points</h5>
                                    <ul className="space-y-3">
                                        {optimizedContent.bullets.map((bullet, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-200">
                                                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
};

export default ResumeScanner;
