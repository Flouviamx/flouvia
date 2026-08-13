export const prerender = false;

import type { APIRoute } from 'astro';
import { get } from '@vercel/blob';
import { getVaultFile, requirePortalIdentity } from '../../../lib/portalDb';
import { portalAccessErrorResponse } from '../../../lib/portalAccess';

export const GET: APIRoute = async ({ locals, url }) => {
  const { userId } = await locals.auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const fileId = url.searchParams.get('id');
  if (!fileId) return new Response('Missing file id', { status: 400 });

  let identity;
  try { identity = await requirePortalIdentity(locals); }
  catch (error) { return portalAccessErrorResponse(error); }
  const file = await getVaultFile(identity.id, fileId);
  if (!file) return new Response('Not found', { status: 404 });

  const result = await get(file.blob_url || file.blob_pathname, { access: 'private' });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new Response('Not found', { status: 404 });
  }

  const asciiName = String(file.nombre || 'download')
    .replace(/[^\x20-\x7E]/g, '_')
    .replace(/["\\]/g, '_');
  const encodedName = encodeURIComponent(String(file.nombre || 'download'));

  const headers = new Headers({
    'Content-Type': result.blob.contentType || file.content_type || 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
    'Cache-Control': 'private, max-age=0, no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  const contentLength = result.blob.size ?? file.size_bytes;
  if (contentLength !== null && contentLength !== undefined) {
    headers.set('Content-Length', String(contentLength));
  }

  return new Response(result.stream, { status: 200, headers });
};
