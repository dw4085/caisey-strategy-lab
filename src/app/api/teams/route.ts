import { after, NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";
import { displayName, getHubUser, notSignedIn } from "@/lib/auth/server";
import { teamIdOf } from "@/lib/teams";
import { outbox } from "@/lib/outbox";
import { teamRegistered } from "@/lib/teamEvents";
import { teamLink } from "@/lib/links";

const isUniqueViolation = (e: unknown) =>
  (e as { code?: string })?.code === "23505";

// GET /api/teams — every team with its members' names, for joining a team. Signed in.
export async function GET() {
  if (!(await getHubUser())) return notSignedIn();
  try {
    const rows = await db()`
      SELECT t.id, t.name, t.submitted, t.created_at,
        COALESCE((
          SELECT json_agg(json_build_object('id', m.id, 'name', m.name) ORDER BY m.created_at)
          FROM team_members m WHERE m.team_id = t.id
        ), '[]'::json) AS team_members
      FROM teams t
      ORDER BY t.created_at ASC
    `;
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}

// POST /api/teams — create a team; the signed-in person becomes its first member.
export async function POST(request: NextRequest) {
  const user = await getHubUser();
  if (!user) return notSignedIn();

  const body = await request.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim().replace(/\s+/g, " ");

  if (!name) {
    return NextResponse.json(
      { error: "Team name is required" },
      { status: 400 }
    );
  }
  if (name.length > 60) {
    return NextResponse.json(
      { error: "Team names are at most 60 characters" },
      { status: 400 }
    );
  }

  try {
    const sql = db();

    if (await teamIdOf(user.id)) {
      return NextResponse.json(
        { error: "You're already on a team" },
        { status: 409 }
      );
    }

    // Check for duplicate team name (case-insensitive)
    const existing = await sql`
      SELECT id FROM teams WHERE lower(name) = lower(${name}) LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A team with this name already exists" },
        { status: 409 }
      );
    }

    // Create the team with its creator as the first member
    const teamId = crypto.randomUUID();
    const memberName = displayName(user);
    const [[team]] = await sql.transaction([
      sql`INSERT INTO teams (id, name) VALUES (${teamId}, ${name}) RETURNING *`,
      sql`
        INSERT INTO team_members (team_id, name, email, student_id)
        VALUES (${teamId}, ${memberName}, ${user.email}, ${user.id})
      `,
    ]);

    await outbox().enqueue(
      teamRegistered(
        user.id,
        teamId,
        { name, memberNames: [memberName], memberIds: [user.id] },
        "created",
        teamLink(request, teamId)
      )
    );
    after(() => outbox().flush());

    return NextResponse.json(team, { status: 201 });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return NextResponse.json(
        { error: "That team name was just taken, or you're already on a team" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
