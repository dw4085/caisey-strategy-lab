import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("teams")
    .select("*, team_members(id, name)")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, members } = body as {
    name: string;
    members: string[];
  };

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Team name is required" },
      { status: 400 }
    );
  }

  const trimmedMembers = (members || [])
    .map((m: string) => m.trim())
    .filter((m: string) => m.length > 0);

  if (trimmedMembers.length === 0) {
    return NextResponse.json(
      { error: "At least one team member is required" },
      { status: 400 }
    );
  }

  // Check for duplicate team name (case-insensitive)
  const { data: existing } = await supabase
    .from("teams")
    .select("id")
    .ilike("name", name.trim())
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: "A team with this name already exists" },
      { status: 409 }
    );
  }

  // Create team
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({ name: name.trim() })
    .select()
    .single();

  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 500 });
  }

  // Create members
  const memberRows = trimmedMembers.map((memberName: string) => ({
    team_id: team.id,
    name: memberName,
  }));

  const { error: membersError } = await supabase
    .from("team_members")
    .insert(memberRows);

  if (membersError) {
    // Clean up the team if members fail
    await supabase.from("teams").delete().eq("id", team.id);
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  return NextResponse.json(team, { status: 201 });
}
