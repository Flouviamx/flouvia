import { getSql } from './neon';
import { requirePortalAccess, type PortalClerkUser } from './portalAccess';

export interface PortalIdentity {
  id: string;
  clerkUserId: string;
  email: string;
  displayName: string;
  role: PortalRole;
}

export type PortalRole = 'flouvia_admin' | 'client';

function displayName(user: PortalClerkUser) {
  return user.fullName?.trim()
    || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    || 'Cliente';
}

export async function upsertAppUser(user: PortalClerkUser): Promise<PortalIdentity> {
  const sql = getSql();
  const email = (user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress)
    ?.trim()
    .toLowerCase();
  if (!email) throw new Error('Authenticated Clerk user has no email address');
  const name = displayName(user);

  // Link an existing internal identity when the same invited email signs in.
  const imported = await sql`
    UPDATE app_users
       SET clerk_user_id = ${user.id},
           display_name = ${name},
           status = 'active',
           disabled_at = NULL
     WHERE primary_email = ${email}
       AND (clerk_user_id IS NULL OR clerk_user_id = ${user.id})
    RETURNING id, clerk_user_id, primary_email, display_name, role
  ` as Array<Record<string, unknown>>;

  const rows = imported.length ? imported : await sql`
    INSERT INTO app_users (clerk_user_id, primary_email, display_name)
    VALUES (${user.id}, ${email}, ${name})
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      primary_email = EXCLUDED.primary_email,
      display_name = EXCLUDED.display_name,
      status = 'active',
      disabled_at = NULL
    RETURNING id, clerk_user_id, primary_email, display_name, role
  ` as Array<Record<string, unknown>>;

  const row = rows[0];
  if (!row) throw new Error('Could not create internal user identity');

  await sql`
    INSERT INTO profiles (user_id)
    VALUES (${String(row.id)})
    ON CONFLICT (user_id) DO NOTHING
  `;

  return {
    id: String(row.id),
    clerkUserId: String(row.clerk_user_id),
    email: String(row.primary_email),
    displayName: String(row.display_name || name),
    role: row.role === 'flouvia_admin' ? 'flouvia_admin' : 'client',
  };
}

export async function requirePortalIdentity(locals: any): Promise<PortalIdentity> {
  const user = await requirePortalAccess(locals);
  return upsertAppUser(user);
}

export async function disableAppUser(clerkUserId: string) {
  const sql = getSql();
  await sql`
    UPDATE app_users
       SET status = 'disabled', disabled_at = NOW()
     WHERE clerk_user_id = ${clerkUserId}
  `;
}

export async function getProfile(userId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT active_plan AS plan_activo,
           company_name AS nombre_empresa,
           logo_url
      FROM profiles
     WHERE user_id = ${userId}
     LIMIT 1
  ` as any[];
  return rows[0] ?? null;
}

export async function getProject(userId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id,
           project_name AS nombre_proyecto,
           stage AS etapa,
           progress AS progreso,
           uptime,
           health_status AS status_salud,
           last_deploy,
           live_url,
           deadline,
           vercel_project_id,
           stack,
           region,
           latency AS latencia,
           created_at,
           updated_at
      FROM projects
     WHERE user_id = ${userId}
     ORDER BY created_at DESC
     LIMIT 1
  ` as any[];
  return rows[0] ?? null;
}

export async function getFinanceConfig(userId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id,
           next_amount AS monto_proximo,
           currency AS moneda,
           next_date AS fecha_proxima,
           auto_pay,
           card_brand,
           card_last4,
           card_exp,
           stripe_portal_url,
           created_at,
           updated_at
      FROM finance_configs
     WHERE user_id = ${userId}
     LIMIT 1
  ` as any[];
  return rows[0] ?? null;
}

export async function getInvoices(userId: string) {
  const sql = getSql();
  return await sql`
    SELECT id,
           invoice_id,
           invoice_date AS fecha,
           amount AS monto,
           status,
           download_url,
           created_at
      FROM invoices
     WHERE user_id = ${userId}
     ORDER BY invoice_date DESC
  ` as any[];
}

export async function getRoadmap(userId: string) {
  const sql = getSql();
  return await sql`
    SELECT id,
           title AS titulo,
           status,
           date_info AS fecha_info,
           description AS descripcion,
           sort_index AS orden_index,
           created_at,
           updated_at
      FROM roadmap_items
     WHERE user_id = ${userId}
     ORDER BY sort_index
  ` as any[];
}

export async function getVaultFiles(userId: string, limit?: number) {
  const sql = getSql();
  const query = limit
    ? sql.query(
        `SELECT id, name AS nombre, category AS categoria, file_type AS tipo,
                size_label AS size, size_bytes, blob_url AS url_descarga,
                blob_pathname, content_type, created_at
           FROM vault_files
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2`,
        [userId, limit],
      )
    : sql`
        SELECT id, name AS nombre, category AS categoria, file_type AS tipo,
               size_label AS size, size_bytes, blob_url AS url_descarga,
               blob_pathname, content_type, created_at
          FROM vault_files
         WHERE user_id = ${userId}
         ORDER BY created_at DESC
      `;
  return await query as any[];
}

export async function getVaultFile(userId: string, fileId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, name AS nombre, blob_url, blob_pathname, content_type, size_bytes
      FROM vault_files
     WHERE id = ${fileId} AND user_id = ${userId}
     LIMIT 1
  ` as any[];
  return rows[0] ?? null;
}

