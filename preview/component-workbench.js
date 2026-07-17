import { getAdjacentReferencePages, getReferencePage } from "./navigation.js";
import {
  getWorkbenchComparison,
  getWorkbenchControlOptions,
  getWorkbenchDefinition,
  normalizeWorkbenchState,
} from "./component-workbench-config.js";
import {
  createFallbackComponentWorkbenchReference,
  formatComponentWorkbenchCode,
  formatWorkbenchMarkup,
  getComponentWorkbenchReference,
} from "./component-reference.js";

export const workbenchViewportModes = [
  {
    id: "desktop",
    label: "Full width",
    icon: '<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path>',
  },
  {
    id: "tablet",
    label: "Medium width",
    icon: '<rect x="5" y="2.5" width="14" height="19" rx="2"></rect><path d="M11 18.5h2"></path>',
  },
  {
    id: "mobile",
    label: "Narrow width",
    icon: '<rect x="7" y="2.5" width="10" height="19" rx="2"></rect><path d="M11 18.5h2"></path>',
  },
];

const workbenchViewportPageModes = new Map([
  ["primitive-grid", ["desktop", "tablet", "mobile"]],
  ["primitive-table", ["desktop", "mobile"]],
]);

export function getWorkbenchViewportModes(pageId) {
  const enabledModes = workbenchViewportPageModes.get(pageId) ?? [];
  return workbenchViewportModes.filter(({ id }) => enabledModes.includes(id));
}

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

const inlineWorkbenchPages = new Set([
  "primitive-action",
  "primitive-badge",
  "primitive-button",
  "primitive-link",
  "primitive-loader",
  "primitive-pill",
  "primitive-provider-logo",
  "primitive-skeleton-line",
  "primitive-tooltip",
  "spiral-loader",
  "text-shimmer",
]);

const formWorkbenchPages = new Set([
  "primitive-autocomplete",
  "primitive-checkbox",
  "primitive-combobox",
  "primitive-date-picker",
  "primitive-input",
  "primitive-input-area",
  "primitive-input-group",
  "primitive-label",
  "primitive-radio",
  "primitive-select",
  "primitive-sensitive-input",
  "primitive-switch",
]);

const dataWorkbenchPages = new Set([
  "primitive-flow",
  "primitive-grid",
  "primitive-table",
]);

const viewportWorkbenchPages = new Set([
  "agent-chat",
  "input-bar",
  "message-list",
  "primitive-app-surface",
  "primitive-sidebar",
  "user-message",
]);

export function getWorkbenchShellProfile(pageId) {
  if (inlineWorkbenchPages.has(pageId)) {
    return { canvasPreset: "inline", supportsViewport: false };
  }
  if (formWorkbenchPages.has(pageId)) {
    return { canvasPreset: "form", supportsViewport: false };
  }
  if (dataWorkbenchPages.has(pageId)) {
    return { canvasPreset: "data", supportsViewport: true };
  }
  if (viewportWorkbenchPages.has(pageId)) {
    return { canvasPreset: "viewport", supportsViewport: true };
  }
  return { canvasPreset: "panel", supportsViewport: false };
}

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

export function resolveWorkbenchPageHref(pagePath, siteRootHref) {
  return new URL(pagePath, siteRootHref).href;
}

