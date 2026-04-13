"use client";

import { useState } from "react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmWord: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmWord,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [input, setInput] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-50 mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{message}</p>
        <p className="text-sm text-gray-300 mb-3">
          Type <span className="font-mono font-bold text-red-400">{confirmWord}</span> to
          confirm:
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition mb-4"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={input !== confirmWord}
            className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2.5 hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}
