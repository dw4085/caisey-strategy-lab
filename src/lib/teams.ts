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
