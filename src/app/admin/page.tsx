"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import AdminLogin from "@/components/AdminLogin";
import AdminTeamTable from "@/components/AdminTeamTable";
import DivergentPairCard from "@/components/DivergentPairCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import { TeamWithMembersAndSubmission, DivergentPairResult } from "@/types";
import { questions } from "@/lib/questions";

export default function AdminPage() {
  const [password, setPassword] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_password") || "";
    }
    return "";
  });
  const [teams, setTeams] = useState<TeamWithMembersAndSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [divergentPair, setDivergentPair] =
    useState<DivergentPairResult | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [divergenceError, setDivergenceError] = useState("");

  const isAuthenticated = password.length > 0;

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/teams");
      const data = await res.json();
      setTeams(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  function handleAuth(pw: string) {
    setPassword(pw);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin_password", pw);
    }
    // Fetch teams after auth
    setTimeout(() => fetchTeams(), 0);
  }

  async function handleFindDivergent() {
    setDivergenceError("");
    setDivergentPair(null);
    try {
      const res = await fetch("/api/divergence");
      const data = await res.json();
      if (!res.ok) {
        setDivergenceError(data.error || "Could not compute divergence");
        return;
      }
      setDivergentPair(data);
    } catch {
      setDivergenceError("Network error");
    }
  }

  async function handleClearAll() {
    try {
      await fetch("/api/admin/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setShowClearDialog(false);
      setDivergentPair(null);
      fetchTeams();
    } catch {
      // ignore
    }
  }

  function handleExportCsv() {
    if (teams.length === 0) return;

    const getLabel = (dbCol: string, key: string | null) => {
      if (!key) return "";
      const q = questions.find((q) => q.dbColumn === dbCol);
      const opt = q?.options.find((o) => o.key === key);
      return opt?.label || key;
    };

    const escape = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const header = [
      "Team Name",
      "Members",
      "Status",
      "IP Strategy",
      "Funding Strategy",
      "Partnership Strategy",
      "Market Strategy",
      "Product Innovation Strategy",
      "Slides URL",
      "Submitted At",
    ];

    const rows = teams.map((team) => {
      const sub = team.submissions?.[0];
      return [
        team.name,
        team.team_members.map((m) => m.name).join("; "),
        team.submitted ? "Submitted" : "Pending",
        getLabel("q1_ip", sub?.q1_ip || null),
        getLabel("q2_funding", sub?.q2_funding || null),
        getLabel("q3_partnership", sub?.q3_partnership || null),
        getLabel("q4_market", sub?.q4_market || null),
        getLabel("q5_product", sub?.q5_product || null),
        sub?.slides_url || "",
        team.submitted_at || "",
      ].map(escape);
    });

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caisey-strategy-lab-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isAuthenticated) {
    return <AdminLogin onAuth={handleAuth} />;
  }

  const submittedCount = teams.filter((t) => t.submitted).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-50">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {teams.length} teams registered &middot; {submittedCount}{" "}
                submitted
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchTeams}
                className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-700 transition"
              >
                Refresh
              </button>
              <button
                onClick={handleExportCsv}
                disabled={teams.length === 0}
                className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
              <button
                onClick={() => setShowClearDialog(true)}
                className="bg-red-600/10 border border-red-600/20 text-red-400 rounded-lg px-4 py-2 text-sm hover:bg-red-600/20 transition"
              >
                Clear All Data
              </button>
            </div>
          </div>

          {/* Team table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <AdminTeamTable
                teams={teams}
                highlightTeamIds={
                  divergentPair
                    ? [divergentPair.team1.id, divergentPair.team2.id]
                    : []
                }
              />
            )}
          </div>

          {/* Divergence section */}
          <div className="space-y-4">
            <button
              onClick={handleFindDivergent}
              disabled={submittedCount < 2}
              className="bg-gradient-to-r from-columbia-light to-columbia-dark text-white font-medium rounded-lg px-6 py-3 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Find Most Different Pair
            </button>

            {divergenceError && (
              <p className="text-sm text-amber-400">{divergenceError}</p>
            )}

            {divergentPair && <DivergentPairCard result={divergentPair} />}
          </div>
        </div>
      </main>

      {showClearDialog && (
        <ConfirmDialog
          title="Clear All Data"
          message="This will permanently delete ALL teams, members, and submissions. This action cannot be undone."
          confirmWord="CLEAR"
          onConfirm={handleClearAll}
          onCancel={() => setShowClearDialog(false)}
        />
      )}
    </div>
  );
}
