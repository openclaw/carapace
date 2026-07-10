import { getReferenceArea, getReferencePage, referenceAreas } from "./navigation.js";
import { tokenDefinitions } from "./token-catalog.js";

let feedbackTimeout;

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

function renderThemeControl() {
  return `
    <div class="oc-segmented theme-control" role="group" aria-label="Color theme">
      <button class="oc-segmented-item" type="button" data-theme-choice="light" aria-pressed="false">Light</button>
      <button class="oc-segmented-item" type="button" data-theme-choice="dark" aria-pressed="true">Dark</button>
    </div>
  `;
}

function renderTopbar() {
  const mount = document.querySelector("[data-shell-header]");
  if (!mount) return;

  mount.outerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="topbar">
      <button class="mobile-nav-trigger" type="button" data-open-navigation aria-label="Open navigation" aria-controls="reference-navigation" aria-expanded="false">
        <span></span><span></span>
      </button>
      <a class="brand" href="${hrefFor("")}" aria-label="OpenClaw design system overview">
        <span class="brand-primary">
          <img class="brand-mark" src="https://openclaw.ai/favicon.svg" alt="" />
          <span class="brand-wordmark">OpenClaw</span>
        </span>
        <span class="brand-context">Design System</span>
      </a>
      <button class="search-trigger" type="button" data-open-search aria-label="Search reference">
        <span>Search reference</span><kbd>⌘ K</kbd>
      </button>
      <div class="topbar-actions">
        <a class="github-link" href="https://github.com/openclaw/design-system" rel="noreferrer">GitHub</a>
        ${renderThemeControl()}
      </div>
    </header>
    <dialog class="search-dialog" data-search-dialog aria-label="Search design system reference">
      <div class="search-field">
        <span aria-hidden="true">⌕</span>
        <input type="search" data-search-input aria-label="Search reference" placeholder="Search routes, tokens, and primitives" autocomplete="off" />
        <kbd>Esc</kbd>
      </div>
      <div class="search-results" data-search-results></div>
    </dialog>
    <div class="shell-feedback" role="status" aria-live="polite" data-shell-feedback></div>
  `;
}

function renderSidebar() {
  const mount = document.querySelector("[data-shell-sidebar]");
  if (!mount) return;

  const currentId = document.body.dataset.previewPage || document.body.dataset.previewRoute;
  const currentArea = getReferenceArea(currentId);
  const areas = referenceAreas
    .map((area) => {
      const activeArea = currentArea?.id === area.id;
      let previousGroup;
      const children = activeArea
        ? `<div class="sidebar-pages">${area.pages
            .map((page) => {
              const group = page.group && page.group !== previousGroup
                ? `<p class="sidebar-pages-label">${page.group}</p>`
                : "";
              previousGroup = page.group;
              return `${group}<a href="${hrefFor(page.path)}"${page.id === currentId ? ' aria-current="page"' : ""}>${page.label}</a>`;
            })
            .join("")}</div>`
        : "";

      return `
        <div class="sidebar-area${activeArea ? " is-active" : ""}">
          <a class="sidebar-area-link" href="${hrefFor(area.path)}">
            <span>${area.label}</span>
          </a>
          ${children}
        </div>
      `;
    })
    .join("");

  mount.outerHTML = `
    <aside class="sidebar" id="reference-navigation" data-navigation>
      <div class="sidebar-heading">
        <p class="eyebrow">Reference</p>
        <button class="mobile-nav-close" type="button" data-close-navigation aria-label="Close navigation">×</button>
      </div>
      <nav aria-label="Design system reference">${areas}</nav>
      <a class="version" href="${hrefFor("resources/release/")}" aria-label="Release v0.0.1">
        <span>Release</span><strong>v0.0.1</strong>
      </a>
    </aside>
    <button class="navigation-backdrop" type="button" data-close-navigation aria-label="Close navigation"></button>
  `;
}

function renderPageContext() {
  const currentId = document.body.dataset.previewPage || document.body.dataset.previewRoute;
  const page = getReferencePage(currentId);
  const area = getReferenceArea(currentId);
  const title = document.querySelector("[data-preview-context-title]");
  const meta = document.querySelector("[data-preview-context-meta]");

  if (title && page) title.textContent = page.label;
  if (meta && area) meta.textContent = area.label;

  const header = document.querySelector(".canvas-header");
  if (header && currentId !== "overview" && !header.querySelector("[data-copy-page]")) {
    const actions = document.createElement("div");
    actions.className = "canvas-actions";
    if (meta) actions.append(meta);

    const copy = document.createElement("button");
    copy.type = "button";
    copy.dataset.copyPage = "";
    copy.textContent = "Copy page";
    actions.append(copy);
    header.append(actions);
  }
}

function renderPageNavigation() {
  const currentId = document.body.dataset.previewPage || document.body.dataset.previewRoute;
  const area = getReferenceArea(currentId);
  const currentIndex = area?.pages.findIndex((page) => page.id === currentId) ?? -1;
  const mount = document.querySelector(".preview-stage");
  if (!mount || currentIndex < 0 || mount.querySelector(".page-navigation")) return;

  const previous = area.pages[currentIndex - 1];
  const next = area.pages[currentIndex + 1];
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
    mount?.remove();
    return;
  }

  mount.innerHTML = `<p>On this page</p><nav>${headings
    .map((heading) => `<a href="#${heading.id}">${heading.textContent}</a>`)
    .join("")}</nav>`;

  if (!("IntersectionObserver" in window)) return;
  const links = [...mount.querySelectorAll("a")];
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

function bindGlobalSearch() {
  const dialog = document.querySelector("[data-search-dialog]");
  const trigger = document.querySelector("[data-open-search]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  if (!dialog || !trigger || !input || !results) return;

  const entries = [
    ...referenceAreas.flatMap((area) =>
      area.pages.map((page) => ({
        label: page.label,
        detail: area.label,
        type: "Page",
        href: hrefFor(page.path),
        keywords: `${area.label} ${area.description} ${page.keywords || ""}`,
      })),
    ),
    ...tokenDefinitions.map((token) => ({
      label: token.variable,
      detail: "Canonical variable",
      type: "Token",
      href: `${hrefFor("foundations/tokens/")}?q=${encodeURIComponent(token.variable)}`,
      keywords: token.group,
    })),
  ];

  const renderResults = () => {
    const query = input.value.trim().toLowerCase();
    const matches = entries
      .filter((entry) => !query || `${entry.label} ${entry.detail} ${entry.keywords}`.toLowerCase().includes(query))
      .slice(0, query ? 12 : 8);

    results.replaceChildren();
    if (matches.length === 0) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "No matching reference.";
      results.append(empty);
      return;
    }

    for (const match of matches) {
      const link = document.createElement("a");
      link.href = match.href;
      link.className = "search-result";

      const content = document.createElement("span");
      const label = document.createElement("strong");
      const detail = document.createElement("small");
      label.textContent = match.label;
      detail.textContent = match.detail;
      content.append(label, detail);

      const type = document.createElement("span");
      type.className = "search-result-type";
      type.textContent = match.type;
      link.append(content, type);
      results.append(link);
    }
  };

  const openSearch = () => {
    renderResults();
    dialog.showModal();
    input.focus();
  };

  trigger.addEventListener("click", openSearch);
  input.addEventListener("input", renderResults);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener("keydown", (event) => {
    const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    const slash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
    if ((shortcut || (slash && !typing)) && !dialog.open) {
      event.preventDefault();
      openSearch();
    }
  });
}

function bindCopyActions() {
  const copyText = async (button, value) => {
    const previous = button.textContent;
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy unavailable";
    }
    window.setTimeout(() => {
      button.textContent = previous;
    }, 1200);
  };

  document.addEventListener("click", (event) => {
    const codeButton = event.target.closest("[data-copy-code]");
    if (codeButton) {
      const code = codeButton.closest(".code-block")?.querySelector("code")?.textContent || "";
      copyText(codeButton, code);
      return;
    }

    const pageButton = event.target.closest("[data-copy-page]");
    if (pageButton) {
      const page = document.querySelector(".reference-page, .preview-stage");
      copyText(pageButton, page?.innerText || "");
    }
  });
}

function bindNavigation() {
  const navigation = document.querySelector("[data-navigation]");
  const open = document.querySelector("[data-open-navigation]");
  const closeButtons = [...document.querySelectorAll("[data-close-navigation]")];
  if (!navigation || !open || closeButtons.length === 0) return;

  const setOpen = (value, restoreFocus = true) => {
    navigation.classList.toggle("is-open", value);
    open.setAttribute("aria-expanded", String(value));
    document.body.classList.toggle("navigation-open", value);
    if (value) navigation.querySelector("[data-close-navigation]")?.focus();
    else if (restoreFocus) open.focus();
  };

  open.addEventListener("click", () => setOpen(true));
  closeButtons.forEach((button) => button.addEventListener("click", () => setOpen(false)));
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false, false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) setOpen(false);
  });

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
  const main = document.querySelector("main");
  if (main) main.id = "main-content";
  renderTopbar();
  renderSidebar();
  renderPageContext();
  renderPageNavigation();
  renderTableOfContents();
  bindNavigation();
  bindGlobalSearch();
  bindCopyActions();
}
