export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const PATCH: APIRoute = async ({ locals, request }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const user = await locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) return new Response('No email', { status: 400 });

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

  const { error } = await supabase
    .from('tickets')
    .update({ rating })
    .eq('ticket_ref', ticket_ref)
    .eq('email_cliente', email);

  if (error) return new Response('DB error', { status: 500 });

  return Response.json({ ok: true });
};
