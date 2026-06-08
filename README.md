<img width="2752" height="1536" alt="gitsuperlogo" src="https://github.com/user-attachments/assets/6e5379d2-5fd3-458a-8686-3d6d168a2125" />

A GitHub repository viewer built with Next.js and deployable on Vercel. Paste any GitHub repo URL and browse files, commits, contributors, and README with a familiar GitHub-like interface plus extra features GitHub doesn't offer.

## Features

### GitHub-like
- File & folder browser with breadcrumbs
- Syntax-highlighted file viewer
- README rendering (GFM)
- Commit history
- Contributors list
- Repo description, stars, forks, topics, languages
- Clone panel (HTTPS / SSH / `gh` CLI)
- Download entire repo as ZIP

### Beyond GitHub
- **Full-repo code search** with inline match previews
- **Repo health dashboard** score, commit charts, file breakdown, largest files
- **Side-by-side repo compare**
- **Folder ZIP downloads** (any subdirectory)
- **Bookmarks** (saved in browser)
- **Light / dark themes**
- **Export repo stats as JSON**

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste a repo URL like `facebook/react`.

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Optionally add `GITHUB_TOKEN` in Environment Variables for higher API rate limits

```bash
npx vercel
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | Personal access token for 5000 API requests/hour |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Octokit (GitHub API)
- Recharts, React Markdown, Prism, JSZip
