"use client";

import { DivergentPairResult } from "@/types";
import { questions } from "@/lib/questions";

function getOptionLabel(dbColumn: string, key: string | null): string {
  if (!key) return "\u2014";
  const q = questions.find((q) => q.dbColumn === dbColumn);
  if (!q) return key;
  const opt = q.options.find((o) => o.key === key);
  return opt ? opt.label : key;
}

export default function DivergentPairCard({
  result,
}: {
  result: DivergentPairResult;
}) {
  const sub1 =
    result.team1.submissions?.length > 0 ? result.team1.submissions[0] : null;
  const sub2 =
    result.team2.submissions?.length > 0 ? result.team2.submissions[0] : null;

  const questionBreakdown = [
    { key: "q1_ip", label: "IP Strategy" },
    { key: "q2_funding", label: "Funding" },
    { key: "q3_partnership", label: "Partnership" },
    { key: "q4_market", label: "Market" },
    { key: "q5_product", label: "Product" },
  ];

  return (
    <div className="bg-columbia/5 border-2 border-columbia rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-50">
          Most Divergent Pair
        </h3>
        <span className="text-sm font-mono text-columbia">
          Distance: {result.distance} / {result.maxDistance}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div className="font-medium text-gray-400">Question</div>
        <div className="font-medium text-columbia">{result.team1.name}</div>
        <div className="font-medium text-columbia">{result.team2.name}</div>
      </div>

      {questionBreakdown.map(({ key, label }) => {
        const dist =
          result.breakdown[key as keyof typeof result.breakdown] || 0;
        const val1 = sub1 ? (sub1 as unknown as Record<string, string | null>)[key] : null;
        const val2 = sub2 ? (sub2 as unknown as Record<string, string | null>)[key] : null;

        return (
          <div
            key={key}
            className={`grid grid-cols-3 gap-4 text-sm py-2 border-t border-gray-800/50 ${
              dist > 0 ? "bg-red-500/5" : ""
            }`}
          >
            <div className="text-gray-400">
              {label}
              {dist > 0 && (
                <span className="ml-2 text-xs text-red-400">+{dist}</span>
              )}
            </div>
            <div className="text-gray-300 text-xs">
              {getOptionLabel(key, val1)}
            </div>
            <div className="text-gray-300 text-xs">
              {getOptionLabel(key, val2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
