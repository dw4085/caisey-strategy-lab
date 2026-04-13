"use client";

import { useState } from "react";
import { questions } from "@/lib/questions";
import { Submission } from "@/types";
import QuestionCard from "./QuestionCard";
import SubmissionStatus from "./SubmissionStatus";

interface SubmissionFormProps {
  teamId: string;
  submitted: boolean;
  submittedAt: string | null;
  existingSubmission: Submission | null;
  onUpdate: () => void;
}

export default function SubmissionForm({
  teamId,
  submitted,
  submittedAt,
  existingSubmission,
  onUpdate,
}: SubmissionFormProps) {
  const [answers, setAnswers] = useState<Record<string, string | null>>({
    q1_ip: existingSubmission?.q1_ip || null,
    q2_funding: existingSubmission?.q2_funding || null,
    q3_partnership: existingSubmission?.q3_partnership || null,
    q4_market: existingSubmission?.q4_market || null,
    q5_product: existingSubmission?.q5_product || null,
  });
  const [slidesUrl, setSlidesUrl] = useState(
    existingSubmission?.slides_url || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allAnswered = questions.every(
    (q) => answers[q.dbColumn] !== null && answers[q.dbColumn] !== undefined
  );
  const hasUrl = slidesUrl.trim().length > 0;
  const canSubmit = allAnswered && hasUrl && !loading;

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          ...answers,
          slides_url: slidesUrl.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit");
        setLoading(false);
        return;
      }

      onUpdate();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsubmit() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/submissions/${teamId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to unsubmit");
        setLoading(false);
        return;
      }

      onUpdate();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-50">
          Strategic Decisions
        </h2>
        <SubmissionStatus submitted={submitted} submittedAt={submittedAt} />
      </div>

      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          value={answers[q.dbColumn] || null}
          onChange={(val) =>
            setAnswers((prev) => ({ ...prev, [q.dbColumn]: val }))
          }
          disabled={submitted}
          questionNumber={i + 1}
        />
      ))}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-50 mb-1">
          Presentation Slides
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Paste the URL to your team&apos;s Google Slides presentation (1-2
          slides)
        </p>
        <input
          type="url"
          value={slidesUrl}
          onChange={(e) => setSlidesUrl(e.target.value)}
          placeholder="https://docs.google.com/presentation/d/..."
          disabled={submitted}
          className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-columbia focus:border-transparent outline-none transition disabled:opacity-60"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {submitted ? (
          <button
            onClick={handleUnsubmit}
            disabled={loading}
            className="flex-1 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-6 py-3 hover:bg-gray-700 transition disabled:opacity-40"
          >
            {loading ? "Processing..." : "Unsubmit & Edit"}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 bg-gradient-to-r from-columbia-light to-columbia-dark text-white font-medium rounded-lg px-6 py-3 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>

      {!submitted && !allAnswered && (
        <p className="text-xs text-gray-500 text-center">
          Answer all 5 questions and add a slides URL to submit
        </p>
      )}
    </div>
  );
}
