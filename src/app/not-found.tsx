import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-[var(--gh-fg-muted)] mb-4">404</h1>
      <p className="text-lg mb-6">Repository not found or GitHub API rate limit reached.</p>
      <Link href="/" className="gh-btn gh-btn-primary">
        Go home
      </Link>
    </div>
  );
}
