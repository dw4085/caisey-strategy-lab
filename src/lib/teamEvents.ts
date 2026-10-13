import type { HubEvent } from "@/lib/hub";
import { questions } from "@/lib/questions";
import type { Submission } from "@/types";

// What the Strategy Lab reports to the class hub's activity log: a team was created or joined,
// and the team's strategy was submitted. Team work: every member sees each report (subjectIds),
// and all of a team's reports share its id as runId, so the hub shows the team as one row.

interface Roster {
  name: string;
  memberNames: string[];
  memberIds: string[];
}

export function teamRegistered(
  actorId: string,
  teamId: string,
  team: Roster,
  how: "created" | "joined",
  link: string
): HubEvent {
  return {
    actorId,
    subjectIds: team.memberIds,
    type: how === "created" ? "team.created" : "team.joined",
    title: `${how === "created" ? "Created" : "Joined"} team “${team.name}”`,
    snapshot: {
      team: team.name,
      members: team.memberNames.join(", "),
    },
    runId: teamId,
    link,
  };
}

const answerLabel = (dbColumn: string, key: string | null) => {
  const q = questions.find((q) => q.dbColumn === dbColumn);
  return q?.options.find((o) => o.key === key)?.label ?? key ?? "—";
};

export function strategySubmitted(
  actorId: string,
  actorName: string,
  teamId: string,
  team: Roster,
  submission: Submission,
  resubmitted: boolean,
  link: string
): HubEvent {
  const answers = submission as unknown as Record<string, string | null>;
  // Field order is the order shown in the class activity log.
  return {
    actorId,
    subjectIds: team.memberIds,
    type: "run.submitted",
    title: `${resubmitted ? "Resubmitted" : "Submitted"} team “${team.name}”’s strategy`,
    snapshot: {
      team: team.name,
      members: team.memberNames.join(", "),
      submittedBy: actorName,
      decisions: questions.map((q) => ({
        question: q.title,
        decision: answerLabel(q.dbColumn, answers[q.dbColumn]),
      })),
      slides: submission.slides_url,
    },
    runId: teamId,
    link,
  };
}
