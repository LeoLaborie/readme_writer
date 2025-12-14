// Preprocessor for repository data
// Extracts and structures information for LLM consumption

import type { RepoData, FileTreeItem } from './github';

interface ProcessedContext {
    repoName: string;
    fullName: string;
    description: string;
    primaryLanguage: string | null;
    topics: string[];
    license: string | null;
    homepage: string | null;
    stats: {
        stars: number;
        forks: number;
    };
    techStack: {
        languages: string[];
        frameworks: string[];
        tools: string[];
        packageManager: string | null;
    };
    dependencies: {
        production: string[];
        development: string[];
    };
    projectStructure: string;
    scripts: Record<string, string>;
    existingReadmeSummary: string | null;
    configSummary: string;
}

function detectLanguagesFromTree(fileTree: FileTreeItem[]): string[] {
    const extensionMap: Record<string, string> = {
        '.ts': 'TypeScript',
        '.tsx': 'TypeScript',
        '.js': 'JavaScript',
        '.jsx': 'JavaScript',
        '.py': 'Python',
        '.go': 'Go',
        '.rs': 'Rust',
        '.java': 'Java',
        '.kt': 'Kotlin',
        '.rb': 'Ruby',
        '.php': 'PHP',
        '.cs': 'C#',
        '.cpp': 'C++',
        '.c': 'C',
        '.swift': 'Swift',
        '.scala': 'Scala',
        '.vue': 'Vue',
        '.svelte': 'Svelte',
    };

    const languages = new Set<string>();

    for (const file of fileTree) {
        if (file.type !== 'file') continue;

        for (const [ext, lang] of Object.entries(extensionMap)) {
            if (file.path.endsWith(ext)) {
                languages.add(lang);
                break;
            }
        }
    }

    return Array.from(languages);
}

function detectFrameworksFromPackageJson(packageJson: Record<string, unknown> | null): string[] {
    if (!packageJson) return [];

    const frameworks: string[] = [];
    const deps = {
        ...(packageJson.dependencies as Record<string, string> || {}),
        ...(packageJson.devDependencies as Record<string, string> || {}),
    };

    const frameworkMap: Record<string, string> = {
        'next': 'Next.js',
        'react': 'React',
        'vue': 'Vue.js',
        'nuxt': 'Nuxt.js',
        '@angular/core': 'Angular',
        'svelte': 'Svelte',
        'express': 'Express.js',
        'fastify': 'Fastify',
        'nestjs': 'NestJS',
        '@nestjs/core': 'NestJS',
        'koa': 'Koa',
        'hapi': 'Hapi',
        'gatsby': 'Gatsby',
        'remix': 'Remix',
        'astro': 'Astro',
        'electron': 'Electron',
        'vite': 'Vite',
        'webpack': 'Webpack',
        'tailwindcss': 'Tailwind CSS',
        'prisma': 'Prisma',
        'drizzle-orm': 'Drizzle ORM',
        'sequelize': 'Sequelize',
        'mongoose': 'Mongoose',
        'jest': 'Jest',
        'vitest': 'Vitest',
        'mocha': 'Mocha',
        'cypress': 'Cypress',
        'playwright': 'Playwright',
    };

    for (const [pkg, name] of Object.entries(frameworkMap)) {
        if (deps[pkg]) {
            frameworks.push(name);
        }
    }

    return frameworks;
}

function detectToolsFromTree(fileTree: FileTreeItem[], configFiles: { path: string; content: string }[]): string[] {
    const tools: string[] = [];
    const filePaths = fileTree.map(f => f.path);

    // Check for Docker
    if (filePaths.some(p => p === 'Dockerfile' || p.startsWith('docker-compose'))) {
        tools.push('Docker');
    }

    // Check for CI/CD
    if (filePaths.some(p => p.startsWith('.github/workflows'))) {
        tools.push('GitHub Actions');
    }
    if (filePaths.some(p => p === '.gitlab-ci.yml')) {
        tools.push('GitLab CI');
    }
    if (filePaths.some(p => p === '.travis.yml')) {
        tools.push('Travis CI');
    }
    if (filePaths.some(p => p.startsWith('.circleci/'))) {
        tools.push('CircleCI');
    }

    // Check for common tools
    if (filePaths.some(p => p === 'Makefile')) {
        tools.push('Make');
    }
    if (filePaths.some(p => p === '.eslintrc.js' || p === '.eslintrc.json' || p === 'eslint.config.js' || p === 'eslint.config.mjs')) {
        tools.push('ESLint');
    }
    if (filePaths.some(p => p === '.prettierrc' || p === 'prettier.config.js')) {
        tools.push('Prettier');
    }
    if (filePaths.some(p => p === 'vercel.json')) {
        tools.push('Vercel');
    }
    if (filePaths.some(p => p === 'netlify.toml')) {
        tools.push('Netlify');
    }

    return tools;
}

