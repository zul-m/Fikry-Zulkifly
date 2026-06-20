Check all dependencies in this repository for available updates and security advisories, then report results as GitHub issues.

## Step 1 — Verify GitHub token

Check that GITHUB_TOKEN is set and can create issues:

```sh
curl -s -o /dev/null -w "%{http_code}" \
  -X POST "https://api.github.com/repos/zul-m/Fikry-Zulkifly/issues" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d '{"title":"__token_check__","body":"token check"}'
```

If this returns 201, close that test issue immediately and proceed. If it returns anything else, note the failure and skip Steps 3–4 (still run the audit and report in session output).

## Step 2 — Dependency audit

Run:
- `npm outdated` — packages behind their latest
- `npm audit --package-lock-only` — security advisories against the lockfile

For each outdated dependency collect:
1. Current locked version vs latest version
2. Update type — major, minor, or patch
3. Security advisories — advisory ID (GHSA-*), severity, brief description
4. Whether the fix is within the existing semver range or requires a `package.json` change

Group results by severity: HIGH → MODERATE → LOW → major upgrades → routine drift.

If everything is up to date and there are no advisories, stop here and do not create any issues.

## Step 3 — Create GitHub issues

Create a **parent issue** and **sub-issues** using curl with `$GITHUB_TOKEN` (not the MCP GitHub tools, which use a different token).

### Parent issue

```sh
curl -s -X POST "https://api.github.com/repos/zul-m/Fikry-Zulkifly/issues" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d '{
    "title": "Dependency audit — YYYY-MM-DD",
    "labels": ["dependencies"],
    "body": "..."
  }'
```

Title format: `Dependency audit — YYYY-MM-DD` (use today's date).

Body: summary table with severity counts and status, plus a Notes section. Save the response `number` and `node_id`.

### Sub-issues

Create one sub-issue per distinct finding category. Typical categories:
- `[Security] <package> — N HIGH advisories` — one per affected direct dependency with HIGH advisories
- `[Security] N moderate advisories in <root cause>` — grouped by root package
- `[Upgrade] <package> vX → vY` — one per available major upgrade
- `[Maintenance] lockfile drift — patch/minor updates pending` — only if no security angle

Labels: `dependencies` on all; also `security` on security sub-issues.

Each sub-issue body should include: affected package + locked version, advisory IDs with links, fix command, and impact (production site vs dev tooling).

### Link sub-issues to parent

After creating each sub-issue, save its `id` field (not `number`) from the response, then:

```sh
curl -s -X POST "https://api.github.com/repos/zul-m/Fikry-Zulkifly/issues/{parent_number}/sub_issues" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d '{"sub_issue_id": {sub_issue_id}}'
```

## Step 4 — Attach to GitHub Project

Find the "Fikry Zulkifly Website" project ID:

```sh
curl -s -X POST "https://api.github.com/graphql" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ user(login: \"zul-m\") { projectsV2(first: 20) { nodes { id title } } } }"}'
```

Then add every issue created (parent + all sub-issues) to the project using the `node_id` from each issue creation response:

```sh
curl -s -X POST "https://api.github.com/graphql" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { addProjectV2ItemById(input: { projectId: \\\"{PROJECT_ID}\\\" contentId: \\\"{ISSUE_NODE_ID}\\\" }) { item { id } } }\"}"
```

## Step 5 — Summary

Output a brief end-of-run summary: how many issues were created, whether the project attachment succeeded, and what the single most important action is for the owner.
