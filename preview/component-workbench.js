import { getReferencePage } from "./navigation.js";
import {
  getWorkbenchComparison,
  getWorkbenchControlOptions,
  getWorkbenchDefinition,
  normalizeWorkbenchState,
} from "./component-workbench-config.js";

export const workbenchViewportModes = [
  {
    id: "desktop",
    label: "Desktop preview",
    icon: '<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path>',
  },
  {
    id: "tablet",
    label: "Tablet preview",
    icon: '<rect x="5" y="2.5" width="14" height="19" rx="2"></rect><path d="M11 18.5h2"></path>',
  },
  {
    id: "mobile",
    label: "Mobile preview",
    icon: '<rect x="7" y="2.5" width="10" height="19" rx="2"></rect><path d="M11 18.5h2"></path>',
  },
];

export const workbenchCanvasThemes = [
  {
    id: "light",
    label: "Light canvas",
    icon: '<circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>',
  },
  {
    id: "dark",
    label: "Dark canvas",
    icon: '<path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"></path>',
  },
];

export function isComponentWorkbenchPage(pageId) {
  const page = getReferencePage(pageId);
  if (!page) return false;

  const isPrimitive =
    page.areaId === "interface" &&
    page.path.startsWith("interface/primitives/") &&
    page.id !== "interface-primitives";
  const isAgentComponent =
    page.areaId === "agent-components" && page.id !== "agent-components";
  return isPrimitive || isAgentComponent;
}

export function setWorkbenchViewport(workbench, viewport) {
  if (!workbenchViewportModes.some(({ id }) => id === viewport)) return false;
  const canvas = workbench.querySelector("[data-workbench-canvas]");
  if (!canvas) return false;

  canvas.dataset.viewport = viewport;
  for (const button of workbench.querySelectorAll("[data-workbench-viewport]")) {
    button.setAttribute("aria-pressed", String(button.dataset.workbenchViewport === viewport));
  }
  return true;
}

export function setWorkbenchCanvasTheme(workbench, theme) {
  if (!workbenchCanvasThemes.some(({ id }) => id === theme)) return false;
  const canvas = workbench.querySelector("[data-workbench-canvas]");
  if (!canvas) return false;

  canvas.dataset.workbenchTheme = theme;
  for (const button of workbench.querySelectorAll("[data-workbench-theme]")) {
    button.setAttribute("aria-pressed", String(button.dataset.workbenchTheme === theme));
  }
  return true;
}

function createElement(tagName, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  return element;
}

export function preserveWorkbenchScrollPosition(scroller, update) {
  if (!scroller) return update();
  const { scrollLeft, scrollTop } = scroller;
  const result = update();
  scroller.scrollLeft = scrollLeft;
  scroller.scrollTop = scrollTop;
  return result;
}

export function preventWorkbenchDemoLinkNavigation(event) {
  const link = event.target?.closest?.("[data-workbench-inert-link]");
  if (!link) return false;

  event.preventDefault();
  return true;
}

function createViewportSwitcher() {
  const group = createElement("div", "component-workbench-viewports");
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Preview width");

  for (const mode of workbenchViewportModes) {
    const button = createElement("button", "component-workbench-viewport");
    button.type = "button";
    button.dataset.workbenchViewport = mode.id;
    button.setAttribute("aria-label", mode.label);
    button.setAttribute("aria-pressed", String(mode.id === "desktop"));
    button.title = mode.label;
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${mode.icon}</svg>`;
    group.append(button);
  }

  return group;
}

function createCanvasThemeSwitcher(theme) {
  const group = createElement("div", "component-workbench-theme-switcher");
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Canvas theme");

  for (const option of workbenchCanvasThemes) {
    const button = createElement("button", "component-workbench-theme");
    button.type = "button";
    button.dataset.workbenchTheme = option.id;
    button.setAttribute("aria-label", option.label);
    button.setAttribute("aria-pressed", String(option.id === theme));
    button.title = option.label;
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${option.icon}</svg>`;
    group.append(button);
  }

  return group;
}

function createCanvasTools(theme) {
  const tools = createElement("div", "component-workbench-canvas-tools");
  tools.append(createCanvasThemeSwitcher(theme), createViewportSwitcher());
  return tools;
}

function createChoiceControl(pageId, control, state, update) {
  const fieldset = createElement("fieldset", "component-workbench-control");
  const legend = createElement("legend", "component-workbench-control-label");
  legend.textContent = control.label;
  fieldset.append(legend);

  const options = createElement("div", "component-workbench-choice-list");
  for (const option of getWorkbenchControlOptions(control)) {
    const label = createElement("label", "component-workbench-choice");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `${pageId}-${control.id}`;
    input.value = option.value;
    input.dataset.workbenchControl = control.id;
    input.checked = state[control.id] === option.value;
    input.addEventListener("change", () => {
      if (input.checked) update(control.id, input.value);
    });
    const text = document.createElement("span");
    text.textContent = option.label;
    label.append(input, text);
    options.append(label);
  }
  fieldset.append(options);
  return fieldset;
}

