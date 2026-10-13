-- CAiSEY Strategy Lab — Neon Postgres schema
-- Run this once in the Neon SQL Editor (or via psql against DATABASE_URL).
-- No row-level security: the browser never talks to the database. All reads
-- and writes go through Next.js API routes using DATABASE_URL server-side.

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  submitted    BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Submissions (one per team)
CREATE TABLE IF NOT EXISTS submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id        UUID NOT NULL UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
  q1_ip          TEXT,
  q2_funding     TEXT,
  q3_partnership TEXT,
  q4_market      TEXT,
  q5_product     TEXT,
  slides_url     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_team_id ON submissions(team_id);

-- Auto-update updated_at on submissions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS submissions_updated_at ON submissions;
CREATE TRIGGER submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
