import { agentIcon } from "./agent-icons.js";
import {
  appendAgentUserMessage,
} from "./agent-components-interactions.js";
import {
  applicationReasoningStops,
  bindApplicationModelControls,
} from "./application-model-controls.js";
import {
  operationsApplicationMarkup,
  quickChatApplicationMarkup,
  sessionsApplicationMarkup,
  settingsApplicationMarkup,
  workspaceApplicationMarkup,
} from "./application-screens.js";
import {
  bindCombobox,
} from "./combobox.js";
import {
  bindSidebars,
} from "./sidebar.js";
import {
  avatarCatalogMarkup,
  avatarPlaygroundMarkup,
  avatarPresenceOptions,
  avatarSeeds,
  avatarSizeOptions,
  avatarStyleOptions,
  actionVariants,
  actionWorkbenchMarkup,
  agentChatWorkbenchMarkup,
  agentModes,
  animateWorkbenchToast,
  appSurfaceWorkbenchMarkup,
  applicationConnectionStates,
  applicationDensities,
  applicationDockModes,
  applicationModels,
  applicationNavigationModes,
  applicationOperationStates,
  applicationOperationViews,
  applicationSessionListStates,
  applicationSessionStates,
  applicationVoiceStates,
  attachmentButtonIcons,
  attachmentButtonWorkbenchMarkup,
  attachmentDisplays,
  attachmentKinds,
  autocompleteOptions,
  autocompleteWorkbenchMarkup,
  bannerTones,
  bannerWorkbenchMarkup,
  buttonVariants,
  buttonWorkbenchMarkup,
  chatExamples,
  chatStatuses,
  clipboardActionVariants,
  clipboardTextWorkbenchMarkup,
  collapsibleWorkbenchMarkup,
  compactIconMarkup,
  composerStatuses,
  composerWorkbenchMarkup,
  createWorkbenchToast,
  emptyStates,
  emptyWorkbenchMarkup,
  errorMessageExamples,
  errorMessageWorkbenchMarkup,
  fileAttachmentWorkbenchMarkup,
  flowOrientations,
  flowWorkbenchMarkup,
  gridColumns,
  gridItemCounts,
  gridWorkbenchMarkup,
  heroWorkbenchMarkup,
  inputAreaStates,
  inputAreaWorkbenchMarkup,
  inputGroupAddons,
  inputGroupStates,
  inputGroupWorkbenchMarkup,
  interactiveToolLifecycleStates,
  interactiveToolVariants,
  linkVariants,
  linkWorkbenchMarkup,
  loaderSizes,
  loaderWorkbenchMarkup,
  markdownExamples,
  markdownWorkbenchMarkup,
  messageListWorkbenchMarkup,
  meterValues,
  meterWorkbenchMarkup,
  modeSelectorWorkbenchMarkup,
  modelPickerWorkbenchMarkup,
  planToolWorkbenchMarkup,
  providerLogoLayouts,
  providerLogoSizes,
  providerLogoStates,
  providerLogoWorkbenchMarkup,
  questionStates,
  questionToolWorkbenchMarkup,
  sectionWorkbenchMarkup,
  segmentedTypes,
  segmentedWorkbenchMarkup,
  selectOptions,
  selectWorkbenchMarkup,
  sendButtonStates,
  sendButtonWorkbenchMarkup,
  sidebarWorkbenchMarkup,
  sidebarWorkspaceOptions,
  skeletonLineCounts,
  skeletonLineWidths,
  skeletonLineWorkbenchMarkup,
  spiralLoaderSizes,
  spiralLoaderWorkbenchMarkup,
  subagentLifecycleStates,
  subagentNames,
  subagentTaskTitles,
  suggestionsWorkbenchMarkup,
  tableWorkbenchMarkup,
  textShimmerExamples,
  textShimmerWorkbenchMarkup,
  toastWorkbenchMarkup,
  todoItemStates,
  todoToolWorkbenchMarkup,
  toolLifecycleStates,
  toolWorkbenchMarkup,
  userMessageContent,
  userMessageWorkbenchMarkup,
} from "./component-workbench-markup.js";

export const WORKBENCH_ALL_VALUE = "__all__";

// Markup generators and control options live in component-workbench-markup.js;
// this module owns workbench definitions, binders, and the lookup API.
export * from "./component-workbench-markup.js";

