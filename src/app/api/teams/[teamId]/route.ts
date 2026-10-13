import { NextResponse } from "next/server";
import { getTeam, isMember, isUuid, teamIdOf } from "@/lib/teams";
import { getHubUser, notSignedIn } from "@/lib/auth/server";
import { isStaff } from "@/lib/hub";
import { errMessage } from "@/lib/db";

// GET /api/teams/[teamId] — the team with its submission, for its members and for instructors
// and TAs (read-only). Other students get the team's name and members, to offer joining it.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getHubUser();
  if (!user) return notSignedIn();
  const { teamId } = await params;

  try {
    const team = isUuid(teamId) ? await getTeam(teamId) : null;
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const member = await isMember(teamId, user.id);
    if (!member && !isStaff(user)) {
      const ownTeamId = await teamIdOf(user.id);
      return NextResponse.json(
        {
          error: "This team's page is open to its members",
          team: { id: team.id, name: team.name, team_members: team.team_members },
          ownTeamId,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ ...team, isMember: member });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
