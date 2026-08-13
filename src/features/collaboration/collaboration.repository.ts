import { getSql } from '../../lib/neon';
import type {
  CollaborationComment,
  CollaborationStatus,
  CollaborationThread,
  CollaborationWorkspace,
  CommentVisibility,
  OperatorCollaborationThread,
} from './collaboration.types';

type DbRow = Record<string, unknown>;

function role(value: unknown) {
  return value === 'flouvia_admin' ? 'flouvia_admin' as const : 'client' as const;
}

function workspaceFromRow(row: DbRow): CollaborationWorkspace {
  return {
    id: String(row.id),
    displayName: String(row.display_name || 'Cliente'),
    companyName: String(row.company_name || row.display_name || 'Cliente'),
    role: role(row.role),
  };
}

function threadFromRow(row: DbRow): CollaborationThread {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    isImportant: Boolean(row.is_important),
    status: row.status as CollaborationStatus,
    pinned: Boolean(row.pinned),
    lastActivityAt: new Date(String(row.last_activity_at)).toISOString(),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    author: {
      id: String(row.author_id),
      displayName: String(row.author_name || 'Usuario'),
      role: role(row.author_role),
      teamMember: Boolean(row.author_team_member),
    },
    comments: (Array.isArray(row.comments) ? row.comments : []) as CollaborationComment[],
  };
}

export async function listCollaborationWorkspaces() {
  const sql = getSql();
  const rows = await sql`
    SELECT u.id, u.display_name, u.role, p.company_name
     FROM app_users u
      JOIN profiles p ON p.user_id = u.id
     WHERE u.status = 'active'
     ORDER BY
       CASE WHEN u.role = 'flouvia_admin' THEN 0 ELSE 1 END,
       lower(p.company_name),
       lower(u.display_name)
  ` as DbRow[];
  return rows.map(workspaceFromRow);
}

export async function getCollaborationWorkspace(userId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT u.id, u.display_name, u.role, p.company_name
      FROM app_users u
      JOIN profiles p ON p.user_id = u.id
     WHERE u.id = ${userId}
       AND u.status = 'active'
     LIMIT 1
  ` as DbRow[];
  return rows[0] ? workspaceFromRow(rows[0]) : null;
}

export async function listCollaborationThreads(workspaceUserId: string, includeInternal: boolean) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      t.id,
      t.title,
      t.body,
      t.is_important,
      t.status,
      t.pinned,
      t.last_activity_at,
      t.created_at,
      t.updated_at,
      au.id AS author_id,
      au.display_name AS author_name,
      au.role AS author_role,
      (au.role = 'flouvia_admin' OR lower(au.primary_email) LIKE '%@flouvia.com') AS author_team_member,
      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'body', c.body,
            'visibility', c.visibility,
            'createdAt', c.created_at,
            'updatedAt', c.updated_at,
            'author', jsonb_build_object(
              'id', cu.id,
              'displayName', cu.display_name,
              'role', cu.role,
              'teamMember', (cu.role = 'flouvia_admin' OR lower(cu.primary_email) LIKE '%@flouvia.com')
            )
          ) ORDER BY c.created_at ASC
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::jsonb
      ) AS comments
    FROM collaboration_threads t
    JOIN app_users au ON au.id = t.author_user_id
    LEFT JOIN collaboration_comments c
      ON c.thread_id = t.id
     AND (${includeInternal} OR c.visibility = 'shared')
    LEFT JOIN app_users cu ON cu.id = c.author_user_id
    WHERE t.workspace_user_id = ${workspaceUserId}
    GROUP BY t.id, au.id
    ORDER BY t.pinned DESC, t.last_activity_at DESC
  ` as DbRow[];

  return rows.map(threadFromRow);
}

export async function listOperatorCollaborationThreads() {
  const sql = getSql();
  const rows = await sql`
    SELECT
      t.id,
      t.title,
      t.body,
      t.is_important,
      t.status,
      t.pinned,
      t.last_activity_at,
      t.created_at,
      t.updated_at,
      au.id AS author_id,
      au.display_name AS author_name,
      au.role AS author_role,
      (au.role = 'flouvia_admin' OR lower(au.primary_email) LIKE '%@flouvia.com') AS author_team_member,
      wu.id AS workspace_id,
      wu.display_name AS workspace_display_name,
      wu.role AS workspace_role,
      p.company_name AS workspace_company_name,
      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'body', c.body,
            'visibility', c.visibility,
            'createdAt', c.created_at,
            'updatedAt', c.updated_at,
            'author', jsonb_build_object(
              'id', cu.id,
              'displayName', cu.display_name,
              'role', cu.role,
              'teamMember', (cu.role = 'flouvia_admin' OR lower(cu.primary_email) LIKE '%@flouvia.com')
            )
          ) ORDER BY c.created_at ASC
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::jsonb
      ) AS comments
    FROM collaboration_threads t
    JOIN app_users au ON au.id = t.author_user_id
    JOIN app_users wu ON wu.id = t.workspace_user_id
    JOIN profiles p ON p.user_id = wu.id
    LEFT JOIN collaboration_comments c ON c.thread_id = t.id
    LEFT JOIN app_users cu ON cu.id = c.author_user_id
    WHERE wu.status = 'active'
    GROUP BY t.id, au.id, wu.id, p.user_id
    ORDER BY t.pinned DESC, t.last_activity_at DESC
  ` as DbRow[];

  return rows.map((row): OperatorCollaborationThread => ({
    ...threadFromRow(row),
    workspace: {
      id: String(row.workspace_id),
      displayName: String(row.workspace_display_name || 'Cliente'),
      companyName: String(row.workspace_company_name || row.workspace_display_name || 'Cliente'),
      role: role(row.workspace_role),
    },
  }));
}

