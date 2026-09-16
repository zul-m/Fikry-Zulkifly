---
name: code-review
description: 'Review the current branch diff for bugs, design-system violations, and AGENTS.md convention breaks, then optionally apply fixes or post inline PR comments. Use when the user asks to review a branch or PR before merging, e.g. "/code-review" or "/code-review --fix".'
argument-hint: '[--fix]'
---

# Code Review

Review the current branch diff for bugs, design-system violations, and project convention breaks (see the repository's `AGENTS.md`). Scope: everything changed or added since branching from main, plus any uncommitted working-tree changes.

If the user's message includes `--fix`, apply all CONFIRMED fixes directly to the working tree after producing findings (see Step 5).

---

## Step 1 — Gather the diff

Run these in parallel:

- `git diff main...HEAD` — committed changes on the branch
- `git diff HEAD` — uncommitted working-tree changes
- For untracked files listed in `git status`, read them directly (they are new pages/components not yet committed)

Treat all of the above as the review scope.

---

## Step 2 — Find candidates

Check every changed file across these angles. Surface up to 6 candidates per angle with `file`, `line`, `summary`, and `failure_scenario`. Use the same checklist for staged changes when this review is invoked by the commit skill.

### A — Correctness

Read every changed hunk and its enclosing function. Ask: what input, state, or timing makes this line wrong?

- Broken anchor `href="#..."` with no matching `id` on the page
- Missing `await`, wrong variable, inverted condition, off-by-one
- `set:html` with unescaped user-controlled input (XSS) — see `renderBlocks` pattern
- External `<a target="_blank">` missing `rel="noopener noreferrer"`
- Dead CTA or navigation that links to a section not yet written

### B — Design system & CSS

Check every changed `.css` file and every `<style>` block against these rules from AGENTS.md:

- **`px` units** — only allowed as SVG `width`/`height` attributes. Flag any `px` in CSS properties (margin, padding, font-size, border, gap, etc.)
- **Raw `rem` values** — flag any raw `rem` when a global token already covers that value. Check `src/styles/global.css` for `--space-*`, `--font-size-*`, `--color-*`, `--radius-*`, `--max-width-*` tokens
- **Media query units** — breakpoints must be in `rem`, not `px`
- **Mobile-first** — media queries must use `min-width`, not `max-width`
- **Intrinsic grids** — multi-column grids should use `repeat(auto-fill, minmax(min(Xrem, 100%), 1fr))` before reaching for breakpoints
- **Component tokens** — CSS custom properties (`--my-token: ...`) defined inside a component or page CSS file are fine; flag any that are added to `global.css` for single-component use only

### C — File structure

- Page files (`src/pages/**/*.astro`) must not contain a `<style>` block — styles belong in `src/styles/<page-name>.css`
- Component files (`src/components/**/*.astro`) must use an inline `<style>` block, not an external CSS file
- Component scripts belong inline unless shared across multiple files or over ~80 lines

### D — Naming

- Class names, IDs, `data-*` attributes, CSS custom properties (`--my-token`), JS/TS variable names, and file names must be English
- Malay words are allowed only in visible content/copy and Sanity `title` fields — never as code identifiers

### E — Reuse & duplication

- Compare new CSS classes against `src/styles/global.css` — flag classes that re-implement an existing utility or token
- Compare new components against `src/components/` — flag components that duplicate existing ones
- Flag copy-paste logic with slight variation that could share a helper

### F — Sanity (if schema files changed)

- New schema `title` fields shown in the Studio UI must be in Malay
- `name`, `value`, `type` identifiers must be English
- New amenity icon `value` strings must exist in both `AMENITY_ICON_OPTIONS` (constants.ts) and `AMENITY_ICON_MAP` (beli/[slug].astro)

---

## Step 3 — Verify

For each candidate: is it CONFIRMED (provable from the code), PLAUSIBLE (realistic, not ruled out), or REFUTED (factually wrong — quote the line)?

Drop REFUTED. Keep CONFIRMED and PLAUSIBLE.

---

## Step 4 — Output findings

List findings ranked most-severe first. For each:

- **Severity** — Critical / High / Medium / Low
- **File path + line number**
- **One-sentence description**
- **Concrete failure scenario** (what breaks, for whom, under what condition)
- **Suggested fix**

End with: total finding count by severity, and whether the diff is safe to merge.

---

## Step 5 — Apply fixes (only if `--fix` was requested)

For every CONFIRMED finding where a fix is unambiguous and safe (no behaviour change required, no missing content to write):

1. Edit the file directly to apply the fix
2. Note each fix applied with file + line

Skip findings that require new content, design decisions, or missing section IDs — list those as "needs manual fix".

### Post findings as inline PR comments (always, regardless of `--fix`)

Post each finding as an inline comment on the open GitHub PR:

1. Run `gh pr view --json number,headRefName` to get the PR number and latest commit SHA
2. Run `gh api repos/{owner}/{repo}/pulls/{pr}/commits` to get the latest commit SHA on the PR
3. For each finding, post via:
   ```
   gh api repos/{owner}/{repo}/pulls/{pr}/comments \
     --method POST \
     --field body="**{Severity}**: {summary}\n\n{failure_scenario}\n\n**Fix:** {suggested_fix}\n\n---\n🤖 *Posted by GitHub Copilot*" \
     --field commit_id="{sha}" \
     --field path="{file}" \
     --field line={line} \
     --field side="RIGHT"
   ```
4. Confirm each comment was posted successfully

If no open PR exists for the current branch, skip silently and note it in the output.
</content>
</invoke>
