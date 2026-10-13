import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

// Neon serverless (HTTP) client — used for all DB reads/writes in API routes.
// Created lazily so `next build` doesn't require DATABASE_URL.
export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}

export function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
