-- Flouvia OS — Neon/PostgreSQL schema
-- Greenfield user_id-based model. Safe to run repeatedly.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Identity is deliberately separate from Clerk. clerk_user_id is an external link,
-- while app_users.id is the stable key used by every Flouvia table.
CREATE TABLE IF NOT EXISTS app_users (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id    TEXT        UNIQUE,
  primary_email    TEXT        NOT NULL UNIQUE,
  display_name     TEXT,
  status           TEXT        NOT NULL DEFAULT 'active'
                               CHECK (status IN ('active', 'disabled')),
  disabled_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT app_users_email_normalized CHECK (primary_email = lower(primary_email))
);

DROP TRIGGER IF EXISTS trg_app_users_updated_at ON app_users;
CREATE TRIGGER trg_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS profiles (
  user_id          UUID        PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  company_name     TEXT        NOT NULL DEFAULT 'Nuevo Cliente',
  active_plan      TEXT        NOT NULL DEFAULT 'Enterprise',
  logo_url         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS projects (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  project_name      TEXT        NOT NULL,
  stage             TEXT        NOT NULL,
  progress          INT         NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  uptime            TEXT        NOT NULL DEFAULT '99.9%',
  health_status     TEXT        NOT NULL DEFAULT 'healthy'
                                CHECK (health_status IN ('healthy', 'degraded', 'down')),
  last_deploy       TIMESTAMPTZ,
  live_url          TEXT,
  deadline          TEXT,
  vercel_project_id TEXT,
  stack             TEXT,
  region            TEXT,
  latency           TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id, created_at DESC);
DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS finance_configs (
  id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID           NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
  next_amount        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency           TEXT           NOT NULL DEFAULT 'USD',
  next_date          DATE,
  auto_pay           BOOLEAN        NOT NULL DEFAULT TRUE,
  card_brand         TEXT,
  card_last4         CHAR(4),
  card_exp           TEXT,
  stripe_portal_url  TEXT,
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_finance_configs_updated_at ON finance_configs;
CREATE TRIGGER trg_finance_configs_updated_at
  BEFORE UPDATE ON finance_configs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS invoices (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID           NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  invoice_id    TEXT           NOT NULL UNIQUE,
  invoice_date  DATE           NOT NULL,
  amount        NUMERIC(12, 2) NOT NULL,
  status        TEXT           NOT NULL DEFAULT 'paid'
                               CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  download_url  TEXT,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoices_user_date_idx ON invoices(user_id, invoice_date DESC);

CREATE TABLE IF NOT EXISTS vault_files (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  category      TEXT        NOT NULL DEFAULT 'general'
                            CHECK (category IN ('contratos', 'diseno', 'entregables', 'general')),
  file_type     TEXT        NOT NULL,
  size_label    TEXT,
  size_bytes    BIGINT,
  blob_url      TEXT        NOT NULL,
  blob_pathname TEXT,
  content_type  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vault_files_user_created_idx ON vault_files(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vault_files_user_category_idx ON vault_files(user_id, category);
CREATE UNIQUE INDEX IF NOT EXISTS vault_files_blob_url_idx ON vault_files(blob_url);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('done', 'active', 'pending')),
  date_info    TEXT,
  description  TEXT,
  sort_index   INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roadmap_items_user_sort_idx ON roadmap_items(user_id, sort_index);
DROP TRIGGER IF EXISTS trg_roadmap_items_updated_at ON roadmap_items;
CREATE TRIGGER trg_roadmap_items_updated_at
  BEFORE UPDATE ON roadmap_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS tickets (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  ticket_ref   TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  category     TEXT        NOT NULL DEFAULT 'general',
  description  TEXT,
  priority     TEXT        NOT NULL DEFAULT 'normal',
  status       TEXT        NOT NULL DEFAULT 'open'
                           CHECK (status IN ('open', 'pending', 'resolved')),
  rating       SMALLINT    CHECK (rating BETWEEN 1 AND 3),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, ticket_ref)
);

CREATE INDEX IF NOT EXISTS tickets_user_created_idx ON tickets(user_id, created_at DESC);
DROP TRIGGER IF EXISTS trg_tickets_updated_at ON tickets;
CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS ticket_counters (
  user_id     UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  last_value  INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  message     TEXT,
  read        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_read_idx
  ON notifications(user_id, read, created_at DESC);

CREATE TABLE IF NOT EXISTS announcements (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  message     TEXT,
  type        TEXT        NOT NULL DEFAULT 'announcement',
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS announcements_active_created_idx
  ON announcements(active, created_at DESC);

CREATE TABLE IF NOT EXISTS changelog (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  version        TEXT        NOT NULL,
  title          TEXT        NOT NULL,
  title_en       TEXT,
  description    TEXT,
  description_en TEXT,
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  published      BOOLEAN     NOT NULL DEFAULT TRUE,
  published_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS changelog_published_idx ON changelog(published, published_at DESC);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  endpoint    TEXT        NOT NULL UNIQUE,
  p256dh      TEXT        NOT NULL,
  auth        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx ON push_subscriptions(user_id);
DROP TRIGGER IF EXISTS trg_push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER trg_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
