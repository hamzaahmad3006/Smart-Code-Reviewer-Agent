import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import py from 'react-syntax-highlighter/dist/cjs/languages/hljs/python';
import html from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/cjs/languages/hljs/css';
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json';
import c from 'react-syntax-highlighter/dist/cjs/languages/hljs/c';
import cpp from 'react-syntax-highlighter/dist/cjs/languages/hljs/cpp';
import php from 'react-syntax-highlighter/dist/cjs/languages/hljs/php';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('python', py);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('php', php);

import { CodeInputProps } from '../type';

export default function CodeInput({ value, language, onChange, disabled, placeholder }: CodeInputProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const preRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (textareaRef.current && preRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const commonStyles: React.CSSProperties = {
        padding: '16px 16px 16px 52px',
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: '14px',
        lineHeight: '22px',
        tabSize: 4,
        whiteSpace: 'pre',
        wordBreak: 'normal',
        wordWrap: 'normal',
        overflowWrap: 'anywhere',
    };

    return (
        <div className="relative rounded-xl border border-slate-700 bg-slate-900 group focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500 transition-all h-[500px] overflow-hidden">
            <div className="relative w-full h-full overflow-hidden">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onScroll={handleScroll}
                    disabled={disabled}
                    placeholder={placeholder || "Paste your code here..."}
                    style={{
                        ...commonStyles,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        background: 'transparent',
                        color: 'transparent',
                        caretColor: 'white',
                        resize: 'none',
                        outline: 'none',
                        overflowX: 'auto',
                        overflowY: 'auto',
                    }}
                    className="scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                    spellCheck={false}
                    wrap="off"
                />
                <div
                    ref={preRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <SyntaxHighlighter
                        language={language}
                        style={atomOneDark}
                        showLineNumbers={true}
                        wrapLines={false}
                        lineNumberStyle={{
                            width: '40px',
                            minWidth: '40px',
                            paddingRight: '12px',
                            color: "#475569",
                            textAlign: "right",
                            userSelect: "none",
                            backgroundColor: "rgba(15, 23, 42, 1)",
                            borderRight: "1px solid rgba(51, 65, 85, 0.5)",
                            position: 'absolute',
                            left: 0,
                        }}
                        customStyle={{
                            ...commonStyles,
                            margin: 0,
                            background: 'transparent',
                            minHeight: '100%',
                            width: 'max-content',
                        }}
                        codeTagProps={{
                            style: {
                                padding: 0,
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                lineHeight: 'inherit',
                            }
                        }}
                    >
                        {value || ' '}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}
