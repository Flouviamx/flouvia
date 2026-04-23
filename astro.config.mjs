// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // En Astro 6, usamos 'server' para habilitar funciones dinámicas,
  // pero mantendremos tus páginas actuales como estáticas automáticamente.
  output: 'server',

  integrations: [clerk()],
  
  adapter: netlify({
    // Esto ayuda a Netlify a manejar mejor las funciones divididas
    edgeMiddleware: true 
  }),

  // Esto es opcional, pero le dice a Astro que sea agresivo 
  // con el renderizado estático donde pueda.
  build: {
    format: 'directory'
  }
});