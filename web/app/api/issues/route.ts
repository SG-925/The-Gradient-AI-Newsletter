export const dynamic = "force-dynamic";

import { getAllIssueDates, getIssueByDate } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dates = getAllIssueDates();
    const issues = dates
      .map((date) => getIssueByDate(date))
      .filter((issue): issue is NonNullable<typeof issue> => issue !== null);

    return NextResponse.json(issues);
  } catch (err) {
    console.error("Failed to fetch issues:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
