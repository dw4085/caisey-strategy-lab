@AGENTS.md

# CAiSEY Strategy Lab

Team exercise for Technology Strategy @ Columbia Business School: students form teams, answer five
strategic questions about CAiSEY (IP, funding, partnership, market, product) and link their slides;
the instructor's dashboard shows every team's answers and finds the most divergent pair.

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build (also typechecks)
npm run lint     # ESLint
```

No tests.

## Stack

Next.js 16 (App Router; `src/proxy.ts` is the middleware; `params` are Promises) + React 19 +
Tailwind CSS 4 + Neon Postgres (`@neondatabase/serverless`, lazy server-only `db()` in
`src/lib/db.ts`). Deployed on Vercel. The browser never talks to the database: all reads and
writes go through the API routes in `src/app/api/`.

## Sign-in and identity (class hub)

Students sign in once, at the class hub; `src/lib/hub.ts` is the hub kit (copied from the hub
repo's `kit/`, don't edit). `src/proxy.ts` checks the hub's session cookie on every page and sends
visitors without one to the hub's `/renew`. API routes take the person from the cookie
(`getHubUser()` in `src/lib/auth/server.ts`; 401 when signed out), never from the request body.
Names come from the hub. The app must run under the hub's cookie domain (preview:
`caisey.preview.cbs-tech-strategy.com`).

## Teams

`team_members.student_id` is the hub person id; each person is on at most one team (unique index).
A student creates a team (`POST /api/teams`, they become its first member) or joins one
(`POST /api/teams/[id]/members`; `DELETE` leaves, and removes the team if it's left empty before
submitting). Only members can view a team's page, submit (`POST /api/submissions`) or unsubmit
(`DELETE /api/submissions/[teamId]`); instructors and TAs can view any team read-only.
Pre-sign-in member rows (typed names) keep `student_id` NULL.

## Activity log

Reports go through the kit's outbox (`src/lib/outbox.ts`, table `hub_outbox`), sent with `after()`
and resent until the hub has them: with the next report, the daily sweep (`/api/hub/sweep`, Vercel
Cron in `vercel.json`, needs `CRON_SECRET`), or "Send now" on `/admin`. Events
(`src/lib/teamEvents.ts`), each to every member of the team (`subjectIds`): `team.created` /
`team.joined` ("Created team “X”" / "Joined team “X”"), and `run.submitted` ("Submitted team
“X”’s strategy", "Resubmitted…" after an unsubmit) with the five decisions and the slides link.
`runId` = team id; the link (`src/lib/links.ts`) opens `/dashboard/<team id>`.

## Admin

`/admin` (teams, CSV export, most divergent pair, clear all data, class hub outbox panel) is open to
the hub's instructors and TAs (`isStaff`), checked in `src/app/admin/layout.tsx` and by
`/api/admin/*`, `/api/divergence` and `/api/hub/outbox`.

## Data

`schema.sql` (fresh database, idempotent) and `db/hub-migration.sql` (existing database from before
the class sign-in). Tables: `teams`, `team_members`, `submissions` (one per team), `hub_outbox`.

## Environment

See `.env.example`: `DATABASE_URL`, `HUB_URL`, `HUB_JWT_PUBLIC_KEY`, `HUB_COOKIE_NAME`,
`HUB_APP_SLUG` (`caisey-strategy-lab`), `HUB_APP_KEY`, `CRON_SECRET`, optional
`HUB_PROTECTION_BYPASS`.
