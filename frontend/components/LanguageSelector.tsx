import React from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { LanguageSelectorProps } from '@/type';

const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
];

export default function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="appearance-none bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all w-48"
            >
                {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                        {lang.name}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
}
