import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { File, Folder } from "lucide-react";
import type { CommitEntry, FileEntry } from "@/lib/types";
import { formatBytes } from "@/lib/analytics";

export function FileList({
  owner,
  repo,
  files,
  currentPath,
  lastCommit,
}: {
  owner: string;
  repo: string;
  files: FileEntry[];
  currentPath: string;
  lastCommit?: CommitEntry;
}) {
  const sorted = [...files].sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const parentPath = currentPath
    ? currentPath.split("/").slice(0, -1).join("/")
    : null;

  return (
    <div className="gh-box overflow-hidden">
      {lastCommit && (
        <div className="gh-box-header flex items-center justify-between text-sm font-normal">
          <div className="flex items-center gap-2 min-w-0">
            {lastCommit.authorAvatar && (
              <img
                src={lastCommit.authorAvatar}
                alt=""
                className="w-5 h-5 rounded-full"
              />
            )}
            <a href={lastCommit.url} className="gh-link font-semibold truncate">
              {lastCommit.author}
            </a>
            <span className="text-[var(--gh-fg-muted)] truncate">{lastCommit.message}</span>
          </div>
          <span className="text-[var(--gh-fg-muted)] shrink-0 ml-4">
            {formatDistanceToNow(new Date(lastCommit.date), { addSuffix: true })}
          </span>
        </div>
      )}

      <table className="w-full text-sm">
        <tbody>
          {parentPath !== null && (
            <tr className="border-t border-[var(--gh-border-default)] hover:bg-[var(--gh-canvas-subtle)]">
              <td className="px-4 py-2" colSpan={3}>
                <Link
                  href={
                    parentPath
                      ? `/${owner}/${repo}/tree/${parentPath}`
                      : `/${owner}/${repo}`
                  }
                  className="gh-link flex items-center gap-2"
                >
                  <Folder className="w-4 h-4" /> ..
                </Link>
              </td>
            </tr>
          )}
          {sorted.map((file) => (
            <tr
              key={file.path}
              className="border-t border-[var(--gh-border-default)] hover:bg-[var(--gh-canvas-subtle)]"
            >
              <td className="px-4 py-2 w-full">
                <Link
                  href={
                    file.type === "dir"
                      ? `/${owner}/${repo}/tree/${file.path}`
                      : `/${owner}/${repo}/blob/${file.path}`
                  }
                  className="gh-link flex items-center gap-2"
                >
                  {file.type === "dir" ? (
                    <Folder className="w-4 h-4 text-[var(--gh-accent-fg)]" />
                  ) : (
                    <File className="w-4 h-4 text-[var(--gh-fg-muted)]" />
                  )}
                  {file.name}
                </Link>
              </td>
              <td className="px-4 py-2 text-[var(--gh-fg-muted)] text-right whitespace-nowrap hidden sm:table-cell">
                {file.type === "file" && file.size !== undefined
                  ? formatBytes(file.size)
                  : ""}
              </td>
              <td className="px-4 py-2 text-[var(--gh-fg-muted)] text-right whitespace-nowrap hidden md:table-cell">
                {lastCommit && formatDistanceToNow(new Date(lastCommit.date), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
