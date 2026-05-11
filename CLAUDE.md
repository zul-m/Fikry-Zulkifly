# Fikry Zulkifly — Project Preferences

## CSS

- **No `px` units** except for SVG dimensions. Use `rem` everywhere else — convert with `value ÷ 16`.
- **Use global tokens first** (`var(--space-*)`, `var(--border-width-main)`, `var(--font-size-*)`, etc.) before writing raw `rem` values.
- **`--border-width-main`** is the token for hairline/1px-equivalent lines (borders, decorative bars).
- **`rem` media queries** — breakpoints in `rem`, not `px` (e.g. `51.25rem` not `820px`).

## Design System

- All spacing, typography, color, and layout values come from `src/styles/global.css` tokens.
- Fluid values use the viewport range `20rem (320px) → 90rem (1440px)`.
- Do not introduce one-off values when a token already covers the intent.
