// src/pages/api/push/subscribe.ts
// Saves a browser PushSubscription to Neon, scoped by internal user_id.

export const prerender = false;

import type { APIRoute } from 'astro';
import { deletePushSubscription, requirePortalIdentity, upsertPushSubscription } from '../../../lib/portalDb';
import { portalAccessErrorResponse } from '../../../lib/portalAccess';

export const POST: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  let identity;
  try { identity = await requirePortalIdentity(locals); }
  catch (error) { return portalAccessErrorResponse(error); }

  let body: any;
  try { body = await request.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const { endpoint, keys } = body ?? {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return new Response('Missing fields', { status: 400 });
  }

  await upsertPushSubscription({
    userId: identity.id,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  let identity;
  try { identity = await requirePortalIdentity(locals); }
  catch (error) { return portalAccessErrorResponse(error); }

  let body: any;
  try { body = await request.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  if (body?.endpoint) {
    await deletePushSubscription(body.endpoint, identity.id);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
