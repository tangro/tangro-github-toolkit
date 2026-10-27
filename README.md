# tangro-github-toolkit

A helper and wrapper around `@actions/github` to access GitHub features from
GitHub Actions.

The package keeps its CommonJS entry point (`lib/index.js`). The build bundles
the ESM-only `@actions/github` dependency so existing `require` consumers can
continue to load the package. REST requests explicitly use GitHub API version
`2026-03-10`.

Pass a narrowly scoped token as the `GITHUB_TOKEN` environment variable. For
example, a workflow using commit statuses and deployments can grant:

```yaml
permissions:
  statuses: write
  deployments: write
```

Add `contents: write` for commit comments. Check-run updates use the Checks API,
whose write access is limited to GitHub Apps; provide a suitable GitHub App
installation token if you need to update check runs.

## `GitHubContext`

An interface for the context supplied by a GitHub Action.

## `createComment({ context: GitHubContext; comment: string })`

Create a commit comment on the SHA retrieved from the `GitHubContext`. This does
not create an issue or pull request conversation comment.

## `setStatus({ context: GitHubContext; description?: string; step: string; target_url?: string; state: 'pending' | 'success' | 'failure'; })`

Set a status on the SHA from the `GitHubContext`. Optionally add a `description`
or `target_url`. The status context is `Tangro CI/${step}`.

## `getStatus({ context: GitHubContext; step: string })`

Find a status for the `GitHubContext` with the status context
`Tangro CI/${step}`.

## `createSuccessfulDeployment({ context: GitHubContext, url: string, environment: string, description: string})`

Create a deployment and immediately set its status to `success`, including the
provided URL, environment, and description.
