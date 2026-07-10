# Repository Guidelines

## Scope

This repository owns the canonical OpenClaw web design contract:

- framework-neutral CSS tokens and themes
- a thin Tailwind 4 token adapter
- shared base behavior proven across consumers
- agent skills that explain how to use and audit the system

Consumer-specific components, routes, and layouts stay in their repositories
until at least two consumers share the same interface and behavior.

## Commands

- `bun install` - install development dependencies.
- `bun run test` - parse CSS and verify token/theme contracts.
- `bun run skills:check` - validate skill metadata and references.
- `bun run pack:check` - verify package exports and packed contents.
- `bun run check` - run all validation.

## Release

- Use Conventional Commits.
- Release tags are stable semantic versions: `vX.Y.Z`.
- The tag must match `package.json`.
- Runtime assets release under semantic tags; agent skills update from `main`.
- npm publication is not required; consumers install the Git tag.
