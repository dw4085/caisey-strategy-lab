import { NextResponse } from "next/server";
import { displayName, getHubUser, notSignedIn } from "@/lib/auth/server";
import { isStaff } from "@/lib/hub";
import { db, errMessage } from "@/lib/db";

// GET /api/me — the signed-in person (from the class hub) and the team they're on, if any.
export async function GET() {
  const user = await getHubUser();
  if (!user) return notSignedIn();
  try {
    const [team] = await db()`
      SELECT t.id, t.name FROM team_members m JOIN teams t ON t.id = m.team_id
      WHERE m.student_id = ${user.id}::uuid
    `;
    const name = displayName(user);
    return NextResponse.json({
      name,
      firstName: name.split(/\s+/)[0],
      isStaff: isStaff(user),
      team: team ? { id: team.id, name: team.name } : null,
    });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
