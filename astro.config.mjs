// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import netlify from '@astrojs/netlify';

export default defineConfig({
  // Mantenemos server porque el portal es dinámico
  output: 'server',

  integrations: [clerk()],
  
  adapter: netlify({
    // CAMBIO CLAVE: Quitamos edgeMiddleware o lo ponemos en false
    // para que use Node.js estándar de Netlify.
    edgeMiddleware: false
  }),
});