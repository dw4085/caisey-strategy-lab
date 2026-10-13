import { after, NextRequest, NextResponse } from "next/server";
import { db, errMessage } from "@/lib/db";
import { displayName, getHubUser, notSignedIn } from "@/lib/auth/server";
import { isMember, teamRoster } from "@/lib/teams";
import { questions } from "@/lib/questions";
import { outbox } from "@/lib/outbox";
import { strategySubmitted } from "@/lib/teamEvents";
import { teamLink } from "@/lib/links";
import { Submission } from "@/types";

// POST /api/submissions — submit the team's five decisions and slides link. Team members only.
export async function POST(request: NextRequest) {
  const user = await getHubUser();
  if (!user) return notSignedIn();

  const body = await request.json().catch(() => ({}));
  const teamId = String(body?.teamId ?? "");

  if (!teamId) {
    return NextResponse.json(
      { error: "teamId is required" },
      { status: 400 }
    );
  }

  // Every question answered with one of its options, plus a web link to the slides
  const answers: Record<string, string> = {};
  for (const q of questions) {
    const value = body?.[q.dbColumn];
    if (!q.options.some((o) => o.key === value)) {
      return NextResponse.json(
        { error: `Answer all 5 questions (missing: ${q.title})` },
        { status: 400 }
      );
    }
    answers[q.dbColumn] = value;
  }
  const slidesUrl = String(body?.slides_url ?? "").trim();
  if (!/^https?:\/\/\S+$/i.test(slidesUrl) || slidesUrl.length > 2000) {
    return NextResponse.json(
      { error: "Add a link to your slides (starting with https://)" },
      { status: 400 }
    );
  }

  try {
    if (!(await isMember(teamId, user.id))) {
      return NextResponse.json(
        { error: "Only the team's members can submit for it" },
        { status: 403 }
      );
    }

    const sql = db();
    const [state] = await sql`
      SELECT t.submitted, (s.id IS NOT NULL) AS has_submission
      FROM teams t LEFT JOIN submissions s ON s.team_id = t.id
      WHERE t.id = ${teamId}::uuid
    `;
    if (state?.submitted) {
      return NextResponse.json(
        { error: "Your team has already submitted. Unsubmit to make changes." },
        { status: 409 }
      );
    }

    // Upsert the submission and mark the team as submitted
    const [[submission]] = await sql.transaction([
      sql`
        INSERT INTO submissions (team_id, q1_ip, q2_funding, q3_partnership, q4_market, q5_product, slides_url)
        VALUES (${teamId}, ${answers.q1_ip}, ${answers.q2_funding}, ${answers.q3_partnership},
                ${answers.q4_market}, ${answers.q5_product}, ${slidesUrl})
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

    const roster = await teamRoster(teamId);
    if (roster) {
      await outbox().enqueue(
        strategySubmitted(
          user.id,
          displayName(user),
          teamId,
          roster,
          submission as Submission,
          !!state?.has_submission,
          teamLink(request, teamId)
        )
      );
      after(() => outbox().flush());
    }

    return NextResponse.json(submission);
  } catch (e) {
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
