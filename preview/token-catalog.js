export const tokenGroups = [
  {
    id: "palette",
    label: "Palette",
    sample: "color",
    description: "Fixed source colors for documented exceptions and semantic mapping.",
  },
  {
    id: "background",
    label: "Background",
    sample: "color",
    comparison: true,
    description: "Theme-aware page, surface, and elevated backgrounds.",
  },
  {
    id: "accent",
    label: "Accent",
    sample: "color",
    comparison: true,
    description: "Primary action and restrained secondary emphasis roles.",
  },
  {
    id: "text",
    label: "Text",
    sample: "text",
    comparison: true,
    description: "Primary, secondary, muted, and on-accent text hierarchy.",
  },
  {
    id: "border",
    label: "Border",
    sample: "border",
    comparison: true,
    description: "Subtle structure and accent emphasis for boundaries.",
  },
  {
    id: "surface",
    label: "Surface",
    sample: "color",
    comparison: true,
    description: "Cards, overlays, interactive states, and soft accent surfaces.",
  },
  {
    id: "feedback",
    label: "Interface feedback",
    sample: "feedback",
    comparison: true,
    description: "Focus, selection, and chart feedback shared across interfaces.",
  },
  {
    id: "status",
    label: "Status",
    sample: "status",
    comparison: true,
    description: "Paired background and foreground roles for operational status.",
  },
  {
    id: "input",
    label: "Input",
    sample: "input",
    comparison: true,
    description: "Field backgrounds, borders, placeholders, and focus states.",
  },
  {
    id: "diff",
    label: "Diff",
    sample: "diff",
    comparison: true,
    description: "Added and removed content with regular and strong emphasis.",
  },
  {
    id: "space",
    label: "Space",
    sample: "space",
    description: "Shared spacing increments for rhythm inside consumer layouts.",
  },
  {
    id: "type-scale",
    label: "Type scale",
    sample: "type-scale",
    description: "A compact scale from interface labels to large display text.",
  },
  {
    id: "font",
    label: "Font families",
    sample: "font",
    description: "Display, body, editorial, and monospace font roles.",
  },
  {
    id: "radius",
    label: "Radius",
    sample: "radius",
    description: "Raw scale values and semantic geometry roles for shared surfaces.",
  },
  {
    id: "shadow",
    label: "Shadow",
    sample: "shadow",
    description: "Three elevation levels for surfaces that genuinely need depth.",
  },
  {
    id: "motion",
    label: "Motion",
    sample: "motion",
    description: "Shared durations and easing for responsive state changes.",
  },
  {
    id: "content",
    label: "Content",
    sample: "content",
    description: "Maximum and narrow widths for readable content composition.",
  },
];

