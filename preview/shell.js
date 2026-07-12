import {
  getAdjacentReferencePages,
  getReferenceArea,
  getReferencePage,
  introductionPage,
  referenceAreas,
} from "./navigation.js";
import { icon } from "./icons.js";

let feedbackTimeout;
const sidebarDisclosureStorageKey = "openclaw.preview.sidebar.openAreas.v2";
const defaultOpenSidebarAreas = [];

const pageKinds = {
  overview: "home",
  foundations: "index",
  interface: "index",
  compositions: "index",
  resources: "index",
  "foundation-tokens": "catalog",
  "foundation-colors": "catalog",
  "foundation-typography": "catalog",
  "foundation-layout": "catalog",
  "foundation-shape-depth": "catalog",
  "foundation-motion": "catalog",
  "foundation-base": "guide",
  "interface-primitives": "index",
  "primitive-app-surface": "reference",
  "primitive-hero": "reference",
  "primitive-section": "reference",
  "primitive-card": "reference",
  "primitive-action": "reference",
  "primitive-segmented": "reference",
  "primitive-pill": "reference",
  "interface-examples": "example",
  "composition-product": "composition",
  "composition-content": "composition",
  "composition-public": "composition",
  "resource-getting-started": "guide",
  "resource-package-exports": "guide",
  "resource-theming": "guide",
  "resource-adapters": "guide",
  "resource-tailwind": "guide",
  "resource-skills": "guide",
  "resource-brand": "guide",
  "resource-governance": "guide",
  "resource-design-audit": "guide",
  "resource-accessibility": "guide",
  "resource-release": "release",
};

function applyPageKind() {
  const currentId = document.body.dataset.previewPage || document.body.dataset.previewRoute;
  document.body.dataset.pageKind = pageKinds[currentId] || "reference";
}

export function showShellFeedback(message) {
  const feedback = document.querySelector("[data-shell-feedback]");
  if (!feedback) return;

  window.clearTimeout(feedbackTimeout);
  feedback.textContent = message;
  feedback.classList.add("is-visible");
  feedbackTimeout = window.setTimeout(() => feedback.classList.remove("is-visible"), 1400);
}

function hrefFor(path) {
  return `${document.body.dataset.previewRoot || "./"}${path}`;
}

export function resolveOpenSidebarAreas(storedValue, currentAreaId) {
  let ids = defaultOpenSidebarAreas;

  if (storedValue !== null) {
    try {
      const parsed = JSON.parse(storedValue);
      if (Array.isArray(parsed)) ids = parsed;
    } catch {
      // Invalid persisted state falls back to the default disclosure.
    }
  }

  const openAreas = new Set(ids);
  if (currentAreaId) openAreas.add(currentAreaId);
  return openAreas;
}

function readOpenSidebarAreas(currentAreaId) {
  try {
    const value = window.localStorage.getItem(sidebarDisclosureStorageKey);
    return resolveOpenSidebarAreas(value, currentAreaId);
  } catch {
    return resolveOpenSidebarAreas(null, currentAreaId);
  }
}

function writeOpenSidebarAreas(openAreas) {
  try {
    window.localStorage.setItem(sidebarDisclosureStorageKey, JSON.stringify([...openAreas]));
  } catch {
    // Sidebar disclosure still works for the current page when storage is unavailable.
  }
}

function renderThemeControl() {
  return `
    <button class="theme-control shell-control" type="button" data-theme-toggle aria-label="Color theme: Dark. Activate to switch to system." title="Dark theme">
      <span class="theme-control-icon">${icon("moon")}</span>
    </button>
  `;
}

