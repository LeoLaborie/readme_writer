'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Code, Eye, Copy, Download, Check } from 'lucide-react';

interface ReadmePreviewProps {
    content: string | null;
    isLoading?: boolean;
}

export function ReadmePreview({ content, isLoading }: ReadmePreviewProps) {
    const [tab, setTab] = useState<'preview' | 'raw'>('preview');
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!content) return;

        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        if (!content) return;

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-200 font-medium">Generating README...</p>
                        <p className="text-sm text-gray-500">Analyzing repository and crafting content</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="text-center space-y-2 max-w-sm px-4">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-300 font-medium">Your README will appear here</p>
                    <p className="text-sm text-gray-500">
                        Enter a GitHub repository URL, select your preferred sections, and click Generate
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/50">
                <div className="flex gap-1">
                    <button
                        onClick={() => setTab('preview')}
                        className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
              transition-colors duration-200
              ${tab === 'preview'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }
            `}
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </button>
                    <button
                        onClick={() => setTab('raw')}
                        className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
              transition-colors duration-200
              ${tab === 'raw'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }
            `}
                    >
                        <Code className="h-4 w-4" />
                        Raw
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {tab === 'preview' ? (
                    <div className="prose prose-invert prose-purple max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {content}
                    </pre>
                )}
            </div>
        </div>
    );
}
