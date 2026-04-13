"use client";

import { TeamWithMembersAndSubmission } from "@/types";
import { questions } from "@/lib/questions";

function getOptionLabel(dbColumn: string, key: string | null): string {
  if (!key) return "\u2014";
  const q = questions.find((q) => q.dbColumn === dbColumn);
  if (!q) return key;
  const opt = q.options.find((o) => o.key === key);
  return opt ? opt.label : key;
}

interface AdminTeamTableProps {
  teams: TeamWithMembersAndSubmission[];
  highlightTeamIds?: string[];
}

export default function AdminTeamTable({
  teams,
  highlightTeamIds = [],
}: AdminTeamTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Team
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Members
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Status
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              IP
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Funding
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Partnership
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Market
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Product
            </th>
            <th className="text-left py-3 px-3 text-gray-400 font-medium">
              Slides
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => {
            const sub =
              team.submissions && team.submissions.length > 0
                ? team.submissions[0]
                : null;
            const isHighlighted = highlightTeamIds.includes(team.id);

            return (
              <tr
                key={team.id}
                className={`border-b border-gray-800/50 ${
                  isHighlighted
                    ? "bg-columbia/10 border-l-2 border-l-columbia"
                    : ""
                }`}
              >
                <td className="py-3 px-3 font-medium text-gray-100">
                  {team.name}
                </td>
                <td className="py-3 px-3 text-gray-400">
                  {team.team_members.map((m) => m.name).join(", ")}
                </td>
                <td className="py-3 px-3">
                  {team.submitted ? (
                    <span className="text-emerald-400 text-xs font-medium">
                      Submitted
                    </span>
                  ) : (
                    <span className="text-amber-400 text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-gray-300 text-xs">
                  {sub ? getOptionLabel("q1_ip", sub.q1_ip) : "\u2014"}
                </td>
                <td className="py-3 px-3 text-gray-300 text-xs">
                  {sub ? getOptionLabel("q2_funding", sub.q2_funding) : "\u2014"}
                </td>
                <td className="py-3 px-3 text-gray-300 text-xs">
                  {sub
                    ? getOptionLabel("q3_partnership", sub.q3_partnership)
                    : "\u2014"}
                </td>
                <td className="py-3 px-3 text-gray-300 text-xs">
                  {sub ? getOptionLabel("q4_market", sub.q4_market) : "\u2014"}
                </td>
                <td className="py-3 px-3 text-gray-300 text-xs">
                  {sub
                    ? getOptionLabel("q5_product", sub.q5_product)
                    : "\u2014"}
                </td>
                <td className="py-3 px-3">
                  {sub?.slides_url ? (
                    <a
                      href={sub.slides_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-columbia hover:text-columbia-light transition text-xs"
                    >
                      View Slides
                    </a>
                  ) : (
                    <span className="text-gray-600">\u2014</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {teams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No teams registered yet
        </div>
      )}
    </div>
  );
}
