import { NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";
import { getHubUser, notSignedIn } from "@/lib/auth/server";
import { isStaff } from "@/lib/hub";
import { isMember, isUuid } from "@/lib/teams";

type Params = { params: Promise<{ teamId: string }> };

// GET — the team's submission, for its members and for instructors and TAs.
export async function GET(_request: Request, { params }: Params) {
  const user = await getHubUser();
  if (!user) return notSignedIn();
  const { teamId } = await params;

  try {
    if (!isStaff(user) && !(await isMember(teamId, user.id))) {
      return NextResponse.json(
        { error: "This team's submission is open to its members" },
        { status: 403 }
      );
    }
    const [submission] = isUuid(teamId)
      ? await db()`SELECT * FROM submissions WHERE team_id = ${teamId}`
      : [];
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    return NextResponse.json(submission);
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}

// DELETE — unsubmit: keep the submission row but mark the team as not submitted. Members only.
export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getHubUser();
  if (!user) return notSignedIn();
  const { teamId } = await params;

  try {
    if (!(await isMember(teamId, user.id))) {
      return NextResponse.json(
        { error: "Only the team's members can unsubmit" },
        { status: 403 }
      );
    }
    await db()`UPDATE teams SET submitted = false, submitted_at = NULL WHERE id = ${teamId}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
