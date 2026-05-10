import { sequence }                          from 'astro:middleware';
import type { MiddlewareHandler }            from 'astro';
import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// ── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  'https://flouvia.com',
  'https://www.flouvia.com',
  'https://os.flouvia.com',
]);

function corsHeaders(origin: string): Record<string, string> {
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    h['Access-Control-Allow-Origin']      = origin;
    h['Access-Control-Allow-Credentials'] = 'true';
    h['Vary']                             = 'Origin';
  }
  return h;
}

const cors: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;
  const isApi        = pathname.startsWith('/api/') || /^\/en\/api\//.test(pathname);
  const origin       = context.request.headers.get('origin') ?? '';

  // Preflight
  if (isApi && context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const response = await next();

  if (isApi && ALLOWED_ORIGINS.has(origin)) {
    response.headers.set('Access-Control-Allow-Origin',      origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary',                             'Origin');
  }

  return response;
};

// ── CLERK AUTH ────────────────────────────────────────────────────────────────
const isProtectedRoute = createRouteMatcher([
  '/portal/dashboard(.*)',
  '/portal/facturacion(.*)',
  '/portal/boveda(.*)',
  '/portal/soporte(.*)',
  '/portal/roadmap(.*)',
  '/portal/calendario(.*)',
  '/en/portal/dashboard(.*)',
  '/en/portal/facturacion(.*)',
  '/en/portal/boveda(.*)',
  '/en/portal/soporte(.*)',
  '/en/portal/roadmap(.*)',
  '/en/portal/calendario(.*)',
]);

const clerk = clerkMiddleware((auth, context) => {
  if (isProtectedRoute(context.request) && !auth().userId) {
    const url       = new URL(context.request.url);
    const isEnglish = url.pathname.startsWith('/en/');
    const blockedUrl = isEnglish
      ? `${url.origin}/en/portal/access-denied`
      : `${url.origin}/portal/acceso-restringido`;
    return Response.redirect(blockedUrl, 302);
  }
});

export const onRequest = sequence(cors, clerk);
