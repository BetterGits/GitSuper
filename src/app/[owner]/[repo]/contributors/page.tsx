import { fetchContributors } from "@/lib/github";
import { Contributors } from "@/components/Contributors";

export default async function ContributorsPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const contributors = await fetchContributors(owner, repo, 30);

  return <Contributors contributors={contributors} />;
}
