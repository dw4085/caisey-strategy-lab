import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  findMostDivergentPair,
  MAX_DISTANCE,
  TeamSubmission,
} from "@/lib/divergence";

export async function GET() {
  const { data: teams, error } = await supabase
    .from("teams")
    .select("*, team_members(id, name), submissions(*)")
    .eq("submitted", true)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build team submissions array
  const teamSubmissions: TeamSubmission[] = (teams || [])
    .filter(
      (t: Record<string, unknown>) =>
        Array.isArray(t.submissions) && t.submissions.length > 0
    )
    .map((t: Record<string, unknown>) => {
      const sub = (t.submissions as Record<string, unknown>[])[0];
      return {
        teamId: t.id as string,
        teamName: t.name as string,
        answers: {
          q1_ip: (sub.q1_ip as string) || null,
          q2_funding: (sub.q2_funding as string) || null,
          q3_partnership: (sub.q3_partnership as string) || null,
          q4_market: (sub.q4_market as string) || null,
          q5_product: (sub.q5_product as string) || null,
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
    team1: teams[result.team1Index],
    team2: teams[result.team2Index],
    distance: result.distance,
    maxDistance: MAX_DISTANCE,
    breakdown: result.breakdown,
  });
}
