import React, { useRef, useState } from 'react';
import { Upload, X, FileCode } from 'lucide-react';
import { clsx } from 'clsx';

import { FileUploadProps } from '@/type';

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
        // Check size (1MB)
        if (file.size > 1024 * 1024) {
            alert("File size exceeds 1MB limit");
            return;
        }

        // Check extension
        const validExtensions = ['.js', '.ts', '.py'];
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!validExtensions.includes(ext)) {
            alert(`Invalid file type. Allowed: ${validExtensions.join(', ')}`);
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            {!selectedFile ? (
                <div
                    className={clsx(
                        "relative border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer",
                        dragActive
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept=".js,.ts,.py"
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-slate-800 rounded-full text-primary-400">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-200">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                JavaScript, TypeScript, Python (max 1MB)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-xl relative overflow-hidden group">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-primary-500/20 text-primary-400 rounded-lg">
                            <FileCode className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-200 text-sm">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-400">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={clearFile}
                        disabled={disabled}
                        className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
