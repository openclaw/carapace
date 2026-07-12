import { bindExampleDialog } from "./interaction.js";
import {
  groupTokenDefinitions,
  resolveTokenHash,
  syncTokenHash,
} from "./token-catalog.js";
import { icon } from "./icons.js";
import { renderReferenceContent } from "./reference-content.js";
import { renderShell, showShellFeedback } from "./shell.js";
import { nextThemeMode, resolveThemeMode, themeModes } from "./theme.js";

renderReferenceContent();
renderShell();

const root = document.documentElement;
const tokenGrid = document.querySelector("[data-token-grid]");
const tokenCount = document.querySelector("[data-token-count]");
const tokenGroupNav = document.querySelector("[data-token-group-nav]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const previewNavLinks = document.querySelectorAll("[data-preview-link]");
const previewSections = [...document.querySelectorAll("[data-preview-section]")];
const previewContextTitle = document.querySelector("[data-preview-context-title]");
const previewContextMeta = document.querySelector("[data-preview-context-meta]");
let tokenGroupObserver;
let tokenHashSynced = false;

function syncThemeColor() {
  let themeColor = document.querySelector('meta[name="theme-color"]');
  if (!themeColor) {
    themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    document.head.append(themeColor);
  }

  themeColor.content = getComputedStyle(root).getPropertyValue("--oc-bg-page").trim();
}

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
  if (sample === "content") return "max-width";
  return "background-color";
}

function readTokenValue(token, sample, resolver) {
  const property = tokenProperty(sample, token.variable);
  resolver.style.cssText = "";
  resolver.style.setProperty(property, `var(${token.variable})`);

  return getComputedStyle(resolver).getPropertyValue(property).trim();
}

function valuesForTheme(group, theme, resolver) {
  const previousTheme = root.dataset.theme;
  root.dataset.theme = theme;

  const values = new Map(
    group.tokens.map((token) => [token.variable, readTokenValue(token, group.sample, resolver)]),
  );

  root.dataset.theme = previousTheme;
  return values;
}

function createTokenPreview(sample, value) {
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

function createTokenValue(sample, value, variable, context) {
  const valueCell = document.createElement("span");
  valueCell.className = "token-value-cell";

  const resolvedValue = document.createElement("button");
  resolvedValue.type = "button";
  resolvedValue.className = "token-value";
  resolvedValue.dataset.copyToken = value;
  resolvedValue.setAttribute("aria-label", `Copy ${context} value ${value} for ${variable}`);
  resolvedValue.textContent = value;
  resolvedValue.title = value;

  valueCell.append(createTokenPreview(sample, value), resolvedValue);
  return valueCell;
}

function createTokenGroup(group, resolver) {
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
  const activeValues = valuesForTheme(group, root.dataset.theme, resolver);
  const lightValues = group.comparison ? valuesForTheme(group, "light", resolver) : null;
  const darkValues = group.comparison ? valuesForTheme(group, "dark", resolver) : null;

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
      nameContent.append(createTokenPreview(group.sample, activeValues.get(token.variable)));
    }
    name.append(nameContent);
    row.append(name);

    if (group.comparison) {
      for (const [theme, value] of [
        ["light", lightValues.get(token.variable)],
        ["dark", darkValues.get(token.variable)],
      ]) {
        const cell = document.createElement("td");
        cell.append(createTokenValue(group.sample, value, token.variable, theme));
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

function renderTokenGroupNavigation(groups) {
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
}

function observeTokenGroups(initialGroupId) {
  tokenGroupObserver?.disconnect();
  if (!tokenGroupNav) return;

  const links = [...tokenGroupNav.querySelectorAll("a")];
  const sections = [...document.querySelectorAll(".token-group")];
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
  if (!("IntersectionObserver" in window)) return;

  tokenGroupObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.querySelector("h2")?.id);
    },
    { rootMargin: "-28% 0px -62% 0px", threshold: [0, 0.1] },
  );
  sections.forEach((section) => tokenGroupObserver.observe(section));
}

