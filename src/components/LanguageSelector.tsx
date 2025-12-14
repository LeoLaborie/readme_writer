'use client';

import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

const COMMON_LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'ru', label: 'Русский' },
    { code: 'ar', label: 'العربية' },
    { code: 'hi', label: 'हिन्दी' },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
    const [isCustom, setIsCustom] = useState(false);
    const [customValue, setCustomValue] = useState('');

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        if (selected === 'custom') {
            setIsCustom(true);
        } else {
            setIsCustom(false);
            onChange(selected);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomValue(val);
        onChange(val);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
                Language
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    value={isCustom ? 'custom' : value}
                    onChange={handleSelect}
                    disabled={disabled}
                    className="
            w-full pl-10 pr-10 py-3 
            bg-gray-800/50 border border-gray-600 rounded-lg
            text-white
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            transition-all duration-200
          "
                >
                    {COMMON_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.label}>
                            {lang.label}
                        </option>
                    ))}
                    <option value="custom">Other (type below)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            {isCustom && (
                <input
                    type="text"
                    value={customValue}
                    onChange={handleCustomChange}
                    placeholder="Enter language name"
                    disabled={disabled}
                    className="
            w-full px-4 py-2 
            bg-gray-800/50 border border-gray-600 rounded-lg
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
                />
            )}
        </div>
    );
}
