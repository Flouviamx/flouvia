import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Toda ruta bajo /portal/ es zona privada — Flouvia OS
const isPortalRoute = createRouteMatcher(['/portal/(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {
  if (isPortalRoute(context.request) && !auth().userId) {
    return auth().redirectToSignIn();
  }
});