export async function createVaultFile(input: {
  userId: string;
  name: string;
  category: string;
  fileType: string;
  sizeLabel: string;
  sizeBytes: number;
  blobUrl: string;
  blobPathname: string;
  contentType: string;
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO vault_files (
      user_id, name, category, file_type, size_label, size_bytes,
      blob_url, blob_pathname, content_type
    ) VALUES (
      ${input.userId}, ${input.name}, ${input.category}, ${input.fileType},
      ${input.sizeLabel}, ${input.sizeBytes}, ${input.blobUrl},
      ${input.blobPathname}, ${input.contentType}
    )
    ON CONFLICT (blob_url) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      file_type = EXCLUDED.file_type,
      size_label = EXCLUDED.size_label,
      size_bytes = EXCLUDED.size_bytes,
      blob_pathname = EXCLUDED.blob_pathname,
      content_type = EXCLUDED.content_type
    RETURNING id, name AS nombre, file_type AS tipo, size_label AS size, created_at
  ` as any[];
  return rows[0];
}

export async function getTickets(userId: string, limit = 8) {
  const sql = getSql();
  return await sql.query(
    `SELECT ticket_ref, title, status, created_at, rating, category,
            description AS descripcion, priority
       FROM tickets
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
    [userId, limit],
  ) as any[];
}

export async function createTicket(input: {
  userId: string;
  title: string;
  category: string;
  description: string;
  priority: string;
}) {
  const sql = getSql();
  const rows = await sql`
    WITH next_counter AS (
      INSERT INTO ticket_counters (user_id, last_value)
      SELECT ${input.userId},
             COALESCE(
               MAX(NULLIF(regexp_replace(ticket_ref, '\\D', '', 'g'), '')::int),
               0
             ) + 1
        FROM tickets
       WHERE user_id = ${input.userId}
      ON CONFLICT (user_id) DO UPDATE
        SET last_value = ticket_counters.last_value + 1
      RETURNING last_value
    )
    INSERT INTO tickets (user_id, ticket_ref, title, category, description, priority, status)
    SELECT ${input.userId},
           'TK-' || lpad(last_value::text, 3, '0'),
           ${input.title}, ${input.category}, ${input.description}, ${input.priority}, 'open'
      FROM next_counter
    RETURNING ticket_ref
  ` as any[];
  return String(rows[0]?.ticket_ref);
}

export async function rateTicket(userId: string, ticketRef: string, rating: number) {
  const sql = getSql();
  await sql`
    UPDATE tickets
       SET rating = ${rating}
     WHERE user_id = ${userId} AND ticket_ref = ${ticketRef}
  `;
}

export async function getAnnouncements(limit = 3) {
  const sql = getSql();
  return await sql.query(
    `SELECT id, title AS titulo, message AS mensaje, type AS tipo, created_at
       FROM announcements
      WHERE active = TRUE
      ORDER BY created_at DESC
      LIMIT $1`,
    [limit],
  ) as any[];
}

export async function getChangelog(limit = 40) {
  const sql = getSql();
  return await sql.query(
    `SELECT * FROM changelog
      WHERE published = TRUE
      ORDER BY published_at DESC
      LIMIT $1`,
    [limit],
  ) as any[];
}

export async function upsertPushSubscription(input: {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
    VALUES (${input.userId}, ${input.endpoint}, ${input.p256dh}, ${input.auth})
    ON CONFLICT (endpoint) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth
  `;
}

export async function deletePushSubscription(endpoint: string, userId?: string) {
  const sql = getSql();
  if (userId) {
    await sql`
      DELETE FROM push_subscriptions
       WHERE endpoint = ${endpoint} AND user_id = ${userId}
    `;
    return;
  }
  await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
}

export async function getPushSubscriptions(email?: string) {
  const sql = getSql();
  if (email) {
    return await sql`
      SELECT ps.endpoint, ps.p256dh, ps.auth, au.primary_email AS email_cliente
        FROM push_subscriptions ps
        JOIN app_users au ON au.id = ps.user_id
       WHERE au.primary_email = ${email.toLowerCase()}
    ` as any[];
  }
  return await sql`
    SELECT ps.endpoint, ps.p256dh, ps.auth, au.primary_email AS email_cliente
      FROM push_subscriptions ps
      JOIN app_users au ON au.id = ps.user_id
  ` as any[];
}
