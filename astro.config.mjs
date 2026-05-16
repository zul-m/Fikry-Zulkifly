import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// Static output — no adapter needed for Cloudflare Pages.
// To enable SSR (API routes, server functions), switch to:
//   output: 'server', adapter: cloudflare()  — then add @astrojs/cloudflare

export default defineConfig({
  output: 'static',
  // site: 'https://your-domain.com', // set when domain is decided
  integrations: [
    react(),
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET ?? 'production',
      useCdn: false,
      studioBasePath: env.STUDIO_PATH || '/login',
    }),
  ],
});
