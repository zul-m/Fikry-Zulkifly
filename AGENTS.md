# Agent Notes

Project conventions and learned facts for any coding agent (Copilot, Claude Code, etc.)
working in this repo.

## CSS

- **Mobile-first** — write base styles for the smallest screen first, then layer larger breakpoints with `min-width` queries.
- **No `px` units** except for SVG dimensions. Use `rem` everywhere else — convert with `value ÷ 16`.
- **Use global tokens first** (`var(--space-*)`, `var(--border-width-main)`, `var(--font-size-*)`, etc.) before writing raw `rem` values.
- **`--border-width-main`** is the token for hairline/1px-equivalent lines (borders, decorative bars).
- **`rem` media queries** — breakpoints in `rem`, not `px` (e.g. `51.25rem` not `820px`).
- **Smallest viewport is `20rem` (320px)** — always verify that layout, typography, and spacing hold at that width before scaling up.
- **Intrinsic grid sizing over viewport breakpoints** — for multi-column grids, prefer `repeat(auto-fill, minmax(min(Xrem, 100%), 1fr))` over media queries. The column count adapts to available container space, not the viewport, so the same component works correctly in a sidebar, a card, or full-width without extra breakpoints. Choose `X` as the minimum column width at which content fits without wrapping. Use media/container queries only when the change is not a column-count adjustment (e.g. `flex-direction`, visibility, typography).

## File Structure

- **Pages → separate CSS file** — never use `<style>` blocks in page files (e.g. `src/pages/beli.astro`). Put page CSS in `src/styles/beli.css` and import it in the frontmatter with `import '@styles/beli.css'`. One CSS file per page, named to match.
- **Components → inline `<style>`** — component styles live in a `<style>` block inside the `.astro` file, keeping markup and styles co-located in a single self-contained file.
- **Components → inline `<script>`** — component-specific scripts live inline in the `.astro` file alongside markup and styles. Only extract to `src/scripts/` when a script is genuinely shared across multiple components or pages, or is large enough to clutter the component file.

## Sanity Studio

- **Malay for all display labels** — Sanity schema `title` fields and option `title` values shown in the Studio UI must be in Malay (e.g. `"Tajuk"`, `"Jenis Hartanah"`).
- Code identifiers (`name`, `value`, `type`) remain in English as usual.

### Amenity icons

