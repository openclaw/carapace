import { agentIcon } from "./agent-icons.js";

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
  // Marks are simple-icons (CC0) brand paths; Anthropic uses the Claude
  // starburst since the picker lists Claude models.
  const marks = {
    openai: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`,
    anthropic: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>`,
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
