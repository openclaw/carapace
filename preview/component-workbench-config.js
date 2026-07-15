import { agentIcon } from "./agent-components.js";

const actionVariants = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Ghost", value: "ghost" },
  { label: "Icon", value: "icon" },
];

const selectOptions = [
  { label: "Balanced", value: "balanced" },
  { label: "Fast", value: "fast" },
  { label: "Deep", value: "deep" },
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

const agentModels = [
  { label: "Fast · 2.1", value: "fast" },
  { label: "Balanced · 4.6", value: "balanced" },
  { label: "Deep · 4.6", value: "deep" },
];

const agentModes = [
  { label: "Agent", value: "agent" },
  { label: "Plan", value: "plan" },
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
  "primitive-action": {
    defaults: { variant: "primary" },
    controls: [
      {
        id: "variant",
        label: "Variant",
        type: "choice",
        options: actionVariants,
      },
    ],
    markup: actionWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = `<div class="primitive-row">${actionWorkbenchMarkup(state)}</div>`;
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

export function normalizeWorkbenchState(definition, candidate = {}) {
  if (!definition) return {};
  const state = { ...definition.defaults };

  for (const control of definition.controls) {
    const value = candidate[control.id];
    if (control.type === "choice" && control.options.some((option) => option.value === value)) {
      state[control.id] = value;
    } else if (control.type === "toggle" && typeof value === "boolean") {
      state[control.id] = value;
    }
  }

  return state;
}
