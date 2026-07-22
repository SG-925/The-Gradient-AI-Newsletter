export const dynamic = "force-dynamic";

import { readIssuesFromMarkdown } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const issues = readIssuesFromMarkdown();
  return NextResponse.json(issues);
}
