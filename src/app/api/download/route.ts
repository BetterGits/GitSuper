import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { fetchFileContent, fetchTree, getRepoZipUrl } from "@/lib/github";

const MAX_FILES = 200;
const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const ref = searchParams.get("ref") || "main";
  const path = searchParams.get("path") || "";

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 });
  }

  if (!path) {
    const zipUrl = getRepoZipUrl(owner, repo, ref);
    return NextResponse.redirect(zipUrl);
  }

  try {
    const tree = await fetchTree(owner, repo, ref);
    const prefix = path.endsWith("/") ? path : `${path}/`;
    const folderFiles = tree.filter(
      (t) => t.type === "blob" && t.path.startsWith(prefix)
    );

    if (folderFiles.length === 0) {
      return NextResponse.json({ error: "Folder not found or empty" }, { status: 404 });
    }

    if (folderFiles.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Folder too large (${folderFiles.length} files). Max ${MAX_FILES}.` },
        { status: 413 }
      );
    }

    const zip = new JSZip();
    let totalBytes = 0;

    for (const file of folderFiles) {
      if ((file.size || 0) > 5 * 1024 * 1024) continue;
      try {
        const { content, size } = await fetchFileContent(
          owner,
          repo,
          file.path,
          ref
        );
        totalBytes += size;
        if (totalBytes > MAX_TOTAL_BYTES) break;
        const relativePath = file.path.slice(prefix.length);
        zip.file(relativePath, content);
      } catch {
        // skip binary or large files
      }
    }

    const blob = await zip.generateAsync({ type: "arraybuffer" });
    const folderName = path.split("/").pop() || repo;

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${folderName}.zip"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Download failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