function createToolWorkbenchDefinition(kind) {
  const expandable = !["edit", "generic"].includes(kind);
  const stateOptions =
    kind === "interactive"
      ? interactiveToolLifecycleStates
      : kind === "subagent"
        ? subagentLifecycleStates
        : toolLifecycleStates;
  const defaults = expandable ? { state: "complete", open: true } : { state: "complete" };
  if (kind === "interactive") defaults.variant = "terminal";
  if (kind === "subagent") defaults.taskTitle = "Accessibility audit";
  if (kind === "subagent") defaults.agentName = "Barnacle";
  const controls = [
    {
      id: "state",
      label: "State",
      type: "choice",
      options: stateOptions,
    },
  ];
  if (kind === "subagent") {
    controls.push({
      id: "agentName",
      label: "Agent",
      type: "choice",
      options: subagentNames,
    });
    controls.push({
      id: "taskTitle",
      label: "Task",
      type: "choice",
      options: subagentTaskTitles,
    });
  }
  if (kind === "interactive") {
    controls.unshift({
      id: "variant",
      label: "Surface",
      type: "choice",
      options: interactiveToolVariants,
    });
  }
  if (expandable) {
    controls.push({
      id: "open",
      label: "Open",
      type: "toggle",
    });
  }
  const definition = {
    defaults,
    controls,
    markup(state) {
      return compactIconMarkup(toolWorkbenchMarkup({ kind, ...state }));
    },
    render(specimen, state) {
      specimen.innerHTML = toolWorkbenchMarkup({ kind, ...state });
    },
  };
  if (kind === "interactive") {
    definition.bind = (specimen) => bindInteractiveToolActions(specimen);
  }
  return definition;
}

export function bindInteractiveToolActions(
  specimen,
  clipboard = globalThis.navigator?.clipboard,
) {
  const status = specimen.querySelector("[data-workbench-tool-status]");
  const copy = specimen.querySelector("[data-workbench-tool-copy]");
  copy?.addEventListener("click", async () => {
    const output = specimen.querySelector(".oc-agent-bash-output code")?.textContent ?? "";
    try {
      if (typeof clipboard?.writeText !== "function") {
        throw new TypeError("Clipboard API unavailable");
      }
      await clipboard.writeText(output);
      copy.setAttribute("data-state", "copied");
      copy.setAttribute("aria-label", "Command output copied");
      if (status) status.textContent = "Command output copied";
    } catch {
      copy.setAttribute("data-state", "error");
      copy.setAttribute("aria-label", "Command output could not be copied");
      if (status) status.textContent = "Command output could not be copied";
    }
  });
  return copy ? 1 : 0;
}

export function bindApplicationNavigation(specimen, state, update) {
  specimen
    .querySelector("[data-workbench-application-navigation]")
    ?.addEventListener("click", () => {
      update("navigation", state.navigation === "compact" ? "expanded" : "compact");
    });
}

export function bindApplicationComposer(specimen, state, update) {
  const input = specimen.querySelector("[data-workbench-composer-input]");
  const send = specimen.querySelector("[data-workbench-composer-send]");
  const dictation = specimen.querySelector("[data-workbench-composer-dictation]");
  const dictationStatus = specimen.querySelector("[data-workbench-composer-dictation-status]");
  const syncPrimaryAction = () => {
    const hasDraft = Boolean(input?.value.trim());
    if (send) send.hidden = !hasDraft;
    if (dictation) dictation.hidden = hasDraft;
  };

  input?.addEventListener("input", () => {
    update("draft", input.value, { render: false });
    syncPrimaryAction();
  });
  syncPrimaryAction();

  specimen.querySelectorAll("[data-workbench-composer-talk]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.voice === "idle") {
        update("voice", "listening");
        return;
      }
      if (state.camera) update("camera", false, { render: false });
      update("voice", "idle");
    });
  });
  specimen.querySelector("[data-workbench-composer-camera]")?.addEventListener("click", () => {
    update("camera", !state.camera);
  });
  const setDictationActive = (active) => {
    dictation?.setAttribute("aria-pressed", String(active));
    dictation?.classList.toggle("is-active", active);
    if (dictationStatus) dictationStatus.hidden = !active;
  };
  dictation?.addEventListener("pointerdown", (event) => {
    dictation.setPointerCapture?.(event.pointerId);
    setDictationActive(true);
  });
  for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
    dictation?.addEventListener(eventName, () => setDictationActive(false));
  }
  dictation?.addEventListener("keydown", (event) => {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      setDictationActive(true);
    }
  });
  dictation?.addEventListener("keyup", (event) => {
    if (event.key === " " || event.key === "Enter") {
      setDictationActive(false);
    }
  });
}

