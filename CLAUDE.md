# Fikry Zulkifly - Project Preferences

## CSS

- **Mobile-first** — write base styles for the smallest screen first, then layer larger breakpoints with `min-width` queries.
- **No `px` units** except for SVG dimensions. Use `rem` everywhere else — convert with `value ÷ 16`.
- **Use global tokens first** (`var(--space-*)`, `var(--border-width-main)`, `var(--font-size-*)`, etc.) before writing raw `rem` values.
- **`--border-width-main`** is the token for hairline/1px-equivalent lines (borders, decorative bars).
- **`rem` media queries** — breakpoints in `rem`, not `px` (e.g. `51.25rem` not `820px`).
- **Smallest viewport is `20rem` (320px)** — always verify that layout, typography, and spacing hold at that width before scaling up.

## File Structure

- **Pages → separate CSS file** — never use `<style>` blocks in page files (e.g. `src/pages/beli.astro`). Put page CSS in `src/styles/beli.css` and import it in the frontmatter with `import '@styles/beli.css'`. One CSS file per page, named to match.
- **Components → inline `<style>`** — component styles live in a `<style>` block inside the `.astro` file, keeping markup and styles co-located in a single self-contained file.
- **Components → inline `<script>`** — component-specific scripts live inline in the `.astro` file alongside markup and styles. Only extract to `src/scripts/` when a script is genuinely shared across multiple components or pages, or is large enough to clutter the component file.

## Naming

- **English only for all code identifiers** — class names, IDs, data attributes, CSS custom properties, JS variables, and file names must be in English, even though the site content and copy are in Malay. Never use Malay (or any other language) words as identifiers.

## Sanity Studio

- **Malay for all display labels** — Sanity schema `title` fields and option `title` values shown in the Studio UI must be in Malay (e.g. `"Tajuk"`, `"Jenis Hartanah"`).
- Code identifiers (`name`, `value`, `type`) remain in English as usual.

## Design System

- All spacing, typography, color, and layout values come from `src/styles/global.css` tokens.
- Fluid values use the viewport range `20rem (320px) → 90rem (1440px)`.
- Do not introduce one-off values when a token already covers the intent.
