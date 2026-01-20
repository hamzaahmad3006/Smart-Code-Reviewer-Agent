import React, { useState } from 'react';
import { AlertCircle, Lightbulb, Copy, Check, MessageSquare, Send, Bot, User } from 'lucide-react';
import { clsx } from 'clsx';
import { ReviewResult, ReviewOutputProps, ChatMessage } from '@/type';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { chatWithAI } from '@/lib/api';

export default function ReviewOutput({ result, codeToDisplay }: ReviewOutputProps) {
    const [copied, setCopied] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);

    const getScoreColor = (score: number) => {
        if (score >= 9) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
        if (score >= 7) return 'text-primary-400 border-primary-500/50 bg-primary-500/10';
        if (score >= 4) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
        return 'text-red-400 border-red-500/50 bg-red-500/10';
    };

    const copyToClipboard = () => {
        const text = codeToDisplay
            ? codeToDisplay
            : `Score: ${result.score}/10\n\nIssues:\n${result.issues.map(i => `- ${i}`).join('\n')}\n\nSuggestions:\n${result.suggestions.map(s => `- ${s}`).join('\n')}\n\nReasoning:\n${result.reasoning}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isSending) return;

        const userMsg: ChatMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsSending(true);

        try {
            const reviewContext = `Result Score: ${result.score}/10. Issues: ${result.issues.join(', ')}. Suggestions: ${result.suggestions.join(', ')}. Reasoning: ${result.reasoning}`;
            const response = await chatWithAI(
                codeToDisplay || "",
                reviewContext,
                [...messages, userMsg],
                result.language
            );

            setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I encountered an error while processing your request. Please check your connection."
            }]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Score */}
            {!codeToDisplay && (
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Review Results
                        </h2>
                        <p className="text-slate-400 mt-1">
                            Component analysis for <span className="text-primary-400 uppercase font-mono text-xs px-2 py-0.5 rounded bg-primary-500/10 border border-primary-500/20">{result.language}</span>
                        </p>
                    </div>
                    <div className={clsx(
                        "flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 backdrop-blur-sm",
                        getScoreColor(result.score)
                    )}>
                        <span className="text-4xl font-bold">{result.score}</span>
                        <span className="text-xs uppercase font-medium opacity-80 mt-1">/ 10</span>
                    </div>
                </div>
            )}

            {/* Generated Code Preview (if applicable) */}
            {codeToDisplay && (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
                    <SyntaxHighlighter
                        language={result.language}
                        style={atomOneDark}
                        customStyle={{
                            background: 'transparent',
                            padding: '1.5rem',
                            fontSize: '0.9rem',
                            margin: 0,
                        }}
                    >
                        {codeToDisplay}
                    </SyntaxHighlighter>
                </div>
            )}

            {/* Reasoning / Explanation */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    {codeToDisplay ? 'How it works' : 'Analysis Summary'}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                    {result.reasoning}
                </p>
            </div>

            {!codeToDisplay && (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Issues */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400">
                            <AlertCircle className="w-5 h-5" />
                            Issues Detected
                        </h3>
                        <div className="space-y-3">
                            {result.issues.map((issue, idx) => (
                                <div key={idx} className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 text-slate-300 text-sm">
                                    <div className="flex gap-3">
                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                                        <p>{issue}</p>
                                    </div>
                                </div>
                            ))}
                            {result.issues.length === 0 && (
                                <div className="text-slate-500 italic p-4 text-center border border-slate-800 rounded-lg">
                                    No major issues found. Great job!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
                            <Lightbulb className="w-5 h-5" />
                            Suggested Improvements
                        </h3>
                        <div className="space-y-3">
                            {result.suggestions.map((suggestion, idx) => (
                                <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4 text-slate-300 text-sm">
                                    <div className="flex gap-3">
                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                                        <p>{suggestion}</p>
                                    </div>
                                </div>
                            ))}
                            {result.suggestions.length === 0 && (
                                <div className="text-slate-500 italic p-4 text-center border border-slate-800 rounded-lg">
                                    No immediate suggestions for improvement.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? (codeToDisplay ? 'Code Copied!' : 'Copied!') : (codeToDisplay ? 'Copy Code' : 'Copy review summary')}
                </button>
            </div>

            {/* Chat Follow-up Section */}
            <div className="mt-8 pt-8 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-6 text-slate-300">
                    <MessageSquare className="w-5 h-5 text-primary-400" />
                    <h3 className="text-lg font-semibold">Follow-up Questions</h3>
                </div>

                <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md">
                    {/* Chat Messages */}
                    <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <Bot className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">Have any questions about this review or the code? Ask me anything!</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    "flex gap-3 animate-in fade-in slide-in-from-top-1 duration-300",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === 'user' ? "bg-primary-500/20 text-primary-400" : "bg-slate-800 text-slate-400"
                                )}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={clsx(
                                    "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-primary-600/20 text-primary-100 rounded-tr-none border border-primary-500/20"
                                        : "bg-slate-800/50 text-slate-200 rounded-tl-none border border-slate-700/30"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isSending && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-slate-800/50 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700/30">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/60 border-t border-slate-800 flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            disabled={isSending}
                            className="bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-hidden focus:border-primary-500/50 flex-grow transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isSending}
                            className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-700 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
