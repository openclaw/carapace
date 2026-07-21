# Carapace

Carapace is the shared visual foundation for OpenClaw public sites and
products: canonical tokens, CSS foundations, and agent guidance.

A carapace is the protective outer shell of a crustacean. The name fits this
project because it gives OpenClaw products a consistent, durable surface while
the applications beneath it keep their own behavior.

The initial contract was extracted from `openclaw/openclaw.ai` at
`b94b43b24f728c902ebb4c09ca3f89aa21e4f1d5` and checked against
`openclaw/clawhub` at `0e898b1dfd309728a031416cd57fa1262af0d064` and
`openclaw/docs` at `2a10e88b244232f9a91d7c9a97f2816297eb2eb4`.
This repository became canonical with `v0.0.1`. The Carapace name and package
begin with `v0.1.0`. Latest tagged release: `v0.1.0`.

## Install

Install an immutable GitHub release without publishing to npm:

```bash
bun add "git+https://github.com/openclaw/carapace.git#v0.1.0"
```

The package is distributed through immutable Git tags rather than npm. Its
`private` package field prevents accidental npm publication; it does not limit
access to this public repository.

Import the complete CSS contract:

```css
@import "@openclaw/carapace";
```

Consumers can instead import focused entry points:

```css
@import "@openclaw/carapace/tokens.css";
@import "@openclaw/carapace/themes.css";
@import "@openclaw/carapace/typography.css";
@import "@openclaw/carapace/base.css";
@import "@openclaw/carapace/components.css";
@import "@openclaw/carapace/themes/product.css";
@import "@openclaw/carapace/candidate/controls.css";
@import "@openclaw/carapace/candidate/feedback.css";
@import "@openclaw/carapace/candidate/data.css";
@import "@openclaw/carapace/candidate/application.css";
@import "@openclaw/carapace/compat/clawhub.css";
@import "@openclaw/carapace/tailwind.css";
```

The Tailwind entry point only maps canonical custom properties into Tailwind
4. Applications continue to own their components and product-specific layout.
The product theme and ClawHub compatibility entry points are transitional,
opt-in adapters rather than a second shared visual layer.

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

Candidate entry points are additive and opt-in. They are excluded from both
`components.css` and the complete default import until their selectors and
behavior have been validated in multiple consumers. Preview-only Lab work is
not included in package exports.

The candidate application entry point supplies shared shell, page-header, pane,
settings, and status anatomy. It composes existing Carapace controls while
leaving routes, data, persistence, native window behavior, and framework state
inside each consumer.

OpenClaw surfaces and controls default to a Kumo-aligned radius profile
(`surface`/`control` = `--oc-radius-md` / 8px, `inset` = `--oc-radius-sm` / 4px).
Use the semantic `--oc-radius-surface`, `--oc-radius-control`, and
`--oc-radius-inset` roles instead of choosing from the raw radius scale.
Reserve `--oc-radius-round` for genuinely circular avatars, status dots, and
similar indicators.

## Skills

Install all five project skills from the repository's moving default branch:

```bash
npx skills@1.5.16 add \
  "openclaw/carapace" \
  --skill \
    openclaw-design \
    openclaw-brand \
    openclaw-carapace \
    openclaw-marketing-pages \
    openclaw-design-audit \
  --agent codex \
  --copy \
  --yes
```

Refresh every project skill recorded in `skills-lock.json`, including these
design skills, with the standard updater:

```bash
npx skills@1.5.16 update --project --yes
```

The `openclaw-design` router skill routes work to:

- `openclaw-brand`
- `openclaw-carapace`
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

Run Carapace reference surface locally:

```bash
bun run preview:dev
```

Build the static preview:

```bash
bun run preview:build
```

The Pages workflow publishes the preview at `https://carapace.design/`.
The Applications area contains interactive settings, operations, and workspace
screens with theme and viewport controls.
