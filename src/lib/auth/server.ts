import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hubCookieName, isStaff, verifyHubToken, type HubUser } from "@/lib/hub";

// The signed-in person, from the class hub's session cookie (one sign-in for every class app).
// Identity never comes from the request body.
export async function getHubUser(): Promise<HubUser | null> {
  return verifyHubToken((await cookies()).get(hubCookieName())?.value);
}

// The name shown for a person: their hub name (email if the hub has none).
export function displayName(user: HubUser): string {
  return user.name.trim() || user.email;
}

export const notSignedIn = () =>
  NextResponse.json({ error: "Not signed in" }, { status: 401 });

export const instructorsOnly = () =>
  NextResponse.json({ error: "Instructors only" }, { status: 403 });

// For instructor-only API routes: a 401/403 response to return, or null for instructors and TAs.
export async function staffOnly(): Promise<NextResponse | null> {
  const user = await getHubUser();
  if (!user) return notSignedIn();
  return isStaff(user) ? null : instructorsOnly();
}
