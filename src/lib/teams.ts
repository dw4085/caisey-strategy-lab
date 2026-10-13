import "server-only";
import { db } from "@/lib/db";
import { TeamWithMembersAndSubmission } from "@/types";

// Teams with their members and submission, in the shape the pages expect
// (submissions is an array holding at most one row).
const teamsQuery = (where: { id?: string; submittedOnly?: boolean }) => db()`
  SELECT t.*,
    COALESCE((
      SELECT json_agg(json_build_object('id', m.id, 'name', m.name) ORDER BY m.created_at)
      FROM team_members m WHERE m.team_id = t.id
    ), '[]'::json) AS team_members,
    COALESCE((
      SELECT json_agg(s) FROM submissions s WHERE s.team_id = t.id
    ), '[]'::json) AS submissions
  FROM teams t
  WHERE (${where.id ?? null}::uuid IS NULL OR t.id = ${where.id ?? null}::uuid)
    AND (${!!where.submittedOnly} = false OR t.submitted)
  ORDER BY t.created_at ASC
`;

export async function listTeams(
  opts: { submittedOnly?: boolean } = {}
): Promise<TeamWithMembersAndSubmission[]> {
  return (await teamsQuery(opts)) as TeamWithMembersAndSubmission[];
}

export async function getTeam(
  id: string
): Promise<TeamWithMembersAndSubmission | null> {
  const [team] = await teamsQuery({ id });
  return (team as TeamWithMembersAndSubmission) ?? null;
}

export const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

// The team the signed-in person belongs to (team_members.student_id = hub person id), or null.
export async function teamIdOf(studentId: string): Promise<string | null> {
  const [row] = await db()`
    SELECT team_id FROM team_members WHERE student_id = ${studentId}::uuid
  `;
  return row ? String(row.team_id) : null;
}

export async function isMember(teamId: string, studentId: string) {
  if (!isUuid(teamId)) return false;
  const rows = await db()`
    SELECT 1 FROM team_members
    WHERE team_id = ${teamId}::uuid AND student_id = ${studentId}::uuid
  `;
  return rows.length > 0;
}

// The team's name, members' names and hub person ids (for activity reports to every member).
export async function teamRoster(teamId: string) {
  const [row] = await db()`
    SELECT t.name,
      COALESCE(array_agg(m.name ORDER BY m.created_at) FILTER (WHERE m.id IS NOT NULL), '{}') AS names,
      COALESCE(array_agg(m.student_id::text) FILTER (WHERE m.student_id IS NOT NULL), '{}') AS ids
    FROM teams t LEFT JOIN team_members m ON m.team_id = t.id
    WHERE t.id = ${teamId}::uuid
    GROUP BY t.id
  `;
  if (!row) return null;
  return {
    name: String(row.name),
    memberNames: row.names as string[],
    memberIds: row.ids as string[],
  };
}
