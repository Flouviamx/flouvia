export const prerender = false;

import type { APIRoute } from 'astro';
import { requirePortalIdentity } from '../../../lib/portalDb';
import { rateLimit } from '../../../lib/rateLimit';
import {
  CollaborationError,
  createCollaborationThread,
  getCollaborationSnapshot,
} from '../../../features/collaboration/collaboration.service';
import {
  collaborationJson,
  collaborationProblem,
  readJsonObject,
} from '../../../features/collaboration/collaboration.http';

export const GET: APIRoute = async ({ locals, url }) => {
  const requestId = crypto.randomUUID();
  try {
    const identity = await requirePortalIdentity(locals);
    const snapshot = await getCollaborationSnapshot(identity);
    return collaborationJson(snapshot, requestId);
  } catch (error) {
    return collaborationProblem(error, requestId, url.pathname);
  }
};

export const POST: APIRoute = async ({ locals, request, url }) => {
  const requestId = crypto.randomUUID();
  try {
    const identity = await requirePortalIdentity(locals);
    if (!rateLimit(`collaboration-write:${identity.id}`, 40, 60_000)) {
      return collaborationProblem(new CollaborationError(
        'RATE_LIMITED', 429, 'Espera un momento antes de volver a intentar.',
      ), requestId, url.pathname);
    }
    const body = await readJsonObject(request);
    const id = await createCollaborationThread(identity, {
      title: typeof body.title === 'string' ? body.title : '',
      body: typeof body.body === 'string' ? body.body : '',
      isImportant: body.isImportant === true,
    });
    return collaborationJson({ id }, requestId, 201, {
      Location: `/api/collaboration/threads?id=${encodeURIComponent(id)}`,
    });
  } catch (error) {
    return collaborationProblem(error, requestId, url.pathname);
  }
};
