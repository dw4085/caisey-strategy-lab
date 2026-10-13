"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import TeamRegistrationForm from "@/components/TeamRegistrationForm";
import TeamSelector from "@/components/TeamSelector";

interface TeamBasic {
  id: string;
  name: string;
  team_members: { id: string; name: string }[];
}

interface Me {
  name: string;
  firstName: string;
  isStaff: boolean;
  team: { id: string; name: string } | null;
}

export default function HomePage() {
  const [teams, setTeams] = useState<TeamBasic[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/me").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/teams").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([meData, teamsData]) => {
        setMe(meData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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

          {me && (
            <p className="text-center text-sm text-gray-400 mb-4">
              Signed in as{" "}
              <span className="text-gray-200 font-medium">{me.name}</span>
              {me.isStaff && (
                <>
                  {" "}&middot;{" "}
                  <Link
                    href="/admin"
                    className="text-columbia hover:text-columbia-light transition"
                  >
                    Admin dashboard
                  </Link>
                </>
              )}
            </p>
          )}

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : me?.team ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-400 mb-1">
                Welcome back, {me.firstName}. You&apos;re on team
              </p>
              <p className="text-xl font-semibold text-gray-50 mb-5">
                {me.team.name}
              </p>
              <Link
                href={`/dashboard/${me.team.id}`}
                className="block w-full bg-gradient-to-r from-columbia-light to-columbia-dark text-white font-medium rounded-xl px-6 py-4 hover:opacity-90 transition text-lg"
              >
                Open Team Dashboard
              </Link>
            </div>
          ) : showRegister ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-50">
                  Create Your Team
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
                Create a New Team
              </button>

              {teams.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-medium text-gray-400 mb-3">
                    Or join a team a classmate created
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
