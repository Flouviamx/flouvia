-- Flouvia OPS — workspace model, granular operator access and immutable audit log.
-- Additive transition: legacy user_id relations remain valid while workspace_id is backfilled.

CREATE TABLE IF NOT EXISTS workspaces (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'archived')),
  locale        TEXT        NOT NULL DEFAULT 'es-MX',
  timezone      TEXT        NOT NULL DEFAULT 'America/Mexico_City',
  version       INT         NOT NULL DEFAULT 1 CHECK (version > 0),
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT workspaces_name_length CHECK (char_length(trim(name)) BETWEEN 1 AND 160)
);

DROP TRIGGER IF EXISTS trg_workspaces_updated_at ON workspaces;
CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS workspaces_status_name_idx
  ON workspaces(status, lower(name));

CREATE TABLE IF NOT EXISTS workspace_members (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role          TEXT        NOT NULL DEFAULT 'member'
                            CHECK (role IN ('owner', 'admin', 'member')),
  status        TEXT        NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

DROP TRIGGER IF EXISTS trg_workspace_members_updated_at ON workspace_members;
CREATE TRIGGER trg_workspace_members_updated_at
  BEFORE UPDATE ON workspace_members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS workspace_members_user_status_idx
  ON workspace_members(user_id, status, workspace_id);

CREATE TABLE IF NOT EXISTS ops_memberships (
  user_id       UUID        PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  role          TEXT        NOT NULL DEFAULT 'collaborator'
                            CHECK (role IN ('owner', 'operator', 'finance', 'collaborator')),
  status        TEXT        NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'revoked')),
  permissions   JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_ops_memberships_updated_at ON ops_memberships;
CREATE TRIGGER trg_ops_memberships_updated_at
  BEFORE UPDATE ON ops_memberships
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS ops_memberships_status_role_idx
  ON ops_memberships(status, role);

CREATE TABLE IF NOT EXISTS ops_audit_events (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id  UUID        NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  workspace_id   UUID        REFERENCES workspaces(id) ON DELETE SET NULL,
  action         TEXT        NOT NULL,
  entity_type    TEXT        NOT NULL,
  entity_id      TEXT,
  before_data    JSONB,
  after_data     JSONB,
  reason         TEXT,
  request_id     UUID        NOT NULL,
  metadata       JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ops_audit_action_length CHECK (char_length(trim(action)) BETWEEN 1 AND 100),
  CONSTRAINT ops_audit_entity_length CHECK (char_length(trim(entity_type)) BETWEEN 1 AND 100),
  CONSTRAINT ops_audit_reason_length CHECK (reason IS NULL OR char_length(trim(reason)) BETWEEN 1 AND 500)
);

CREATE INDEX IF NOT EXISTS ops_audit_workspace_created_idx
  ON ops_audit_events(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ops_audit_actor_created_idx
  ON ops_audit_events(actor_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ops_audit_entity_idx
  ON ops_audit_events(entity_type, entity_id, created_at DESC);

CREATE OR REPLACE FUNCTION prevent_ops_audit_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'ops_audit_events is append-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ops_audit_no_update ON ops_audit_events;
CREATE TRIGGER trg_ops_audit_no_update
  BEFORE UPDATE OR DELETE ON ops_audit_events
  FOR EACH ROW EXECUTE FUNCTION prevent_ops_audit_mutation();

CREATE TABLE IF NOT EXISTS ops_idempotency_keys (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id  UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  operation      TEXT        NOT NULL,
  idempotency_key TEXT       NOT NULL,
  response_data  JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at     TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  UNIQUE(actor_user_id, operation, idempotency_key)
);

CREATE INDEX IF NOT EXISTS ops_idempotency_expiry_idx
  ON ops_idempotency_keys(expires_at);

-- Deterministic one-workspace-per-user backfill. Keeping every current account as a
-- workspace preserves the owner's normal OS account while enabling future multi-user clients.
INSERT INTO workspaces (id, name, status, archived_at)
SELECT md5('flouvia-workspace:' || u.id::text)::uuid,
       COALESCE(NULLIF(trim(p.company_name), ''), NULLIF(trim(u.display_name), ''), 'Nuevo Cliente'),
       CASE WHEN u.status = 'active' THEN 'active' ELSE 'archived' END,
       CASE WHEN u.status = 'active' THEN NULL ELSE COALESCE(u.disabled_at, NOW()) END
  FROM app_users u
  LEFT JOIN profiles p ON p.user_id = u.id
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspace_members (workspace_id, user_id, role, status)
SELECT md5('flouvia-workspace:' || u.id::text)::uuid,
       u.id,
       'owner',
       CASE WHEN u.status = 'active' THEN 'active' ELSE 'inactive' END
  FROM app_users u
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- The exact owner is bootstrapped with full access. Verified @flouvia.com accounts
-- enter as collaborators and can later be promoted from OPS.
INSERT INTO ops_memberships (user_id, role, status)
SELECT id,
       CASE WHEN primary_email = 'flouvia.mx@gmail.com' THEN 'owner' ELSE 'collaborator' END,
       'active'
  FROM app_users
 WHERE primary_email = 'flouvia.mx@gmail.com'
    OR lower(primary_email) LIKE '%@flouvia.com'
ON CONFLICT (user_id) DO UPDATE
  SET role = CASE
        WHEN EXCLUDED.role = 'owner' THEN 'owner'
        ELSE ops_memberships.role
      END,
      status = CASE
        WHEN EXCLUDED.role = 'owner' THEN 'active'
        ELSE ops_memberships.status
      END;

-- Transitional workspace keys on every tenant-owned table. They stay nullable until
-- all readers have switched from user_id; this makes the deploy additive and reversible.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE finance_configs ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE vault_files ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE roadmap_items ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE ticket_counters ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE push_subscriptions ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE collaboration_threads ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

UPDATE profiles SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE projects SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE finance_configs SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE invoices SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE vault_files SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE roadmap_items SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE tickets SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE ticket_counters SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE notifications SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE push_subscriptions SET workspace_id = md5('flouvia-workspace:' || user_id::text)::uuid WHERE workspace_id IS NULL;
UPDATE collaboration_threads SET workspace_id = md5('flouvia-workspace:' || workspace_user_id::text)::uuid WHERE workspace_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_workspace_idx ON profiles(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS projects_workspace_created_idx ON projects(workspace_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS finance_configs_workspace_idx ON finance_configs(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS invoices_workspace_date_idx ON invoices(workspace_id, invoice_date DESC);
CREATE INDEX IF NOT EXISTS vault_files_workspace_created_idx ON vault_files(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS roadmap_items_workspace_sort_idx ON roadmap_items(workspace_id, sort_index);
CREATE INDEX IF NOT EXISTS tickets_workspace_status_idx ON tickets(workspace_id, status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS ticket_counters_workspace_idx ON ticket_counters(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS notifications_workspace_read_idx ON notifications(workspace_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS push_subscriptions_workspace_idx ON push_subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS collaboration_threads_workspace_id_activity_idx
  ON collaboration_threads(workspace_id, pinned DESC, last_activity_at DESC);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1 CHECK (version > 0);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1 CHECK (version > 0);
ALTER TABLE finance_configs ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1 CHECK (version > 0);
ALTER TABLE roadmap_items ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1 CHECK (version > 0);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1 CHECK (version > 0);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE vault_files ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE roadmap_items ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
