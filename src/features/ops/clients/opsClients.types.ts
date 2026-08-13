export interface OpsClientDirectoryItem {
  workspaceId: string;
  userId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  plan: string;
  status: 'active' | 'archived';
  projects: number;
  openThreads: number;
  openTickets: number;
  lastActivityAt: string;
}

export interface OpsClientProject {
  id: string;
  name: string;
  stage: string;
  progress: number;
  health: string;
  liveUrl: string | null;
  deadline: string | null;
  stack: string | null;
  version: number;
  updatedAt: string;
}

export interface OpsClientRoadmapItem {
  id: string;
  title: string;
  status: string;
  dateInfo: string | null;
  description: string | null;
  sortIndex: number;
  version: number;
}

export interface OpsClientSnapshot {
  workspace: {
    id: string;
    name: string;
    status: 'active' | 'archived';
    locale: string;
    timezone: string;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    companyName: string;
    activePlan: string;
    logoUrl: string | null;
    version: number;
  };
  primaryContact: {
    userId: string;
    displayName: string;
    email: string;
    status: string;
  } | null;
  projects: OpsClientProject[];
  roadmap: OpsClientRoadmapItem[];
  finance: {
    nextAmount: number;
    currency: string;
    nextDate: string | null;
    autoPay: boolean;
    cardBrand: string | null;
    cardLast4: string | null;
    stripePortalUrl: string | null;
    version: number;
  } | null;
  counts: {
    invoices: number;
    vaultFiles: number;
    openTickets: number;
    openThreads: number;
    unreadNotifications: number;
  };
  recentTickets: Array<{
    id: string;
    ref: string;
    title: string;
    status: string;
    priority: string;
    updatedAt: string;
  }>;
  recentThreads: Array<{
    id: string;
    title: string;
    status: string;
    important: boolean;
    lastActivityAt: string;
  }>;
}

export interface UpdateOpsClientProfileInput {
  version: number;
  companyName: string;
  activePlan: string;
  locale: string;
  timezone: string;
  reason?: string;
}
