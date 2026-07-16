import { agentIcon } from "./agent-components.js";
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

const errorMessageStates = [
  { label: "Failed", value: "failed" },
  { label: "Retrying", value: "retrying" },
];

const agentModels = [
  { label: "Fast · 2.1", value: "fast" },
  { label: "Balanced · 4.6", value: "balanced" },
  { label: "Deep · 4.6", value: "deep" },
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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function compactIconMarkup(markup) {
  return markup.replace(
    /<svg class="oc-agent-icon"[\s\S]*?<\/svg>/g,
    '<svg aria-hidden="true">…</svg>',
  );
}

export function actionWorkbenchMarkup({ variant = "primary" } = {}) {
  if (variant === "icon") {
    return '<button class="oc-action oc-action-icon" type="button" aria-label="Add item">\n  +\n</button>';
  }

  const label = variant === "primary"
    ? "Primary action"
    : `${variant.slice(0, 1).toUpperCase()}${variant.slice(1)}`;
  return `<button class="oc-action oc-action-${variant}" type="button">\n  ${label}\n</button>`;
}

export function buttonWorkbenchMarkup({ variant = "primary" } = {}) {
  const example = buttonWorkbenchExamples.find(({ id }) => id === variant)
    ?? buttonWorkbenchExamples[0];
  return example.markup;
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

export function toastWorkbenchMarkup({ dismissible = true } = {}) {
  const close = dismissible
    ? '\n    <button class="oc-toast-close" type="button" aria-label="Dismiss notification" data-workbench-toast-dismiss>×</button>'
    : "";

  return `<div class="oc-toast-region" aria-label="Notifications" aria-live="polite" aria-relevant="additions removals">
  <div class="oc-toast">
    <div class="oc-toast-content">
      <p class="oc-toast-title">Changes saved</p>
      <p class="oc-toast-message">The component reference is up to date.</p>
    </div>${close}
  </div>
</div>`;
}

export function sendButtonWorkbenchMarkup({ state = "idle" } = {}) {
  if (state === "streaming") {
    return `<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button>`;
  }

  const disabled = state === "idle" ? " disabled" : "";
  return `<button class="oc-agent-send-button" type="submit" aria-label="Send message"${disabled}>${agentIcon("send")}</button>`;
}

export function attachmentButtonWorkbenchMarkup({ icon = "plus" } = {}) {
  const glyph = icon === "paperclip" ? agentIcon("paperclip") : '<span aria-hidden="true">+</span>';
  return `<button class="oc-agent-attachment-button" type="button" aria-label="Attach">${glyph}</button>`;
}

export function suggestionsWorkbenchMarkup({ disabled = false } = {}) {
  const disabledAttribute = disabled ? " disabled" : "";
  return `<div class="oc-agent-suggestions" aria-label="Suggested prompts">
  <button class="oc-agent-suggestion" type="button"${disabledAttribute} data-agent-suggestion-value="Review the current changes">Review changes</button>
  <button class="oc-agent-suggestion" type="button"${disabledAttribute} data-agent-suggestion-value="Run the validation checks">Run checks</button>
  <span class="sr-only" aria-live="polite" data-workbench-suggestion-status></span>
</div>`;
}

export function modelPickerWorkbenchMarkup({ value = "balanced" } = {}) {
  const options = agentModels.map(({ label, value: optionValue }) => {
    const selected = optionValue === value ? " selected" : "";
    return `<option value="${optionValue}"${selected}>${label}</option>`;
  }).join("");
  return `<label class="oc-agent-model-field"><span class="sr-only">Model</span>${agentIcon("model")}<select class="oc-agent-model-picker">${options}</select>${agentIcon("chevron")}</label>`;
}

export function modeSelectorWorkbenchMarkup({ value = "agent" } = {}) {
  const active = agentModes.find((mode) => mode.value === value) ?? agentModes[0];
  const options = agentModes.map((mode) => {
    const checked = mode.value === active.value ? " checked" : "";
    return `<label class="oc-agent-mode-option"><input type="radio" name="workbench-agent-mode" value="${mode.value}"${checked}><span><strong>${mode.label}</strong><small>${mode.value === "agent" ? "Complete tasks directly" : "Plan before making changes"}</small></span></label>`;
  }).join("");
  return `<details class="oc-agent-mode-selector" data-workbench-mode-selector>
  <summary>${agentIcon("mode")}<span data-agent-mode-label>${active.label}</span>${agentIcon("chevron")}</summary>
  <div class="oc-agent-mode-menu">${options}</div>
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
  const detail = isImage ? "PNG · 842 KB" : "Markdown · 3.1 KB";
  const remove = removable
    ? `<button class="oc-agent-file-remove" type="button" aria-label="Remove ${filename}" data-workbench-attachment-remove>${agentIcon("close")}</button>`
    : "";
  const content = effectiveDisplay === "image-only"
    ? `<span class="oc-agent-file-preview" role="img" aria-label="${filename}">${agentIcon("image")}</span>`
    : `<span class="oc-agent-file-type" aria-hidden="true">${agentIcon(isImage ? "image" : "file")}</span><span class="oc-agent-file-details"><strong>${filename}</strong><span>${detail}</span></span>`;

  return `<li class="oc-agent-file-attachment" data-display="${effectiveDisplay}" data-kind="${kind}">${content}${remove}</li>`;
}

export function errorMessageWorkbenchMarkup({ state = "failed" } = {}) {
  const retrying = state === "retrying";
  const stateAttributes = retrying ? ' data-state="retrying" aria-busy="true"' : "";
  const retryLabel = retrying ? "Retrying…" : "Try again";
  const retryDisabled = retrying ? " disabled" : "";

  return `<div class="oc-agent-error-message" role="alert" data-agent-error-message${stateAttributes}>
  <span class="oc-agent-error-icon" aria-hidden="true">${agentIcon("alert")}</span>
  <div class="oc-agent-error-copy"><strong>Response interrupted</strong><p>The connection ended before the response completed. Your draft is still available.</p><div class="oc-agent-error-actions"><button class="oc-agent-error-action" type="button" data-workbench-error-retry${retryDisabled}>${retryLabel}</button><button class="oc-agent-error-action" type="button" data-copy-text="Response interrupted: The connection ended before the response completed. Your draft is still available.">Copy details</button></div></div>
</div>`;
}

function toolDisclosureAttributes(state, open) {
  const status = state === "animating" ? "running" : "success";
  return `data-status="${status}" data-state="${state}"${open ? " open" : ""}`;
}

function toolStateLabel(state, running, complete) {
  return state === "animating"
    ? `<span class="oc-agent-text-shimmer" role="status">${running}</span>`
    : complete;
}

export function toolWorkbenchMarkup({
  kind = "generic",
  state = "complete",
  open = true,
} = {}) {
  const attributes = toolDisclosureAttributes(state, open);
  const complete = state === "complete";

  if (kind === "bash") {
    const content = complete
      ? `<pre role="region" aria-label="Command output" tabindex="0"><code>29 pass · 0 fail\nFinished in 312ms</code></pre>`
      : "";
    return `<details class="oc-agent-tool oc-agent-bash-tool" ${attributes}><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("terminal")}</span><span>${toolStateLabel(state, "Running command", "Ran command")}</span><span class="oc-agent-tool-status">${complete ? "Exit 0" : "Running"}</span></summary><div class="oc-agent-tool-content"><div class="oc-agent-bash-command"><span aria-hidden="true">$</span><code>bun run check</code></div>${content}</div></details>`;
  }

  if (kind === "edit") {
    const content = complete
      ? `<div class="oc-agent-diff" role="region" aria-label="Changes to styles/components.css" tabindex="0"><div class="oc-agent-diff-line" data-kind="removed"><span>109</span><span aria-hidden="true">−</span><code>min-height: 3rem;</code></div><div class="oc-agent-diff-line" data-kind="added"><span>109</span><span aria-hidden="true">+</span><code>min-height: 2.25rem;</code></div></div>`
      : `<p>Preparing the patch…</p>`;
    return `<details class="oc-agent-tool oc-agent-edit-tool" ${attributes}><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("write")}</span><span>${toolStateLabel(state, "Updating styles/components.css", "styles/components.css")}</span><span class="oc-agent-tool-status">${complete ? "+3 −1" : "Running"}</span></summary><div class="oc-agent-tool-content">${content}</div></details>`;
  }

  if (kind === "search") {
    const content = complete
      ? `<p class="oc-agent-search-query">Searched for “semantic token adapter”</p><ol class="oc-agent-search-results"><li><a href="../../foundations/tokens/" data-workbench-inert-link><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span><strong>Design tokens</strong><small>/foundations/tokens/</small></span></a></li></ol>`
      : `<p class="oc-agent-search-query">Searching for “semantic token adapter”…</p>`;
    return `<details class="oc-agent-tool oc-agent-search-tool" ${attributes}><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("search")}</span><span>${toolStateLabel(state, "Searching", "Found 3 results")}</span><span class="oc-agent-tool-status">Reference</span></summary><div class="oc-agent-tool-content">${content}</div></details>`;
  }

  if (kind === "mcp") {
    const output = complete
      ? `<pre class="oc-agent-mcp-output" role="region" aria-label="MCP tool result" tabindex="0"><code>{ "resources": 2 }</code></pre>`
      : "";
    return `<details class="oc-agent-tool oc-agent-mcp-tool" ${attributes}><summary class="oc-agent-tool-summary"><span class="oc-agent-mcp-mark" aria-hidden="true">M</span><span>${toolStateLabel(state, "Listing resources", "Listed resources")}</span><span class="oc-agent-tool-status">${complete ? "Completed" : "Running"}</span></summary><div class="oc-agent-tool-content"><dl class="oc-agent-mcp-meta"><div><dt>Server</dt><dd>workspace</dd></div><div><dt>Capability</dt><dd>read_resource</dd></div></dl>${output}</div></details>`;
  }

  if (kind === "thinking") {
    const content = complete
      ? `<div class="oc-agent-tool-content"><p>Reviewed component coverage and compatibility constraints before choosing the smallest sustainable change.</p></div>`
      : "";
    return `<details class="oc-agent-tool oc-agent-thinking-tool" ${attributes}><summary class="oc-agent-tool-summary"><span class="oc-agent-thinking-mark" aria-hidden="true">✦</span><span>${toolStateLabel(state, "Thinking", "Thought")}</span></summary>${content}</details>`;
  }

  if (kind === "subagent") {
    const content = complete
      ? `<div class="oc-agent-subagent-content"><dl class="oc-agent-subagent-meta"><div><dt>Worker</dt><dd>Accessibility reviewer</dd></div><div><dt>Result</dt><dd>No blocking issues</dd></div></dl></div>`
      : "";
    return `<details class="oc-agent-subagent-tool" ${attributes}><summary class="oc-agent-subagent-summary"><span class="oc-agent-tool-avatar" aria-hidden="true">A</span><strong>${toolStateLabel(state, "Running subagent", "Completed subagent")}</strong><span>Audit component accessibility</span><time datetime="PT6S">${complete ? "6s" : "Now"}</time></summary>${content}</details>`;
  }

  if (kind === "tool-group") {
    const label = toolStateLabel(state, "Running task", "Task completed");
    return `<details class="oc-agent-tool-group" ${attributes}><summary class="oc-agent-tool-group-summary"><strong>${label}</strong><span>1 file, 1 search, and 1 command</span><time datetime="PT6S">${complete ? "6s" : "Now"}</time></summary><ul class="oc-agent-tool-group-list"><li><span aria-hidden="true">${agentIcon("terminal")}</span><strong>${complete ? "Ran command" : "Running command"}</strong><code>bun run check</code></li><li><span aria-hidden="true">${agentIcon("search")}</span><strong>${complete ? "Found 3 results" : "Searching"}</strong><code>semantic tokens</code></li><li><span aria-hidden="true">${agentIcon("file")}</span><strong>Read</strong><code>styles/components.css</code></li></ul></details>`;
  }

  const content = complete
    ? `<div class="oc-agent-tool-content"><p>Found three changed component files with no package-contract changes.</p></div>`
    : "";
  return `<details class="oc-agent-tool oc-agent-generic-tool" ${attributes}><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("code")}</span><span>${toolStateLabel(state, "Inspecting workspace", "Inspect workspace")}</span><span class="oc-agent-tool-status">${complete ? "Completed" : "Running"}</span></summary>${content}</details>`;
}

export function todoToolWorkbenchMarkup({ status = "in_progress" } = {}) {
  const itemState = status === "in_progress" ? "active" : status === "completed" ? "complete" : "pending";
  const itemPrefix = status === "in_progress" ? "In progress: " : status === "completed" ? "Completed: " : "Pending: ";
  const count = status === "completed" ? 3 : 2;
  return `<section class="oc-agent-todo-tool" aria-labelledby="workbench-todo-title"><header><strong id="workbench-todo-title">Update component reference</strong><span>${count} of 3 complete</span></header><ul class="oc-agent-todo-list"><li data-state="complete"><span class="sr-only">Completed: </span>Inspect contract</li><li data-state="complete"><span class="sr-only">Completed: </span>Implement component</li><li data-state="${itemState}"><span class="sr-only">${itemPrefix}</span>Run visual check</li></ul></section>`;
}

export function planToolWorkbenchMarkup({
  state = "complete",
  open = true,
  approved = false,
} = {}) {
  const complete = state === "complete";
  const status = approved ? "Approved" : complete ? "Ready" : "Running";
  const action = approved
    ? `<button class="oc-agent-plan-action" type="button" data-variant="primary" disabled>Approved</button>`
    : `<button class="oc-agent-plan-action" type="button" data-variant="primary" data-workbench-plan-approve>Approve</button>`;
  return `<details class="oc-agent-tool oc-agent-plan-tool" data-state="${approved ? "approved" : state}"${open ? " open" : ""}><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("file")}</span><span>${toolStateLabel(state, "Preparing implementation-plan.md", "implementation-plan.md")}</span><span class="oc-agent-tool-status">${status}</span></summary><div class="oc-agent-tool-content"><div class="oc-agent-plan-body"><h4>Refine agent component previews</h4><p>Align structure, interaction, and accessibility while preserving the component contract.</p><ol class="oc-agent-plan-list"><li data-state="complete"><span class="sr-only">Completed: </span>Inspect existing contract</li><li data-state="active"><span class="sr-only">In progress: </span>Implement the component</li><li><span class="sr-only">Not started: </span>Validate the preview</li></ol></div><footer class="oc-agent-plan-actions">${action}</footer></div></details>`;
}

export function questionToolWorkbenchMarkup({
  state = "open",
  allowSkip = true,
} = {}) {
  const answered = state === "answered";
  const skip = allowSkip && !answered
    ? `<button class="oc-agent-question-action" type="button" data-agent-question-skip>Skip</button>`
    : "";
  const disabled = answered ? " disabled" : "";
  const action = answered
    ? `<span class="oc-agent-tool-status" role="status">Answered · Small scoped patch</span>`
    : `${skip}<button class="oc-agent-question-action" type="submit" data-variant="primary">Answer</button>`;
  return `<form class="oc-agent-tool oc-agent-question-tool" data-workbench-question-form><header class="oc-agent-question-header"><span>${agentIcon("learn")} Question</span><span>1 of 1</span></header><fieldset${disabled}><legend><span aria-hidden="true">1</span> How should we apply this change?</legend><label class="oc-agent-question-option"><input type="radio" name="workbench-scope" value="small" checked${disabled}><span aria-hidden="true">A</span><span>Small scoped patch</span></label><label class="oc-agent-question-option"><input type="radio" name="workbench-scope" value="refactor"${disabled}><span aria-hidden="true">B</span><span>Full refactor</span></label></fieldset><div class="oc-agent-question-actions">${action}</div><span class="sr-only" data-workbench-question-status aria-live="polite"></span></form>`;
}

export function composerWorkbenchMarkup({
  status = "ready",
  disabled = false,
  draft = "",
} = {}) {
  const isBusy = status === "streaming" || status === "submitted";
  const sendState = isBusy ? "streaming" : draft.trim() && !disabled ? "typing" : "idle";
  const disabledAttribute = disabled ? " disabled" : "";
  const action = sendButtonWorkbenchMarkup({ state: sendState });

  return `<form class="oc-agent-input-bar oc-agent-input-bar-standalone" data-agent-compose-form>
  <label class="sr-only" for="workbench-composer-message">Message</label>
  <textarea id="workbench-composer-message" class="oc-agent-input" rows="3" placeholder="Send a message…"${disabledAttribute}>${escapeHtml(draft)}</textarea>
  <div class="oc-agent-input-toolbar">
    <div class="oc-agent-input-tools">…</div>
    ${action}
  </div>
  <span class="sr-only" data-agent-compose-status aria-live="polite"></span>
