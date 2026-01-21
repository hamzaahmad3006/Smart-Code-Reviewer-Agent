import React, { useEffect, useState } from 'react';
import { getSessions } from '../../lib/api';
import { History, Code, Calendar, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import UserAvatar from '../../components/UserAvatar';

import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const fetchSessions = async () => {
            try {
                const data = await getSessions();
                setSessions(data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, [isMounted]);

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-950 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Your Dashboard</h1>
                            <p className="text-slate-400 text-lg">Manage your code review history and follow-ups</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
                            >
                                <Code className="w-5 h-5" />
                                New Review
                            </Link>
                            <UserAvatar />
                        </div>
                    </div>

                    {sessions.length === 0 ? (
                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-16 text-center backdrop-blur-md">
                            <History className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                            <h2 className="text-2xl font-semibold text-white mb-3">No reviews yet</h2>
                            <p className="text-slate-500 max-w-md mx-auto mb-8">
                                Start your first AI-powered code review to see your history here.
                            </p>
                            <Link
                                href="/"
                                className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center gap-2"
                            >
                                Analyze your first code snippet <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sessions.map((session) => (
                                <Link
                                    key={session.id}
                                    href={`/history/${session.id}`}
                                    className="group bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-primary-500/50 hover:bg-slate-800/40 transition-all backdrop-blur-md"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-700 group-hover:border-primary-500/30 transition-colors">
                                            <Code className="w-6 h-6 text-primary-400" />
                                        </div>
                                        <span className="text-xs font-mono uppercase px-2 py-1 bg-primary-500/10 text-primary-400 rounded-md border border-primary-500/20">
                                            {session.language}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-300 transition-colors line-clamp-1">
                                        Review #{session.id.slice(-6)}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(session.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <MessageSquare className="w-4 h-4" />
                                            {session.message_count} follow-up messages
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
