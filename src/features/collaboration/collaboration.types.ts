import type { PortalRole } from '../../lib/portalDb';

export type CollaborationStatus = 'open' | 'in_progress' | 'waiting_client' | 'resolved';
export type CommentVisibility = 'shared' | 'internal';

export interface CollaborationActor {
  id: string;
  displayName: string;
  role: PortalRole;
  teamMember?: boolean;
}

export interface CollaborationWorkspace {
  id: string;
  displayName: string;
  companyName: string;
  role: PortalRole;
}

export interface CollaborationComment {
  id: string;
  body: string;
  visibility: CommentVisibility;
  createdAt: string;
  updatedAt: string;
  author: CollaborationActor;
}

export interface CollaborationThread {
  id: string;
  title: string;
  body: string;
  isImportant: boolean;
  status: CollaborationStatus;
  pinned: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  author: CollaborationActor;
  comments: CollaborationComment[];
}

export interface OperatorCollaborationThread extends CollaborationThread {
  workspace: CollaborationWorkspace;
}

export interface CollaborationSnapshot {
  actor: CollaborationActor;
  workspace: CollaborationWorkspace;
  workspaces: CollaborationWorkspace[];
  threads: CollaborationThread[];
}

export interface OperatorCollaborationSnapshot {
  actor: CollaborationActor & { email: string; teamMember: true };
  workspaces: CollaborationWorkspace[];
  threads: OperatorCollaborationThread[];
}

export interface CreateThreadInput {
  workspaceId?: string;
  title: string;
  body: string;
  isImportant: boolean;
}

export interface UpdateThreadInput {
  threadId: string;
  status?: CollaborationStatus;
  pinned?: boolean;
}

export interface CreateCommentInput {
  threadId: string;
  body: string;
  visibility: CommentVisibility;
}
