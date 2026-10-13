# CAiSEY Strategy Lab

Team-based strategy exercise for Technology Strategy at Columbia Business School. Students form
teams, answer five strategic questions about CAiSEY and link their slides; the instructor's
dashboard shows every team's answers and finds the most divergent pair for discussion.

Students sign in once at the class hub (no app sign-in), and team registrations and submissions
appear in the hub's activity log for every member. See `CLAUDE.md` for the details.

## Setup

1. Create a Neon project and run `schema.sql` in the Neon SQL Editor
   (an existing database from before the class sign-in: run `db/hub-migration.sql`).
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` (Neon pooled connection string),
   the class hub variables (`HUB_URL`, `HUB_JWT_PUBLIC_KEY`, `HUB_COOKIE_NAME`,
   `HUB_APP_SLUG=caisey-strategy-lab`, `HUB_APP_KEY` from hub admin → App keys) and `CRON_SECRET`.
3. `npm install && npm run dev`. The app must be reached under the hub's cookie domain to receive
   the sign-in cookie.

The browser never talks to the database: all reads and writes go through the API routes in
`src/app/api/`, which use the lazy Neon client `db()` from `src/lib/db.ts` (server-only).
Instructors and TAs (hub roles) use `/admin`.
