---
name: commit
description: 'Review changes, create a feature branch, commit, and push after the required pre-commit checks pass.'
---

# Commit

Proceed directly to create a git commit without asking for confirmation. Follow the standard commit process:

1. Run `git status`, `git diff`, and `git branch --show-current` in parallel to review all changes and identify the current branch.
2. Run `git log --oneline -5` to match the repo's commit message style.
3. Choose a concise branch name from the change, using `<type>/<kebab-case-description>` (for example, `fix/mobile-nav-spacing`, `feat/property-filters`, or `chore/agent-workflows`).
4. If the current branch is `main` or `master`, create and switch to the new branch with `git switch -c <branch-name>`. If already on a non-default branch, keep it and use it for this commit. Never overwrite an existing branch; choose a unique suffix if necessary.
5. Stage relevant files.
6. **Full pre-commit review** — review `git diff --cached` using the complete review checklist in [code-review](../code-review/SKILL.md), with [AGENTS.md](../../../AGENTS.md) as the project convention source. Check correctness, security, CSS/design-system rules, file structure, naming, reuse, and Sanity contracts. Include untracked files that are about to be staged. Report findings ranked by severity with file paths and line numbers.
7. If any confirmed Critical or High finding remains, stop and report it instead of committing. Apply only unambiguous fixes if the user asked for fixes; otherwise leave the working tree unchanged. Medium and Low findings must be reported, but do not block the commit unless they indicate a concrete regression.
8. Run `npm run check` before committing. Stop if it fails.
9. Create the commit with a concise subject that matches the repository's existing style.
10. Push the new branch and set its upstream with `git push -u origin <branch-name>`.
11. Run `git status` after the push and report the branch name, commit hash, and remote branch URL if available.

Do not ask the user to confirm before branching, committing, or pushing. Do not force-push, delete branches, or modify remote history.