export const tokenDefinitions = [
  { variable: "--oc-palette-ink-950", group: "palette" },
  { variable: "--oc-palette-ink-900", group: "palette" },
  { variable: "--oc-palette-ink-850", group: "palette" },
  { variable: "--oc-palette-ink-50", group: "palette" },
  { variable: "--oc-palette-ink-300", group: "palette" },
  { variable: "--oc-palette-ink-500", group: "palette" },
  { variable: "--oc-palette-paper-50", group: "palette" },
  { variable: "--oc-palette-paper-100", group: "palette" },
  { variable: "--oc-palette-paper-200", group: "palette" },
  { variable: "--oc-palette-paper-950", group: "palette" },
  { variable: "--oc-palette-paper-700", group: "palette" },
  { variable: "--oc-palette-paper-600", group: "palette" },
  { variable: "--oc-palette-coral-dark-bright", group: "palette" },
  { variable: "--oc-palette-coral-dark-mid", group: "palette" },
  { variable: "--oc-palette-coral-dark-deep", group: "palette" },
  { variable: "--oc-palette-coral-light-bright", group: "palette" },
  { variable: "--oc-palette-coral-light-mid", group: "palette" },
  { variable: "--oc-palette-coral-light-deep", group: "palette" },
  { variable: "--oc-palette-sea-dark-bright", group: "palette" },
  { variable: "--oc-palette-sea-dark-mid", group: "palette" },
  { variable: "--oc-palette-sea-light-bright", group: "palette" },
  { variable: "--oc-palette-sea-light-mid", group: "palette" },
  { variable: "--oc-bg-page", group: "background" },
  { variable: "--oc-bg-surface", group: "background" },
  { variable: "--oc-bg-elevated", group: "background" },
  { variable: "--oc-accent-primary", group: "accent" },
  { variable: "--oc-accent-primary-hover", group: "accent" },
  { variable: "--oc-accent-primary-deep", group: "accent" },
  { variable: "--oc-accent-secondary", group: "accent" },
  { variable: "--oc-accent-secondary-deep", group: "accent" },
  { variable: "--oc-text-primary", group: "text" },
  { variable: "--oc-text-secondary", group: "text" },
  { variable: "--oc-text-muted", group: "text" },
  { variable: "--oc-text-on-accent", group: "text" },
  { variable: "--oc-border-subtle", group: "border" },
  { variable: "--oc-border-accent", group: "border" },
  { variable: "--oc-surface-card", group: "surface" },
  { variable: "--oc-surface-card-strong", group: "surface" },
  { variable: "--oc-surface-overlay", group: "surface" },
  { variable: "--oc-surface-interactive", group: "surface" },
  { variable: "--oc-surface-interactive-hover", group: "surface" },
  { variable: "--oc-surface-accent-soft", group: "surface" },
  { variable: "--oc-surface-secondary-soft", group: "surface" },
  { variable: "--oc-chart-line", group: "feedback" },
  { variable: "--oc-selection-bg", group: "feedback" },
  { variable: "--oc-focus-ring", group: "feedback" },
  { variable: "--oc-status-success-bg", group: "status" },
  { variable: "--oc-status-success-fg", group: "status" },
  { variable: "--oc-status-warning-bg", group: "status" },
  { variable: "--oc-status-warning-fg", group: "status" },
  { variable: "--oc-status-error-bg", group: "status" },
  { variable: "--oc-status-error-fg", group: "status" },
  { variable: "--oc-status-info-bg", group: "status" },
  { variable: "--oc-status-info-fg", group: "status" },
  { variable: "--oc-input-bg", group: "input" },
  { variable: "--oc-input-border", group: "input" },
  { variable: "--oc-input-placeholder", group: "input" },
  { variable: "--oc-input-focus-border", group: "input" },
  { variable: "--oc-input-focus-ring", group: "input" },
  { variable: "--oc-diff-added", group: "diff" },
  { variable: "--oc-diff-added-strong", group: "diff" },
  { variable: "--oc-diff-removed", group: "diff" },
  { variable: "--oc-diff-removed-strong", group: "diff" },
  { variable: "--oc-space-1", group: "space" },
  { variable: "--oc-space-2", group: "space" },
  { variable: "--oc-space-3", group: "space" },
  { variable: "--oc-space-4", group: "space" },
  { variable: "--oc-space-5", group: "space" },
  { variable: "--oc-space-6", group: "space" },
  { variable: "--oc-space-7", group: "space" },
  { variable: "--oc-space-8", group: "space" },
  { variable: "--oc-font-size-xs", group: "type-scale" },
  { variable: "--oc-font-size-sm", group: "type-scale" },
  { variable: "--oc-font-size-base", group: "type-scale" },
  { variable: "--oc-font-size-md", group: "type-scale" },
  { variable: "--oc-font-size-lg", group: "type-scale" },
  { variable: "--oc-font-size-xl", group: "type-scale" },
  { variable: "--oc-font-size-2xl", group: "type-scale" },
  { variable: "--oc-font-size-3xl", group: "type-scale" },
  { variable: "--oc-font-display", group: "font" },
  { variable: "--oc-font-body", group: "font" },
  { variable: "--oc-font-serif", group: "font" },
  { variable: "--oc-font-mono", group: "font" },
  { variable: "--oc-radius-sm", group: "radius" },
  { variable: "--oc-radius-md", group: "radius" },
  { variable: "--oc-radius-lg", group: "radius" },
  { variable: "--oc-radius-xl", group: "radius" },
  { variable: "--oc-radius-full", group: "radius" },
  { variable: "--oc-radius-surface", group: "radius" },
  { variable: "--oc-radius-control", group: "radius" },
  { variable: "--oc-radius-inset", group: "radius" },
  { variable: "--oc-radius-round", group: "radius" },
  { variable: "--oc-shadow-sm", group: "shadow" },
  { variable: "--oc-shadow-md", group: "shadow" },
  { variable: "--oc-shadow-lg", group: "shadow" },
  { variable: "--oc-duration-fast", group: "motion" },
  { variable: "--oc-duration-ui", group: "motion" },
  { variable: "--oc-ease-out", group: "motion" },
  { variable: "--oc-content-max", group: "content" },
  { variable: "--oc-content-narrow", group: "content" },
];

export function resolveTokenHash(hash) {
  const targetId = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!targetId) return null;

  if (targetId.startsWith("token-group-")) {
    const groupId = targetId.slice("token-group-".length);
    const group = tokenGroups.find((candidate) => candidate.id === groupId);
    return group ? { targetId, groupId } : null;
  }

  if (targetId.startsWith("token-")) {
    const variable = `--${targetId.slice("token-".length)}`;
    const token = tokenDefinitions.find((candidate) => candidate.variable === variable);
    return token ? { targetId, groupId: token.group } : null;
  }

  return null;
}

export function syncTokenHash(
  hash,
  {
    getElementById = (id) => document.getElementById(id),
    schedule = (callback) => window.requestAnimationFrame(callback),
  } = {},
) {
  const state = resolveTokenHash(hash);
  const target = state ? getElementById(state.targetId) : null;
  if (!state || !target) return null;

  schedule(() => {
    schedule(() => target.scrollIntoView({ block: "start" }));
  });
  return state;
}

export function groupTokenDefinitions() {
  return tokenGroups
    .map((group) => ({
      ...group,
      tokens: tokenDefinitions.filter((token) => token.group === group.id),
    }))
    .filter((group) => group.tokens.length > 0);
}
