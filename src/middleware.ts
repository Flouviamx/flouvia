import { sequence }                                          from 'astro:middleware';
import type { MiddlewareHandler }                            from 'astro';
import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/astro/server';

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
  // Root-level (rutas activas tras login)
  '/dashboard(.*)',
  '/facturacion(.*)',
  '/boveda(.*)',
  '/soporte(.*)',
  '/roadmap(.*)',
  '/calendario(.*)',
  '/entorno(.*)',
  '/boveda-upload(.*)',
  '/privacidad-portal(.*)',
  '/changelog(.*)',
  // Portal-prefixed (rutas alternativas)
  '/portal/dashboard(.*)',
  '/portal/facturacion(.*)',
  '/portal/boveda(.*)',
  '/portal/soporte(.*)',
  '/portal/roadmap(.*)',
  '/portal/calendario(.*)',
  // English mirrors
  '/en/dashboard(.*)',
  '/en/facturacion(.*)',
  '/en/boveda(.*)',
  '/en/soporte(.*)',
  '/en/roadmap(.*)',
  '/en/calendario(.*)',
  '/en/entorno(.*)',
  '/en/boveda-upload(.*)',
  '/en/privacidad-portal(.*)',
  '/en/changelog(.*)',
  '/en/portal/dashboard(.*)',
  '/en/portal/facturacion(.*)',
  '/en/portal/boveda(.*)',
  '/en/portal/soporte(.*)',
  '/en/portal/roadmap(.*)',
  '/en/portal/calendario(.*)',
]);

const clerk = clerkMiddleware(async (auth, context) => {
  if (!isProtectedRoute(context.request)) return;

  const url        = new URL(context.request.url);
  const isEnglish  = url.pathname.startsWith('/en/');
  const loginUrl   = isEnglish ? `${url.origin}/en/login` : `${url.origin}/login`;
  const blockedUrl = isEnglish
    ? `${url.origin}/en/portal/access-denied?signout=1`
    : `${url.origin}/portal/acceso-restringido?signout=1`;

  // ── Layer 1: no autenticado → /login ──────────────────────────────
  const { userId } = auth();
  if (!userId) return Response.redirect(loginUrl, 302);

  // ── Layer 2: autenticado pero sin invitación → /acceso-restringido ─
  try {
    const user  = await clerkClient(context).users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
    if (!email) return Response.redirect(blockedUrl, 302);

    // Fast path: si ya verificamos antes, hay flag en metadata → permitir
    if (user.publicMetadata?.flouvia_invited === true) return;

    // Slow path: chequear invitaciones aceptadas en Clerk para este email
    const list = await clerkClient(context).invitations.getInvitationList({
      status: 'accepted',
      query:  email,
    });
    const matched = list.data?.some(
      (inv) => inv.emailAddress?.toLowerCase() === email,
    );

    if (!matched) return Response.redirect(blockedUrl, 302);

    // Marcar como verificado para evitar la llamada en futuras requests
    await clerkClient(context).users.updateUserMetadata(userId, {
      publicMetadata: { ...user.publicMetadata, flouvia_invited: true },
    });
  } catch (err) {
    console.error('[middleware] invitation check failed:', err);
    return Response.redirect(blockedUrl, 302);
  }
});

export const onRequest = sequence(cors, clerk);