const definitions = {
  "application-settings": {
    defaults: {
      density: "compact",
      state: "ready",
    },
    controls: [
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
      specimen.querySelectorAll("[data-workbench-density]").forEach((button) => {
        button.addEventListener("click", () => {
          update("density", button.dataset.workbenchDensity);
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
      model: "openai/gpt-5.5",
      picker: false,
      thinking: "high",
      fast: true,
      voice: "idle",
      camera: false,
      modelProvider: "recent",
      modelQuery: "",
      draft: "",
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
        id: "model",
        label: "Model",
        type: "choice",
        options: applicationModels,
      },
      {
        id: "picker",
        label: "Picker open",
        type: "toggle",
      },
      {
        id: "thinking",
        label: "Thinking",
        type: "choice",
        options: applicationReasoningStops,
      },
      {
        id: "fast",
        label: "Fast mode",
        type: "toggle",
      },
      {
        id: "voice",
        label: "Talk state",
        type: "choice",
        options: applicationVoiceStates,
      },
      {
        id: "camera",
        label: "Camera",
        type: "toggle",
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
      bindApplicationModelControls(specimen, state, update);
      bindApplicationComposer(specimen, state, update);
      specimen
        .querySelector("[data-workbench-application-inspector-hide]")
        ?.addEventListener("click", () => update("dock", "hidden"));
      specimen.querySelector("[data-workbench-application-dock]")?.addEventListener("click", () => {
        update("dock", state.dock === "right" ? "bottom" : "right");
      });
    },
  },
  "application-sessions": {
    defaults: {
      state: "ready",
      navigation: "expanded",
    },
    controls: [
      {
        id: "state",
        label: "State",
        type: "choice",
        options: applicationSessionListStates,
      },
      {
        id: "navigation",
        label: "Navigation",
        type: "choice",
        options: applicationNavigationModes,
      },
    ],
    markup: sessionsApplicationMarkup,
    render(specimen, state) {
      specimen.innerHTML = sessionsApplicationMarkup(state);
    },
    bind(specimen, state, update) {
      bindApplicationNavigation(specimen, state, update);
    },
  },
  "application-quick-chat": {
    defaults: {
      status: "idle",
      model: "openai/gpt-5.5",
      picker: false,
      thinking: "high",
      fast: true,
      modelProvider: "recent",
      modelQuery: "",
      draft: "",
    },
    controls: [
      {
        id: "status",
        label: "State",
        type: "choice",
        options: applicationSessionStates,
      },
      {
        id: "model",
        label: "Model",
        type: "choice",
        options: applicationModels,
      },
      {
        id: "picker",
        label: "Picker open",
        type: "toggle",
      },
      {
        id: "thinking",
        label: "Thinking",
        type: "choice",
        options: applicationReasoningStops,
      },
      {
        id: "fast",
        label: "Fast mode",
        type: "toggle",
      },
    ],
    markup: quickChatApplicationMarkup,
    render(specimen, state) {
      specimen.innerHTML = quickChatApplicationMarkup(state);
    },
    bind(specimen, state, update) {
      bindApplicationModelControls(specimen, state, update);
      bindApplicationComposer(specimen, state, update);
      specimen
        .querySelector("[data-workbench-quick-chat-form]")
        ?.addEventListener("submit", (event) => event.preventDefault());
    },
  },
  "agent-chat": {
    defaults: {
      example: "multi-user",
      status: "ready",
      copyToolbar: false,
      model: "openai/gpt-5.5",
      picker: false,
      thinking: "high",
      fast: true,
      voice: "idle",
      modelProvider: "recent",
      modelQuery: "",
      draft: "",
    },
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
      {
        id: "model",
        type: "choice",
        options: applicationModels,
        hidden: true,
      },
      {
        id: "picker",
        type: "toggle",
        hidden: true,
      },
      {
        id: "thinking",
        type: "choice",
        options: applicationReasoningStops,
        hidden: true,
      },
      {
        id: "fast",
        type: "toggle",
        hidden: true,
      },
      {
        id: "voice",
        label: "Talk state",
        type: "choice",
        options: applicationVoiceStates,
      },
    ],
    markup(state) {
      return compactIconMarkup(agentChatWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = agentChatWorkbenchMarkup(state);
    },
    bind(specimen, state, update) {
      bindApplicationModelControls(specimen, state, update);
      bindApplicationComposer(specimen, state, update);
      const input = specimen.querySelector(".oc-agent-input");
      const status = specimen.querySelector("[data-workbench-chat-status]");
      specimen.querySelectorAll("[data-agent-suggestion-value]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!input) return;
          input.value = button.dataset.agentSuggestionValue;
          input.dispatchEvent(new Event("input"));
          input.focus();
        });
      });
      specimen.querySelector("[data-workbench-chat-form]")?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!input?.value.trim()) return;
        const chat = specimen.querySelector(".oc-agent-chat");
        const transcript = specimen.querySelector(".oc-agent-message-list-content");
        const scroller = specimen.querySelector(".oc-agent-message-list");
        appendAgentUserMessage({
          form: event.currentTarget,
          input,
          chat,
          transcript,
          scroller,
          status,
        });
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
    defaults: { status: "ready", copyToolbar: true, meta: false },
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
      {
        id: "meta",
        label: "Response meta",
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
  "interactive-tool": createToolWorkbenchDefinition("interactive"),
  "edit-tool": createToolWorkbenchDefinition("edit"),
  "generic-tool": createToolWorkbenchDefinition("generic"),
  "mcp-tool": createToolWorkbenchDefinition("mcp"),
  "search-tool": createToolWorkbenchDefinition("search"),
  "thinking-tool": createToolWorkbenchDefinition("thinking"),
  "subagent-tool": createToolWorkbenchDefinition("subagent"),
  "tool-group": createToolWorkbenchDefinition("tool-group"),
  "todo-tool": {
    defaults: { status: "in_progress", display: "card" },
    controls: [
      {
        id: "status",
        label: "Current item",
        type: "choice",
        options: todoItemStates,
      },
      {
        id: "display",
        label: "Display",
        type: "choice",
        options: [
          { label: "Card", value: "card" },
          { label: "Bar", value: "bar" },
        ],
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
        update("state", "skipped");
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
  "primitive-sidebar": {
    defaults: { workspace: "openclaw", collapsed: false },
    controls: [
      {
        id: "workspace",
        label: "Workspace",
        type: "choice",
        options: sidebarWorkspaceOptions,
      },
      {
        id: "collapsed",
        label: "Compact rail",
        type: "toggle",
      },
    ],
    markup: sidebarWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = sidebarWorkbenchMarkup(state);
    },
    bind(specimen, _state, update) {
      bindSidebars(specimen, {
        onWorkspaceChange: (workspace) => update("workspace", workspace, { render: false }),
        onCollapsedChange: (collapsed) => update("collapsed", collapsed, { render: false }),
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
  "primitive-avatar": {
    defaults: { seed: "Shelly", style: "auto", size: "md", presence: "none", animated: false },
    controls: [
      {
        id: "seed",
        label: "Seed",
        type: "choice",
        options: avatarSeeds,
      },
      {
        id: "style",
        label: "Pattern",
        type: "choice",
        options: avatarStyleOptions,
      },
      {
        id: "size",
        label: "Size",
        type: "choice",
        options: avatarSizeOptions,
      },
      {
        id: "presence",
        label: "Presence",
        type: "choice",
        options: avatarPresenceOptions,
      },
      {
        id: "animated",
        label: "Animated",
        type: "toggle",
      },
    ],
    markup: avatarPlaygroundMarkup,
    render(specimen, state) {
      specimen.innerHTML = avatarCatalogMarkup(state);
    },
  },
  "primitive-banner": {
    defaults: { tone: "warning", action: true, dismissible: false },
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
      {
        id: "dismissible",
        label: "Dismissible",
        type: "toggle",
      },
    ],
    markup: bannerWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = bannerWorkbenchMarkup(state);
    },
  },
  "primitive-collapsible": {
    defaults: { open: true },
    controls: [
      {
        id: "open",
        label: "Expanded",
        type: "toggle",
      },
    ],
    markup: collapsibleWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = collapsibleWorkbenchMarkup(state);
    },
  },
  "primitive-flow": {
    defaults: { orientation: WORKBENCH_ALL_VALUE },
    controls: [
      {
        id: "orientation",
        label: "Orientation",
        type: "choice",
        compare: "stack",
        options: flowOrientations,
      },
    ],
    markup: flowWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = flowWorkbenchMarkup(state);
    },
  },
  "primitive-table": {
    defaults: { interactive: false, chrome: false, selected: false, expandable: false },
    controls: [
      {
        id: "interactive",
        label: "Interactive rows",
        type: "toggle",
      },
      {
        id: "chrome",
        label: "Toolbar and footer",
        type: "toggle",
      },
      {
        id: "selected",
        label: "Rows selected",
        type: "toggle",
      },
      {
        id: "expandable",
        label: "Expandable rows",
        type: "toggle",
      },
    ],
    markup: tableWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = tableWorkbenchMarkup(state);
    },
    bind(specimen) {
      specimen.querySelectorAll("[data-workbench-table-expand]").forEach((button) => {
        button.addEventListener("click", () => {
          const expanded = button.getAttribute("aria-expanded") === "true";
          button.setAttribute("aria-expanded", String(!expanded));
          const detail = button.closest("tr")?.nextElementSibling;
          if (detail?.classList.contains("oc-table-expansion")) detail.hidden = expanded;
        });
      });
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
  "primitive-meter": {
    defaults: { value: "64", active: true },
    controls: [
      {
        id: "value",
        label: "Value",
        type: "choice",
        options: meterValues,
      },
      {
        id: "active",
        label: "Active effect",
        type: "toggle",
      },
    ],
    markup: meterWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = meterWorkbenchMarkup(state);
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
    defaults: { size: "md", label: true, framed: false, state: "default", layout: "wrap" },
    controls: [
      {
        id: "size",
        label: "Size",
        type: "choice",
        options: providerLogoSizes,
      },
      {
        id: "label",
        label: "Label",
        type: "toggle",
      },
      {
        id: "framed",
        label: "Framed mark",
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
    bind(specimen) {
      const buttons = Array.from(
        specimen.querySelectorAll("button.oc-provider-logo, button.provider-profile-row"),
      );
      for (const button of buttons) {
        button.addEventListener("click", () => {
          for (const candidate of buttons) {
            const selected = candidate === button;
            const logo = candidate.querySelector?.(".oc-provider-logo") || candidate;
            candidate.setAttribute("aria-pressed", String(selected));
            candidate.toggleAttribute("data-selected", selected);
            logo?.toggleAttribute("data-selected", selected);
          }
        });
      }
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
    bind(specimen) {
      const input = specimen.querySelector(".oc-input-group-stepper .oc-input");
      if (!input) return;
      specimen.querySelectorAll(".oc-input-group-step").forEach((button, index) => {
        button.addEventListener("click", () => {
          const step = index === 0 ? -1 : 1;
          const min = Number(input.min || "-Infinity");
          const max = Number(input.max || "Infinity");
          input.value = String(Math.min(max, Math.max(min, Number(input.value || 0) + step)));
        });
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
        update("value", event.currentTarget.value, { render: false });
        event.currentTarget.focus();
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
    defaults: {
      model: "openai/gpt-5.5",
      picker: true,
      thinking: "high",
      fast: true,
      locked: false,
      modelProvider: "recent",
      modelQuery: "",
    },
    controls: [
      {
        id: "model",
        label: "Model",
        type: "choice",
        options: applicationModels,
      },
      {
        id: "picker",
        label: "Picker open",
        type: "toggle",
      },
      {
        id: "thinking",
        label: "Thinking",
        type: "choice",
        options: applicationReasoningStops,
      },
      {
        id: "fast",
        label: "Fast mode",
        type: "toggle",
      },
      {
        id: "locked",
        label: "Locked",
        type: "toggle",
      },
    ],
    markup(state) {
      return compactIconMarkup(modelPickerWorkbenchMarkup(state));
    },
    render(specimen, state) {
      specimen.innerHTML = `<div class="oc-agent-model-demo">${modelPickerWorkbenchMarkup(state)}</div>`;
    },
    bind(specimen, state, update) {
      bindApplicationModelControls(specimen, state, update);
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
