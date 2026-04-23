// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // 1. Esto le dice a Astro: "Todo es estático (rápido), 
  // EXCEPTO el portal que es dinámico (seguro)".
  output: 'hybrid',

  integrations: [clerk()],
  
  // 2. Conecta el cerebro de Netlify
  adapter: netlify()
});