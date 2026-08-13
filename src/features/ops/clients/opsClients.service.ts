import { OpsError } from '../shared/opsHttp';
import {
  getOpsClientData,
  listOpsClientsData,
  opsWorkspaceExists,
  updateOpsClientProfileData,
} from './opsClients.repository';
import type {
  OpsClientDirectoryItem,
  OpsClientProject,
  OpsClientRoadmapItem,
  OpsClientSnapshot,
  UpdateOpsClientProfileInput,
} from './opsClients.types';

function iso(value: unknown) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function number(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function listOpsClients(): Promise<OpsClientDirectoryItem[]> {
  const rows = await listOpsClientsData();
  return rows.map((row) => ({
    workspaceId: String(row.workspace_id),
    userId: String(row.user_id || ''),
    companyName: String(row.company_name || 'Cliente'),
    contactName: String(row.contact_name || 'Cliente'),
    contactEmail: String(row.contact_email || ''),
    plan: String(row.plan || 'Enterprise'),
    status: row.status === 'archived' ? 'archived' : 'active',
    projects: number(row.projects),
    openThreads: number(row.open_threads),
    openTickets: number(row.open_tickets),
    lastActivityAt: iso(row.last_activity_at),
  }));
}

export async function getOpsClientSnapshot(workspaceId: string): Promise<OpsClientSnapshot> {
  const data = await getOpsClientData(workspaceId);
  const row = data.workspace;
  if (!row) throw new OpsError('WORKSPACE_NOT_FOUND', 404, 'No encontramos este cliente.');
  const projects = data.projects.map((project): OpsClientProject => ({
    id: String(project.id),
    name: String(project.project_name),
    stage: String(project.stage),
    progress: number(project.progress),
    health: String(project.health_status),
    liveUrl: project.live_url ? String(project.live_url) : null,
    deadline: project.deadline ? String(project.deadline) : null,
    stack: project.stack ? String(project.stack) : null,
    version: number(project.version),
    updatedAt: iso(project.updated_at),
  }));
  const roadmap = data.roadmap.map((item): OpsClientRoadmapItem => ({
    id: String(item.id),
    title: String(item.title),
    status: String(item.status),
    dateInfo: item.date_info ? String(item.date_info) : null,
    description: item.description ? String(item.description) : null,
    sortIndex: number(item.sort_index),
    version: number(item.version),
  }));

  return {
    workspace: {
      id: String(row.id),
      name: String(row.name),
      status: row.status === 'archived' ? 'archived' : 'active',
      locale: String(row.locale || 'es-MX'),
      timezone: String(row.timezone || 'America/Mexico_City'),
      version: number(row.version),
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at),
    },
    profile: {
      companyName: String(row.company_name || row.name),
      activePlan: String(row.active_plan || 'Enterprise'),
      logoUrl: row.logo_url ? String(row.logo_url) : null,
      version: number(row.profile_version),
    },
    primaryContact: row.user_id ? {
      userId: String(row.user_id),
      displayName: String(row.display_name || 'Cliente'),
      email: String(row.primary_email || ''),
      status: String(row.user_status || 'active'),
    } : null,
    projects,
    roadmap,
    finance: data.finance ? {
      nextAmount: number(data.finance.next_amount),
      currency: String(data.finance.currency || 'USD'),
      nextDate: data.finance.next_date ? String(data.finance.next_date) : null,
      autoPay: Boolean(data.finance.auto_pay),
      cardBrand: data.finance.card_brand ? String(data.finance.card_brand) : null,
      cardLast4: data.finance.card_last4 ? String(data.finance.card_last4) : null,
      stripePortalUrl: data.finance.stripe_portal_url ? String(data.finance.stripe_portal_url) : null,
      version: number(data.finance.version),
    } : null,
    counts: {
      invoices: number(data.counts.invoices),
      vaultFiles: number(data.counts.vault_files),
      openTickets: number(data.counts.open_tickets),
      openThreads: number(data.counts.open_threads),
      unreadNotifications: number(data.counts.unread_notifications),
    },
    recentTickets: data.recentTickets.map((ticket) => ({
      id: String(ticket.id),
      ref: String(ticket.ticket_ref),
      title: String(ticket.title),
      status: String(ticket.status),
      priority: String(ticket.priority),
      updatedAt: iso(ticket.updated_at),
    })),
    recentThreads: data.recentThreads.map((thread) => ({
      id: String(thread.id),
      title: String(thread.title),
      status: String(thread.status),
      important: Boolean(thread.is_important),
      lastActivityAt: iso(thread.last_activity_at),
    })),
  };
}

export async function updateOpsClientProfile(input: {
  workspaceId: string;
  actorUserId: string;
  requestId: string;
  data: UpdateOpsClientProfileInput;
}) {
  const updated = await updateOpsClientProfileData(input);
  if (updated) return getOpsClientSnapshot(input.workspaceId);
  if (!(await opsWorkspaceExists(input.workspaceId))) {
    throw new OpsError('WORKSPACE_NOT_FOUND', 404, 'No encontramos este cliente.');
  }
  throw new OpsError(
    'VERSION_CONFLICT',
    409,
    'Este cliente cambió en otra sesión. Actualiza la página antes de guardar.',
  );
}
