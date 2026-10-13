import Link from "next/link";
import { getHubUser } from "@/lib/auth/server";
import { isStaff } from "@/lib/hub";

// The admin dashboard is open to the class hub's instructors and TAs only (the API routes it
// uses check the same).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isStaff(await getHubUser())) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-50 mb-2">
            Instructors only
          </h1>
          <p className="text-gray-400 mb-4">
            The admin dashboard is open to the teaching team.
          </p>
          <Link
            href="/"
            className="text-sm text-columbia hover:text-columbia-light transition"
          >
            Back to the Strategy Lab
          </Link>
        </div>
      </div>
    );
  }
  return children;
}
