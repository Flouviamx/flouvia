-- ============================================================
-- FLOUVIA OS — SCHEMA COMPLETO v2.1
-- Corre esto en Supabase SQL Editor.
-- Borra todo lo existente y recrea limpio.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 0. RESET — borrar tablas existentes en orden de dependencia
-- ────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS roadmap         CASCADE;
DROP TABLE IF EXISTS boveda_archivos CASCADE;
DROP TABLE IF EXISTS facturas        CASCADE;
DROP TABLE IF EXISTS finanzas_config CASCADE;
DROP TABLE IF EXISTS proyectos       CASCADE;
DROP TABLE IF EXISTS perfiles        CASCADE;

DROP FUNCTION IF EXISTS set_updated_at CASCADE;


-- ────────────────────────────────────────────────────────────
-- HELPER: auto-actualizar updated_at
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 1. PERFILES
-- ============================================================
CREATE TABLE perfiles (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_cliente    TEXT        NOT NULL UNIQUE,
  nombre           TEXT,
  nombre_empresa   TEXT        NOT NULL,
  clerk_id         TEXT,
  plan_activo      TEXT        NOT NULL DEFAULT 'Enterprise',
  logo_url         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_perfiles_email ON perfiles (email_cliente);

CREATE TRIGGER trg_perfiles_updated_at
  BEFORE UPDATE ON perfiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perfil_select_propio"
  ON perfiles FOR SELECT
  USING (email_cliente = current_setting('app.email_cliente', TRUE));

CREATE POLICY "perfil_insert_propio"
  ON perfiles FOR INSERT
  WITH CHECK (email_cliente = current_setting('app.email_cliente', TRUE));

CREATE POLICY "perfil_update_propio"
  ON perfiles FOR UPDATE
  USING (email_cliente = current_setting('app.email_cliente', TRUE));


-- ============================================================
-- 2. PROYECTOS
-- ============================================================
CREATE TABLE proyectos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_cliente    TEXT        NOT NULL REFERENCES perfiles (email_cliente) ON DELETE CASCADE,
  nombre_proyecto  TEXT        NOT NULL,
  etapa            TEXT        NOT NULL,
  progreso         INT         NOT NULL DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100),
  uptime           TEXT        NOT NULL DEFAULT '99.9%',
  status_salud     TEXT        NOT NULL DEFAULT 'healthy'
                               CHECK (status_salud IN ('healthy', 'degraded', 'down')),
  last_deploy      TIMESTAMPTZ,
  live_url         TEXT,
  deadline         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proyectos_email ON proyectos (email_cliente);

CREATE TRIGGER trg_proyectos_updated_at
  BEFORE UPDATE ON proyectos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proyecto_select_propio"
  ON proyectos FOR SELECT
  USING (email_cliente = current_setting('app.email_cliente', TRUE));


