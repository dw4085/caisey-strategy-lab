import { NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";

export async function GET() {
  try {
    const rows = await db()`
      SELECT t.*,
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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, members } = body as {
    name: string;
    members: string[];
  };

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Team name is required" },
      { status: 400 }
    );
  }

  const trimmedMembers = (members || [])
    .map((m: string) => m.trim())
    .filter((m: string) => m.length > 0);

  if (trimmedMembers.length === 0) {
    return NextResponse.json(
      { error: "At least one team member is required" },
      { status: 400 }
    );
  }

  try {
    const sql = db();

    // Check for duplicate team name (case-insensitive)
    const existing = await sql`
      SELECT id FROM teams WHERE lower(name) = lower(${name.trim()}) LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A team with this name already exists" },
        { status: 409 }
      );
    }

    // Create the team and its members together
    const teamId = crypto.randomUUID();
    const [[team]] = await sql.transaction([
      sql`INSERT INTO teams (id, name) VALUES (${teamId}, ${name.trim()}) RETURNING *`,
      sql`
        INSERT INTO team_members (team_id, name)
        SELECT ${teamId}::uuid, unnest(${trimmedMembers}::text[])
      `,
    ]);

    return NextResponse.json(team, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
