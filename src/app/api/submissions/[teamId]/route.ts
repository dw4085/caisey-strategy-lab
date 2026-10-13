import { NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";
import { isUuid } from "@/lib/teams";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  try {
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

// Unsubmit: keep the submission row but mark team as not submitted
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  try {
    if (isUuid(teamId)) {
      await db()`UPDATE teams SET submitted = false, submitted_at = NULL WHERE id = ${teamId}`;
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
