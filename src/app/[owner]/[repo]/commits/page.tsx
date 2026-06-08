import { fetchCommits } from "@/lib/github";
import { CommitsList } from "@/components/CommitsList";

export default async function CommitsPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const commits = await fetchCommits(owner, repo, undefined, 50);

  return <CommitsList commits={commits} />;
}
