import Link from "next/link";
import { BookOpen, GitFork, Star } from "lucide-react";
import type { RepoData } from "@/lib/types";
import { LanguageBar } from "./LanguageBar";
import type { LanguageStats } from "@/lib/types";
import { ClonePanel } from "./ClonePanel";
import { DownloadButton } from "./DownloadButton";

export function RepoHeader({
  repo,
  languages,
}: {
  repo: RepoData;
  languages: LanguageStats;
}) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 text-xl mb-2">
        <Link href={`https://github.com/${repo.owner}`} className="gh-link font-semibold">
          {repo.owner}
        </Link>
        <span className="text-[var(--gh-fg-muted)]">/</span>
        <Link href={`/${repo.owner}/${repo.repo}`} className="gh-link font-semibold">
          {repo.repo}
        </Link>
        <span className="text-sm px-2 py-0.5 rounded-full border border-[var(--gh-border-default)] text-[var(--gh-fg-muted)]">
          {repo.isPrivate ? "Private" : "Public"}
        </span>
        {repo.isFork && (
          <span className="text-sm text-[var(--gh-fg-muted)] flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" /> fork
          </span>
        )}
      </div>

      {repo.description && (
        <p className="text-[var(--gh-fg-muted)] text-base mb-3 max-w-3xl">{repo.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button className="gh-btn">
          <Star className="w-4 h-4" />
          <strong>{repo.stars.toLocaleString()}</strong> stars
        </button>
        <button className="gh-btn">
          <GitFork className="w-4 h-4" />
          <strong>{repo.forks.toLocaleString()}</strong> forks
        </button>
        <button className="gh-btn">
          <BookOpen className="w-4 h-4" />
          <strong>{repo.watchers.toLocaleString()}</strong> watching
        </button>
        <ClonePanel repo={repo} />
        <DownloadButton
          owner={repo.owner}
          repo={repo.repo}
          branch={repo.defaultBranch}
        />
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="gh-btn"
        >
          View on GitHub →
        </a>
      </div>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {repo.topics.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-0.5 rounded-full bg-[#0969da1a] text-[var(--gh-accent-fg)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <LanguageBar languages={languages} />
    </div>
  );
}
