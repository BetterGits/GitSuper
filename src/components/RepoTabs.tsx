"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Code2,
  GitCommit,
  Sparkles,
  Users,
} from "lucide-react";
import clsx from "clsx";

export function RepoTabs({ owner, repo }: { owner: string; repo: string }) {
  const pathname = usePathname();
  const base = `/${owner}/${repo}`;

  const tabs = [
    { href: base, label: "Code", icon: Code2, match: (p: string) => p === base || p.includes("/tree/") || p.includes("/blob/") },
    { href: `${base}/commits`, label: "Commits", icon: GitCommit, match: (p: string) => p.includes("/commits") },
    { href: `${base}/contributors`, label: "Contributors", icon: Users, match: (p: string) => p.includes("/contributors") },
    { href: `${base}/insights`, label: "Insights", icon: BarChart3, match: (p: string) => p.includes("/insights") },
    { href: `${base}/extras`, label: "Extras", icon: Sparkles, match: (p: string) => p.includes("/extras") },
  ];

  return (
    <nav className="border-b border-[var(--gh-border-default)] mb-4 -mt-2">
      {tabs.map(({ href, label, icon: Icon, match }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "gh-tab",
            match(pathname) && "gh-tab-active"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
