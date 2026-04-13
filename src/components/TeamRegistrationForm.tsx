"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamRegistrationForm({
  existingTeamNames,
}: {
  existingTeamNames: string[];
}) {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDuplicate = existingTeamNames.some(
    (n) => n.toLowerCase() === teamName.trim().toLowerCase()
  );

  const canSubmit =
    teamName.trim().length > 0 &&
    members.some((m) => m.trim().length > 0) &&
    !isDuplicate &&
    !loading;

  function addMember() {
    if (members.length < 6) {
      setMembers([...members, ""]);
    }
  }

  function removeMember(index: number) {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  }

  function updateMember(index: number, value: string) {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          members: members.map((m) => m.trim()).filter((m) => m.length > 0),
        }),
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
          className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-columbia focus:border-transparent outline-none transition"
        />
        {isDuplicate && (
          <p className="mt-1 text-sm text-red-400">
            This team name is already taken
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Team Members
        </label>
        <div className="space-y-3">
          {members.map((member, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={member}
                onChange={(e) => updateMember(i, e.target.value)}
                placeholder={`Member ${i + 1} name`}
                className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-columbia focus:border-transparent outline-none transition"
              />
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="px-3 py-3 text-gray-500 hover:text-red-400 transition"
                  title="Remove member"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {members.length < 6 && (
          <button
            type="button"
            onClick={addMember}
            className="mt-3 text-sm text-columbia hover:text-columbia-light transition"
          >
            + Add another member
          </button>
        )}
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
        {loading ? "Registering..." : "Register Team"}
      </button>
    </form>
  );
}
