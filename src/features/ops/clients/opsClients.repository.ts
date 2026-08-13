import { getSql } from '../../../lib/neon';
import type { UpdateOpsClientProfileInput } from './opsClients.types';

type Row = Record<string, unknown>;

export async function listOpsClientsData() {
  const sql = getSql();
  return await sql`
    SELECT w.id AS workspace_id,
           owner_member.user_id,
           w.name AS company_name,
           COALESCE(owner_user.display_name, 'Cliente') AS contact_name,
           COALESCE(owner_user.primary_email, '') AS contact_email,
           COALESCE(p.active_plan, 'Enterprise') AS plan,
           w.status,
           COALESCE(project_stats.total, 0)::int AS projects,
           COALESCE(thread_stats.open_count, 0)::int AS open_threads,
           COALESCE(ticket_stats.open_count, 0)::int AS open_tickets,
           GREATEST(
             w.updated_at,
             COALESCE(thread_stats.last_at, w.created_at),
             COALESCE(ticket_stats.last_at, w.created_at),
             COALESCE(project_stats.last_at, w.created_at)
           ) AS last_activity_at
      FROM workspaces w
      LEFT JOIN LATERAL (
        SELECT user_id FROM workspace_members
         WHERE workspace_id = w.id
         ORDER BY CASE WHEN status = 'active' THEN 0 ELSE 1 END,
                  CASE WHEN role = 'owner' THEN 0 ELSE 1 END,
                  created_at
         LIMIT 1
      ) owner_member ON TRUE
      LEFT JOIN app_users owner_user ON owner_user.id = owner_member.user_id
      LEFT JOIN profiles p ON p.workspace_id = w.id
      LEFT JOIN LATERAL (
        SELECT count(*) FILTER (WHERE archived_at IS NULL) AS total, max(updated_at) AS last_at
          FROM projects WHERE workspace_id = w.id
      ) project_stats ON TRUE
      LEFT JOIN LATERAL (
        SELECT count(*) FILTER (WHERE status <> 'resolved') AS open_count, max(last_activity_at) AS last_at
          FROM collaboration_threads WHERE workspace_id = w.id
      ) thread_stats ON TRUE
      LEFT JOIN LATERAL (
        SELECT count(*) FILTER (WHERE status <> 'resolved') AS open_count, max(updated_at) AS last_at
          FROM tickets WHERE workspace_id = w.id
      ) ticket_stats ON TRUE
     ORDER BY CASE WHEN w.status = 'active' THEN 0 ELSE 1 END,
              last_activity_at DESC,
              lower(w.name)
  ` as Row[];
}

