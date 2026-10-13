import { NextRequest, NextResponse } from "next/server";
import { isCronRequest } from "@/lib/hub";
import { outbox } from "@/lib/outbox";

// Daily sweep (Vercel Cron, see vercel.json): resend activity reports the class hub hasn't received.
export async function GET(req: NextRequest) {
  if (!isCronRequest(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await outbox().flush());
}
