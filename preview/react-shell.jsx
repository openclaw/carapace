import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { icon } from "./icons.js";
import {
  compareReferenceLabels,
  getReferenceArea,
  introductionPage,
  referenceAreas,
} from "./navigation.js";
import { groupSearchResults, rankSearchEntries } from "./search.js";
import { tokenDefinitions } from "./token-catalog.js";
import { nextThemeMode, resolveThemeMode, themeModes } from "./theme.js";

const brandMarkUrl = new URL("./assets/openclaw-mark.png", import.meta.url).href;
const brandMarkHoverUrl = new URL("./assets/openclaw-mark-hover.png", import.meta.url).href;
const sidebarStorageKey = "openclaw.preview.sidebar.openAreas.v2";
const mobileNavigationQuery = "(max-width: 900px)";

const pageKinds = {
  overview: "home",
  foundations: "index",
  interface: "index",
  charts: "index",
  blocks: "index",
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

function Icon({ name }) {
  return <span dangerouslySetInnerHTML={{ __html: icon(name) }} />;
}

function hrefFor(siteRoot, path = "") {
  return `${siteRoot || "./"}${path}`;
}

function readOpenAreas(currentAreaId) {
  let ids = [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(sidebarStorageKey));
    if (Array.isArray(parsed)) ids = parsed;
  } catch {
    // Storage is optional; disclosure state still works for this session.
  }

  const areas = new Set(ids);
  if (currentAreaId) areas.add(currentAreaId);
  return areas;
}

function persistOpenAreas(openAreas) {
  try {
    window.localStorage.setItem(sidebarStorageKey, JSON.stringify([...openAreas]));
  } catch {
    // Storage is optional; disclosure state still works for this session.
  }
}

