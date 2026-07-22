export const dynamic = "force-dynamic";

import { readIssuesFromMarkdown } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const issues = readIssuesFromMarkdown();
  const issue = issues.find((i) => i.date === params.date);

  if (!issue) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(issue);
}
