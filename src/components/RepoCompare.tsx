"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, GitCompare } from "lucide-react";
import { parseGitHubUrl } from "@/lib/parse-url";

export function RepoCompare() {
  const [repo1, setRepo1] = useState("");
  const [repo2, setRepo2] = useState("");
  const router = useRouter();

  const compare = () => {
    const p1 = parseGitHubUrl(repo1);
    const p2 = parseGitHubUrl(repo2);
    if (p1 && p2) {
      router.push(`/compare?a=${p1.owner}/${p1.repo}&b=${p2.owner}/${p2.repo}`);
    }
  };

  return (
    <div className="gh-box max-w-2xl mx-auto">
      <div className="gh-box-header flex items-center gap-2">
        <GitCompare className="w-4 h-4" />
        Side-by-Side Repo Compare
        <span className="text-xs font-normal text-[var(--gh-fg-muted)] ml-2">
          Not available on GitHub
        </span>
      </div>
      <div className="p-6 space-y-4">
        <input
          value={repo1}
          onChange={(e) => setRepo1(e.target.value)}
          placeholder="First repo (owner/repo or URL)"
          className="w-full px-3 py-2 rounded-md border border-[var(--gh-border-default)] bg-[var(--gh-canvas-inset)]"
        />
        <input
          value={repo2}
          onChange={(e) => setRepo2(e.target.value)}
          placeholder="Second repo (owner/repo or URL)"
          className="w-full px-3 py-2 rounded-md border border-[var(--gh-border-default)] bg-[var(--gh-canvas-inset)]"
        />
        <button onClick={compare} className="gh-btn gh-btn-primary w-full justify-center">
          Compare Repos <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