function renderTopbar() {
  const mount = document.querySelector("[data-shell-header]");
  if (!mount) return;

  mount.outerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="topbar">
      <button class="mobile-nav-trigger shell-control" type="button" data-open-navigation aria-label="Open navigation" aria-controls="reference-navigation" aria-expanded="false">
        <span></span><span></span>
      </button>
      <a class="brand" href="${hrefFor("")}" aria-label="OpenClaw design system overview" translate="no">
        <span class="brand-primary">
          <img class="brand-mark" src="https://openclaw.ai/favicon.svg" alt="" width="26" height="26" fetchpriority="high" />
          <span class="brand-wordmark">OpenClaw</span>
        </span>
        <span class="brand-context">Design System</span>
      </a>
      <div class="topbar-actions">
        <a class="github-link" href="https://github.com/openclaw/design-system" rel="noreferrer">${icon("github")}<span>GitHub</span></a>
        ${renderThemeControl()}
      </div>
    </header>
    <div class="shell-feedback" role="status" aria-live="polite" data-shell-feedback></div>
  `;
}

function renderSidebar() {
  const mount = document.querySelector("[data-shell-sidebar]");
  if (!mount) return;

  const currentId = document.body.dataset.previewPage || document.body.dataset.previewRoute;
  const currentArea = getReferenceArea(currentId);
  const openAreas = readOpenSidebarAreas(currentArea?.id);
  const foundations = referenceAreas.find((area) => area.id === "foundations");
  const foundationLinks = foundations?.pages
    .map((page) => `<a class="sidebar-foundation-link" href="${hrefFor(page.path)}"${page.id === currentId ? ' aria-current="page"' : ""}>${page.label}</a>`)
    .join("") || "";
  const areas = referenceAreas
    .filter((area) => area.id !== "foundations")
    .map((area) => {
      const activeArea = currentArea?.id === area.id;
      const expanded = openAreas.has(area.id);
      const pageLink = (page) =>
        `<a href="${hrefFor(page.path)}"${page.id === currentId ? ' aria-current="page"' : ""}>${page.label}</a>`;
      const standalonePages = area.pages.filter((page) => !page.group).map(pageLink).join("");
      const groups = [...new Set(area.pages.map((page) => page.group).filter(Boolean))];
      const groupedPages = groups
        .map((group) => {
          const groupId = `sidebar-${area.id}-${group.toLowerCase().replaceAll(" ", "-")}`;
          const pages = area.pages.filter((page) => page.group === group).map(pageLink).join("");
          return `<div class="sidebar-page-group" role="group" aria-labelledby="${groupId}"><p class="sidebar-pages-label" id="${groupId}">${group}</p>${pages}</div>`;
        })
        .join("");
      const panelId = `sidebar-area-${area.id}`;

      return `
        <div class="sidebar-area${activeArea ? " is-current" : ""}" data-sidebar-area data-sidebar-area-id="${area.id}">
          <button class="sidebar-area-toggle shell-control" type="button" data-sidebar-area-toggle aria-expanded="${expanded}" aria-controls="${panelId}">
            <span>${area.label}</span>
          </button>
          <div class="sidebar-pages" id="${panelId}" data-sidebar-area-panel${expanded ? "" : " hidden"}>
            ${standalonePages}${groupedPages}
          </div>
        </div>
      `;
    })
    .join("");

  mount.outerHTML = `
    <aside class="sidebar" id="reference-navigation" data-navigation>
      <div class="sidebar-heading">
        <button class="mobile-nav-close shell-control" type="button" data-close-navigation aria-label="Close navigation">×</button>
      </div>
      <nav aria-label="Design system reference">
        <a class="sidebar-introduction" href="${hrefFor(introductionPage.path)}"${currentId === introductionPage.id ? ' aria-current="page"' : ""}>${introductionPage.label}</a>
        <div class="sidebar-foundations">${foundationLinks}</div>
        ${areas}
      </nav>
      <div class="version" aria-label="Current release v0.0.1" translate="no">
        <span>Release</span><strong>v0.0.1</strong>
      </div>
    </aside>
    <button class="navigation-backdrop" type="button" data-close-navigation aria-label="Close navigation"></button>
  `;
}

function bindSidebarDisclosures() {
  const toggles = [...document.querySelectorAll("[data-sidebar-area-toggle]")];
  const openAreas = readOpenSidebarAreas();
  document.querySelectorAll("[data-sidebar-area].is-current").forEach((area) => {
    if (area instanceof HTMLElement && area.dataset.sidebarAreaId) {
      openAreas.add(area.dataset.sidebarAreaId);
    }
  });

  const setExpanded = (toggle, expanded) => {
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!panel) return;
    toggle.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const expand = toggle.getAttribute("aria-expanded") !== "true";
      setExpanded(toggle, expand);
      const area = toggle.closest("[data-sidebar-area]");
      if (area instanceof HTMLElement && area.dataset.sidebarAreaId) {
        if (expand) {
          openAreas.add(area.dataset.sidebarAreaId);
        } else {
          openAreas.delete(area.dataset.sidebarAreaId);
        }
        writeOpenSidebarAreas(openAreas);
      }
    });
  });
}

function renderPageContext() {
  document.querySelector(".canvas-header")?.remove();
}

function renderPageNavigation() {
  const currentId = document.body.dataset.previewPage || document.body.dataset.previewRoute;
  const mount = document.querySelector(".preview-stage");
  if (!mount || mount.querySelector(".page-navigation")) return;

  const { previous, next } = getAdjacentReferencePages(currentId);
  if (!previous && !next) return;

  const navigation = document.createElement("nav");
  navigation.className = "page-navigation";
  if (!previous || !next) navigation.classList.add("page-navigation-single");
  navigation.setAttribute("aria-label", "Adjacent reference pages");
  navigation.innerHTML = `
    ${previous ? `<a class="page-navigation-previous" href="${hrefFor(previous.path)}"><span>Previous</span><strong>${previous.label}</strong></a>` : ""}
    ${next ? `<a class="page-navigation-next" href="${hrefFor(next.path)}"><span>Next</span><strong>${next.label}</strong></a>` : ""}
  `;
  mount.append(navigation);
}

function renderTableOfContents() {
  const mount = document.querySelector("[data-page-toc]");
  const headings = [...document.querySelectorAll(".reference-page section h2[id]")];
  if (!mount || headings.length < 2) {
    mount?.parentElement?.classList.add("page-layout-no-toc");
    mount?.remove();
    return;
  }

  const linksMarkup = headings
    .map((heading) => `<a href="#${heading.id}">${heading.textContent}</a>`)
    .join("");
  mount.innerHTML = `<p>On this page</p><nav aria-label="Page contents">${linksMarkup}</nav>`;

  const intro = document.querySelector(".reference-intro");
  if (intro) {
    intro.insertAdjacentHTML(
      "afterend",
      `<details class="inline-toc"><summary><span>On this page</span><small>${headings.length} sections</small></summary><nav aria-label="Page contents">${linksMarkup}</nav></details>`,
    );
    document.querySelector(".inline-toc")?.addEventListener("click", (event) => {
      if (event.target.closest("a")) event.currentTarget.open = false;
    });
  }

  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".page-toc a, .inline-toc a")];
  const setActive = (id) => {
    for (const link of links) {
      link.toggleAttribute("aria-current", link.hash === `#${id}`);
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-18% 0px -72% 0px", threshold: [0, 1] },
  );
  headings.forEach((heading) => observer.observe(heading));
  setActive(headings[0].id);
}

