"use client";

import { Download } from "lucide-react";
import type { RepoData } from "@/lib/types";

export function ExportStats({ repo }: { repo: RepoData }) {
  const exportJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      repository: repo,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repo.fullName.replace("/", "-")}-stats.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="gh-box">
      <div className="gh-box-header">Export Stats</div>
      <div className="p-4">
        <p className="text-sm text-[var(--gh-fg-muted)] mb-4">
          Download repo metadata as JSON — useful for dashboards and tooling.
        </p>
        <button onClick={exportJson} className="gh-btn w-full justify-center">
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>
    </div>
  );
}
