import { getReferenceArea, getReferencePage, referenceAreas } from "./navigation.js";
import { groupSearchResults, rankSearchEntries } from "./search.js";
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
          <img class="brand-mark" src="https://openclaw.ai/favicon.svg" alt="" width="26" height="26" />
          <span class="brand-wordmark">OpenClaw</span>
        </span>
        <span class="brand-context">Design System</span>
      </a>
      <button class="search-trigger" type="button" data-open-search aria-label="Search reference" aria-haspopup="dialog">
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
        <input id="reference-search" type="search" role="combobox" aria-autocomplete="list" aria-controls="search-results" aria-expanded="false" aria-haspopup="listbox" data-search-input aria-label="Search reference" placeholder="Search routes, tokens, and primitives…" autocomplete="off" />
        <kbd>Esc</kbd>
      </div>
      <p class="visually-hidden" data-search-status aria-live="polite"></p>
      <div class="search-results" id="search-results" role="listbox" aria-label="Search results" data-search-results></div>
      <div class="search-empty" data-search-empty hidden>
        <p>No matching reference.</p>
        <button type="button" data-clear-search>Clear search</button>
      </div>
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
      const children = activeArea
        ? `<div class="sidebar-pages">${standalonePages}${groupedPages}</div>`
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

function bindGlobalSearch() {
  const dialog = document.querySelector("[data-search-dialog]");
  const trigger = document.querySelector("[data-open-search]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  const status = document.querySelector("[data-search-status]");
  const empty = document.querySelector("[data-search-empty]");
  if (!dialog || !trigger || !input || !results || !status || !empty) return;

  const entries = [
    ...referenceAreas.flatMap((area) =>
      area.pages.map((page) => ({
        label: page.label,
        detail: area.label,
        type: page.id.startsWith("primitive-") ? "Primitive" : "Page",
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
  let activeIndex = -1;
  let resultLinks = [];

  const setActiveResult = (index) => {
    if (resultLinks.length === 0) {
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
      return;
    }

    activeIndex = (index + resultLinks.length) % resultLinks.length;
    resultLinks.forEach((link, linkIndex) => {
      link.classList.toggle("is-active", linkIndex === activeIndex);
      link.setAttribute("aria-selected", String(linkIndex === activeIndex));
    });
    const active = resultLinks[activeIndex];
    input.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView({ block: "nearest" });
  };

  const renderResults = () => {
    const limit = input.value.trim() ? 12 : 8;
    const { matches, total } = rankSearchEntries(entries, input.value, limit);

    results.replaceChildren();
    resultLinks = [];
    activeIndex = -1;
    input.removeAttribute("aria-activedescendant");
    status.textContent = total > matches.length
      ? `${matches.length} of ${total} results shown.`
      : `${total} result${total === 1 ? "" : "s"}.`;
    empty.hidden = matches.length > 0;

    if (matches.length === 0) {
      return;
    }

    for (const group of groupSearchResults(matches)) {
      const section = document.createElement("section");
      section.className = "search-result-group";
      section.setAttribute("role", "group");

      const heading = document.createElement("p");
      heading.className = "search-result-group-label";
      heading.id = `search-result-group-${group.type.toLowerCase()}`;
      heading.textContent = group.type === "Page" ? "Pages" : `${group.type}s`;
      section.setAttribute("aria-labelledby", heading.id);
      section.append(heading);

      for (const match of group.entries) {
        const link = document.createElement("a");
        link.id = `search-result-${resultLinks.length}`;
        link.href = match.href;
        link.className = "search-result";
        link.setAttribute("role", "option");
        link.setAttribute("aria-selected", "false");
        link.tabIndex = -1;
        link.dataset.searchResult = "";

        const content = document.createElement("span");
        const label = document.createElement("strong");
        const detail = document.createElement("small");
        label.textContent = match.label;
        detail.textContent = match.detail;
        content.append(label, detail);
        link.append(content);
        link.addEventListener("focus", () => setActiveResult(resultLinks.indexOf(link)));
        link.addEventListener("pointerenter", () => setActiveResult(resultLinks.indexOf(link)));
        resultLinks.push(link);
        section.append(link);
      }

      results.append(section);
    }
  };

  const openSearch = () => {
    renderResults();
    dialog.showModal();
    input.setAttribute("aria-expanded", "true");
    input.focus();
  };

  trigger.addEventListener("click", openSearch);
  input.addEventListener("input", renderResults);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveResult(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveResult(activeIndex < 0 ? resultLinks.length - 1 : activeIndex - 1);
    } else if (event.key === "Home" && activeIndex >= 0) {
      event.preventDefault();
      setActiveResult(0);
    } else if (event.key === "End" && activeIndex >= 0) {
      event.preventDefault();
      setActiveResult(resultLinks.length - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      resultLinks[activeIndex].click();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (!event.target.closest("[data-clear-search]")) return;
    input.value = "";
    renderResults();
    input.focus();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    trigger.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.isComposing) return;
    const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    const slash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
    const target = event.target instanceof Element ? event.target : document.activeElement;
    const typing = target?.isContentEditable || target?.matches("input, textarea, select, [contenteditable]");
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
        (element) => !element.hidden,
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
  bindNavigation();
  bindGlobalSearch();
  bindCopyActions();

  document.querySelector(".skip-link")?.addEventListener("click", () => {
    window.setTimeout(() => main?.focus(), 0);
  });
}
