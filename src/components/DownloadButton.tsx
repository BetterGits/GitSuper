"use client";

import { Download } from "lucide-react";

export function DownloadButton({
  owner,
  repo,
  branch,
  path,
  label,
}: {
  owner: string;
  repo: string;
  branch: string;
  path?: string;
  label?: string;
}) {
  const params = new URLSearchParams({ owner, repo, ref: branch });
  if (path) params.set("path", path);

  return (
    <a
      href={`/api/download?${params}`}
      className="gh-btn"
      download
    >
      <Download className="w-4 h-4" />
      {label || (path ? "Download folder" : "Download ZIP")}
    </a>
  );
}
