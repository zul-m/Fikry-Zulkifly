# Fikry Zulkifly

Real-estate listings website (property sales & sublets) built with [Astro](https://astro.build) and
[Sanity](https://www.sanity.io), deployed to Cloudflare.

## Tech stack

- **Astro** — static site generator, `output: 'static'` (fully pre-rendered, no SSR)
- **Sanity** — headless CMS for property listings, deployed as its own Studio
- **React** — used for a few interactive Sanity Studio input components
- **Cloudflare Pages** (main site) + **Cloudflare Workers** (Sanity Studio) — see [docs/architecture.md](docs/architecture.md)

## Project structure

```
src/
  components/    Reusable Astro components (inline <style>/<script>)
  layouts/       Shared page layout
  pages/         Routes — one .css file per page in src/styles/, no <style> blocks here
  sanity/        Sanity schema types, Studio input components, image helpers
  scripts/       Scripts shared across multiple components/pages
  styles/        Per-page CSS + global.css design tokens
docs/            Deep-dive docs (architecture, calculators, image uploads, etc.)
```

See [AGENTS.md](AGENTS.md) for coding conventions (CSS/token rules, naming, file structure, security notes) that apply to any agent or contributor working in this repo.

## Getting started

```bash
npm install
npm run dev           # Astro dev server
npm run dev:studio    # Sanity Studio dev server
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Astro dev server |
| `npm run dev:studio` | Start the Sanity Studio dev server |
| `npm run build` | Build the static site |
| `npm run build:studio` | Build the Sanity Studio for deployment |
| `npm run deploy:studio` | Build + deploy the Studio to Cloudflare Workers |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run `astro check` (type/diagnostics check) |

## Deployment

- **Main website** — Cloudflare Pages, git-connected, auto-builds on push to `main`
- **Sanity Studio** — Cloudflare Workers, deployed manually via `npm run deploy:studio`

Publishing a document in Sanity Studio triggers a Cloudflare deploy hook that rebuilds and redeploys the main site. Full details in [docs/architecture.md](docs/architecture.md).

## Docs

- [docs/architecture.md](docs/architecture.md) — infrastructure & content publishing flow
- [docs/intrinsic-grid.md](docs/intrinsic-grid.md) — intrinsic grid sizing pattern used across layouts
- [docs/monthly-payment-calculator.md](docs/monthly-payment-calculator.md) — mortgage calculator logic
- [docs/uploading-property-images.md](docs/uploading-property-images.md) — image upload guidance for Studio editors

