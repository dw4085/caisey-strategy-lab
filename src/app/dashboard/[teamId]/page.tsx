"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import Header from "@/components/Header";
import SubmissionForm from "@/components/SubmissionForm";
import { TeamWithMembersAndSubmission } from "@/types";

export default function TeamDashboard({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const [team, setTeam] = useState<TeamWithMembersAndSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) {
        setError("Team not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
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
          {/* Team info */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-50 mb-2">
              {team.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {team.team_members.map((m) => (
                <span
                  key={m.id}
                  className="inline-block bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-sm text-gray-300"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          <SubmissionForm
            teamId={team.id}
            submitted={team.submitted}
            submittedAt={team.submitted_at}
            existingSubmission={existingSubmission}
            onUpdate={fetchTeam}
          />
        </div>
      </main>
    </div>
  );
}
