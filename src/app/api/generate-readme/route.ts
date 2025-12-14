// API route for README generation
// Orchestrates GitHub fetching, preprocessing, and LLM generation

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepository } from '@/lib/github';
import { preprocessRepoData } from '@/lib/preprocessor';
import { generateReadme, SectionSelection, Tone } from '@/lib/llm';

interface RequestBody {
    repoUrl: string;
    sections: SectionSelection;
    tone: Tone;
    language: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();

        // Validate required fields
        if (!body.repoUrl) {
            return NextResponse.json(
                { error: 'Repository URL is required' },
                { status: 400 }
            );
        }

        if (!body.sections || typeof body.sections !== 'object') {
            return NextResponse.json(
                { error: 'Section selection is required' },
                { status: 400 }
            );
        }

        if (!body.tone) {
            return NextResponse.json(
                { error: 'Tone selection is required' },
                { status: 400 }
            );
        }

        if (!body.language) {
            return NextResponse.json(
                { error: 'Language selection is required' },
                { status: 400 }
            );
        }

        // Step 1: Fetch repository data from GitHub
        console.log('Fetching repository data...');
        const repoData = await analyzeRepository(body.repoUrl);

        // Step 2: Preprocess the data
        console.log('Preprocessing repository data...');
        const context = preprocessRepoData(repoData);

        // Step 3: Generate README with LLM
        console.log('Generating README with LLM...');
        const readme = await generateReadme(
            context,
            body.sections,
            body.tone,
            body.language
        );

        return NextResponse.json({
            success: true,
            readme,
            metadata: {
                repoName: context.repoName,
                fullName: context.fullName,
                detectedTechStack: context.techStack,
            },
        });

    } catch (error) {
        console.error('Error generating README:', error);

        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        // Determine appropriate status code
        let statusCode = 500;
        if (errorMessage.includes('not found')) {
            statusCode = 404;
        } else if (errorMessage.includes('rate limit')) {
            statusCode = 429;
        } else if (errorMessage.includes('Invalid')) {
            statusCode = 400;
        } else if (errorMessage.includes('GEMINI_API_KEY')) {
            statusCode = 503;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}