</form>`;
}

function chatResponseMarkup(status, copyToolbar) {
  if (status === "error") {
    return `<li class="oc-agent-error-message" role="alert">
  <span class="oc-agent-error-icon" aria-hidden="true">${agentIcon("alert")}</span>
  <div class="oc-agent-error-copy"><strong>Request failed</strong><p>The response could not be completed.</p><div class="oc-agent-error-actions"><button class="oc-agent-error-action" type="button" data-workbench-chat-retry>Try again</button></div></div>
</li>`;
  }

  const statusAttribute = status === "streaming" ? ' data-status="streaming"' : "";
  const role = status === "submitted" ? "OpenClaw · waiting" : status === "streaming" ? "OpenClaw · responding" : "OpenClaw";
  const content = status === "submitted"
    ? "Preparing a response…"
    : status === "streaming"
      ? "Reviewing the component contract and current validation output…"
      : "The component contract is intact and ready for review.";
  const actions = copyToolbar && status === "ready"
    ? '<div class="oc-agent-message-actions"><button type="button" data-copy-text="The component contract is intact and ready for review.">Copy response</button></div>'
    : "";

  return `<li class="oc-agent-message"${statusAttribute}>
  <header class="oc-agent-message-header"><span class="oc-agent-avatar" aria-hidden="true">${agentIcon("sparkle")}</span><span class="oc-agent-message-role">${role}</span></header>
  <div class="oc-agent-message-body"><p>${content}</p></div>${actions}
