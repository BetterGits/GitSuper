"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Download,
  GitBranch,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { parseGitHubUrl } from "@/lib/parse-url";
import { RepoCompare } from "@/components/RepoCompare";

const FEATURES = [
  {
    icon: Search,
    title: "Full-repo code search",
    desc: "Search every file at once with inline match previews — no clicking through folders.",
  },
  {
    icon: BarChart3,
    title: "Repo health dashboard",
    desc: "Health score, commit charts, file breakdowns, and largest-file detection.",
  },
  {
    icon: Zap,
    title: "Side-by-side compare",
    desc: "Compare two repos on stars, forks, languages, and contributor activity.",
  },
  {
    icon: Download,
    title: "Folder ZIP downloads",
    desc: "Download any folder as a ZIP, not just the whole repo.",
  },
  {
    icon: Sparkles,
    title: "Bookmarks & themes",
    desc: "Save favorite repos locally and switch between GitHub light/dark themes.",
  },
  {
    icon: GitBranch,
    title: "Clone command wizard",
    desc: "One-click copy for HTTPS, SSH, or GitHub CLI clone commands.",
  },
];

export default function HomePage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseGitHubUrl(url);
    if (parsed) router.push(`/${parsed.owner}/${parsed.repo}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Browse any GitHub repo
        </h1>
        <p className="text-lg text-[var(--gh-fg-muted)] mb-8">
          Files, commits, contributors, README — plus features GitHub doesn&apos;t offer.
        </p>
        <form onSubmit={go} className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo or owner/repo"
            className="flex-1 px-4 py-3 rounded-md border border-[var(--gh-border-default)] bg-[var(--gh-canvas-inset)] text-base"
          />
          <button type="submit" className="gh-btn gh-btn-primary px-6 py-3">
            Go
          </button>
        </form>
        <p className="text-sm text-[var(--gh-fg-muted)] mt-3">
          Try <button type="button" onClick={() => setUrl("facebook/react")} className="gh-link bg-transparent border-0 cursor-pointer">facebook/react</button>
          {" or "}
          <button type="button" onClick={() => setUrl("vercel/next.js")} className="gh-link bg-transparent border-0 cursor-pointer">vercel/next.js</button>
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {FEATURES.map((f) => (
          <div key={f.title} className="gh-box p-5">
            <f.icon className="w-8 h-8 text-[var(--gh-accent-fg)] mb-3" />
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-[var(--gh-fg-muted)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center mb-6">Compare Repos</h2>
        <RepoCompare />
      </section>
    </div>
  );
}
