export const terminalTokens = Object.freeze({
  colors: Object.freeze({
    background: "--oc-bg-recessed",
    foreground: "--oc-text-primary",
    muted: "--oc-text-muted",
    active: "--oc-accent-primary",
    focus: "--oc-accent-secondary",
    cursor: "--oc-accent-primary",
    success: "--oc-status-success-fg",
    warning: "--oc-status-warning-fg",
    error: "--oc-status-error-fg",
  }),
  font: Object.freeze({ family: "--oc-font-mono" }),
  spacing: Object.freeze({
    markerLabel: Object.freeze({
      name: "terminal.space.marker-label",
      value: 1,
      unit: "cell",
    }),
    leadingPrefix: Object.freeze({
      name: "terminal.space.leading-prefix",
      value: 2,
      unit: "cells",
    }),
  }),
  viewports: Object.freeze({
    compact: Object.freeze({
      name: "terminal.viewport.compact",
      value: 40,
      unit: "columns",
    }),
    standard: Object.freeze({
      name: "terminal.viewport.standard",
      value: 80,
      unit: "columns",
    }),
    reference: Object.freeze({
      name: "terminal.viewport.reference",
      value: 120,
      unit: "columns",
    }),
  }),
});
