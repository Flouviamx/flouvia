import type { OpsCapability, OpsRole } from '../access/opsAccess.types';

export interface OpsOverviewMetrics {
  activeWorkspaces: number;
  activeProjects: number;
  openThreads: number;
  openTickets: number;
  waitingItems: number;
  pendingInvoices: number;
  storageBytes: number;
}

export type OpsAttentionKind = 'thread' | 'ticket' | 'project';

export interface OpsAttentionItem {
  id: string;
  kind: OpsAttentionKind;
  workspaceId: string;
  workspaceName: string;
  title: string;
  detail: string;
  status: string;
  urgency: 'critical' | 'important' | 'normal';
  happenedAt: string;
  href: string;
}

export interface OpsClientPulse {
  workspaceId: string;
  userId: string;
  companyName: string;
  contactName: string;
  plan: string;
  projects: number;
  openThreads: number;
  openTickets: number;
  lastActivityAt: string;
}

export interface OpsActivityItem {
  id: string;
  actorName: string;
  workspaceName: string | null;
  action: string;
  entityType: string;
  happenedAt: string;
}

export interface OpsOverviewSnapshot {
  actor: {
    id: string;
    displayName: string;
    email: string;
    role: OpsRole;
    capabilities: OpsCapability[];
  };
  generatedAt: string;
  metrics: OpsOverviewMetrics;
  attention: OpsAttentionItem[];
  clients: OpsClientPulse[];
  activity: OpsActivityItem[];
}