</li>`;
}

export function messageListWorkbenchMarkup({ status = "ready", copyToolbar = true } = {}) {
  return `<ol class="oc-agent-message-list" aria-label="Conversation history">
  <li class="oc-user-message"><p>Is the component contract ready for review?</p><footer class="oc-agent-message-meta">You · now</footer></li>
  ${chatResponseMarkup(status, copyToolbar)}
</ol>`;
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

export function spiralLoaderWorkbenchMarkup({ size = "24" } = {}) {
  return `<span class="oc-agent-spiral-loader" role="status" style="width: ${size}px; height: ${size}px">
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle class="oc-agent-spiral-track" cx="12" cy="12" r="9"></circle><path class="oc-agent-spiral-path" d="M12 12c0-1.1.9-2 2-2 1.7 0 3 1.3 3 3 0 2.8-2.2 5-5 5-3.9 0-7-3.1-7-7 0-5 4-9 9-9"></path></svg>
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
      attachment: `<div class="oc-agent-user-attachment">${agentIcon("image")}<span><strong>mobile-reference.png</strong><small>PNG · 428 KB</small></span></div>`,
    },
    file: {
      message: "Review the attached component specification.",
      attachment: `<div class="oc-agent-user-attachment">${agentIcon("file")}<span><strong>component-spec.md</strong><small>Markdown · 3.1 KB</small></span></div>`,
    },
  };
  const selected = examples[content] ?? examples.text;

  return `<div class="oc-agent-user-message-stack">
  ${selected.attachment}
  <article class="oc-agent-user-message"><p>${selected.message}</p></article>
  <span class="oc-agent-message-meta">You · now</span>
</div>`;
}

