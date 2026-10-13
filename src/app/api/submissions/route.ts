import { NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";

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

  try {
    const sql = db();
    // Upsert the submission and mark the team as submitted
    const [[submission]] = await sql.transaction([
      sql`
        INSERT INTO submissions (team_id, q1_ip, q2_funding, q3_partnership, q4_market, q5_product, slides_url)
        VALUES (${teamId}, ${q1_ip || null}, ${q2_funding || null}, ${q3_partnership || null},
                ${q4_market || null}, ${q5_product || null}, ${slides_url || null})
        ON CONFLICT (team_id) DO UPDATE SET
          q1_ip = EXCLUDED.q1_ip,
          q2_funding = EXCLUDED.q2_funding,
          q3_partnership = EXCLUDED.q3_partnership,
          q4_market = EXCLUDED.q4_market,
          q5_product = EXCLUDED.q5_product,
          slides_url = EXCLUDED.slides_url
        RETURNING *
      `,
      sql`UPDATE teams SET submitted = true, submitted_at = now() WHERE id = ${teamId}`,
    ]);

    return NextResponse.json(submission);
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
