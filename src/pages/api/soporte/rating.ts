export const prerender = false;

import type { APIRoute } from 'astro';
import { rateTicket, requirePortalIdentity } from '../../../lib/portalDb';
import { portalAccessErrorResponse } from '../../../lib/portalAccess';

export const PATCH: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  let identity;
  try { identity = await requirePortalIdentity(locals); }
  catch (error) { return portalAccessErrorResponse(error); }

  let body: { ticket_ref: string; rating: number };
  try {
    body = await request.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const { ticket_ref, rating } = body;
  if (!ticket_ref || ![1, 2, 3].includes(rating)) {
    return new Response('Invalid payload', { status: 422 });
  }

  try {
    await rateTicket(identity.id, ticket_ref, rating);
  } catch {
    return new Response('DB error', { status: 500 });
  }

  return Response.json({ ok: true });
};
