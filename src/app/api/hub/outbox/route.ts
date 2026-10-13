import { NextResponse } from "next/server";
import { staffOnly } from "@/lib/auth/server";
import { outbox } from "@/lib/outbox";

// GET — activity reports not yet received by the class hub (admin page). Instructors and TAs only.
export async function GET() {
  const denied = await staffOnly();
  if (denied) return denied;
  return NextResponse.json(await outbox().status());
}

// POST — "Send now": deliver everything waiting, then report what's left.
export async function POST() {
  const denied = await staffOnly();
  if (denied) return denied;
  const result = await outbox().flush();
  return NextResponse.json({ ...result, status: await outbox().status() });
}
