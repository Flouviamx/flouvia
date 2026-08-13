export const prerender = false;

import type { APIRoute } from 'astro';
import { createTicket, requirePortalIdentity } from '../../../lib/portalDb';
import { portalAccessErrorResponse } from '../../../lib/portalAccess';

const MAKE_WEBHOOK = 'https://hook.us2.make.com/yxof110p9eswdp0eayr7qihrqx6778dd';

export const POST: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  let identity;
  try { identity = await requirePortalIdentity(locals); }
  catch (error) { return portalAccessErrorResponse(error); }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const { category = '', subject = '', description = '', priority = 'normal' } = body;
  if (!subject.trim()) return new Response('Missing subject', { status: 422 });

  let ticket_ref: string;
  try {
    ticket_ref = await createTicket({
      userId: identity.id,
      title: subject.trim(),
      category: category || 'general',
      description: description.trim(),
      priority,
    });
  } catch {
    return new Response('DB error', { status: 500 });
  }

  // Forward a Make (fire-and-forget)
  fetch(MAKE_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticket_ref,
      email:       identity.email,
      nombre:      identity.displayName,
      category,
      subject:     subject.trim(),
      description: description.trim(),
      priority,
      timestamp:   new Date().toISOString(),
      fuente:      'flouvia.com/portal/soporte',
    }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => {});

  return Response.json({ ok: true, ticket_ref });
};
