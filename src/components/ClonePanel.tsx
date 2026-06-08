"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import type { RepoData } from "@/lib/types";

export function ClonePanel({ repo }: { repo: RepoData }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"https" | "ssh" | "cli">("https");
  const [copied, setCopied] = useState(false);

  const commands = {
    https: repo.cloneUrl,
    ssh: repo.sshUrl,
    cli: `gh repo clone ${repo.fullName}`,
  };

  const copy = async () => {
    await navigator.clipboard.writeText(commands[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button className="gh-btn gh-btn-primary" onClick={() => setOpen(!open)}>
        <Terminal className="w-4 h-4" />
        Code
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 z-20 w-80 gh-box shadow-lg">
          <div className="flex border-b border-[var(--gh-border-default)]">
            {(["https", "ssh", "cli"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-3 py-2 text-xs font-medium uppercase ${
                  tab === t
                    ? "border-b-2 border-[var(--gh-accent-fg)] text-[var(--gh-fg-default)]"
                    : "text-[var(--gh-fg-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-3 flex gap-2">
            <input
              readOnly
              value={commands[tab]}
              className="flex-1 text-xs font-mono px-2 py-1.5 rounded border border-[var(--gh-border-default)] bg-[var(--gh-canvas-inset)]"
            />
            <button onClick={copy} className="gh-btn px-2">
              {copied ? <Check className="w-4 h-4 text-[var(--gh-success-fg)]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
