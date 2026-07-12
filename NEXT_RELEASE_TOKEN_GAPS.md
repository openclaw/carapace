# Next-release token evidence

This map records independent consumer evidence. Preview repetition and the OpenClaw Control UI are useful implementation references, but neither can promote a token without a second package consumer.

## Compatibility boundary

| Consumer | Current package imports | Candidate adoption constraint |
| --- | --- | --- |
| `openclaw/openclaw.ai` | Tokens, themes, typography, stable components | Does not import `themes/product.css`; Candidate controls require an explicit product-theme import. |
| `openclaw/docs` | Stable entry points and product theme | Owns `.oc-badge`, `.oc-table`, and `.oc-table-wrap`; adopting Candidate Feedback or Data requires a deliberate local migration. |
| `openclaw/clawhub` | Stable entry points, product theme, and ClawHub compatibility | Local compatibility and `.oc-card` overrides must retain their current order. |

Candidate entry points remain opt-in. Installing the package without importing them does not change any consumer output.

## Approved additive token

| Token | Value | Independent evidence | Decision |
| --- | --- | --- | --- |
| `--oc-control-min-height` | `2.75rem` | Docs uses 44px for the mobile chat launcher and mobile controls in `scripts/docs-site/assets.mjs`; ClawHub uses 44px for form input, navigation rows, and touch actions in `src/styles.css`; openclaw.ai uses 44px for `.action` and `.hero-cta` in `src/pages/integrations.astro` and `src/pages/index.astro`. | Added as an unthemed minimum-size primitive and used by Candidate controls. Stable components keep their existing geometry. |

## Deferred proposals

| Area | Evidence found | Decision |
| --- | --- | --- |
| Compact and large control heights | Consumers use several intentional values from 30px through 48px. | No shared semantic scale yet. Keep component-local. |
| Disabled opacity | Existing components use different values and several disabled states rely on color rather than opacity. | Do not normalize without contrast and state validation in two consumers. |
| Popover and dialog layers | Each consumer has a different shell and stacking context. | Keep consumer-owned until the same overlay contract is adopted twice. |
| Ambient and progress motion | Loader and skeleton timings currently exist in preview specimens or unrelated consumer animations. | Keep Candidate-local. Reduced-motion behavior is required regardless of future tokenization. |
| Avatar and icon sizes | Repeated numbers represent different content and density roles. | Keep local until two consumers share the same identity anatomy. |
| Conversation, message, composer, and tool roles | Agent specimens and Control UI provide reference evidence; two package consumers do not share these interfaces. | Keep Agent Components in Lab. |
| Conversation and tool widths | Present only in Lab composition work. | Keep local. |

## Promotion rule

A token can be proposed only when two independent package consumers use the same value for the same semantic responsibility. It must be additive, resolve without a theme migration when possible, and leave every v0.0.1 declaration unchanged. Consumer adoption and release remain separate decisions.