function createWorkbenchNavigation(pageId) {
  const { previous, next } = getAdjacentReferencePages(pageId);
  if (!previous && !next) return null;

  const navigation = createElement("nav", "component-workbench-navigation");
  navigation.setAttribute("aria-label", "Adjacent reference pages");
  const siteRoot =
    document.querySelector("a.brand")?.href ?? new URL("/", window.location.origin).href;

  for (const [direction, page, iconName] of [
    ["Previous", previous, "arrow-left"],
    ["Next", next, "arrow-right"],
  ]) {
    if (!page) continue;
    const link = createElement("a");
    link.href = resolveWorkbenchPageHref(page.path, siteRoot);
    link.setAttribute("aria-label", `${direction}: ${page.label}`);
    link.title = `${direction}: ${page.label}`;
    const icon = createElement("i");
    icon.dataset.lucide = iconName;
    icon.setAttribute("aria-hidden", "true");
    link.append(icon);
    navigation.append(link);
  }

  return navigation;
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

function createViewportSwitcher(modes) {
  const group = createElement("div", "component-workbench-viewports");
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Canvas width");

  for (const mode of modes) {
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

function createCanvasTools(theme, pageId) {
  const tools = createElement("div", "component-workbench-canvas-tools");
  tools.append(createCanvasThemeSwitcher(theme));
  const viewportModes = getWorkbenchViewportModes(pageId);
  if (viewportModes.length > 0) tools.append(createViewportSwitcher(viewportModes));
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
  if (!specimen || !code) return false;

  const state = normalizeWorkbenchState(definition);
  const apply = () => {
    const comparison = getWorkbenchComparison(definition, state);
    if (comparison) {
      renderWorkbenchComparison(specimen, definition, comparison, update);
      renderWorkbenchCode(
        code,
        comparison.items
          .map((item) => `<!-- ${item.label} -->\n${definition.markup(item.state)}`)
          .join("\n\n"),
      );
    } else {
      definition.render(specimen, state);
      renderWorkbenchCode(code, definition.markup(state));
      definition.bind?.(specimen, state, update);
    }
    if (controls) syncControlInputs(controls, state);
    window.lucide?.createIcons({
      attrs: {
        "aria-hidden": "true",
        "stroke-width": "1.75",
      },
    });
  };
  const update = (id, value) => {
    preserveWorkbenchScrollPosition(document.scrollingElement, () => {
      state[id] = value;
      apply();
    });
  };

  if (controls) {
    for (const control of definition.controls) {
      if (control.type === "choice") {
        controls.append(createChoiceControl(pageId, control, state, update));
      } else if (control.type === "toggle") {
        controls.append(createToggleControl(control, state, update));
      }
    }
  }
  apply();
  return true;
}

function appendCodeToken(parent, value, type) {
  const token = createElement("span", `component-workbench-code-token is-${type}`);
  token.textContent = value;
  parent.append(token);
}

function highlightWorkbenchCode(parent, source) {
  const pattern = /(<!--[\s\S]*?-->|<\/?[a-z][\w:-]*|\/?>|[\w:@.-]+(?=\s*=)|=|"[^"]*"|'[^']*')/gi;
  let cursor = 0;

  for (const match of source.matchAll(pattern)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > cursor) parent.append(document.createTextNode(source.slice(cursor, index)));

    if (value.startsWith("<!--")) {
      appendCodeToken(parent, value, "comment");
    } else if (value.startsWith("<")) {
      appendCodeToken(parent, value, "tag");
    } else if (value.startsWith('"') || value.startsWith("'")) {
      appendCodeToken(parent, value, "string");
    } else if (value === "=" || value === ">" || value === "/>") {
      appendCodeToken(parent, value, "punctuation");
    } else {
      appendCodeToken(parent, value, "attribute");
    }
    cursor = index + value.length;
  }

  if (cursor < source.length) parent.append(document.createTextNode(source.slice(cursor)));
}

function renderWorkbenchCode(code, source) {
  const formatted = formatWorkbenchMarkup(source);
  code.replaceChildren();
  highlightWorkbenchCode(code, formatted);
  code.closest(".code-block")?.classList.add("component-workbench-code-readable");
}

function prepareCodeBlock(codeBlock, pageId, sourceOverride) {
  if (!codeBlock) return null;

  const header = codeBlock.querySelector(".code-block-header");
  const language = header?.querySelector("span")?.textContent?.trim() || "Code";
  const copy = header?.querySelector("[data-copy-code]");
  const pre = codeBlock.querySelector("pre");
  const code = pre?.querySelector("code");
  if (copy) {
    copy.textContent = "Copy code";
    copy.setAttribute("aria-describedby", `${pageId}-workbench-copy-status`);
  }
  if (header && !header.querySelector("[data-copy-code-status]")) {
    const status = createElement("span", "component-workbench-copy-status sr-only");
    status.id = `${pageId}-workbench-copy-status`;
    status.dataset.copyCodeStatus = "";
    status.setAttribute("aria-live", "polite");
    header.append(status);
  }
  if (pre) {
    pre.tabIndex = 0;
    pre.setAttribute("aria-label", `${language.toUpperCase()} example`);
  }
  if (code && language.toLowerCase() === "html") {
    renderWorkbenchCode(code, sourceOverride ?? code.textContent ?? "");
  }
  return codeBlock;
}

function createUsageReference(reference) {
  const usage = createElement("div", "component-workbench-usage");
  usage.style.setProperty("--workbench-usage-columns", reference.usage.length);

  for (const section of reference.usage) {
    const group = createElement("section", "component-workbench-usage-section");
    const title = createElement("h3");
    title.textContent = section.title;
    group.append(title);

    if (section.items) {
      const list = createElement("ul", "component-workbench-usage-list");
      for (const item of section.items) {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.append(listItem);
      }
      group.append(list);
    }

    if (section.examples) {
      const list = createElement("dl", "component-workbench-usage-examples");
      for (const example of section.examples) {
        const item = createElement("div", "component-workbench-usage-example");
        const term = document.createElement("dt");
        term.textContent = example.label;
        const description = document.createElement("dd");
        description.textContent = example.purpose;
        item.append(term, description);
        list.append(item);
      }
      group.append(list);
    }

    usage.append(group);
  }

  return usage;
}

function createDock(markupSection, guidanceSection, pageId) {
  const dock = createElement("section", "component-workbench-dock");
  dock.dataset.tabs = "";
  dock.dataset.tabsKey = `component-workbench-${pageId}`;
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
  codeTab.dataset.tabValue = "code";
  codeTab.textContent = "Code";

  const usageTab = createElement("button", "component-workbench-dock-tab");
  usageTab.type = "button";
  usageTab.id = `${pageId}-workbench-usage-tab`;
  usageTab.setAttribute("role", "tab");
  usageTab.setAttribute("aria-selected", "true");
  usageTab.setAttribute("aria-controls", `${pageId}-workbench-usage-panel`);
  usageTab.dataset.tabValue = "usage";
  usageTab.textContent = "Usage";
  tabList.append(usageTab, codeTab);

  const codePanel = createElement("div", "component-workbench-dock-panel");
  codePanel.id = `${pageId}-workbench-code-panel`;
  codePanel.hidden = true;
  codePanel.setAttribute("role", "tabpanel");
  codePanel.setAttribute("aria-labelledby", codeTab.id);
  const reference = getComponentWorkbenchReference(pageId);
  const referenceCode = reference ? formatComponentWorkbenchCode(reference.examples) : undefined;
  const codeBlock = prepareCodeBlock(
    markupSection.querySelector(".code-block"),
    pageId,
    referenceCode,
  );
  if (codeBlock) {
    codePanel.append(codeBlock);
  }

  const usagePanel = createElement("div", "component-workbench-dock-panel");
  usagePanel.id = `${pageId}-workbench-usage-panel`;
  usagePanel.setAttribute("role", "tabpanel");
  usagePanel.setAttribute("aria-labelledby", usageTab.id);
  const guidanceItems = [...guidanceSection.querySelectorAll(".guidance-list li")].map(
    (item) => item.textContent ?? "",
  );
  const guidanceTitle = guidanceSection.querySelector(".section-heading h2")?.textContent ?? "";
  const usageReference =
    reference ?? createFallbackComponentWorkbenchReference(guidanceTitle, guidanceItems);
  if (usageReference) usagePanel.append(createUsageReference(usageReference));

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

  const badge = intro.querySelector(".maturity-badge");
  const previewTitle = previewSection.querySelector(".section-heading h2")?.textContent;
  const definition = getWorkbenchDefinition(pageId);
  const hasControls = Boolean(definition?.controls?.length);
  const shellProfile = getWorkbenchShellProfile(pageId);

  const workbench = createElement("div", "component-workbench");
  workbench.dataset.componentWorkbench = "";
  workbench.dataset.canvasPreset = shellProfile.canvasPreset;
  workbench.dataset.hasInspector = String(hasControls);

  const header = createElement("header", "component-workbench-header");
  const titleGroup = createElement("div", "component-workbench-title");
  titleGroup.append(title);
  if (badge) titleGroup.append(badge);
  const navigation = createWorkbenchNavigation(pageId);
  header.append(titleGroup);
  if (navigation) header.append(navigation);

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
  stage.append(stageTitle, canvas, createCanvasTools(canvasTheme, pageId));

  workbench.append(header, stage);
  if (hasControls) {
    const inspector = createElement("aside", "component-workbench-inspector");
    inspector.dataset.expanded = "true";
    inspector.setAttribute("aria-labelledby", `${pageId}-workbench-controls`);
    const inspectorHeader = createElement("header", "component-workbench-inspector-header");
    const inspectorTitle = createElement("h2");
    inspectorTitle.id = `${pageId}-workbench-controls`;
    inspectorTitle.textContent = "Controls";
    const inspectorToggle = createElement("button", "component-workbench-inspector-toggle");
    inspectorToggle.type = "button";
    inspectorToggle.dataset.workbenchControlsToggle = "";
    inspectorToggle.setAttribute("aria-expanded", "true");
    inspectorToggle.setAttribute("aria-controls", `${pageId}-workbench-controls-panel`);
    inspectorToggle.setAttribute("aria-label", "Collapse controls");
    inspectorToggle.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 7h10M18 7h2M10 17h10M4 17h2M14 4v6M10 14v6" />
      </svg>
    `;
    inspectorHeader.append(inspectorTitle, inspectorToggle);
    const controls = createElement("div", "component-workbench-controls");
    controls.id = `${pageId}-workbench-controls-panel`;
    controls.dataset.workbenchControls = "";
    inspector.append(inspectorHeader, controls);
    stage.append(inspector);
  }
  workbench.append(createDock(markupSection, guidanceSection, pageId));
  mountWorkbenchDefinition(workbench, pageId);
  mount.replaceChildren(workbench);
  window.lucide?.createIcons({
    attrs: {
      "aria-hidden": "true",
      "stroke-width": "1.75",
    },
  });
  mount.dataset.componentWorkbenchRoot = "";
  document.body.dataset.referenceLayout = "workbench";
  document.body.dataset.shellMode = "workbench";
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
    for (const button of workbench.querySelectorAll("[data-workbench-controls-toggle]")) {
      button.addEventListener("click", () => {
        const inspector = button.closest(".component-workbench-inspector");
        const expanded = inspector?.dataset.expanded !== "false";
        if (!inspector) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const currentBounds = inspector.getBoundingClientRect();
        for (const animation of inspector.getAnimations()) animation.cancel();
        delete inspector.dataset.transitioning;

        inspector.dataset.expanded = String(!expanded);
        button.setAttribute("aria-expanded", String(!expanded));
        button.setAttribute("aria-label", expanded ? "Expand controls" : "Collapse controls");

        if (reduceMotion) return;

        const targetBounds = inspector.getBoundingClientRect();
        inspector.dataset.transitioning = "true";
        const animation = inspector.animate(
          [
            {
              width: `${currentBounds.width}px`,
              height: `${currentBounds.height}px`,
            },
            {
              width: `${targetBounds.width}px`,
              height: `${targetBounds.height}px`,
            },
          ],
          {
            duration: expanded ? 160 : 200,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          },
        );
        animation.addEventListener(
          "finish",
          () => {
            delete inspector.dataset.transitioning;
          },
          { once: true },
        );
      });
    }
  }
  return workbenches.length;
}
