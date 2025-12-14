// GitHub API service for fetching repository data
// Uses GitHub REST API - no cloning required

interface RepoMetadata {
  name: string;
  fullName: string;
  description: string | null;
  topics: string[];
  license: { name: string; spdxId: string } | null;
  language: string | null;
  defaultBranch: string;
  homepage: string | null;
  stargazersCount: number;
  forksCount: number;
}

interface FileTreeItem {
  path: string;
  type: 'file' | 'dir';
  size?: number;
}

interface RepoData {
  metadata: RepoMetadata;
  fileTree: FileTreeItem[];
  packageJson: Record<string, unknown> | null;
  requirementsTxt: string | null;
  pyprojectToml: string | null;
  existingReadme: string | null;
  licenseContent: string | null;
  configFiles: { path: string; content: string }[];
}

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'README-Generator-App',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  
  return headers;
}

export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  // Handle various GitHub URL formats
  const patterns = [
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/,
    /^github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/,
    /^([^\/]+)\/([^\/]+)$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
  }
  
  return null;
}

async function fetchRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found. Make sure it exists and is public.');
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    topics: data.topics || [],
    license: data.license ? { name: data.license.name, spdxId: data.license.spdx_id } : null,
    language: data.language,
    defaultBranch: data.default_branch,
    homepage: data.homepage,
    stargazersCount: data.stargazers_count,
    forksCount: data.forks_count,
  };
}

async function fetchFileTree(owner: string, repo: string, branch: string): Promise<FileTreeItem[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: getHeaders() }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file tree: ${response.status}`);
  }
  
  const data = await response.json();
  
  return (data.tree || []).map((item: { path: string; type: string; size?: number }) => ({
    path: item.path,
    type: item.type === 'tree' ? 'dir' : 'file',
    size: item.size,
  }));
}

async function fetchFileContent(owner: string, repo: string, path: string): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
    { headers: getHeaders() }
  );
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  
  if (data.encoding === 'base64' && data.content) {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  
  return null;
}

export async function analyzeRepository(repoUrl: string): Promise<RepoData> {
  const parsed = parseRepoUrl(repoUrl);
  
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  const { owner, repo } = parsed;
  
  // Fetch metadata first
  const metadata = await fetchRepoMetadata(owner, repo);
  
  // Fetch file tree
  const fileTree = await fetchFileTree(owner, repo, metadata.defaultBranch);
  
  // Fetch important files in parallel
  const [
    packageJson,
    requirementsTxt,
    pyprojectToml,
    existingReadme,
    licenseContent,
  ] = await Promise.all([
    fetchFileContent(owner, repo, 'package.json').then(c => c ? JSON.parse(c) : null).catch(() => null),
    fetchFileContent(owner, repo, 'requirements.txt'),
    fetchFileContent(owner, repo, 'pyproject.toml'),
    fetchFileContent(owner, repo, 'README.md') || fetchFileContent(owner, repo, 'readme.md'),
    fetchFileContent(owner, repo, 'LICENSE') || fetchFileContent(owner, repo, 'LICENSE.md'),
  ]);
  
  // Fetch config files
  const configFilePaths = fileTree
    .filter(f => f.type === 'file')
    .filter(f => 
      f.path.match(/\.(env\.example|dockerignore)$/) ||
      f.path.match(/^(\.env\.example|docker-compose\.ya?ml|Dockerfile|Makefile|\.gitignore|tsconfig\.json|vite\.config\.[jt]s|next\.config\.[jt]s|webpack\.config\.[jt]s)$/) ||
      f.path === 'setup.py' ||
      f.path === 'setup.cfg' ||
      f.path === 'Cargo.toml' ||
      f.path === 'go.mod' ||
      f.path === 'pom.xml' ||
      f.path === 'build.gradle'
    )
    .slice(0, 10); // Limit to 10 config files
  
  const configFiles = await Promise.all(
    configFilePaths.map(async (file) => {
      const content = await fetchFileContent(owner, repo, file.path);
      return content ? { path: file.path, content } : null;
    })
  ).then(results => results.filter((r): r is { path: string; content: string } => r !== null));
  
  return {
    metadata,
    fileTree,
    packageJson,
    requirementsTxt,
    pyprojectToml,
    existingReadme,
    licenseContent,
    configFiles,
  };
}

export type { RepoData, RepoMetadata, FileTreeItem };
