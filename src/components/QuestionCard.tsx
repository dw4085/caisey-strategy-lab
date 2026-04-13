"use client";

import { QuestionDef } from "@/types";

interface QuestionCardProps {
  question: QuestionDef;
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  questionNumber: number;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  disabled,
  questionNumber,
}: QuestionCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-columbia">
            Question {questionNumber}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-50">
          {question.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{question.subtitle}</p>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = value === option.key;
          return (
            <label
              key={option.key}
              className={`block rounded-lg p-4 cursor-pointer transition-all ${
                disabled
                  ? "opacity-60 cursor-not-allowed"
                  : isSelected
                    ? "bg-columbia/10 border-2 border-columbia"
                    : "bg-gray-800/50 border border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name={question.id}
                  value={option.key}
                  checked={isSelected}
                  onChange={() => onChange(option.key)}
                  disabled={disabled}
                  className="mt-0.5 accent-columbia"
                />
                <span
                  className={`text-sm ${isSelected ? "text-gray-100" : "text-gray-300"}`}
                >
                  {option.label}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
