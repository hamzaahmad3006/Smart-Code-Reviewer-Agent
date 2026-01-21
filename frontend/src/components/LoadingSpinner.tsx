import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <p className="text-slate-400 text-sm font-medium animate-pulse">
                Analyzing your code...
            </p>
        </div>
    );
}
