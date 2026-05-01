import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Login queda fuera — el resto del portal es zona privada
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
    return auth().redirectToSignIn();
  }
});
