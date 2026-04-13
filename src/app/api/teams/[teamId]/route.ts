import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  const { data, error } = await supabase
    .from("teams")
    .select("*, team_members(id, name), submissions(*)")
    .eq("id", teamId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Normalize submissions to array (Supabase returns object due to unique constraint)
  const normalized = {
    ...data,
    submissions: data.submissions
      ? Array.isArray(data.submissions)
        ? data.submissions
        : [data.submissions]
      : [],
  };

  return NextResponse.json(normalized);
}
