"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import TeamRegistrationForm from "@/components/TeamRegistrationForm";
import TeamSelector from "@/components/TeamSelector";

interface TeamBasic {
  id: string;
  name: string;
}

export default function HomePage() {
  const [teams, setTeams] = useState<TeamBasic[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-block bg-white rounded-2xl p-6 mb-6">
              <Image
                src="/caisey-logo-on-light.svg"
                alt="CAiSEY"
                width={200}
                height={36}
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-50 mb-2">
              Strategy Lab
            </h1>
            <p className="text-gray-400">
              Team-based strategy exercise for Technology Strategy
              <br />
              <span className="text-gray-500">Columbia Business School</span>
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : showRegister ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-50">
                  Register Your Team
                </h2>
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition"
                >
                  Back
                </button>
              </div>
              <TeamRegistrationForm
                existingTeamNames={teams.map((t) => t.name)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setShowRegister(true)}
                className="w-full bg-gradient-to-r from-columbia-light to-columbia-dark text-white font-medium rounded-xl px-6 py-4 hover:opacity-90 transition text-lg"
              >
                Register New Team
              </button>

              {teams.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-medium text-gray-400 mb-3">
                    Return to your team dashboard
                  </h2>
                  <TeamSelector teams={teams} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