function renderTokens() {
  if (!tokenGrid) return;

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

  if (tokenCount) tokenCount.textContent = String(count);
  const tokenHash = resolveTokenHash(window.location.hash);
  renderTokenGroupNavigation(groups);
  tokenGrid.replaceChildren(...groups.map((group) => createTokenGroup(group, resolver)));
  observeTokenGroups(tokenHash?.groupId);
  resolver.remove();

  if (!tokenHashSynced && tokenHash) {
    tokenHashSynced = true;
    syncTokenHash(window.location.hash);
  }
}

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

function syncThemeControl(mode) {
  if (!themeToggle) return;
  const labels = { light: "Light", dark: "Dark", system: "System" };
  const next = nextThemeMode(mode);
  themeToggle.querySelector(".theme-control-icon").innerHTML = icon(
    mode === "light" ? "sun" : mode === "dark" ? "moon" : "system",
  );
  themeToggle.setAttribute(
    "aria-label",
    `Color theme: ${labels[mode]}. Activate to switch to ${labels[next].toLowerCase()}.`,
  );
  themeToggle.title = `${labels[mode]} theme`;
}

function setThemeMode(mode) {
  if (!themeModes.includes(mode)) return;

  const theme = resolveThemeMode(mode, colorScheme.matches);
  root.dataset.theme = theme;
  localStorage.setItem("openclaw-preview-theme-mode", mode);
  localStorage.setItem("openclaw-preview-theme", theme);
  syncThemeControl(mode);
  renderTokens();
  syncThemeColor();
}

let themeMode = localStorage.getItem("openclaw-preview-theme-mode");
if (!themeModes.includes(themeMode)) themeMode = root.dataset.theme === "light" ? "light" : "dark";
themeToggle?.addEventListener("click", () => {
  themeMode = nextThemeMode(themeMode);
  setThemeMode(themeMode);
});
colorScheme.addEventListener("change", () => {
  if (themeMode === "system") setThemeMode(themeMode);
});

bindExampleDialog();

document.querySelectorAll(".home-component-grid .oc-segmented").forEach((control) => {
  control.addEventListener("click", (event) => {
    const item = event.target.closest(".oc-segmented-item");
    if (!item) return;

    const state = item.hasAttribute("aria-selected") ? "aria-selected" : "aria-pressed";
    control.querySelectorAll(`[${state}]`).forEach((option) => option.setAttribute(state, "false"));
    item.setAttribute(state, "true");
  });
});

function setActivePreviewSection(section) {
  const target = section.id ? `#${section.id}` : null;

  for (const link of previewNavLinks) {
    const active = target && link.getAttribute("href") === target;
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }

  if (previewContextTitle) {
    previewContextTitle.textContent = section.dataset.previewTitle || "Overview";
  }

  if (previewContextMeta) {
    previewContextMeta.textContent = section.dataset.previewMeta || "OpenClaw design system";
  }
}

function syncPreviewNavigation() {
  const focusLine = window.innerHeight * 0.32;
  const activeSection = previewSections.reduce(
    (active, section) => (section.getBoundingClientRect().top <= focusLine ? section : active),
    previewSections[0],
  );

  if (activeSection) setActivePreviewSection(activeSection);
}

if (previewSections.length > 0) {
  let pendingSync = false;
  const scheduleNavigationSync = () => {
    if (pendingSync) return;
    pendingSync = true;
    requestAnimationFrame(() => {
      pendingSync = false;
      syncPreviewNavigation();
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(scheduleNavigationSync, {
      rootMargin: "-18% 0px -64% 0px",
      threshold: [0, 0.2, 0.8],
    });
    for (const section of previewSections) observer.observe(section);
  }

  window.addEventListener("scroll", scheduleNavigationSync, { passive: true });
  window.addEventListener("resize", scheduleNavigationSync);
  scheduleNavigationSync();
}

setThemeMode(themeMode);

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-token]");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copyToken);
    button.classList.add("is-copied");
    showShellFeedback(`Copied ${button.dataset.copyToken}`);
    window.setTimeout(() => button.classList.remove("is-copied"), 800);
  } catch {
    button.title = "Copy unavailable in this browser";
    showShellFeedback("Copy unavailable in this browser");
  }
});
