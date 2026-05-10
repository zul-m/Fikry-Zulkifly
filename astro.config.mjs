import { defineConfig } from 'astro/config';

// Static output — no adapter needed for Cloudflare Pages.
// To enable SSR (API routes, server functions), switch to:
//   output: 'server', adapter: cloudflare()  — then add @astrojs/cloudflare

export default defineConfig({
  output: 'static',
  // site: 'https://your-domain.com', // set when domain is decided
});
