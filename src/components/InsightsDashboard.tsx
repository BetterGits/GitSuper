"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatBytes } from "@/lib/analytics";
import type { RepoInsights } from "@/lib/types";

const PIE_COLORS = ["#3178c6", "#f1e05a", "#3572A5", "#b07219", "#e34c26", "#563d7c", "#00ADD8", "#178600"];

export function InsightsDashboard({ insights }: { insights: RepoInsights }) {
  const healthChecks = [
    { label: "README", ok: insights.hasReadme },
    { label: "License", ok: insights.hasLicense },
    { label: "CI/CD", ok: insights.hasCi },
    { label: "Tests", ok: insights.hasTests },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="gh-box p-6 text-center">
          <div className="text-4xl font-bold text-[var(--gh-accent-fg)]">{insights.healthGrade}</div>
          <div className="text-sm text-[var(--gh-fg-muted)] mt-1">Health Grade</div>
          <div className="text-2xl font-semibold mt-2">{insights.healthScore}/100</div>
        </div>
        <div className="gh-box p-6 text-center">
          <div className="text-3xl font-bold">{insights.totalFiles}</div>
          <div className="text-sm text-[var(--gh-fg-muted)]">Files</div>
        </div>
        <div className="gh-box p-6 text-center">
          <div className="text-3xl font-bold">{insights.avgCommitsPerWeek}</div>
          <div className="text-sm text-[var(--gh-fg-muted)]">Commits / week</div>
        </div>
        <div className="gh-box p-6 text-center">
          <div className="text-3xl font-bold">{insights.daysSinceLastCommit}d</div>
          <div className="text-sm text-[var(--gh-fg-muted)]">Since last commit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="gh-box">
          <div className="gh-box-header">Commit Activity (12 weeks)</div>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.commitFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gh-border-default)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--gh-fg-muted)" />
                <YAxis stroke="var(--gh-fg-muted)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--gh-canvas-subtle)",
                    border: "1px solid var(--gh-border-default)",
                  }}
                />
                <Bar dataKey="count" fill="var(--gh-accent-fg)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="gh-box">
          <div className="gh-box-header">File Type Breakdown</div>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.fileTypeBreakdown.slice(0, 8)}
                  dataKey="count"
                  nameKey="ext"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props) => {
                    const entry = props as { ext?: string; percent?: number };
                    return `${entry.ext ?? ""} ${((entry.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {insights.fileTypeBreakdown.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="gh-box">
          <div className="gh-box-header">Health Checklist</div>
          <ul className="p-4 space-y-2">
            {healthChecks.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-sm">
                <span className={c.ok ? "text-[var(--gh-success-fg)]" : "text-[var(--gh-danger-fg)]"}>
                  {c.ok ? "✓" : "✗"}
                </span>
                {c.label}
              </li>
            ))}
            {insights.dependencyFiles.length > 0 && (
              <li className="text-sm text-[var(--gh-fg-muted)] mt-3">
                Dependencies: {insights.dependencyFiles.join(", ")}
              </li>
            )}
          </ul>
        </div>

        <div className="gh-box">
          <div className="gh-box-header">Largest Files</div>
          <ul className="p-4 space-y-2">
            {insights.largestFiles.map((f) => (
              <li key={f.path} className="flex justify-between text-sm font-mono">
                <span className="truncate text-[var(--gh-accent-fg)]">{f.path}</span>
                <span className="text-[var(--gh-fg-muted)] shrink-0 ml-2">{formatBytes(f.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
