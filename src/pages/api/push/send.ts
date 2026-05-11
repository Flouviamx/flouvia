// src/pages/api/push/send.ts
// Sends a push notification to one client (by email) or all clients.
// Protected: only Flouvia admin can call this (ADMIN_SECRET header).
// Make webhooks can call this to notify clients of events.
//
// Body: { email?, title, body, url?, tag?, action?, adminSecret }

export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { sendPush } from '../../../lib/webpush';

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try { body = await request.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const adminSecret = import.meta.env.ADMIN_SECRET;
  if (adminSecret && body?.adminSecret !== adminSecret) {
    return new Response('Forbidden', { status: 403 });
  }

  const { email, title, body: msgBody, url, tag, action } = body ?? {};
  if (!title || !msgBody) {
    return new Response('title and body required', { status: 400 });
  }

  // Fetch subscriptions — by email or all
  let query = supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, email_cliente');

  if (email) query = query.eq('email_cliente', email.toLowerCase());

  const { data: subs } = await query;
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
        supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
      )
    );
  }

  const sent = results.filter((r) => r.status === 'fulfilled' && (r as any).value?.ok).length;
  return new Response(JSON.stringify({ ok: true, sent }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
