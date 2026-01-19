"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import CodeInput from '@/components/CodeInput';
import FileUpload from '@/components/FileUpload';
import LanguageSelector from '@/components/LanguageSelector';
import ReviewOutput from '@/components/ReviewOutput';
import LoadingSpinner from '@/components/LoadingSpinner';
import SessionHistory from '@/components/SessionHistory';
import { reviewCode, reviewFile, generateCode } from '@/lib/api';
import { ReviewResult, GenerationResult } from '@/type';

export default function ReviewerPage() {
    const [mode, setMode] = useState<'review' | 'generate'>('review');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ReviewResult | null>(null);
    const [genResult, setGenResult] = useState<GenerationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!code.trim()) {
            setError(mode === 'review' ? 'Please enter some code to review' : 'Please describe the code you want to generate');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            if (mode === 'review') {
                const data = await reviewCode(code, language);
                setResult(data);
                setGenResult(null);
            } else {
                const data = await generateCode(code, language);
                setGenResult(data);
                setResult(null);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (mode === 'generate') {
            setError('File upload is only available in Review mode');
            return;
        }
        // Auto-detect language
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (ext === '.py') setLanguage('python');
        else if (ext === '.ts') setLanguage('typescript');
        else setLanguage('javascript');

        // Read file content for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setCode(e.target.result as string);
            }
        };
        reader.readAsText(file);

        setLoading(true);
        setError(null);
        try {
            // Directly analyze file via API
            const data = await reviewFile(file);
            setResult(data);
            setGenResult(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong processing the file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                        <span className="font-semibold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Smart Code AI
                        </span>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Mode Tabs */}
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit mb-8">
                    <button
                        onClick={() => setMode('review')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'review'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Code Reviewer
                    </button>
                    <button
                        onClick={() => setMode('generate')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'generate'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Code Generator
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Input */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                {mode === 'review' ? 'Submit Code' : 'Generate Code'}
                            </h1>
                            <p className="text-slate-400 mt-2">
                                {mode === 'review'
                                    ? 'Paste your code or upload a file for instant AI analysis.'
                                    : 'Describe the logic or feature you want to build and AI will write the code.'}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                <LanguageSelector
                                    value={language}
                                    onChange={setLanguage}
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !code.trim()}
                                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            {mode === 'review' ? 'Review Code' : 'Generate'}
                                        </>
                                    )}
                                </button>
                            </div>

                            {mode === 'review' && (
                                <FileUpload onFileSelect={handleFileUpload} disabled={loading} />
                            )}

                            <div className="relative">
                                {mode === 'review' && (
                                    <div className="absolute top-0 right-0 px-4 py-2 text-xs text-slate-500 z-20 pointer-events-none">
                                        {code.split('\n').length} lines
                                    </div>
                                )}
                                <CodeInput
                                    code={code}
                                    language={language}
                                    onChange={setCode}
                                    disabled={loading}
                                    placeholder={mode === 'review'
                                        ? 'Paste your code snippet here...'
                                        : 'Example: Create a function that calculates the factorial of a number using recursion...'}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Output */}
                    <div className="lg:pl-8 lg:border-l border-slate-800">
                        {loading ? (
                            <div className="h-full flex items-center justify-center min-h-[400px]">
                                <LoadingSpinner />
                            </div>
                        ) : result ? (
                            <ReviewOutput result={result} />
                        ) : genResult ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                                <Sparkles className="w-4 h-4 text-primary-500" />
                                            </div>
                                            <h3 className="font-semibold text-slate-100 uppercase tracking-wider text-xs">Generated Code</h3>
                                        </div>
                                        <div className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 font-mono uppercase">
                                            {genResult.language}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <ReviewOutput result={{
                                            score: 10,
                                            issues: [],
                                            suggestions: [],
                                            reasoning: genResult.explanation,
                                            language: genResult.language
                                        }} codeToDisplay={genResult.code} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4 text-center p-8">
                                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                                    <Sparkles className="w-8 h-8 opacity-20" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-slate-300">
                                        {mode === 'review' ? 'Ready to Analyze' : 'Ready to Generate'}
                                    </h3>
                                    <p className="text-sm mt-1 max-w-xs mx-auto">
                                        {mode === 'review'
                                            ? 'Submit your code to receive a comprehensive quality score, issue detection, and improvement suggestions.'
                                            : 'Tell AI what you want to build, and it will generate high-quality code and explanations for you.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Section */}
                <SessionHistory
                    currentReview={result}
                    onSelectReview={(review) => {
                        setResult(review);
                        setGenResult(null);
                        setMode('review');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            </main>
        </div>
    );
}
