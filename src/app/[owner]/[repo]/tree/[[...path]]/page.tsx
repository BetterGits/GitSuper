import { fetchCommits, fetchContents, fetchRepo } from "@/lib/github";
import { FileList } from "@/components/FileList";
import { RepoSidebar } from "@/components/RepoSidebar";
import { DownloadButton } from "@/components/DownloadButton";

export default async function TreePage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; path?: string[] }>;
}) {
  const { owner, repo, path: pathSegments } = await params;
  const currentPath = pathSegments?.join("/") || "";

  const [repoData, files, commits] = await Promise.all([
    fetchRepo(owner, repo),
    fetchContents(owner, repo, currentPath),
    fetchCommits(owner, repo, currentPath || undefined, 1),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-[var(--gh-fg-muted)] font-mono">
            {repoData.defaultBranch} / {currentPath || ""}
          </div>
          {currentPath && (
            <DownloadButton
              owner={owner}
              repo={repo}
              branch={repoData.defaultBranch}
              path={currentPath}
              label="Download this folder"
            />
          )}
        </div>
        <FileList
          owner={owner}
          repo={repo}
          files={files}
          currentPath={currentPath}
          lastCommit={commits[0]}
        />
      </div>
      <RepoSidebar repo={repoData} />
    </div>
  );
}
