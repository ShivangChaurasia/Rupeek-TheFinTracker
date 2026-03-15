import React, { useState, useEffect, useRef } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { getChatResponse } from '../utils/groq';
import { Sparkles, Send, Bot, User as UserIcon, RefreshCw, Trash2, BrainCircuit, Lightbulb, TrendingDown, DollarSign } from 'lucide-react';
import Lottie from 'lottie-react';
import analysisAnimation from '../Lottie/analysis.json';
import Button from '../components/Button';
import { cn } from '../utils/cn';

// Simple markdown components for better formatting
const MarkdownText = ({ text }) => {
    const lines = text.split('\n');
    return (
        <div className="space-y-4">
            {lines.map((line, i) => {
                // Table detection (very basic)
                if (line.includes('|') && line.includes('---')) return null; // skip divider
                if (line.startsWith('|')) {
                    const cells = line.split('|').filter(c => c.trim().length > 0);
                    return (
                        <div key={i} className="flex gap-2 overflow-x-auto pb-2">
                            {cells.map((cell, ci) => (
                                <div key={ci} className="bg-muted px-3 py-1 rounded-md text-sm whitespace-nowrap border border-border/50">
                                    {cell.trim()}
                                </div>
                            ))}
                        </div>
                    );
                }

                // Headers
                if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-primary mt-4">{line.replace('###', '').trim()}</h3>;
                if (line.startsWith('##')) return <h2 key={i} className="text-xl font-bold text-foreground mt-6 border-b border-border/50 pb-1">{line.replace('##', '').trim()}</h2>;
                if (line.startsWith('#')) return <h1 key={i} className="text-2xl font-bold text-foreground mt-8">{line.replace('#', '').trim()}</h1>;

                // Lists
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return (
                        <div key={i} className="flex items-start gap-2 ml-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-muted-foreground">{line.trim().substring(2)}</span>
                        </div>
                    );
                }

                // Numbered Lists
                if (/^\d+\./.test(line.trim())) {
                    const num = line.match(/^\d+\./)[0];
                    return (
                        <div key={i} className="flex items-start gap-2 ml-2">
                            <span className="font-bold text-primary shrink-0">{num}</span>
                            <span className="text-muted-foreground">{line.trim().substring(num.length).trim()}</span>
                        </div>
                    );
                }

                // Bold text
                if (line.includes('**')) {
                    const parts = line.split(/(\*\*.*?\*\*)/);
                    return (
                        <p key={i} className="text-muted-foreground leading-relaxed">
                            {parts.map((part, pi) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={pi} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    );
                }

                if (line.trim().length === 0) return null;

                return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
            })}
        </div>
    );
};

export default function AIInsights() {
    const { userProfile } = useAuth();
    const { transactions, loading: txLoading } = useTransactions();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const initialSummarySent = useRef(false);

    useEffect(() => {
        if (!txLoading && transactions.length > 0 && messages.length === 0 && !initialSummarySent.current) {
            initialSummarySent.current = true;
            handleSend("Provide a comprehensive financial summary and actionable insights based on my data.");
        }
    }, [txLoading, transactions]);

    const handleSend = async (text = input) => {
        const messageText = text.trim();
        if (!messageText) return;

        if (transactions.length === 0) {
            setError("No transactions found. Add some transactions to get AI insights!");
            return;
        }

        const newMessages = [...messages, { role: 'user', content: messageText }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await getChatResponse(newMessages, transactions, userProfile);
            setMessages([...newMessages, { role: 'assistant', content: response }]);
        } catch (err) {
            setError(err.message || "Failed to get a response. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Are you sure you want to clear the conversation?")) {
            setMessages([]);
            initialSummarySent.current = false;
        }
    };

    const suggestedQuestions = [
        { label: "Analyze my food spending", icon: TrendingDown },
        { label: "How can I save 10% next month?", icon: Lightbulb },
        { label: "Predict my end-of-month balance", icon: DollarSign },
        { label: "Summarize my recurring expenses", icon: RefreshCw }
    ];

    if (txLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0 px-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                        Rupeek Financial Advisor
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Interactive financial guidance powered by AI
                    </p>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearChat}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-4 md:p-6 shadow-inner relative group custom-scrollbar">
                {messages.length === 0 && !loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <BrainCircuit className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Start your financial conversation</h3>
                            <p className="max-w-xs text-sm text-muted-foreground">Ask anything about your spending, goals, or financial health.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md mt-8">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q.label)}
                                    className="flex items-center gap-3 p-3 bg-card hover:bg-muted border border-border/50 rounded-2xl text-sm transition-all text-left group"
                                >
                                    <q.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                    {q.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "flex gap-4 max-w-[85%] animate-in fade-in zoom-in-95 duration-300",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                                    msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                                )}>
                                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm border",
                                    msg.role === 'user' 
                                        ? "bg-primary/10 border-primary/20 rounded-tr-none" 
                                        : "bg-card/80 border-border/50 rounded-tl-none backdrop-blur-sm"
                                )}>
                                    <MarkdownText text={msg.content} />
                                </div>
                            </div>
                        ))}
                        
                        {loading && (
                            <div className="flex gap-4 max-w-[85%] animate-pulse">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                                    <Bot className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="p-4 rounded-2xl rounded-tl-none bg-card/80 border border-border/50 flex flex-col items-center justify-center min-w-[200px]">
                                    <div className="w-32 h-32">
                                        <Lottie animationData={analysisAnimation} loop={true} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Thinking...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {error ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex flex-col gap-2 animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-destructive" />
                        <p className="text-xs text-destructive">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-xs font-bold hover:underline">Dismiss</button>
                    </div>
                    <div className="text-[10px] text-destructive/60 bg-background/50 p-2 rounded-lg font-mono">
                        Build Status: {import.meta.env.VITE_GROQ_API_KEY ? "✅ Key Found" : "❌ Key Missing in Build"}
                    </div>
                </div>
            ) : null}


            {/* Input Area */}
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="shrink-0 p-2 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl flex gap-2 items-center shadow-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all"
            >
                <input 
                    type="text" 
                    placeholder="Ask about your financial health..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm placeholder:text-muted-foreground"
                />
                <Button 
                    type="submit" 
                    size="sm" 
                    disabled={loading || !input.trim()}
                    className="rounded-2xl gap-2 h-10 px-6"
                >
                    <span className="hidden md:inline">Ask AI</span>
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
