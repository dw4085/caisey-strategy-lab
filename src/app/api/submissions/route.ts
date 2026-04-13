import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    teamId,
    q1_ip,
    q2_funding,
    q3_partnership,
    q4_market,
    q5_product,
    slides_url,
  } = body;

  if (!teamId) {
    return NextResponse.json(
      { error: "teamId is required" },
      { status: 400 }
    );
  }

  // Upsert submission
  const { data: submission, error: subError } = await supabase
    .from("submissions")
    .upsert(
      {
        team_id: teamId,
        q1_ip: q1_ip || null,
        q2_funding: q2_funding || null,
        q3_partnership: q3_partnership || null,
        q4_market: q4_market || null,
        q5_product: q5_product || null,
        slides_url: slides_url || null,
      },
      { onConflict: "team_id" }
    )
    .select()
    .single();

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  // Mark team as submitted
  const { error: teamError } = await supabase
    .from("teams")
    .update({ submitted: true, submitted_at: new Date().toISOString() })
    .eq("id", teamId);

  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 500 });
  }

  return NextResponse.json(submission);
}
