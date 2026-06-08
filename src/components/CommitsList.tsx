import { formatDistanceToNow } from "date-fns";
import type { CommitEntry } from "@/lib/types";

export function CommitsList({ commits }: { commits: CommitEntry[] }) {
  return (
    <div className="gh-box">
      <div className="gh-box-header">Commit History</div>
      <ul>
        {commits.map((c) => (
          <li
            key={c.sha}
            className="flex items-start gap-3 px-4 py-3 border-t border-[var(--gh-border-default)] hover:bg-[var(--gh-canvas-subtle)]"
          >
            {c.authorAvatar && (
              <img src={c.authorAvatar} alt="" className="w-8 h-8 rounded-full mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="gh-link font-medium">
                {c.message}
              </a>
              <p className="text-sm text-[var(--gh-fg-muted)] mt-0.5">
                <span className="font-medium text-[var(--gh-fg-default)]">{c.author}</span>
                {" "}committed{" "}
                <span title={c.date}>
                  {formatDistanceToNow(new Date(c.date), { addSuffix: true })}
                </span>
              </p>
            </div>
            <code className="text-xs text-[var(--gh-fg-muted)] bg-[var(--gh-code-bg)] px-2 py-1 rounded shrink-0">
              {c.sha}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}
