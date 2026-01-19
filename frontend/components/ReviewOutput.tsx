import React, { useState } from 'react';
import { AlertCircle, Lightbulb, Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { ReviewResult, ReviewOutputProps } from '@/type';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function ReviewOutput({ result, codeToDisplay }: ReviewOutputProps) {
    const [copied, setCopied] = useState(false);

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
        </div>
    );
}
