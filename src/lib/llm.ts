// LLM service using Google Gemini
// Single LLM call for cost-efficient README generation

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ProcessedContext } from './preprocessor';

export interface SectionSelection {
    title_description: boolean;
    installation: boolean;
    usage: boolean;
    features: boolean;
    tech_stack: boolean;
    configuration: boolean;
    api_documentation: boolean;
    contributing: boolean;
    license: boolean;
    badges: boolean;
}

export type Tone = 'professional' | 'friendly' | 'technical' | 'marketing';

const SECTION_INSTRUCTIONS: Record<keyof SectionSelection, string> = {
    title_description: 'Title & Description: Project name as heading, concise description of what the project does.',
    installation: 'Installation: Step-by-step installation instructions based on detected package manager and dependencies.',
    usage: 'Usage: Basic usage examples and getting started guide.',
    features: 'Features: List key features based on actual functionality detected in the codebase.',
    tech_stack: 'Tech Stack: List technologies, frameworks, and tools used (only those detected).',
    configuration: 'Configuration: Environment variables, config files, and setup options.',
    api_documentation: 'API Documentation: Document any public APIs or endpoints if detected.',
    contributing: 'Contributing: Guidelines for contributing to the project.',
    license: 'License: License information based on the LICENSE file.',
    badges: 'Badges: Relevant shields.io badges (language, package manager, license, etc.).',
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
    professional: 'Use a professional, business-appropriate tone. Be clear, concise, and objective.',
    friendly: 'Use a friendly, welcoming tone. Be approachable and encourage community involvement.',
    technical: 'Use a technical, detailed tone. Be precise and include technical details where relevant.',
    marketing: 'Use a marketing-oriented tone. Highlight benefits, features, and value proposition.',
};

function buildPrompt(
    context: ProcessedContext,
    sections: SectionSelection,
    tone: Tone,
    language: string
): string {
    const selectedSections = Object.entries(sections)
        .filter(([, selected]) => selected)
        .map(([key]) => SECTION_INSTRUCTIONS[key as keyof SectionSelection])
        .join('\n- ');

    const contextStr = `
REPOSITORY INFORMATION:
- Name: ${context.repoName}
- Full Name: ${context.fullName}
- Description: ${context.description}
- Primary Language: ${context.primaryLanguage || 'Unknown'}
- Topics: ${context.topics.length > 0 ? context.topics.join(', ') : 'None'}
- License: ${context.license || 'Not specified'}
- Homepage: ${context.homepage || 'None'}
- Stats: ${context.stats.stars} stars, ${context.stats.forks} forks

TECH STACK (DETECTED):
- Languages: ${context.techStack.languages.join(', ') || 'None detected'}
- Frameworks: ${context.techStack.frameworks.join(', ') || 'None detected'}
- Tools: ${context.techStack.tools.join(', ') || 'None detected'}
- Package Manager: ${context.techStack.packageManager || 'Unknown'}

DEPENDENCIES:
- Production: ${context.dependencies.production.slice(0, 15).join(', ') || 'None'}
- Development: ${context.dependencies.development.slice(0, 10).join(', ') || 'None'}

PROJECT STRUCTURE:
${context.projectStructure}

SCRIPTS (from package.json or similar):
${Object.entries(context.scripts).slice(0, 10).map(([k, v]) => `- ${k}: ${v}`).join('\n') || 'None'}

${context.existingReadmeSummary ? `EXISTING README:\n${context.existingReadmeSummary}` : ''}

CONFIGURATION FILES SUMMARY:
${context.configSummary}
`;

    return `You are a technical writer creating a README.md file for an open-source project.

${contextStr}

INSTRUCTIONS:
1. Generate a complete, replacement README.md file
2. Write in ${language} language
3. ${TONE_INSTRUCTIONS[tone]}
4. Include ONLY these sections:
- ${selectedSections}

CRITICAL RULES:
- ONLY use information provided above - do NOT infer or guess
- Do NOT invent features, APIs, or technologies not explicitly listed
- Do NOT add placeholder content like "[describe...]" or "[add...]"
- If information is missing for a section, provide minimal accurate content or skip details
- Use actual package manager commands based on detected package manager (npm, yarn, pnpm, pip, etc.)
- For installation, only include commands that make sense for this repo
- For badges, use shields.io format and only include relevant ones (language, license, version if package.json version exists)
- Output must be valid Markdown
- Follow standard open-source README conventions

Generate the README.md now:`;
}

export async function generateReadme(
    context: ProcessedContext,
    sections: SectionSelection,
    tone: Tone,
    language: string
): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
        },
    });

    const prompt = buildPrompt(context, sections, tone, language);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up the response - remove markdown code blocks if present
    let readme = text.trim();
    if (readme.startsWith('```markdown')) {
        readme = readme.slice(11);
    } else if (readme.startsWith('```md')) {
        readme = readme.slice(5);
    } else if (readme.startsWith('```')) {
        readme = readme.slice(3);
    }
    if (readme.endsWith('```')) {
        readme = readme.slice(0, -3);
    }

    return readme.trim();
}
