import type { ContributorEntry } from "@/lib/types";

export function Contributors({ contributors }: { contributors: ContributorEntry[] }) {
  return (
    <div className="gh-box">
      <div className="gh-box-header">
        {contributors.length} Contributors
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {contributors.map((c) => (
          <a
            key={c.login}
            href={c.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 border-t border-[var(--gh-border-default)] hover:bg-[var(--gh-canvas-subtle)] no-underline"
          >
            <img src={c.avatarUrl} alt={c.login} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-semibold text-[var(--gh-accent-fg)]">{c.login}</div>
              <div className="text-sm text-[var(--gh-fg-muted)]">
                {c.contributions.toLocaleString()} contributions
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
