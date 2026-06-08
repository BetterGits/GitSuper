import type { RepoData, RepoInsights } from "./types";

const CI_PATTERNS = [
  ".github/workflows",
  ".gitlab-ci",
  "travis.yml",
  "circle.yml",
  "Jenkinsfile",
  "azure-pipelines",
];

const TEST_PATTERNS = ["test", "tests", "__tests__", "spec.", ".test.", ".spec."];

const DEP_FILES = [
  "package.json",
  "requirements.txt",
  "Cargo.toml",
  "go.mod",
  "Gemfile",
  "pom.xml",
  "build.gradle",
  "composer.json",
  "pubspec.yaml",
];

export function computeInsights(
  repo: RepoData,
  tree: { path: string; type: string; size?: number }[],
  commits: { date: string }[]
): RepoInsights {
  const files = tree.filter((t) => t.type === "blob");
  const dirs = tree.filter((t) => t.type === "tree");

  const extMap = new Map<string, { count: number; bytes: number }>();
  for (const f of files) {
    const ext = f.path.includes(".")
      ? f.path.split(".").pop()?.toLowerCase() || "(no ext)"
      : "(no ext)";
    const cur = extMap.get(ext) || { count: 0, bytes: 0 };
    cur.count++;
    cur.bytes += f.size || 0;
    extMap.set(ext, cur);
  }

  const fileTypeBreakdown = [...extMap.entries()]
    .map(([ext, v]) => ({ ext, count: v.count, bytes: v.bytes }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const largestFiles = files
    .filter((f) => f.size)
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 10)
    .map((f) => ({ path: f.path, size: f.size || 0 }));

  const hasReadme = files.some((f) =>
    /^readme/i.test(f.path.split("/").pop() || "")
  );
  const hasLicense = files.some((f) =>
    /^license/i.test(f.path.split("/").pop() || "")
  );
  const hasCi = files.some((f) =>
    CI_PATTERNS.some((p) => f.path.toLowerCase().includes(p.toLowerCase()))
  );
  const hasTests = files.some((f) =>
    TEST_PATTERNS.some((p) => f.path.toLowerCase().includes(p.toLowerCase()))
  );
  const dependencyFiles = files
    .map((f) => f.path.split("/").pop() || "")
    .filter((name) => DEP_FILES.includes(name));

  const commitByWeek = new Map<string, number>();
  for (const c of commits) {
    const d = new Date(c.date);
    const week = `${d.getFullYear()}-W${Math.ceil(
      ((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7
    )}`;
    commitByWeek.set(week, (commitByWeek.get(week) || 0) + 1);
  }

  const commitFrequency = [...commitByWeek.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-12);

  const daysSinceLastCommit = commits.length
    ? Math.floor(
        (Date.now() - new Date(commits[0].date).getTime()) / 86400000
      )
    : 999;

  const avgCommitsPerWeek =
    commitFrequency.length > 0
      ? commitFrequency.reduce((s, c) => s + c.count, 0) / commitFrequency.length
      : 0;

  let healthScore = 50;
  if (hasReadme) healthScore += 10;
  if (hasLicense) healthScore += 10;
  if (hasCi) healthScore += 15;
  if (hasTests) healthScore += 10;
  if (repo.description) healthScore += 5;
  if (repo.topics.length > 0) healthScore += 5;
  if (daysSinceLastCommit < 30) healthScore += 10;
  else if (daysSinceLastCommit < 90) healthScore += 5;
  if (repo.stars > 100) healthScore += 5;
  healthScore = Math.min(100, healthScore);

  const healthGrade =
    healthScore >= 90
      ? "A+"
      : healthScore >= 80
        ? "A"
        : healthScore >= 70
          ? "B"
          : healthScore >= 60
            ? "C"
            : healthScore >= 50
              ? "D"
              : "F";

  return {
    healthScore,
    healthGrade,
    commitFrequency,
    fileTypeBreakdown,
    largestFiles,
    avgCommitsPerWeek: Math.round(avgCommitsPerWeek * 10) / 10,
    daysSinceLastCommit,
    hasReadme,
    hasLicense,
    hasCi,
    hasTests,
    dependencyFiles,
    totalFiles: files.length,
    totalDirs: dirs.length,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
