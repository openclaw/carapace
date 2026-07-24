import { agentIcon } from "./agent-components.js";

export function escapeAttribute(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export const applicationModels = [
  {
    value: "openai/gpt-5.5",
    label: "GPT-5.5",
    provider: "OpenAI",
    providerId: "openai",
    meta: "Default",
    recentlyUsed: true,
    supportsFast: true,
  },
  {
    value: "openai/gpt-5.3-codex-spark",
    label: "GPT-5.3 Codex Spark",
    provider: "OpenAI",
    providerId: "openai",
    meta: "Codex",
    recentlyUsed: true,
    supportsFast: true,
  },
  {
    value: "anthropic/claude-opus-4-8",
    label: "Claude Opus 4.8",
    provider: "Anthropic",
    providerId: "anthropic",
    meta: "200k",
    recentlyUsed: true,
    supportsFast: false,
  },
  {
    value: "google/gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    provider: "Google",
    providerId: "google",
    meta: "1m",
    recentlyUsed: false,
    supportsFast: true,
  },
  {
    value: "xai/grok-4",
    label: "Grok 4",
    provider: "xAI",
    providerId: "xai",
    meta: "256k",
    recentlyUsed: false,
    supportsFast: false,
  },
];

export const applicationModelProviders = [
  { id: "recent", label: "Recent", icon: "history" },
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google" },
  { id: "xai", label: "xAI" },
];

export const applicationReasoningStops = [
  { value: "auto", label: "Auto" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "xhigh", label: "Extra high" },
];

export const defaultApplicationModel = applicationModels[0].value;
export const defaultReasoningLevel = "high";

function modelSearchText(entry) {
  return `${entry.label} ${entry.provider} ${entry.meta}`.toLowerCase();
}

// Single source for menu filtering: the static markup and the live binder
// must agree, so both call this predicate instead of re-deriving it.
export function modelMatchesFilter(entry, { provider, query, selectedValue }) {
  const matchesProvider =
    provider === "recent"
      ? entry.recentlyUsed || entry.value === selectedValue
      : entry.providerId === provider;
  return matchesProvider && modelSearchText(entry).includes(query.trim().toLowerCase());
}

function applicationProviderMark(provider) {
  const marks = {
    openai: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.28 9.82a5.99 5.99 0 0 0-.51-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.99 5.99 0 0 0-4 2.9 6.05 6.05 0 0 0 .75 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.08ZM12 8.86l2.61 1.5v3L12 14.86l-2.6-1.5v-3L12 8.86Z"/></svg>`,
    anthropic: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.45 3h3.1L20 21h-3.15l-1.48-4.45H8.63L7.15 21H4l6.45-18Zm-.92 10.78h4.94L12 6.33l-2.47 7.45Z"/></svg>`,
    google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>`,
    xai: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.47 8.78 16.51 23h-4.46L2 8.78h4.47Zm-.01 7.9L8.7 19.84 6.47 23H2l4.46-6.32ZM22 2.58V23h-3.66V7.76L22 2.58ZM22 1l-9.95 14.1-2.24-3.17L17.53 1H22Z"/></svg>`,
  };
  return marks[provider] ?? agentIcon("box");
}

function applicationProviderIcon(provider, className = "") {
  return `<span class="oc-model-provider-mark${className ? ` ${className}` : ""}" data-provider="${provider}" aria-hidden="true">${applicationProviderMark(provider)}</span>`;
}

export function applicationModelControlsMarkup({
  model = defaultApplicationModel,
  thinking = defaultReasoningLevel,
  fast = true,
  open = false,
  locked = false,
  modelProvider = "recent",
  modelQuery = "",
} = {}) {
  const selected = applicationModels.find((entry) => entry.value === model) ?? applicationModels[0];
  const selectedProvider = applicationModelProviders.some(({ id }) => id === modelProvider)
    ? modelProvider
    : "recent";
  const selectedThinking =
    applicationReasoningStops.find((entry) => entry.value === thinking) ??
    applicationReasoningStops[0];
  const thinkingIndex = applicationReasoningStops.indexOf(selectedThinking);
  const fastSupported = selected.supportsFast;
  const fastActive = fastSupported && fast;
  const trigger = `${applicationProviderIcon(selected.providerId)}
      <span><strong>${selected.label}</strong><small>${selectedThinking.label}${fastActive ? " · Fast" : ""}</small></span>
      ${agentIcon("chevron")}`;
  const options = applicationModels
    .map((entry) => {
      const matches = modelMatchesFilter(entry, {
        provider: selectedProvider,
        query: modelQuery,
        selectedValue: selected.value,
      });
      return `<button class="oc-model-option" type="button" aria-pressed="${entry.value === selected.value}" data-workbench-application-model="${entry.value}" data-model-provider="${entry.provider}"${matches ? "" : " hidden"}${locked ? " disabled" : ""}>
  ${applicationProviderIcon(entry.providerId, "oc-model-option-provider")}
  <span class="oc-model-option-copy"><strong>${entry.label}</strong><small>${entry.provider}</small></span>
  <span class="oc-model-option-meta">${entry.meta}</span>
  ${entry.value === selected.value ? `<span class="oc-model-check" aria-hidden="true">${agentIcon("check")}</span>` : ""}
</button>`;
    })
    .join("");
  const providers = applicationModelProviders
    .map(({ id, label, icon }) => {
      const mark = icon ? agentIcon(icon) : applicationProviderIcon(id);
      return `<button type="button" aria-pressed="${id === selectedProvider}" data-workbench-model-provider="${id}">${mark}<span>${label}</span></button>`;
    })
    .join("");
  const reasoningDots = applicationReasoningStops
    .map(
      ({ value }) =>
        `<span class="oc-model-reasoning-dot${value === defaultReasoningLevel ? " oc-model-reasoning-dot-default" : ""}" data-stop="${value}"></span>`,
    )
    .join("");
  const settings = `<section class="oc-model-menu-settings" aria-label="Model settings">
    <div class="oc-model-setting-row">
      <div class="oc-model-setting-heading"><span>${agentIcon("brain")} Reasoning</span><output data-workbench-model-thinking-output>${selectedThinking.label}</output></div>
      <div class="oc-model-reasoning-control">
        <span class="oc-model-reasoning-dots" aria-hidden="true">${reasoningDots}</span>
        <input class="oc-model-reasoning-range" type="range" min="0" max="${applicationReasoningStops.length - 1}" step="1" value="${thinkingIndex}" style="--oc-model-reasoning-fill:${(thinkingIndex / (applicationReasoningStops.length - 1)) * 100}%" data-workbench-model-thinking data-thinking-values="${applicationReasoningStops.map(({ value }) => value).join(",")}" aria-label="Reasoning level" aria-valuetext="${selectedThinking.label}"${locked ? " disabled" : ""} />
        <button class="oc-model-setting-reset" type="button" aria-label="Reset reasoning to High" data-workbench-model-thinking-reset${thinking === defaultReasoningLevel || locked ? " disabled" : ""}>${agentIcon("rotate-ccw")}</button>
      </div>
    </div>
    <div class="oc-model-setting-row oc-model-speed-row">
      <div class="oc-model-setting-heading"><span>${agentIcon("zap")} Response speed</span><small>${fastSupported ? "Uses more capacity" : "Unavailable for this model"}</small></div>
      <button class="oc-model-speed-toggle${fastActive ? " is-active" : ""}" type="button" role="switch" aria-checked="${fastActive}" aria-label="Fast responses: ${fastActive ? "On" : "Off"}" data-workbench-model-fast${!fastSupported || locked ? " disabled" : ""}><span aria-hidden="true"></span><strong>${fastActive ? "Fast" : "Standard"}</strong></button>
    </div>
  </section>`;
  return `<div class="oc-model-controls" data-locked="${locked}">
  ${
    locked
      ? `<span class="oc-model-picker"><button class="oc-model-trigger" type="button" aria-label="Selected model: ${selected.label} by ${selected.provider}; reasoning ${selectedThinking.label}" disabled>${trigger}</button></span>`
      : `<details class="oc-model-picker" data-workbench-model-picker${open ? " open" : ""}>
    <summary class="oc-model-trigger" aria-label="Selected model: ${selected.label} by ${selected.provider}; reasoning ${selectedThinking.label}${fastActive ? "; Fast responses on" : ""}">${trigger}</summary>
    <div class="oc-model-menu">
      <label class="oc-model-search">
        <span class="sr-only">Search models</span>
        ${agentIcon("search")}
        <input type="search" placeholder="Search models" value="${escapeAttribute(modelQuery)}" data-workbench-model-search />
      </label>
      <div class="oc-model-menu-layout">
        <nav class="oc-model-providers" aria-label="Model providers">${providers}</nav>
        <div class="oc-model-options" role="group" aria-label="Models">${options}</div>
      </div>
      ${settings}
      <footer class="oc-model-menu-footer"><span>Session override</span><button type="button" data-workbench-model-reset${selected.value === defaultApplicationModel && thinking === defaultReasoningLevel && fast ? " disabled" : ""}>Use defaults</button></footer>
    </div>
  </details>`
  }
</div>`;
}

export function bindApplicationModelControls(specimen, state, update) {
  const options = Array.from(
    specimen.querySelectorAll("[data-workbench-application-model]"),
  );
  const providers = Array.from(specimen.querySelectorAll("[data-workbench-model-provider]"));
  const search = specimen.querySelector("[data-workbench-model-search]");
  const picker = specimen.querySelector("[data-workbench-model-picker]");
  const thinking = specimen.querySelector("[data-workbench-model-thinking]");
  const fast = specimen.querySelector("[data-workbench-model-fast]");
  const thinkingOutput = specimen.querySelector("[data-workbench-model-thinking-output]");
  const thinkingReset = specimen.querySelector("[data-workbench-model-thinking-reset]");
  const reset = specimen.querySelector("[data-workbench-model-reset]");
  let activeProvider = state.modelProvider ?? "recent";

  const applyFilters = () => {
    const query = search?.value ?? "";
    for (const option of options) {
      const entry = applicationModels.find(
        ({ value }) => value === option.dataset.workbenchApplicationModel,
      );
      option.hidden =
        !entry ||
        !modelMatchesFilter(entry, {
          provider: activeProvider,
          query,
          selectedValue: state.model,
        });
    }
  };

  for (const option of options) {
    option.addEventListener("click", () => {
      update("model", option.dataset.workbenchApplicationModel);
    });
  }

  for (const button of providers) {
    button.addEventListener("click", () => {
      for (const provider of providers) {
        provider.setAttribute("aria-pressed", String(provider === button));
      }
      activeProvider = button.dataset.workbenchModelProvider;
      update("modelProvider", activeProvider, { render: false });
      applyFilters();
    });
  }

  search?.addEventListener("input", () => {
    update("modelQuery", search.value, { render: false });
    applyFilters();
  });
  picker?.addEventListener("toggle", () => update("picker", picker.open, { render: false }));
  thinking?.addEventListener("input", () => {
    const values = thinking.dataset.thinkingValues?.split(",") ?? [];
    const value = values[Number(thinking.value)] ?? defaultReasoningLevel;
    const label =
      applicationReasoningStops.find((entry) => entry.value === value)?.label ?? value;
    thinking.style.setProperty(
      "--oc-model-reasoning-fill",
      `${(Number(thinking.value) / Math.max(1, values.length - 1)) * 100}%`,
    );
    thinking.setAttribute("aria-valuetext", label);
    if (thinkingOutput) thinkingOutput.textContent = label;
    update("thinking", value, { render: false });
  });
  thinking?.addEventListener("change", () => {
    const values = thinking.dataset.thinkingValues?.split(",") ?? [];
    update("thinking", values[Number(thinking.value)] ?? defaultReasoningLevel, {
      render: false,
    });
  });
  thinkingReset?.addEventListener("click", () => update("thinking", defaultReasoningLevel));
  fast?.addEventListener("click", () => {
    update("fast", fast.getAttribute("aria-checked") !== "true");
  });
  reset?.addEventListener("click", () => {
    update("model", defaultApplicationModel, { render: false });
    update("thinking", defaultReasoningLevel, { render: false });
    update("fast", true);
  });
  applyFilters();
}
