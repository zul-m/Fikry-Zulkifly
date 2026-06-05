# Fikry Zulkifly - Project Preferences

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

## Naming

- **English only for all code identifiers** — class names, IDs, data attributes, CSS custom properties, JS variables, and file names must be in English, even though the site content and copy are in Malay. Never use Malay (or any other language) words as identifiers.

## Sanity Studio

- **Malay for all display labels** — Sanity schema `title` fields and option `title` values shown in the Studio UI must be in Malay (e.g. `"Tajuk"`, `"Jenis Hartanah"`).
- Code identifiers (`name`, `value`, `type`) remain in English as usual.

### Amenity icons

Icons are sourced from [Lucide](https://lucide.dev). The `value` of each amenity entry is the kebab-case Lucide icon name (e.g. `"goal"`, `"dumbbell"`). The same string is used in three places that must stay in sync:

| File | Role |
|---|---|
| `src/sanity/constants.ts` → `AMENITY_ICON_OPTIONS` | Single source of truth. Defines `{ title, value }` pairs. `title` is the Malay label shown in Studio; `value` is the kebab-case Lucide icon name. |
| `src/pages/beli/[slug].astro` → `AMENITY_ICON_MAP` | Maps each `value` string to its `@lucide/astro` component for rendering on the frontend. |
| `src/sanity/components/AmenityIconInput.tsx` | Custom Studio picker. Converts each `value` to PascalCase to look up the icon from `lucide-react`. Greys out icons already assigned to another amenity document. |

**How to add a new amenity icon:**

1. Confirm the icon exists in both `lucide-react` and `@lucide/astro` — they share the same set, but both packages must be checked since the icon may lag between releases.
2. Add `{ title: "Nama Malay", value: "kebab-icon-name" }` to `AMENITY_ICON_OPTIONS` in `src/sanity/constants.ts`.
3. Import the PascalCase component from `@lucide/astro` in `src/pages/beli/[slug].astro` and add it to `AMENITY_ICON_MAP`.

**Why amenities go missing on the slug page:** if `value` in `AMENITY_ICON_MAP` doesn't match what's stored in Sanity, the mapping returns `undefined` and the amenity is silently filtered out. Always keep `AMENITY_ICON_MAP` in sync with `AMENITY_ICON_OPTIONS`.

## Design System

- All spacing, typography, color, and layout values come from `src/styles/global.css` tokens.
- Fluid values use the viewport range `20rem (320px) → 90rem (1440px)`.
- Do not introduce one-off values when a token already covers the intent.
- **Component tokens stay in the component** — don't add tokens to `global.css` for component-specific styling. Reference existing global tokens (e.g. `var(--color-dark-800)`) directly in the component's `<style>` block. Only add to `global.css` when a value is genuinely shared across multiple components or pages.
