import React from 'react';
import Link from 'next/link';
import { useHistory } from './useHistory';
import ReviewOutput from '../../components/ReviewOutput';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';

import ProtectedRoute from '../../components/ProtectedRoute';

export default function HistoryPage() {
    const { session, isLoading, isMounted } = useHistory();

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Session Not Found</h1>
                <Link href="/dashboard" className="text-primary-400 hover:text-primary-300">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    <header className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 hover:bg-slate-900 rounded-full transition-colors">
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-8 h-8 text-primary-400" />
                                    Review History
                                </h1>
                                <p className="text-slate-400">Review from {new Date(session.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </header>

                    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Code Section */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Original Code</h3>
                            <pre className="text-sm font-mono text-slate-300 overflow-auto max-h-[600px] whitespace-pre-wrap">
                                {session.code || '// No code found for this session'}
                            </pre>
                        </div>

                        {/* Analysis Section */}
                        <div className="h-full">
                            <ReviewOutput
                                result={{
                                    score: session.score ?? 0,
                                    issues: session.issues || [],
                                    suggestions: session.suggestions || [],
                                    reasoning: session.reasoning || session.review_context || "No detailed reasoning available.",
                                    language: session.language || "javascript",
                                    session_id: session.id
                                }}
                                codeContext={session.code}
                                initialMessages={session.messages || []}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
