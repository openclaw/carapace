import { agentIcon } from "./agent-components.js";
import {
  operationsApplicationMarkup,
  settingsApplicationMarkup,
  workspaceApplicationMarkup,
} from "./application-screens.js";
import { bindCombobox } from "./combobox.js";
import { buttonWorkbenchExamples } from "./component-reference.js";

export const WORKBENCH_ALL_VALUE = "__all__";

const actionVariants = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Ghost", value: "ghost" },
  { label: "Icon", value: "icon" },
];

const buttonVariants = buttonWorkbenchExamples.map(({ label, id: value }) => ({ label, value }));

const bannerTones = [
  { label: "Default", value: "default" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Information", value: "info" },
];

const selectOptions = [
  { label: "Balanced", value: "balanced" },
  { label: "Fast", value: "fast" },
  { label: "Deep", value: "deep" },
];

const inputAreaStates = [
  { label: "Default", value: "default" },
  { label: "Invalid", value: "invalid" },
  { label: "Disabled", value: "disabled" },
];

const inputGroupAddons = [
  { label: "Prefix", value: "prefix" },
  { label: "Suffix", value: "suffix" },
  { label: "Both", value: "both" },
];

const inputGroupStates = [
  { label: "Default", value: "default" },
  { label: "Invalid", value: "invalid" },
  { label: "Disabled", value: "disabled" },
];

const autocompleteOptions = [
  { label: "Empty", value: "" },
  { label: "Action", value: "Action" },
  { label: "Card", value: "Card" },
  { label: "Input", value: "Input" },
  { label: "Select", value: "Select" },
];

const composerStatuses = [
  { label: "Ready", value: "ready" },
  { label: "Submitted", value: "submitted" },
  { label: "Streaming", value: "streaming" },
];

const sendButtonStates = [
  { label: "Idle", value: "idle" },
  { label: "Typing", value: "typing" },
  { label: "Streaming", value: "streaming" },
];

const attachmentButtonIcons = [
  { label: "Plus", value: "plus" },
  { label: "Paperclip", value: "paperclip" },
];

const attachmentKinds = [
  { label: "File", value: "file" },
  { label: "Image", value: "image" },
];

const attachmentDisplays = [
  { label: "Chip", value: "chip" },
  { label: "Image only", value: "image-only" },
];

const errorMessageExamples = [
  { label: "Interrupted", value: "interrupted" },
  { label: "Rate limit", value: "rate-limit" },
];

const agentModels = [
  { label: "GPT-5.6 Fast · 5.6", value: "gpt-5-6-fast" },
  { label: "Extra High · 5.6 Sol", value: "extra-high" },
  { label: "GPT-5.6 · 5.6", value: "gpt-5-6" },
];

const agentModes = [
  { label: "Agent", value: "agent" },
  { label: "Plan", value: "plan" },
];

const toolLifecycleStates = [
  { label: "Running", value: "animating" },
  { label: "Complete", value: "complete" },
];

const todoItemStates = [
  { label: "Pending", value: "pending" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

const questionStates = [
  { label: "Open", value: "open" },
  { label: "Answered", value: "answered" },
];

const chatExamples = [
  { label: "Basic", value: "basic" },
  { label: "Empty", value: "empty" },
  { label: "Suggestions", value: "suggestions" },
  { label: "Attachments", value: "attachments" },
];

const chatStatuses = [
  { label: "Ready", value: "ready" },
  { label: "Submitted", value: "submitted" },
  { label: "Streaming", value: "streaming" },
  { label: "Error", value: "error" },
];

const markdownExamples = [
  { label: "Release notes", value: "release" },
  { label: "Table and links", value: "table" },
  { label: "Streaming update", value: "streaming" },
];

const loaderSizes = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const skeletonLineCounts = [
  { label: "One", value: "1" },
  { label: "Three", value: "3" },
  { label: "Five", value: "5" },
];

const skeletonLineWidths = [
  { label: "Full", value: "full" },
  { label: "Mixed", value: "mixed" },
  { label: "Short", value: "short" },
];

const providerLogoSizes = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const providerLogoLayouts = [
  { label: "Wrap", value: "wrap" },
  { label: "Row", value: "row" },
  { label: "Stack", value: "stack" },
];

const providerLogoStates = [
  { label: "Default", value: "default" },
  { label: "Selected", value: "selected" },
  { label: "Muted", value: "muted" },
];

const providerLogoProviders = [
  { id: "openai", name: "OpenAI" },
  { id: "gemini", name: "Gemini" },
  { id: "xai", name: "xAI" },
];

const spiralLoaderSizes = [
  { label: "Small", value: "16" },
  { label: "Medium", value: "24" },
  { label: "Large", value: "32" },
];

const textShimmerExamples = [
  { label: "Inline status", value: "inline" },
  { label: "Delayed shimmer", value: "delayed" },
  { label: "Fast shimmer", value: "fast" },
];

const userMessageContent = [
  { label: "Text only", value: "text" },
  { label: "With image", value: "image" },
  { label: "With file", value: "file" },
];

const gridColumns = [
  { label: "Auto", value: "auto" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const gridItemCounts = [
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "6", value: "6" },
];

const gridItemLabels = ["Foundations", "Components", "Resources", "Tokens", "Themes", "Patterns"];

const linkVariants = [
  { label: "Inline", value: "inline" },
  { label: "Muted", value: "muted" },
  { label: "Standalone", value: "standalone" },
];

const applicationNavigationModes = [
  { label: "Expanded", value: "expanded" },
  { label: "Compact", value: "compact" },
];

const applicationDensities = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" },
];

const applicationConnectionStates = [
  { label: "Ready", value: "ready" },
  { label: "Offline", value: "offline" },
];

const applicationOperationViews = [
  { label: "Channels", value: "channels" },
  { label: "Automation", value: "automation" },
];

const applicationOperationStates = [
  { label: "Ready", value: "ready" },
  { label: "Loading", value: "loading" },
  { label: "Error", value: "error" },
];

const applicationDockModes = [
  { label: "Right", value: "right" },
  { label: "Bottom", value: "bottom" },
  { label: "Hidden", value: "hidden" },
];

const applicationSessionStates = [
  { label: "Active", value: "active" },
  { label: "Idle", value: "idle" },
  { label: "Error", value: "error" },
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function compactIconMarkup(markup) {
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

const clipboardActionVariants = [
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

export function bannerWorkbenchMarkup({ tone = "warning", action = true } = {}) {
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
    ? '\n  <button class="oc-action oc-action-secondary" type="button">Review</button>'
    : "";

  return `<div class="oc-banner${modifier}" role="status">
  <span class="oc-banner-indicator" aria-hidden="true"></span>
  <div class="oc-banner-content">
    <strong class="oc-banner-title">${selected.title}</strong>
    <p>${selected.message}</p>
  </div>${adjacentAction}
</div>`;
}

export function tableWorkbenchMarkup({ interactive = false } = {}) {
  const records = [
    { component: "Button", status: "Stable", updated: "Today" },
    { component: "Dialog", status: "Stable", updated: "Yesterday" },
    { component: "Table", status: "Draft", updated: "Now" },
  ];
  const actionHeader = interactive ? '<th scope="col">Action</th>' : "";
  const rows = records
    .map(({ component, status, updated }) => {
      const action = interactive
        ? `<td><button class="oc-action oc-action-ghost" type="button" aria-label="Open ${component}">Open</button></td>`
        : "";
      return `<tr><td>${component}</td><td>${status}</td><td>${updated}</td>${action}</tr>`;
    })
    .join("\n      ");
  const modifier = interactive ? " oc-table-interactive" : "";
  const caption = interactive
    ? "Component status, most recent update, and available actions"
    : "Component status and most recent update";

  return `<div class="oc-table-wrap" role="region" aria-label="Component status" tabindex="0">
  <table class="oc-table${modifier}">
    <caption class="sr-only">${caption}</caption>
    <thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Updated</th>${actionHeader}</tr></thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>`;
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

export function linkWorkbenchMarkup({ variant = "inline", disabled = false } = {}) {
  const examples = {
    inline: {
      label: "Inline link",
      href: "/foundations/",
      className: "oc-link",
    },
    muted: {
      label: "Muted link",
      href: "/resources/",
      className: "oc-link oc-link-muted",
    },
    standalone: {
      label: "Browse components",
      href: "/components/",
      className: "oc-link oc-link-standalone",
    },
  };
  const selected = examples[variant] ?? examples.inline;

  if (disabled) {
    return `<a class="${selected.className}" role="link" aria-disabled="true" tabindex="-1">${selected.label}</a>`;
  }

  return `<a class="${selected.className}" href="${selected.href}" data-workbench-inert-link>${selected.label}</a>`;
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

const workbenchToastMessages = [
  ["Toast created", "This is a toast notification."],
  ["Changes saved", "The component reference is up to date."],
  ["Build complete", "All preview routes compiled successfully."],
];

function createWorkbenchToast(document, dismissible, sequence) {
  const template = document.createElement("template");
  template.innerHTML = toastWorkbenchMarkup({ dismissible });
  const toast = template.content.querySelector(".oc-toast");
  const [title, message] = workbenchToastMessages[sequence % workbenchToastMessages.length];
  toast.querySelector(".oc-toast-title").textContent = title;
  toast.querySelector(".oc-toast-message").textContent = message;
  return toast;
}

function animateWorkbenchToast(toast, opening) {
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

function agentSpinner() {
  return `<span class="oc-agent-spinner" aria-hidden="true">${agentIcon("spinner")}</span>`;
}

function agentToolRow({
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

const emptyStates = [
  { label: "First use", value: "first-use" },
  { label: "No results", value: "no-results" },
  { label: "Recovery", value: "recovery" },
];

function emptyWorkbenchMarkup({ state = "first-use", bordered = false } = {}) {
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

const segmentedTypes = [
  { label: "Toggle", value: "toggle" },
  { label: "Tabs", value: "tabs" },
  { label: "Icons", value: "icons" },
];

function segmentedWorkbenchMarkup({ type = "toggle", selected = "preview" } = {}) {
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

export function modelPickerWorkbenchMarkup({ value = "extra-high" } = {}) {
  const active = agentModels.find((model) => model.value === value) ?? agentModels[1];
  const [activeName, activeVersion] = active.label.split(" · ");
  const options = agentModels
    .map(({ label, value: optionValue }) => {
      const [name, version] = label.split(" · ");
      const checked = optionValue === value ? " checked" : "";
      return `<label class="oc-agent-model-option"><input class="sr-only" type="radio" name="workbench-agent-model" value="${optionValue}"${checked}><span class="oc-agent-model-option-copy">${name} <small>${version}</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label>`;
    })
    .join("");
  return `<details class="oc-agent-model-picker" data-workbench-model-picker>
  <summary aria-label="Select model"><strong>${activeName}</strong><span>${activeVersion}</span>${agentIcon("chevron")}</summary>
  <fieldset class="oc-agent-model-menu"><legend class="sr-only">Model</legend>${options}</fieldset>
</details>`;
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
  const effectiveDisplay = isImage && display === "image-only" ? "image-only" : "chip";
  const filename = isImage ? "interface.png" : "component-spec.md";
  const detail = isImage ? "842 KB" : "3.1 KB";
  const remove = removable
    ? `<button class="oc-agent-file-remove" type="button" aria-label="Remove ${filename}" data-workbench-attachment-remove>${agentIcon("close")}</button>`
    : "";
  const content =
    effectiveDisplay === "image-only"
      ? `<span class="oc-agent-file-preview" role="img" aria-label="${filename}">${agentIcon("image")}</span>`
      : `<span class="oc-agent-file-type" aria-hidden="true">${agentIcon(isImage ? "image" : "file")}</span><span class="oc-agent-file-details"><strong>${filename}</strong><span>${detail}</span></span>`;

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

export function toolWorkbenchMarkup({ kind = "generic", state = "complete", open = true } = {}) {
  const complete = state === "complete";

  if (kind === "bash") {
    const header = complete
      ? `<span class="oc-agent-tool-card-title">Ran command: bun</span>`
      : `<span class="oc-agent-tool-card-title"><span class="oc-agent-text-shimmer">Running command: bun</span></span>${agentSpinner()}`;
    const output = complete
      ? `<pre class="oc-agent-bash-output" role="region" aria-label="Command output" tabindex="0"><code>29 pass · 0 fail\nFinished in 312ms</code></pre>`
      : "";
    return `<div class="oc-agent-tool-card oc-agent-bash-tool" data-state="${state}"><header class="oc-agent-tool-card-header">${header}</header><div class="oc-agent-tool-card-body oc-agent-bash-terminal"><div class="oc-agent-bash-command"><span aria-hidden="true">$ </span><code>bun run check</code></div>${output}</div></div>`;
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
    const nested = `<div class="oc-agent-tool-row-list">${agentToolRow({ icon: agentIcon("file"), label: "Read file", detail: "styles/components.css" })}${agentToolRow({ icon: agentIcon("search"), label: complete ? "Grep" : "Grepping", shimmer: !complete, detail: "aria-label" })}</div>`;
    return `<div class="oc-agent-subagent-tool">${agentToolRow({
      label: complete ? "Completed Subagent" : "Running Subagent",
      shimmer: !complete,
      detail: "Audit component accessibility",
      meta: complete ? "6s" : "",
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

export function todoToolWorkbenchMarkup({ status = "in_progress" } = {}) {
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
    return `<form class="oc-agent-question-tool" data-workbench-question-form data-state="answered">
  <header class="oc-agent-question-header"><span class="oc-agent-question-header-label">${agentIcon("question")}Question</span><span class="oc-agent-question-nav">1 of 1</span></header>
  <div class="oc-agent-question-body"><p class="oc-agent-question-answered" role="status">Answered · Small scoped patch</p></div>
</form>`;
  }
  const skip = allowSkip
    ? `<button class="oc-agent-question-skip" type="button" data-agent-question-skip>Skip</button>`
    : "";
  return `<form class="oc-agent-question-tool" data-workbench-question-form>
  <header class="oc-agent-question-header"><span class="oc-agent-question-header-label">${agentIcon("question")}Question</span><span class="oc-agent-question-nav">1 of 1</span></header>
  <div class="oc-agent-question-body">
    <fieldset>
      <legend class="oc-agent-question-title"><span class="oc-agent-question-badge" aria-hidden="true">1</span>How should we apply this change?</legend>
      <label class="oc-agent-question-option"><input class="sr-only" type="radio" name="workbench-scope" value="small" checked><span class="oc-agent-question-badge" aria-hidden="true">A</span><span class="oc-agent-question-option-label">Small scoped patch</span></label>
      <label class="oc-agent-question-option"><input class="sr-only" type="radio" name="workbench-scope" value="refactor"><span class="oc-agent-question-badge" aria-hidden="true">B</span><span class="oc-agent-question-option-label">Full refactor</span></label>
      <label class="oc-agent-question-option oc-agent-question-option-custom"><input class="sr-only" type="radio" name="workbench-scope" value="custom"><span class="oc-agent-question-badge" aria-hidden="true">C</span><span class="oc-agent-question-custom-field"><span class="sr-only">Custom answer</span><input id="workbench-question-custom" type="text" name="custom-answer" placeholder="Type your answer"></span></label>
    </fieldset>
    <div class="oc-agent-question-actions">${skip}<button class="oc-agent-question-submit" type="submit">Send</button></div>
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

function chatResponseMarkup(status, copyToolbar) {
  if (status === "error") {
    return `<div class="oc-agent-assistant-turn"><div class="oc-agent-error-message" role="alert"><strong>Request failed</strong><p>The response could not be completed. Your draft is still available.</p></div></div>`;
  }

  if (status === "submitted") {
    return `<div class="oc-agent-tool-row oc-agent-planning">${agentSpinner()}<span class="oc-agent-text-shimmer" role="status">Processing...</span></div>`;
  }

  if (status === "streaming") {
    return `<div class="oc-agent-assistant-turn" data-status="streaming">${agentToolRow({ icon: agentIcon("search"), label: "Searching", shimmer: true, detail: "semantic tokens" })}<div class="oc-agent-markdown"><p>Reviewing the component contract and current validation output<span class="oc-agent-streaming-cursor" aria-hidden="true"></span></p></div></div>`;
  }

  const toolbar = copyToolbar
    ? `<div class="oc-agent-message-toolbar"><button class="oc-agent-copy-button" type="button" aria-label="Copy response" data-copy-text="The component contract is intact and ready for review.">${agentIcon("copy")}</button></div>`
    : "";
  return `<div class="oc-agent-assistant-turn">${agentToolRow({ icon: agentIcon("terminal"), label: "Ran command", detail: "bun run check" })}<div class="oc-agent-markdown"><p>The component contract is intact. The preview changes are local, the focused tests pass, and no exported token or component contract changed.</p></div>${toolbar}</div>`;
}

export function messageListWorkbenchMarkup({ status = "ready", copyToolbar = true } = {}) {
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
  <p>Review the <a href="../../foundations/tokens/" data-workbench-inert-link>token reference</a> before adoption.</p>
  <div class="oc-agent-markdown-table" tabindex="0" role="region" aria-label="Validation results"><table><thead><tr><th scope="col">Check</th><th scope="col">Result</th></tr></thead><tbody><tr><td>CSS contract</td><td>Passed</td></tr><tr><td>Preview build</td><td>Passed</td></tr></tbody></table></div>
</article>`;
  }

  if (example === "streaming") {
    return `<article class="oc-agent-markdown">
  <h3>Working plan</h3>
  <ul><li>Parse input context</li><li>Extract constraints</li><li>Draft the response</li></ul>
  <pre><code>const steps = ["parse", "outline", "draft"];</code></pre>
  <p>Final answer coming next…</p>
</article>`;
  }

  return `<article class="oc-agent-markdown">
  <h3>Release notes</h3>
  <p>The component workbench now keeps examples, usage, and code in one focused view.</p>
  <ul><li>Responsive canvas previews</li><li>Interactive component states</li><li>Isolated light and dark themes</li></ul>
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

function providerLogoMark(provider) {
  const marks = {
    openai: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.181a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.096 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.984 5.984 0 0 0 13.26 24a6.055 6.055 0 0 0 5.771-4.205 5.989 5.989 0 0 0 3.997-2.9 6.055 6.055 0 0 0-.747-7.072zM13.26 22.43a4.475 4.475 0 0 1-2.876-1.04l.141-.08 4.778-2.758a.794.794 0 0 0 .392-.681v-6.736l2.02 1.168a.071.071 0 0 1 .038.052v5.582a4.504 4.504 0 0 1-4.493 4.493zm-9.661-4.126a4.47 4.47 0 0 1-.534-3.013l.141.084 4.783 2.758a.771.771 0 0 0 .78 0l5.842-3.372v2.332a.08.08 0 0 1-.033.061L9.74 19.95a4.5 4.5 0 0 1-6.141-1.646zM2.34 7.762a4.485 4.485 0 0 1 2.365-1.972V11.6a.766.766 0 0 0 .388.676l5.814 3.354-2.02 1.168a.075.075 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.762zm16.596 3.855-5.833-3.387L15.119 7.06a.075.075 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.104v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.783-2.741a.775.775 0 0 0-.785 0L9.409 9.14V6.808a.066.066 0 0 1 .028-.061l4.83-2.786a4.499 4.499 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.163a.08.08 0 0 1-.038-.056V6.074a4.499 4.499 0 0 1 7.375-3.453l-.141.08-4.778 2.758a.794.794 0 0 0-.393.68zm1.097-2.365 2.602-1.499 2.606 1.499v2.999l-2.597 1.499-2.606-1.499z"/></svg>`,
    gemini: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>`,
    xai: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.469 8.776 16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9 2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z"/></svg>`,
  };
  return marks[provider] ?? "";
}

export function providerLogoWorkbenchMarkup({
  size = "md",
  label = true,
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
  const disabledAttribute = selectedState === "muted" ? ' aria-disabled="true"' : "";

  const items = providerLogoProviders
    .map(({ id, name }, index) => {
      const selectedAttribute =
        selectedState === "selected" && index === 0 ? ' data-selected="true"' : "";
      const labelMarkup = label ? `<span>${name}</span>` : "";
      const nameAttribute = label ? "" : ` aria-label="${name}"`;
      return `<span class="oc-provider-logo${sizeClass}${mutedClass}"${nameAttribute}${selectedAttribute}${disabledAttribute}><span class="oc-provider-logo-mark" data-provider="${id}" aria-hidden="true">${providerLogoMark(id)}</span>${labelMarkup}</span>`;
    })
    .join("");

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
} = {}) {
  const isEmpty = status !== "error" && (example === "empty" || example === "suggestions");
  const messages = isEmpty ? "" : messageListWorkbenchMarkup({ status, copyToolbar });
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
  const action = isBusy
    ? `<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button>`
    : `<button class="oc-agent-send-button" type="submit" data-state="idle" aria-label="Send message">${agentIcon("arrow-up")}</button>`;
  const composer = `<form class="oc-agent-input-bar" data-workbench-chat-form>
    <div class="oc-agent-input-container">
      ${attachments}<label class="sr-only" for="workbench-chat-message">Message</label>
      <textarea id="workbench-chat-message" class="oc-agent-input" rows="1" placeholder="Send a message..."></textarea>
      <div class="oc-agent-input-toolbar">
        <div class="oc-agent-input-tools"><button class="oc-agent-attachment-button" type="button" aria-label="Attach">${agentIcon("plus")}</button></div>
        <div class="oc-agent-input-actions">${action}</div>
      </div>
    </div>
    <span class="sr-only" data-workbench-chat-status aria-live="polite"></span>
  </form>`;

  if (isEmpty) {
    return `<section class="oc-agent-chat oc-agent-chat-empty" aria-label="Agent conversation">
  <div class="oc-agent-chat-center">${composer}${suggestions}</div>
</section>`;
  }

  return `<section class="oc-agent-chat" aria-label="Agent conversation">
  ${messages}
  <div class="oc-agent-chat-composer">${composer}</div>
</section>`;
}

function createToolWorkbenchDefinition(kind) {
  const expandable = !["bash", "edit", "generic"].includes(kind);
  return {
    defaults: expandable ? { state: "complete", open: true } : { state: "complete" },
    controls: [
      {
        id: "state",
        label: "State",
        type: "choice",
        options: toolLifecycleStates,
      },
      ...(expandable
        ? [
            {
              id: "open",
              label: "Open",
              type: "toggle",
            },
          ]
        : []),
    ],
    markup(state) {
      return compactIconMarkup(toolWorkbenchMarkup({ kind, ...state }));
    },
    render(specimen, state) {
      specimen.innerHTML = toolWorkbenchMarkup({ kind, ...state });
    },
  };
}

function bindApplicationNavigation(specimen, state, update) {
  specimen
    .querySelector("[data-workbench-application-navigation]")
    ?.addEventListener("click", () => {
      update("navigation", state.navigation === "compact" ? "expanded" : "compact");
    });
}

const definitions = {
  "application-settings": {
    defaults: {
      navigation: "expanded",
      density: "comfortable",
      state: "ready",
    },
    controls: [
      {
        id: "navigation",
        label: "Navigation",
        type: "choice",
        options: applicationNavigationModes,
      },
      {
        id: "density",
        label: "Density",
        type: "choice",
        options: applicationDensities,
      },
      {
        id: "state",
        label: "Connection",
        type: "choice",
        options: applicationConnectionStates,
      },
    ],
    markup: settingsApplicationMarkup,
    render(specimen, state) {
      specimen.innerHTML = settingsApplicationMarkup(state);
    },
    bind(specimen, state, update) {
      bindApplicationNavigation(specimen, state, update);
      const densityButtons = specimen.querySelectorAll(
        '.oc-segmented[aria-label="Interface density"] .oc-segmented-item',
      );
      densityButtons.forEach((button) => {
        button.addEventListener("click", () => {
          update(
            "density",
            button.textContent?.trim().toLowerCase() === "compact" ? "compact" : "comfortable",
          );
        });
      });
    },
  },
  "application-operations": {
    defaults: {
      view: "channels",
      state: "ready",
      navigation: "expanded",
    },
    controls: [
      {
        id: "view",
        label: "View",
        type: "choice",
        options: applicationOperationViews,
      },
      {
        id: "state",
        label: "State",
        type: "choice",
        options: applicationOperationStates,
      },
      {
        id: "navigation",
        label: "Navigation",
        type: "choice",
        options: applicationNavigationModes,
      },
    ],
    markup: operationsApplicationMarkup,
    render(specimen, state) {
      specimen.innerHTML = operationsApplicationMarkup(state);
    },
    bind(specimen, state, update) {
      bindApplicationNavigation(specimen, state, update);
      specimen.querySelectorAll("[data-workbench-application-view]").forEach((button) => {
        button.addEventListener("click", () => {
          update("view", button.dataset.workbenchApplicationView);
        });
      });
    },
  },
  "application-workspace": {
    defaults: {
      dock: "right",
      status: "active",
      navigation: "compact",
    },
    controls: [
      {
        id: "dock",
        label: "Inspector dock",
        type: "choice",
        options: applicationDockModes,
      },
      {
        id: "status",
        label: "Session",
        type: "choice",
        options: applicationSessionStates,
      },
      {
        id: "navigation",
        label: "Navigation",
        type: "choice",
        options: applicationNavigationModes,
      },
    ],
    markup(state) {
      return workspaceApplicationMarkup({
        ...state,
        inspector: state.dock !== "hidden",
      });
    },
    render(specimen, state) {
      specimen.innerHTML = workspaceApplicationMarkup({
        ...state,
        inspector: state.dock !== "hidden",
      });
    },
    bind(specimen, state, update) {
      bindApplicationNavigation(specimen, state, update);
      specimen
        .querySelector("[data-workbench-application-inspector-hide]")
        ?.addEventListener("click", () => update("dock", "hidden"));
      specimen.querySelector("[data-workbench-application-dock]")?.addEventListener("click", () => {
        update("dock", state.dock === "right" ? "bottom" : "right");
      });
    },
  },
  "agent-chat": {
    defaults: { example: "basic", status: "ready", copyToolbar: false },
    controls: [
      {
        id: "example",
        label: "Example",
        type: "choice",
        options: chatExamples,
      },
      {
        id: "status",
        label: "Status",
        type: "choice",
        options: chatStatuses,
      },
      {
        id: "copyToolbar",
        label: "Copy toolbar",
        type: "toggle",
      },
    ],
    markup(state) {
      return compactIconMarkup(agentChatWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = agentChatWorkbenchMarkup(state);
    },
    bind(specimen, state, update) {
      const input = specimen.querySelector(".oc-agent-input");
      const status = specimen.querySelector("[data-workbench-chat-status]");
      specimen.querySelectorAll("[data-agent-suggestion-value]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!input) return;
          input.value = button.dataset.agentSuggestionValue;
          input.focus();
        });
      });
      specimen.querySelector("[data-workbench-chat-form]")?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!input?.value.trim()) return;
        input.value = "";
        if (status) status.textContent = "Message sent";
      });
      specimen.querySelector('[aria-label="Stop response"]')?.addEventListener("click", () => {
        update("status", "ready");
      });
      specimen
        .querySelector("[data-workbench-attachment-remove]")
        ?.addEventListener("click", (event) => {
          event.currentTarget.closest(".oc-agent-file-attachment")?.remove();
        });
    },
  },
  "message-list": {
    defaults: { status: "ready", copyToolbar: true },
    controls: [
      {
        id: "status",
        label: "Status",
        type: "choice",
        options: chatStatuses,
      },
      {
        id: "copyToolbar",
        label: "Copy toolbar",
        type: "toggle",
      },
    ],
    markup(state) {
      return compactIconMarkup(messageListWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = messageListWorkbenchMarkup(state);
    },
  },
  markdown: {
    defaults: { example: "release" },
    controls: [
      {
        id: "example",
        label: "Example",
        type: "choice",
        compare: "stack",
        options: markdownExamples,
      },
    ],
    markup: markdownWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = markdownWorkbenchMarkup(state);
    },
  },
  "spiral-loader": {
    defaults: { size: "24" },
    controls: [
      {
        id: "size",
        label: "Size",
        type: "choice",
        compare: "rows",
        options: spiralLoaderSizes,
      },
    ],
    markup: spiralLoaderWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = spiralLoaderWorkbenchMarkup(state);
    },
  },
  "text-shimmer": {
    defaults: { example: "inline" },
    controls: [
      {
        id: "example",
        label: "Example",
        type: "choice",
        compare: "stack",
        options: textShimmerExamples,
      },
    ],
    markup: textShimmerWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = textShimmerWorkbenchMarkup(state);
    },
  },
  "user-message": {
    defaults: { content: "text" },
    controls: [
      {
        id: "content",
        label: "Content",
        type: "choice",
        compare: "stack",
        options: userMessageContent,
      },
    ],
    markup(state) {
      return compactIconMarkup(userMessageWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = userMessageWorkbenchMarkup(state);
    },
  },
  "bash-tool": createToolWorkbenchDefinition("bash"),
  "edit-tool": createToolWorkbenchDefinition("edit"),
  "generic-tool": createToolWorkbenchDefinition("generic"),
  "mcp-tool": createToolWorkbenchDefinition("mcp"),
  "search-tool": createToolWorkbenchDefinition("search"),
  "thinking-tool": createToolWorkbenchDefinition("thinking"),
  "subagent-tool": createToolWorkbenchDefinition("subagent"),
  "tool-group": createToolWorkbenchDefinition("tool-group"),
  "todo-tool": {
    defaults: { status: "in_progress" },
    controls: [
      {
        id: "status",
        label: "Current item",
        type: "choice",
        options: todoItemStates,
      },
    ],
    markup: todoToolWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = todoToolWorkbenchMarkup(state);
    },
  },
  "plan-tool": {
    defaults: { state: "complete", open: true, approved: false },
    controls: [
      {
        id: "state",
        label: "State",
        type: "choice",
        options: toolLifecycleStates,
      },
      {
        id: "open",
        label: "Open",
        type: "toggle",
      },
      {
        id: "approved",
        label: "Approved",
        type: "toggle",
      },
    ],
    markup(state) {
      return compactIconMarkup(planToolWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = planToolWorkbenchMarkup(state);
    },
    bind(specimen, _state, update) {
      specimen.querySelector("[data-workbench-plan-approve]")?.addEventListener("click", () => {
        update("approved", true);
      });
    },
  },
  "question-tool": {
    defaults: { state: "open", allowSkip: true },
    controls: [
      {
        id: "state",
        label: "State",
        type: "choice",
        options: questionStates,
      },
      {
        id: "allowSkip",
        label: "Allow skip",
        type: "toggle",
      },
    ],
    markup(state) {
      return compactIconMarkup(questionToolWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = questionToolWorkbenchMarkup(state);
    },
    bind(specimen, _state, update) {
      specimen
        .querySelector("[data-workbench-question-form]")
        ?.addEventListener("submit", (event) => {
          event.preventDefault();
          update("state", "answered");
        });
      specimen.querySelector("[data-agent-question-skip]")?.addEventListener("click", () => {
        update("state", "answered");
      });
      for (const custom of specimen.querySelectorAll(".oc-agent-question-option-custom")) {
        const radio = custom.querySelector('input[type="radio"]');
        const field = custom.querySelector('input[type="text"]');
        if (!radio || !field) continue;
        const selectCustom = () => {
          if (!radio.checked) radio.checked = true;
        };
        field.addEventListener("focus", selectCustom);
        field.addEventListener("input", selectCustom);
      }
    },
  },
  "primitive-app-surface": {
    defaults: { toolbar: true, card: true },
    controls: [
      {
        id: "toolbar",
        label: "Toolbar",
        type: "toggle",
      },
      {
        id: "card",
        label: "Card",
        type: "toggle",
      },
    ],
    markup(state) {
      return `<main class="oc-app-surface">
${appSurfaceWorkbenchMarkup(state)}
</main>`;
    },
    render(specimen, state) {
      specimen.innerHTML = appSurfaceWorkbenchMarkup(state);
    },
  },
  "primitive-action": {
    defaults: { variant: "primary" },
    controls: [
      {
        id: "variant",
        label: "Variant",
        type: "choice",
        compare: "rows",
        options: actionVariants,
      },
    ],
    markup: actionWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = `<div class="primitive-row">${actionWorkbenchMarkup(state)}</div>`;
    },
  },
  "primitive-button": {
    defaults: { variant: WORKBENCH_ALL_VALUE },
    controls: [
      {
        id: "variant",
        label: "Variant",
        type: "choice",
        compare: "rows",
        options: buttonVariants,
      },
    ],
    markup: buttonWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = `<div class="primitive-variant-list primitive-button-list">${buttonWorkbenchMarkup(state)}</div>`;
    },
  },
  "primitive-clipboard-text": {
    defaults: { variant: WORKBENCH_ALL_VALUE },
    controls: [
      {
        id: "variant",
        label: "Action",
        type: "choice",
        compare: "rows",
        options: clipboardActionVariants,
      },
    ],
    markup: clipboardTextWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = clipboardTextWorkbenchMarkup(state);
    },
  },
  "primitive-empty": {
    defaults: { state: "first-use", bordered: false },
    controls: [
      { id: "state", label: "State", type: "choice", options: emptyStates },
      { id: "bordered", label: "Border", type: "toggle" },
    ],
    markup: emptyWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = emptyWorkbenchMarkup(state);
    },
  },
  "primitive-segmented": {
    defaults: { type: "toggle", selected: "preview" },
    controls: [
      { id: "type", label: "Type", type: "choice", options: segmentedTypes },
      {
        id: "selected",
        label: "Selected",
        type: "choice",
        options: [
          { label: "Preview", value: "preview" },
          { label: "Code", value: "code" },
          { label: "Tokens", value: "tokens" },
        ],
      },
    ],
    markup: segmentedWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = segmentedWorkbenchMarkup(state);
    },
    bind(specimen, _state, update) {
      specimen.querySelectorAll("[data-workbench-segmented-value]").forEach((button) => {
        button.addEventListener("click", () =>
          update("selected", button.dataset.workbenchSegmentedValue),
        );
      });
    },
  },
  "primitive-banner": {
    defaults: { tone: "warning", action: true },
    controls: [
      {
        id: "tone",
        label: "Tone",
        type: "choice",
        compare: "stack",
        options: bannerTones,
      },
      {
        id: "action",
        label: "Action",
        type: "toggle",
      },
    ],
    markup: bannerWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = bannerWorkbenchMarkup(state);
    },
  },
  "primitive-table": {
    defaults: { interactive: false },
    controls: [
      {
        id: "interactive",
        label: "Interactive rows",
        type: "toggle",
      },
    ],
    markup: tableWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = tableWorkbenchMarkup(state);
    },
    bind(specimen) {
      specimen.querySelectorAll(".oc-table-interactive button").forEach((button) => {
        button.addEventListener("click", () => {
          const row = button.closest("tr");
          row?.setAttribute("data-selected", "true");
          button.textContent = "Opened";
          button.disabled = true;
        });
      });
    },
  },
  "primitive-grid": {
    defaults: { columns: "3", items: "3" },
    controls: [
      {
        id: "columns",
        label: "Columns",
        type: "choice",
        options: gridColumns,
      },
      {
        id: "items",
        label: "Items",
        type: "choice",
        options: gridItemCounts,
      },
    ],
    markup: gridWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = gridWorkbenchMarkup(state);
    },
  },
  "primitive-hero": {
    defaults: { lede: true, actions: false },
    controls: [
      {
        id: "lede",
        label: "Lede",
        type: "toggle",
      },
      {
        id: "actions",
        label: "Actions",
        type: "toggle",
      },
    ],
    markup: heroWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = heroWorkbenchMarkup(state);
    },
  },
  "primitive-section": {
    defaults: { eyebrow: true, copy: true, actions: true },
    controls: [
      {
        id: "eyebrow",
        label: "Eyebrow",
        type: "toggle",
      },
      {
        id: "copy",
        label: "Copy",
        type: "toggle",
      },
      {
        id: "actions",
        label: "Actions",
        type: "toggle",
      },
    ],
    markup: sectionWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = sectionWorkbenchMarkup(state);
    },
  },
  "primitive-link": {
    defaults: { variant: WORKBENCH_ALL_VALUE, disabled: false },
    controls: [
      {
        id: "variant",
        label: "Variant",
        type: "choice",
        compare: "rows",
        options: linkVariants,
      },
      {
        id: "disabled",
        label: "Disabled",
        type: "toggle",
      },
    ],
    markup: linkWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = linkWorkbenchMarkup(state);
    },
  },
  "primitive-loader": {
    defaults: { size: "md", label: true },
    controls: [
      {
        id: "size",
        label: "Size",
        type: "choice",
        compare: "rows",
        options: loaderSizes,
      },
      {
        id: "label",
        label: "Label",
        type: "toggle",
      },
    ],
    markup: loaderWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = loaderWorkbenchMarkup(state);
    },
  },
  "primitive-skeleton-line": {
    defaults: { count: "3", width: "mixed" },
    controls: [
      {
        id: "count",
        label: "Lines",
        type: "choice",
        compare: "stack",
        options: skeletonLineCounts,
      },
      {
        id: "width",
        label: "Width",
        type: "choice",
        options: skeletonLineWidths,
      },
    ],
    markup: skeletonLineWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = skeletonLineWorkbenchMarkup(state);
    },
  },
  "primitive-provider-logo": {
    defaults: { size: "md", label: true, state: "default", layout: "wrap" },
    controls: [
      {
        id: "size",
        label: "Size",
        type: "choice",
        compare: "rows",
        options: providerLogoSizes,
      },
      {
        id: "label",
        label: "Label",
        type: "toggle",
      },
      {
        id: "state",
        label: "State",
        type: "choice",
        options: providerLogoStates,
      },
      {
        id: "layout",
        label: "Layout",
        type: "choice",
        options: providerLogoLayouts,
      },
    ],
    markup: providerLogoWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = providerLogoWorkbenchMarkup(state);
    },
  },
  "primitive-select": {
    defaults: { value: "balanced", disabled: false },
    controls: [
      {
        id: "value",
        label: "Value",
        type: "choice",
        options: selectOptions,
      },
      {
        id: "disabled",
        label: "Disabled",
        type: "toggle",
      },
    ],
    markup: selectWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = `<div class="primitive-input-grid">${selectWorkbenchMarkup(state)}</div>`;
    },
    bind(specimen, _state, update) {
      specimen.querySelector("select")?.addEventListener("change", (event) => {
        update("value", event.currentTarget.value);
      });
    },
  },
  "primitive-input-area": {
    defaults: { state: "default", message: true },
    controls: [
      {
        id: "state",
        label: "State",
        type: "choice",
        compare: "stack",
        options: inputAreaStates,
      },
      {
        id: "message",
        label: "Message",
        type: "toggle",
      },
    ],
    markup: inputAreaWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = `<div class="primitive-input-grid">${inputAreaWorkbenchMarkup(state)}</div>`;
    },
  },
  "primitive-input-group": {
    defaults: { addon: "prefix", state: "default", message: true },
    controls: [
      {
        id: "addon",
        label: "Addon",
        type: "choice",
        compare: "stack",
        options: inputGroupAddons,
      },
      {
        id: "state",
        label: "State",
        type: "choice",
        options: inputGroupStates,
      },
      {
        id: "message",
        label: "Message",
        type: "toggle",
      },
    ],
    markup: inputGroupWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = `<div class="primitive-input-grid">${inputGroupWorkbenchMarkup(state)}</div>`;
    },
  },
  "primitive-autocomplete": {
    defaults: { value: "", disabled: false },
    controls: [
      {
        id: "value",
        label: "Value",
        type: "choice",
        options: autocompleteOptions,
      },
      {
        id: "disabled",
        label: "Disabled",
        type: "toggle",
      },
    ],
    markup: autocompleteWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = autocompleteWorkbenchMarkup(state);
    },
    bind(specimen, _state, update) {
      bindCombobox(specimen);
      specimen.querySelector("input")?.addEventListener("change", (event) => {
        update("value", event.currentTarget.value);
        specimen.querySelector("input")?.focus();
      });
    },
  },
  "primitive-toast": {
    defaults: { visible: false, dismissible: true },
    controls: [
      {
        id: "visible",
        label: "Visible",
        type: "toggle",
      },
      {
        id: "dismissible",
        label: "Dismissible",
        type: "toggle",
      },
    ],
    markup: toastWorkbenchMarkup,
    render(specimen, state) {
      const workbench = specimen.closest(".component-workbench");
      workbench?.querySelector(":scope > [data-workbench-toast-portal]")?.remove();
      specimen.innerHTML = `<div class="component-workbench-toast-demo">
  <button class="oc-button oc-button-secondary" type="button" data-workbench-toast-trigger data-toast-dismissible="${String(state.dismissible)}">Show toast</button>
</div>`;
      if (state.visible && workbench) {
        const region = document.createElement("div");
        region.className = "oc-toast-region component-workbench-toast-region";
        region.dataset.workbenchToastPortal = "";
        region.dataset.toastStack = "single";
        region.setAttribute("aria-label", "Notifications");
        region.setAttribute("aria-live", "polite");
        region.setAttribute("aria-relevant", "additions removals");
        const toast = createWorkbenchToast(document, state.dismissible, 0);
        region.append(toast);
        workbench.append(region);
        animateWorkbenchToast(toast, true);
      }
    },
  },
  "input-bar": {
    defaults: { status: "ready", disabled: false, draft: "" },
    controls: [
      {
        id: "status",
        label: "Status",
        type: "choice",
        options: composerStatuses,
      },
      {
        id: "disabled",
        label: "Disabled",
        type: "toggle",
      },
    ],
    markup(state) {
      return compactIconMarkup(composerWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = composerWorkbenchMarkup(state).replace(
        '<div class="oc-agent-input-tools">…</div>',
        `<div class="oc-agent-input-tools">
        <button class="oc-agent-attachment-button" type="button" aria-label="Attach">${agentIcon("plus")}</button>
        <button class="oc-agent-input-meta" type="button">${agentIcon("mode")}<span>Agent</span>${agentIcon("chevron")}</button>
        <span class="oc-agent-model-badge"><strong>Extra High</strong><span>5.6 Sol</span></span>
      </div>`,
      );
    },
    bind(specimen, state, update) {
      const form = specimen.querySelector("[data-agent-compose-form]");
      const input = form?.querySelector(".oc-agent-input");
      const status = form?.querySelector("[data-agent-compose-status]");
      if (!form || !input || !status) return;

      input.addEventListener("input", () => {
        state.draft = input.value;
      });

      if (state.status === "streaming" || state.status === "submitted") {
        form.querySelector('[aria-label="Stop response"]')?.addEventListener("click", () => {
          update("status", "ready");
        });
        return;
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (state.disabled || !input.value.trim()) return;
        state.draft = "";
        input.value = "";
        status.textContent = "Message sent";
      });
    },
  },
  "send-button": {
    defaults: { state: "idle" },
    controls: [
      {
        id: "state",
        label: "State",
        type: "choice",
        options: sendButtonStates,
      },
    ],
    markup(state) {
      return compactIconMarkup(sendButtonWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = `<div class="oc-agent-button-row">${sendButtonWorkbenchMarkup(state)}</div>`;
    },
  },
  "attachment-button": {
    defaults: { icon: "plus" },
    controls: [
      {
        id: "icon",
        label: "Icon",
        type: "choice",
        compare: "rows",
        options: attachmentButtonIcons,
      },
    ],
    markup(state) {
      return compactIconMarkup(attachmentButtonWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = `<div class="oc-agent-button-row">${attachmentButtonWorkbenchMarkup(state)}</div>`;
    },
  },
  "file-attachment": {
    defaults: { kind: "file", display: "chip", removable: true },
    controls: [
      {
        id: "kind",
        label: "Kind",
        type: "choice",
        options: attachmentKinds,
      },
      {
        id: "display",
        label: "Display",
        type: "choice",
        options: attachmentDisplays,
      },
      {
        id: "removable",
        label: "Removable",
        type: "toggle",
      },
    ],
    markup(state) {
      return compactIconMarkup(fileAttachmentWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = `<ul class="oc-agent-attachment-list" aria-label="Attached files">${fileAttachmentWorkbenchMarkup(state)}</ul>`;
    },
    bind(specimen, _state, update) {
      specimen
        .querySelector("[data-workbench-attachment-remove]")
        ?.addEventListener("click", () => {
          update("removable", false);
        });
    },
  },
  "error-message": {
    defaults: { example: "interrupted" },
    controls: [
      {
        id: "example",
        label: "Example",
        type: "choice",
        compare: "stack",
        options: errorMessageExamples,
      },
    ],
    markup: errorMessageWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = errorMessageWorkbenchMarkup(state);
    },
  },
  suggestions: {
    defaults: { disabled: false },
    controls: [
      {
        id: "disabled",
        label: "Disabled",
        type: "toggle",
      },
    ],
    markup: suggestionsWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = suggestionsWorkbenchMarkup(state);
    },
    bind(specimen) {
      const status = specimen.querySelector("[data-workbench-suggestion-status]");
      specimen.querySelectorAll("[data-agent-suggestion-value]").forEach((button) => {
        button.addEventListener("click", () => {
          if (status) status.textContent = `${button.textContent} selected`;
        });
      });
    },
  },
  "model-picker": {
    defaults: { value: "extra-high" },
    controls: [
      {
        id: "value",
        label: "Model",
        type: "choice",
        options: agentModels,
      },
    ],
    markup(state) {
      return compactIconMarkup(modelPickerWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = `<div class="oc-agent-model-demo">${modelPickerWorkbenchMarkup(state)}</div>`;
    },
    bind(specimen, _state, update) {
      specimen.querySelectorAll('input[name="workbench-agent-model"]').forEach((input) => {
        input.addEventListener("change", () => {
          if (input.checked) update("value", input.value);
        });
      });
    },
  },
  "mode-selector": {
    defaults: { value: "agent" },
    controls: [
      {
        id: "value",
        label: "Mode",
        type: "choice",
        options: agentModes,
      },
    ],
    markup(state) {
      return compactIconMarkup(modeSelectorWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = modeSelectorWorkbenchMarkup(state);
    },
    bind(specimen, _state, update) {
      specimen.querySelectorAll('input[name="workbench-agent-mode"]').forEach((input) => {
        input.addEventListener("change", () => {
          if (input.checked) update("value", input.value);
        });
      });
    },
  },
};

for (const definition of Object.values(definitions)) {
  for (const control of definition.controls ?? []) {
    if (control.type === "choice" && control.compare) {
      definition.defaults[control.id] = WORKBENCH_ALL_VALUE;
    }
  }
}

export function getWorkbenchDefinition(pageId) {
  return definitions[pageId];
}

export function getWorkbenchControlOptions(control) {
  if (!control?.compare) return control?.options ?? [];
  return [{ label: "All", value: WORKBENCH_ALL_VALUE }, ...control.options];
}

export function getWorkbenchComparison(definition, state) {
  const control = definition?.controls.find(
    (candidate) =>
      candidate.type === "choice" &&
      candidate.compare &&
      state[candidate.id] === WORKBENCH_ALL_VALUE,
  );
  if (!control) return null;

  return {
    layout: control.compare,
    items: control.options.map((option) => ({
      label: option.label,
      state: { ...state, [control.id]: option.value },
    })),
  };
}

export function normalizeWorkbenchState(definition, candidate = {}) {
  if (!definition) return {};
  const state = { ...definition.defaults };

  for (const control of definition.controls) {
    const value = candidate[control.id];
    if (control.type === "choice") {
      const validChoice = control.options.some((option) => option.value === value);
      if (validChoice || (control.compare && value === WORKBENCH_ALL_VALUE)) {
        state[control.id] = value;
      }
    } else if (control.type === "toggle" && typeof value === "boolean") {
      state[control.id] = value;
    }
  }

  return state;
}
