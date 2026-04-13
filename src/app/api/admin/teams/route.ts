import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("teams")
    .select("*, team_members(id, name), submissions(*)")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Supabase returns submissions as object (not array) due to unique constraint.
  // Normalize to array for consistent frontend handling.
  const normalized = (data || []).map((team: Record<string, unknown>) => ({
    ...team,
    submissions: team.submissions
      ? Array.isArray(team.submissions)
        ? team.submissions
        : [team.submissions]
      : [],
  }));

  return NextResponse.json(normalized);
}