export function agentChatWorkbenchMarkup({
  example = "basic",
  status = "ready",
  copyToolbar = false,
} = {}) {
  const isEmpty = status !== "error" && (example === "empty" || example === "suggestions");
  const messages = isEmpty ? "" : messageListWorkbenchMarkup({ status, copyToolbar });
  const suggestions = example === "suggestions"
    ? `<div class="oc-agent-chat-suggestions" aria-label="Suggested prompts">
  <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Review the pending changes">Review changes</button>
  <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Run the validation checks">Run checks</button>
</div>`
    : "";
  const attachments = example === "attachments"
    ? `<ul class="oc-agent-attachment-list" aria-label="Attached files">
  <li class="oc-agent-file-attachment"><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-file-details"><strong>component-spec.md</strong><span>Markdown · 3.1 KB</span></span></li>
</ul>`
    : "";
  const action = status === "streaming"
    ? `<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button>`
    : `<button class="oc-agent-send-button" type="submit" aria-label="Send message"${status === "submitted" ? " disabled" : ""}>${agentIcon("send")}</button>`;

  return `<section class="oc-agent-chat${isEmpty ? " oc-agent-chat-empty" : ""}" aria-label="Agent conversation">
  ${messages}
  <div class="oc-agent-chat-composer">
    ${suggestions}
    ${attachments}
    <form class="oc-agent-input-bar" data-workbench-chat-form>
      <label class="sr-only" for="workbench-chat-message">Message</label>
      <textarea id="workbench-chat-message" class="oc-agent-input" rows="2" placeholder="Send a message…"></textarea>
      <div class="oc-agent-input-toolbar"><button class="oc-agent-input-action" type="button" aria-label="Attach files">${agentIcon("paperclip")}</button>${action}</div>
    </form>
    <span class="sr-only" data-workbench-chat-status aria-live="polite"></span>
  </div>
</section>`;
}

