import {
  fetchCommits,
  fetchContents,
  fetchReadme,
} from "@/lib/github";
import { FileList } from "@/components/FileList";
import { Readme } from "@/components/Readme";
import { RepoSidebar } from "@/components/RepoSidebar";
import { fetchRepo } from "@/lib/github";

export default async function RepoCodePage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;

  const [repoData, files, readme, commits] = await Promise.all([
    fetchRepo(owner, repo),
    fetchContents(owner, repo),
    fetchReadme(owner, repo),
    fetchCommits(owner, repo, undefined, 1),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-6">
      <div>
        <FileList
          owner={owner}
          repo={repo}
          files={files}
          currentPath=""
          lastCommit={commits[0]}
        />
        {readme && <Readme content={readme} />}
      </div>
      <RepoSidebar repo={repoData} />
    </div>
  );
}
