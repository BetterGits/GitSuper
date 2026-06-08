import { NextRequest, NextResponse } from "next/server";
import { searchInRepo } from "@/lib/github";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const q = searchParams.get("q");

  if (!owner || !repo || !q) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const results = await searchInRepo(owner, repo, q);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