export async function getOpsClientData(workspaceId: string) {
  const sql = getSql();
  const [workspace, projects, roadmap, finance, counts, recentTickets, recentThreads] = await Promise.all([
    sql`
      SELECT w.id, w.name, w.status, w.locale, w.timezone, w.version,
             w.created_at, w.updated_at,
             p.company_name, p.active_plan, p.logo_url, p.version AS profile_version,
             contact.user_id, contact.display_name, contact.primary_email, contact.user_status
        FROM workspaces w
        LEFT JOIN profiles p ON p.workspace_id = w.id
        LEFT JOIN LATERAL (
          SELECT wm.user_id, u.display_name, u.primary_email, u.status AS user_status
            FROM workspace_members wm
            JOIN app_users u ON u.id = wm.user_id
           WHERE wm.workspace_id = w.id
           ORDER BY CASE WHEN wm.status = 'active' THEN 0 ELSE 1 END,
                    CASE WHEN wm.role = 'owner' THEN 0 ELSE 1 END,
                    wm.created_at
           LIMIT 1
        ) contact ON TRUE
       WHERE w.id = ${workspaceId}
       LIMIT 1
    `,
    sql`
      SELECT id, project_name, stage, progress, health_status, live_url,
             deadline, stack, version, updated_at
        FROM projects
       WHERE workspace_id = ${workspaceId} AND archived_at IS NULL
       ORDER BY created_at DESC
    `,
    sql`
      SELECT id, title, status, date_info, description, sort_index, version
        FROM roadmap_items
       WHERE workspace_id = ${workspaceId} AND archived_at IS NULL
       ORDER BY sort_index, created_at
    `,
    sql`
      SELECT next_amount, currency, next_date, auto_pay, card_brand, card_last4,
             stripe_portal_url, version
        FROM finance_configs
       WHERE workspace_id = ${workspaceId}
       LIMIT 1
    `,
    sql`
      SELECT
        (SELECT count(*)::int FROM invoices WHERE workspace_id = ${workspaceId} AND archived_at IS NULL) AS invoices,
        (SELECT count(*)::int FROM vault_files WHERE workspace_id = ${workspaceId} AND archived_at IS NULL) AS vault_files,
        (SELECT count(*)::int FROM tickets WHERE workspace_id = ${workspaceId} AND status <> 'resolved') AS open_tickets,
        (SELECT count(*)::int FROM collaboration_threads WHERE workspace_id = ${workspaceId} AND status <> 'resolved') AS open_threads,
        (SELECT count(*)::int FROM notifications WHERE workspace_id = ${workspaceId} AND read = FALSE) AS unread_notifications
    `,
    sql`
      SELECT id, ticket_ref, title, status, priority, updated_at
        FROM tickets
       WHERE workspace_id = ${workspaceId}
       ORDER BY updated_at DESC
       LIMIT 5
    `,
    sql`
      SELECT id, title, status, is_important, last_activity_at
        FROM collaboration_threads
       WHERE workspace_id = ${workspaceId}
       ORDER BY last_activity_at DESC
       LIMIT 5
    `,
  ]);

  return {
    workspace: (workspace as Row[])[0] ?? null,
    projects: projects as Row[],
    roadmap: roadmap as Row[],
    finance: (finance as Row[])[0] ?? null,
    counts: (counts as Row[])[0] ?? {},
    recentTickets: recentTickets as Row[],
    recentThreads: recentThreads as Row[],
  };
}

export async function updateOpsClientProfileData(input: {
  workspaceId: string;
  actorUserId: string;
  requestId: string;
  data: UpdateOpsClientProfileInput;
}) {
  const sql = getSql();
  const rows = await sql`
    WITH previous AS MATERIALIZED (
      SELECT w.id,
             jsonb_build_object(
               'companyName', w.name,
               'activePlan', COALESCE(p.active_plan, ''),
               'locale', w.locale,
               'timezone', w.timezone,
               'version', w.version
             ) AS data
        FROM workspaces w
        LEFT JOIN profiles p ON p.workspace_id = w.id
       WHERE w.id = ${input.workspaceId}
    ), updated_workspace AS (
      UPDATE workspaces
         SET name = ${input.data.companyName},
             locale = ${input.data.locale},
             timezone = ${input.data.timezone},
             version = version + 1
       WHERE id = ${input.workspaceId} AND version = ${input.data.version}
      RETURNING id, name, locale, timezone, version
    ), updated_profile AS (
      UPDATE profiles p
         SET company_name = uw.name,
             active_plan = ${input.data.activePlan},
             version = p.version + 1
        FROM updated_workspace uw
       WHERE p.workspace_id = uw.id
      RETURNING p.workspace_id, p.active_plan, p.version
    ), audited AS (
      INSERT INTO ops_audit_events (
        actor_user_id, workspace_id, action, entity_type, entity_id,
        before_data, after_data, reason, request_id
      )
      SELECT ${input.actorUserId}, uw.id, 'workspace.profile.updated',
             'workspace', uw.id::text, previous.data,
             jsonb_build_object(
               'companyName', uw.name,
               'activePlan', up.active_plan,
               'locale', uw.locale,
               'timezone', uw.timezone,
               'version', uw.version
             ),
             ${input.data.reason?.trim() || null}, ${input.requestId}::uuid
        FROM updated_workspace uw
        JOIN updated_profile up ON up.workspace_id = uw.id
        JOIN previous ON previous.id = uw.id
    )
    SELECT uw.version, up.version AS profile_version
      FROM updated_workspace uw
      JOIN updated_profile up ON up.workspace_id = uw.id
  ` as Row[];
  return rows[0] ?? null;
}

export async function opsWorkspaceExists(workspaceId: string) {
  const sql = getSql();
  const rows = await sql`SELECT 1 FROM workspaces WHERE id = ${workspaceId} LIMIT 1`;
  return rows.length > 0;
}
