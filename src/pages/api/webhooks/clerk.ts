export const prerender = false;

import type { APIRoute } from 'astro';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

interface ClerkUserCreatedData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserCreatedData;
}

export const POST: APIRoute = async ({ request }) => {
  // ── 0. Inicializar cliente Supabase (lazy — la key no siempre está disponible) ──
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return new Response(JSON.stringify({ error: 'Supabase service role key not configured' }), { status: 500 });
  }
  const supabaseAdmin = createClient(import.meta.env.SUPABASE_URL, serviceKey);

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

  // ── 3. Solo procesar user.created ──
  if (event.type !== 'user.created') {
    return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200 });
  }

  // ── 4. Extraer clerk_id y email principal ──
  const { id: clerkId, email_addresses, primary_email_address_id } = event.data;

  const primaryEmail = email_addresses.find(
    (e) => e.id === primary_email_address_id,
  )?.email_address ?? email_addresses[0]?.email_address;

  if (!primaryEmail) {
    return new Response(JSON.stringify({ error: 'No email found in event' }), { status: 422 });
  }

  // ── 5 & 6. Upsert en tabla perfiles ──
  try {
    const { data: existing } = await supabaseAdmin
      .from('perfiles')
      .select('id')
      .eq('email_cliente', primaryEmail)
      .single();

    if (existing) {
      // Registro encontrado → actualizar solo clerk_id
      const { error } = await supabaseAdmin
        .from('perfiles')
        .update({ clerk_id: clerkId })
        .eq('email_cliente', primaryEmail);

      if (error) throw error;
    } else {
      // No existe → insertar fila nueva (id es UUID auto-generado)
      const { error } = await supabaseAdmin
        .from('perfiles')
        .insert({
          email_cliente:  primaryEmail,
          clerk_id:       clerkId,
          nombre_empresa: 'Nuevo Cliente',
        });

      if (error) throw error;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown database error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }

  // ── 7. Respuesta exitosa ──
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
