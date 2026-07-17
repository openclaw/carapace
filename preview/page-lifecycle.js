import { bindAgentComponentDemos } from "./agent-components-interactions.js";
import { bindCombobox } from "./combobox.js";
import { bindCommandPalettes } from "./command-palette.js";
import { bindComponentWorkbenches } from "./component-workbench.js";
import { bindDialogs } from "./dialog.js";
import { bindDropdowns } from "./dropdown.js";
import { bindExampleDialog } from "./interaction.js";
import { bindMenuBars } from "./menu-bar.js";
import { getReferenceMaturity, referencePages } from "./navigation.js";
import { renderReferenceContent } from "./reference-content.js";
import { bindSensitiveInputs } from "./sensitive-input.js";
import { bindSidebars } from "./sidebar.js";
import { bindTabs } from "./tabs.js";
import { bindTablesOfContents } from "./table-of-contents.js";
import {
  groupTokenDefinitions,
  resolveTokenHash,
  syncTokenHash,
} from "./token-catalog.js";
import { bindToolbars } from "./toolbar.js";
import { bindToasts } from "./toast.js";
import { bindTooltips } from "./tooltip.js";

function tokenProperty(sample, variable) {
  if (sample === "text") return "color";
  if (sample === "border") return "border-color";
  if (sample === "space") return "width";
  if (sample === "type-scale") return "font-size";
  if (sample === "font") return "font-family";
  if (sample === "radius") return "border-radius";
  if (sample === "shadow") return "box-shadow";
  if (sample === "motion") {
    return variable.includes("ease") ? "transition-timing-function" : "transition-duration";
  }
  if (sample === "control") return "height";
  if (sample === "content") return "max-width";
  return "background-color";
}

function readTokenValue(token, sample, resolver, view) {
  const property = tokenProperty(sample, token.variable);
  resolver.style.cssText = "";
  resolver.style.setProperty(property, `var(${token.variable})`);
  return view.getComputedStyle(resolver).getPropertyValue(property).trim();
}

function valuesForTheme(group, theme, resolver, documentElement, view) {
  const previousTheme = documentElement.dataset.theme;
  documentElement.dataset.theme = theme;

  const values = new Map(
    group.tokens.map((token) => [
      token.variable,
      readTokenValue(token, group.sample, resolver, view),
    ]),
  );

  if (previousTheme === undefined) delete documentElement.dataset.theme;
  else documentElement.dataset.theme = previousTheme;
  return values;
}

function createTokenPreview(document, sample, value) {
  const preview = document.createElement("span");
  preview.className = `token-preview token-preview--${sample}`;
  preview.style.setProperty("--token-preview-value", value);
  preview.setAttribute("aria-hidden", "true");

  if (sample === "text" || sample === "type-scale" || sample === "font") {
    preview.textContent = "Ag";
  } else if (sample === "motion") {
    preview.textContent = "↗";
  }

  return preview;
}

function createTokenValue(document, sample, value, variable, context) {
  const valueCell = document.createElement("span");
  valueCell.className = "token-value-cell";

  const resolvedValue = document.createElement("button");
  resolvedValue.type = "button";
  resolvedValue.className = "token-value";
  resolvedValue.dataset.copyToken = value;
  resolvedValue.setAttribute("aria-label", `Copy ${context} value ${value} for ${variable}`);
  resolvedValue.textContent = value;
  resolvedValue.title = value;

  valueCell.append(createTokenPreview(document, sample, value), resolvedValue);
  return valueCell;
}

