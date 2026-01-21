import React from 'react';
import CodeInput from '../../components/CodeInput';
import ReviewOutput from '../../components/ReviewOutput';
import LanguageSelector from '../../components/LanguageSelector';
import FileUpload from '../../components/FileUpload';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useReviewer } from '../../hooks/useReviewer';
import { ArrowLeft, Sparkles, Code2 } from 'lucide-react';
import Link from 'next/link';
import UserAvatar from '../../components/UserAvatar';

export default function ReviewerPage() {
    const {
        code,
        setCode,
        language,
        setLanguage,
        result,
        isLoading,
        error,
        isMounted,
        handleReview
    } = useReviewer();

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-slate-900 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-8 h-8 text-primary-400" />
                                Code Analyzer
                            </h1>
                            <p className="text-slate-400">Powered by Multi-Agent AI Workflow</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSelector value={language} onChange={setLanguage} />
                        <FileUpload onFileSelect={(c: string, l: string) => { setCode(c); setLanguage(l); }} />
                        <UserAvatar />
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
                            <CodeInput
                                value={code}
                                onChange={setCode}
                                language={language}
                            />
                        </div>
                        <button
                            onClick={handleReview}
                            disabled={isLoading || !code.trim()}
                            className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><LoadingSpinner /> Analyzing...</>
                            ) : (
                                <><Sparkles className="w-5 h-5" /> Analyze Code</>
                            )}
                        </button>
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm italic">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="h-full">
                        {result ? (
                            <ReviewOutput result={result} codeContext={code} />
                        ) : (
                            <div className="h-[600px] flex flex-col items-center justify-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-slate-500 space-y-4">
                                <Code2 className="w-16 h-16 opacity-20" />
                                <p className="text-sm">Input your code and click analyze to see results</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
