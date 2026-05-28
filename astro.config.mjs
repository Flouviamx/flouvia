// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://flouvia.com',
  output: 'server',

  integrations: [clerk({
    afterSignOutUrl: 'https://flouvia.com/',
  })],

  adapter: vercel(),
});