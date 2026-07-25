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

## Ownership

This package owns the vocabulary translation, the embed font stacks, and the
branding rule. Hosts own extraction, validation, and transport. Apps own their
content, layout, and identity.
