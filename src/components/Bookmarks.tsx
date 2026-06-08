"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";

interface BookmarkItem {
  owner: string;
  repo: string;
  addedAt: string;
}

export function Bookmarks({ owner, repo }: { owner: string; repo: string }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("gh-viewer-bookmarks") || "[]");
    setBookmarks(stored);
    setIsSaved(stored.some((b: BookmarkItem) => b.owner === owner && b.repo === repo));
  }, [owner, repo]);

  const toggle = () => {
    let updated: BookmarkItem[];
    if (isSaved) {
      updated = bookmarks.filter((b) => !(b.owner === owner && b.repo === repo));
    } else {
      updated = [...bookmarks, { owner, repo, addedAt: new Date().toISOString() }];
    }
    localStorage.setItem("gh-viewer-bookmarks", JSON.stringify(updated));
    setBookmarks(updated);
    setIsSaved(!isSaved);
  };

  const remove = (o: string, r: string) => {
    const updated = bookmarks.filter((b) => !(b.owner === o && b.repo === r));
    localStorage.setItem("gh-viewer-bookmarks", JSON.stringify(updated));
    setBookmarks(updated);
    if (o === owner && r === repo) setIsSaved(false);
  };

  return (
    <div className="gh-box">
      <div className="gh-box-header flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Bookmarks
        </span>
        <button onClick={toggle} className="gh-btn text-xs">
          {isSaved ? "Remove bookmark" : "Bookmark this repo"}
        </button>
      </div>
      {bookmarks.length === 0 ? (
        <p className="p-4 text-sm text-[var(--gh-fg-muted)]">No bookmarked repos yet.</p>
      ) : (
        <ul>
          {bookmarks.map((b) => (
            <li
              key={`${b.owner}/${b.repo}`}
              className="flex items-center justify-between px-4 py-2 border-t border-[var(--gh-border-default)]"
            >
              <Link href={`/${b.owner}/${b.repo}`} className="gh-link text-sm">
                {b.owner}/{b.repo}
              </Link>
              <button onClick={() => remove(b.owner, b.repo)} className="text-[var(--gh-fg-muted)] hover:text-[var(--gh-danger-fg)]">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
