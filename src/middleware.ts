import { sequence } from 'astro:middleware';
import type { MiddlewareHandler } from 'astro';
import { clerkMiddleware } from '@clerk/astro/server';

const ALLOWED_ORIGINS = new Set([
  'https://flouvia.com',
  'https://www.flouvia.com',
  'https://os.flouvia.com',
  'https://ops.flouvia.com',
]);

function corsHeaders(origin: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers.Vary = 'Origin';
  }
  return headers;
}

const cors: MiddlewareHandler = async (context, next) => {
  const isApi = context.url.pathname.startsWith('/api/')
    || context.url.pathname.startsWith('/en/api/');
  const origin = context.request.headers.get('origin') ?? '';

  if (isApi && context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const response = await next();
  if (isApi && ALLOWED_ORIGINS.has(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }
  return response;
};

// Clerk only enriches Astro.locals here. Authorization happens beside each
// protected layout/API resource, so adding a route cannot bypass a path matcher.
export const onRequest = sequence(cors, clerkMiddleware());
