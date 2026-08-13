export const prerender = false;

import type { APIRoute } from 'astro';
import { requirePortalIdentity } from '../../../lib/portalDb';
import { rateLimit } from '../../../lib/rateLimit';
import {
  CollaborationError,
  createCollaborationComment,
} from '../../../features/collaboration/collaboration.service';
import {
  collaborationJson,
  collaborationProblem,
  readJsonObject,
} from '../../../features/collaboration/collaboration.http';

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
    const id = await createCollaborationComment(identity, {
      threadId: typeof body.threadId === 'string' ? body.threadId : '',
      body: typeof body.body === 'string' ? body.body : '',
      visibility: 'shared',
    });
    return collaborationJson({ id }, requestId, 201, {
      Location: `/api/collaboration/comments?id=${encodeURIComponent(id)}`,
    });
  } catch (error) {
    return collaborationProblem(error, requestId, url.pathname);
  }
};
