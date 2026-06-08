import { notFound } from "next/navigation";
import { fetchLanguages, fetchRepo } from "@/lib/github";
import { RepoHeader } from "@/components/RepoHeader";
import { RepoTabs } from "@/components/RepoTabs";

export default async function RepoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;

  try {
    const [repoData, languages] = await Promise.all([
      fetchRepo(owner, repo),
      fetchLanguages(owner, repo),
    ]);

    return (
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <RepoHeader repo={repoData} languages={languages} />
        <RepoTabs owner={owner} repo={repo} />
        {children}
      </div>
    );
  } catch {
    notFound();
  }
}
