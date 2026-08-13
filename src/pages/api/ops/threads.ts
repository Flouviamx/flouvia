export const prerender = false;

import type { APIRoute } from 'astro';
import {
  changeOperatorCollaborationThread,
  CollaborationError,
  createOperatorCollaborationThread,
  getOperatorCollaborationSnapshot,
} from '../../../features/collaboration/collaboration.service';
import type { CollaborationStatus } from '../../../features/collaboration/collaboration.types';
import {
  collaborationJson,
  collaborationProblem,
  readJsonObject,
} from '../../../features/collaboration/collaboration.http';
import {
  requireOperatorHost,
  requireOperatorCapability,
  requireOperatorIdentity,
  requireOperatorRequestOrigin,
} from '../../../features/ops/operatorAccess';
import { rateLimit } from '../../../lib/rateLimit';

function requireWriteAllowance(userId: string) {
  if (!rateLimit(`ops-collaboration-write:${userId}`, 80, 60_000)) {
    throw new CollaborationError(
      'RATE_LIMITED',
      429,
      'Espera un momento antes de volver a intentar.',
    );
  }
}

export const GET: APIRoute = async ({ locals, request, url }) => {
  const requestId = crypto.randomUUID();
  try {
    requireOperatorHost(request);
    const identity = await requireOperatorIdentity(locals);
    requireOperatorCapability(identity, 'ops:read');
    const snapshot = await getOperatorCollaborationSnapshot(identity);
    return collaborationJson(snapshot, requestId);
  } catch (error) {
    return collaborationProblem(error, requestId, url.pathname);
  }
};

export const POST: APIRoute = async ({ locals, request, url }) => {
  const requestId = crypto.randomUUID();
  try {
    requireOperatorHost(request);
    requireOperatorRequestOrigin(request);
    const identity = await requireOperatorIdentity(locals);
    requireOperatorCapability(identity, 'inbox:write');
    requireWriteAllowance(identity.id);
    const body = await readJsonObject(request);
    const id = await createOperatorCollaborationThread(identity, {
      workspaceId: typeof body.workspaceId === 'string' ? body.workspaceId : undefined,
      title: typeof body.title === 'string' ? body.title : '',
      body: typeof body.body === 'string' ? body.body : '',
      isImportant: body.isImportant === true,
    }, requestId);
    return collaborationJson({ id }, requestId, 201, {
      Location: `/api/ops/threads?id=${encodeURIComponent(id)}`,
    });
  } catch (error) {
    return collaborationProblem(error, requestId, url.pathname);
  }
};

export const PATCH: APIRoute = async ({ locals, request, url }) => {
  const requestId = crypto.randomUUID();
  try {
    requireOperatorHost(request);
    requireOperatorRequestOrigin(request);
    const identity = await requireOperatorIdentity(locals);
    requireOperatorCapability(identity, 'inbox:write');
    requireWriteAllowance(identity.id);
    const body = await readJsonObject(request);
    await changeOperatorCollaborationThread(identity, {
      threadId: typeof body.threadId === 'string' ? body.threadId : '',
      status: typeof body.status === 'string' ? body.status as CollaborationStatus : undefined,
      pinned: typeof body.pinned === 'boolean' ? body.pinned : undefined,
    }, requestId);
    return collaborationJson({ updated: true }, requestId);
  } catch (error) {
    return collaborationProblem(error, requestId, url.pathname);
  }
};
