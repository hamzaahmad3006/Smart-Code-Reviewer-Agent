import React, { useEffect, useState } from 'react';
import { History, Clock, Trash2, ArrowRight } from 'lucide-react';
import { ReviewResult, SessionHistoryProps, StoredReview } from '@/type';

export default function SessionHistory({ onSelectReview, currentReview }: SessionHistoryProps) {
    const [history, setHistory] = useState<StoredReview[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('review_history');
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (currentReview) {
            setHistory(prev => {

                if (prev.length > 0 && prev[0].reasoning === currentReview.reasoning) {
                    return prev;
                }

                const newEntry: StoredReview = {
                    ...currentReview,
                    id: Date.now().toString(),
                    timestamp: Date.now()
                };
                const newHistory = [newEntry, ...prev].slice(0, 10);
                localStorage.setItem('review_history', JSON.stringify(newHistory));
                return newHistory;
            });
        }
    }, [currentReview]);

    const clearHistory = () => {
        if (window.confirm('Clear all history?')) {
            setHistory([]);
            localStorage.removeItem('review_history');
        }
    };

    if (history.length === 0) return null;

    return (
        <div className="mt-8 border-t border-slate-800 pt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    <History className="w-4 h-4" />
                    Recent Reviews
                </h3>
                <button
                    onClick={clearHistory}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                    Clear History
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((review) => (
                    <button
                        key={review.id}
                        onClick={() => onSelectReview(review)}
                        className="group flex flex-col items-start p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800 transition-all text-left w-full"
                    >
                        <div className="flex items-center justify-between w-full mb-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${review.score >= 7 ? 'text-emerald-400 bg-emerald-500/10' :
                                review.score >= 4 ? 'text-amber-400 bg-amber-500/10' :
                                    'text-red-400 bg-red-500/10'
                                }`}>
                                Score: {review.score}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                {new Date(review.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-sm text-slate-300 line-clamp-2 mb-2">
                            {review.reasoning}
                        </p>
                        <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-slate-800/50">
                            <span className="text-xs text-slate-500 font-mono">
                                {review.language}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
