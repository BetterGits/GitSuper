import { formatDistanceToNow } from "date-fns";
import { Scale, Tag } from "lucide-react";
import type { RepoData } from "@/lib/types";

export function RepoSidebar({ repo }: { repo: RepoData }) {
  return (
    <aside className="space-y-4">
      <div className="gh-box">
        <div className="gh-box-header">About</div>
        <div className="p-4 text-sm space-y-3">
          {repo.description && <p>{repo.description}</p>}
          {repo.homepage && (
            <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="gh-link">
              🔗 {repo.homepage}
            </a>
          )}
          <div className="flex flex-wrap gap-2">
            {repo.topics.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#0969da1a] text-[var(--gh-accent-fg)]">
                {t}
              </span>
            ))}
          </div>
          <dl className="space-y-2 text-[var(--gh-fg-muted)]">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <dt className="sr-only">Releases</dt>
              <dd>No releases published</dd>
            </div>
            {repo.license && (
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <dd>{repo.license} license</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="gh-box">
        <div className="gh-box-header">Activity</div>
        <div className="p-4 text-sm space-y-2 text-[var(--gh-fg-muted)]">
          <p><strong className="text-[var(--gh-fg-default)]">{repo.stars}</strong> stars</p>
          <p><strong className="text-[var(--gh-fg-default)]">{repo.watchers}</strong> watching</p>
          <p><strong className="text-[var(--gh-fg-default)]">{repo.forks}</strong> forks</p>
          <p><strong className="text-[var(--gh-fg-default)]">{repo.openIssues}</strong> open issues</p>
        </div>
      </div>

      <div className="gh-box">
        <div className="gh-box-header">Repository Details</div>
        <div className="p-4 text-sm space-y-2 text-[var(--gh-fg-muted)]">
          <p>Created {formatDistanceToNow(new Date(repo.createdAt), { addSuffix: true })}</p>
          <p>Updated {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}</p>
          <p>Last push {formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })}</p>
          <p>Size: {repo.size} KB</p>
          <p>Default branch: <code className="text-xs bg-[var(--gh-code-bg)] px-1 rounded">{repo.defaultBranch}</code></p>
        </div>
      </div>
    </aside>
  );
}
