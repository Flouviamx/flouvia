// src/pages/api/push/subscribe.ts
// Saves a browser PushSubscription to Supabase
// SQL:
//   create table push_subscriptions (
//     id           uuid    default gen_random_uuid() primary key,
//     email_cliente text   not null,
//     endpoint     text    not null unique,
//     p256dh       text    not null,
//     auth         text    not null,
//     created_at   timestamptz default now()
//   );
//   create index on push_subscriptions(email_cliente);

export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const user  = await locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) return new Response('No email', { status: 400 });

  let body: any;
  try { body = await request.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const { endpoint, keys } = body ?? {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return new Response('Missing fields', { status: 400 });
  }

  await supabase.from('push_subscriptions').upsert(
    { email_cliente: email, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    { onConflict: 'endpoint' }
  );

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  let body: any;
  try { body = await request.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  if (body?.endpoint) {
    await supabase.from('push_subscriptions').delete().eq('endpoint', body.endpoint);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