function detectPackageManager(fileTree: FileTreeItem[]): string | null {
    const filePaths = fileTree.map(f => f.path);

    if (filePaths.includes('pnpm-lock.yaml')) return 'pnpm';
    if (filePaths.includes('yarn.lock')) return 'yarn';
    if (filePaths.includes('package-lock.json')) return 'npm';
    if (filePaths.includes('bun.lockb')) return 'bun';
    if (filePaths.includes('requirements.txt') || filePaths.includes('pyproject.toml')) return 'pip';
    if (filePaths.includes('Cargo.toml')) return 'cargo';
    if (filePaths.includes('go.mod')) return 'go';
    if (filePaths.includes('Gemfile')) return 'bundler';
    if (filePaths.includes('pom.xml')) return 'maven';
    if (filePaths.includes('build.gradle')) return 'gradle';

    return null;
}

function extractDependencies(
    packageJson: Record<string, unknown> | null,
    requirementsTxt: string | null,
    pyprojectToml: string | null
): { production: string[]; development: string[] } {
    const production: string[] = [];
    const development: string[] = [];

    // Node.js dependencies
    if (packageJson) {
        const deps = packageJson.dependencies as Record<string, string> || {};
        const devDeps = packageJson.devDependencies as Record<string, string> || {};

        production.push(...Object.keys(deps).slice(0, 20)); // Limit to top 20
        development.push(...Object.keys(devDeps).slice(0, 10)); // Limit to top 10
    }

    // Python dependencies
    if (requirementsTxt) {
        const lines = requirementsTxt.split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.startsWith('#'))
            .map(l => l.split(/[=<>!]/)[0].trim())
            .slice(0, 20);
        production.push(...lines);
    }

    if (pyprojectToml) {
        // Basic parsing of pyproject.toml dependencies
        const depsMatch = pyprojectToml.match(/dependencies\s*=\s*\[([\s\S]*?)\]/);
        if (depsMatch) {
            const deps = depsMatch[1]
                .split('\n')
                .map(l => l.trim().replace(/[",]/g, ''))
                .filter(l => l)
                .map(l => l.split(/[=<>!]/)[0].trim())
                .slice(0, 20);
            production.push(...deps);
        }
    }

    return { production, development };
}

function summarizeProjectStructure(fileTree: FileTreeItem[]): string {
    const topLevelDirs = fileTree
        .filter(f => f.type === 'dir' && !f.path.includes('/'))
        .map(f => f.path)
        .filter(p => !p.startsWith('.') && p !== 'node_modules' && p !== '__pycache__')
        .slice(0, 15);

    const topLevelFiles = fileTree
        .filter(f => f.type === 'file' && !f.path.includes('/'))
        .map(f => f.path)
        .slice(0, 15);

    const parts: string[] = [];

    if (topLevelDirs.length > 0) {
        parts.push(`Directories: ${topLevelDirs.join(', ')}`);
    }
    if (topLevelFiles.length > 0) {
        parts.push(`Files: ${topLevelFiles.join(', ')}`);
    }

    return parts.join('\n');
}

function summarizeExistingReadme(readme: string | null): string | null {
    if (!readme) return null;

    // Extract section headers
    const headers = readme.match(/^#+\s+.+$/gm) || [];

    if (headers.length === 0) return null;

    return `Existing README sections: ${headers.slice(0, 10).join(', ')}`;
}

function summarizeConfigFiles(configFiles: { path: string; content: string }[]): string {
    if (configFiles.length === 0) return 'No configuration files found.';

    return configFiles.map(f => `${f.path}: ${f.content.slice(0, 200)}...`).join('\n\n');
}

export function preprocessRepoData(repoData: RepoData): ProcessedContext {
    const languages = detectLanguagesFromTree(repoData.fileTree);
    const frameworks = detectFrameworksFromPackageJson(repoData.packageJson);
    const tools = detectToolsFromTree(repoData.fileTree, repoData.configFiles);
    const packageManager = detectPackageManager(repoData.fileTree);
    const dependencies = extractDependencies(repoData.packageJson, repoData.requirementsTxt, repoData.pyprojectToml);

    // Extract scripts from package.json
    const scripts = (repoData.packageJson?.scripts as Record<string, string>) || {};

    return {
        repoName: repoData.metadata.name,
        fullName: repoData.metadata.fullName,
        description: repoData.metadata.description || 'No description provided',
        primaryLanguage: repoData.metadata.language,
        topics: repoData.metadata.topics,
        license: repoData.licenseContent
            ? repoData.metadata.license?.name || 'Custom License'
            : null,
        homepage: repoData.metadata.homepage,
        stats: {
            stars: repoData.metadata.stargazersCount,
            forks: repoData.metadata.forksCount,
        },
        techStack: {
            languages: [...new Set([repoData.metadata.language, ...languages].filter(Boolean) as string[])],
            frameworks,
            tools,
            packageManager,
        },
        dependencies,
        projectStructure: summarizeProjectStructure(repoData.fileTree),
        scripts,
        existingReadmeSummary: summarizeExistingReadme(repoData.existingReadme),
        configSummary: summarizeConfigFiles(repoData.configFiles),
    };
}

export type { ProcessedContext };
