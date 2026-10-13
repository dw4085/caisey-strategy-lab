"use client";

import { useCallback, useEffect, useState } from "react";

interface Status {
  waiting: number;
  failed: number;
  oldestWaitingAt: string | null;
  lastError: string | null;
  lastDeliveredAt: string | null;
}

const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

// Activity reports the class hub hasn't received yet, with "Send now".
export default function HubOutboxPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/hub/outbox");
    if (res.ok) setStatus(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sendNow = async () => {
    setSending(true);
    setNote(null);
    try {
      const res = await fetch("/api/hub/outbox", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        setNote(
          data.status.waiting === 0
            ? `Sent ${data.delivered}. Everything has reached the class hub.`
            : `Sent ${data.delivered}; ${data.status.waiting} still waiting.`
        );
      }
    } finally {
      setSending(false);
    }
  };

  if (!status) return null;
  const ok = status.waiting === 0 && status.failed === 0;
  return (
    <div
      className={`rounded-xl p-4 mb-6 border ${
        ok
          ? "border-gray-800 bg-gray-900"
          : "border-amber-600/40 bg-amber-500/10"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Class hub activity
          </p>
          {status.waiting > 0 ? (
            <p className="font-semibold text-amber-300">
              {status.waiting} activity report
              {status.waiting === 1 ? "" : "s"} waiting to be sent
              <span className="font-normal text-gray-400">
                {" "}&middot; oldest {when(status.oldestWaitingAt)}
              </span>
            </p>
          ) : (
            <p className="font-semibold text-gray-200">
              All activity has reached the class hub
              {status.lastDeliveredAt && (
                <span className="font-normal text-gray-400">
                  {" "}&middot; last sent {when(status.lastDeliveredAt)}
                </span>
              )}
            </p>
          )}
          {status.failed > 0 && (
            <p className="text-sm text-red-400">
              {status.failed} report{status.failed === 1 ? " was" : "s were"}{" "}
              rejected by the hub and won&apos;t be resent.
            </p>
          )}
          {status.waiting > 0 && status.lastError && (
            <p className="text-xs text-gray-500 mt-1">
              Last error: {status.lastError}
            </p>
          )}
          {note && <p className="text-sm text-gray-300 mt-1">{note}</p>}
        </div>
        {status.waiting > 0 && (
          <button
            onClick={sendNow}
            disabled={sending}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {sending ? "Sending…" : "Send now"}
          </button>
        )}
      </div>
    </div>
  );
}
