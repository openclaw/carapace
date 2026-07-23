# Application Surfaces

Carapace provides framework-neutral anatomy for application shells, panes, and
settings. Consumers keep routing, data, persistence, window management, and
interaction behavior.

## Shared Contract

Import the candidate application layer after the stable component and candidate
control entry points:

```css
@import "@openclaw/carapace/components.css";
@import "@openclaw/carapace/themes/product.css";
@import "@openclaw/carapace/candidate/controls.css";
@import "@openclaw/carapace/candidate/feedback.css";
@import "@openclaw/carapace/candidate/application.css";
```

Compose the contract from these roles:

- `.oc-app-frame` separates primary navigation from the active application
  surface.
- `.oc-app-toolbar` carries current context, command search, connection state,
  notifications, and account access without competing with page content.
- `.oc-app-content` contains the route-owned surface below global chrome.
- `.oc-page-header` names the current route and holds route-level actions when
  the route needs an introduction.
- `.oc-pane` provides bounded header, body, and footer regions.
- `.oc-pane-split` creates generic two-pane layouts.
- `.oc-master-detail`, `.oc-master-pane`, `.oc-detail-pane`,
  `.oc-app-resource-list`, and `.oc-activity-list` support repeated operational
  inspection without turning every datum into a card.
- `.oc-summary-strip` exposes a small set of comparable health metrics above an
  operational workspace.
- `.oc-settings-shell`, `.oc-settings-navigation`, `.oc-settings-detail`, and
  `.oc-detail-header` create a settings takeover with local navigation and a
  focused detail canvas.
- `.oc-settings-page`, `.oc-settings-section`, `.oc-settings-group`, and
  `.oc-settings-row` create dense, scan-friendly preference screens.
- `.oc-workspace-grid`, `.oc-workspace-sessions`,
  `.oc-workspace-conversation`, and `.oc-workspace-inspector` create a
  session-oriented working surface with optional context.
- `.oc-status` presents compact operational state with text and a semantic
  indicator.

Use existing controls such as `.oc-switch`, `.oc-input`, `.oc-select`,
`.oc-segmented`, `.oc-action`, and `.oc-badge` inside these compositions. Do not
create application-specific replacements for controls already in Carapace.

## Composition Rules

- Global navigation answers where the user is; local rails answer what is
  selected inside that route. Do not merge both jobs into one undifferentiated
  sidebar.
- Keep command search and global status in the application toolbar. Keep
  route-specific filters and actions near the route title or pane they affect.
- Use summary strips only for a small set of comparable, current metrics. Put
  history and explanations in the detail surface.
- Give master lists identity, status, and one useful comparison value. Keep
  editing controls in the selected detail pane.
- Let the primary task own most of a workspace. Session history and inspectors
  should stay narrower, hide on constrained widths, and never squeeze the
  primary content below a usable measure.
- Set `data-inspector="true|false"` on `.oc-app-frame` for workspace layouts.
  Add `data-dock="right|bottom|hidden"` when inspector placement changes;
  bottom layout is reserved only while an inspector is present.
- Use bounded groups for related settings, not a card around every row or
  section. Keep settings navigation visually quieter than the selected detail.
- Use coral for primary action and selection, sea for connected identity and
  secondary context, and status roles for outcomes. Do not recolor neutral
  structure for decoration.

## Consumer Boundary

The macOS app should map this anatomy onto native SwiftUI and AppKit structures.
It keeps native materials, title bars, window sizing, sheets, toolbar behavior,
keyboard commands, and platform accessibility semantics.

The Control UI should compose the CSS classes inside its existing Lit views. It
keeps route state, WebSocket lifecycle, data loading, local persistence,
responsive navigation behavior, and docked-panel interaction.

Both consumers may adapt density and placement to their platform. They should
preserve the same hierarchy, control roles, semantic status, and responsive
intent rather than reproduce identical pixels.

## Promotion Evidence

The candidate contract is based on repeated structures in two consumers:

- macOS settings, channel configuration, cron detail, and dashboard panes
- Control UI settings, sidebar navigation, route headers, and docked panels

Keep the entry point opt-in until both consumers have adopted and validated the
same anatomy. Promote only after browser and native-app evidence shows that the
selectors remain useful without consumer-specific exceptions.

## Validation

- Verify desktop, tablet, and narrow layouts.
- Verify light and dark themes.
- Verify expanded and compact global navigation.
- Verify settings navigation, master-detail, inspector-right,
  inspector-bottom, and inspector-hidden layouts.
- Check keyboard focus and accessible names for every interactive control.
- Keep status understandable without color alone.
- Confirm that long labels and descriptions wrap without resizing fixed UI.
- Confirm that native platform behavior remains native after visual alignment.
