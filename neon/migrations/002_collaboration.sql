-- Flouvia OS — roles and client collaboration
-- Additive and safe to run repeatedly.

ALTER TABLE app_users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'client';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint
     WHERE conname = 'app_users_role_check'
       AND conrelid = 'app_users'::regclass
  ) THEN
    ALTER TABLE app_users
      ADD CONSTRAINT app_users_role_check
      CHECK (role IN ('flouvia_admin', 'client'));
  END IF;
END;
$$;

-- One-time role bootstrap. Future invited accounts remain clients by default.
UPDATE app_users
   SET role = 'flouvia_admin'
 WHERE primary_email = 'flouvia.mx@gmail.com'
   AND role <> 'flouvia_admin';

CREATE TABLE IF NOT EXISTS collaboration_threads (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_user_id UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  author_user_id    UUID        NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  title             TEXT        NOT NULL,
  body              TEXT        NOT NULL,
  is_important      BOOLEAN     NOT NULL DEFAULT FALSE,
  status            TEXT        NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open', 'in_progress', 'waiting_client', 'resolved')),
  pinned            BOOLEAN     NOT NULL DEFAULT FALSE,
  last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT collaboration_threads_title_length
    CHECK (char_length(trim(title)) BETWEEN 1 AND 120),
  CONSTRAINT collaboration_threads_body_length
    CHECK (char_length(trim(body)) BETWEEN 1 AND 4000)
);

CREATE INDEX IF NOT EXISTS collaboration_threads_workspace_activity_idx
  ON collaboration_threads(workspace_user_id, pinned DESC, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS collaboration_threads_workspace_status_idx
  ON collaboration_threads(workspace_user_id, status, last_activity_at DESC);

DROP TRIGGER IF EXISTS trg_collaboration_threads_updated_at ON collaboration_threads;
CREATE TRIGGER trg_collaboration_threads_updated_at
  BEFORE UPDATE ON collaboration_threads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS collaboration_comments (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id      UUID        NOT NULL REFERENCES collaboration_threads(id) ON DELETE CASCADE,
  author_user_id UUID        NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  body           TEXT        NOT NULL,
  visibility     TEXT        NOT NULL DEFAULT 'shared'
                             CHECK (visibility IN ('shared', 'internal')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT collaboration_comments_body_length
    CHECK (char_length(trim(body)) BETWEEN 1 AND 3000)
);

CREATE INDEX IF NOT EXISTS collaboration_comments_thread_created_idx
  ON collaboration_comments(thread_id, created_at ASC);

DROP TRIGGER IF EXISTS trg_collaboration_comments_updated_at ON collaboration_comments;
CREATE TRIGGER trg_collaboration_comments_updated_at
  BEFORE UPDATE ON collaboration_comments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

