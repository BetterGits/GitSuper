import { fetchFileContent, fetchRepo } from "@/lib/github";
import { CodeViewer } from "@/components/CodeViewer";
import { DownloadButton } from "@/components/DownloadButton";
import Link from "next/link";

export default async function BlobPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; path?: string[] }>;
}) {
  const { owner, repo, path: pathSegments } = await params;
  const filePath = pathSegments?.join("/") || "";
  const fileName = pathSegments?.at(-1) || filePath;

  const [repoData, file] = await Promise.all([
    fetchRepo(owner, repo),
    fetchFileContent(owner, repo, filePath),
  ]);

  const parentPath = filePath.split("/").slice(0, -1).join("/");
  const folderDownloadPath = parentPath || undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="font-mono text-[var(--gh-fg-muted)]">
          <Link href={`/${owner}/${repo}`} className="gh-link">{repo}</Link>
          {" / "}
          {filePath.split("/").map((part, i, arr) => {
            const p = arr.slice(0, i + 1).join("/");
            const isFile = i === arr.length - 1;
            return (
              <span key={p}>
                {isFile ? (
                  <span className="text-[var(--gh-fg-default)]">{part}</span>
                ) : (
                  <Link href={`/${owner}/${repo}/tree/${p}`} className="gh-link">{part}</Link>
                )}
                {i < arr.length - 1 && " / "}
              </span>
            );
          })}
        </div>
        {folderDownloadPath !== undefined && (
          <DownloadButton
            owner={owner}
            repo={repo}
            branch={repoData.defaultBranch}
            path={folderDownloadPath}
            label="Download folder"
          />
        )}
      </div>
      <CodeViewer content={file.content} filename={fileName} size={file.size} />
    </div>
  );
}
