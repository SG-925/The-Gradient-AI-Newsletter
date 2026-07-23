export const dynamic = "force-dynamic";

import { getIssueByDate } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;

  try {
    const issue = getIssueByDate(date);

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (err) {
    console.error(`Failed to fetch issue for date ${date}:`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