function renderWorkbenchComparison(specimen, definition, comparison, update) {
  const list = createElement(
    "div",
    `component-workbench-comparison component-workbench-comparison-${comparison.layout}`,
  );
  list.setAttribute("role", "list");

  for (const item of comparison.items) {
    const row = createElement("div", "component-workbench-comparison-item");
    row.setAttribute("role", "listitem");
    const label = createElement("p", "component-workbench-comparison-label");
    label.textContent = item.label;
    const preview = createElement("div", "component-workbench-comparison-preview");
    definition.render(preview, item.state);
    row.append(label, preview);
    list.append(row);
    definition.bind?.(preview, item.state, update);
  }

  specimen.replaceChildren(list);
}

function createToggleControl(control, state, update) {
  const label = createElement("label", "component-workbench-toggle");
  const text = document.createElement("span");
  text.textContent = control.label;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("role", "switch");
  input.dataset.workbenchControl = control.id;
  input.checked = state[control.id];
  input.addEventListener("change", () => update(control.id, input.checked));
  label.append(text, input);
  return label;
}

function syncControlInputs(controls, state) {
  for (const input of controls.querySelectorAll("[data-workbench-control]")) {
    const value = state[input.dataset.workbenchControl];
    input.checked = input.type === "radio" ? input.value === value : Boolean(value);
  }
}

function mountWorkbenchDefinition(workbench, pageId) {
  const definition = getWorkbenchDefinition(pageId);
  if (!definition) return false;
  const specimen = workbench.querySelector(".specimen-frame");
  const controls = workbench.querySelector("[data-workbench-controls]");
  const code = workbench.querySelector(".component-workbench-dock-panel code");
  if (!specimen || !controls || !code) return false;

  const state = normalizeWorkbenchState(definition);
  const apply = () => {
    const comparison = getWorkbenchComparison(definition, state);
    if (comparison) {
      renderWorkbenchComparison(specimen, definition, comparison, update);
      code.textContent = comparison.items
        .map((item) => `<!-- ${item.label} -->\n${definition.markup(item.state)}`)
        .join("\n\n");
    } else {
      definition.render(specimen, state);
      code.textContent = definition.markup(state);
      definition.bind?.(specimen, state, update);
    }
    syncControlInputs(controls, state);
  };
  const update = (id, value) => {
    preserveWorkbenchScrollPosition(document.scrollingElement, () => {
      state[id] = value;
      apply();
    });
  };

  for (const control of definition.controls) {
    if (control.type === "choice") {
      controls.append(createChoiceControl(pageId, control, state, update));
    } else if (control.type === "toggle") {
      controls.append(createToggleControl(control, state, update));
    }
  }
  apply();
  return true;
}

function createDock(markupSection, guidanceSection, pageId) {
  const dock = createElement("section", "component-workbench-dock");
  dock.dataset.tabs = "";
  dock.setAttribute("aria-label", "Component reference");

  const tabList = createElement("div", "component-workbench-dock-tabs");
  tabList.setAttribute("role", "tablist");
  tabList.setAttribute("aria-label", "Component details");

  const codeTab = createElement("button", "component-workbench-dock-tab");
  codeTab.type = "button";
  codeTab.id = `${pageId}-workbench-code-tab`;
  codeTab.tabIndex = -1;
  codeTab.setAttribute("role", "tab");
  codeTab.setAttribute("aria-selected", "false");
  codeTab.setAttribute("aria-controls", `${pageId}-workbench-code-panel`);
  codeTab.textContent = "Code";

  const usageTab = createElement("button", "component-workbench-dock-tab");
  usageTab.type = "button";
  usageTab.id = `${pageId}-workbench-usage-tab`;
  usageTab.setAttribute("role", "tab");
  usageTab.setAttribute("aria-selected", "true");
  usageTab.setAttribute("aria-controls", `${pageId}-workbench-usage-panel`);
  usageTab.textContent = "Usage";
  tabList.append(usageTab, codeTab);

  const codePanel = createElement("div", "component-workbench-dock-panel");
  codePanel.id = `${pageId}-workbench-code-panel`;
  codePanel.hidden = true;
  codePanel.setAttribute("role", "tabpanel");
  codePanel.setAttribute("aria-labelledby", codeTab.id);
  const codeBlock = markupSection.querySelector(".code-block");
  if (codeBlock) codePanel.append(codeBlock);

  const usagePanel = createElement("div", "component-workbench-dock-panel");
  usagePanel.id = `${pageId}-workbench-usage-panel`;
  usagePanel.setAttribute("role", "tabpanel");
  usagePanel.setAttribute("aria-labelledby", usageTab.id);
  const guidance = guidanceSection.querySelector(".guidance-list");
  if (guidance) usagePanel.append(guidance);

  dock.append(tabList, usagePanel, codePanel);
  return dock;
}

