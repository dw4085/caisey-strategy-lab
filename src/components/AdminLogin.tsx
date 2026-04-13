"use client";

import { useState } from "react";
import Image from "next/image";

export default function AdminLogin({
  onAuth,
}: {
  onAuth: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.valid) {
        onAuth(password);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl p-4 mb-4">
            <Image
              src="/caisey-logo-on-light.svg"
              alt="CAiSEY"
              width={160}
              height={28}
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-gray-50">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Enter the admin password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-columbia focus:border-transparent outline-none transition"
            autoFocus
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={!password || loading}
            className="w-full bg-gradient-to-r from-columbia-light to-columbia-dark text-white font-medium rounded-lg px-6 py-3 hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
