import { RepoCompare } from "@/components/RepoCompare";
import { CompareView } from "@/components/CompareView";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Repository Compare</h1>
      {!a || !b ? (
        <RepoCompare />
      ) : (
        <CompareView a={a} b={b} />
      )}
    </div>
  );
}
