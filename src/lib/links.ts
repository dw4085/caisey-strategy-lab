import type { NextRequest } from "next/server";

// A link to a team's dashboard on this site (used in the class hub's activity log). Members
// reopen their team's work; instructors and TAs see it read-only.
export function teamLink(req: NextRequest, teamId: string): string {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    req.nextUrl.host;
  return `https://${host}/dashboard/${teamId}`;
}