function bindCopyActions() {
  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  };

  document.addEventListener("click", async (event) => {
    const codeButton = event.target.closest("[data-copy-code]");
    if (codeButton) {
      const code = codeButton.closest(".code-block")?.querySelector("code")?.textContent || "";
      if (await copyText(code)) showShellFeedback("Code copied.");
      else showShellFeedback("Clipboard access unavailable.");
    }
  });
}

function bindNavigation() {
  const navigation = document.querySelector("[data-navigation]");
  const open = document.querySelector("[data-open-navigation]");
  const closeButtons = [...document.querySelectorAll("[data-close-navigation]")];
  if (!navigation || !open || closeButtons.length === 0) return;
  const mobileNavigation = window.matchMedia("(max-width: 900px)");
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const setOpen = (value, restoreFocus = true) => {
    if (value) navigation.inert = false;
    navigation.classList.toggle("is-open", value);
    open.setAttribute("aria-expanded", String(value));
    document.body.classList.toggle("navigation-open", value);
    if (value && mobileNavigation.matches) {
      navigation.setAttribute("role", "dialog");
      navigation.setAttribute("aria-modal", "true");
      navigation.setAttribute("aria-label", "Reference navigation");
      navigation.querySelector("[data-close-navigation]")?.focus();
    } else {
      navigation.removeAttribute("role");
      navigation.removeAttribute("aria-modal");
      navigation.removeAttribute("aria-label");
      if (restoreFocus && mobileNavigation.matches) open.focus();
      navigation.inert = mobileNavigation.matches;
    }
  };

  const syncNavigationMode = () => {
    if (!mobileNavigation.matches) {
      navigation.classList.remove("is-open");
      navigation.inert = false;
      navigation.removeAttribute("role");
      navigation.removeAttribute("aria-modal");
      navigation.removeAttribute("aria-label");
      document.body.classList.remove("navigation-open");
      open.setAttribute("aria-expanded", "false");
      return;
    }

    navigation.inert = !navigation.classList.contains("is-open");
  };

  open.addEventListener("click", () => setOpen(true));
  closeButtons.forEach((button) => button.addEventListener("click", () => setOpen(false)));
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false, false);
  });
  document.addEventListener("keydown", (event) => {
    if (!navigation.classList.contains("is-open") || !mobileNavigation.matches) return;
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "Tab") {
      const focusable = [...navigation.querySelectorAll(focusableSelector)].filter(
        (element) => !element.closest("[hidden]"),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  mobileNavigation.addEventListener("change", syncNavigationMode);
  syncNavigationMode();

  const current = navigation.querySelector('[aria-current="page"]');
  const nav = navigation.querySelector("nav");
  if (current && nav) {
    const navRect = nav.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    if (currentRect.top < navRect.top) nav.scrollTop -= navRect.top - currentRect.top;
    if (currentRect.bottom > navRect.bottom) nav.scrollTop += currentRect.bottom - navRect.bottom;
  }
}

export function renderShell() {
  applyPageKind();
  const main = document.querySelector("main");
  if (main) {
    main.id = "main-content";
    main.tabIndex = -1;
  }
  renderTopbar();
  renderSidebar();
  renderPageContext();
  renderPageNavigation();
  renderTableOfContents();
  bindSidebarDisclosures();
  bindNavigation();
  bindCopyActions();

  document.querySelector(".skip-link")?.addEventListener("click", () => {
    window.setTimeout(() => main?.focus(), 0);
  });
}
