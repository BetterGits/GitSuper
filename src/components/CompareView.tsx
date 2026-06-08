import { fetchContributors, fetchLanguages, fetchRepo } from "@/lib/github";
import { LanguageBar } from "./LanguageBar";

export async function CompareView({ a, b }: { a: string; b: string }) {
  const [ownerA, repoA] = a.split("/");
  const [ownerB, repoB] = b.split("/");

  const [repo1, repo2, langs1, langs2, contribs1, contribs2] = await Promise.all([
    fetchRepo(ownerA, repoA),
    fetchRepo(ownerB, repoB),
    fetchLanguages(ownerA, repoA),
    fetchLanguages(ownerB, repoB),
    fetchContributors(ownerA, repoA, 5),
    fetchContributors(ownerB, repoB, 5),
  ]);

  const rows = [
    { label: "Stars", v1: repo1.stars, v2: repo2.stars },
    { label: "Forks", v1: repo1.forks, v2: repo2.forks },
    { label: "Watchers", v1: repo1.watchers, v2: repo2.watchers },
    { label: "Open Issues", v1: repo1.openIssues, v2: repo2.openIssues },
    { label: "Size (KB)", v1: repo1.size, v2: repo2.size },
    { label: "Topics", v1: repo1.topics.length, v2: repo2.topics.length },
    { label: "Contributors (top 5 sum)", v1: contribs1.reduce((s, c) => s + c.contributions, 0), v2: contribs2.reduce((s, c) => s + c.contributions, 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="gh-box p-4">
          <h2 className="text-xl font-semibold gh-link">{repo1.fullName}</h2>
          <p className="text-sm text-[var(--gh-fg-muted)] mt-1">{repo1.description}</p>
        </div>
        <div className="gh-box p-4">
          <h2 className="text-xl font-semibold gh-link">{repo2.fullName}</h2>
          <p className="text-sm text-[var(--gh-fg-muted)] mt-1">{repo2.description}</p>
        </div>
      </div>

      <div className="gh-box overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="gh-box-header">
              <th className="text-left px-4 py-2">Metric</th>
              <th className="text-right px-4 py-2">{repoA}</th>
              <th className="text-right px-4 py-2">{repoB}</th>
              <th className="text-center px-4 py-2">Winner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const winner =
                r.v1 > r.v2 ? repoA : r.v2 > r.v1 ? repoB : "Tie";
              return (
                <tr key={r.label} className="border-t border-[var(--gh-border-default)]">
                  <td className="px-4 py-2 font-medium">{r.label}</td>
                  <td className={`px-4 py-2 text-right ${r.v1 > r.v2 ? "text-[var(--gh-success-fg)] font-bold" : ""}`}>
                    {typeof r.v1 === "number" ? r.v1.toLocaleString() : r.v1}
                  </td>
                  <td className={`px-4 py-2 text-right ${r.v2 > r.v1 ? "text-[var(--gh-success-fg)] font-bold" : ""}`}>
                    {typeof r.v2 === "number" ? r.v2.toLocaleString() : r.v2}
                  </td>
                  <td className="px-4 py-2 text-center text-[var(--gh-fg-muted)]">{winner}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gh-box p-4">
          <h3 className="font-semibold mb-2">Languages — {repoA}</h3>
          <LanguageBar languages={langs1} />
        </div>
        <div className="gh-box p-4">
          <h3 className="font-semibold mb-2">Languages — {repoB}</h3>
          <LanguageBar languages={langs2} />
        </div>
      </div>
    </div>
  );
}
