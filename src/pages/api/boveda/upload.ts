export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase }    from '../../../lib/supabase';
import { rateLimit }   from '../../../lib/rateLimit';

const ALLOWED_TYPES = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx',
  'png', 'jpg', 'jpeg', 'fig', 'zip',
]);

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export const POST: APIRoute = async ({ request, locals }) => {
  // ── Auth ──────────────────────────────────────────────────────────
  const { userId } = await locals.auth();
  if (!userId) {
    return json({ error: 'Unauthorized' }, 401);
  }

  // ── Rate limit — 10 uploads / minute per user ──────────────────────
  if (!rateLimit(userId, 10, 60_000)) {
    return json({ error: 'Too many requests — max 10 uploads per minute' }, 429);
  }

  const user = await locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) {
    return json({ error: 'No email found' }, 400);
  }

  // ── Parse form ────────────────────────────────────────────────────
  const formData = await request.formData();
  const file     = formData.get('file') as File | null;
  const name     = ((formData.get('name') as string) || file?.name || 'unnamed').trim();
  const category = (formData.get('category') as string) || 'general';

  if (!file) {
    return json({ error: 'No file provided' }, 400);
  }

  // ── Validate ──────────────────────────────────────────────────────
  if (file.size > MAX_BYTES) {
    return json({ error: 'File exceeds 50 MB' }, 400);
  }

  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  if (!ALLOWED_TYPES.has(ext)) {
    return json({ error: `File type .${ext} not allowed` }, 400);
  }

  const validCategories = ['contratos', 'diseno', 'entregables', 'general'];
  const safeCategory = validCategories.includes(category) ? category : 'general';

  // ── Upload to Supabase Storage ────────────────────────────────────
  // Path: {email}/{timestamp}_{filename}
  // Stored in DB as the path (NOT a public URL) — signed URLs are generated at read time
  const storagePath = `${email}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const { error: storageError } = await supabase.storage
    .from('boveda')
    .upload(storagePath, file, { upsert: false, contentType: file.type });

  if (storageError) {
    return json({ error: storageError.message }, 500);
  }

  // ── Insert metadata into DB ───────────────────────────────────────
  const sizeLabel = file.size < 1024 * 1024
    ? `${(file.size / 1024).toFixed(0)} KB`
    : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

  const { data: inserted, error: dbError } = await supabase
    .from('boveda_archivos')
    .insert({
      email_cliente: email,
      nombre:        name,
      categoria:     safeCategory,
      tipo:          ext.toUpperCase(),
      size:          sizeLabel,
      url_descarga:  storagePath, // path, not URL — signed URL generated at read time
    })
    .select('id, nombre, tipo, size, created_at')
    .single();

  if (dbError) {
    // Clean up orphaned storage object
    await supabase.storage.from('boveda').remove([storagePath]);
    return json({ error: dbError.message }, 500);
  }

  return json({ ok: true, file: inserted }, 200);
};

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
