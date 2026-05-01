import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher([
  '/portal/dashboard(.*)',
  '/portal/facturacion(.*)',
  '/portal/boveda(.*)',
  '/portal/soporte(.*)',
  '/portal/roadmap(.*)',
  '/portal/calendario(.*)',
]);

export const onRequest = clerkMiddleware((auth, context) => {
  if (isProtectedRoute(context.request) && !auth().userId) {
    // Redirigimos a /login (no a /portal/login) para que el rewrite de Vercel
    // lo mapee correctamente en os.flouvia.com/login → /portal/login
    const loginUrl = new URL('/login', context.request.url);
    return Response.redirect(loginUrl.href, 302);
  }
});