function createToolWorkbenchDefinition(kind) {
  return {
    defaults: { state: "complete", open: true },
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
    ],
    markup(state) {
      return compactIconMarkup(toolWorkbenchMarkup({ kind, ...state }));
    },
    render(specimen, state) {
      specimen.innerHTML = toolWorkbenchMarkup({ kind, ...state });
    },
  };
}

const definitions = {
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
      specimen.querySelector("[data-workbench-chat-retry]")?.addEventListener("click", () => {
        update("status", "submitted");
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
    bind(specimen, _state, update) {
      specimen.querySelector("[data-workbench-chat-retry]")?.addEventListener("click", () => {
        update("status", "submitted");
      });
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
      specimen.querySelector("[data-workbench-question-form]")?.addEventListener("submit", (event) => {
        event.preventDefault();
        update("state", "answered");
      });
      specimen.querySelector("[data-agent-question-skip]")?.addEventListener("click", () => {
        update("state", "answered");
      });
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
      const toast = state.visible
        ? toastWorkbenchMarkup(state).replace(
            'class="oc-toast-region"',
            'class="oc-toast-region component-workbench-toast-region"',
          )
        : "";
      specimen.innerHTML = `<div class="component-workbench-toast-demo">
  <button class="oc-button oc-button-secondary" type="button" data-workbench-toast-trigger>Show toast</button>
  ${toast}
</div>`;
    },
    bind(specimen, _state, update) {
      specimen.querySelector("[data-workbench-toast-trigger]")?.addEventListener("click", () => {
        update("visible", true);
      });
      specimen.querySelector("[data-workbench-toast-dismiss]")?.addEventListener("click", () => {
        update("visible", false);
      });
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
      <button class="oc-agent-input-action" type="button" aria-label="Attach file">${agentIcon("paperclip")}</button>
      <button class="oc-agent-input-meta" type="button">${agentIcon("mode")}<span>Agent</span>${agentIcon("chevron")}</button>
      <button class="oc-agent-input-meta" type="button">${agentIcon("model")}<span>Balanced</span>${agentIcon("chevron")}</button>
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
      specimen.querySelector("[data-workbench-attachment-remove]")?.addEventListener("click", () => {
        update("removable", false);
      });
    },
  },
  "error-message": {
    defaults: { state: "failed" },
    controls: [
      {
        id: "state",
        label: "State",
        type: "choice",
        options: errorMessageStates,
      },
    ],
    markup: errorMessageWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = errorMessageWorkbenchMarkup(state);
    },
    bind(specimen, _state, update) {
      specimen.querySelector("[data-workbench-error-retry]")?.addEventListener("click", () => {
        update("state", "retrying");
      });
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
    defaults: { value: "balanced" },
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
      specimen.querySelector("select")?.addEventListener("change", (event) => {
        update("value", event.currentTarget.value);
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
