export const prerender = false;
/*
  SQL to run once in Supabase:

  create table tickets (
    id          uuid        default gen_random_uuid() primary key,
    email_cliente text      not null,
    ticket_ref  text        not null,
    title       text        not null,
    category    text        not null default 'general',
    descripcion text,
    priority    text        not null default 'normal',
    status      text        not null default 'open',
    created_at  timestamptz default now()
  );
  create index on tickets(email_cliente, created_at desc);
*/

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

const MAKE_WEBHOOK = 'https://hook.us2.make.com/yxof110p9eswdp0eayr7qihrqx6778dd';

export const POST: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const user = await locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) return new Response('No email', { status: 400 });

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const { category = '', subject = '', description = '', priority = 'normal' } = body;
  if (!subject.trim()) return new Response('Missing subject', { status: 422 });

  // Generate ticket ref TK-NNN
  const { count } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('email_cliente', email);

  const num = String((count ?? 0) + 1).padStart(3, '0');
  const ticket_ref = `TK-${num}`;

  const { error } = await supabase.from('tickets').insert({
    email_cliente: email,
    ticket_ref,
    title:        subject.trim(),
    category:     category || 'general',
    descripcion:  description.trim(),
    priority,
    status:       'open',
  });

  if (error) return new Response('DB error', { status: 500 });

  // Forward to Make (fire-and-forget)
  fetch(MAKE_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticket_ref,
      email,
      nombre:    user?.firstName ?? '',
      category,
      subject:   subject.trim(),
      description: description.trim(),
      priority,
      timestamp: new Date().toISOString(),
      fuente:    'flouvia.com/portal/soporte',
    }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => {});

  return Response.json({ ok: true, ticket_ref });
};
