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
- `.oc-page-header` names the current route and holds route-level actions.
- `.oc-pane` provides bounded header, body, and footer regions.
- `.oc-pane-split` creates master-detail and inspector layouts.
- `.oc-settings-page`, `.oc-settings-section`, `.oc-settings-group`, and
  `.oc-settings-row` create dense, scan-friendly preference screens.
- `.oc-status` presents compact operational state with text and a semantic
  indicator.

Use existing controls such as `.oc-switch`, `.oc-input`, `.oc-select`,
`.oc-segmented`, `.oc-action`, and `.oc-badge` inside these compositions. Do not
create application-specific replacements for controls already in Carapace.

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
- Check keyboard focus and accessible names for every interactive control.
- Keep status understandable without color alone.
- Confirm that long labels and descriptions wrap without resizing fixed UI.
- Confirm that native platform behavior remains native after visual alignment.
