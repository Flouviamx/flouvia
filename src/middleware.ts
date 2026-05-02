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
    // El login vive ÚNICAMENTE en flouvia.com/login.
    // Si el usuario está en os.flouvia.com sin sesión, lo mandamos al
    // dominio público con dominio absoluto (cookie de Clerk se setea en
    // .flouvia.com y aplica a ambos subdominios).
    const url = new URL(context.request.url);
    const isEnglish = url.pathname.startsWith('/en/');
    const loginUrl = isEnglish
      ? 'https://flouvia.com/en/login'
      : 'https://flouvia.com/login';
    return Response.redirect(loginUrl, 302);
  }
});
