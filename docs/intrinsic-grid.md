# Intrinsic Grid Sizing

A technique for multi-column layouts that adapts to the **available container space** rather than the viewport width. The column count is derived from how much room actually exists, so the same component works correctly in a sidebar, a card, or full-width without extra breakpoints.

---

## The pattern

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(Xrem, 100%), 1fr));
  gap: var(--space-2) var(--space-4);
}
```

| Part | What it does |
|---|---|
| `repeat(auto-fill, ...)` | Pack as many columns as fit; never overflow |
| `minmax(X, 1fr)` | Each column is at least `X` wide, grows to fill leftover space |
| `min(Xrem, 100%)` | Overflow guard — if the container is narrower than `X`, the column collapses to `100%` (one full-width column) instead of overflowing |

### How many columns appear

The browser solves this at render time without any JavaScript:

```
columns = floor((container_width + gap) / (X + gap))
```

- Container ≥ `2X + 1 gap` → 2 columns
- Container ≥ `3X + 2 gaps` → 3 columns
- Container < `X` → 1 column (due to the `min(..., 100%)` guard)

---

## Choosing X

`X` is the **minimum column width at which content fits without text wrapping**.

Estimate it by adding up the elements in one item:

```
X = icon_width + icon_gap + longest_label_width + breathing_room
```

For example, the amenity list in `src/pages/beli/[slug].astro`:

| Element | Width |
|---|---|
| Icon (16px) | 1rem |
| Gap between icon and text | 0.5rem |
| "Kawasan barbeku" at body font | ~8.1rem |
| Breathing room | ~3rem |
| **Total → X** | **~13rem** |

At `X = 13rem`, two columns need `2 × 13 + 1 gap ≈ 27rem` of container width. Three columns would need `41rem` — wider than any realistic cell in this layout, so three columns never appear.

---

## Versus viewport media queries

| | Viewport query | Intrinsic grid |
|---|---|---|
| Responds to | Viewport width | Container width |
| Works in a sidebar | No — same breakpoint fires regardless | Yes — fewer columns automatically |
| Works full-width | Yes | Yes |
| Extra breakpoints needed | One per layout context | None |
| Text wrapping risk | High if column is too narrow | Low — X encodes the minimum safe width |

---

## When to use each approach

Use **intrinsic grid** when the goal is to fit as many columns as possible without content wrapping — card grids, tag lists, icon-label lists.

Use **`@media` or `@container` queries** for everything else:

- Hiding or showing elements at a specific size
- Flipping `flex-direction` (row ↔ column)
- Typography scaling
- Any layout change that isn't a column-count adjustment

---

## Real example in this project

`src/styles/beli-item.css` — amenity list inside the info table:

```css
.amenity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(13rem, 100%), 1fr));
  gap: var(--space-2) var(--space-4);
  width: 100%;          /* required when the parent is a flex container */
  margin: 0;
  padding: 0;
  list-style: none;
}
```

`width: 100%` is needed here because `.cell` is `display: flex` — without it the grid container shrinks to content width and `auto-fill` has almost no room to work with.

---

## Gotchas

**Parent is `display: flex`** — flex items size to content by default. Add `width: 100%` to the grid so `auto-fill` measures the full available width.

**Percentage inside `minmax`** — `100%` in `min(Xrem, 100%)` resolves against the grid container's inline size, which must be determined (not `auto`). If the container has no explicit width and no `width: 100%`, the percentage may not resolve correctly.

**`auto-fill` vs `auto-fit`** — both work here. `auto-fill` keeps empty tracks; `auto-fit` collapses them. For lists of known items with `1fr` growth, the visual result is the same.
