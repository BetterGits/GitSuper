import type { LanguageStats } from "@/lib/types";

const COLORS = [
  "#3178c6", "#f1e05a", "#3572A5", "#b07219", "#e34c26",
  "#563d7c", "#00ADD8", "#178600", "#384d54", "#DEA584",
];

export function LanguageBar({ languages }: { languages: LanguageStats }) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex h-2 rounded-full overflow-hidden">
        {entries.map(([lang, bytes], i) => (
          <div
            key={lang}
            style={{
              width: `${(bytes / total) * 100}%`,
              backgroundColor: COLORS[i % COLORS.length],
            }}
            title={`${lang}: ${((bytes / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[var(--gh-fg-muted)]">
        {entries.slice(0, 8).map(([lang, bytes], i) => (
          <span key={lang} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {lang} <span className="text-[var(--gh-fg-subtle)]">{((bytes / total) * 100).toFixed(1)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
