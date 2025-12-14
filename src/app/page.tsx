'use client';

import { useState } from 'react';
import { Sparkles, Github, AlertCircle } from 'lucide-react';
import { RepoInput, Loader2 } from '@/components/RepoInput';
import { SectionSelector, DEFAULT_SECTIONS, SectionSelection } from '@/components/SectionSelector';
import { ToneSelector, Tone } from '@/components/ToneSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ReadmePreview } from '@/components/ReadmePreview';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [sections, setSections] = useState<SectionSelection>(DEFAULT_SECTIONS);
  const [tone, setTone] = useState<Tone>('professional');
  const [language, setLanguage] = useState('English');
  const [readme, setReadme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    const hasSelectedSections = Object.values(sections).some(v => v);
    if (!hasSelectedSections) {
      setError('Please select at least one section');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReadme(null);

    try {
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          sections,
          tone,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      setReadme(data.readme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/icon.png"
              alt="README Generator Logo"
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-white">README Generator</h1>
              <p className="text-xs text-gray-400">AI-powered documentation</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-6">
            {/* Hero Text */}
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-white">
                Generate a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Professional README
                </span>
              </h2>
              <p className="text-gray-400">
                Enter a public GitHub repository URL and let AI create a comprehensive README.md based on your codebase.
              </p>
            </div>

            {/* Repository URL Input */}
            <RepoInput
              value={repoUrl}
              onChange={setRepoUrl}
              disabled={isLoading}
            />

            {/* Section Selector */}
            <SectionSelector
              value={sections}
              onChange={setSections}
              disabled={isLoading}
            />

            {/* Tone and Language Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToneSelector
                value={tone}
                onChange={setTone}
                disabled={isLoading}
              />
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-900/30 border border-red-800">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">Error</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !repoUrl.trim()}
              className={`
                w-full py-4 rounded-lg font-semibold text-white
                flex items-center justify-center gap-3
                transition-all duration-200
                ${isLoading || !repoUrl.trim()
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating README...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate README
                </>
              )}
            </button>

            {/* Info Note */}
            <p className="text-xs text-gray-500 text-center">
              ✨ Uses a single AI call for cost-efficient generation • Only public repositories supported
            </p>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:h-[calc(100vh-12rem)] lg:sticky lg:top-24">
            <ReadmePreview
              content={readme}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>
            Built with Next.js, Tailwind CSS, and Google Gemini AI
          </p>
          <p className="mt-2">
            Created by{' '}
            <a
              href="https://leolaborie.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Leo Laborie
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
