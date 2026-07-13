# Contributing to Carapace

Thanks for helping improve the shared visual contract used across OpenClaw
sites and products.

By participating, you agree to follow the
[Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately as
described in [SECURITY.md](SECURITY.md).

## Before You Start

- Bugs and small contract fixes can go directly to a focused pull request.
- Discuss new components, breaking token changes, or large architecture changes
  in an issue first.
- Search existing issues and pull requests before opening a duplicate.
- Keep consumer-specific components and layouts in the consumer repository
  until at least two consumers share the same interface and behavior.

## Development Setup

Use the exact Bun version declared by the repository. Bun `1.3.0` is the
supported minimum and is checked separately in CI.

```bash
bun install --frozen-lockfile
bun run check
```

Use the smallest relevant command while iterating:

```bash
bun run test
bun run skills:check
bun run pack:check
```

Do not replace Bun, regenerate `bun.lock` with another package manager, or edit
release archives by hand.

## Pull Requests

- Keep one logical change per pull request.
- Use a conventional title such as `fix(tokens): preserve muted text contrast`.
- Explain the problem, the chosen solution, and affected consumers.
- Add or update tests for token, stylesheet, package, or skill contract changes.
- Update the relevant skill reference when a public design rule changes.
- Do not add fonts, logos, screenshots, or other restricted binary assets.
- Run `bun run check` and report the exact validation performed.
- Resolve addressed review conversations before requesting another review.

Tokens, themes, package exports, stylesheet ordering, skill names, and release
tags are public compatibility surfaces. Prefer additive changes and call out
deliberate breaks explicitly.

For non-trivial changes, run the repository autoreview helper before handoff:

```bash
.agents/skills/autoreview/scripts/autoreview
```

## Reporting Bugs

Use the bug report template and include:

- the exact release or commit
- the affected consumer and runtime
- a minimal reproduction
- expected and actual behavior
- relevant redacted CSS, screenshots, or audit output

Never include credentials, private hostnames, personal paths, or licensed
assets that cannot be redistributed.

## Release Process

Maintainers release from a stable `vX.Y.Z` tag. The tag must match
`package.json`, and the GitHub Actions release workflow publishes the package
archive. The package is distributed from GitHub and is not published to npm.
