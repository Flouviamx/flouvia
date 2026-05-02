export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, locals }) => {
  const { userId } = await locals.auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const user = await locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) {
    return new Response(JSON.stringify({ error: 'No email found' }), { status: 400 });
  }

  const formData = await request.formData();
  const file     = formData.get('file') as File | null;
  const name     = (formData.get('name') as string) || file?.name || 'unnamed';
  const category = (formData.get('category') as string) || 'general';

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
  }

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const filePath = `${email}/${Date.now()}_${file.name}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from('boveda')
    .upload(filePath, file, { upsert: false });

  if (storageError) {
    return new Response(JSON.stringify({ error: storageError.message }), { status: 500 });
  }

  const { data: publicUrl } = supabase.storage.from('boveda').getPublicUrl(filePath);

  const { error: dbError } = await supabase.from('boveda_archivos').insert({
    email_cliente: email,
    nombre:        name,
    categoria:     category,
    tipo:          ext.toUpperCase(),
    size:          `${(file.size / 1024).toFixed(0)} KB`,
    url_descarga:  publicUrl.publicUrl,
  });

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
