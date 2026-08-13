import { getSql } from '../../../lib/neon';

export interface WriteOpsAuditInput {
  actorUserId: string;
  workspaceId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeData?: unknown;
  afterData?: unknown;
  reason?: string | null;
  requestId: string;
  metadata?: Record<string, unknown>;
}

function json(value: unknown) {
  return value === undefined ? null : JSON.stringify(value);
}

export async function writeOpsAuditEvent(input: WriteOpsAuditInput) {
  const sql = getSql();
  await sql`
    INSERT INTO ops_audit_events (
      actor_user_id, workspace_id, action, entity_type, entity_id,
      before_data, after_data, reason, request_id, metadata
    ) VALUES (
      ${input.actorUserId}, ${input.workspaceId ?? null}, ${input.action},
      ${input.entityType}, ${input.entityId ?? null},
      ${json(input.beforeData)}::jsonb, ${json(input.afterData)}::jsonb,
      ${input.reason?.trim() || null}, ${input.requestId},
      ${json(input.metadata ?? {})}::jsonb
    )
  `;
}

export async function getWorkspaceIdForLegacyUser(userId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT workspace_id
      FROM workspace_members
     WHERE user_id = ${userId} AND status = 'active'
     ORDER BY created_at ASC
     LIMIT 1
  ` as Array<Record<string, unknown>>;
  return rows[0]?.workspace_id ? String(rows[0].workspace_id) : null;
}
