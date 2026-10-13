"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Create a team: the signed-in student becomes its first member; teammates join it from the
// home page.
export default function TeamRegistrationForm({
  existingTeamNames,
}: {
  existingTeamNames: string[];
}) {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDuplicate = existingTeamNames.some(
    (n) => n.toLowerCase() === teamName.trim().toLowerCase()
  );

  const canSubmit = teamName.trim().length > 0 && !isDuplicate && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register team");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Team Name
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter your team name"
          maxLength={60}
          className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-columbia focus:border-transparent outline-none transition"
          autoFocus
        />
        {isDuplicate && (
          <p className="mt-1 text-sm text-red-400">
            This team name is already taken
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          You&apos;ll be the team&apos;s first member. Your teammates join it
          from this page once it&apos;s created.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-gradient-to-r from-columbia-light to-columbia-dark text-white font-medium rounded-lg px-6 py-3 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Team"}
      </button>
    </form>
  );
}
