"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TeamOption {
  id: string;
  name: string;
  team_members: { id: string; name: string }[];
}

// Join an existing team (the signed-in student is added as a member).
export default function TeamSelector({ teams }: { teams: TeamOption[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!selected) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${selected}/members`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not join the team");
        setLoading(false);
        return;
      }
      router.push(`/dashboard/${selected}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 min-w-0 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-columbia focus:border-transparent outline-none transition"
        >
          <option value="">Select your team...</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {t.team_members.length > 0
                ? ` (${t.team_members.map((m) => m.name).join(", ")})`
                : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handleJoin}
          disabled={!selected || loading}
          className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-6 py-3 hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Joining..." : "Join"}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
