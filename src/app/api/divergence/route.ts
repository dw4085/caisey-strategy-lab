import { NextResponse } from "next/server";
import { listTeams } from "@/lib/teams";
import { errMessage } from "@/lib/db";
import { staffOnly } from "@/lib/auth/server";
import {
  findMostDivergentPair,
  MAX_DISTANCE,
  TeamSubmission,
} from "@/lib/divergence";

// GET /api/divergence — the two submitted teams whose answers differ most. Instructors and TAs only.
export async function GET() {
  const denied = await staffOnly();
  if (denied) return denied;
  let teams;
  try {
    teams = await listTeams({ submittedOnly: true });
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }

  // Only teams with a submission row take part
  const withSubmissions = teams.filter((t) => t.submissions.length > 0);
  const teamSubmissions: TeamSubmission[] = withSubmissions.map((t) => {
    const sub = t.submissions[0];
    return {
      teamId: t.id,
      teamName: t.name,
      answers: {
        q1_ip: sub.q1_ip || null,
        q2_funding: sub.q2_funding || null,
        q3_partnership: sub.q3_partnership || null,
        q4_market: sub.q4_market || null,
        q5_product: sub.q5_product || null,
      },
    };
  });

  if (teamSubmissions.length < 2) {
    return NextResponse.json(
      { error: "At least 2 submitted teams are required" },
      { status: 400 }
    );
  }

  const result = findMostDivergentPair(teamSubmissions);

  if (!result) {
    return NextResponse.json(
      { error: "Could not compute divergence" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    team1: withSubmissions[result.team1Index],
    team2: withSubmissions[result.team2Index],
    distance: result.distance,
    maxDistance: MAX_DISTANCE,
    breakdown: result.breakdown,
  });
}
