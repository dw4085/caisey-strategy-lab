"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SubmissionForm from "@/components/SubmissionForm";
import { TeamMember, TeamWithMembersAndSubmission } from "@/types";

type TeamView = TeamWithMembersAndSubmission & { isMember: boolean };

// Shown to a student who isn't on this team: who is, and a way to join it.
interface Outsider {
  team: { id: string; name: string; team_members: Pick<TeamMember, "id" | "name">[] };
  ownTeamId: string | null;
}

function MemberChips({ members }: { members: Pick<TeamMember, "id" | "name">[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => (
        <span
          key={m.id}
          className="inline-block bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-sm text-gray-300"
        >
          {m.name}
        </span>
      ))}
    </div>
  );
}

export default function TeamDashboard({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const router = useRouter();
  const [team, setTeam] = useState<TeamView | null>(null);
  const [outsider, setOutsider] = useState<Outsider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      const data = await res.json().catch(() => ({}));
      if (res.status === 403 && data.team) {
        setOutsider({ team: data.team, ownTeamId: data.ownTeamId ?? null });
        setTeam(null);
        return;
      }
      if (!res.ok) {
        setError(data.error || "Team not found");
        return;
      }
      setOutsider(null);
      setTeam(data);
    } catch {
      setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  async function handleJoin() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/teams/${teamId}/members`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not join the team");
    }
    await fetchTeam();
    setBusy(false);
  }

  async function handleLeave() {
    if (!team) return;
    if (!window.confirm(`Leave team “${team.name}”?`)) return;
    setBusy(true);
    const res = await fetch(`/api/teams/${teamId}/members`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
    } else {
      setError("Could not leave the team");
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </main>
      </div>
    );
  }

  if (outsider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h1 className="text-xl font-semibold text-gray-50 mb-1">
              {outsider.team.name}
            </h1>
            <p className="text-sm text-gray-400 mb-4">
              You&apos;re not on this team. Its page is open to its members.
            </p>
            {outsider.team.team_members.length > 0 && (
              <div className="mb-6">
                <MemberChips members={outsider.team.team_members} />
              </div>
            )}
            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
            {outsider.ownTeamId ? (
              <Link
                href={`/dashboard/${outsider.ownTeamId}`}
                className="block text-center w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-6 py-3 hover:bg-gray-700 transition"
              >
                Go to your team
              </Link>
            ) : (
              <button
                onClick={handleJoin}
                disabled={busy}
                className="w-full bg-gradient-to-r from-columbia-light to-columbia-dark text-white font-medium rounded-lg px-6 py-3 hover:opacity-90 transition disabled:opacity-40"
              >
                {busy ? "Joining..." : "Join this team"}
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-red-400">{error || "Team not found"}</div>
        </main>
      </div>
    );
  }

  const existingSubmission =
    team.submissions && team.submissions.length > 0
      ? team.submissions[0]
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          {!team.isMember && (
            <div className="mb-6 bg-columbia/10 border border-columbia/30 rounded-lg px-4 py-3 text-sm text-gray-300">
              Instructor view (read-only). Only the team&apos;s members can
              edit or submit.
            </div>
          )}

          {/* Team info */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-50">{team.name}</h1>
              {team.isMember && (
                <button
                  onClick={handleLeave}
                  disabled={busy}
                  className="shrink-0 text-xs text-gray-500 hover:text-red-400 transition mt-2"
                >
                  Leave team
                </button>
              )}
            </div>
            <MemberChips members={team.team_members} />
            {team.isMember && !team.submitted && (
              <p className="text-xs text-gray-500 mt-3">
                Teammates join this team from the Strategy Lab home page.
              </p>
            )}
          </div>

          <SubmissionForm
            key={`${team.submitted}-${existingSubmission?.updated_at ?? ""}`}
            teamId={team.id}
            submitted={team.submitted}
            submittedAt={team.submitted_at}
            existingSubmission={existingSubmission}
            onUpdate={fetchTeam}
            readOnly={!team.isMember}
          />
        </div>
      </main>
    </div>
  );
}
