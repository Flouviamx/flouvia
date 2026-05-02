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
    const loginUrl = isEnglish
      ? 'https://os.flouvia.com/en/login'
      : 'https://os.flouvia.com/login';
    return Response.redirect(loginUrl, 302);
  }
});
