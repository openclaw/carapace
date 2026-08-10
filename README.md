# Carapace 🦀 — one shell, many surfaces

[![CI](https://img.shields.io/github/actions/workflow/status/openclaw/carapace/ci.yml?branch=main&style=flat-square&label=ci)](https://github.com/openclaw/carapace/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/v/release/openclaw/carapace?style=flat-square)](https://github.com/openclaw/carapace/releases/latest)
[![Bun](https://img.shields.io/badge/Bun-%E2%89%A51.3.0-fbf0df?style=flat-square&logo=bun&logoColor=black)](https://bun.sh/)
[![License](https://img.shields.io/github/license/openclaw/carapace?style=flat-square)](LICENSE)
[![Preview](https://img.shields.io/badge/preview-carapace.design-f5654a?style=flat-square)](https://carapace.design/)

Carapace is the shared visual foundation for OpenClaw public sites and products. It provides framework-neutral CSS tokens, themes, primitives, a Tailwind adapter, and agent guidance while each consumer retains its own behavior and layout.

```css
@import "@openclaw/carapace";
```

```html
<button class="oc-action oc-action-primary" type="button">Continue</button>
```

The package owns the visual contract; the consumer owns the product.

## Install

Carapace is distributed through immutable GitHub release tags, not npm. Install the current release with Bun:

```bash
bun add "git+https://github.com/openclaw/carapace.git#v0.6.2"
```

The package is public, but its `private` manifest field prevents accidental npm publication. Use the [latest release](https://github.com/openclaw/carapace/releases/latest) when updating the pinned tag.

## Quick start

Import the complete contract from your application stylesheet:

```css
/* app.css */
@import "@openclaw/carapace";
```

Bundle the stylesheet with Bun or your existing CSS-aware build tool:

```bash
bun build app.css --outdir=dist
```

Carapace defaults to its dark theme. Select the light theme on the document element when needed:

```html
<html data-theme="light">
```

## What Carapace owns

Carapace supplies semantic design tokens, light and dark themes, typography and base styles, and framework-neutral primitives such as sections, cards, actions, pills, and segmented controls. Product-specific routes, state, persistence, content, and layout composition stay in consumer repositories.

Candidate styles are additive and opt-in. They do not enter the complete default import until their selectors and behavior are proven across multiple consumers. Preview-only Lab styles are never package exports.

## Entry points

Use the complete import by default and choose a focused entry point when the consumer needs a narrower contract.

| Need | Entry point |
| --- | --- |
| Complete stable contract | `@openclaw/carapace` |
| Tokens and themes | `@openclaw/carapace/tokens.css`, `themes.css` |
| Typography and base styles | `@openclaw/carapace/typography.css`, `base.css` |
| Shared primitives | `@openclaw/carapace/components.css` |
| Tailwind 4 token mapping | `@openclaw/carapace/tailwind.css` |
| Opt-in candidate surfaces | `@openclaw/carapace/candidate/*.css` |

See the [package reference](docs/package-reference.md) for every exported entry point, candidate ownership boundaries, semantic radii, and asset policy.

## Agent guidance

The repository also contains skills for OpenClaw brand, product-interface, marketing-page, and design-audit work. Runtime CSS stays pinned to a release tag; agent guidance follows the default branch so the skills updater can refresh it.

See [Agent skills](docs/agent-skills.md) for installation and routing.

## Preview

The [Carapace reference surface](https://carapace.design/) shows the stable primitives and opt-in application, agent, embedded, and terminal surfaces.

Run it locally:

```bash
bun run preview:dev
```

## Development

Carapace requires Bun 1.3.0 or newer. Use the version pinned in `package.json` for normal development.

```bash
bun install --frozen-lockfile
bun run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution and compatibility rules.

## License

Carapace is available under the [MIT License](LICENSE).
