# Component maturity

This inventory separates the published runtime contract from opt-in candidates and preview-only work. It is the architectural source of truth for the current branch; visual completeness in the preview does not imply runtime maturity.

## Maturity model

| Level | Runtime meaning | Promotion requirement |
| --- | --- | --- |
| Stable | Imported by the existing `components.css` entry point and covered by the `v0.0.1` compatibility floor. | No selector, value, behavior, export, or import-order regression. |
| Candidate | Reusable CSS family intended for a dedicated opt-in entry point. It must not be imported by `components.css` or `styles.css`. | Isolated import, complete states, structural tests, collision review, and validation in at least two consumers. |
| Lab | Preview-only exploration. It is not shipped in package runtime files. | A complete contract plus evidence of the same interface and behavior in at least two consumers. |
| Consumer-owned | Layout or behavior whose responsibility remains in an application repository. | Promote only after two consumers independently converge on the same interface and behavior. |

## Compatibility floor

The current stable floor is the published `v0.0.1` package. The following consumers define the adoption boundary:

| Consumer | Current entry points | Local integration risk |
| --- | --- | --- |
| `openclaw/openclaw.ai` | `tokens.css`, `themes.css`, `typography.css`, `components.css` | Public-site overrides must remain independent from candidate UI. |
| `openclaw/docs` | Stable entry points plus `themes/product.css` | Local `.oc-badge`, `.oc-card`, `.oc-chart`, `.oc-table`, `.oc-table-wrap`, `.oc-tabs`, and `.oc-tooltip` selectors collide with names explored here. |
| `openclaw/clawhub` | Stable entry points, `themes/product.css`, and `compat/clawhub.css` | The compatibility adapter and local `.oc-card` overrides must keep their current order and meaning. |
| `openclaw/openclaw` Control UI | No direct package import | Useful implementation evidence, but not a package consumer and not sufficient by itself for promotion. |

No token, theme value, compatibility alias, stable selector, or current export may be removed or silently remapped. Candidate entry points are additive and opt-in.

## Stable runtime

These families are already part of `components.css` and remain the only default component contract.

| Family | Public selectors | Evidence | Required gate |
| --- | --- | --- | --- |
| App surface | `.oc-app-surface` | Published in `v0.0.1`; establishes shared aliases and application context. | Preserve declarations and import behavior. |
| Hero | `.oc-hero`, `.oc-hero-title`, `.oc-hero-lede` | Published in `v0.0.1`. | Responsive title and consumer-owned content remain intact. |
| Section | `.oc-section`, `.oc-section-header`, `.oc-section-heading`, `.oc-eyebrow`, `.oc-section-title`, `.oc-section-copy` | Published in `v0.0.1`. | Preserve responsive header behavior and selector set. |
| Card | `.oc-card`, `.oc-card-interactive` | Published and already used or overridden by consumers. | Preserve hover, focus, active, and reduced-motion behavior; do not rename despite collisions. |
| Action | `.oc-action` and its primary, secondary, ghost, and icon variants | Published canonical action API. | Preserve button/link support, disabled state, focus, active state, and reduced motion. |
| Segmented control | `.oc-segmented`, `.oc-segmented-item` | Published in `v0.0.1`. | Preserve selected/pressed aliases, disabled state, focus, and keyboard ownership in the consumer. |
| Pill | `.oc-pill` | Published metadata treatment. | Keep non-interactive semantics and geometry. |

`.oc-action` remains the only stable button API. `.oc-button` is not a second candidate API.

## Candidate entry points

Candidate means architecturally suitable for opt-in validation, not approved for a release. These families use the current token contract unless independent consumer evidence justifies an additive token later.

### Controls

