import React, { useState } from 'react';
import { Briefcase, Mic, Sparkles, Compass, Home as HomeIcon, Book, LogIn, X, User, ShieldCheck, Mail, Lock, ScanText } from 'lucide-react';
import JobMatcher from './JobMatcher';
import InterviewSimulator from './InterviewSimulator';
import SkillRoadmap from './SkillRoadmap';
import ResumeScanner from './ResumeScanner';
import Home from './Home';
import Docs from './Docs';
import YogiChatbot from './YogiChatbot';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'job-matcher', 'interview-simulator', 'skill-roadmap', 'docs', 'scanner'
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [user, setUser] = useState(null); // Mock user state

  const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
  const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

  const handleSignIn = (e) => {
    e.preventDefault();
    // Mock Sign In
    setUser({ name: 'Demo User', email: 'demo@example.com' });
    setIsSignInOpen(false);
    setActiveTab('job-matcher'); // Redirect to dashboard/matcher after sign in
  };

  const handleSignOut = () => {
    setUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
        <div className={`max-w-[90rem] mx-auto flex items-center justify-between px-8 py-4 rounded-3xl ${GLASS_CLASSES}`}>
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              CareerMatch <span className={NEON_TEXT}>AI</span>
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="hidden lg:flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeTab === 'home' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HomeIcon size={14} /> Home
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeTab === 'scanner' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ScanText size={14} /> Scanner
            </button>
            <button
              onClick={() => setActiveTab('job-matcher')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeTab === 'job-matcher' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase size={14} /> Job Matcher
            </button>
            <button
              onClick={() => setActiveTab('interview-simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeTab === 'interview-simulator' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mic size={14} /> Interview Sim
            </button>
            <button
              onClick={() => setActiveTab('skill-roadmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeTab === 'skill-roadmap' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={14} /> Roadmap
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('docs')}
              className={`hidden md:flex items-center gap-2 text-sm font-bold transition-colors ${
                activeTab === 'docs' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Book size={18} /> Docs
            </button>
            <div className="hidden md:block w-px h-4 bg-white/10"></div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <User size={16} className="text-cyan-400" />
                  <span className="text-sm font-bold text-white">{user.name}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSignInOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <LogIn size={18} /> Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-20">
        {activeTab === 'home' && <Home />}
        {activeTab === 'scanner' && <ResumeScanner />}
        {activeTab === 'job-matcher' && <JobMatcher userId="demo-user" />}
        {activeTab === 'interview-simulator' && <InterviewSimulator />}
        {activeTab === 'skill-roadmap' && <SkillRoadmap />}
        {activeTab === 'docs' && <Docs />}
      </main>

      <YogiChatbot />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm font-medium">
          <div className="flex items-center gap-2">
             © 2026 CareerMatch AI. All rights reserved.
          </div>
          <div className="flex items-center gap-8 font-bold">
            <button onClick={() => setActiveTab('docs')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveTab('docs')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => setActiveTab('docs')} className="hover:text-white transition-colors">Contact Support</button>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className={`${GLASS_CLASSES} w-full max-w-md p-10 rounded-[3rem] relative animate-slide-up`}>
            <button 
              onClick={() => setIsSignInOpen(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/20">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h3>
              <p className="text-slate-400 font-medium">Securely access your career profile</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Sign In to Dashboard
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account? <button className="text-cyan-400 font-bold hover:underline">Create Account</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