export async function getThreadWorkspaceId(threadId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT workspace_user_id
      FROM collaboration_threads
     WHERE id = ${threadId}
     LIMIT 1
  ` as DbRow[];
  return rows[0]?.workspace_user_id ? String(rows[0].workspace_user_id) : null;
}

export async function insertCollaborationThread(input: {
  workspaceUserId: string;
  authorUserId: string;
  title: string;
  body: string;
  isImportant: boolean;
  auditRequestId?: string;
}) {
  const sql = getSql();
  if (input.auditRequestId) {
    const rows = await sql`
      WITH inserted AS (
        INSERT INTO collaboration_threads (
          workspace_user_id, workspace_id, author_user_id, title, body, is_important
        )
        SELECT ${input.workspaceUserId}, wm.workspace_id, ${input.authorUserId},
               ${input.title}, ${input.body}, ${input.isImportant}
          FROM workspace_members wm
         WHERE wm.user_id = ${input.workspaceUserId} AND wm.status = 'active'
         ORDER BY CASE WHEN wm.role = 'owner' THEN 0 ELSE 1 END, wm.created_at
         LIMIT 1
        RETURNING id, workspace_id, title, is_important
      ), audited AS (
        INSERT INTO ops_audit_events (
          actor_user_id, workspace_id, action, entity_type, entity_id,
          after_data, request_id
        )
        SELECT ${input.authorUserId}, workspace_id, 'collaboration.thread.created',
               'collaboration_thread', id::text,
               jsonb_build_object('title', title, 'isImportant', is_important),
               ${input.auditRequestId}::uuid
          FROM inserted
      )
      SELECT id FROM inserted
    ` as DbRow[];
    if (!rows[0]) throw new Error('Could not resolve workspace for collaboration thread');
    return String(rows[0].id);
  }
  const rows = await sql`
    INSERT INTO collaboration_threads (
      workspace_user_id, author_user_id, title, body, is_important
    ) VALUES (
      ${input.workspaceUserId}, ${input.authorUserId}, ${input.title},
      ${input.body}, ${input.isImportant}
    )
    RETURNING id
  ` as DbRow[];
  return String(rows[0].id);
}

export async function updateCollaborationThread(input: {
  threadId: string;
  status?: CollaborationStatus;
  pinned?: boolean;
  actorUserId?: string;
  auditRequestId?: string;
}) {
  const sql = getSql();
  if (input.actorUserId && input.auditRequestId) {
    const rows = await sql`
      WITH previous AS MATERIALIZED (
        SELECT id, workspace_id,
               jsonb_build_object('status', status, 'pinned', pinned) AS data
          FROM collaboration_threads
         WHERE id = ${input.threadId}
      ), updated AS (
        UPDATE collaboration_threads
           SET status = COALESCE(${input.status ?? null}, status),
               pinned = COALESCE(${input.pinned ?? null}, pinned),
               last_activity_at = NOW()
         WHERE id = ${input.threadId}
        RETURNING id, workspace_id, status, pinned
      ), audited AS (
        INSERT INTO ops_audit_events (
          actor_user_id, workspace_id, action, entity_type, entity_id,
          before_data, after_data, request_id
        )
        SELECT ${input.actorUserId}, u.workspace_id, 'collaboration.thread.updated',
               'collaboration_thread', u.id::text, p.data,
               jsonb_build_object('status', u.status, 'pinned', u.pinned),
               ${input.auditRequestId}::uuid
          FROM updated u
          JOIN previous p ON p.id = u.id
      )
      SELECT id FROM updated
    ` as DbRow[];
    return rows.length > 0;
  }
  const rows = await sql`
    UPDATE collaboration_threads
       SET status = COALESCE(${input.status ?? null}, status),
           pinned = COALESCE(${input.pinned ?? null}, pinned),
           last_activity_at = NOW()
     WHERE id = ${input.threadId}
    RETURNING id
  ` as DbRow[];
  return rows.length > 0;
}

export async function insertCollaborationComment(input: {
  threadId: string;
  authorUserId: string;
  body: string;
  visibility: CommentVisibility;
  auditRequestId?: string;
}) {
  const sql = getSql();
  if (input.auditRequestId) {
    const rows = await sql`
      WITH inserted AS (
        INSERT INTO collaboration_comments (thread_id, author_user_id, body, visibility)
        VALUES (${input.threadId}, ${input.authorUserId}, ${input.body}, ${input.visibility})
        RETURNING id, thread_id, visibility
      ), touched AS (
        UPDATE collaboration_threads
           SET last_activity_at = NOW()
         WHERE id = ${input.threadId}
        RETURNING id, workspace_id
      ), audited AS (
        INSERT INTO ops_audit_events (
          actor_user_id, workspace_id, action, entity_type, entity_id,
          after_data, request_id
        )
        SELECT ${input.authorUserId}, t.workspace_id, 'collaboration.comment.created',
               'collaboration_comment', i.id::text,
               jsonb_build_object('threadId', i.thread_id, 'visibility', i.visibility),
               ${input.auditRequestId}::uuid
          FROM inserted i
          JOIN touched t ON t.id = i.thread_id
      )
      SELECT id FROM inserted
    ` as DbRow[];
    return String(rows[0].id);
  }
  const result = await sql.transaction([
    sql`
      INSERT INTO collaboration_comments (thread_id, author_user_id, body, visibility)
      VALUES (${input.threadId}, ${input.authorUserId}, ${input.body}, ${input.visibility})
      RETURNING id
    `,
    sql`
      UPDATE collaboration_threads
         SET last_activity_at = NOW()
       WHERE id = ${input.threadId}
    `,
  ]);
  return String((result[0] as DbRow[])[0].id);
}