function createTokenGroup(document, group, resolver, theme, documentElement, view) {
  const section = document.createElement("section");
  section.className = "token-group";
  section.setAttribute("aria-labelledby", `token-group-${group.id}`);

  const heading = document.createElement("header");
  heading.className = "token-group-heading";
  const headingCopy = document.createElement("div");
  headingCopy.className = "token-group-copy";
  const title = document.createElement("h2");
  title.id = `token-group-${group.id}`;
  title.textContent = group.label;
  const description = document.createElement("p");
  description.textContent = group.description;
  const count = document.createElement("span");
  count.textContent = `${group.tokens.length} token${group.tokens.length === 1 ? "" : "s"}`;
  const rule = document.createElement("span");
  rule.className = "token-group-rule";
  rule.setAttribute("aria-hidden", "true");
  headingCopy.append(title, description);
  heading.append(headingCopy, rule, count);

  const tableWrap = document.createElement("div");
  tableWrap.className = "token-table-wrap";
  const table = document.createElement("table");
  table.className = "token-table";
  table.classList.toggle("token-table--comparison", Boolean(group.comparison));
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  const headings = group.comparison ? ["Token", "Light", "Dark"] : ["Token", "Value"];
  for (const label of headings) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = label;
    headRow.append(cell);
  }
  head.append(headRow);

  const body = document.createElement("tbody");
  const activeValues = valuesForTheme(group, theme, resolver, documentElement, view);
  const lightValues = group.comparison
    ? valuesForTheme(group, "light", resolver, documentElement, view)
    : null;
  const darkValues = group.comparison
    ? valuesForTheme(group, "dark", resolver, documentElement, view)
    : null;

  for (const token of group.tokens) {
    const row = document.createElement("tr");
    row.id = `token-${token.variable.slice(2)}`;
    const name = document.createElement("th");
    name.scope = "row";
    name.className = "token-name";
    const nameContent = document.createElement("span");
    nameContent.className = "token-name-content";
    const variable = document.createElement("button");
    variable.type = "button";
    variable.dataset.copyToken = token.variable;
    variable.setAttribute("aria-label", `Copy token name ${token.variable}`);
    variable.textContent = token.variable;
    variable.title = token.variable;
    nameContent.append(variable);
    if (!group.comparison) {
      nameContent.append(createTokenPreview(document, group.sample, activeValues.get(token.variable)));
    }
    name.append(nameContent);
    row.append(name);

    if (group.comparison) {
      for (const [context, value] of [
        ["light", lightValues.get(token.variable)],
        ["dark", darkValues.get(token.variable)],
      ]) {
        const cell = document.createElement("td");
        cell.append(createTokenValue(document, group.sample, value, token.variable, context));
        row.append(cell);
      }
    } else {
      const value = activeValues.get(token.variable);
      const valueCell = document.createElement("td");
      const resolvedValue = document.createElement("button");
      resolvedValue.type = "button";
      resolvedValue.className = "token-value";
      resolvedValue.dataset.copyToken = value;
      resolvedValue.setAttribute("aria-label", `Copy resolved value ${value} for ${token.variable}`);
      resolvedValue.textContent = value;
      resolvedValue.title = value;
      valueCell.append(resolvedValue);
      row.append(valueCell);
    }

    body.append(row);
  }

  table.append(head, body);
  tableWrap.append(table);
  section.append(heading, tableWrap);
  return section;
}

function createTokenCatalog(root, resolvedTheme) {
  const tokenGrid = root.querySelector("[data-token-grid]");
  if (!tokenGrid) {
    return { cleanup() {}, refreshTheme() {} };
  }

  const document = root.ownerDocument;
  const view = document.defaultView;
  const documentElement = document.documentElement;
  const tokenCount = root.querySelector("[data-token-count]");
  const tokenGroupNav = root.querySelector("[data-token-group-nav]");
  let currentTheme = resolvedTheme || documentElement.dataset.theme || "dark";
  let groupObserver = null;
  let hashSynced = false;

  const renderGroupNavigation = (groups) => {
    if (!tokenGroupNav) return;
    tokenGroupNav.replaceChildren(
      ...groups.map((group) => {
        const link = document.createElement("a");
        link.href = `#token-group-${group.id}`;
        const label = document.createElement("span");
        label.textContent = group.label;
        const count = document.createElement("small");
        count.textContent = String(group.tokens.length);
        link.append(label, count);
        return link;
      }),
    );
  };

  const observeGroups = (initialGroupId) => {
    groupObserver?.disconnect();
    groupObserver = null;
    if (!tokenGroupNav) return;

    const links = [...tokenGroupNav.querySelectorAll("a")];
    const sections = [...root.querySelectorAll(".token-group")];
    const setActive = (id) => {
      for (const link of links) {
        if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    };
    const initialSectionId = initialGroupId
      ? `token-group-${initialGroupId}`
      : sections[0]?.querySelector("h2")?.id;
    if (initialSectionId) setActive(initialSectionId);
    if (!view?.IntersectionObserver) return;

    groupObserver = new view.IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.querySelector("h2")?.id);
      },
      { rootMargin: "-28% 0px -62% 0px", threshold: [0, 0.1] },
    );
    sections.forEach((section) => groupObserver.observe(section));
  };

  const render = () => {
    const resolver = document.createElement("span");
    resolver.className = "token-value-resolver";
    resolver.setAttribute("aria-hidden", "true");
    document.body.append(resolver);

    const requestedGroups = new Set(
      (tokenGrid.dataset.tokenGroups || "")
        .split(",")
        .map((group) => group.trim())
        .filter(Boolean),
    );
    const groups = groupTokenDefinitions()
      .filter((group) => requestedGroups.size === 0 || requestedGroups.has(group.id))
      .filter((group) => group.tokens.length > 0);
    const count = groups.reduce((total, group) => total + group.tokens.length, 0);
    const tokenHash = resolveTokenHash(view.location.hash);

    if (tokenCount) tokenCount.textContent = String(count);
    renderGroupNavigation(groups);
    tokenGrid.replaceChildren(
      ...groups.map((group) => (
        createTokenGroup(document, group, resolver, currentTheme, documentElement, view)
      )),
    );
    observeGroups(tokenHash?.groupId);
    resolver.remove();

    if (!hashSynced && tokenHash) {
      hashSynced = true;
      syncTokenHash(view.location.hash, {
        getElementById: (id) => root.querySelector(`#${id}`),
        schedule: view.requestAnimationFrame.bind(view),
      });
    }
  };

  render();
  return {
    cleanup() {
      groupObserver?.disconnect();
      groupObserver = null;
    },
    refreshTheme(nextTheme) {
      if (!nextTheme || nextTheme === currentTheme) return;
      currentTheme = nextTheme;
      render();
    },
  };
}

