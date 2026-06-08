"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";

interface SearchResult {
  path: string;
  matches: string[];
}

export function SearchPanel({ owner, repo }: { owner: string; repo: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/search?owner=${owner}&repo=${repo}&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gh-box">
      <div className="gh-box-header flex items-center gap-2">
        <Search className="w-4 h-4" />
        Full-Repo Code Search
        <span className="text-xs font-normal text-[var(--gh-fg-muted)] ml-auto">
          GitHub doesn&apos;t show inline results like this
        </span>
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search code across entire repo..."
            className="flex-1 px-3 py-2 text-sm rounded-md border border-[var(--gh-border-default)] bg-[var(--gh-canvas-inset)]"
          />
          <button onClick={search} className="gh-btn gh-btn-primary" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </div>
        {error && <p className="text-sm text-[var(--gh-danger-fg)] mt-2">{error}</p>}
        {results.length > 0 && (
          <ul className="mt-4 space-y-3">
            {results.map((r) => (
              <li key={r.path} className="border-t border-[var(--gh-border-default)] pt-3">
                <Link href={`/${owner}/${repo}/blob/${r.path}`} className="gh-link font-mono text-sm">
                  {r.path}
                </Link>
                {r.matches.map((m, i) => (
                  <pre key={i} className="mt-1 text-xs bg-[var(--gh-code-bg)] p-2 rounded overflow-x-auto">
                    {m}
                  </pre>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