export function renderComponentWorkbench(mount, pageId) {
  if (!isComponentWorkbenchPage(pageId)) return false;

  const intro = mount.querySelector(":scope > .reference-intro");
  const previewSection = mount.querySelector(':scope > [data-section-kind="preview"]');
  const markupSection = mount.querySelector(':scope > [data-section-kind="markup"]');
  const guidanceSection = mount.querySelector(':scope > [data-section-kind="guidance"]');
  const specimen = previewSection?.querySelector(".specimen-frame");
  const title = intro?.querySelector("h1");
  if (!intro || !previewSection || !markupSection || !guidanceSection || !specimen || !title) {
    return false;
  }

  const description = [...intro.children].find(
    (child) => child.tagName === "P" && !child.classList.contains("eyebrow"),
  );
  const badge = intro.querySelector(".maturity-badge");
  const className = previewSection.querySelector(".section-heading > .oc-pill");
  const previewTitle = previewSection.querySelector(".section-heading h2")?.textContent;

  const workbench = createElement("div", "component-workbench");
  workbench.dataset.componentWorkbench = "";

  const header = createElement("header", "component-workbench-header");
  const titleGroup = createElement("div", "component-workbench-title");
  titleGroup.append(title);
  if (badge) titleGroup.append(badge);
  const navigation = createElement("div", "component-workbench-navigation-slot");
  navigation.dataset.workbenchNavigation = "";
  header.append(titleGroup, navigation);

  const stage = createElement("section", "component-workbench-stage");
  const stageTitle = createElement("h2", "sr-only");
  stageTitle.id = `${pageId}-workbench-preview`;
  stageTitle.textContent = previewTitle || `${title.textContent} preview`;
  stage.setAttribute("aria-labelledby", stageTitle.id);

  const canvas = createElement("div", "component-workbench-canvas");
  canvas.dataset.workbenchCanvas = "";
  canvas.dataset.viewport = "desktop";
  const canvasTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  canvas.dataset.workbenchTheme = canvasTheme;
  const frame = createElement("div", "component-workbench-frame");
  frame.append(specimen);
  canvas.append(frame);
  stage.append(stageTitle, canvas, createCanvasTools(canvasTheme));

  const inspector = createElement("aside", "component-workbench-inspector");
  inspector.setAttribute("aria-labelledby", `${pageId}-workbench-controls`);
  const inspectorHeader = createElement("header", "component-workbench-inspector-header");
  const inspectorTitle = createElement("h2");
  inspectorTitle.id = `${pageId}-workbench-controls`;
  inspectorTitle.textContent = "Controls";
  inspectorHeader.append(inspectorTitle);
  inspector.append(inspectorHeader);

  const inspectorIntro = createElement("div", "component-workbench-inspector-intro");
  if (description) inspectorIntro.append(description);
  if (className) inspectorIntro.append(className);
  inspector.append(inspectorIntro);

  if (previewTitle) {
    const example = createElement("div", "component-workbench-inspector-section");
    const exampleLabel = createElement("p", "component-workbench-inspector-label");
    exampleLabel.textContent = "Example";
    const exampleName = createElement("p", "component-workbench-example-name");
    exampleName.textContent = previewTitle;
    example.append(exampleLabel, exampleName);
    inspector.append(example);
  }

  const controls = createElement("div", "component-workbench-controls");
  controls.dataset.workbenchControls = "";
  inspector.append(controls);

  workbench.append(header, stage, inspector, createDock(markupSection, guidanceSection, pageId));
  mountWorkbenchDefinition(workbench, pageId);
  mount.replaceChildren(workbench);
  mount.dataset.componentWorkbenchRoot = "";
  document.body.dataset.referenceLayout = "workbench";
  return true;
}

export function bindComponentWorkbenches(root = document) {
  const workbenches = [...root.querySelectorAll("[data-component-workbench]")];
  for (const workbench of workbenches) {
    workbench.addEventListener("click", preventWorkbenchDemoLinkNavigation);
    for (const button of workbench.querySelectorAll("[data-workbench-viewport]")) {
      button.addEventListener("click", () => {
        setWorkbenchViewport(workbench, button.dataset.workbenchViewport);
      });
    }
    for (const button of workbench.querySelectorAll("[data-workbench-theme]")) {
      button.addEventListener("click", () => {
        setWorkbenchCanvasTheme(workbench, button.dataset.workbenchTheme);
      });
    }
  }
  return workbenches.length;
}
