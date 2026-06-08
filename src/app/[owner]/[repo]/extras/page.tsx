import { SearchPanel } from "@/components/SearchPanel";
import { Bookmarks } from "@/components/Bookmarks";
import { ExportStats } from "@/components/ExportStats";
import { fetchRepo } from "@/lib/github";

export default async function ExtrasPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const repoData = await fetchRepo(owner, repo);

  return (
    <div className="space-y-6">
      <SearchPanel owner={owner} repo={repo} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Bookmarks owner={owner} repo={repo} />
        <ExportStats repo={repoData} />
      </div>
    </div>
  );
}
