import React, { useRef, useState } from 'react';
import { Upload, X, FileCode } from 'lucide-react';
import { clsx } from 'clsx';

import { FileUploadProps } from '../type';

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSelect(e.target.files[0]);
        }
    };

    const validateAndSelect = (file: File) => {
        if (file.size > 1024 * 1024) {
            alert("File size exceeds 1MB limit");
            return;
        }

        const validExtensions: Record<string, string> = {
            '.js': 'javascript',
            '.ts': 'typescript',
            '.py': 'python',
            '.html': 'html',
            '.css': 'css',
            '.json': 'json',
            '.c': 'c',
            '.cpp': 'cpp',
            '.php': 'php'
        };
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!(ext in validExtensions)) {
            alert(`Invalid file type. Allowed: ${Object.keys(validExtensions).join(', ')}`);
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            onFileSelect(content, validExtensions[ext]);
        };
        reader.readAsText(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".js,.ts,.py,.html,.css,.json,.c,.cpp,.php"
                onChange={handleChange}
                disabled={disabled}
            />

            {!selectedFile ? (
                <button
                    onClick={() => !disabled && inputRef.current?.click()}
                    disabled={disabled}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:border-primary-500/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        dragActive && "border-primary-500 bg-primary-500/10"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    title="Upload File"
                >
                    <Upload className="w-5 h-5 text-primary-400" />
                    <span className="hidden md:inline font-medium text-sm">Upload File</span>
                </button>
            ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg animate-in fade-in zoom-in duration-200">
                    <FileCode className="w-4 h-4 text-primary-400" />
                    <span className="text-xs font-medium text-primary-300 max-w-[100px] truncate">
                        {selectedFile.name}
                    </span>
                    <button
                        onClick={clearFile}
                        className="p-1 hover:bg-primary-500/20 rounded-full transition-colors text-primary-400"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
