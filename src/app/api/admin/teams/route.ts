import { NextResponse } from "next/server";
import { listTeams } from "@/lib/teams";
import { errMessage } from "@/lib/db";
import { staffOnly } from "@/lib/auth/server";

// GET /api/admin/teams — every team with members and submission. Instructors and TAs only.
export async function GET() {
  const denied = await staffOnly();
  if (denied) return denied;
  try {
    return NextResponse.json(await listTeams());
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
