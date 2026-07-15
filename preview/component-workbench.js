import { getReferencePage } from "./navigation.js";
import {
  getWorkbenchDefinition,
  normalizeWorkbenchState,
} from "./component-workbench-config.js";

const workbenchAreaIds = new Set(["interface", "agent-components"]);

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

export function isComponentWorkbenchPage(pageId) {
  const page = getReferencePage(pageId);
  return Boolean(
    page &&
      workbenchAreaIds.has(page.areaId) &&
      page.id !== page.areaId &&
      page.id !== "interface-primitives",
  );
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

function createElement(tagName, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  return element;
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

function createChoiceControl(pageId, control, state, update) {
  const fieldset = createElement("fieldset", "component-workbench-control");
  const legend = createElement("legend", "component-workbench-control-label");
  legend.textContent = control.label;
  fieldset.append(legend);

  const options = createElement("div", "component-workbench-choice-list");
  for (const option of control.options) {
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
    definition.render(specimen, state);
    code.textContent = definition.markup(state);
    syncControlInputs(controls, state);
    definition.bind?.(specimen, state, update);
  };
  const update = (id, value) => {
    state[id] = value;
    apply();
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
  const frame = createElement("div", "component-workbench-frame");
  frame.append(specimen);
  canvas.append(frame);
  stage.append(stageTitle, canvas, createViewportSwitcher());

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
    for (const button of workbench.querySelectorAll("[data-workbench-viewport]")) {
      button.addEventListener("click", () => {
        setWorkbenchViewport(workbench, button.dataset.workbenchViewport);
      });
    }
  }
  return workbenches.length;
}
