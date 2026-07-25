# Embedded Surfaces

MCP apps render inside a sandboxed iframe owned by an OpenClaw host. The host
publishes theme values through the MCP Apps `hostContext.styles.variables`
field, whose key vocabulary is fixed by the specification. Import
`@openclaw/carapace/candidate/embed.css` for the canonical translation between
that vocabulary and the semantic tokens.

## Ownership Split

| Surface | Owner |
| --- | --- |
| Frame, header, provenance, and lifecycle states | Host |
| Page, surface, text, border, focus, and geometry values | Host tokens |
| Layout, content, and interaction inside the app | App |
| Logo, product name, and one accent | App |

An embedded app inherits structure and spends its own brand only on primary
actions and identity moments. Backgrounds, body text, borders, and focus rings
always resolve from host tokens so every installed app reads as one system.

## Variable Mapping

`.oc-embed-tokens` declares the specification vocabulary from `--oc-*` tokens.

| Specification key | Semantic token |
| --- | --- |
| `--color-background-primary` | `--oc-bg-surface` |
| `--color-background-secondary` | `--oc-bg-page` |
| `--color-background-tertiary` | `--oc-bg-elevated` |
| `--color-text-primary` | `--oc-text-primary` |
| `--color-text-secondary` | `--oc-text-secondary` |
| `--color-text-tertiary` | `--oc-text-muted` |
| `--color-border-primary` | `--oc-border-subtle` |
| `--color-border-secondary` | `--oc-border-strong` |
| `--color-ring-primary` | `--oc-focus-ring` |
| `--color-*-info`, `-danger`, `-success`, `-warning` | `--oc-status-*` |
| `--font-sans`, `--font-mono` | `--oc-font-embed-*` |
| `--font-text-*-size`, `--font-heading-*-size` | `--oc-font-size-*` |
| `--border-radius-md` | `--oc-radius-surface` |
| `--shadow-sm`, `--shadow-md`, `--shadow-lg` | `--oc-shadow-*` |

`--color-border-primary` is the default divider and `--color-border-secondary`
is the emphasis step. Carapace defines two neutral border weights, so this is
deliberately not a strict prominence ladder.

Larger heading roles clamp to `--oc-font-size-3xl`. The product type scale caps
at 2rem so an embedded app cannot out-scale the host chrome around it.

Status colors travel as pairs. Each `--color-text-*` clears AA on its matching
`--color-background-*` **when that background sits on
`--color-background-primary`** — the status backgrounds are translucent, so the
guarantee is only as good as what the app paints behind them. An app that
repaints its surface owns re-checking the pair.

## Fonts

Send `--oc-font-embed-sans` and `--oc-font-embed-mono` for `--font-sans` and
`--font-mono`. They contain system-resolvable families only. Do not send
`--oc-font-body`: a brand face is not guaranteed to resolve inside a sandbox,
and it fails silently onto an arbitrary system font rather than erroring.

MCP Apps does define a font channel. A host may send `@font-face` or `@import`
CSS through `hostContext.styles.css.fonts`, which the app injects with the SDK
helper. Delivery is not guaranteed, because font loading is gated by policy the
app owns rather than the host: `font-src` allows only the resource domains the
app declares, and is absent entirely when the app declares no policy, leaving
`default-src 'none'` to block the request.

Use the channel for an app that declares the font origin. Keep the system
stacks as the default for everything else.

## Host Integration

Apply `.oc-embed-tokens` to a probe element, read the computed values, and
publish them as `hostContext.styles.variables`. Keep the class off the document
root when the consumer also imports the Tailwind adapter, which declares
`--font-mono` and `--shadow-*` under the same names.

Republish on every theme change. Continue sending the specification
`hostContext.theme` string; the token payload is additive.

## Branding

`hostContext.styles.variables` is a closed record: its key set is fixed by the
specification and validated at runtime, so a host cannot add an OpenClaw name
to the payload. An app accent is therefore never transported through the style
channel.

Branding lives in two places instead:

- The app owns its accent inside its own document. It already knows its brand
  and needs nothing from the host to render it.
- The frame reserves `--oc-app-accent` and `--oc-app-accent-contrast` as the
  host-side seam for tinting chrome. The pair travels together: an accent the
  host cannot put a legible foreground on is unusable, so a host that
  overrides one overrides both, and validates contrast against the current
  surfaces before applying either.

Where a host reads an app's accent from is not settled. The MCP Apps resource
metadata carries CSP, sandbox permissions, domain, and a border preference,
but no brand color, so nothing in the protocol supplies one today. Until an
OpenClaw contract defines that source, leave host chrome unbranded and let the
slot fall back to the OpenClaw accent rather than inventing a private field.

An app spends its accent on primary actions and identity moments. Backgrounds,
body text, borders, and focus rings stay on host tokens, which is what keeps
every installed app recognizable as one system.

## App Integration

- Bundle `@openclaw/carapace/candidate/embed.css` for defaults, then apply the
  host values at runtime. Host values arrive inline and win.
- Resolve every value through the specification key with a literal fallback so
  the app still renders standalone.
- Key dark mode off `[data-theme]`. A bare `prefers-color-scheme` query tracks
  the operating system, not the host theme, and mismatches inside the frame.
- Apply the host theme with the app SDK helper, which sets `color-scheme`
  alongside `data-theme`. The bundled fallbacks use `light-dark()` and follow
  `color-scheme`; with neither set they resolve to their light values.
- Keep the app's own accent local. Do not restyle host chrome.
- Declare image and media origins in the resource metadata; the sandbox blocks
  undeclared origins.
- Stay within the host's height range and report size changes through the app
  bridge rather than assuming a viewport.

