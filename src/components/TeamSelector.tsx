"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TeamOption {
  id: string;
  name: string;
}

export default function TeamSelector({ teams }: { teams: TeamOption[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  function handleGo() {
    if (selected) {
      router.push(`/dashboard/${selected}`);
    }
  }

  return (
    <div className="flex gap-3">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-columbia focus:border-transparent outline-none transition"
      >
        <option value="">Select your team...</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleGo}
        disabled={!selected}
        className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-6 py-3 hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Go
      </button>
    </div>
  );
}