function addHomeMaturityBadges(root) {
  const document = root.ownerDocument;
  for (const link of root.querySelectorAll(".home-component-link")) {
    if (link.querySelector(".home-component-maturity")) continue;
    const path = link.getAttribute("href")?.replace(/^\.\//, "");
    const page = referencePages.find((candidate) => candidate.path === path);
    const maturity = page ? getReferenceMaturity(page.id) : undefined;
    if (!maturity) continue;

    const marker = document.createElement("span");
    marker.className = "home-component-maturity maturity-badge";
    marker.textContent = maturity;
    link.append(marker);
  }
}

function bindHomeSegmentedControls(root) {
  for (const control of root.querySelectorAll(".home-component-grid .oc-segmented")) {
    control.addEventListener("click", (event) => {
      const item = event.target.closest?.(".oc-segmented-item");
      if (!item || !control.contains(item)) return;
      const state = item.hasAttribute("aria-selected") ? "aria-selected" : "aria-pressed";
      control.querySelectorAll(`[${state}]`).forEach((option) => {
        option.setAttribute(state, "false");
      });
      item.setAttribute(state, "true");
    });
  }
}

function observePreviewSections(root) {
  const document = root.ownerDocument;
  const view = document.defaultView;
  const links = [...root.querySelectorAll("[data-preview-link]")];
  const sections = [...root.querySelectorAll("[data-preview-section]")];
  const contextTitle = root.querySelector("[data-preview-context-title]");
  const contextMeta = root.querySelector("[data-preview-context-meta]");
  if (!sections.length || !view) return () => {};

  let observer = null;
  let frame = 0;
  let active = true;
  const setActive = (section) => {
    const target = section.id ? `#${section.id}` : null;
    for (const link of links) {
      const current = target && link.getAttribute("href") === target;
      if (current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    if (contextTitle) contextTitle.textContent = section.dataset.previewTitle || "Overview";
    if (contextMeta) contextMeta.textContent = section.dataset.previewMeta || "Carapace";
  };
  const sync = () => {
    const focusLine = view.innerHeight * 0.32;
    const current = sections.reduce(
      (candidate, section) => (
        section.getBoundingClientRect().top <= focusLine ? section : candidate
      ),
      sections[0],
    );
    if (current) setActive(current);
  };
  const schedule = () => {
    if (!active || frame) return;
    frame = view.requestAnimationFrame(() => {
      frame = 0;
      if (active) sync();
    });
  };

  if (view.IntersectionObserver) {
    observer = new view.IntersectionObserver(schedule, {
      rootMargin: "-18% 0px -64% 0px",
      threshold: [0, 0.2, 0.8],
    });
    sections.forEach((section) => observer.observe(section));
  }
  view.addEventListener("scroll", schedule, { passive: true });
  view.addEventListener("resize", schedule);
  schedule();

  return () => {
    active = false;
    observer?.disconnect();
    view.removeEventListener("scroll", schedule);
    view.removeEventListener("resize", schedule);
    if (frame) view.cancelAnimationFrame(frame);
  };
}

export function createFeedbackReporter(document, view) {
  let timeout = 0;
  let feedback = null;
  return {
    cleanup() {
      if (timeout) view.clearTimeout(timeout);
      timeout = 0;
      feedback?.classList.remove("is-visible");
      if (feedback) feedback.textContent = "";
      feedback = null;
    },
    show(message) {
      feedback = document.querySelector("[data-shell-feedback]");
      if (!feedback) return;
      if (timeout) view.clearTimeout(timeout);
      feedback.textContent = message;
      feedback.classList.add("is-visible");
      timeout = view.setTimeout(() => {
        feedback?.classList.remove("is-visible");
        timeout = 0;
      }, 1400);
    },
  };
}

export function bindCopyActions(root, reportFeedback) {
  const view = root.ownerDocument.defaultView;
  let active = true;
  const buttonStates = new Map();
  const resetButton = (button) => {
    const state = buttonStates.get(button);
    if (!state) return;
    view.clearTimeout(state.timeout);
    button.classList.remove("is-copied");
    if (state.status) state.status.textContent = "";
    if (state.label !== null) button.textContent = state.label;
    buttonStates.delete(button);
  };
  const scheduleButtonReset = (button, state, delay) => {
    const timeout = view.setTimeout(() => resetButton(button), delay);
    buttonStates.set(button, { ...state, timeout });
  };

  const onClick = async (event) => {
    const button = event.target.closest?.("[data-copy-token], [data-copy-code], [data-copy-text]");
    if (!button || !root.contains(button)) return;

    const token = button.dataset.copyToken;
    const codeBlock = button.closest(".code-block");
    const textContainer = button.closest(".oc-clipboard-text");
    const value = token
      ?? (button.hasAttribute("data-copy-code") ? codeBlock?.querySelector("code")?.textContent : undefined)
      ?? button.dataset.copyText
      ?? "";

    try {
      await view.navigator.clipboard.writeText(value);
      if (!active) return;

      if (token !== undefined) {
        resetButton(button);
        button.classList.add("is-copied");
        reportFeedback(`Copied ${token}`);
        scheduleButtonReset(button, { label: null, status: null }, 800);
        return;
      }

      const status = codeBlock?.querySelector("[data-copy-code-status]")
        ?? textContainer?.querySelector("[data-copy-status]");
      const hasIcon = Boolean(button.querySelector?.("svg, [data-lucide]"));
      const label = hasIcon
        ? null
        : buttonStates.get(button)?.label ?? button.textContent;
      resetButton(button);
      if (!hasIcon) button.textContent = "Copied";
      if (status) status.textContent = button.hasAttribute("data-copy-code")
        ? "Code copied."
        : "Copied to clipboard.";
      reportFeedback(button.hasAttribute("data-copy-code") ? "Code copied." : "Text copied.");
      scheduleButtonReset(button, { label, status }, 1000);
    } catch {
      if (!active) return;
      const status = codeBlock?.querySelector("[data-copy-code-status]")
        ?? textContainer?.querySelector("[data-copy-status]");
      if (status) status.textContent = "Clipboard access unavailable.";
      button.title = "Copy unavailable in this browser";
      reportFeedback("Copy unavailable in this browser");
    }
  };
  root.addEventListener("click", onClick);
  return () => {
    active = false;
    root.removeEventListener("click", onClick);
    [...buttonStates.keys()].forEach(resetButton);
  };
}

function bindPageInteractions(root) {
  bindComponentWorkbenches(root);
  bindAgentComponentDemos(root);
  bindCombobox(root);
  bindCommandPalettes(root);
  bindDialogs(root);
  bindDropdowns(root);
  bindExampleDialog(root);
  bindMenuBars(root);
  bindSensitiveInputs(root);
  bindSidebars(root);
  bindTabs(root);
  bindTablesOfContents(root);
  bindToolbars(root);
  bindToasts(root);
  bindTooltips(root);
}

export function mountPage(
  root,
  {
    pageId = root?.ownerDocument?.body?.dataset.previewPage,
    resolvedTheme = root?.ownerDocument?.documentElement?.dataset.theme,
    showFeedback,
  } = {},
) {
  if (!root?.querySelector || !root.ownerDocument?.defaultView) {
    throw new TypeError("mountPage requires a route element attached to a browser document");
  }

  const document = root.ownerDocument;
  const view = document.defaultView;
  delete document.body.dataset.referenceLayout;
  delete document.body.dataset.shellMode;
  renderReferenceContent(root, pageId);
  addHomeMaturityBadges(root);
  root.querySelectorAll("[data-preview-indeterminate]").forEach((input) => {
    input.indeterminate = true;
  });
  bindHomeSegmentedControls(root);
  bindPageInteractions(root);
  view.lucide?.createIcons({
    attrs: {
      "aria-hidden": "true",
      "stroke-width": "1.75",
    },
  });

  const tokenCatalog = createTokenCatalog(root, resolvedTheme);
  const stopObservingSections = observePreviewSections(root);
  const feedback = createFeedbackReporter(document, view);
  const reportFeedback = showFeedback || feedback.show;
  const stopCopy = bindCopyActions(root, reportFeedback);
  let active = true;

  return {
    cleanup() {
      if (!active) return;
      active = false;
      tokenCatalog.cleanup();
      stopObservingSections();
      stopCopy();
      feedback.cleanup();
    },
    refreshTheme(nextTheme) {
      if (!active) return;
      tokenCatalog.refreshTheme(nextTheme);
    },
  };
}
