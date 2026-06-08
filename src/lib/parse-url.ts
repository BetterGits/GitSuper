import type { ParsedRepoUrl } from "./types";

const GITHUB_PATTERNS = [
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/tree\/([^/]+)(?:\/(.+))?)?\/?$/,
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/blob\/([^/]+)(?:\/(.+))?)?\/?$/,
  /^([^/]+)\/([^/]+)$/,
];

export function parseGitHubUrl(input: string): ParsedRepoUrl | null {
  const trimmed = input.trim().replace(/\/$/, "");

  for (const pattern of GITHUB_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const [, owner, repoRaw, branch, path] = match;
      const repo = repoRaw.replace(/\.git$/, "");
      return {
        owner,
        repo,
        branch: branch || undefined,
        path: path || undefined,
      };
    }
  }

  return null;
}

export function buildRepoPath(owner: string, repo: string, ...segments: string[]) {
  const base = `/${owner}/${repo}`;
  if (segments.length === 0) return base;
  return `${base}/${segments.join("/")}`;
}
