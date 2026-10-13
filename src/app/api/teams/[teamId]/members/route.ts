import { after, NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";
import { displayName, getHubUser, notSignedIn } from "@/lib/auth/server";
import { isUuid, teamIdOf, teamRoster } from "@/lib/teams";
import { outbox } from "@/lib/outbox";
import { teamRegistered } from "@/lib/teamEvents";
import { teamLink } from "@/lib/links";

type Params = { params: Promise<{ teamId: string }> };

// POST /api/teams/[teamId]/members — the signed-in person joins the team (one team each).
export async function POST(request: NextRequest, { params }: Params) {
  const user = await getHubUser();
  if (!user) return notSignedIn();
  const { teamId } = await params;
  if (!isUuid(teamId)) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  try {
    const current = await teamIdOf(user.id);
    if (current === teamId) return NextResponse.json({ ok: true });
    if (current) {
      return NextResponse.json(
        { error: "You're already on another team. Leave it first." },
        { status: 409 }
      );
    }

    const joined = await db()`
      INSERT INTO team_members (team_id, name, email, student_id)
      SELECT t.id, ${displayName(user)}, ${user.email}, ${user.id}::uuid
      FROM teams t WHERE t.id = ${teamId}::uuid
      ON CONFLICT (student_id) WHERE student_id IS NOT NULL DO NOTHING
      RETURNING id
    `;
    if (joined.length === 0) {
      return (await teamIdOf(user.id))
        ? NextResponse.json({ error: "You're already on a team" }, { status: 409 })
        : NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const roster = await teamRoster(teamId);
    if (roster) {
      await outbox().enqueue(
        teamRegistered(user.id, teamId, roster, "joined", teamLink(request, teamId))
      );
      after(() => outbox().flush());
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}

// DELETE /api/teams/[teamId]/members — the signed-in person leaves the team. A team left
// empty before it submitted is removed, freeing its name.
export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getHubUser();
  if (!user) return notSignedIn();
  const { teamId } = await params;
  if (!isUuid(teamId)) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  try {
    const sql = db();
    await sql.transaction([
      sql`
        DELETE FROM team_members
        WHERE team_id = ${teamId}::uuid AND student_id = ${user.id}::uuid
      `,
      sql`
        DELETE FROM teams t
        WHERE t.id = ${teamId}::uuid AND NOT t.submitted
          AND NOT EXISTS (SELECT 1 FROM team_members m WHERE m.team_id = t.id)
      `,
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
