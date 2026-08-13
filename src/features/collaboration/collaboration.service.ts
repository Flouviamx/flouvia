import type { PortalIdentity } from '../../lib/portalDb';
import type { OperatorIdentity } from '../ops/operatorAccess';
import {
  getCollaborationWorkspace,
  getThreadWorkspaceId,
  insertCollaborationComment,
  insertCollaborationThread,
  listCollaborationThreads,
  listCollaborationWorkspaces,
  listOperatorCollaborationThreads,
  updateCollaborationThread,
} from './collaboration.repository';
import type {
  CollaborationSnapshot,
  CollaborationStatus,
  CommentVisibility,
  CreateCommentInput,
  CreateThreadInput,
  OperatorCollaborationSnapshot,
  UpdateThreadInput,
} from './collaboration.types';

export class CollaborationError extends Error {
  readonly code: string;
  readonly status: 400 | 403 | 404 | 422 | 429;
  readonly field?: string;

  constructor(
    code: string,
    status: 400 | 403 | 404 | 422 | 429,
    message: string,
    field?: string,
  ) {
    super(message);
    this.name = 'CollaborationError';
    this.code = code;
    this.status = status;
    this.field = field;
  }
}

const validStatuses = new Set<CollaborationStatus>([
  'open', 'in_progress', 'waiting_client', 'resolved',
]);
const validVisibilities = new Set<CommentVisibility>(['shared', 'internal']);

function cleanText(value: unknown, field: string, max: number) {
  if (typeof value !== 'string') {
    throw new CollaborationError('INVALID_FIELD', 422, 'Revisa la información ingresada.', field);
  }
  const text = value.trim();
  if (!text || text.length > max) {
    throw new CollaborationError('INVALID_FIELD', 422, 'Revisa la información ingresada.', field);
  }
  return text;
}

async function resolveClientWorkspace(actor: PortalIdentity) {
  const own = await getCollaborationWorkspace(actor.id);
  if (!own) throw new CollaborationError('WORKSPACE_NOT_FOUND', 404, 'No encontramos este espacio.');
  return { ...own, role: 'client' as const };
}

async function resolveOperatorWorkspace(requestedWorkspaceId: string) {
  const workspaces = await listCollaborationWorkspaces();
  const workspace = workspaces.find((item) => item.id === requestedWorkspaceId);
  if (!workspace) throw new CollaborationError('WORKSPACE_NOT_FOUND', 404, 'No encontramos este espacio.');
  return workspace;
}

export async function getCollaborationSnapshot(
  actor: PortalIdentity,
): Promise<CollaborationSnapshot> {
  const workspace = await resolveClientWorkspace(actor);
  const threads = await listCollaborationThreads(workspace.id, false);
  return {
    actor: { id: actor.id, displayName: actor.displayName, role: 'client', teamMember: false },
    workspace,
    workspaces: [workspace],
    threads,
  };
}

export async function createCollaborationThread(actor: PortalIdentity, input: CreateThreadInput) {
  const workspace = await resolveClientWorkspace(actor);
  return insertCollaborationThread({
    workspaceUserId: workspace.id,
    authorUserId: actor.id,
    title: cleanText(input.title, 'title', 120),
    body: cleanText(input.body, 'body', 4000),
    isImportant: input.isImportant === true,
  });
}

export async function changeCollaborationThread(actor: PortalIdentity, input: UpdateThreadInput) {
  void actor;
  void input;
  throw new CollaborationError('OPS_ONLY', 403, 'Esta acción solo está disponible en Flouvia Ops.');
}

function validateThreadUpdate(input: UpdateThreadInput) {
  const threadId = cleanText(input.threadId, 'threadId', 80);
  if (input.status !== undefined && !validStatuses.has(input.status)) {
    throw new CollaborationError('INVALID_STATUS', 422, 'El estado no es válido.', 'status');
  }
  if (input.status === undefined && input.pinned === undefined) {
    throw new CollaborationError('EMPTY_UPDATE', 422, 'No hay cambios para guardar.');
  }
  return threadId;
}

export async function changeOperatorCollaborationThread(
  actor: OperatorIdentity,
  input: UpdateThreadInput,
  requestId?: string,
) {
  const threadId = validateThreadUpdate(input);
  const updated = await updateCollaborationThread({
    threadId,
    status: input.status,
    pinned: typeof input.pinned === 'boolean' ? input.pinned : undefined,
    actorUserId: requestId ? actor.id : undefined,
    auditRequestId: requestId,
  });
  if (!updated) throw new CollaborationError('THREAD_NOT_FOUND', 404, 'No encontramos este asunto.');
}

export async function createCollaborationComment(actor: PortalIdentity, input: CreateCommentInput) {
  const threadId = cleanText(input.threadId, 'threadId', 80);
  const workspaceId = await getThreadWorkspaceId(threadId);
  if (!workspaceId || workspaceId !== actor.id) {
    throw new CollaborationError('THREAD_NOT_FOUND', 404, 'No encontramos este asunto.');
  }
  return insertCollaborationComment({
    threadId,
    authorUserId: actor.id,
    body: cleanText(input.body, 'body', 3000),
    visibility: 'shared',
  });
}

export async function getOperatorCollaborationSnapshot(
  actor: OperatorIdentity,
): Promise<OperatorCollaborationSnapshot> {
  const [workspaces, threads] = await Promise.all([
    listCollaborationWorkspaces(),
    listOperatorCollaborationThreads(),
  ]);
  return {
    actor: {
      id: actor.id,
      displayName: actor.displayName,
      email: actor.email,
      role: actor.role,
      teamMember: true,
    },
    workspaces,
    threads,
  };
}

export async function createOperatorCollaborationThread(
  actor: OperatorIdentity,
  input: CreateThreadInput,
  requestId?: string,
) {
  const workspaceId = cleanText(input.workspaceId, 'workspaceId', 80);
  const workspace = await resolveOperatorWorkspace(workspaceId);
  return insertCollaborationThread({
    workspaceUserId: workspace.id,
    authorUserId: actor.id,
    title: cleanText(input.title, 'title', 120),
    body: cleanText(input.body, 'body', 4000),
    isImportant: input.isImportant === true,
    auditRequestId: requestId,
  });
}

export async function createOperatorCollaborationComment(
  actor: OperatorIdentity,
  input: CreateCommentInput,
  requestId?: string,
) {
  const threadId = cleanText(input.threadId, 'threadId', 80);
  const workspaceId = await getThreadWorkspaceId(threadId);
  if (!workspaceId) {
    throw new CollaborationError('THREAD_NOT_FOUND', 404, 'No encontramos este asunto.');
  }
  if (!validVisibilities.has(input.visibility)) {
    throw new CollaborationError('INVALID_VISIBILITY', 422, 'La visibilidad no es válida.', 'visibility');
  }
  return insertCollaborationComment({
    threadId,
    authorUserId: actor.id,
    body: cleanText(input.body, 'body', 3000),
    visibility: input.visibility,
    auditRequestId: requestId,
  });
}
