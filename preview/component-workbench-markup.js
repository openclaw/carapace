import { agentIcon } from "./agent-icons.js";
import {
  attributedMessageMarkup,
  collaborationTranscriptMarkup,
} from "./agent-identity.js";
import {
  applicationModelControlsMarkup,
  applicationModels as applicationModelCatalog,
} from "./application-model-controls.js";
import {
  applicationCameraPreviewMarkup,
  applicationComposerPrimaryMarkup,
  applicationTalkToggleMarkup,
} from "./application-screens.js";
import {
  avatarFixtureUrl,
} from "./avatar-fixtures.js";
import {
  buttonWorkbenchExamples,
} from "./component-reference.js";

export const interactiveArtifactUrl = new URL("./assets/carapace-home-artwork.avif", import.meta.url).href;
export const interactiveOpenClawMarkUrl = new URL("./assets/openclaw-mark.png", import.meta.url).href;

export const actionVariants = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Ghost", value: "ghost" },
  { label: "Icon", value: "icon" },
];

export const buttonVariants = buttonWorkbenchExamples.map(({ label, id: value }) => ({ label, value }));

export const bannerTones = [
  { label: "Default", value: "default" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Information", value: "info" },
];

export const selectOptions = [
  { label: "Balanced", value: "balanced" },
  { label: "Fast", value: "fast" },
  { label: "Deep", value: "deep" },
];

export const inputAreaStates = [
  { label: "Default", value: "default" },
  { label: "Invalid", value: "invalid" },
  { label: "Disabled", value: "disabled" },
];

export const inputGroupAddons = [
  { label: "Prefix", value: "prefix" },
  { label: "Suffix", value: "suffix" },
  { label: "Both", value: "both" },
  { label: "Stepper", value: "stepper" },
];

export const inputGroupStates = [
  { label: "Default", value: "default" },
  { label: "Invalid", value: "invalid" },
  { label: "Disabled", value: "disabled" },
];

export const sidebarWorkspaces = [
  {
    id: "openclaw",
    label: "OpenClaw",
    description: "Design workspace",
    avatarSeed: "OpenClaw workspace",
    groups: [
      {
        id: "workspace",
        label: "Workspace",
        icon: "layout-grid",
        links: [
          { label: "Overview", icon: "layout-dashboard", current: true },
          { label: "Activity", icon: "activity", count: "8" },
          { label: "Sessions", icon: "messages-square" },
        ],
      },
      {
        id: "manage",
        label: "Manage",
        icon: "blocks",
        links: [
          { label: "Components", icon: "box" },
          { label: "Settings", icon: "settings" },
        ],
      },
    ],
  },
  {
    id: "labs",
    label: "Labs",
    description: "Product experiments",
    avatarSeed: "OpenClaw Labs",
    groups: [
      {
        id: "experiments",
        label: "Experiments",
        icon: "flask-conical",
        links: [
          { label: "Prototype queue", icon: "list-filter", current: true, count: "4" },
          { label: "Live runs", icon: "radio" },
          { label: "Evaluations", icon: "chart-no-axes-combined" },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        icon: "library",
        links: [
          { label: "Datasets", icon: "database" },
          { label: "Playgrounds", icon: "panel-top" },
        ],
      },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    description: "Private drafts",
    avatarSeed: "Mina personal workspace",
    groups: [
      {
        id: "personal",
        label: "Personal",
        icon: "sparkles",
        links: [
          { label: "Inbox", icon: "inbox", current: true, count: "3" },
          { label: "Drafts", icon: "notebook-pen" },
          { label: "Saved", icon: "bookmark" },
        ],
      },
      {
        id: "automation",
        label: "Automation",
        icon: "workflow",
        links: [
          { label: "Schedules", icon: "calendar-clock" },
          { label: "Shortcuts", icon: "zap" },
        ],
      },
    ],
  },
];

export const sidebarWorkspaceOptions = sidebarWorkspaces.map(({ id: value, label }) => ({
  label,
  value,
}));

export const autocompleteOptions = [
  { label: "Empty", value: "" },
  { label: "Action", value: "Action" },
  { label: "Card", value: "Card" },
  { label: "Input", value: "Input" },
  { label: "Select", value: "Select" },
];

export const composerStatuses = [
  { label: "Ready", value: "ready" },
  { label: "Submitted", value: "submitted" },
  { label: "Streaming", value: "streaming" },
];

export const sendButtonStates = [
  { label: "Idle", value: "idle" },
  { label: "Typing", value: "typing" },
  { label: "Streaming", value: "streaming" },
];

export const attachmentButtonIcons = [
  { label: "Plus", value: "plus" },
  { label: "Paperclip", value: "paperclip" },
];

export const attachmentKinds = [
  { label: "File", value: "file" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

export const attachmentDisplays = [
  { label: "Chip", value: "chip" },
  { label: "Image only", value: "image-only" },
];

export const errorMessageExamples = [
  { label: "Interrupted", value: "interrupted" },
  { label: "Rate limit", value: "rate-limit" },
];

export const agentModes = [
  { label: "Agent", value: "agent" },
  { label: "Plan", value: "plan" },
];

export const toolLifecycleStates = [
  { label: "Running", value: "animating" },
  { label: "Complete", value: "complete" },
];

export const interactiveToolLifecycleStates = [
  ...toolLifecycleStates,
  { label: "Failed", value: "failed" },
];

export const subagentTaskTitles = [
  { label: "Accessibility audit", value: "Accessibility audit" },
  { label: "Control UI parity", value: "Control UI parity" },
  { label: "macOS surface review", value: "macOS surface review" },
];

export const subagentNames = [
  { label: "Atlas", value: "Atlas" },
  { label: "Sora", value: "Sora" },
  { label: "Quinn", value: "Quinn" },
];

export const subagentLifecycleStates = [
  { label: "Running", value: "animating" },
  { label: "Completed", value: "complete" },
  { label: "Failed", value: "failed" },
  { label: "Timed out", value: "timed_out" },
];

export const todoItemStates = [
  { label: "Pending", value: "pending" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export const questionStates = [
  { label: "Open", value: "open" },
  { label: "Submitting", value: "submitting" },
  { label: "Answered", value: "answered" },
  { label: "Skipped", value: "skipped" },
  { label: "Error", value: "error" },
];

export const chatExamples = [
  { label: "Basic", value: "basic" },
  { label: "Multi-user", value: "multi-user" },
  { label: "Multi-agent", value: "multi-agent" },
  { label: "Media", value: "media" },
  { label: "Empty", value: "empty" },
  { label: "Suggestions", value: "suggestions" },
  { label: "Attachments", value: "attachments" },
];

export const chatStatuses = [
  { label: "Ready", value: "ready" },
  { label: "Submitted", value: "submitted" },
  { label: "Streaming", value: "streaming" },
  { label: "Error", value: "error" },
];

export const markdownExamples = [
  { label: "Release notes", value: "release" },
  { label: "Table and links", value: "table" },
  { label: "Long-form answer", value: "long-form" },
  { label: "Task checklist", value: "tasks" },
  { label: "Streaming update", value: "streaming" },
];

export const interactiveToolVariants = [
  { label: "Terminal", value: "terminal" },
  { label: "Browser preview", value: "browser" },
  { label: "Artifact", value: "artifact" },
];

export const loaderSizes = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const skeletonLineCounts = [
  { label: "One", value: "1" },
  { label: "Three", value: "3" },
  { label: "Five", value: "5" },
];

export const skeletonLineWidths = [
  { label: "Full", value: "full" },
  { label: "Mixed", value: "mixed" },
  { label: "Short", value: "short" },
];

export const providerLogoSizes = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const providerLogoLayouts = [
  { label: "Lockups", value: "wrap" },
  { label: "Marks", value: "marks" },
  { label: "Picker", value: "picker" },
  { label: "Stack", value: "stack" },
  { label: "Profiles", value: "profiles" },
];

export const providerLogoStates = [
  { label: "Default", value: "default" },
  { label: "Selected", value: "selected" },
  { label: "Muted", value: "muted" },
  { label: "Disabled", value: "disabled" },
];

export const providerLogoProviders = [
  { id: "openai", name: "OpenAI", color: "#10a37f" },
  { id: "anthropic", name: "Anthropic", color: "#d97757" },
  { id: "gemini", name: "Gemini", color: "#4285f4" },
  { id: "xai", name: "xAI", color: "#8a8a8a" },
  { id: "groq", name: "Groq", color: "#f55036" },
  { id: "mistral", name: "Mistral", color: "#ff7000" },
  { id: "openrouter", name: "OpenRouter", color: "#6b7cff" },
  { id: "deepseek", name: "DeepSeek", color: "#4d6bfe" },
  { id: "kimi", name: "Kimi", color: "#8b5cf6" },
  { id: "perplexity", name: "Perplexity", color: "#20b8a6" },
];

export const spiralLoaderSizes = [
  { label: "Small", value: "16" },
  { label: "Medium", value: "24" },
  { label: "Large", value: "32" },
];

export const textShimmerExamples = [
  { label: "Inline status", value: "inline" },
  { label: "Delayed shimmer", value: "delayed" },
  { label: "Fast shimmer", value: "fast" },
];

export const userMessageContent = [
  { label: "Text only", value: "text" },
  { label: "With image", value: "image" },
  { label: "With file", value: "file" },
];

export const gridColumns = [
  { label: "Auto", value: "auto" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

export const gridItemCounts = [
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "6", value: "6" },
];

export const gridItemLabels = ["Foundations", "Components", "Resources", "Tokens", "Themes", "Patterns"];

export const linkVariants = [
  { label: "Inline", value: "inline" },
  { label: "Muted", value: "muted" },
  { label: "Standalone", value: "standalone" },
];

export const flowOrientations = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

export const meterValues = [
  { label: "Low", value: "24" },
  { label: "Balanced", value: "64" },
  { label: "Ready", value: "82" },
];

export const applicationNavigationModes = [
  { label: "Expanded", value: "expanded" },
  { label: "Compact", value: "compact" },
];

export const applicationDensities = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" },
];

export const applicationConnectionStates = [
  { label: "Ready", value: "ready" },
  { label: "Offline", value: "offline" },
];

export const applicationOperationViews = [
  { label: "Channels", value: "channels" },
  { label: "Automation", value: "automation" },
];

export const applicationOperationStates = [
  { label: "Ready", value: "ready" },
  { label: "Loading", value: "loading" },
  { label: "Error", value: "error" },
];

export const applicationDockModes = [
  { label: "Right", value: "right" },
  { label: "Bottom", value: "bottom" },
  { label: "Hidden", value: "hidden" },
];

export const applicationSessionStates = [
  { label: "Active", value: "active" },
  { label: "Idle", value: "idle" },
  { label: "Error", value: "error" },
];

export const applicationVoiceStates = [
  { label: "Idle", value: "idle" },
  { label: "Connecting", value: "connecting" },
  { label: "Listening", value: "listening" },
  { label: "Thinking", value: "thinking" },
  { label: "Error", value: "error" },
];

export const applicationModels = applicationModelCatalog.map(({ label, value }) => ({ label, value }));

export const applicationSessionListStates = [
  { label: "Ready", value: "ready" },
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Error", value: "error" },
];

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function compactIconMarkup(markup) {
  return markup.replace(
    /<i class="oc-agent-icon" data-lucide="[^"]*" aria-hidden="true"><\/i>/g,
    '<svg aria-hidden="true">…</svg>',
  );
}

export function actionWorkbenchMarkup({ variant = "primary" } = {}) {
  if (variant === "icon") {
    return '<button class="oc-action oc-action-icon" type="button" aria-label="Add item">\n  +\n</button>';
  }

  const label =
    variant === "primary"
      ? "Primary action"
      : `${variant.slice(0, 1).toUpperCase()}${variant.slice(1)}`;
  return `<button class="oc-action oc-action-${variant}" type="button">\n  ${label}\n</button>`;
}

export function buttonWorkbenchMarkup({ variant = "primary" } = {}) {
  const example =
    buttonWorkbenchExamples.find(({ id }) => id === variant) ?? buttonWorkbenchExamples[0];
  return example.markup;
}

export const clipboardActionVariants = [
  { label: "Label", value: "label" },
  { label: "Icon", value: "icon" },
];

export function clipboardTextWorkbenchMarkup({ variant = "icon" } = {}) {
  const action =
    variant === "label"
      ? `<button class="oc-clipboard-action" type="button" aria-label="Copy package specifier" data-copy-text="@openclaw/carapace">Copy</button>`
      : `<button class="oc-clipboard-action oc-clipboard-action-icon" type="button" aria-label="Copy package specifier" data-copy-text="@openclaw/carapace"><i data-lucide="copy" aria-hidden="true"></i></button>`;
  return `<div class="oc-clipboard-text">
  <code class="oc-clipboard-value">@openclaw/carapace</code>
  ${action}
  <span class="sr-only" aria-live="polite" data-copy-status></span>
</div>`;
}

export function bannerWorkbenchMarkup({ tone = "warning", action = true, dismissible = false } = {}) {
  const content = {
    default: {
      title: "Notice",
      message: "Review the context before continuing.",
    },
    success: {
      title: "Changes saved",
      message: "The latest contract is ready to use.",
    },
    warning: {
      title: "Update available",
      message: "Review the changes before applying the new contract.",
    },
    error: {
      title: "Update failed",
      message: "Resolve the reported issues before trying again.",
    },
    info: {
      title: "Reference available",
      message: "A new component reference is ready to review.",
    },
  };
  const selectedTone = bannerTones.some(({ value }) => value === tone) ? tone : "warning";
  const modifier = selectedTone === "default" ? "" : ` oc-banner-${selectedTone}`;
  const selected = content[selectedTone];
  const adjacentAction = action
    ? '\n  <button class="oc-action oc-action-secondary oc-banner-action" type="button">Review</button>'
    : "";
  const dismiss = dismissible
    ? '\n  <button class="oc-banner-dismiss" type="button" aria-label="Dismiss notice"><i data-lucide="x" aria-hidden="true"></i></button>'
    : "";

  return `<div class="oc-banner${modifier}" role="status">
  <span class="oc-banner-indicator" aria-hidden="true"></span>
  <div class="oc-banner-content">
    <strong class="oc-banner-title">${selected.title}</strong>
    <p>${selected.message}</p>
  </div>${adjacentAction}${dismiss}
</div>`;
}

export function tableWorkbenchMarkup({ interactive = false, chrome = false, selected = false, expandable = false } = {}) {
  const records = [
    { component: "Button", status: "Stable", updated: "Today" },
    { component: "Dialog", status: "Stable", updated: "Yesterday" },
    { component: "Table", status: "Draft", updated: "Now" },
  ];
  const actionHeader = interactive ? '<th scope="col">Action</th>' : "";
  const rows = records
    .map(({ component, status, updated }, index) => {
      const action = interactive
        ? `<td><button class="oc-action oc-action-ghost" type="button" aria-label="Open ${component}">Open</button></td>`
        : "";
      const expander = expandable
        ? `<td class="oc-table-expander"><button class="oc-table-expand" type="button" aria-expanded="${index === 0}" aria-label="Toggle details for ${component}" data-workbench-table-expand><i data-lucide="chevron-right" aria-hidden="true"></i></button></td>`
        : "";
      const detailRow = expandable
        ? `\n      <tr class="oc-table-expansion"${index === 0 ? "" : " hidden"}><td colspan="${(interactive ? 4 : 3) + 1}"><dl class="oc-tool-kv"><dt>Owner</dt><dd>interface</dd><dt>Last change</dt><dd>${updated} · contract check green</dd></dl></td></tr>`
        : "";
      return `<tr>${expander}<td>${component}</td><td>${status}</td><td>${updated}</td>${action}</tr>${detailRow}`;
    })
    .join("\n      ");
  const modifier = interactive ? " oc-table-interactive" : "";
  const caption = interactive
    ? "Component status, most recent update, and available actions"
    : "Component status and most recent update";

  const toolbar = !chrome
    ? ""
    : selected
      ? `<div class="oc-table-bulk-bar"><span class="oc-table-bulk-count">2 selected</span><span>of ${records.length} components</span><div class="oc-table-bulk-actions"><button class="oc-action oc-action-ghost" type="button">Archive</button><button class="oc-action oc-action-secondary" type="button">Export</button></div></div>\n  `
      : `<div class="oc-table-toolbar"><label class="oc-search-field"><span class="sr-only">Search components</span><input type="search" placeholder="Search components" /></label><button class="oc-action oc-action-ghost" type="button">Filters</button></div>\n  `;
  const sortableHeader = chrome
    ? `<th scope="col" aria-sort="ascending"><button class="oc-table-sort" type="button">Component<span class="oc-table-sort-icon" aria-hidden="true">↑</span></button></th>`
    : '<th scope="col">Component</th>';
  const footer = chrome
    ? `\n  <div class="oc-table-footer"><span>${records.length} of 24 components</span><nav class="oc-pagination" aria-label="Table pages"><ol class="oc-pagination-list"><li><a class="oc-pagination-link" href="?page=1" aria-current="page" data-workbench-inert-link>1</a></li><li><a class="oc-pagination-link" href="?page=2" data-workbench-inert-link>2</a></li></ol></nav></div>`
    : "";
  const expanderHeader = expandable ? '<th scope="col"><span class="sr-only">Details</span></th>' : "";
  return `${toolbar}<div class="oc-table-wrap" role="region" aria-label="Component status" tabindex="0">
  <table class="oc-table${modifier}">
    <caption class="sr-only">${caption}</caption>
    <thead><tr>${expanderHeader}${sortableHeader}<th scope="col">Status</th><th scope="col">Updated</th>${actionHeader}</tr></thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>${footer}`;
}

export function gridWorkbenchMarkup({ columns = "3", items = "3" } = {}) {
  const column = gridColumns.some(({ value }) => value === columns) ? columns : "3";
  const count = gridItemCounts.some(({ value }) => value === items) ? Number(items) : 3;
  const children = gridItemLabels
    .slice(0, count)
    .map((label) => `  <article class="oc-card oc-grid-item"><strong>${label}</strong></article>`)
    .join("\n");

  return `<div class="oc-grid oc-grid-${column}">\n${children}\n</div>`;
}

export function collapsibleWorkbenchMarkup({ open = true } = {}) {
  return `<details class="oc-collapsible"${open ? " open" : ""}>
  <summary class="oc-collapsible-summary">Package requirements</summary>
  <div class="oc-collapsible-content"><p>Import tokens before components and set the theme on the application root.</p></div>
</details>`;
}

export function flowWorkbenchMarkup({ orientation = "horizontal" } = {}) {
  const axis = flowOrientations.some(({ value }) => value === orientation)
    ? orientation
    : "horizontal";
  const flow = `<ol class="oc-flow oc-flow-list" data-orientation="${axis}" aria-label="${axis === "horizontal" ? "Horizontal" : "Vertical"} release path" tabindex="0">
  <li class="oc-flow-step" data-state="complete"><span class="oc-flow-marker"><i data-lucide="check" aria-hidden="true"></i></span><span><strong>Draft</strong><small>Changes prepared</small></span></li>
  <li class="oc-flow-step" aria-current="step"><span class="oc-flow-marker">2</span><span><strong>Review</strong><small>Validate the contract</small></span></li>
  <li class="oc-flow-step"><span class="oc-flow-marker">3</span><span><strong>Publish</strong><small>Tag the release</small></span></li>
</ol>`;

  return axis === "horizontal"
    ? `<div class="oc-flow-viewport" data-orientation="horizontal">${flow}</div>`
    : flow;
}

export function linkWorkbenchMarkup({ variant = "inline", disabled = false } = {}) {
  const examples = {
    inline: {
      label: "Inline link",
      href: "/introduction/",
      className: "oc-link",
    },
    muted: {
      label: "Muted link",
      href: "/resources/",
      className: "oc-link oc-link-muted",
    },
    standalone: {
      label: "Browse components",
      href: "/interface/",
      className: "oc-link oc-link-standalone",
    },
  };
  const selected = examples[variant] ?? examples.inline;
  const icon = variant === "standalone" ? ' <i data-lucide="arrow-right" aria-hidden="true"></i>' : "";

  if (disabled) {
    return `<a class="${selected.className}" role="link" aria-disabled="true" tabindex="-1">${selected.label}${icon}</a>`;
  }

  return `<a class="${selected.className}" href="${selected.href}" data-workbench-inert-link>${selected.label}${icon}</a>`;
}

export function meterWorkbenchMarkup({ value = "64", active = true } = {}) {
  const selected = meterValues.some((option) => option.value === value) ? value : "64";
  const numericValue = Number(selected);
  const label = numericValue >= 80 ? "Context ready" : "Storage used";
  const caption =
    numericValue >= 80
      ? active
        ? "Active measurement with a static numeric value"
        : "Measurement settled at its current value"
      : `${(numericValue / 10).toFixed(1)} GB of 10 GB`;
  const effectAttributes = active ? ' data-state="active" data-effect="sheen"' : "";

  return `<div class="oc-meter"${effectAttributes}>
  <div class="oc-meter-header"><strong>${label}</strong><span aria-hidden="true">${numericValue}%</span></div>
  <span class="oc-meter-track"><meter class="oc-meter-value" aria-label="${label}" min="0" max="100" low="50" high="80" optimum="${numericValue >= 80 ? "100" : "0"}" value="${numericValue}">${numericValue}%</meter></span>
  <p class="oc-meter-caption">${caption}</p>
</div>`;
}

export function appSurfaceWorkbenchMarkup({ toolbar = true, card = true } = {}) {
  const toolbarMarkup = toolbar
    ? `
  <header class="primitive-app-surface-toolbar">
    <span class="oc-pill">Workspace</span>
    <div class="primitive-row">
      <button class="oc-action oc-action-ghost" type="button">Settings</button>
      <button class="oc-action oc-action-secondary" type="button">New</button>
    </div>
  </header>`
    : "";
  const cardMarkup = card
    ? `
    <article class="oc-card primitive-app-surface-card">
      <strong>Nested card</strong>
      <p>Reads the component surface aliases published by the app surface root.</p>
    </article>`
    : "";

  return `<div class="primitive-app-surface-demo">${toolbarMarkup}
  <div class="primitive-app-surface-body">
    <strong>OpenClaw application</strong>
    <p>Children inherit the canonical interface foundation.</p>${cardMarkup}
  </div>
</div>`;
}

export function sidebarAvatarMarkup(seed, label, attributes = "") {
  return `<span class="oc-avatar oc-avatar-sm oc-avatar-pixel" ${attributes}>
  <img class="oc-avatar-image" src="${avatarFixtureUrl(seed)}" alt="${label}" width="28" height="28" />
</span>`;
}

export function sidebarWorkspacePanelMarkup(workspace, active) {
  return `<div class="oc-sidebar-workspace-panel" data-sidebar-workspace-panel="${workspace.id}" data-active="${active}" aria-hidden="${!active}"${active ? "" : " inert"}>
  ${workspace.groups
    .map(
      (group) => `<section class="oc-sidebar-group" data-sidebar-group>
    <button class="oc-sidebar-group-toggle" type="button" aria-label="${group.label} navigation" aria-expanded="true" aria-controls="sidebar-${workspace.id}-${group.id}" data-sidebar-group-toggle>
      <i data-lucide="${group.icon}" aria-hidden="true"></i>
      <span>${group.label}</span>
      <i class="oc-sidebar-group-chevron" data-lucide="chevron-down" aria-hidden="true"></i>
    </button>
    <div class="oc-sidebar-group-items" id="sidebar-${workspace.id}-${group.id}" data-sidebar-group-panel data-open="true" aria-hidden="false">
      <div class="oc-sidebar-group-items-inner">
        ${group.links
          .map(
            (link) => `<a class="oc-sidebar-link" href="#sidebar-${workspace.id}-${group.id}" aria-label="${link.label}"${link.current ? ' aria-current="page"' : ""}>
          <i data-lucide="${link.icon}" aria-hidden="true"></i>
          <span class="oc-sidebar-link-label">${link.label}</span>
          ${link.count ? `<span class="oc-sidebar-count">${link.count}</span>` : ""}
        </a>`,
          )
          .join("")}
      </div>
    </div>
  </section>`,
    )
    .join("")}
</div>`;
}

export function sidebarWorkbenchMarkup({
  workspace = "openclaw",
  collapsed = false,
} = {}) {
  const activeWorkspace =
    sidebarWorkspaces.find((candidate) => candidate.id === workspace) ?? sidebarWorkspaces[0];

  return `<aside class="oc-sidebar" id="component-sidebar" aria-label="Workspace" data-sidebar-workspace="${activeWorkspace.id}" data-collapsed="${collapsed}">
  <header class="oc-sidebar-header">
    <div class="oc-sidebar-workspace">
      <button class="oc-sidebar-workspace-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="component-sidebar-workspaces" data-sidebar-workspace-toggle>
        ${sidebarAvatarMarkup(
          activeWorkspace.avatarSeed,
          "",
          `role="img" aria-label="${activeWorkspace.label} workspace" data-sidebar-workspace-avatar`,
        )}
        <span class="oc-sidebar-workspace-copy">
          <strong data-sidebar-workspace-title>${activeWorkspace.label}</strong>
          <small data-sidebar-workspace-subtitle>${activeWorkspace.description}</small>
        </span>
        <i data-lucide="chevrons-up-down" aria-hidden="true"></i>
      </button>
      <div class="oc-sidebar-workspace-menu" id="component-sidebar-workspaces" role="menu" aria-label="Choose workspace" aria-hidden="true" data-open="false" data-sidebar-workspace-menu inert>
        ${sidebarWorkspaces
          .map(
            (candidate) => `<button class="oc-sidebar-workspace-option" type="button" role="menuitemradio" aria-checked="${candidate.id === activeWorkspace.id}" data-sidebar-workspace-option data-sidebar-workspace-id="${candidate.id}" data-sidebar-workspace-name="${candidate.label}" data-sidebar-workspace-description="${candidate.description}">
          ${sidebarAvatarMarkup(candidate.avatarSeed, "")}
          <span><strong>${candidate.label}</strong><small>${candidate.description}</small></span>
          <i data-lucide="check" aria-hidden="true"></i>
        </button>`,
          )
          .join("")}
      </div>
    </div>
    <button class="oc-sidebar-collapse" type="button" aria-label="${collapsed ? "Expand" : "Collapse"} sidebar" aria-expanded="${!collapsed}" aria-controls="component-sidebar" data-sidebar-collapse>
      <i data-lucide="${collapsed ? "panel-left-open" : "panel-left-close"}" aria-hidden="true"></i>
    </button>
  </header>
  <nav class="oc-sidebar-nav" aria-label="Workspace navigation">
    ${sidebarWorkspaces
      .map((candidate) =>
        sidebarWorkspacePanelMarkup(candidate, candidate.id === activeWorkspace.id),
      )
      .join("")}
  </nav>
  <footer class="oc-sidebar-footer">
    ${sidebarAvatarMarkup("Mina operator", "Mina")}
    <span class="oc-sidebar-account">
      <strong class="oc-sidebar-account-name">Mina</strong>
      <small class="oc-sidebar-account-role">Maintainer</small>
    </span>
    <button class="oc-sidebar-footer-action" type="button" aria-label="Account options">
      <i data-lucide="ellipsis" aria-hidden="true"></i>
    </button>
  </footer>
</aside>`;
}

export function heroWorkbenchMarkup({ lede = true, actions = false } = {}) {
  const ledeMarkup = lede
    ? '\n  <p class="oc-hero-lede">A shared visual introduction with consumer-owned content and actions.</p>'
    : "";
  const actionsMarkup = actions
    ? `\n  <div class="primitive-row">
    <button class="oc-action oc-action-primary" type="button">Get started</button>
    <button class="oc-action oc-action-secondary" type="button">Browse components</button>
  </div>`
    : "";

  return `<div class="oc-hero">
  <h3 class="oc-hero-title">Build the thing that builds things.</h3>${ledeMarkup}${actionsMarkup}
</div>`;
}

export function sectionWorkbenchMarkup({ eyebrow = true, copy = true, actions = true } = {}) {
  const eyebrowMarkup = eyebrow ? '\n      <p class="oc-eyebrow">Featured</p>' : "";
  const copyMarkup = copy
    ? '\n      <p class="oc-section-copy">Shared hierarchy for product sections, without owning the surrounding page.</p>'
    : "";
  const actionsMarkup = actions
    ? `\n    <a class="oc-action oc-action-secondary" href="#browse" data-workbench-inert-link>Browse <i data-lucide="arrow-right" aria-hidden="true"></i></a>`
    : "";

  return `<section class="oc-section">
  <header class="oc-section-header">
    <div class="oc-section-heading">${eyebrowMarkup}
      <h3 class="oc-section-title">Build with OpenClaw</h3>${copyMarkup}
    </div>${actionsMarkup}
  </header>
</section>`;
}

export function selectWorkbenchMarkup({ value = "balanced", disabled = false } = {}) {
  const disabledAttribute = disabled ? " disabled" : "";
  const options = selectOptions
    .map(({ label, value: optionValue }) => {
      const selected = optionValue === value ? " selected" : "";
      return `      <option value="${optionValue}"${selected}>${label}</option>`;
    })
    .join("\n");

  return `<div class="oc-field">
  <label class="oc-field-label" for="workbench-select-model">Model</label>
  <span class="oc-select-wrap">
    <select class="oc-select" id="workbench-select-model" name="model"${disabledAttribute}>
${options}
    </select>
  </span>
</div>`;
}

export function inputAreaWorkbenchMarkup({ state = "default", message = true } = {}) {
  const selected = inputAreaStates.some(({ value }) => value === state) ? state : "default";
  const examples = {
    default: {
      label: "Instructions",
      id: "workbench-input-area-default",
      name: "instructions",
      placeholder: ' placeholder="e.g. Summarize the changes and list any risks…"',
      value: "",
      help: "Markdown is supported.",
      invalid: false,
      disabled: false,
    },
    invalid: {
      label: "Project summary",
      id: "workbench-input-area-invalid",
      name: "summary",
      placeholder: "",
      value: "Short note",
      help: "Enter at least 20 characters.",
      invalid: true,
      disabled: false,
    },
    disabled: {
      label: "Archived note",
      id: "workbench-input-area-disabled",
      name: "archivedNote",
      placeholder: "",
      value: "Read-only after archival.",
      help: "",
      invalid: false,
      disabled: true,
    },
  };
  const example = examples[selected];
  const showMessage = Boolean(message && example.help);
  const disabledAttribute = example.disabled ? " disabled" : "";
  const invalidAttribute = example.invalid ? ' aria-invalid="true"' : "";
  const describedBy = showMessage ? ` aria-describedby="${example.id}-message"` : "";
  const messageMarkup = showMessage
    ? `\n  <span class="oc-field-message" id="${example.id}-message">${example.help}</span>`
    : "";

  return `<div class="oc-field">
  <label class="oc-field-label" for="${example.id}">${example.label}</label>
  <textarea class="oc-textarea" id="${example.id}" name="${example.name}"${example.placeholder} autocomplete="off"${invalidAttribute}${describedBy}${disabledAttribute}>${escapeHtml(example.value)}</textarea>${messageMarkup}
</div>`;
}

export function inputGroupWorkbenchMarkup({
  addon = "prefix",
  state = "default",
  message = true,
} = {}) {
  const selectedAddon = inputGroupAddons.some(({ value }) => value === addon) ? addon : "prefix";
  const selectedState = inputGroupStates.some(({ value }) => value === state) ? state : "default";
  if (selectedAddon === "stepper") {
    const stepperDisabled = selectedState === "disabled" ? " disabled" : "";
    const stepperMessage = message
      ? `\n  <span class="oc-field-message" id="workbench-stepper-message">Between 1 and 16 concurrent agents.</span>`
      : "";
    return `<div class="oc-field">
  <label class="oc-field-label" for="workbench-stepper">Parallel agents</label>
  <span class="oc-input-group oc-input-group-stepper">
    <button class="oc-input-group-step" type="button" aria-label="Decrease"${stepperDisabled}><i data-lucide="minus" aria-hidden="true"></i></button>
    <input class="oc-input" id="workbench-stepper" name="workbench-stepper" type="number" inputmode="numeric" value="4" min="1" max="16"${message ? ' aria-describedby="workbench-stepper-message"' : ""}${stepperDisabled} />
    <button class="oc-input-group-step" type="button" aria-label="Increase"${stepperDisabled}><i data-lucide="plus" aria-hidden="true"></i></button>
  </span>${stepperMessage}
</div>`;
  }
  const examples = {
    prefix: {
      label: "Repository",
      id: "workbench-input-group",
      name: "repository",
      type: "text",
      value: "openclaw/design-system",
      attrs: ' autocomplete="off" autocapitalize="none" spellcheck="false"',
      prefix: "github.com/",
      suffix: "",
      help: "Owner and repository path.",
      error: "Enter an owner/repository path.",
    },
    suffix: {
      label: "Timeout",
      id: "workbench-input-group",
      name: "timeout",
      type: "number",
      value: selectedState === "invalid" ? "0" : "30",
      attrs: ' min="1" autocomplete="off"',
      prefix: "",
      suffix: "seconds",
      help: "How long to wait before failing.",
      error: "Enter at least 1 second.",
    },
    both: {
      label: "Endpoint",
      id: "workbench-input-group",
      name: "endpoint",
      type: "text",
      value: "api.openclaw.ai",
      attrs: ' autocomplete="off" autocapitalize="none" spellcheck="false"',
      prefix: "https://",
      suffix: "/v1",
      help: "Host without protocol or path.",
      error: "Enter a valid host.",
    },
  };
  const example = examples[selectedAddon];
  const invalid = selectedState === "invalid";
  const disabled = selectedState === "disabled";
  const helpText = invalid ? example.error : example.help;
  const showMessage = Boolean(message && !disabled && helpText);
  const prefixId = `${example.id}-prefix`;
  const suffixId = `${example.id}-suffix`;
  const messageId = `${example.id}-message`;
  const describedBy = [
    example.prefix ? prefixId : "",
    example.suffix ? suffixId : "",
    showMessage ? messageId : "",
  ]
    .filter(Boolean)
    .join(" ");
  const describedByAttribute = describedBy ? ` aria-describedby="${describedBy}"` : "";
  const invalidAttribute = invalid ? ' aria-invalid="true"' : "";
  const disabledAttribute = disabled ? " disabled" : "";
  const prefixMarkup = example.prefix
    ? `<span class="oc-input-group-addon" id="${prefixId}">${example.prefix}</span>`
    : "";
  const suffixMarkup = example.suffix
    ? `<span class="oc-input-group-addon" id="${suffixId}">${example.suffix}</span>`
    : "";
  const messageMarkup = showMessage
    ? `\n  <span class="oc-field-message" id="${messageId}">${helpText}</span>`
    : "";

  return `<div class="oc-field">
  <label class="oc-field-label" for="${example.id}">${example.label}</label>
  <span class="oc-input-group">${prefixMarkup}<input class="oc-input" id="${example.id}" name="${example.name}" type="${example.type}" value="${escapeHtml(example.value)}"${example.attrs}${invalidAttribute}${describedByAttribute}${disabledAttribute} />${suffixMarkup}</span>${messageMarkup}
</div>`;
}

export function autocompleteWorkbenchMarkup({ value = "", disabled = false } = {}) {
  const disabledAttribute = disabled ? " disabled" : "";
  const options = autocompleteOptions
    .filter(({ value: optionValue }) => optionValue)
    .map(
      ({ value: optionValue }, index) =>
        `    <li class="oc-combobox-option" id="workbench-autocomplete-option-${index}" role="option" aria-selected="${String(optionValue === value)}" data-value="${optionValue}">${optionValue}</li>`,
    )
    .join("\n");

  return `<div class="oc-autocomplete" data-combobox data-combobox-free-entry="true">
  <label class="oc-field-label" for="workbench-autocomplete-input">Component</label>
  <div class="oc-autocomplete-field">
    <div class="oc-combobox-control">
      <span class="oc-autocomplete-icon" aria-hidden="true">${agentIcon("search")}</span>
      <input class="oc-input" id="workbench-autocomplete-input" type="text" name="component" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false" aria-controls="workbench-autocomplete-options" value="${escapeHtml(value)}" placeholder="Search components…" autocomplete="off"${disabledAttribute} />
      <button class="oc-combobox-toggle" type="button" tabindex="-1" aria-label="Toggle component suggestions" aria-expanded="false" data-combobox-toggle${disabledAttribute}></button>
    </div>
    <ul class="oc-combobox-listbox" id="workbench-autocomplete-options" role="listbox" hidden>
${options}
    </ul>
  </div>
</div>`;
}

export function toastWorkbenchMarkup({ dismissible = true, stack = "single" } = {}) {
  const messages =
    stack === "multiple"
      ? [
          ["Changes saved", "The component reference is up to date."],
          ["Build complete", "All preview routes compiled successfully."],
          ["Connection restored", "Live updates are available again."],
        ]
      : [["Changes saved", "The component reference is up to date."]];
  const toasts = messages
    .map(([title, message], index) => {
      const close = dismissible
        ? '\n    <button class="oc-toast-close" type="button" aria-label="Dismiss notification" data-workbench-toast-dismiss><i data-lucide="x"></i></button>'
        : "";
      return `<div class="oc-toast" data-toast-index="${index}">
    <div class="oc-toast-content">
      <p class="oc-toast-title">${title}</p>
      <p class="oc-toast-message">${message}</p>
    </div>${close}
  </div>`;
    })
    .join("\n");

  return `<div class="oc-toast-region" data-toast-stack="${stack}" aria-label="Notifications" aria-live="polite" aria-relevant="additions removals">
  ${toasts}
</div>`;
}

export const workbenchToastMessages = [
  ["Toast created", "This is a toast notification."],
  ["Changes saved", "The component reference is up to date."],
  ["Build complete", "All preview routes compiled successfully."],
];

export function createWorkbenchToast(document, dismissible, sequence) {
  const template = document.createElement("template");
  template.innerHTML = toastWorkbenchMarkup({ dismissible });
  const toast = template.content.querySelector(".oc-toast");
  const [title, message] = workbenchToastMessages[sequence % workbenchToastMessages.length];
  toast.querySelector(".oc-toast-title").textContent = title;
  toast.querySelector(".oc-toast-message").textContent = message;
  return toast;
}

export function animateWorkbenchToast(toast, opening) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return toast.animate(
    reduced
      ? opening
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ opacity: 1 }, { opacity: 0 }]
      : opening
        ? [
            { opacity: 0, transform: "translateY(150%)" },
            { opacity: 1, transform: "translateY(0)" },
          ]
        : [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(150%)" },
          ],
    {
      duration: reduced ? 100 : 500,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  );
}

export function sendButtonWorkbenchMarkup({ state = "idle" } = {}) {
  if (state === "streaming") {
    return `<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button>`;
  }

  const disabled = state === "idle" ? " disabled" : "";
  return `<button class="oc-agent-send-button" type="submit" data-state="${state}" aria-label="Send message"${disabled}>${agentIcon("arrow-up")}</button>`;
}

export function attachmentButtonWorkbenchMarkup({ icon = "plus" } = {}) {
  return `<button class="oc-agent-attachment-button" type="button" aria-label="Attach">${agentIcon(icon === "paperclip" ? "paperclip" : "plus")}</button>`;
}

export function agentSpinner() {
  return `<span class="oc-agent-spinner" aria-hidden="true">${agentIcon("spinner")}</span>`;
}

export function agentToolRow({
  icon = "",
  label,
  shimmer = false,
  detail = "",
  meta = "",
  panel = "",
  open = true,
} = {}) {
  const labelMarkup = shimmer
    ? `<span class="oc-agent-tool-row-label"><span class="oc-agent-text-shimmer">${label}</span></span>`
    : `<span class="oc-agent-tool-row-label">${label}</span>`;
  const iconMarkup = icon
    ? `<span class="oc-agent-tool-row-icon" aria-hidden="true">${icon}</span>`
    : "";
  const detailMarkup = detail ? `<span class="oc-agent-tool-row-detail">${detail}</span>` : "";
  const metaMarkup = meta ? `<span class="oc-agent-tool-row-meta">${meta}</span>` : "";
  if (!panel) {
    return `<div class="oc-agent-tool-row">${iconMarkup}${labelMarkup}${detailMarkup}${metaMarkup}</div>`;
  }
  const chevron = `<span class="oc-agent-tool-row-chevron" aria-hidden="true">${agentIcon("chevron-right")}</span>`;
  return `<details class="oc-agent-tool-row"${open ? " open" : ""}><summary class="oc-agent-tool-row-summary">${iconMarkup}${labelMarkup}${detailMarkup}${metaMarkup}${chevron}</summary><div class="oc-agent-tool-row-panel">${panel}</div></details>`;
}

export const emptyStates = [
  { label: "First use", value: "first-use" },
  { label: "No results", value: "no-results" },
  { label: "Recovery", value: "recovery" },
];

export function emptyWorkbenchMarkup({ state = "first-use", bordered = false } = {}) {
  const variants = {
    "first-use": {
      icon: "bookmark",
      title: "No saved views",
      description: "Save the current filters so you can return to this component set.",
      action: "Create saved view",
    },
    "no-results": {
      icon: "search-x",
      title: "No matching components",
      description: "Try removing a filter or using a broader search term.",
      action: "Clear filters",
    },
    recovery: {
      icon: "rotate-ccw",
      title: "Couldn’t load saved views",
      description: "Your filters are safe. Check the connection and try again.",
      action: "Try again",
    },
  };
  const selected = variants[state] ?? variants["first-use"];
  return `<section class="oc-empty${bordered ? " oc-empty-bordered" : ""}" aria-labelledby="workbench-empty-title" aria-describedby="workbench-empty-description">
  <div class="oc-empty-content"><span class="oc-empty-icon" aria-hidden="true"><i data-lucide="${selected.icon}"></i></span><h3 class="oc-empty-title" id="workbench-empty-title">${selected.title}</h3><p class="oc-empty-description" id="workbench-empty-description">${selected.description}</p><div class="oc-empty-actions"><button class="oc-action ${state === "recovery" ? "oc-action-secondary" : "oc-action-primary"}" type="button">${selected.action}</button></div></div>
</section>`;
}

export const segmentedTypes = [
  { label: "Toggle", value: "toggle" },
  { label: "Tabs", value: "tabs" },
  { label: "Icons", value: "icons" },
];

export function segmentedWorkbenchMarkup({ type = "toggle", selected = "preview" } = {}) {
  const options =
    type === "icons"
      ? [
          { value: "preview", label: "Preview", icon: "eye" },
          { value: "code", label: "Code", icon: "code-2" },
          { value: "tokens", label: "Tokens", icon: "palette" },
        ]
      : [
          { value: "preview", label: "Preview" },
          { value: "code", label: "Code" },
          { value: "tokens", label: "Tokens" },
        ];
  const role = type === "tabs" ? ' role="tablist"' : "";
  const items = options
    .map((option) => {
      const active = option.value === selected;
      const state =
        type === "tabs" ? `role="tab" aria-selected="${active}"` : `aria-pressed="${active}"`;
      const icon = option.icon ? `<i data-lucide="${option.icon}" aria-hidden="true"></i>` : "";
      return `<button class="oc-segmented-item" type="button" ${state} data-workbench-segmented-value="${option.value}">${icon}<span>${option.label}</span></button>`;
    })
    .join("");
  return `<div class="segmented-demo"><div class="oc-segmented" aria-label="Reference view"${role}>${items}</div><p><strong>${options.find((option) => option.value === selected)?.label ?? "Preview"}</strong><span>Selected reference view</span></p></div>`;
}

export function suggestionsWorkbenchMarkup({ disabled = false } = {}) {
  const disabledAttribute = disabled ? " disabled" : "";
  return `<div class="oc-agent-suggestions" aria-label="Suggested prompts">
  <button class="oc-agent-suggestion" type="button"${disabledAttribute} data-agent-suggestion-value="Review the current changes">Review changes</button>
  <button class="oc-agent-suggestion" type="button"${disabledAttribute} data-agent-suggestion-value="Run the validation checks">Run checks</button>
  <span class="sr-only" aria-live="polite" data-workbench-suggestion-status></span>
</div>`;
}

export function modelPickerWorkbenchMarkup({
  model = "openai/gpt-5.5",
  thinking = "high",
  fast = true,
  picker = true,
  locked = false,
  modelProvider = "recent",
  modelQuery = "",
} = {}) {
  return applicationModelControlsMarkup({
    model,
    thinking,
    fast,
    open: picker,
    locked,
    modelProvider,
    modelQuery,
  });
}

export function modeSelectorWorkbenchMarkup({ value = "agent" } = {}) {
  const active = agentModes.find((mode) => mode.value === value) ?? agentModes[0];
  const options = agentModes
    .map((mode) => {
      const checked = mode.value === active.value ? " checked" : "";
      return `<label class="oc-agent-mode-option"><input class="sr-only" type="radio" name="workbench-agent-mode" value="${mode.value}"${checked}><span class="oc-agent-mode-option-copy"><strong>${mode.label}</strong><small>${mode.value === "agent" ? "Complete tasks directly" : "Plan before making changes"}</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label>`;
    })
    .join("");
  return `<details class="oc-agent-mode-selector" data-workbench-mode-selector>
  <summary aria-label="Select mode">${agentIcon("mode")}<span data-agent-mode-label>${active.label}</span>${agentIcon("chevron")}</summary>
  <fieldset class="oc-agent-mode-menu"><legend class="sr-only">Execution mode</legend>${options}</fieldset>
</details>`;
}

export function fileAttachmentWorkbenchMarkup({
  kind = "file",
  display = "chip",
  removable = true,
} = {}) {
  const isImage = kind === "image";
  const isVideo = kind === "video";
  const effectiveDisplay = isImage && display === "image-only" ? "image-only" : "chip";
  const filename = isImage ? "interface.png" : isVideo ? "walkthrough.mp4" : "component-spec.md";
  const detail = isImage ? "842 KB" : isVideo ? "14.8 MB" : "3.1 KB";
  const remove = removable
    ? `<button class="oc-agent-file-remove" type="button" aria-label="Remove ${filename}" data-workbench-attachment-remove>${agentIcon("close")}</button>`
    : "";
  const content =
    effectiveDisplay === "image-only"
      ? `<span class="oc-agent-file-preview" role="img" aria-label="${filename}">${agentIcon("image")}</span>`
      : `<span class="oc-agent-file-type" aria-hidden="true">${agentIcon(isImage ? "image" : isVideo ? "play" : "file")}</span><span class="oc-agent-file-details"><strong>${filename}</strong><span>${detail}</span></span>`;

  return `<li class="oc-agent-file-attachment" data-display="${effectiveDisplay}" data-kind="${kind}">${content}${remove}</li>`;
}

export function errorMessageWorkbenchMarkup({ example = "interrupted" } = {}) {
  const examples = {
    interrupted: {
      title: "Something went wrong",
      message: "The connection ended before the response completed. Your draft is still available.",
    },
    "rate-limit": {
      title: "Rate limit reached",
      message: "Too many requests in a short window. Wait a moment before sending again.",
    },
  };
  const selected = examples[example] ?? examples.interrupted;

  return `<div class="oc-agent-error-message" role="alert">
  <strong>${selected.title}</strong>
  <p>${selected.message}</p>
</div>`;
}

export function toolWorkbenchMarkup({
  kind = "generic",
  state = "complete",
  open = true,
  taskTitle = "Accessibility audit",
  agentName = "Atlas",
  variant = "terminal",
} = {}) {
  const complete = state === "complete";

  if (kind === "interactive") {
    const failed = state === "failed";
    const terminalOutput = complete
      ? `<pre class="oc-agent-bash-output" role="region" aria-label="Command output" tabindex="0"><code>29 pass · 0 fail\nFinished in 312ms</code></pre>`
      : failed
        ? `<pre class="oc-agent-bash-output" role="region" aria-label="Command error" tabindex="0"><code>Error: expected application pane to fit viewport\nProcess exited with code 1</code></pre>`
        : `<p class="oc-agent-bash-progress"><span class="oc-agent-text-shimmer">Waiting for test output</span></p>`;
    const terminalAction = complete
      ? `<button type="button" aria-label="Copy command output" data-workbench-tool-copy>${agentIcon("copy")}</button>`
      : "";
    const terminal = `<div class="oc-agent-tool-card oc-agent-interactive-tool" data-variant="terminal" data-state="${state}">
  <header class="oc-agent-interactive-header"><span>${agentIcon("terminal")} Terminal</span><code>bun run check</code>${terminalAction}</header>
  <div class="oc-agent-tool-card-body oc-agent-bash-terminal"><div class="oc-agent-bash-command"><span aria-hidden="true">$ </span><code>bun run check</code></div>${terminalOutput}</div>
  <dl class="oc-agent-interactive-facts"><div><dt>cwd</dt><dd>openclaw/carapace</dd></div><div><dt>timeout</dt><dd>30s</dd></div><div><dt>env</dt><dd>CI=1</dd></div></dl>
  <span class="sr-only" aria-live="polite" data-workbench-tool-status></span>
</div>`;
    const browserAction = complete
      ? `<a href="/" target="_blank" rel="noreferrer" aria-label="Open preview in a new tab">${agentIcon("external-link")}</a>`
      : "";
    const browserContent = complete
      ? `<div class="oc-agent-interactive-preview" role="img" aria-label="Compact OpenClaw application preview">
  <aside class="oc-agent-interactive-preview-sidebar"><span class="oc-agent-interactive-preview-brand"><img src="${interactiveOpenClawMarkUrl}" alt="" /></span><span class="is-active">${agentIcon("message-square")}</span><span>${agentIcon("radio")}</span><span>${agentIcon("settings")}</span></aside>
  <section class="oc-agent-interactive-preview-content">
    <header><div><strong>Carapace parity</strong><small>Agent workspace</small></div><span>Connected</span></header>
    <div class="oc-agent-interactive-preview-thread"><p class="is-user">Make the application surfaces quieter.</p><div><span><img src="${interactiveOpenClawMarkUrl}" alt="" /></span><p>Compacted the panes and aligned the composer controls.</p></div></div>
    <footer><span>Message OpenClaw</span><i>${agentIcon("arrow-up")}</i></footer>
  </section>
</div>`
      : failed
        ? `<p class="oc-agent-interactive-state" role="alert"><strong>Preview unavailable</strong><span>The local preview did not respond.</span></p>`
        : `<p class="oc-agent-interactive-state" role="status"><span class="oc-agent-text-shimmer">Connecting to preview</span><span>Waiting for the application surface.</span></p>`;
    const browser = `<div class="oc-agent-tool-card oc-agent-interactive-tool" data-variant="browser" data-state="${state}">
  <header class="oc-agent-interactive-header"><span>${agentIcon("globe")} Preview</span><code>127.0.0.1:4173</code>${browserAction}</header>
  ${browserContent}
</div>`;
    const artifactAction = complete
      ? `<a href="${interactiveArtifactUrl}" download="application-surface.avif" aria-label="Download artifact">${agentIcon("download")}</a>`
      : "";
    const artifactContent = complete
      ? `<figure class="oc-agent-interactive-artifact"><span class="oc-agent-interactive-artifact-thumb"><img src="${interactiveArtifactUrl}" alt="Carapace application artwork preview" /></span><figcaption><strong>application-surface.avif</strong><span>1440 × 900 · 182 KB</span><small>Generated visual artifact ready to inspect or download.</small></figcaption></figure>`
      : failed
        ? `<p class="oc-agent-interactive-state" role="alert"><strong>Artifact failed</strong><span>The image renderer exited before producing a file.</span></p>`
        : `<p class="oc-agent-interactive-state" role="status"><span class="oc-agent-text-shimmer">Rendering artifact</span><span>Preparing the image preview.</span></p>`;
    const artifactTitle = complete
      ? "Generated artifact"
      : failed
        ? "Artifact generation failed"
        : "Generating artifact";
    const artifactMeta = complete ? "<span>AVIF</span>" : "";
    const artifact = `<div class="oc-agent-tool-card oc-agent-interactive-tool" data-variant="artifact" data-state="${state}">
  <header class="oc-agent-interactive-header"><span>${agentIcon("image")} ${artifactTitle}</span>${artifactMeta}${artifactAction}</header>
  ${artifactContent}
</div>`;
    const variants = { terminal, browser, artifact };
    const selectedVariant = variants[variant] ? variant : "terminal";
    const detail = {
      terminal: "bun run check",
      browser: "127.0.0.1:4173",
      artifact: "application-surface.png",
    }[selectedVariant];
    const label = {
      terminal: complete ? "Ran command" : failed ? "Command failed" : "Running command",
      browser: complete ? "Preview ready" : failed ? "Preview failed" : "Opening preview",
      artifact: complete ? "Artifact ready" : failed ? "Artifact failed" : "Generating artifact",
    }[selectedVariant];
    const iconName = { terminal: "terminal", browser: "globe", artifact: "image" }[selectedVariant];
    return `<div class="oc-agent-interactive-tool-row">${agentToolRow({
      icon: agentIcon(iconName),
      label,
      shimmer: !complete && !failed,
      detail,
      meta: complete ? "312 ms" : failed ? "exit 1" : "",
      open,
      panel: variants[selectedVariant],
    })}</div>`;
  }

  if (kind === "edit") {
    const icon = `<span class="oc-agent-tool-card-icon" aria-hidden="true">${agentIcon("file-code")}</span>`;
    const header = complete
      ? `${icon}<span class="oc-agent-tool-card-title">Edited components.css</span><span class="oc-agent-diff-stats"><span class="oc-agent-diff-add">+3</span> <span class="oc-agent-diff-remove">−1</span></span>`
      : `${icon}<span class="oc-agent-tool-card-title"><span class="oc-agent-text-shimmer">Editing components.css</span></span>${agentSpinner()}`;
    const body = complete
      ? `<div class="oc-agent-tool-card-body oc-agent-diff" role="region" aria-label="Changes to styles/components.css" tabindex="0"><div class="oc-agent-diff-line"><span>108</span><span aria-hidden="true"> </span><code>.oc-agent-tool {</code></div><div class="oc-agent-diff-line" data-kind="removed"><span>109</span><span aria-hidden="true">−</span><code>  min-height: 3rem;</code></div><div class="oc-agent-diff-line" data-kind="added"><span>109</span><span aria-hidden="true">+</span><code>  min-height: 2.25rem;</code></div><div class="oc-agent-diff-line" data-kind="added"><span>110</span><span aria-hidden="true">+</span><code>  font-size: var(--oc-font-size-sm);</code></div><div class="oc-agent-diff-line" data-kind="added"><span>111</span><span aria-hidden="true">+</span><code>  border-radius: var(--oc-radius-control);</code></div><div class="oc-agent-diff-line"><span>112</span><span aria-hidden="true"> </span><code>}</code></div></div>`
      : "";
    return `<div class="oc-agent-tool-card oc-agent-edit-tool" data-state="${state}"><header class="oc-agent-tool-card-header">${header}</header>${body}</div>`;
  }

  if (kind === "search") {
    if (!complete) {
      return `<div class="oc-agent-search-tool">${agentToolRow({ label: "Searching...", shimmer: true })}</div>`;
    }
    const card = `<div class="oc-agent-tool-card oc-agent-search-card"><header class="oc-agent-tool-card-header"><strong>Searched for</strong><span class="oc-agent-search-query">“semantic token adapter”</span></header><div class="oc-agent-search-results"><div class="oc-agent-search-result"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-search-result-title">Tailwind adapter</span><span class="oc-agent-search-result-meta">/resources/tailwind/</span></div><div class="oc-agent-search-result"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-search-result-title">Design tokens</span><span class="oc-agent-search-result-meta">/foundations/tokens/</span></div><div class="oc-agent-search-result"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-search-result-title">Consumer adapters</span><span class="oc-agent-search-result-meta">/resources/consumer-adapters/</span></div></div></div>`;
    return `<div class="oc-agent-search-tool">${agentToolRow({ label: "Found 3 results", open, panel: card })}</div>`;
  }

  if (kind === "mcp") {
    if (!complete) {
      return `<div class="oc-agent-mcp-tool">${agentToolRow({ label: "Listing resources", shimmer: true, detail: "server: workspace" })}</div>`;
    }
    const panel = `<div class="oc-agent-tool-card"><pre class="oc-agent-code-block" role="region" aria-label="MCP tool result" tabindex="0"><code>{\n  "resources": [\n    { "name": "Design tokens", "uri": "design-system://tokens" },\n    { "name": "Components", "uri": "design-system://components" }\n  ]\n}</code></pre></div>`;
    return `<div class="oc-agent-mcp-tool">${agentToolRow({ label: "Listed resources", detail: "server: workspace", open, panel })}</div>`;
  }

  if (kind === "thinking") {
    if (!complete) {
      return `<div class="oc-agent-thinking-tool">${agentToolRow({ label: "Thinking", shimmer: true })}</div>`;
    }
    const panel = `<p class="oc-agent-thinking-content">Reviewed component coverage and compatibility constraints before choosing the smallest sustainable change.</p>`;
    return `<div class="oc-agent-thinking-tool">${agentToolRow({ label: "Thought", open, panel })}</div>`;
  }

  if (kind === "subagent") {
    const failed = state === "failed";
    const timedOut = state === "timed_out";
    const statusLabel = complete
      ? "Completed task"
      : failed
        ? "Task failed"
        : timedOut
          ? "Task timed out"
          : "Running task";
    const nested = `<div class="oc-agent-subagent-panel">
  <div class="oc-agent-subagent-progress"><span style="width: ${complete ? "100" : failed || timedOut ? "72" : "58"}%"></span></div>
  <div class="oc-agent-tool-row-list">${agentToolRow({ icon: agentIcon("file"), label: "Last tool", detail: "Read styles/components.css" })}${agentToolRow({ icon: agentIcon(failed || timedOut ? "x" : "search"), label: complete ? "Transcript ready" : failed ? "Stopped after error" : timedOut ? "Stopped at timeout" : "Reviewing selectors", shimmer: !complete && !failed && !timedOut, detail: "application surfaces" })}</div>
</div>`;
    return `<div class="oc-agent-subagent-tool">${agentToolRow({
      icon: `<span class="oc-avatar oc-avatar-xs oc-avatar-pixel"><img class="oc-avatar-image" src="${avatarFixtureUrl(agentName)}" alt="" /></span>`,
      label: escapeHtml(taskTitle),
      shimmer: !complete && !failed && !timedOut,
      detail: `<span class="oc-agent-subagent-name"><span class="oc-agent-subagent-owner">${escapeHtml(agentName)}</span><small>${statusLabel}</small></span>`,
      meta: complete ? "6s" : failed ? "error" : timedOut ? "30s" : "58%",
      open,
      panel: nested,
    })}</div>`;
  }

  if (kind === "tool-group") {
    const nested = `<div class="oc-agent-tool-row-list">${agentToolRow({ icon: agentIcon("terminal"), label: complete ? "Ran command" : "Running command", shimmer: !complete, detail: "bun run check" })}${agentToolRow({ icon: agentIcon("search"), label: complete ? "Found 3 results" : "Searching", detail: "semantic tokens" })}${agentToolRow({ icon: agentIcon("file"), label: "Read file", detail: "styles/components.css" })}</div>`;
    return `<div class="oc-agent-tool-group">${agentToolRow({
      label: complete ? "Task completed" : "Running task",
      shimmer: !complete,
      detail: "1 file, 1 search, and 1 command",
      meta: complete ? "6s" : "",
      open,
      panel: nested,
    })}</div>`;
  }

  return `<div class="oc-agent-tool-row-list">${agentToolRow({
    icon: agentIcon("file"),
    label: complete ? "Read file" : "Reading file",
    shimmer: !complete,
    detail: "styles/components.css",
  })}</div>`;
}

export function todoToolWorkbenchMarkup({ status = "in_progress", display = "card" } = {}) {
  const itemState =
    status === "in_progress" ? "active" : status === "completed" ? "complete" : "pending";
  const itemPrefix =
    status === "in_progress"
      ? "In progress: "
      : status === "completed"
        ? "Completed: "
        : "Not started: ";
  const marker =
    itemState === "complete"
      ? agentIcon("check")
      : itemState === "active"
        ? agentIcon("arrow-right")
        : "";
  if (display === "bar") {
    const done = status === "completed" ? 3 : 2;
    return `<div class="oc-agent-todo-bar" role="status" aria-label="Plan progress: ${done} of 3 steps complete">
  <span class="oc-agent-todo-bar-label">Run visual check</span>
  <span class="oc-agent-todo-bar-track" aria-hidden="true"><span style="width: ${Math.round((done / 3) * 100)}%"></span></span>
  <span class="oc-agent-todo-bar-count">${done} / 3</span>
</div>`;
  }
  return `<ul class="oc-agent-todo-list">
  <li data-state="complete"><span class="oc-agent-todo-marker" aria-hidden="true">${agentIcon("check")}</span><span class="sr-only">Completed: </span><span class="oc-agent-todo-text">Inspect contract</span></li>
  <li data-state="complete"><span class="oc-agent-todo-marker" aria-hidden="true">${agentIcon("check")}</span><span class="sr-only">Completed: </span><span class="oc-agent-todo-text">Implement component</span></li>
  <li data-state="${itemState}"><span class="oc-agent-todo-marker" aria-hidden="true">${marker}</span><span class="sr-only">${itemPrefix}</span><span class="oc-agent-todo-text">Run visual check</span></li>
</ul>`;
}

export function planToolWorkbenchMarkup({
  state = "complete",
  open = true,
  approved = false,
} = {}) {
  const complete = state === "complete";
  const title = complete
    ? `<span class="oc-agent-tool-card-title">plan-working.md</span>`
    : `<span class="oc-agent-tool-card-title"><span class="oc-agent-text-shimmer">Writing plan-working.md</span></span>${agentSpinner()}`;
  const expand = `<button class="oc-agent-plan-expand" type="button" aria-label="${open ? "Collapse plan" : "Expand plan"}" aria-expanded="${open}">${agentIcon("chevrons-down")}</button>`;
  const summary = open
    ? `<div class="oc-agent-plan-summary" data-expanded="true"><p>Align structure, interaction, and accessibility with the reference while preserving the existing component contract.</p><p>Start from the shared tool row, then port the card tools and composer states before validating both themes.</p></div>`
    : `<div class="oc-agent-plan-summary"><p>Align structure, interaction, and accessibility with the reference while preserving the existing component contract.</p></div>`;
  const approve = approved
    ? `<button class="oc-agent-plan-approve" type="button" disabled>Approved</button>`
    : `<button class="oc-agent-plan-approve" type="button" data-workbench-plan-approve${complete ? "" : " disabled"}>Approve</button>`;
  return `<div class="oc-agent-tool-card oc-agent-plan-tool" data-state="${approved ? "approved" : state}">
  <header class="oc-agent-tool-card-header"><span class="oc-agent-tool-card-icon" aria-hidden="true">${agentIcon("file")}</span>${title}${expand}</header>
  <div class="oc-agent-plan-body"><p class="oc-agent-plan-title">Refine agent component previews</p>${summary}</div>
  <footer class="oc-agent-plan-footer"><button class="oc-agent-plan-read" type="button">Read detailed plan</button>${approve}</footer>
</div>`;
}

export function questionToolWorkbenchMarkup({ state = "open", allowSkip = true } = {}) {
  const answered = state === "answered";
  if (answered) {
    return `<div class="oc-agent-question-summary" data-state="answered" role="status">${agentIcon("check")}<span><strong>Focused checks</strong><small>Answer submitted</small></span></div>`;
  }
  if (state === "skipped") {
    return `<div class="oc-agent-question-summary" data-state="skipped" role="status">${agentIcon("arrow-right")}<span><strong>Question skipped</strong><small>Continuing with best judgment</small></span></div>`;
  }
  const submitting = state === "submitting";
  const failed = state === "error";
  const skip = allowSkip
    ? `<button class="oc-agent-question-skip" type="button" data-agent-question-skip${submitting ? " disabled" : ""}>Skip</button>`
    : "";
  const error = failed
    ? `<p class="oc-agent-question-error" role="alert">Answer could not be submitted. Review your answer and try again.</p>`
    : "";
  return `<form class="oc-agent-question-tool" data-workbench-question-form data-state="${state}">
  <header class="oc-agent-question-header"><span class="oc-agent-question-header-label">${agentIcon("question")}Question</span><span class="oc-agent-question-nav"><span>1 of 2</span><span class="oc-agent-question-time">0:42</span></span></header>
  <div class="oc-agent-question-body">
    ${error}
    <fieldset${submitting ? " disabled" : ""}>
      <legend class="oc-agent-question-title"><span class="oc-agent-question-badge" aria-hidden="true">1</span><span>How should we apply this change?<small>Choose the proof level that matches the current risk.</small></span></legend>
      <label class="oc-agent-question-option"><input class="sr-only" type="radio" name="workbench-scope" value="small" checked><span class="oc-agent-question-badge" aria-hidden="true">A</span><span class="oc-agent-question-option-label"><strong>Focused checks</strong><small>Fast proof for the touched component and contract.</small></span></label>
      <label class="oc-agent-question-option"><input class="sr-only" type="radio" name="workbench-scope" value="refactor"><span class="oc-agent-question-badge" aria-hidden="true">B</span><span class="oc-agent-question-option-label"><strong>Full validation</strong><small>Broader proof across preview, package, and skills.</small></span></label>
      <label class="oc-agent-question-option oc-agent-question-option-custom"><input class="sr-only" type="radio" name="workbench-scope" value="custom"><span class="oc-agent-question-badge" aria-hidden="true">C</span><span class="oc-agent-question-custom-field"><span class="sr-only">Custom answer</span><input id="workbench-question-custom" type="text" name="custom-answer" placeholder="Type your answer"></span></label>
    </fieldset>
    <div class="oc-agent-question-actions">${skip}<button class="oc-agent-question-submit" type="submit"${submitting ? " disabled" : ""}>${submitting ? "Sending…" : failed ? "Try again" : "Send answer"}</button></div>
  </div>
  <span class="sr-only" data-workbench-question-status aria-live="polite"></span>
</form>`;
}

export function composerWorkbenchMarkup({ status = "ready", disabled = false, draft = "" } = {}) {
  const isBusy = status === "streaming" || status === "submitted";
  const sendState = isBusy ? "streaming" : draft.trim() && !disabled ? "typing" : "idle";
  const disabledAttribute = disabled ? " disabled" : "";
  const action = sendButtonWorkbenchMarkup({ state: sendState });

  return `<form class="oc-agent-input-bar" data-agent-compose-form>
  <div class="oc-agent-input-container">
    <label class="sr-only" for="workbench-composer-message">Message</label>
    <textarea id="workbench-composer-message" class="oc-agent-input" rows="1" placeholder="Send a message..."${disabledAttribute}>${escapeHtml(draft)}</textarea>
    <div class="oc-agent-input-toolbar">
      <div class="oc-agent-input-tools">…</div>
      <div class="oc-agent-input-actions">${action}</div>
    </div>
  </div>
  <span class="sr-only" data-agent-compose-status aria-live="polite"></span>
</form>`;
}

export function chatResponseMarkup(status, copyToolbar, meta = false) {
  if (status === "error") {
    return `<div class="oc-agent-assistant-turn"><div class="oc-agent-error-message" role="alert"><strong>Request failed</strong><p>The response could not be completed. Your draft is still available.</p></div></div>`;
  }

  if (status === "submitted") {
    return `<div class="oc-agent-tool-row oc-agent-planning">${agentSpinner()}<span class="oc-agent-text-shimmer" role="status">Processing...</span></div>`;
  }

  if (status === "streaming") {
    return `<div class="oc-agent-assistant-turn" data-status="streaming">${agentToolRow({ icon: agentIcon("search"), label: "Searching", shimmer: true, detail: "semantic tokens" })}<div class="oc-agent-markdown"><p>Reviewing the component contract and current validation output<span class="oc-agent-streaming-cursor" aria-hidden="true"></span></p></div></div>`;
  }

  const copyButton = `<button class="oc-agent-copy-button" type="button" aria-label="Copy response" data-copy-text="The component contract is intact and ready for review.">${agentIcon("copy")}</button>`;
  const toolbar = meta
    ? `<div class="oc-agent-message-meta"><span>12.4s · 1.2k tokens · GPT-5.5</span>${copyToolbar ? copyButton : ""}</div>`
    : copyToolbar
      ? `<div class="oc-agent-message-toolbar">${copyButton}</div>`
      : "";
  return `<div class="oc-agent-assistant-turn">${agentToolRow({ icon: agentIcon("terminal"), label: "Ran command", detail: "bun run check" })}<div class="oc-agent-markdown"><p>The component contract is intact. The preview changes are local, the focused tests pass, and no exported token or component contract changed.</p></div>${toolbar}</div>`;
}

export function mediaGalleryMarkup(status) {
  const documentState =
    status === "ready"
      ? "ready"
      : status === "error"
        ? "failed"
        : status === "submitted"
          ? "queued"
          : "checking";
  return `<div class="oc-agent-media-grid">
  <figure class="oc-agent-media" data-kind="image"><span class="oc-agent-media-placeholder">${agentIcon("image")}</span><figcaption>settings-light.png</figcaption></figure>
  <figure class="oc-agent-media" data-kind="video"><span class="oc-agent-media-placeholder">${agentIcon("play")}</span><figcaption>control-ui.mp4 · 0:18</figcaption></figure>
  <figure class="oc-agent-media" data-kind="audio"><span class="oc-agent-media-placeholder">${agentIcon("audio-lines")}</span><figcaption>voice-note.m4a · 0:12</figcaption></figure>
  <figure class="oc-agent-media" data-kind="document"><span class="oc-agent-media-placeholder">${agentIcon("file")}</span><figcaption>surface-audit.pdf · ${documentState}</figcaption></figure>
</div>`;
}

export function mediaStatusMarkup(status) {
  if (status === "error") {
    return `<div class="oc-agent-media-status" data-state="error">${agentIcon("x")} Attachment inspection failed</div>`;
  }
  if (status === "ready") {
    return `<div class="oc-agent-media-status" data-state="ready">${agentIcon("check")} 4 attachments ready</div>`;
  }
  return `<div class="oc-agent-media-status" data-state="${status}"><span class="oc-loader-spinner" aria-hidden="true"></span> ${status === "submitted" ? "Queued 4 attachments" : "Inspecting 4 attachments"}</div>`;
}

export function messageListWorkbenchMarkup({
  status = "ready",
  copyToolbar = true,
  meta = false,
  mode = "direct",
  media = false,
} = {}) {
  if (mode === "collaborative") {
    const collaborationState =
      status === "error" ? "error" : status === "ready" ? "ready" : "thinking";
    return `<div class="oc-agent-message-list" role="log" aria-label="Conversation history">
  <div class="oc-agent-message-list-content">${collaborationTranscriptMarkup({
    state: collaborationState,
    elapsed: status === "ready" ? "8s" : "5s",
  })}</div>
</div>`;
  }
  if (mode === "attributed") {
    const userMessage = `<div class="oc-agent-message-bubble"><p>Can we make the application panes feel closer to the mac app?</p></div>`;
    const user = attributedMessageMarkup({
      author: "user",
      name: "Mina",
      role: "You",
      content: `${userMessage}${media ? mediaGalleryMarkup(status) : ""}`,
    });
    const agent = attributedMessageMarkup({
      name: "OpenClaw",
      role: "Assistant",
      content: `${chatResponseMarkup(status, copyToolbar, meta)}${media ? mediaStatusMarkup(status) : ""}`,
    });
    return `<div class="oc-agent-message-list" role="log" aria-label="Conversation history">
  <div class="oc-agent-message-list-content">${user}${agent}</div>
</div>`;
  }
  return `<div class="oc-agent-message-list" role="log" aria-label="Conversation history">
  <div class="oc-agent-message-list-content">
    <div class="oc-agent-turn">
      <div class="oc-agent-user-message-stack"><div class="oc-agent-user-message"><p>Is the component contract ready for review?</p></div><span class="oc-agent-message-meta">2:14 PM</span></div>
      ${chatResponseMarkup(status, copyToolbar)}
    </div>
  </div>
</div>`;
}

export function markdownWorkbenchMarkup({ example = "release" } = {}) {
  if (example === "table") {
    return `<article class="oc-agent-markdown">
  <h3>Validation results</h3>
  <p>Review the <a class="oc-link" href="../../foundations/tokens/" data-workbench-inert-link>token reference</a> before adoption.</p>
  <div class="oc-agent-markdown-table" tabindex="0" role="region" aria-label="Validation results"><table><thead><tr><th scope="col">Check</th><th scope="col">Result</th></tr></thead><tbody><tr><td>CSS contract</td><td>Passed</td></tr><tr><td>Preview build</td><td>Passed</td></tr></tbody></table></div>
</article>`;
  }

  if (example === "streaming") {
    return `<article class="oc-agent-markdown">
  <h3>Working plan</h3>
  <ul><li>Parse input context</li><li>Extract constraints</li><li>Draft the response</li></ul>
  <div class="oc-code-highlighted"><div class="oc-code-highlighted-header"><span>TypeScript</span><span>plan.ts</span></div><pre tabindex="0" aria-label="TypeScript example"><code><span class="oc-code-token-keyword">const</span> steps = [<span class="oc-code-token-string">"parse"</span>, <span class="oc-code-token-string">"outline"</span>, <span class="oc-code-token-string">"draft"</span>];</code></pre></div>
  <p>Final answer coming next…</p>
</article>`;
  }

  if (example === "long-form") {
    return `<article class="oc-agent-markdown" data-density="article">
  <h2>Application surface audit</h2>
  <p><strong>Recommendation:</strong> keep the product chrome quiet and let the active work own the visual hierarchy. The current shell is <em>too spacious</em> for repeated operator use.</p>
  <h3>What changes</h3>
  <p>Navigation moves to a compact rail, panes use stable minimum tracks, and the composer stays attached to the transcript instead of floating inside a decorative card.</p>
  <hr />
  <h3>Keyboard path</h3>
  <ol><li>Open the model picker with <kbd>⌘</kbd> <kbd>K</kbd>.</li><li>Choose provider, model, reasoning, and speed in one menu.</li><li>Return focus to the composer after selection.</li></ol>
  <blockquote><p>Animation confirms state. It never compensates for unclear structure.</p></blockquote>
</article>`;
  }

  if (example === "tasks") {
    return `<article class="oc-agent-markdown">
  <h3>Parity checklist</h3>
  <ul class="oc-agent-markdown-tasks"><li><label><input type="checkbox" checked disabled /> Compact the application chrome</label></li><li><label><input type="checkbox" checked disabled /> Bring reasoning into the model picker</label></li><li><label><input type="checkbox" disabled /> Validate the microphone permission state</label></li></ul>
  <p><del>Separate speed control</del> is retired in favor of one model-settings menu.</p>
</article>`;
  }

  return `<article class="oc-agent-markdown">
  <h2>Release notes</h2>
  <p>The component workbench now keeps examples, usage, and code in one focused view.</p>
  <h3>Included</h3>
  <ul><li><strong>Responsive previews</strong> for application surfaces</li><li>Interactive component states with reduced-motion fallbacks</li><li>Isolated light and dark themes</li></ul>
  <blockquote><p>Review both themes before adoption.</p></blockquote>
</article>`;
}

export function loaderWorkbenchMarkup({ size = "md", label = true } = {}) {
  const selected = loaderSizes.some(({ value }) => value === size) ? size : "md";
  const sizeClass = selected === "sm" ? " oc-loader-sm" : selected === "lg" ? " oc-loader-lg" : "";
  const labelText = selected === "md" ? "Syncing components…" : "Loading…";
  const labelMarkup = label ? `<span>${labelText}</span>` : `<span class="sr-only">Loading…</span>`;

  return `<span class="oc-loader${sizeClass}" role="status" aria-atomic="true">
  <span class="oc-loader-spinner" aria-hidden="true"></span>
  ${labelMarkup}
</span>`;
}

export function skeletonLineWorkbenchMarkup({ count = "3", width = "mixed" } = {}) {
  const selectedCount = skeletonLineCounts.some(({ value }) => value === count) ? count : "3";
  const selectedWidth = skeletonLineWidths.some(({ value }) => value === width) ? width : "mixed";
  const total = Number(selectedCount);
  const lines = Array.from({ length: total }, (_, index) => {
    const short = selectedWidth === "short" || (selectedWidth === "mixed" && index === total - 1);
    return `<span class="oc-skeleton-line${short ? " oc-skeleton-line-short" : ""}"></span>`;
  }).join("\n    ");

  return `<div class="workbench-skeleton-demo" aria-busy="true">
  <div class="primitive-input-grid" aria-hidden="true">
    ${lines}
  </div>
  <span class="sr-only" role="status">Content is loading…</span>
</div>`;
}

export function providerLogoMark(provider) {
  const marks = {
    openai: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.181a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.096 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.984 5.984 0 0 0 13.26 24a6.055 6.055 0 0 0 5.771-4.205 5.989 5.989 0 0 0 3.997-2.9 6.055 6.055 0 0 0-.747-7.072zM13.26 22.43a4.475 4.475 0 0 1-2.876-1.04l.141-.08 4.778-2.758a.794.794 0 0 0 .392-.681v-6.736l2.02 1.168a.071.071 0 0 1 .038.052v5.582a4.504 4.504 0 0 1-4.493 4.493zm-9.661-4.126a4.47 4.47 0 0 1-.534-3.013l.141.084 4.783 2.758a.771.771 0 0 0 .78 0l5.842-3.372v2.332a.08.08 0 0 1-.033.061L9.74 19.95a4.5 4.5 0 0 1-6.141-1.646zM2.34 7.762a4.485 4.485 0 0 1 2.365-1.972V11.6a.766.766 0 0 0 .388.676l5.814 3.354-2.02 1.168a.075.075 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.762zm16.596 3.855-5.833-3.387L15.119 7.06a.075.075 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.104v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.783-2.741a.775.775 0 0 0-.785 0L9.409 9.14V6.808a.066.066 0 0 1 .028-.061l4.83-2.786a4.499 4.499 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.163a.08.08 0 0 1-.038-.056V6.074a4.499 4.499 0 0 1 7.375-3.453l-.141.08-4.778 2.758a.794.794 0 0 0-.393.68zm1.097-2.365 2.602-1.499 2.606 1.499v2.999l-2.597 1.499-2.606-1.499z"/></svg>`,
    anthropic: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M10.45 3h3.1L20 21h-3.15l-1.48-4.45H8.63L7.15 21H4l6.45-18Zm-.92 10.78h4.94L12 6.33l-2.47 7.45Z"/></svg>`,
    gemini: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>`,
    xai: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.469 8.776 16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9 2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z"/></svg>`,
    groq: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.04 2C8.18 1.97 5.04 5 5 8.78c-.04 3.79 3.06 6.88 6.91 6.91h2.42v-2.57h-2.29a4.33 4.33 0 0 1-4.41-4.23 4.33 4.33 0 0 1 4.31-4.32h.1a4.32 4.32 0 0 1 4.36 4.28v6.3a4.32 4.32 0 0 1-4.28 4.28 4.38 4.38 0 0 1-3.07-1.25l-1.85 1.82A7 7 0 0 0 12.03 22h.09A6.93 6.93 0 0 0 19 15.18v-6.5C18.91 4.96 15.82 2 12.04 2Z"/></svg>`,
    mistral: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M3.428 3.4h3.429v3.428h3.429v3.429h3.429V6.828h3.427V3.4h3.43v13.714H24v3.429H13.714v-3.428h-3.428v-3.429h-3.43v3.428h3.43v3.429H0v-3.429h3.428V3.4zm10.286 13.715h3.428v-3.429h-3.427v3.429z" clip-rule="evenodd"/></svg>`,
    openrouter: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="4" d="M0 11.7c.7 0 3.4-.6 4.8-1.4 1.4-.8 1.4-.8 4.3-2.9 3.7-2.6 6.3-1.7 10.6-1.7M0 11.7c.7 0 3.4.6 4.8 1.4 1.4.8 1.4.8 4.3 2.9 3.7 2.6 6.3 1.7 10.6 1.7"/><path fill="currentColor" d="m24 5.7-7.2 4.2V1.5L24 5.7Zm0 12-7.2-4.2v8.4l7.2-4.2Z"/></svg>`,
    deepseek: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3.2 13.4c1.9-3.8 5.8-5.8 10.2-5.2 2.4.3 4.4 1.4 5.9 3.2.9-.2 1.8-.7 2.5-1.5-.1 2.2-1.1 3.8-3.1 4.8-.7 4-3.8 6.6-8.1 6.6-4.6 0-8-3-8.5-7.1-.1-.4.3-.7 1.1-.8Zm5 1.1a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm7.2 2.2c-1.4 1.1-3.5 1.2-5.5.2-.7-.4-1.3.5-.7 1 2.4 1.7 5.4 1.5 7.3-.1.7-.6-.4-1.6-1.1-1.1Z"/></svg>`,
    kimi: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21.72.94a2.23 2.23 0 1 1 0 4.46h-1.97a.26.26 0 0 1-.26-.26V3.17A2.23 2.23 0 0 1 21.72.94ZM9.39 13.95l8.43-8.36c.16-.16.07-.47-.14-.47h-4.54a.22.22 0 0 0-.14.06l-9.08 9.01c-.14.14-.35.02-.35-.21V5.39c0-.15-.1-.27-.22-.27H.22c-.12 0-.22.12-.22.27v18.53c0 .15.1.27.22.27h3.13c.12 0 .22-.12.22-.27v-3.78c0-.08.03-.16.08-.21l2.82-2.79c.07-.07.16-.08.24-.03l7.53 5.54a8.6 8.6 0 0 0 4.01 1.49c.12.01.23-.11.23-.27v-3.56c0-.14-.08-.25-.19-.26a6.1 6.1 0 0 1-2.35-.94l-6.52-4.72c-.14-.09-.15-.32-.03-.44Z"/></svg>`,
    perplexity: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22.4 7.09h-2.31V.07l-7.51 6.35V.16h-1.16v6.2L4.49 0v7.09H1.6v10.4h2.89V24l6.93-6.36v6.2h1.16v-6.05l6.93 6.18v-6.48h2.89V7.09Zm-3.47-4.53v4.53h-5.35l5.35-4.53ZM5.65 2.63l4.87 4.46H5.65V2.63ZM2.76 16.33V8.25h7.85l-6.12 6.11v1.97H2.76Zm2.89 5.04v-6.53l5.77-5.78v7.01l-5.77 5.3Zm12.7.03-5.77-5.15V9.06l5.77 5.78v6.56Zm2.89-5.07h-1.73v-1.97l-6.12-6.11h7.85v8.08Z"/></svg>`,
  };
  return marks[provider] ?? "";
}

export function providerLogoWorkbenchMarkup({
  size = "md",
  label = true,
  framed = false,
  state = "default",
  layout = "wrap",
} = {}) {
  const selectedSize = providerLogoSizes.some(({ value }) => value === size) ? size : "md";
  const selectedState = providerLogoStates.some(({ value }) => value === state) ? state : "default";
  const selectedLayout = providerLogoLayouts.some(({ value }) => value === layout)
    ? layout
    : "wrap";
  const sizeClass =
    selectedSize === "sm"
      ? " oc-provider-logo-sm"
      : selectedSize === "lg"
        ? " oc-provider-logo-lg"
        : "";
  const mutedClass = selectedState === "muted" ? " oc-provider-logo-muted" : "";
  const framedClass = framed ? " oc-provider-logo-framed" : "";
  const disabledAttribute = selectedState === "disabled" ? " disabled" : "";

  const items = providerLogoProviders
    .map(({ id, name, color }, index) => {
      const selected = selectedState === "selected" && index === 0;
      const selectedAttribute = selected ? ' data-selected="true"' : "";
      const labelMarkup = label ? `<span>${name}</span>` : "";
      if (selectedLayout === "marks") {
        return `<span class="oc-provider-logo oc-provider-logo-passive${sizeClass}${mutedClass}${framedClass}" title="${name}" style="--provider-brand-color:${color}" data-brand-color><span class="oc-provider-logo-mark" data-provider="${id}" aria-hidden="true">${providerLogoMark(id)}</span><span class="sr-only">${name}</span></span>`;
      }
      const model =
        {
          openai: "GPT-5.6 Sol",
          anthropic: "Claude Opus 4.6",
          gemini: "Gemini 3 Pro",
          xai: "Grok 4",
          groq: "Llama 4 Scout",
          mistral: "Mistral Large",
          openrouter: "Auto router",
          deepseek: "DeepSeek R2",
          kimi: "Kimi K2",
          perplexity: "Sonar Pro",
        }[id] ?? name;
      const content =
        selectedLayout === "picker"
          ? `<span class="provider-picker-copy"><strong>${model}</strong><small>${name}</small></span>`
          : labelMarkup;
      const nameAttribute =
        selectedLayout === "picker"
          ? ""
          : label
            ? ""
            : ` aria-label="${name}"`;
      return `<button class="oc-provider-logo${selectedLayout === "picker" ? " oc-provider-logo-picker" : ""}${sizeClass}${mutedClass}${framedClass}" type="button" aria-pressed="${selected}" style="--provider-brand-color:${color}" data-brand-color${nameAttribute}${selectedAttribute}${disabledAttribute}><span class="oc-provider-logo-mark" data-provider="${id}" aria-hidden="true">${providerLogoMark(id)}</span>${content}</button>`;
    })
    .join("");

  if (selectedLayout === "profiles") {
    const people = [
      { name: "Mina", role: "Design systems", provider: providerLogoProviders[0] },
      { name: "Atlas", role: "Agent runtime", provider: providerLogoProviders[1] },
      { name: "Sora", role: "Interface review", provider: providerLogoProviders[2] },
    ];
    const profiles = people
      .map(({ name, role, provider }, index) => {
        const selected = selectedState === "selected" && index === 0;
        const selectedAttribute = selected ? ' data-selected="true"' : "";
        const labelMarkup = label
          ? provider.name
          : `<span class="sr-only">${provider.name}</span>`;
        return `<button class="provider-profile-row${mutedClass}" type="button" aria-pressed="${selected}" style="--provider-brand-color:${provider.color}"${selectedAttribute}${disabledAttribute}>
  <span class="oc-avatar oc-avatar-sm oc-avatar-pixel"><img class="oc-avatar-image" src="${avatarFixtureUrl(name)}" alt="" /></span>
  <span class="provider-profile-copy"><strong>${name}</strong><small>${role}</small></span>
  <span class="provider-profile-affiliation oc-provider-logo${sizeClass}${mutedClass}${framedClass}" data-brand-color${selectedAttribute}><span class="oc-provider-logo-mark" data-provider="${provider.id}" aria-hidden="true">${providerLogoMark(provider.id)}</span>${labelMarkup}</span>
</button>`;
      })
      .join("");
    return `<div class="provider-logo-gallery" data-layout="profiles" aria-label="Provider affiliated profiles">${profiles}</div>`;
  }

  return `<div class="provider-logo-gallery" data-layout="${selectedLayout}" aria-label="Provider logo examples">${items}</div>`;
}

export function spiralLoaderWorkbenchMarkup({ size = "24" } = {}) {
  return `<span class="oc-agent-spiral-loader" role="status" style="width: ${size}px; height: ${size}px">
  <span class="oc-agent-spiral-ring" aria-hidden="true"></span>
  <span class="sr-only">Working</span>
</span>`;
}

export function textShimmerWorkbenchMarkup({ example = "inline" } = {}) {
  const examples = {
    inline: { text: "Syncing metadata", duration: "1.4s" },
    delayed: { text: "Calculating risk score", duration: "2.2s", delay: "0.6s" },
    fast: { text: "Rapid sync", duration: "0.9s" },
  };
  const selected = examples[example] ?? examples.inline;
  const delay = selected.delay ? `; animation-delay: ${selected.delay}` : "";

  return `<span class="oc-agent-text-shimmer" role="status" aria-live="polite" style="animation-duration: ${selected.duration}${delay}">${selected.text}</span>`;
}

export function userMessageWorkbenchMarkup({ content = "text" } = {}) {
  const examples = {
    text: {
      message: "Share the latest status.",
      attachment: "",
    },
    image: {
      message: "Here is the screenshot.",
      attachment: `<div class="oc-agent-file-attachment" data-kind="image"><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("image")}</span><span class="oc-agent-file-details"><strong>mobile-reference.png</strong><span>428 KB</span></span></div>`,
    },
    file: {
      message: "Review the attached component specification.",
      attachment: `<div class="oc-agent-file-attachment" data-kind="file"><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-file-details"><strong>component-spec.md</strong><span>3.1 KB</span></span></div>`,
    },
  };
  const selected = examples[content] ?? examples.text;

  return `<div class="oc-agent-user-message-stack">
  ${selected.attachment}
  <div class="oc-agent-user-message"><p>${selected.message}</p></div>
  <span class="oc-agent-message-meta">2:14 PM</span>
</div>`;
}

export function agentChatWorkbenchMarkup({
  example = "basic",
  status = "ready",
  copyToolbar = false,
  model = "openai/gpt-5.5",
  picker = false,
  thinking = "high",
  fast = true,
  voice = "idle",
  modelProvider = "recent",
  modelQuery = "",
  draft = "",
} = {}) {
  const isEmpty = status !== "error" && (example === "empty" || example === "suggestions");
  const transcriptMode =
    example === "multi-agent"
      ? "collaborative"
      : example === "multi-user" || example === "media"
        ? "attributed"
        : "direct";
  const messages = isEmpty
    ? ""
    : messageListWorkbenchMarkup({
        status,
        copyToolbar,
        mode: transcriptMode,
        media: example === "media",
      });
  const suggestions =
    example === "suggestions"
      ? `<div class="oc-agent-suggestions oc-agent-chat-suggestions" aria-label="Suggested prompts">
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Review the pending changes">Review changes</button>
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Run the validation checks">Run checks</button>
  </div>`
      : "";
  const attachments =
    example === "attachments"
      ? `<ul class="oc-agent-attachment-list" aria-label="Attached files"><li class="oc-agent-file-attachment" data-kind="file"><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-file-details"><strong>component-spec.md</strong><span>3.1 KB</span></span><button class="oc-agent-file-remove" type="button" aria-label="Remove component-spec.md" data-workbench-attachment-remove>${agentIcon("close")}</button></li></ul>`
      : "";
  const isBusy = status === "streaming" || status === "submitted";
  const action = applicationComposerPrimaryMarkup({ busy: isBusy, voice, camera: false });
  const composer = `<form class="oc-agent-input-bar" data-workbench-chat-form>
    <div class="oc-agent-input-container">
      ${attachments}
      <div class="oc-composer-dictation-status" data-workbench-composer-dictation-status hidden aria-live="polite"><span class="oc-composer-voice-bars" data-state="listening" aria-hidden="true">${Array.from({ length: 7 }, () => "<i></i>").join("")}</span><span>Listening… release to stop</span></div>
      <label class="sr-only" for="workbench-chat-message">Message</label>
      <textarea id="workbench-chat-message" class="oc-agent-input" rows="1" placeholder="Send a message..." data-workbench-composer-input>${escapeHtml(draft)}</textarea>
      <div class="oc-agent-input-toolbar">
        <div class="oc-agent-input-tools">
          <button class="oc-agent-attachment-button" type="button" aria-label="Attach">${agentIcon("plus")}</button>
          ${applicationTalkToggleMarkup({ voice })}
          ${applicationModelControlsMarkup({
            model,
            thinking,
            fast,
            open: picker,
            modelProvider,
            modelQuery,
          })}
        </div>
        <div class="oc-agent-input-actions">${action}</div>
      </div>
    </div>
    <span class="sr-only" data-workbench-chat-status aria-live="polite"></span>
  </form>`;

  if (isEmpty) {
    return `<section class="oc-agent-chat oc-agent-chat-empty" data-layout="compact" data-attribution="participants" data-user-name="Mina" aria-label="Agent conversation" data-agent-file-drop>
  <div class="oc-agent-drop-overlay" aria-hidden="true">${agentIcon("paperclip")}<strong>Drop files to attach</strong><span>Images, video, audio, documents, and code</span></div>
  <div class="oc-agent-chat-center">${composer}${suggestions}</div>
</section>`;
  }

  return `<section class="oc-agent-chat" data-layout="compact" data-attribution="${transcriptMode === "attributed" ? "participants" : "none"}" data-user-name="Mina" aria-label="Agent conversation" data-agent-file-drop>
  <div class="oc-agent-drop-overlay" aria-hidden="true">${agentIcon("paperclip")}<strong>Drop files to attach</strong><span>Images, video, documents, and code</span></div>
  ${messages}
  <div class="oc-agent-chat-composer">${composer}</div>
</section>`;
}

