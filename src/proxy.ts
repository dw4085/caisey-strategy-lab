import { NextResponse, type NextRequest } from "next/server";
import {
  canUseThisApp,
  hubCookieName,
  notAllowedUrl,
  signInUrl,
  verifyHubToken,
} from "@/lib/hub";

// One sign-in for every class app: pages need the class hub's session cookie. Without a valid
// one, the hub re-issues it (silently, if the student is still signed in to Google) and sends
// the browser back here. API routes check the cookie themselves.
export async function proxy(req: NextRequest) {
  const user = await verifyHubToken(req.cookies.get(hubCookieName())?.value);
  if (!user) {
    const host =
      req.headers.get("x-forwarded-host") ??
      req.headers.get("host") ??
      req.nextUrl.host;
    const proto =
      req.headers.get("x-forwarded-proto") ??
      req.nextUrl.protocol.replace(":", "");
    return NextResponse.redirect(
      signInUrl(`${proto}://${host}${req.nextUrl.pathname}${req.nextUrl.search}`)
    );
  }
  if (!canUseThisApp(user)) return NextResponse.redirect(notAllowedUrl());
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|woff2?|txt)$).*)",
  ],
};
