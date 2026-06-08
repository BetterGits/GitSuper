import { computeInsights } from "@/lib/analytics";
import {
  fetchCommits,
  fetchRepo,
  fetchTree,
} from "@/lib/github";
import { InsightsDashboard } from "@/components/InsightsDashboard";

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const repoData = await fetchRepo(owner, repo);

  const [tree, commits] = await Promise.all([
    fetchTree(owner, repo, repoData.defaultBranch),
    fetchCommits(owner, repo, undefined, 100),
  ]);

  const insights = computeInsights(
    repoData,
    tree,
    commits.map((c) => ({ date: c.date }))
  );

  return <InsightsDashboard insights={insights} />;
}
