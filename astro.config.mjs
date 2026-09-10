// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://flouvia.com',
  output: 'server',

  // Tailwind v4 vía plugin de Vite. La hoja (src/styles/tailwind.css) se carga
  // en Layout.astro en modo aditivo (sin Preflight) — ver ese archivo.
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [clerk({
    // Headless Clerk: Flouvia renders every auth surface itself.
    prefetchUI: false,
    signInUrl: '/login',
    signUpUrl: '/login',
    afterSignOutUrl: 'https://flouvia.com/',
  }), react()],

  adapter: vercel(),
});
