import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

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

// Paths that should NOT be rewritten on os.flouvia.com
const SKIP_REWRITE = new Set(['login', 'en', '_astro', 'api', 'imgs', 'fonts', 'favicon.ico', 'favicon-light.svg', 'robots.txt', 'sitemap.xml', 'sitemap-index.xml']);

export const onRequest = clerkMiddleware((auth, context) => {
  const url = new URL(context.request.url);
  const host = url.hostname;
  const pathname = url.pathname;
  const isEnglish = pathname.startsWith('/en/');

  // ── os.flouvia.com: clean URL rewriting ──────────────────────────────
  if (host === 'os.flouvia.com') {
    // Already at a portal path or login or static asset → skip rewrite
    const firstSegment = pathname.split('/')[1] || '';
    const alreadyPortal = pathname.startsWith('/portal/') || pathname.startsWith('/en/portal/');
    const isLoginPath = pathname === '/login' || pathname === '/en/login' || pathname.startsWith('/login/') || pathname.startsWith('/en/login/');
    const skipRewrite = alreadyPortal || isLoginPath || SKIP_REWRITE.has(firstSegment);

    if (!skipRewrite) {
      if (pathname === '/') {
        return context.rewrite('/portal/dashboard');
      }
      if (pathname === '/en' || pathname === '/en/') {
        return context.rewrite('/en/portal/dashboard');
      }
      if (pathname.startsWith('/en/')) {
        const sub = pathname.slice(4); // strip /en/
        if (sub) return context.rewrite(`/en/portal/${sub}`);
      } else {
        return context.rewrite(`/portal${pathname}`);
      }
    }
  }

  // ── Auth protection ──────────────────────────────────────────────────
  if (isProtectedRoute(context.request) && !auth().userId) {
    const loginUrl = isEnglish
      ? 'https://os.flouvia.com/en/login'
      : 'https://os.flouvia.com/login';
    return Response.redirect(loginUrl, 302);
  }
});