| Family | Primary selectors | State coverage | Current evidence and risk |
| --- | --- | --- | --- |
| Field | `.oc-field`, `.oc-field-label`, `.oc-field-message` | Helper, error, disabled ownership | Shared structure for Input and Textarea; must remain compatible with native labels. |
| Label | `.oc-label`, `.oc-label-required`, `.oc-label-optional`, `.oc-label-description` | Required and optional metadata | Reusable field naming; no behavior ownership. |
| Input | `.oc-input` | Default, hover, focus, invalid, disabled, placeholder | Common control; validate against consumer form styles. |
| Textarea | `.oc-textarea` | Default, hover, focus, invalid, disabled, resize | Common multiline control; validate native resize and mobile behavior. |
| Select | `.oc-select-wrap`, `.oc-select` | Default, hover, focus, disabled, forced colors | Native select only; no custom listbox behavior. |
| Checkbox | `.oc-check`, `.oc-checkbox` | Checked, indeterminate, hover, focus, disabled, forced colors | Native input remains authoritative. |
| Radio | `.oc-radio-group`, `.oc-radio-option`, `.oc-radio` | Checked, hover, focus, disabled, forced colors | Native group behavior remains authoritative. |
| Switch | `.oc-switch-label`, `.oc-switch` | Checked, hover, focus, disabled, forced colors | Native checkbox semantics remain authoritative. |

### Feedback

| Family | Primary selectors | State coverage | Current evidence and risk |
| --- | --- | --- | --- |
| Badge | `.oc-badge` | Neutral, success, warning, error, info | Name collides in docs; opt-in isolation is mandatory. |
| Banner | `.oc-banner` | Informational and status variants | Product status roles are optional; verify fallback without the product theme. |
| Empty | `.oc-empty` | Title, description, icon, actions | Structure is reusable; actions remain stable components or consumer content. |
| Loader | `.oc-loader`, `.oc-loader-spinner` | Indeterminate, accessible status, reduced motion | Animation must stop or collapse under reduced motion. |
| Skeleton line | `.oc-skeleton-line` | Width variation and reduced motion | Ambient timing remains local until two consumers prove a shared token. |

### Data basics

| Family | Primary selectors | State coverage | Current evidence and risk |
| --- | --- | --- | --- |
| Table | `.oc-table-wrap`, `.oc-table` | Header, rows, overflow, keyboard focus | Both names collide in docs; isolation and explicit adoption are required. |
| Resource list | `.oc-resource-list` family | Linked row, metadata, hover, focus, mobile layout | Reusable record anatomy; consumer owns data and routing. |

## Lab: general components and patterns

These items remain preview-only. Several are valid patterns, but they currently own behavior, naming, layout, or composition that has not been proven across consumers.

| Item | Primary selector | Reason it remains Lab |
| --- | --- | --- |
| Autocomplete | `.oc-autocomplete` | Current specimen relies on native `datalist`; adoption contract is unproven. |
| Avatar | `.oc-avatar` | Size, image fallback, and presence semantics need consumer evidence. |
| Breadcrumbs | `.oc-breadcrumbs` | Navigation hierarchy and routing are consumer-owned. |
| Button | `.oc-button` | Duplicates the published `.oc-action` API. |
| Clipboard Text | `.oc-clipboard-text` | Clipboard behavior and feedback contract are incomplete. |
| Code Highlighted | `.oc-code-highlighted` | Syntax model and renderer ownership are unproven. |
| Collapsible | `.oc-collapsible` | Native disclosure styling is plausible; cross-consumer anatomy is unproven. |
| Combobox | `.oc-combobox` | Focus, keyboard, filtering, and listbox behavior require a real implementation contract. |
| Command Palette | `.oc-command-palette` | Search model, focus restoration, shortcuts, and routing are application behavior. |
| Date Picker | `.oc-date-picker` | Current native-date presentation does not define a portable full picker contract. |
| Dialog | `.oc-dialog` | Focus lifecycle, portal strategy, stacking, and dismissal remain consumer-owned. |
| Dropdown | `.oc-dropdown` | Menu positioning, focus, dismissal, and collision handling are incomplete. |
| Flow | `.oc-flow` | Represents a specific sequential layout rather than a proven component contract. |
| Grid | `.oc-grid` | General layout utility; ownership and responsive API need evidence. |
| Input Group | `.oc-input-group` | Prefix/suffix semantics, validation ownership, and compound focus need adoption proof. |
| Layer Card | `.oc-layer-card` | Decorative surface composition without cross-consumer evidence. |
| Link | `.oc-link` | Native links plus consumer typography already cover most use; API value is unproven. |
| Menu Bar | `.oc-menubar` | Full menu keyboard behavior is not owned by CSS. |
| Meter | `.oc-meter` | Native measurement styling needs real product use and cross-browser validation. |
| Pagination | `.oc-pagination` | Routing, current-page state, and compacting behavior are consumer-owned. |
| Popover | `.oc-popover` | Anchoring, stacking, dismissal, and browser support policy are incomplete. |
| Provider Logo | `.oc-provider-logo` | Brand assets and sizing need an explicit rights and adoption contract. |
| Sensitive Input | `.oc-sensitive-input` | Visibility state, password-manager behavior, and form ownership need validation. |
| Sidebar | `.oc-sidebar` | Application shell and responsive navigation remain consumer-owned. |
| Table of Contents | `.oc-table-of-contents` | Section discovery and active-heading behavior are consumer-owned. |
| Tabs | `.oc-tabs` | Name collides in docs; keyboard and panel lifecycle need a behavior contract. |
| Text | `.oc-text` | Overlaps semantic HTML and typography tokens without proven added value. |
| Toast | `.oc-toast` | Region lifecycle, queueing, duration, and announcements require application behavior. |
| Toolbar | `.oc-toolbar` | Roving focus and command behavior are incomplete. |
| Tooltip | `.oc-tooltip` | Name collides in docs; positioning, delay, touch, and dismissal are incomplete. |

