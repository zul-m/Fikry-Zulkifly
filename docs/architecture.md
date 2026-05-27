# Architecture

## Infrastructure

Two separate Cloudflare deployments, both driven from the same GitHub repository.

```mermaid
graph TD
    GH["GitHub\n(repository)"]

    GH -->|"git-connected build"| MAIN["Cloudflare Pages\nfikryzulkifly.com\n(main website)"]
    GH -->|"wrangler deploy"| STUDIO["Cloudflare Workers\n(Sanity Studio)"]

    MAIN -->|"fetches content at build time"| SANITY[("Sanity\ndataset")]
    STUDIO -->|"reads / writes content"| SANITY
```

| Deployment | URL | Platform | How deployed |
|---|---|---|---|
| Main website | fikryzulkifly.com | Cloudflare Pages | Git-connected (auto-builds on push to `main`) |
| Sanity Studio | (internal URL) | Cloudflare Workers | `wrangler deploy` (manual) |

The main website is a **static site** — all pages are pre-rendered at build time using content fetched from Sanity. There is no runtime data fetching; the built HTML is served directly from Cloudflare's edge network.

---

## Content publishing flow

When a document is published in Sanity Studio, the main website automatically rebuilds and redeploys.

```mermaid
sequenceDiagram
    actor Editor
    participant Studio as Sanity Studio
    participant Sanity as Sanity API
    participant Hook as Cloudflare<br/>Deploy Hook
    participant CF as Cloudflare Pages<br/>Build Runner
    participant GH as GitHub
    participant CDN as Cloudflare Edge<br/>(fikryzulkifly.com)

    Editor->>Studio: Click Publish
    Studio->>Sanity: Promote draft → published document
    Sanity-->>Hook: POST webhook (newProject published)
    Hook->>CF: Queue new build
    CF->>GH: Clone main branch
    CF->>Sanity: Fetch all published content (astro build)
    CF->>CF: Run astro build → static HTML
    CF->>CDN: Deploy static files globally
    CDN-->>Editor: Updated site live (~2 min after publish)
```
