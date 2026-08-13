import type { OperatorIdentity } from '../operatorAccess';
import { getOpsOverviewData } from './opsOverview.repository';
import type {
  OpsActivityItem,
  OpsAttentionItem,
  OpsAttentionKind,
  OpsClientPulse,
  OpsOverviewSnapshot,
} from './opsOverview.types';

function iso(value: unknown) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function number(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function attentionHref(kind: OpsAttentionKind, userId: unknown) {
  if (kind === 'thread' && userId) {
    return `/ops/bandeja?client=${encodeURIComponent(String(userId))}`;
  }
  return '/ops/clientes';
}

export async function getOpsOverview(actor: OperatorIdentity): Promise<OpsOverviewSnapshot> {
  const data = await getOpsOverviewData();
  const attention = data.attention.map((row): OpsAttentionItem => {
    const kind = (row.kind === 'ticket' || row.kind === 'project' ? row.kind : 'thread') as OpsAttentionKind;
    return {
      id: String(row.id),
      kind,
      workspaceId: String(row.workspace_id),
      workspaceName: String(row.workspace_name || 'Cliente'),
      title: String(row.title || 'Pendiente'),
      detail: String(row.detail || ''),
      status: String(row.status || ''),
      urgency: row.urgency === 'critical' || row.urgency === 'important' ? row.urgency : 'normal',
      happenedAt: iso(row.happened_at),
      href: attentionHref(kind, row.user_id),
    };
  });
  const clients = data.clients.map((row): OpsClientPulse => ({
    workspaceId: String(row.workspace_id),
    userId: String(row.user_id || ''),
    companyName: String(row.company_name || 'Cliente'),
    contactName: String(row.contact_name || 'Cliente'),
    plan: String(row.plan || 'Enterprise'),
    projects: number(row.projects),
    openThreads: number(row.open_threads),
    openTickets: number(row.open_tickets),
    lastActivityAt: iso(row.last_activity_at),
  }));
  const activity = data.activity.map((row): OpsActivityItem => ({
    id: String(row.id),
    actorName: String(row.actor_name || 'Equipo Flouvia'),
    workspaceName: row.workspace_name ? String(row.workspace_name) : null,
    action: String(row.action || 'updated'),
    entityType: String(row.entity_type || 'resource'),
    happenedAt: iso(row.happened_at),
  }));

  return {
    actor: {
      id: actor.id,
      displayName: actor.displayName,
      email: actor.email,
      role: actor.opsRole,
      capabilities: actor.capabilities,
    },
    generatedAt: new Date().toISOString(),
    metrics: {
      activeWorkspaces: number(data.metrics.active_workspaces),
      activeProjects: number(data.metrics.active_projects),
      openThreads: number(data.metrics.open_threads),
      openTickets: number(data.metrics.open_tickets),
      waitingItems: number(data.metrics.waiting_items),
      pendingInvoices: number(data.metrics.pending_invoices),
      storageBytes: number(data.metrics.storage_bytes),
    },
    attention,
    clients,
    activity,
  };
}
