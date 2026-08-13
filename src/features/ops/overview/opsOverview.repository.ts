import { getSql } from '../../../lib/neon';

type Row = Record<string, unknown>;

export interface OpsOverviewRepositoryData {
  metrics: Row;
  attention: Row[];
  clients: Row[];
  activity: Row[];
}

export async function getOpsOverviewData(): Promise<OpsOverviewRepositoryData> {
  const sql = getSql();
  const [metrics, attention, clients, activity] = await Promise.all([
    sql`
      SELECT
        (SELECT count(*)::int FROM workspaces WHERE status = 'active') AS active_workspaces,
        (SELECT count(*)::int FROM projects WHERE archived_at IS NULL) AS active_projects,
        (SELECT count(*)::int FROM collaboration_threads WHERE status <> 'resolved') AS open_threads,
        (SELECT count(*)::int FROM tickets WHERE status <> 'resolved') AS open_tickets,
        (
          (SELECT count(*) FROM collaboration_threads WHERE status = 'waiting_client') +
          (SELECT count(*) FROM tickets WHERE status = 'pending')
        )::int AS waiting_items,
        (SELECT count(*)::int FROM invoices WHERE status = 'pending' AND archived_at IS NULL) AS pending_invoices,
        (SELECT COALESCE(sum(size_bytes), 0)::text FROM vault_files WHERE archived_at IS NULL) AS storage_bytes
    `,
    sql`
      WITH attention AS (
        SELECT t.id::text AS id,
               'thread'::text AS kind,
               t.workspace_id,
               wm.user_id,
               w.name AS workspace_name,
               t.title,
               CASE
                 WHEN t.status = 'waiting_client' THEN 'Esperando respuesta del cliente'
                 WHEN t.is_important THEN 'Marcado como importante'
                 ELSE 'Conversación abierta'
               END AS detail,
               t.status,
               CASE WHEN t.is_important THEN 'critical' WHEN t.status = 'waiting_client' THEN 'important' ELSE 'normal' END AS urgency,
               t.last_activity_at AS happened_at
          FROM collaboration_threads t
          JOIN workspaces w ON w.id = t.workspace_id
          LEFT JOIN LATERAL (
            SELECT user_id FROM workspace_members
             WHERE workspace_id = w.id AND status = 'active'
             ORDER BY CASE WHEN role = 'owner' THEN 0 ELSE 1 END, created_at
             LIMIT 1
          ) wm ON TRUE
         WHERE t.status <> 'resolved' AND w.status = 'active'
        UNION ALL
        SELECT tk.id::text,
               'ticket'::text,
               tk.workspace_id,
               wm.user_id,
               w.name,
               tk.title,
               'Ticket ' || tk.ticket_ref || ' · prioridad ' || tk.priority,
               tk.status,
               CASE WHEN tk.priority IN ('urgent', 'high') THEN 'critical' WHEN tk.status = 'pending' THEN 'important' ELSE 'normal' END,
               tk.updated_at
          FROM tickets tk
          JOIN workspaces w ON w.id = tk.workspace_id
          LEFT JOIN LATERAL (
            SELECT user_id FROM workspace_members
             WHERE workspace_id = w.id AND status = 'active'
             ORDER BY CASE WHEN role = 'owner' THEN 0 ELSE 1 END, created_at
             LIMIT 1
          ) wm ON TRUE
         WHERE tk.status <> 'resolved' AND w.status = 'active'
        UNION ALL
        SELECT p.id::text,
               'project'::text,
               p.workspace_id,
               wm.user_id,
               w.name,
               p.project_name,
               'Estado de entorno: ' || p.health_status,
               p.health_status,
               CASE WHEN p.health_status = 'down' THEN 'critical' ELSE 'important' END,
               p.updated_at
          FROM projects p
          JOIN workspaces w ON w.id = p.workspace_id
          LEFT JOIN LATERAL (
            SELECT user_id FROM workspace_members
             WHERE workspace_id = w.id AND status = 'active'
             ORDER BY CASE WHEN role = 'owner' THEN 0 ELSE 1 END, created_at
             LIMIT 1
          ) wm ON TRUE
         WHERE p.health_status <> 'healthy' AND p.archived_at IS NULL AND w.status = 'active'
      )
      SELECT * FROM attention
       ORDER BY CASE urgency WHEN 'critical' THEN 0 WHEN 'important' THEN 1 ELSE 2 END,
                happened_at DESC
       LIMIT 10
    `,
    sql`
      SELECT w.id AS workspace_id,
             owner_member.user_id,
             w.name AS company_name,
             COALESCE(owner_user.display_name, 'Cliente') AS contact_name,
             COALESCE(p.active_plan, 'Enterprise') AS plan,
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
           WHERE workspace_id = w.id AND status = 'active'
           ORDER BY CASE WHEN role = 'owner' THEN 0 ELSE 1 END, created_at
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
       WHERE w.status = 'active'
       ORDER BY last_activity_at DESC, lower(w.name)
       LIMIT 8
    `,
    sql`
      SELECT ae.id,
             COALESCE(actor.display_name, 'Equipo Flouvia') AS actor_name,
             w.name AS workspace_name,
             ae.action,
             ae.entity_type,
             ae.created_at AS happened_at
        FROM ops_audit_events ae
        JOIN app_users actor ON actor.id = ae.actor_user_id
        LEFT JOIN workspaces w ON w.id = ae.workspace_id
       ORDER BY ae.created_at DESC
       LIMIT 12
    `,
  ]);

  return {
    metrics: (metrics as Row[])[0] ?? {},
    attention: attention as Row[],
    clients: clients as Row[],
    activity: activity as Row[],
  };
}
