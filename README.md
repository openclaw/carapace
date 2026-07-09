# OpenClaw Design System

Canonical web design tokens, shared CSS foundations, and agent guidance for
OpenClaw public sites and products.

The initial contract was extracted from `openclaw/openclaw.ai` at
`b94b43b24f728c902ebb4c09ca3f89aa21e4f1d5` and checked against
`openclaw/clawhub` at `0e898b1dfd309728a031416cd57fa1262af0d064` and
`openclaw/docs` at `2a10e88b244232f9a91d7c9a97f2816297eb2eb4`.
This repository became canonical with `v0.0.1`. Latest tagged release:
`v0.0.1`.

## Install

Install an immutable GitHub release without publishing to npm:

```bash
bun add "git+https://github.com/openclaw/design-system.git#v0.0.1"
```

The package is distributed through immutable Git tags rather than npm. Its
`private` package field prevents accidental npm publication; it does not limit
access to this public repository.

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

Install the root router from the tagged release:

```bash
npx skills add \
  "openclaw/design-system#v0.0.1" \
  --copy \
  --yes
```

Install the four focused skills from their tagged subdirectories:

```bash
for skill in \
  openclaw-brand \
  openclaw-design-system \
  openclaw-marketing-pages \
  openclaw-design-audit
do
  npx skills add \
    "https://github.com/openclaw/design-system/tree/v0.0.1/${skill}" \
    --copy \
    --yes
done
```

OpenClaw's native skill installer can install the root router from the same
immutable tag:

```bash
openclaw skills install \
  "git:openclaw/design-system@v0.0.1"
```

The root `openclaw-design` skill routes work to:

- `openclaw-brand`
- `openclaw-design-system`
- `openclaw-marketing-pages`
- `openclaw-design-audit`

Install the focused skills above when you want the router to hand work off by
skill name.

## Development

```bash
bun install
bun run check
```

Runtime assets and skill guidance ship under one semantic Git tag and GitHub
Release. A release tag must match the version in `package.json`.

Font binaries, logos, mascot artwork, and site-specific media are not included.
Consumers must load licensed assets locally.
