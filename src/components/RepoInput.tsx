'use client';

import { useState } from 'react';
import { Github, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RepoInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function RepoInput({ value, onChange, disabled }: RepoInputProps) {
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const validateUrl = (url: string) => {
        if (!url) {
            setIsValid(null);
            return;
        }

        // Check if it's a valid GitHub URL
        const patterns = [
            /^https?:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/,
            /^github\.com\/[^\/]+\/[^\/]+\/?$/,
            /^[^\/]+\/[^\/]+$/,
        ];

        const valid = patterns.some(pattern => pattern.test(url.trim()));
        setIsValid(valid);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        validateUrl(newValue);
    };

    return (
        <div className="space-y-2">
            <label
                htmlFor="repo-url"
                className="block text-sm font-medium text-gray-200"
            >
                GitHub Repository URL
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id="repo-url"
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="https://github.com/owner/repo"
                    disabled={disabled}
                    className={`
            w-full pl-10 pr-10 py-3 
            bg-gray-800/50 border rounded-lg
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${isValid === false ? 'border-red-500' : isValid === true ? 'border-green-500' : 'border-gray-600'}
          `}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isValid === false && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {isValid === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                </div>
            </div>
            {isValid === false && (
                <p className="text-sm text-red-400">
                    Please enter a valid GitHub repository URL
                </p>
            )}
        </div>
    );
}

export { Loader2 };
