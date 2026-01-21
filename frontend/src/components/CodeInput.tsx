import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import py from 'react-syntax-highlighter/dist/cjs/languages/hljs/python';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('python', py);

import { CodeInputProps } from '../type';

export default function CodeInput({ value, language, onChange, disabled, placeholder }: CodeInputProps) {
    return (
        <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500 transition-all">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder || "Paste your code here..."}
                style={{
                    paddingLeft: '52px',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '22px',
                    overflowX: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    tabSize: 4,
                }}
                className="absolute inset-0 w-full h-full pr-4 bg-transparent text-transparent caret-white resize-none focus:outline-none z-10"
                spellCheck={false}
            />
            <div
                className="min-h-[300px] pointer-events-none"
            >
                <SyntaxHighlighter
                    language={language}
                    style={atomOneDark}
                    showLineNumbers={true}
                    wrapLines={true}
                    wrapLongLines={true}
                    lineNumberStyle={{
                        width: '40px',
                        minWidth: '40px',
                        paddingRight: '12px',
                        color: "#475569",
                        textAlign: "right",
                        userSelect: "none",
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        borderRight: "1px solid rgba(51, 65, 85, 0.5)",
                        position: 'absolute',
                        left: 0,
                    }}
                    customStyle={{
                        background: 'transparent',
                        padding: '16px 16px 16px 52px',
                        margin: 0,
                        fontSize: '14px',
                        lineHeight: '22px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        overflowX: 'hidden',
                        fontFamily: 'monospace',
                    }}
                    codeTagProps={{
                        style: {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            lineHeight: '22px',
                        }
                    }}
                >
                    {value || ' '}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
