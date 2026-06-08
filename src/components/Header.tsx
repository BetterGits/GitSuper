"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GitBranch, Moon, Search, Sun, Zap } from "lucide-react";
import { parseGitHubUrl } from "@/lib/parse-url";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { theme, toggle } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseGitHubUrl(url);
    if (parsed) {
      router.push(`/${parsed.owner}/${parsed.repo}`);
    }
  };

  return (
    <header className="gh-header sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 h-[64px] flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-white no-underline shrink-0">
          <GitBranch className="w-8 h-8" />
          <span className="font-semibold text-lg hidden sm:inline">GitSuper</span>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gh-fg-muted)]" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Search or paste a GitHub repo URL..."
              className="w-full pl-10 pr-4 py-[5px] text-sm rounded-md border border-[var(--gh-border-default)] bg-[var(--gh-canvas-inset)] text-[var(--gh-fg-default)] focus:outline-none focus:ring-2 focus:ring-[var(--gh-accent-fg)]"
            />
          </div>
        </form>

        <nav className="flex items-center gap-2 shrink-0">
          <Link
            href="/compare"
            className="gh-btn text-sm !bg-transparent !border-transparent !text-[var(--gh-header-text)] hover:!bg-white/10"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden md:inline">Compare</span>
          </Link>
          <button
            onClick={toggle}
            className="gh-btn !bg-transparent !border-transparent !text-[var(--gh-header-text)] hover:!bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