Icons are sourced from [Lucide](https://lucide.dev). The `value` of each amenity entry is the kebab-case Lucide icon name (e.g. `"goal"`, `"dumbbell"`). The same string is used in two places that must stay in sync:

| File | Role |
|---|---|
| `src/sanity/constants.ts` → `AMENITY_ICON_OPTIONS` | Single source of truth. Defines `{ title, value }` pairs. `title` is the Malay label shown in Studio; `value` is the kebab-case Lucide icon name. |
| `src/pages/beli/[slug].astro` → `AMENITY_ICON_MAP` | Maps each `value` string to its `@lucide/astro` component for rendering on the frontend. |

**How to add a new amenity icon:**

1. Confirm the icon exists in `@lucide/astro` — check the package before adding since icons occasionally lag behind the Lucide release.
2. Add `{ title: "Nama Malay", value: "kebab-icon-name" }` to `AMENITY_ICON_OPTIONS` in `src/sanity/constants.ts`.
3. Import the PascalCase component from `@lucide/astro` in `src/pages/beli/[slug].astro` and add it to `AMENITY_ICON_MAP`.

**Why amenities go missing on the slug page:** if `value` in `AMENITY_ICON_MAP` doesn't match what's stored in Sanity, the mapping returns `undefined` and the amenity is silently filtered out. Always keep `AMENITY_ICON_MAP` in sync with `AMENITY_ICON_OPTIONS`.

## Icons

- **Lucide first** — always use `@lucide/astro` components instead of inline `<svg>` elements. Before writing a raw SVG, verify the icon exists in the installed package (`node_modules/@lucide/astro/src/icons/`).
- Import PascalCase from `@lucide/astro` (e.g. `import { Clock, MoveRight } from '@lucide/astro'`) and render with `<Clock size={20} aria-hidden="true" />`.
- Only fall back to an inline `<svg>` if the icon genuinely does not exist in `@lucide/astro`.

## Design System

- All spacing, typography, color, and layout values come from `src/styles/global.css` tokens.
- Fluid values use the viewport range `20rem (320px) → 90rem (1440px)`.
- Do not introduce one-off values when a token already covers the intent.
- **Shared utility classes → global.css** — when the same structural CSS block appears (or would appear) on multiple pages, extract it to `global.css` as a utility class rather than duplicating it with page-scoped prefixes. Page-specific overrides (e.g. color) stay in the page CSS file. Example: `.eyebrow` / `.eyebrow-bar` structure lives in `global.css`; each page only adds `color`. Before writing a new prefixed class (e.g. `.sublet-eyebrow`), check `global.css` for an existing utility that covers the same pattern.

## CSS & Components

- **Component-specific styling stays in the component.** Don't add tokens to
  `global.css` for single-component use. Reference existing global tokens (e.g.
  `var(--color-dark-800)`) directly in the component's `<style>` block. Only add to
  `global.css` when a value is genuinely shared across multiple components/pages.

- **Font trim mechanism (`src/styles/global.css` ~line 651).** A `font trim`
  mechanism exists: `:is(h1, h2, h3, h4, h5, h6, p)::before/::after` pseudo-elements
  with `display: table` and `margin-bottom: calc(-0.5lh + var(--font-trim-top|bottom))`
  pull text up to remove half-leading space above cap-height. Tokens:
  `--font-trim-top: 0.34em`, `--font-trim-bottom: 0.39em`.

  Any non-heading/non-`<p>` element (e.g. a `<span>` numeral styled at a heading's
  font-size next to that heading) does NOT get this trim automatically — the
  selector list is exact tags only. Its text renders visibly lower than an
  adjacent trimmed heading at the same font-size/line-height, even with identical
  computed values — looks like a layout bug but isn't.

  Fix: replicate the same `::before`/`::after` trim rule scoped to the custom
  element's class, reusing the existing `--font-trim-top`/`--font-trim-bottom`
  tokens (don't invent new ones). Example: `src/styles/sublet.css` `.flow-k` (the
  "01"/"02"/"03" numerals beside `sublet-flow` card headings) needed this added.

## Naming

- **All code identifiers must be English-only** — class names, IDs, data
  attributes, CSS custom properties, JS/TS variables, and file names — even
  though site content/copy is in Malay. Malay is allowed only in visible content
  and Sanity Studio `title` labels, never as code identifiers.
  Example: `.buy` not `.beli`, `#contact` not `#hubungi`, `.listings` not `.senarai`.

## Security

- **`renderBlocks` in `src/pages/beli/[slug].astro`** is a hand-rolled Portable
  Text serializer whose output is passed directly to `set:html`, bypassing
  Astro's auto-escaping and rendering the string as raw HTML. `child.text` comes
  from Sanity (editor-controlled) — without escaping, a Sanity editor could type
  `<script>...</script>` as body text and it lands verbatim in every visitor's
  browser (stored XSS).

  Rule: any future field added to `renderBlocks` that originates from Sanity
  must be escaped before interpolation, in this exact order (`&` first, to avoid
  double-escaping):

  ```js
  let t = (someField ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  ```

  The HTML tags your own code wraps around it (`<strong>`, `<em>`, `<h2>`, etc.)
  are controlled strings and do NOT need escaping — only values sourced from
  Sanity do. This is a convention, not a guarantee: every new addition to
  `renderBlocks` is a new escape obligation. If the function grows significantly,
  consider replacing it with `@portabletext/to-html`, which escapes structurally.

## Git & Releases

- **Always draft hand-crafted release notes when suggesting a git tag.** The
  user dislikes GitHub's default auto-generated release notes. Include a
  one-line summary + bullet list of notable user-facing changes (not a raw
  commit log), then a `---` divider, then GitHub's auto-generated PR list, then
  the **Full Changelog** line. Prepend to GitHub's output — don't replace it.