function shouldHandleNavigation(event) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function useMobileNavigation() {
  const [mobile, setMobile] = useState(() => window.matchMedia(mobileNavigationQuery).matches);

  useEffect(() => {
    const media = window.matchMedia(mobileNavigationQuery);
    const update = () => setMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return mobile;
}

function ThemeControl() {
  const [colorScheme] = useState(() => window.matchMedia("(prefers-color-scheme: dark)"));
  const [mode, setMode] = useState(() => {
    const stored = window.localStorage.getItem("openclaw-preview-theme-mode");
    if (themeModes.includes(stored)) return stored;
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  });
  const [prefersDark, setPrefersDark] = useState(colorScheme.matches);

  useEffect(() => {
    const update = () => setPrefersDark(colorScheme.matches);
    colorScheme.addEventListener("change", update);
    return () => colorScheme.removeEventListener("change", update);
  }, [colorScheme]);

  useEffect(() => {
    const resolved = resolveThemeMode(mode, prefersDark);
    document.documentElement.dataset.theme = resolved;
    window.localStorage.setItem("openclaw-preview-theme-mode", mode);
    window.localStorage.setItem("openclaw-preview-theme", resolved);

    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.name = "theme-color";
      document.head.append(themeColor);
    }
    themeColor.content = getComputedStyle(document.documentElement)
      .getPropertyValue("--oc-bg-page")
      .trim();
    window.dispatchEvent(new CustomEvent("previewthemechange", {
      detail: { mode, theme: resolved },
    }));
  }, [mode, prefersDark]);

  const labels = { light: "Light", dark: "Dark", system: "System" };
  const next = nextThemeMode(mode);

  return (
    <button
      className="theme-control shell-control"
      type="button"
      data-theme-toggle
      aria-label={`Color theme: ${labels[mode]}. Activate to switch to ${labels[next].toLowerCase()}.`}
      title={`${labels[mode]} theme`}
      onClick={() => setMode(next)}
    >
      <span className="theme-control-icon">
        <Icon name={mode === "light" ? "sun" : mode === "dark" ? "moon" : "system"} />
      </span>
    </button>
  );
}

function GlobalSearch({ currentPageId, siteRoot, onNavigate }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const resultRefs = useRef([]);
  const restoreFocusRef = useRef(true);
  const previousPageRef = useRef(currentPageId);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const entries = useMemo(
    () => [
      {
        label: introductionPage.label,
        detail: "Carapace",
        type: "Page",
        href: hrefFor(siteRoot, introductionPage.path),
        pageId: introductionPage.id,
        keywords: introductionPage.keywords,
      },
      ...referenceAreas.flatMap((area) =>
        area.pages.map((page) => ({
          label: page.label,
          detail: area.label,
          type: page.id.startsWith("primitive-") ? "Primitive" : "Page",
          href: hrefFor(siteRoot, page.path),
          pageId: page.id,
          keywords: `${area.label} ${area.description} ${page.keywords || ""}`,
        })),
      ),
      ...tokenDefinitions.map((token) => ({
        label: token.variable,
        detail: "Canonical variable",
        type: "Token",
        href: `${hrefFor(siteRoot, "foundations/tokens/")}#token-${token.variable.slice(2)}`,
        pageId: "foundation-tokens",
        keywords: token.group,
      })),
    ],
    [siteRoot],
  );
  const ranked = useMemo(
    () => rankSearchEntries(entries, query, query.trim() ? 12 : 8),
    [entries, query],
  );
  const groups = useMemo(() => groupSearchResults(ranked.matches), [ranked.matches]);

  const closeSearch = useCallback((restoreFocus = true) => {
    const dialog = dialogRef.current;
    restoreFocusRef.current = restoreFocus;
    if (dialog?.open) dialog.close();
    else setOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setActiveIndex(-1);
    setOpen(true);
    dialog.showModal();
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    if (previousPageRef.current !== currentPageId) {
      previousPageRef.current = currentPageId;
      closeSearch(false);
    }
  }, [closeSearch, currentPageId]);

  useEffect(() => {
    setActiveIndex(-1);
    resultRefs.current.length = ranked.matches.length;
  }, [query, ranked.matches.length]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.defaultPrevented || event.isComposing) return;
      const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
      const target = event.target instanceof Element ? event.target : document.activeElement;
      const typing = target?.isContentEditable || target?.matches("input, textarea, select, [contenteditable]");
      if ((shortcut || (slash && !typing)) && !dialogRef.current?.open) {
        event.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [openSearch]);

  const activateResult = (index) => {
    if (ranked.matches.length === 0) {
      setActiveIndex(-1);
      return;
    }
    const next = (index + ranked.matches.length) % ranked.matches.length;
    setActiveIndex(next);
    resultRefs.current[next]?.scrollIntoView({ block: "nearest" });
  };

  const navigate = (event, entry) => {
    if (!onNavigate || !shouldHandleNavigation(event)) return;
    event.preventDefault();
    closeSearch(false);
    onNavigate(entry.href, { pageId: entry.pageId });
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      activateResult(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activateResult(activeIndex < 0 ? ranked.matches.length - 1 : activeIndex - 1);
    } else if (event.key === "Home" && activeIndex >= 0) {
      event.preventDefault();
      activateResult(0);
    } else if (event.key === "End" && activeIndex >= 0) {
      event.preventDefault();
      activateResult(ranked.matches.length - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      resultRefs.current[activeIndex]?.click();
    }
  };

  let resultIndex = -1;
  const status = ranked.total > ranked.matches.length
    ? `${ranked.matches.length} of ${ranked.total} results shown.`
    : `${ranked.total} result${ranked.total === 1 ? "" : "s"}.`;

  const dialog = (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      data-search-dialog
      aria-label="Search Carapace reference"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeSearch();
      }}
      onClose={() => {
        setOpen(false);
        setActiveIndex(-1);
        if (restoreFocusRef.current) triggerRef.current?.focus();
      }}
    >
      <div className="search-field">
        <span className="search-field-icon"><Icon name="search" /></span>
        <input
          ref={inputRef}
          id="reference-search"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
          data-search-input
          aria-label="Search reference"
          placeholder="Search routes, tokens, and primitives…"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <kbd>Esc</kbd>
      </div>
      <p className="visually-hidden" data-search-status aria-live="polite">{status}</p>
      <div
        className="search-results"
        id="search-results"
        role="listbox"
        aria-label="Search results"
        data-search-results
      >
        {groups.map((group) => {
          const headingId = `search-result-group-${group.type.toLowerCase()}`;
          return (
            <section
              className="search-result-group"
              role="group"
              aria-labelledby={headingId}
              key={group.type}
            >
              <p className="search-result-group-label" id={headingId}>
                {group.type === "Page" ? "Pages" : `${group.type}s`}
              </p>
              {group.entries.map((entry) => {
                resultIndex += 1;
                const index = resultIndex;
                return (
                  <a
                    ref={(node) => { resultRefs.current[index] = node; }}
                    id={`search-result-${index}`}
                    href={entry.href}
                    className={`search-result${index === activeIndex ? " is-active" : ""}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    tabIndex={-1}
                    data-search-result
                    data-search-type={entry.type.toLowerCase()}
                    key={`${entry.type}-${entry.label}`}
                    onClick={(event) => navigate(event, entry)}
                    onFocus={() => activateResult(index)}
                    onPointerEnter={() => activateResult(index)}
                  >
                    <span><strong>{entry.label}</strong><small>{entry.detail}</small></span>
                  </a>
                );
              })}
            </section>
          );
        })}
      </div>
      <div className="search-empty" data-search-empty hidden={ranked.matches.length > 0}>
        <p>No matching reference.</p>
        <button
          className="shell-control"
          type="button"
          data-clear-search
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
        >
          Clear search
        </button>
      </div>
    </dialog>
  );

  return (
    <>
      <button
        ref={triggerRef}
        className="search-trigger shell-command-field shell-control"
        type="button"
        data-open-search
        aria-label="Search routes, tokens, and primitives"
        aria-haspopup="dialog"
        onClick={openSearch}
      >
        <span
          className="search-trigger-label"
          dangerouslySetInnerHTML={{
            __html: `${icon("search")}<span>Search routes, tokens, and primitives…</span>`,
          }}
        />
        <kbd>⌘ K</kbd>
      </button>
      {createPortal(dialog, document.body)}
    </>
  );
}

function SidebarLink({ currentPageId, href, label, pageId, onNavigate, onFollow, root = false }) {
  return (
    <a
      className={root ? "sidebar-root-link" : undefined}
      href={href}
      aria-current={pageId === currentPageId ? "page" : undefined}
      onClick={(event) => {
        onFollow?.();
        if (!onNavigate || !shouldHandleNavigation(event)) return;
        event.preventDefault();
        onNavigate(href, { pageId });
      }}
    >
      {label}
    </a>
  );
}

function Sidebar({ currentPageId, siteRoot, onNavigate, mobile, open, onClose, closeButtonRef }) {
  const currentArea = getReferenceArea(currentPageId);
  const [openAreas, setOpenAreas] = useState(() => readOpenAreas(currentArea?.id));
  const navigationRef = useRef(null);
  const navRef = useRef(null);
  const positionedInitialPage = useRef(false);
  const [scrollState, setScrollState] = useState({ up: false, down: false });

  useEffect(() => {
    if (!currentArea?.id) return;
    setOpenAreas((current) => {
      if (current.has(currentArea.id)) return current;
      const next = new Set(current);
      next.add(currentArea.id);
      return next;
    });
  }, [currentArea?.id]);

  const syncScrollState = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    setScrollState({
      up: nav.scrollTop > 1,
      down: nav.scrollTop + nav.clientHeight < nav.scrollHeight - 1,
    });
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    nav.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    syncScrollState();
    return () => {
      nav.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  useEffect(() => {
    window.requestAnimationFrame(syncScrollState);
  }, [openAreas, syncScrollState]);

  useEffect(() => {
    if (positionedInitialPage.current) return;
    const nav = navRef.current;
    const current = nav?.querySelector('[aria-current="page"]');
    if (!nav || !current) return;
    positionedInitialPage.current = true;
    const navRect = nav.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    if (currentRect.top < navRect.top) nav.scrollTop -= navRect.top - currentRect.top;
    if (currentRect.bottom > navRect.bottom) nav.scrollTop += currentRect.bottom - navRect.bottom;
  }, [currentPageId]);

  const toggleArea = (areaId) => {
    setOpenAreas((current) => {
      const next = new Set(current);
      if (next.has(areaId)) next.delete(areaId);
      else next.add(areaId);
      persistOpenAreas(next);
      return next;
    });
  };

  const handleKeyDown = (event) => {
    if (!mobile || !open) return;
    if (event.key === "Escape") {
      onClose(true);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...navigationRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => !element.closest("[hidden]"));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const foundations = referenceAreas.find((area) => area.id === "foundations");

  return (
    <>
      <aside
        ref={navigationRef}
        className={`sidebar${open ? " is-open" : ""}`}
        id="reference-navigation"
        data-navigation
        data-can-scroll-up={scrollState.up}
        data-can-scroll-down={scrollState.down}
        inert={mobile && !open}
        role={mobile && open ? "dialog" : undefined}
        aria-modal={mobile && open ? "true" : undefined}
        aria-label={mobile && open ? "Reference navigation" : undefined}
        onKeyDown={handleKeyDown}
      >
        <div className="sidebar-heading">
          <button
            ref={closeButtonRef}
            className="mobile-nav-close shell-control"
            type="button"
            data-close-navigation
            aria-label="Close navigation"
            onClick={() => onClose(true)}
          >
            ×
          </button>
        </div>
        <nav ref={navRef} aria-label="Carapace reference">
          <SidebarLink
            root
            currentPageId={currentPageId}
            href={hrefFor(siteRoot, introductionPage.path)}
            label={introductionPage.label}
            pageId={introductionPage.id}
            onNavigate={onNavigate}
            onFollow={() => onClose(false)}
          />
          {foundations?.pages.map((page) => (
            <SidebarLink
              root
              currentPageId={currentPageId}
              href={hrefFor(siteRoot, page.path)}
              label={page.label}
              pageId={page.id}
              onNavigate={onNavigate}
              onFollow={() => onClose(false)}
              key={page.id}
            />
          ))}
          {referenceAreas.filter((area) => area.id !== "foundations").map((area) => {
            const visiblePages = area.pages.filter((page) => !page.hiddenFromSidebar);
            const standalone = visiblePages.filter((page) => !page.group).sort(compareReferenceLabels);
            const groups = [...new Set(visiblePages.map((page) => page.group).filter(Boolean))];
            const expanded = openAreas.has(area.id);
            const panelId = `sidebar-area-${area.id}`;

            return (
              <div
                className={`sidebar-area${currentArea?.id === area.id ? " is-current" : ""}`}
                data-sidebar-area
                data-sidebar-area-id={area.id}
                key={area.id}
              >
                <button
                  className="sidebar-area-toggle shell-control"
                  type="button"
                  data-sidebar-area-toggle
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggleArea(area.id)}
                >
                  <span>{area.label}</span>
                </button>
                <div className="sidebar-pages" id={panelId} data-sidebar-area-panel hidden={!expanded}>
                  {standalone.map((page) => (
                    <SidebarLink
                      currentPageId={currentPageId}
                      href={hrefFor(siteRoot, page.path)}
                      label={page.label}
                      pageId={page.id}
                      onNavigate={onNavigate}
                      onFollow={() => onClose(false)}
                      key={page.id}
                    />
                  ))}
                  {groups.map((group) => {
                    const groupId = `sidebar-${area.id}-${group.toLowerCase().replaceAll(" ", "-")}`;
                    return (
                      <div className="sidebar-page-group" role="group" aria-labelledby={groupId} key={group}>
                        <p className="sidebar-pages-label" id={groupId}>{group}</p>
                        {visiblePages
                          .filter((page) => page.group === group)
                          .sort(compareReferenceLabels)
                          .map((page) => (
                            <SidebarLink
                              currentPageId={currentPageId}
                              href={hrefFor(siteRoot, page.path)}
                              label={page.label}
                              pageId={page.id}
                              onNavigate={onNavigate}
                              onFollow={() => onClose(false)}
                              key={page.id}
                            />
                          ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
        <a
          className="version"
          href="https://github.com/openclaw/openclaw"
          rel="noreferrer"
          aria-label="An OpenClaw project"
          translate="no"
          onClick={() => onClose(false)}
        >
          <span className="version-label">
            An <img src={brandMarkUrl} alt="" width="16" height="16" /><strong>OpenClaw</strong> project
          </span>
          <span className="version-external"><Icon name="external" /></span>
        </a>
      </aside>
      <button
        className="navigation-backdrop"
        type="button"
        data-close-navigation
        aria-label="Close navigation"
        onClick={() => onClose(true)}
      />
    </>
  );
}

export function ReactShell({
  currentPageId,
  siteRootHref,
  siteRoot = siteRootHref || "./",
  onNavigate,
  children,
}) {
  const mainRef = useRef(null);
  const openNavigationRef = useRef(null);
  const closeNavigationRef = useRef(null);
  const mobile = useMobileNavigation();
  const [navigationOpen, setNavigationOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.pageKind = pageKinds[currentPageId] || "reference";
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.append(favicon);
    }
    favicon.href = brandMarkHoverUrl;
    favicon.type = "image/png";
  }, [currentPageId]);

  useEffect(() => {
    if (!mobile) setNavigationOpen(false);
  }, [mobile]);

  useEffect(() => {
    setNavigationOpen(false);
  }, [currentPageId]);

  useEffect(() => {
    document.body.classList.toggle("navigation-open", navigationOpen);
    if (navigationOpen && mobile) {
      window.requestAnimationFrame(() => closeNavigationRef.current?.focus());
    }
    return () => document.body.classList.remove("navigation-open");
  }, [mobile, navigationOpen]);

  const closeNavigation = (restoreFocus) => {
    setNavigationOpen(false);
    if (restoreFocus && mobile) {
      window.requestAnimationFrame(() => openNavigationRef.current?.focus());
    }
  };

  const navigate = (event, href, pageId) => {
    if (!onNavigate || !shouldHandleNavigation(event)) return;
    event.preventDefault();
    onNavigate(href, { pageId });
  };

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={() => window.setTimeout(() => mainRef.current?.focus(), 0)}
      >
        Skip to content
      </a>
      <header className="topbar">
        <button
          ref={openNavigationRef}
          className="mobile-nav-trigger shell-control"
          type="button"
          data-open-navigation
          aria-label="Open navigation"
          aria-controls="reference-navigation"
          aria-expanded={navigationOpen}
          onClick={() => setNavigationOpen(true)}
        >
          <Icon name="menu" />
        </button>
        <a
          className="brand"
          href={hrefFor(siteRoot)}
          aria-label="Carapace overview"
          translate="no"
          onClick={(event) => navigate(event, hrefFor(siteRoot), introductionPage.id)}
        >
          <span className="brand-primary">
            <span className="brand-mark-stack" aria-hidden="true">
              <img
                className="brand-mark"
                src={brandMarkHoverUrl}
                alt=""
                width="26"
                height="26"
                fetchPriority="high"
              />
            </span>
            <span className="brand-wordmark">Carapace</span>
          </span>
          <span className="brand-context">Design System</span>
        </a>
        <GlobalSearch currentPageId={currentPageId} siteRoot={siteRoot} onNavigate={onNavigate} />
        <div className="topbar-actions">
          <a className="github-link" href="https://github.com/openclaw/carapace" rel="noreferrer">
            <Icon name="github" /><span>Source</span>
          </a>
          <ThemeControl />
        </div>
      </header>
      <div className="shell-feedback" role="status" aria-live="polite" data-shell-feedback />
      <div className="shell">
        <Sidebar
          currentPageId={currentPageId}
          siteRoot={siteRoot}
          onNavigate={onNavigate}
          mobile={mobile}
          open={navigationOpen}
          onClose={closeNavigation}
          closeButtonRef={closeNavigationRef}
        />
        <main ref={mainRef} className="preview-main" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </>
  );
}
