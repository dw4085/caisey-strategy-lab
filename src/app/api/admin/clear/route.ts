import { NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete all teams — cascade handles team_members and submissions
    await db()`DELETE FROM teams`;
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
