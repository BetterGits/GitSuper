"use client";

import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "./ThemeProvider";

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    ts: "typescript", tsx: "tsx", js: "javascript", jsx: "jsx",
    py: "python", rb: "ruby", go: "go", rs: "rust", java: "java",
    css: "css", scss: "scss", html: "markup", json: "json",
    md: "markdown", yml: "yaml", yaml: "yaml", sh: "bash",
    sql: "sql", swift: "swift", kt: "kotlin", cpp: "cpp", c: "c",
    cs: "csharp", php: "php", vue: "markup", svelte: "markup",
  };
  return map[ext] || "text";
}

export function CodeViewer({
  content,
  filename,
  size,
}: {
  content: string;
  filename: string;
  size: number;
}) {
  const { theme } = useTheme();
  const lang = getLanguage(filename);
  const prismTheme = theme === "dark" ? themes.vsDark : themes.github;

  const lines = content.split("\n");

  return (
    <div className="gh-box overflow-hidden">
      <div className="gh-box-header flex items-center justify-between">
        <span className="font-mono text-sm">{filename}</span>
        <span className="text-xs text-[var(--gh-fg-muted)] font-normal">
          {lines.length} lines · {(size / 1024).toFixed(1)} KB
        </span>
      </div>
      <Highlight theme={prismTheme} code={content} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} !m-0 !rounded-none overflow-auto text-[13px] leading-5`}
            style={{ ...style, background: "var(--gh-code-bg)" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell text-right pr-4 pl-4 select-none text-[var(--gh-fg-subtle)] w-[1%]">
                  {i + 1}
                </span>
                <span className="table-cell pr-4">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
