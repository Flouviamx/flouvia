export const prerender = false;

import type { APIRoute } from 'astro';
import {
  CollaborationError,
  createOperatorCollaborationComment,
} from '../../../features/collaboration/collaboration.service';
import type { CommentVisibility } from '../../../features/collaboration/collaboration.types';
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

export const POST: APIRoute = async ({ locals, request, url }) => {
  const requestId = crypto.randomUUID();
  try {
    requireOperatorHost(request);
    requireOperatorRequestOrigin(request);
    const identity = await requireOperatorIdentity(locals);
    requireOperatorCapability(identity, 'inbox:write');
    if (!rateLimit(`ops-collaboration-write:${identity.id}`, 80, 60_000)) {
      throw new CollaborationError(
        'RATE_LIMITED',
        429,
        'Espera un momento antes de volver a intentar.',
      );
    }
    const body = await readJsonObject(request);
    const visibility: CommentVisibility = body.visibility === 'internal' ? 'internal' : 'shared';
    const id = await createOperatorCollaborationComment(identity, {
      threadId: typeof body.threadId === 'string' ? body.threadId : '',
      body: typeof body.body === 'string' ? body.body : '',
      visibility,
    }, requestId);
    return collaborationJson({ id }, requestId, 201, {
      Location: `/api/ops/comments?id=${encodeURIComponent(id)}`,
    });
  } catch (error) {
    return collaborationProblem(error, requestId, url.pathname);
  }
};
