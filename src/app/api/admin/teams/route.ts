import { NextResponse } from "next/server";
import { listTeams } from "@/lib/teams";
import { errMessage } from "@/lib/db";

export async function GET() {
  try {
    return NextResponse.json(await listTeams());
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
