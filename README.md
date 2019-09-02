# tangro-github-toolkit

A helper and wrapper around @actions/github to easily access GitHub features. It is meant to be used with GitHub Actions.

# Comments

## `GitHubContext`

An interface to access the `GitHubContext` you get by injecting the GitHubContext into your action.

> **ATTENTION** It is not complete. Add fields you need to the Context! For example there is no `event` field to access the event yet

## `createComment({ context: GitHubContext; comment: string })`

Create a comment on the _SHA_ retrieved from the `GitHubContext`.

## `setStatus({ context: GitHubContext; description?: string; step: string; target_url?: string; state: 'pending' | 'success' | 'failure'; })`

Set a status to the SHA from the `GitHubContext` Optionally add a `description` or `target_url`. The status' context will be `Tangro CI/${step}`.

## `getStatus({ context: GitHubContext; step: string })`

Try to find a status for the `GitHubContext` and with the status context `Tangro CI/${step}`.
