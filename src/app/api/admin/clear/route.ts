import { NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";
import { staffOnly } from "@/lib/auth/server";

// POST /api/admin/clear — delete every team, member and submission. Instructors and TAs only.
// Activity reports already sent to the class hub stay there.
export async function POST() {
  const denied = await staffOnly();
  if (denied) return denied;

  try {
    // Delete all teams — cascade handles team_members and submissions
    await db()`DELETE FROM teams`;
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
