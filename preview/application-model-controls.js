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
  // OpenAI and Anthropic marks are the simple-icons (CC0) brand paths.
  const marks = {
    openai: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`,
    anthropic: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg>`,
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
