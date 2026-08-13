export const prerender = false;

import type { APIRoute } from 'astro';
import { Webhook } from 'svix';
import { disableAppUser, upsertAppUser } from '../../../lib/portalDb';

interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

interface ClerkUserCreatedData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string;
  first_name?: string | null;
  last_name?: string | null;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserCreatedData;
}

export const POST: APIRoute = async ({ request }) => {
  // ── 1. Extraer headers de firma Svix ──
  const svixId        = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response(JSON.stringify({ error: 'Missing svix headers' }), { status: 400 });
  }

  // ── 2. Validar firma con CLERK_WEBHOOK_SECRET ──
  const secret = import.meta.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { status: 500 });
  }

  const rawBody = await request.text();

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(rawBody, {
      'svix-id':        svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), { status: 401 });
  }

  // ── 3. Procesar únicamente el ciclo de vida de usuarios ──
  if (!['user.created', 'user.updated', 'user.deleted'].includes(event.type)) {
    return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200 });
  }

  if (event.type === 'user.deleted') {
    try {
      await disableAppUser(event.data.id);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown database error';
      return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
  }

  // ── 4. Extraer clerk_id y email principal ──
  const { id: clerkId, email_addresses, primary_email_address_id } = event.data;

  const primaryEmail = email_addresses.find(
    (e) => e.id === primary_email_address_id,
  )?.email_address ?? email_addresses[0]?.email_address;

  if (!primaryEmail) {
    return new Response(JSON.stringify({ error: 'No email found in event' }), { status: 422 });
  }

  // ── 5. Upsert de identidad interna, desacoplada de Clerk ──
  try {
    await upsertAppUser({
      id: clerkId,
      firstName: event.data.first_name,
      lastName: event.data.last_name,
      fullName: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
      emailAddresses: [{ emailAddress: primaryEmail }],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown database error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }

  // ── 6. Respuesta exitosa ──
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
