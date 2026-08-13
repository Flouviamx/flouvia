export const prerender = false;

import type { APIRoute } from 'astro';
import { head } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { createVaultFile, requirePortalIdentity, type PortalIdentity } from '../../../lib/portalDb';
import { portalAccessErrorResponse } from '../../../lib/portalAccess';
import { rateLimit } from '../../../lib/rateLimit';

const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx',
  'png', 'jpg', 'jpeg', 'fig', 'zip',
]);

const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
];

const VALID_CATEGORIES = new Set(['contratos', 'diseno', 'entregables', 'general']);
const MAX_BYTES = 50 * 1024 * 1024;

interface ClientMetadata {
  name?: string;
  category?: string;
  originalFileName?: string;
}

interface UploadTokenPayload {
  userId: string;
  name: string;
  category: string;
  originalFileName: string;
  extension: string;
}

function parseClientMetadata(payload: string | null): ClientMetadata {
  if (!payload) return {};
  const parsed = JSON.parse(payload) as ClientMetadata;
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid upload metadata');
  return parsed;
}

function safeText(value: unknown, fallback: string, maxLength = 180) {
  if (typeof value !== 'string') return fallback;
  return value.trim().slice(0, maxLength) || fallback;
}

function sizeLabel(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const POST: APIRoute = async ({ request, locals }) => {
  let body: HandleUploadBody;
  try {
    body = await request.json() as HandleUploadBody;
  } catch {
    return json({ error: 'Bad JSON' }, 400);
  }

  // Upload-completed callbacks come from Vercel Blob and therefore do not carry
  // the user's Clerk cookie. Authentication is required only for token issuance;
  // the callback itself is authenticated by the signed client token payload.
  let identity: PortalIdentity | null = null;
  if (body.type === 'blob.generate-client-token') {
    const { userId } = await locals.auth();
    if (!userId) return json({ error: 'Unauthorized' }, 401);
    if (!rateLimit(userId, 10, 60_000)) {
      return json({ error: 'Too many requests — max 10 uploads per minute' }, 429);
    }
    try { identity = await requirePortalIdentity(locals); }
    catch (error) { return portalAccessErrorResponse(error); }
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!identity) throw new Error('Unauthorized upload token request');

        const expectedPrefix = `boveda/${identity.id}/`;
        if (!pathname.startsWith(expectedPrefix) || pathname.includes('..')) {
          throw new Error('Invalid upload path');
        }

        const fileName = pathname.slice(expectedPrefix.length);
        if (!fileName || fileName.includes('/')) throw new Error('Invalid file name');

        const metadata = parseClientMetadata(clientPayload);
        const originalFileName = safeText(metadata.originalFileName, fileName);
        const extension = originalFileName.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTENSIONS.has(extension)) {
          throw new Error(`File type .${extension || 'unknown'} not allowed`);
        }

        const category = VALID_CATEGORIES.has(metadata.category || '')
          ? String(metadata.category)
          : 'general';

        const tokenPayload: UploadTokenPayload = {
          userId: identity.id,
          name: safeText(metadata.name, originalFileName),
          category,
          originalFileName,
          extension,
        };

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          validUntil: Date.now() + 10 * 60_000,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify(tokenPayload),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!tokenPayload) throw new Error('Missing upload metadata');
        const metadata = JSON.parse(tokenPayload) as UploadTokenPayload;
        if (!metadata.userId || !ALLOWED_EXTENSIONS.has(metadata.extension)) {
          throw new Error('Invalid signed upload metadata');
        }

        // The completion result does not include byte size. Read it from Blob so
        // database metadata is based on storage, not on a browser-provided value.
        const stored = await head(blob.url);
        if (stored.size > MAX_BYTES) throw new Error('Uploaded file exceeds 50 MB');

        await createVaultFile({
          userId: metadata.userId,
          name: metadata.name,
          category: metadata.category,
          fileType: metadata.extension.toUpperCase(),
          sizeLabel: sizeLabel(stored.size),
          sizeBytes: stored.size,
          blobUrl: blob.url,
          blobPathname: blob.pathname,
          contentType: stored.contentType || blob.contentType || 'application/octet-stream',
        });
      },
    });

    return json(response, 200);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Upload failed';
    // Vercel Blob retries completion callbacks that do not return a 2xx response.
    return json({ error: message }, 400);
  }
};

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