## Lab: charts

Charts, Colors, Timeseries, Maps, Sankey, and Custom Chart remain preview-only. Their current CSS demonstrates visual anatomy but does not define data transformation, scale, accessibility, interaction, responsive degradation, or rendering ownership. `.oc-chart` also collides in docs.

## Lab: blocks

| Block | Primary selector | Ownership decision |
| --- | --- | --- |
| Page Header | `.oc-page-header` | Lab layout; page hierarchy and actions are consumer-owned. |
| Resource List | `.oc-resource-list` | Candidate data basic; keep the block page as its richer specimen. |
| Delete Resource | `.oc-delete-resource` | Lab composition; destructive flow, confirmation, and mutation stay consumer-owned. |

## Lab: Agent Components

All Agent Components remain preview-only: Agent Chat, Attachment Button, Bash Tool, Edit Tool, Error Message, File Attachment, Generic Tool, Input Bar, Markdown, MCP Tool, Message List, Mode Selector, Model Picker, Plan Tool, Question Tool, Search Tool, Send Button, Spiral Loader, Subagent Tool, Suggestions, Text Shimmer, Thinking Tool, Todo Tool, Tool Group, and User Message.

They provide useful implementation and token-gap evidence, but conversation state, streaming, tool execution, attachments, markdown rendering, model capabilities, focus, and persistence are application concerns. None may enter a runtime package entry point until at least two consumers share the same interface and behavior.

## Consumer-owned preview work

The documentation shell, home grid, navigation, search, theme switcher, table of contents, product/content/public compositions, and interaction examples are preview infrastructure. They may use Stable, Candidate, and Lab CSS to explain the system, but they are not package runtime exports.

## Required architectural gate

The branch is not release-ready until automated checks prove all of the following:

1. `components.css` and `styles.css` expose only the unchanged stable floor.
2. Candidate Controls, Feedback, and Data import independently and do not import one another implicitly.
3. Lab CSS is outside package contents and package exports.
4. Every `v0.0.1` export, stable selector, token, theme value, and compatibility alias remains present with the same meaning.
5. Candidate selectors do not leak through stable entry points.
6. Known consumer collisions are reported and remain opt-in.
7. Reduced-motion, forced-colors, focus, disabled, invalid, and responsive behavior is tested where each family claims support.
8. A packed candidate builds in isolated clean worktrees for docs, ClawHub, and openclaw.ai without requiring adoption.
9. Control UI review is recorded as evidence only and never treated as direct package compatibility proof.

Only `--oc-control-min-height` is approved by this inventory. Its evidence is recorded in `NEXT_RELEASE_TOKEN_GAPS.md`; every other proposed role remains deferred until it is traced to at least two independent package consumers.
