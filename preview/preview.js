import { groupTokenDefinitions } from "./token-catalog.js";
import { renderReferenceContent } from "./reference-content.js";
import { renderShell, showShellFeedback } from "./shell.js";

renderReferenceContent();
renderShell();

const root = document.documentElement;
const tokenGrid = document.querySelector("[data-token-grid]");
const tokenCount = document.querySelector("[data-token-count]");
const tokenFilter = document.querySelector("[data-token-filter]");
const tokenFilterClear = document.querySelector("[data-clear-token-filter]");
const tokenGroupNav = document.querySelector("[data-token-group-nav]");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const dialog = document.querySelector("dialog");
const dialogTrigger = document.querySelector("[data-open-dialog]");
const previewNavLinks = document.querySelectorAll("[data-preview-link]");
const previewSections = [...document.querySelectorAll("[data-preview-section]")];
const previewContextTitle = document.querySelector("[data-preview-context-title]");
const previewContextMeta = document.querySelector("[data-preview-context-meta]");
let tokenGroupObserver;

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
  headingCopy.append(title, description);
  heading.append(headingCopy, count);

  const tableWrap = document.createElement("div");
  tableWrap.className = "token-table-wrap";

  const table = document.createElement("table");
  table.className = "token-table";
  table.classList.toggle("token-table--comparison", Boolean(group.comparison));

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  const headings = group.comparison ? ["Token", "Light", "Dark"] : ["Token", "Preview", "Value"];
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
    const name = document.createElement("th");
    name.scope = "row";
    name.className = "token-name";

    const variable = document.createElement("button");
    variable.type = "button";
    variable.dataset.copyToken = token.variable;
    variable.setAttribute("aria-label", `Copy token name ${token.variable}`);
    variable.textContent = token.variable;
    variable.title = token.variable;
    name.append(variable);
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
      const previewCell = document.createElement("td");
      previewCell.className = "token-preview-cell";
      previewCell.append(createTokenPreview(group.sample, value));

      const valueCell = document.createElement("td");
      const resolvedValue = document.createElement("button");
      resolvedValue.type = "button";
      resolvedValue.className = "token-value";
      resolvedValue.dataset.copyToken = value;
      resolvedValue.setAttribute("aria-label", `Copy resolved value ${value} for ${token.variable}`);
      resolvedValue.textContent = value;
      resolvedValue.title = value;
      valueCell.append(resolvedValue);

      row.append(previewCell, valueCell);
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

function observeTokenGroups() {
  tokenGroupObserver?.disconnect();
  if (!tokenGroupNav || !("IntersectionObserver" in window)) return;

  const links = [...tokenGroupNav.querySelectorAll("a")];
  const sections = [...document.querySelectorAll(".token-group")];
  const setActive = (id) => {
    for (const link of links) {
      if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

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
  if (sections[0]) setActive(sections[0].querySelector("h2")?.id);
}

function createTokenEmptyState() {
  const empty = document.createElement("div");
  empty.className = "token-empty";

  const title = document.createElement("h2");
  title.textContent = "No tokens found";

  const copy = document.createElement("p");
  copy.textContent = "Try another token name or group.";

  const clear = document.createElement("button");
  clear.type = "button";
  clear.dataset.clearTokenFilter = "";
  clear.textContent = "Clear filter";
  empty.append(title, copy, clear);
  return empty;
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
  const query = tokenFilter?.value.trim().toLowerCase() || "";
  const groups = groupTokenDefinitions()
    .filter((group) => requestedGroups.size === 0 || requestedGroups.has(group.id))
    .map((group) => ({
      ...group,
      tokens: group.tokens.filter(
        (token) =>
          !query ||
          `${token.variable} ${group.id} ${group.label} ${group.description}`
            .toLowerCase()
            .includes(query),
      ),
    }))
    .filter((group) => group.tokens.length > 0);
  const count = groups.reduce((total, group) => total + group.tokens.length, 0);

  if (tokenCount) tokenCount.textContent = String(count);
  if (tokenFilterClear) tokenFilterClear.hidden = query.length === 0;
  renderTokenGroupNavigation(groups);
  tokenGrid.replaceChildren(
    ...(groups.length > 0
      ? groups.map((group) => createTokenGroup(group, resolver))
      : [createTokenEmptyState()]),
  );
  observeTokenGroups();
  resolver.remove();
}

function syncTokenFilterUrl() {
  if (!tokenFilter) return;
  const url = new URL(window.location.href);
  const query = tokenFilter.value.trim();
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function syncThemeControls(theme) {
  for (const button of themeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
  }
}

function setTheme(theme) {
  if (theme !== "light" && theme !== "dark") return;

  root.dataset.theme = theme;
  localStorage.setItem("openclaw-preview-theme", theme);
  syncThemeControls(theme);
  renderTokens();
  syncThemeColor();
}

for (const button of themeButtons) {
  button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
}

if (dialog && dialogTrigger) {
  dialogTrigger.addEventListener("click", () => dialog.showModal());
}

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

syncThemeControls(root.dataset.theme);
if (tokenFilter) {
  tokenFilter.value = new URLSearchParams(window.location.search).get("q") || "";
  tokenFilter.addEventListener("input", () => {
    syncTokenFilterUrl();
    renderTokens();
  });
}

document.addEventListener("click", (event) => {
  const clear = event.target.closest("[data-clear-token-filter]");
  if (!clear || !tokenFilter) return;
  tokenFilter.value = "";
  tokenFilter.focus();
  syncTokenFilterUrl();
  renderTokens();
});

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

renderTokens();
syncThemeColor();
