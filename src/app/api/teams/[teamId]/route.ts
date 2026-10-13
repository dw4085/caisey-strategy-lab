import { NextResponse } from "next/server";
import { getTeam, isUuid } from "@/lib/teams";
import { errMessage } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  try {
    const team = isUuid(teamId) ? await getTeam(teamId) : null;
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(team);
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
