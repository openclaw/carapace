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

const composerModes = [
  { label: "Idle", value: "idle" },
  { label: "Streaming", value: "streaming" },
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

export function composerWorkbenchMarkup({ mode = "idle" } = {}) {
  const action = mode === "streaming"
    ? '<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">…</button>'
    : '<button class="oc-agent-send-button" type="submit" aria-label="Send message">…</button>';

  return `<form class="oc-agent-input-bar oc-agent-input-bar-standalone">
  <label class="sr-only" for="workbench-composer-message">Message</label>
  <textarea id="workbench-composer-message" class="oc-agent-input" rows="3" placeholder="Send a message…"></textarea>
  <div class="oc-agent-input-toolbar">
    <div class="oc-agent-input-tools">…</div>
    ${action}
  </div>
</form>`;
}

const definitions = {
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
    defaults: { mode: "idle", draft: "" },
    controls: [
      {
        id: "mode",
        label: "State",
        type: "choice",
        options: composerModes,
      },
    ],
    markup: composerWorkbenchMarkup,
    render(specimen, state) {
      const action = state.mode === "streaming"
        ? `<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button>`
        : `<button class="oc-agent-send-button" type="submit" aria-label="Send message">${agentIcon("send")}</button>`;
      specimen.innerHTML = `<form class="oc-agent-input-bar oc-agent-input-bar-standalone" data-agent-compose-form>
  <label class="sr-only" for="workbench-composer-message">Message</label>
  <textarea id="workbench-composer-message" class="oc-agent-input" rows="3" placeholder="Send a message…">${escapeHtml(state.draft)}</textarea>
  <div class="oc-agent-input-toolbar">
    <div class="oc-agent-input-tools">
      <button class="oc-agent-input-action" type="button" aria-label="Attach file">${agentIcon("paperclip")}</button>
      <button class="oc-agent-input-meta" type="button">${agentIcon("mode")}<span>Agent</span>${agentIcon("chevron")}</button>
      <button class="oc-agent-input-meta" type="button">${agentIcon("model")}<span>Balanced</span>${agentIcon("chevron")}</button>
    </div>
    ${action}
  </div>
  <span class="sr-only" data-agent-compose-status aria-live="polite"></span>
</form>`;
    },
    bind(specimen, state, update) {
      const form = specimen.querySelector("[data-agent-compose-form]");
      const input = form?.querySelector(".oc-agent-input");
      const status = form?.querySelector("[data-agent-compose-status]");
      if (!form || !input || !status) return;

      input.addEventListener("input", () => {
        state.draft = input.value;
      });

      if (state.mode === "streaming") {
        form.querySelector('[aria-label="Stop response"]')?.addEventListener("click", () => {
          update("mode", "idle");
        });
        return;
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!input.value.trim()) return;
        state.draft = "";
        input.value = "";
        status.textContent = "Message sent";
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
