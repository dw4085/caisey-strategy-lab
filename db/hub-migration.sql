-- Class hub sign-in: run once against an existing CAiSEY Strategy Lab database (idempotent).
-- Already folded into schema.sql for fresh databases.

-- Team members are class hub people: student_id is the hub person id (one team per person),
-- name and email come from the hub. Members typed in before the class sign-in keep
-- student_id NULL; their teams can be joined by signed-in students.
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS email TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS team_members_student
  ON team_members(student_id) WHERE student_id IS NOT NULL;

-- Activity reports for the class hub, held until the hub has them (see src/lib/hub.ts, hubOutbox).
CREATE TABLE IF NOT EXISTS hub_outbox (
  id               UUID PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  event            JSON NOT NULL,          -- the report as sent (JSON keeps the snapshot's field order)
  attempts         INTEGER NOT NULL DEFAULT 0,
  last_attempt_at  TIMESTAMPTZ,
  last_error       TEXT,
  delivered_at     TIMESTAMPTZ,
  failed_at        TIMESTAMPTZ             -- rejected by the hub as malformed; not retried
);
CREATE INDEX IF NOT EXISTS hub_outbox_pending ON hub_outbox (created_at) WHERE delivered_at IS NULL AND failed_at IS NULL;