## Sizing

The size contract is the most common source of embedded breakage.

- The host clamps a reported height to a range and applies a default when the
  app reports nothing. OpenClaw clamps to 160–1200px and defaults to 600px.
  Design for the narrow end; do not assume the default.
- The body slot supplies no padding. The app owns its own inset.
- Which way height flows depends on the container, and the two modes want
  opposite CSS:
  - **Host-sized** (`containerDimensions.height` is fixed). The host owns the
    height and ignores what the app reports, so fill it — `height: 100%` on
    `html` and `body` — and scroll inside. That bounded region is what makes
    the internal scroll below work.
  - **App-sized** (a `maxHeight`, or neither field). The host sizes the frame
    from what the app reports. Let content determine height and never set
    `height: 100%` while `autoResize` is on: the app would measure a height the
    host just set from the app's own measurement, and the two chase each other.
- `containerDimensions` is optional, and each axis independently arrives as a
  fixed value, a maximum, or neither. The maximum branches are themselves
  optional, so an axis with no fields means unbounded, and an absent
  `containerDimensions` means the app knows nothing about its container. Handle
  all three per axis; do not assume one field is always present.
- Report both dimensions and let the host decide. Where the host gave a fixed
  `width` the reported width is advisory and it will be ignored — OpenClaw
  sizes only height today. Where the host gave a `maxWidth` or left width
  unbounded, the app's reported width is what the host sizes from, so an app
  that reports height alone can sit at a stale width.
- When scrolling inside a host-sized container, keep the scroll boundary
  within the app's own region so the frame's border and radius are never
  crossed by a scrollbar.

## Density and Container Adaptation

The same app renders in a chat card, a fixed-height board cell, and a wide
pane. The host publishes what is needed to adapt, on every resize.

| Container | Width | Behavior |
| --- | --- | --- |
| Narrow panel | under ~360px | Single column, stacked actions, truncate over wrap |
| Chat column | ~360–720px | The default composition |
| Wide pane | above ~720px | Multi-column permitted |

- Branch on `deviceCapabilities.hover === false` to make hover-only
  affordances always visible, and on `touch === true` for larger hit targets.
- The app must not paint its own outer card, border, or shadow. The frame is
  the card. The app's outermost element is a plain padded region on
  `--color-background-primary`.

## Rendering Tool Results

Presenting a tool result is the app's whole job, so the presentation signals in
the payload matter.

- Skip content blocks whose `annotations.audience` excludes `"user"`. That is
  the payload saying a block is not for the reader.
- Prefer `structuredContent` over re-parsing text blocks.
- Draw `isError: true` inside the app's own surface with
  `--color-text-danger` on `--color-background-danger`. The host frame does not
  render an app's tool errors.
- Route `resource_link` and `resource` blocks through the host's open-link and
  download requests. The sandbox blocks direct navigation and downloads, so a
  bare anchor silently does nothing.
- Between tool input and tool result, show a skeleton sized like the result,
  not a spinner. Streaming partial input is provisional; never render it as
  final.

## What the Vocabulary Does Not Carry

The specification key set is closed, and several everyday roles are absent.
Apps must derive them rather than wait for a key:

| Missing role | Sanctioned recipe |
| --- | --- |
| Hover / active surface | `color-mix(in srgb, var(--color-text-primary) 8%, transparent)` over the surface |
| Link | `--color-text-info` |
| Selection | `color-mix()` from the ring color |
| Chart series | The four status hues plus the text tiers |
| Accent | App-owned; see Branding |

`--color-text-disabled` and `--color-text-ghost` deliberately collapse onto one
source today, and both ghost surfaces map to `transparent`, so a ghost control
has no hover treatment from the vocabulary alone — use the recipe above.

A host may publish any subset. Treat these as the set worth relying on, each
still written with a fallback: the surface, text, border, and ring primaries;
the four status triples; `--font-mono`; the four `--font-text-*-size`; the
radius ladder; and `--border-width-regular`.

## App Lifecycle

- The host may request teardown. Complete it synchronously or within roughly
  250ms — OpenClaw force-unmounts after that budget.
- Persist state as the user interacts, not at teardown. Teardown is too late.
- An app may request its own dismissal, but that is a request. The host may
  decline it, and the app must keep working if no teardown follows.

## Failure States

The frame owns the failure surface, and the useful distinction is who can fix
it. Copy that names the wrong owner sends the reader nowhere.

| Cause | Owner | Recovery |
| --- | --- | --- |
| Render or load failure | App author | Retry |
| Lease expired, or reclaimed under memory pressure | Host | Reload, no fault |
| Sandbox or routing misconfigured | Operator | Names the operator action; retry will not help |
| Wrong MIME, oversized resource, invalid CSP | Server author | Names the server, not the reader |
| Rate limited, or permission revoked mid-session | Host | Non-blocking notice; never unmount live content |

The last row matters most: the app is alive and painted, so replacing its body
destroys working content to report a partial degradation. Surface those beside
the content, not instead of it.

## Border Preference

Resource metadata carries a three-way border preference: request a visible
border and background, request neither, or omit and let the host decide. The
specification recommends servers set it explicitly, because host defaults vary.

A frameless app is not a smaller framed app. Without host chrome the app has no
separation from the surrounding conversation, so it should resolve its
outermost surface to `--color-background-secondary` — the page value — rather
than paint a card the host deliberately removed. Provenance still has to reach
the reader somehow. OpenClaw does not read this preference today.

## Ownership

This package owns the vocabulary translation, the embed font stacks, and the
branding rule. Hosts own extraction, validation, and transport. Apps own their
content, layout, and identity.
