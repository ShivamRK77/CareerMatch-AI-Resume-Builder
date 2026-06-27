import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

const GLASS_CLASSES = "bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]";
const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400";

const YogiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'yogi', content: "Hi there! I'm Yogi, your career coach. What job role are you curious about today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages
                }),
            });

            if (!response.ok) throw new Error("API Error");

            const data = await response.json();
            setMessages([...newMessages, { role: 'yogi', content: data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...newMessages, { role: 'yogi', content: "Oops! I'm having trouble connecting right now. Let's try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className={`${GLASS_CLASSES} w-[350px] sm:w-[400px] h-[500px] rounded-2xl flex flex-col mb-4 overflow-hidden animate-slide-up`}>
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Bot className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-tight">Yogi</h3>
                                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles size={10} /> AI Career Coach
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors p-2"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-tr-sm shadow-md' 
                                    : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-sm'
                                }`}>
                                    <div className="flex items-center gap-2 mb-1 opacity-60">
                                        {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                        <span className="text-[10px] uppercase font-bold tracking-wider">
                                            {msg.role === 'user' ? 'You' : 'Yogi'}
                                        </span>
                                    </div>
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 text-slate-200 border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Yogi anything..."
                                disabled={isLoading}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-500 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-full text-white disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-md"
                            >
                                <Send size={16} className={isLoading ? 'animate-pulse' : ''} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 transition-all group animate-bounce"
                >
                    <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default YogiChatbot;
