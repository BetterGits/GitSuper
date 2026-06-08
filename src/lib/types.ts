export interface ParsedRepoUrl {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
}

export interface RepoData {
  owner: string;
  repo: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  homepage: string | null;
  topics: string[];
  license: string | null;
  isPrivate: boolean;
  isFork: boolean;
  size: number;
  htmlUrl: string;
  cloneUrl: string;
  sshUrl: string;
}

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  sha: string;
  downloadUrl?: string | null;
}

export interface CommitEntry {
  sha: string;
  message: string;
  author: string;
  authorAvatar: string;
  date: string;
  url: string;
}

export interface ContributorEntry {
  login: string;
  avatarUrl: string;
  contributions: number;
  profileUrl: string;
}

export interface LanguageStats {
  [language: string]: number;
}

export interface RepoInsights {
  healthScore: number;
  healthGrade: string;
  commitFrequency: { date: string; count: number }[];
  fileTypeBreakdown: { ext: string; count: number; bytes: number }[];
  largestFiles: { path: string; size: number }[];
  avgCommitsPerWeek: number;
  daysSinceLastCommit: number;
  hasReadme: boolean;
  hasLicense: boolean;
  hasCi: boolean;
  hasTests: boolean;
  dependencyFiles: string[];
  totalFiles: number;
  totalDirs: number;
}
