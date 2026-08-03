# Package reference

Carapace is a Git-only Bun package. Stable runtime assets ship under semantic Git tags and GitHub Releases; each tag must match the version in `package.json`. The `private` manifest field prevents publication to npm. Consumers should pin an immutable tag.

## Stable entry points

| Entry point | Contents |
| --- | --- |
| `@openclaw/carapace` | Complete stable CSS contract |
| `@openclaw/carapace/styles.css` | Alias for the complete stable CSS contract |
| `@openclaw/carapace/tokens.css` | Canonical palette, spacing, type, radius, shadow, and motion tokens |
| `@openclaw/carapace/themes.css` | Semantic light and dark theme roles |
| `@openclaw/carapace/themes/product.css` | Opt-in transitional product-theme adapter |
| `@openclaw/carapace/typography.css` | Shared type rules |
| `@openclaw/carapace/base.css` | Shared document foundations |
| `@openclaw/carapace/components.css` | Framework-neutral sections, headings, cards, actions, pills, and segmented controls |
| `@openclaw/carapace/tailwind.css` | Tailwind 4 mapping for canonical custom properties |
| `@openclaw/carapace/compat/clawhub.css` | Opt-in transitional ClawHub compatibility adapter |
| `@openclaw/carapace/charts.js` | Chart color and style helpers |

The Tailwind entry point maps tokens only. Components and product-specific layout remain in the consumer.

## Candidate entry points

Candidate entry points are additive and opt-in. They are excluded from `components.css` and the complete default import until their interface and behavior have been validated in multiple consumers.

| Entry point | Surface |
| --- | --- |
| `@openclaw/carapace/candidate/controls.css` | Shared form and control anatomy |
| `@openclaw/carapace/candidate/feedback.css` | Feedback and status patterns |
| `@openclaw/carapace/candidate/data.css` | Data presentation patterns |
| `@openclaw/carapace/candidate/application.css` | Navigation, panes, settings, chat, model controls, session tables, Quick Chat, status anatomy, split panes, logs, menus, option cards, command palettes, and collection indicators |
| `@openclaw/carapace/candidate/agent.css` | Approval prompts, tool parameters, payload disclosures, work groups, compaction markers, and transcript anatomy |
| `@openclaw/carapace/candidate/embed.css` | Host-resolved tokens and system font stacks for embedded surfaces such as MCP apps |

Application and agent styles compose the shared Carapace controls but do not own routes, data, persistence, native window behavior, or framework state. The embed entry point maps the MCP Apps style vocabulary into semantic tokens under `.oc-embed-tokens`; embedded surfaces inherit host surfaces, text, borders, and geometry while retaining their own content and identity.

Preview-only Lab work is not exported or included in packed releases.

## Semantic radii

OpenClaw surfaces and controls use the Kumo-aligned semantic roles:

| Role | Default |
| --- | --- |
| `--oc-radius-surface` | `--oc-radius-md` / 8px |
| `--oc-radius-control` | `--oc-radius-md` / 8px |
| `--oc-radius-inset` | `--oc-radius-sm` / 4px |

Use these semantic roles instead of choosing from the raw radius scale. Reserve `--oc-radius-round` for circular avatars, status dots, and similar indicators.

## Asset policy

Font binaries, logos, mascot artwork, and site-specific media are not part of the package. Consumers load licensed assets locally.

## Preview

The Pages workflow publishes the reference surface at `https://carapace.design/`. Its Applications area includes interactive settings, operations, workspace, Sessions, and Quick Chat screens with model, state, theme, and viewport controls.

Run the preview locally or build its static output:

```bash
bun run preview:dev
bun run preview:build
```

## Provenance

The initial contract was extracted from `openclaw/openclaw.ai` at commit `b94b43b24f728c902ebb4c09ca3f89aa21e4f1d5` and checked against `openclaw/clawhub` at `0e898b1dfd309728a031416cd57fa1262af0d064` and `openclaw/docs` at `2a10e88b244232f9a91d7c9a97f2816297eb2eb4`. This repository became the canonical source with release `v0.0.1`; the Carapace name and package began with `v0.1.0`.
