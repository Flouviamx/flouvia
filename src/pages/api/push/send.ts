// src/pages/api/push/send.ts
// Sends a push notification to one client (by email) or all clients.
// Protected: only Flouvia admin can call this (ADMIN_SECRET header).
// Make webhooks can call this to notify clients of events.
//
// Body: { email?, title, body, url?, tag?, action?, adminSecret }

export const prerender = false;

import type { APIRoute } from 'astro';
import { deletePushSubscription, getPushSubscriptions } from '../../../lib/portalDb';
import { sendPush } from '../../../lib/webpush';

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try { body = await request.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const adminSecret = import.meta.env.ADMIN_SECRET;
  if (!adminSecret) {
    return new Response('Push notifications are not configured', { status: 503 });
  }
  if (body?.adminSecret !== adminSecret) {
    return new Response('Forbidden', { status: 403 });
  }

  const { email, title, body: msgBody, url, tag, action } = body ?? {};
  if (!title || !msgBody) {
    return new Response('title and body required', { status: 400 });
  }

  const subs = await getPushSubscriptions(email);
  if (!subs?.length) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = { title, body: msgBody, url: url || '/dashboard', tag, action };
  const results = await Promise.allSettled(
    subs.map((s) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload))
  );

  // Remove expired subscriptions (410 Gone)
  const expired = results
    .map((r, i) => ({ r, sub: subs[i] }))
    .filter(({ r }) => r.status === 'fulfilled' && !(r as any).value?.ok);

  if (expired.length) {
    await Promise.all(
      expired.map(({ sub }) =>
        deletePushSubscription(sub.endpoint)
      )
    );
  }

  const sent = results.filter((r) => r.status === 'fulfilled' && (r as any).value?.ok).length;
  return new Response(JSON.stringify({ ok: true, sent }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
