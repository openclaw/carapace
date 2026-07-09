import { groupTokenDefinitions } from "./token-catalog.js";

const root = document.documentElement;
const tokenGrid = document.querySelector("[data-token-grid]");
const tokenCount = document.querySelector("[data-token-count]");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const dialog = document.querySelector("dialog");
const dialogTrigger = document.querySelector("[data-open-dialog]");
const previewNavLinks = document.querySelectorAll("[data-preview-link]");
const previewSections = [...document.querySelectorAll("[data-preview-section]")];
const previewContextTitle = document.querySelector("[data-preview-context-title]");
const previewContextMeta = document.querySelector("[data-preview-context-meta]");

function createTokenSample(sample, value) {
  const element = document.createElement("div");
  element.className = `token-sample token-sample--${sample}`;
  element.style.setProperty("--token-value", value);
  element.setAttribute("aria-hidden", "true");

  if (sample === "text" || sample === "type-scale" || sample === "font") {
    element.textContent = "Ag";
  } else if (sample === "motion") {
    element.textContent = "↗";
  }

  return element;
}

function createTokenCard(token, sample, styles) {
  const value = styles.getPropertyValue(token.variable).trim();
  const card = document.createElement("article");
  card.className = "token-card";

  const meta = document.createElement("div");
  meta.className = "token-meta";

  const variable = document.createElement("code");
  variable.className = "token-variable";
  variable.textContent = token.variable;
  variable.title = token.variable;

  const resolvedValue = document.createElement("code");
  resolvedValue.className = "token-value";
  resolvedValue.textContent = value;
  resolvedValue.title = value;

  meta.append(variable, resolvedValue);
  card.append(createTokenSample(sample, value), meta);
  return card;
}

function createTokenGroup(group, styles) {
  const section = document.createElement("section");
  section.className = "token-group";

  const heading = document.createElement("header");
  heading.className = "token-group-heading";

  const title = document.createElement("h3");
  title.textContent = group.label;

  const count = document.createElement("span");
  count.textContent = `${group.tokens.length} token${group.tokens.length === 1 ? "" : "s"}`;

  heading.append(title, count);

  const grid = document.createElement("div");
  grid.className = "token-group-grid";
  grid.append(...group.tokens.map((token) => createTokenCard(token, group.sample, styles)));

  section.append(heading, grid);
  return section;
}

function renderTokens() {
  if (!tokenGrid) return;

  const styles = getComputedStyle(root);
  const groups = groupTokenDefinitions();
  const count = groups.reduce((total, group) => total + group.tokens.length, 0);

  if (tokenCount) tokenCount.textContent = String(count);
  tokenGrid.replaceChildren(...groups.map((group) => createTokenGroup(group, styles)));
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("openclaw-preview-theme", theme);
  renderTokens();
}

for (const button of themeButtons) {
  button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
}

dialogTrigger.addEventListener("click", () => dialog.showModal());

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

renderTokens();
