# OpenClaw Design System

Canonical web design tokens, shared CSS foundations, and agent guidance for
OpenClaw public sites and products.

The initial contract was extracted from `openclaw/openclaw.ai` at
`b94b43b24f728c902ebb4c09ca3f89aa21e4f1d5` and checked against
`openclaw/clawhub` at `0e898b1dfd309728a031416cd57fa1262af0d064` and
`openclaw/docs` at `2a10e88b244232f9a91d7c9a97f2816297eb2eb4`.
This repository becomes canonical once `v0.0.1` is released.

## Install

Install an immutable GitHub release without publishing to npm:

```bash
bun add github:openclaw/design-system#v0.0.1
```

Import the complete CSS contract:

```css
@import "@openclaw/design-system";
```

Consumers can instead import focused entry points:

```css
@import "@openclaw/design-system/tokens.css";
@import "@openclaw/design-system/themes.css";
@import "@openclaw/design-system/typography.css";
@import "@openclaw/design-system/base.css";
@import "@openclaw/design-system/themes/product.css";
@import "@openclaw/design-system/compat/clawhub.css";
@import "@openclaw/design-system/tailwind.css";
```

The Tailwind entry point only maps canonical custom properties into Tailwind
4. Applications continue to own their components and product-specific layout.
The product theme and ClawHub compatibility entry points are transitional,
opt-in adapters rather than a second design system.

## Skills

Install the root router and focused design skills from the same release:

```bash
npx skills add \
  "https://github.com/openclaw/design-system.git#v0.0.1" \
  --copy \
  --yes
```

OpenClaw's native skill installer can use the same immutable tag:

```bash
openclaw skills install git:openclaw/design-system@v0.0.1
```

The root `openclaw-design` skill routes work to:

- `openclaw-brand`
- `openclaw-design-system`
- `openclaw-marketing-pages`
- `openclaw-design-audit`

## Development

```bash
bun install
bun run check
```

Runtime assets and skill guidance ship under one semantic Git tag and GitHub
Release. A release tag must match the version in `package.json`.

Font binaries, logos, mascot artwork, and site-specific media are not included.
Consumers must load licensed assets locally.
