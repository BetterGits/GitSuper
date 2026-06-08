import { Octokit } from "@octokit/rest";
import type {
  CommitEntry,
  ContributorEntry,
  FileEntry,
  LanguageStats,
  RepoData,
} from "./types";

function getOctokit() {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN || undefined,
    userAgent: "github-repo-viewer",
  });
}

export async function fetchRepo(owner: string, repo: string): Promise<RepoData> {
  const octokit = getOctokit();
  const { data } = await octokit.repos.get({ owner, repo });

  return {
    owner: data.owner.login,
    repo: data.name,
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.watchers_count,
    openIssues: data.open_issues_count,
    defaultBranch: data.default_branch,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    pushedAt: data.pushed_at,
    homepage: data.homepage,
    topics: data.topics || [],
    license: data.license?.spdx_id || null,
    isPrivate: data.private,
    isFork: data.fork,
    size: data.size,
    htmlUrl: data.html_url,
    cloneUrl: data.clone_url,
    sshUrl: data.ssh_url,
  };
}

export async function fetchContents(
  owner: string,
  repo: string,
  path = "",
  ref?: string
): Promise<FileEntry[]> {
  const octokit = getOctokit();
  let data: any;
  try {
    ({ data } = await octokit.repos.getContent({ owner, repo, path: path || "", ref }));
  } catch (err: any) {
    const status = err?.status || err?.statusCode || "unknown";
    throw new Error(
      `Failed to fetch contents for ${owner}/${repo}/${path || ""} (status ${status}). ` +
        `If this is a private repo or you're being rate-limited, set the GITHUB_TOKEN environment variable with a personal access token.`
    );
  }

  const items = Array.isArray(data) ? data : [data];
  return items.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type === "dir" ? "dir" : "file",
    size: item.size,
    sha: item.sha,
    downloadUrl: item.type === "file" ? item.download_url : null,
  }));
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  ref?: string
): Promise<{ content: string; encoding: string; size: number }> {
  const octokit = getOctokit();
  let data: any;
  try {
    ({ data } = await octokit.repos.getContent({ owner, repo, path, ref }));
  } catch (err: any) {
    const status = err?.status || err?.statusCode || "unknown";
    throw new Error(
      `Failed to fetch file ${owner}/${repo}/${path} (status ${status}). ` +
        `If this is a private repo or you're being rate-limited, set the GITHUB_TOKEN environment variable with a personal access token.`
    );
  }

  if (Array.isArray(data) || data.type !== "file") {
    throw new Error("Not a file");
  }

  let content = "";
  if (data.content && data.encoding === "base64") {
    content = Buffer.from(data.content, "base64").toString("utf-8");
  }

  return { content, encoding: data.encoding, size: data.size };
}

export async function fetchReadme(
  owner: string,
  repo: string,
  ref?: string
): Promise<string | null> {
  try {
    const octokit = getOctokit();
    const { data } = await octokit.repos.getReadme({ owner, repo, ref });
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export async function fetchCommits(
  owner: string,
  repo: string,
  path?: string,
  perPage = 30
): Promise<CommitEntry[]> {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    path,
    per_page: perPage,
  });

  return data.map((c) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split("\n")[0],
    author: c.commit.author?.name || c.author?.login || "Unknown",
    authorAvatar: c.author?.avatar_url || "",
    date: c.commit.author?.date || "",
    url: c.html_url,
  }));
}

export async function fetchContributors(
  owner: string,
  repo: string,
  perPage = 20
): Promise<ContributorEntry[]> {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listContributors({
    owner,
    repo,
    per_page: perPage,
  });

  return data.map((c) => ({
    login: c.login || "ghost",
    avatarUrl: c.avatar_url || "",
    contributions: c.contributions,
    profileUrl: `https://github.com/${c.login}`,
  }));
}

export async function fetchLanguages(
  owner: string,
  repo: string
): Promise<LanguageStats> {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listLanguages({ owner, repo });
  return data;
}

export async function fetchTree(
  owner: string,
  repo: string,
  ref: string
): Promise<{ path: string; type: string; size?: number; sha: string }[]> {
  const octokit = getOctokit();
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${ref}`,
  });

  const { data: tree } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: refData.object.sha,
    recursive: "1",
  });

  return (tree.tree || []).map((item) => ({
    path: item.path || "",
    type: item.type || "blob",
    size: item.size,
    sha: item.sha || "",
  }));
}

export async function searchInRepo(
  owner: string,
  repo: string,
  query: string
): Promise<{ path: string; matches: string[] }[]> {
  const octokit = getOctokit();
  const q = `${query} repo:${owner}/${repo}`;
  const { data } = await octokit.search.code({ q, per_page: 30 });

  return data.items.map((item) => ({
    path: item.path,
    matches: item.text_matches?.map((m) => m.fragment).filter((f): f is string => !!f) || [],
  }));
}

export function getRepoZipUrl(owner: string, repo: string, ref: string) {
  return `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${ref}`;
}
