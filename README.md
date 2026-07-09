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

Install all five project skills from the repository's moving default branch:

```bash
npx skills@1.5.15 add \
  "openclaw/design-system" \
  --skill \
    openclaw-design \
    openclaw-brand \
    openclaw-design-system \
    openclaw-marketing-pages \
    openclaw-design-audit \
  --agent codex \
  --copy \
  --yes
```

Refresh every project skill recorded in `skills-lock.json`, including these
design skills, with the standard updater:

```bash
npx skills@1.5.15 update --project --yes
```

The `openclaw-design` router skill routes work to:

- `openclaw-brand`
- `openclaw-design-system`
- `openclaw-marketing-pages`
- `openclaw-design-audit`

All five skills live in sibling top-level directories so the skills CLI can
discover and update the complete set without repository-specific flags.

## Development

```bash
bun install
bun run check
```

Runtime assets ship under a semantic Git tag and GitHub Release. A release tag
must match the version in `package.json`. Agent guidance follows the repository
default branch so consumer repositories can use the standard skills updater.

Font binaries, logos, mascot artwork, and site-specific media are not included.
Consumers must load licensed assets locally.

## Preview

Run the design-system reference surface locally:

```bash
bun run preview:dev
```

Build the static preview:

```bash
bun run preview:build
```

The Pages workflow is ready for `https://openclaw.github.io/design-system/`.
Public deployment remains deferred while organization policy keeps this
repository private.
