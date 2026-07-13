# Candidate readiness

Status: locally validated for opt-in consumer trials. Not approved for promotion, versioning, tagging, or release.

Validation date: 2026-07-12.

## Compatibility result

- The `v0.0.1` selector and token compatibility floor remains the default stable runtime inside Carapace `v0.1.0`.
- `components.css` and `styles.css` do not import Candidate or Lab CSS.
- Existing exports, stable selectors, tokens, theme values, and compatibility aliases are protected by `contracts/v0.0.1.json` and the contract check.
- Controls, Feedback, and Data are separate opt-in Candidate entry points.
- Lab components, Agent Components, charts, blocks, shell, and preview infrastructure are excluded from package runtime files.
- The packed package inherits the current Carapace version, `0.1.0`; this branch does not create another version, tag, or release.

## Candidate entry points

| Entry point | Scope | Current decision |
| --- | --- | --- |
| `./candidate/controls.css` | Native fields, labels, input, textarea, select, checkbox, radio, and switch | Ready for isolated consumer trials. |
| `./candidate/feedback.css` | Badge, banner, empty state, loader, and skeleton line | Ready for isolated trials; Docs has selector collisions that require migration. |
| `./candidate/data.css` | Table and resource list | Ready for isolated trials; Docs has selector collisions that require migration. |

Candidate files import no other entry points. Consumers must import the foundations and product theme they need before a Candidate file.

## Token decision

`--oc-control-min-height: 2.75rem` is the only additive token approved in this branch. Docs, ClawHub, and openclaw.ai independently use 44px for the same minimum control or touch responsibility. Stable component geometry is unchanged.

Compact and large control heights, disabled opacity, overlay layers, ambient motion, avatar and icon sizes, and Agent Component roles remain local. Their current evidence does not establish one shared semantic contract across two package consumers.

## Consumer validation

The Candidate tarball was installed over the package dependency in clean detached worktrees. Candidate CSS remained opt-in; consumers were not changed.

| Consumer | Commit | Validation | Result |
| --- | --- | --- | --- |
| `openclaw/docs` | `bc44f182bf64` | Full 541-page shell build and shell smoke test | Pass |
| `openclaw/clawhub` | `873b7e9a3403` | Production build with a non-production Convex URL | Pass |
| `openclaw/openclaw.ai` | `5e6e1f0ad215` | Production build | Pass |
| `openclaw/openclaw` Control UI | `5f9a6ce7eb53` | Read-only implementation review | Evidence only |

Controls, Feedback, and Data also compiled independently in an isolated Vite multi-page build. The Docs preview build and shell smoke commands must use matching artifact scopes; the full shell build and shell smoke pair passes.

## Adoption constraints

- Docs already owns `.oc-badge`, `.oc-table`, and `.oc-table-wrap`. Candidate Feedback and Data require an explicit selector migration there.
- openclaw.ai does not currently import `themes/product.css`. Candidate controls require that theme to resolve product input and status roles.
- ClawHub must preserve the existing stable, product-theme, compatibility, and local override order.
- Control UI is not a package consumer and cannot satisfy a promotion gate.

## Preview and responsive QA

The preview labels every component page as Stable, Candidate, or Lab from one central manifest. The home grid leads with the stable Action component.

| Viewport | Home grid | Shell result |
| --- | --- | --- |
| 1440 × 960 | Four columns; two rows fill the first fold | No horizontal overflow |
| 768 × 1024 | Two columns; two rows fill the first fold | Mobile navigation and compact controls fit |
| 390 × 844 | One column; two rows preserve the shared row height rule | Centered brand, bare search icon, no horizontal overflow |

The mobile Table specimen keeps wide content inside a keyboard-focusable overflow region. Browser console checks returned no warnings or errors.

## Promotion decision

Stable remains unchanged. Candidate entry points are structurally ready for explicit trials but are not ready for promotion into the default runtime. Promotion requires successful adoption and behavior review in at least two package consumers, resolution of known selector collisions, and a separate release decision.

Agent Components, charts, shell patterns, and the remaining Lab components stay preview-only.
