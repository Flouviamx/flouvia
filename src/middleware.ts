import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Definimos que cualquier ruta que empiece con /portal/dashboard es privada
const isDashboardRoute = createRouteMatcher(['/portal/dashboard(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {
  // Si alguien intenta entrar al dashboard sin sesión, lo mandamos al login de Clerk
  if (isDashboardRoute(context.request) && !auth().userId) {
    return auth().redirectToSignIn();
  }
});