# CAiSEY Strategy Lab

Team-based strategy exercise for Technology Strategy at Columbia Business School. Teams register,
answer five strategic questions about CAiSEY and link their slides; the instructor's dashboard
shows every team's answers and finds the most divergent pair for discussion.

## Setup

1. Create a Neon project and run `schema.sql` in the Neon SQL Editor.
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` (Neon pooled connection string)
   and `ADMIN_PASSWORD`.
3. `npm install && npm run dev` (http://localhost:3000).

The browser never talks to the database: all reads and writes go through the API routes in
`src/app/api/`, which use the lazy Neon client `db()` from `src/lib/db.ts` (server-only).
