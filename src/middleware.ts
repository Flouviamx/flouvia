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

export const onRequest = clerkMiddleware((auth, context) => {
  if (isProtectedRoute(context.request) && !auth().userId) {
    const url = new URL(context.request.url);
    const isEnglish = url.pathname.startsWith('/en/');
    const blockedUrl = isEnglish
      ? `${url.origin}/en/portal/access-denied`
      : `${url.origin}/portal/acceso-restringido`;
    return Response.redirect(blockedUrl, 302);
  }
});
