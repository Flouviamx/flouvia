// @ts-check
import { defineConfig } from 'astro/config';

import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk()]
});