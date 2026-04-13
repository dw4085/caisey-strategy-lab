import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  const isValid = password === process.env.ADMIN_PASSWORD;

  return NextResponse.json({ valid: isValid });
}
