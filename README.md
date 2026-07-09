# OpenClaw Design System

Canonical web design tokens, shared CSS foundations, and agent guidance for
OpenClaw public sites and products.

The initial contract was extracted from `openclaw/openclaw.ai` at
`b94b43b24f728c902ebb4c09ca3f89aa21e4f1d5` and checked against
`openclaw/clawhub` at `0e898b1dfd309728a031416cd57fa1262af0d064` and
`openclaw/docs` at `2a10e88b244232f9a91d7c9a97f2816297eb2eb4`.
This repository became canonical with `v0.0.1`. Current development version:
`v0.0.4`.

## Install

Install an immutable GitHub release without publishing to npm:

```bash
bun add "git+ssh://git@github.com/openclaw/design-system.git#v0.0.4"
```

The repository is private during initial rollout, so package installation
requires GitHub SSH access. Consumer CI will also require a credential that can
read this repository until it becomes public.

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
@import "@openclaw/design-system/components.css";
@import "@openclaw/design-system/themes/product.css";
@import "@openclaw/design-system/compat/clawhub.css";
@import "@openclaw/design-system/tailwind.css";
```

The Tailwind entry point only maps canonical custom properties into Tailwind
4. Applications continue to own their components and product-specific layout.
The product theme and ClawHub compatibility entry points are transitional,
opt-in adapters rather than a second design system.

`components.css` provides framework-neutral primitives for shared heroes,
section headings, cards, actions, pills, and segmented controls. Consumers keep
their own content and behavior while composing the same visual implementation:

```html
<section class="oc-section">
  <header class="oc-section-header">
    <div class="oc-section-heading">
      <p class="oc-eyebrow">Featured</p>
      <h2 class="oc-section-title">Build with OpenClaw</h2>
      <p class="oc-section-copy">Shared copy and surface styling across products.</p>
    </div>
    <a class="oc-action oc-action-secondary" href="/skills">Browse skills</a>
  </header>
</section>
```

OpenClaw surfaces and controls use square corners by default. Use the semantic
`--oc-radius-surface`, `--oc-radius-control`, and `--oc-radius-inset` roles
instead of choosing from the raw radius scale. Reserve `--oc-radius-round` for
genuinely circular avatars, status dots, and similar indicators.

## Skills

Install the root router and focused design skills from the same release:

```bash
npx skills add \
  "git@github.com:openclaw/design-system.git#v0.0.4" \
  --copy \
  --yes
```

OpenClaw's native skill installer can use the same immutable tag:

```bash
openclaw skills install \
  "git:ssh://git@github.com/openclaw/design-system.git@v0.0.4"
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