-- ============================================================
-- 3. FINANZAS_CONFIG
-- ============================================================
CREATE TABLE finanzas_config (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  email_cliente    TEXT           NOT NULL UNIQUE REFERENCES perfiles (email_cliente) ON DELETE CASCADE,
  monto_proximo    DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  moneda           TEXT           NOT NULL DEFAULT 'USD',
  fecha_proxima    DATE           NOT NULL,
  auto_pay         BOOLEAN        NOT NULL DEFAULT TRUE,
  card_brand       TEXT,
  card_last4       CHAR(4),
  card_exp         TEXT,
  stripe_portal_url TEXT,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_finanzas_email ON finanzas_config (email_cliente);

CREATE TRIGGER trg_finanzas_updated_at
  BEFORE UPDATE ON finanzas_config
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE finanzas_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "finanzas_select_propio"
  ON finanzas_config FOR SELECT
  USING (email_cliente = current_setting('app.email_cliente', TRUE));


-- ============================================================
-- 4. FACTURAS
-- ============================================================
CREATE TABLE facturas (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  email_cliente    TEXT           NOT NULL REFERENCES perfiles (email_cliente) ON DELETE CASCADE,
  invoice_id       TEXT           NOT NULL UNIQUE,
  fecha            DATE           NOT NULL,
  monto            DECIMAL(12, 2) NOT NULL,
  status           TEXT           NOT NULL DEFAULT 'paid'
                                  CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  download_url     TEXT,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_facturas_email ON facturas (email_cliente);
CREATE INDEX idx_facturas_fecha ON facturas (email_cliente, fecha DESC);

ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "facturas_select_propio"
  ON facturas FOR SELECT
  USING (email_cliente = current_setting('app.email_cliente', TRUE));


-- ============================================================
-- 5. BOVEDA_ARCHIVOS
-- ============================================================
CREATE TABLE boveda_archivos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_cliente    TEXT        NOT NULL REFERENCES perfiles (email_cliente) ON DELETE CASCADE,
  nombre           TEXT        NOT NULL,
  categoria        TEXT        NOT NULL DEFAULT 'general'
                               CHECK (categoria IN ('contratos', 'diseno', 'entregables', 'general')),
  tipo             TEXT        NOT NULL,
  size             TEXT,
  url_descarga     TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_boveda_email     ON boveda_archivos (email_cliente);
CREATE INDEX idx_boveda_categoria ON boveda_archivos (email_cliente, categoria);

ALTER TABLE boveda_archivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "boveda_select_propio"
  ON boveda_archivos FOR SELECT
  USING (email_cliente = current_setting('app.email_cliente', TRUE));


-- ============================================================
-- 6. ROADMAP
-- ============================================================
CREATE TABLE roadmap (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_cliente    TEXT        NOT NULL REFERENCES perfiles (email_cliente) ON DELETE CASCADE,
  titulo           TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('done', 'active', 'pending')),
  fecha_info       TEXT,
  orden_index      INT         NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roadmap_email ON roadmap (email_cliente, orden_index);

CREATE TRIGGER trg_roadmap_updated_at
  BEFORE UPDATE ON roadmap
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE roadmap ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roadmap_select_propio"
  ON roadmap FOR SELECT
  USING (email_cliente = current_setting('app.email_cliente', TRUE));


-- ============================================================
-- SEED — Cliente demo: flouvia.mx@gmail.com
-- ============================================================
INSERT INTO perfiles (email_cliente, nombre, nombre_empresa, plan_activo)
VALUES ('flouvia.mx@gmail.com', 'André Valle', 'Flouvia', 'Enterprise Infrastructure');

INSERT INTO proyectos (email_cliente, nombre_proyecto, etapa, progreso, uptime, status_salud, live_url, deadline, last_deploy)
VALUES ('flouvia.mx@gmail.com', 'Plataforma B2B Global', 'Ingeniería Backend', 88, '99.98%', 'healthy', 'https://staging.flouvia.mx', '15 Noviembre', NOW() - INTERVAL '2 days');

INSERT INTO finanzas_config (email_cliente, monto_proximo, moneda, fecha_proxima, auto_pay, card_brand, card_last4, card_exp, stripe_portal_url)
VALUES ('flouvia.mx@gmail.com', 6250.00, 'USD', '2026-12-01', TRUE, 'Visa', '4242', '12/28', '#');

INSERT INTO facturas (email_cliente, invoice_id, fecha, monto, status, download_url)
VALUES
  ('flouvia.mx@gmail.com', 'INV-2026-11', '2026-11-01', 6250.00, 'paid', '#'),
  ('flouvia.mx@gmail.com', 'INV-2026-10', '2026-10-01', 6250.00, 'paid', '#'),
  ('flouvia.mx@gmail.com', 'INV-2026-09', '2026-09-01', 6250.00, 'paid', '#');

INSERT INTO boveda_archivos (email_cliente, nombre, categoria, tipo, size, url_descarga)
VALUES
  ('flouvia.mx@gmail.com', 'Contrato_Servicios_Flouvia_Firmado_2026.pdf', 'contratos', 'PDF', '2.4 MB', '#'),
  ('flouvia.mx@gmail.com', 'Flouvia_Design_System_v2.fig',                'diseno',    'FIG', '15 MB',  '#');

INSERT INTO roadmap (email_cliente, titulo, status, fecha_info, orden_index)
VALUES
  ('flouvia.mx@gmail.com', 'Fase 1: Arquitectura',   'done',    'Sept',    1),
  ('flouvia.mx@gmail.com', 'Fase 2: Core Frontend',  'active',  'Oct-Nov', 2),
  ('flouvia.mx@gmail.com', 'Fase 3: QA & Seguridad', 'pending', 'Dic',     3);
