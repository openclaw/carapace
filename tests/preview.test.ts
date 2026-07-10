import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
import {
  getAdjacentReferencePages,
  introductionPage,
  referencePages,
} from "../preview/navigation.js";
import { icon } from "../preview/icons.js";
import { referenceContentIds } from "../preview/reference-content.js";
import { groupSearchResults, rankSearchEntries } from "../preview/search.js";
import { resolveOpenSidebarAreas } from "../preview/shell.js";
import { nextThemeMode, resolveThemeMode, themeModes } from "../preview/theme.js";
import { tokenDefinitions, tokenGroups } from "../preview/token-catalog.js";

describe("preview", () => {
  test("loads canonical package exports", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    for (const path of [
      "../styles/tokens.css",
      "../styles/themes.css",
      "../styles/typography.css",
      "../styles/themes/product.css",
      "../styles/base.css",
      "../styles/components.css",
    ]) {
      expect(css).toContain(`@import "${path}"`);
    }
  });

  test("publishes the reference areas as separate routes", async () => {
    const pages = await Promise.all(
      [
        ["overview", "preview/index.html"],
        ["foundations", "preview/foundations/index.html"],
        ["interface", "preview/interface/index.html"],
        ["compositions", "preview/compositions/index.html"],
        ["resources", "preview/resources/index.html"],
      ].map(async ([route, path]) => ({
        route,
        html: await readFile(path, "utf8"),
      })),
    );

    for (const { route, html } of pages) {
      expect(html).toContain(`data-preview-route="${route}"`);
      expect(html).toContain("data-shell-header");
    }

    const config = await readFile("preview/vite.config.ts", "utf8");
    const shell = await readFile("preview/shell.js", "utf8");
    expect(shell).toContain("data-theme-toggle");
    expect(shell).not.toContain("data-theme-choice");
    expect(config).toContain("collectHtmlInputs(previewRoot)");
  });

  test("cycles one theme control through light, dark, and system modes", () => {
    expect(themeModes).toEqual(["light", "dark", "system"]);
    expect(themeModes.map(nextThemeMode)).toEqual(["dark", "system", "light"]);
    expect(resolveThemeMode("light", true)).toBe("light");
    expect(resolveThemeMode("dark", false)).toBe("dark");
    expect(resolveThemeMode("system", true)).toBe("dark");
    expect(resolveThemeMode("system", false)).toBe("light");
  });

  test("uses one shared icon source for shell and catalog controls", () => {
    for (const name of ["search", "github", "sun", "moon", "system"] as const) {
      expect(icon(name)).toContain("<svg");
      expect(icon(name)).toContain('aria-hidden="true"');
      expect(icon(name)).toMatch(/<(path|circle|rect)/);
    }
  });

  test("lists every canonical token exactly once", async () => {
    const sources = await Promise.all(
      [
        "styles/tokens.css",
        "styles/themes.css",
        "styles/themes/product.css",
        "styles/typography.css",
      ].map((path) => readFile(path, "utf8")),
    );
    const canonical = new Set(
      sources.flatMap((source) =>
        [...source.matchAll(/^\s*(--oc-[\w-]+)\s*:/gm)].map(([, name]) => name),
      ),
    );
    const listed = tokenDefinitions.map(({ variable }) => variable);
    const listedSet = new Set(listed);
    const groupIds = new Set(tokenGroups.map(({ id }) => id));

    expect(listed).toHaveLength(listedSet.size);
    expect(tokenGroups.every(({ description }) => description.length > 0)).toBe(true);
    expect(tokenDefinitions.filter(({ group }) => !groupIds.has(group))).toEqual([]);
    expect([...listedSet].sort()).toEqual([...canonical].sort());
  });

  test("keeps the route manifest and reference pages aligned", async () => {
    expect(new Set(referencePages.map(({ id }) => id)).size).toBe(referencePages.length);
    expect(new Set(referencePages.map(({ path }) => path)).size).toBe(referencePages.length);

    for (const page of referencePages) {
      const html = await readFile(`preview/${page.path}index.html`, "utf8");
      expect(html).toContain(`data-preview-page="${page.id}"`);
      expect(html).toContain("data-shell-header");
      expect(html).toContain("data-shell-sidebar");
    }

    const overviewIds = new Set(["foundations", "interface", "compositions", "resources"]);
    const deepPageIds = referencePages
      .map(({ id }) => id)
      .filter((id) => !overviewIds.has(id))
      .sort();
    expect([...referenceContentIds].sort()).toEqual(deepPageIds);
  });

  test("exposes the introduction and repository-backed guidance in navigation", async () => {
    const [shell, content, packageSource] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/reference-content.js", "utf8"),
      readFile("package.json", "utf8"),
    ]);
    const packageJson = JSON.parse(packageSource) as { exports: Record<string, string> };
    const pageIds = new Set(referencePages.map(({ id }) => id));

    expect(introductionPage).toMatchObject({ id: "overview", label: "Introduction", path: "" });
    expect(shell).toContain("introductionPage");
    for (const id of [
      "foundation-base",
      "resource-package-exports",
      "resource-brand",
      "resource-governance",
      "resource-design-audit",
    ]) {
      expect(pageIds).toContain(id);
    }
    for (const specifier of Object.keys(packageJson.exports)) {
      expect(content).toContain(specifier);
    }
    for (const skill of [
      "openclaw-brand",
      "openclaw-design-system",
      "openclaw-marketing-pages",
      "openclaw-design-audit",
    ]) {
      expect(content).toContain(skill);
    }
  });

  test("keeps shell keyboard landmarks and anchor offsets explicit", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(shell).toContain('main.tabIndex = -1');
    expect(shell).toContain('navigation.setAttribute("aria-modal", "true")');
    expect(shell).toContain('role="group"');
    expect(css).toContain(".reference-page [id]");
    expect(css).toContain("scroll-margin-top:");
  });

  test("provides local page navigation when the side table of contents is hidden", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(shell).toContain('class="inline-toc"');
    expect(shell).toContain('aria-label="Page contents"');
    expect(css).toContain(".inline-toc");
  });

  test("ranks and groups search results without exceeding the global limit", () => {
    const entries = [
      { label: "Colors", detail: "Foundations", type: "Page", keywords: "palette theme" },
      { label: "Color theme", detail: "Resources", type: "Page", keywords: "light dark" },
      ...Array.from({ length: 14 }, (_, index) => ({
        label: `--oc-color-${index}`,
        detail: "Canonical variable",
        type: "Token",
        keywords: "color palette",
      })),
    ];

    const result = rankSearchEntries(entries, "palette", 12);
    expect(result.total).toBe(15);
    expect(result.matches).toHaveLength(12);
    expect(result.matches[0].label).toBe("Colors");
    expect(groupSearchResults(result.matches).map(({ type }) => type)).toEqual(["Page", "Token"]);
    expect(rankSearchEntries(entries, "missing", 12)).toEqual({ matches: [], total: 0 });

    const pages = referencePages.map((page) => ({
      label: page.label,
      detail: page.areaLabel,
      type: page.id.startsWith("primitive-") ? "Primitive" : "Page",
      keywords: page.keywords,
    }));
    expect(rankSearchEntries(pages, "dark mode", 12).matches[0]?.label).toBe("Theming");
  });

  test("removes the redundant canvas header across every route", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(shell).toContain('document.querySelector(".canvas-header")?.remove()');
    expect(shell).not.toContain('copy.textContent = "Copy text"');
    expect(css).toContain("--preview-canvas-header-height: 0px");
    expect(css).not.toContain(".canvas-actions button");
  });

  test("gives shell controls immediate feedback without leaking motion preferences", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    for (const marker of [
      "theme-control shell-control",
      "mobile-nav-trigger shell-control",
      "search-trigger shell-control",
      "mobile-nav-close shell-control",
    ]) {
      expect(shell).toContain(marker);
    }
    expect(css).toContain("touch-action: manipulation");
    expect(css).not.toContain(".brand:active,");

    const mobileStart = css.indexOf("@media (max-width: 900px)");
    const compactStart = css.indexOf("@media (max-width: 680px)");
    const mobileStyles = css.slice(mobileStart, compactStart);
    expect(mobileStart).toBeGreaterThan(-1);
    expect(mobileStyles).toContain("opacity: 0;");
    expect(mobileStyles).toContain("visibility: hidden;");
    expect(mobileStyles).toContain("pointer-events: none;");
    expect(mobileStyles).toContain("body.navigation-open .navigation-backdrop");

    const motionStart = css.indexOf("@media (prefers-reduced-motion: no-preference)");
    const reducedStart = css.indexOf("@media (prefers-reduced-motion: reduce)");
    const motionStyles = css.slice(motionStart, reducedStart);
    expect(motionStart).toBeGreaterThan(-1);
    expect(motionStyles).toContain(".shell-control:active");
    expect(motionStyles).toContain("transform: scale(0.97)");
    expect(css.slice(0, motionStart)).not.toContain("transform: scale(0.97)");
  });

  test("keeps mobile shell targets and compound focus explicit", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(shell).toContain('translate="no"');
    expect(shell).toContain('fetchpriority="high"');
    expect(shell).toContain("⌘K");
    expect(shell).toContain('icon("search")');
    expect(shell).toContain('icon("github")');
    expect(css).toContain(".search-field:focus-within");
    expect(css).toContain("overscroll-behavior: contain");

    const mobileStart = css.indexOf("@media (max-width: 900px)");
    const compactStart = css.indexOf("@media (max-width: 680px)");
    const mobileStyles = css.slice(mobileStart, compactStart);
    for (const marker of [
      ".mobile-nav-trigger,",
      ".brand {",
      ".search-trigger {",
      ".theme-control {",
      ".inline-toc nav a",
    ]) {
      expect(mobileStyles).toContain(marker);
    }
    expect(mobileStyles.match(/min-height: 44px/g)?.length).toBeGreaterThanOrEqual(6);
  });

  test("adapts shell materials and browser chrome to system display preferences", async () => {
    const [css, preview] = await Promise.all([
      readFile("preview/preview.css", "utf8"),
      readFile("preview/preview.js", "utf8"),
    ]);

    expect(css).toContain("@media (prefers-reduced-transparency: reduce)");
    expect(css).toContain("@media (prefers-contrast: more)");
    expect(css).toContain("backdrop-filter: none");
    expect(css).toContain("font-variant-numeric: tabular-nums");
    expect(preview).toContain('meta[name="theme-color"]');
    expect(preview).toContain('getPropertyValue("--oc-bg-page")');
  });

  test("uses real sidebar disclosures without navigating area headings", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(shell).toContain("data-sidebar-area-toggle");
    expect(shell).toContain("data-sidebar-area-panel");
    expect(shell).toContain("openclaw.preview.sidebar.openAreas");
    expect(shell).toContain("data-sidebar-area-id");
    expect(shell).toContain("readOpenSidebarAreas(currentArea?.id)");
    expect(shell).toContain('toggle.setAttribute("aria-expanded", String(expanded))');
    expect(shell).toContain("panel.hidden = !expanded");
    expect(shell).toContain("setExpanded(toggle, expand)");
    expect(shell).toContain("writeOpenSidebarAreas(openAreas)");
    expect(shell).not.toContain("toggles.forEach((candidate) => setExpanded(candidate");
    expect(shell).not.toContain('<a class="sidebar-area-link"');
    expect(shell).not.toContain('<p class="eyebrow">Reference</p>');
    expect(css).toContain(".sidebar-area-toggle");
    expect(css).toContain('.sidebar-area-toggle[aria-expanded="true"]::after');
    expect(css).toContain(".sidebar-pages[hidden]");
    expect(css).not.toContain(".sidebar-area.is-current > .sidebar-area-toggle::before");
    expect(css).not.toContain(".version span::before");
  });

  test("keeps navigation choices distinct and opens foundations by default", async () => {
    const [home, shell] = await Promise.all([
      readFile("preview/index.html", "utf8"),
      readFile("preview/shell.js", "utf8"),
    ]);
    const homeDestinations = [...home.matchAll(/href="([^"]+)"/g)].map(([, href]) => href);

    expect(homeDestinations.filter((href) => href === "./foundations/")).toHaveLength(1);
    expect(
      homeDestinations.filter((href) => href === "./resources/getting-started/"),
    ).toHaveLength(1);
    expect(shell).toContain('<div class="version"');
    expect(shell).not.toContain('<a class="version"');
    expect(referencePages.some(({ id, group }) => id.startsWith("primitive-") && group)).toBe(
      false,
    );

    expect([...resolveOpenSidebarAreas(null)]).toEqual(["foundations"]);
    expect([...resolveOpenSidebarAreas("[]")]).toEqual([]);
    expect([...resolveOpenSidebarAreas('["interface"]', "foundations")]).toEqual([
      "interface",
      "foundations",
    ]);

    expect(getAdjacentReferencePages("foundations")).toEqual({
      previous: undefined,
      next: undefined,
    });
    expect(getAdjacentReferencePages("foundation-tokens").next?.id).toBe("foundation-colors");
    expect(getAdjacentReferencePages("primitive-card")).toMatchObject({
      previous: { id: "primitive-section" },
      next: { id: "primitive-action" },
    });
    expect(getAdjacentReferencePages("resource-theming")).toEqual({
      previous: undefined,
      next: undefined,
    });
  });

  test("keeps shell geometry and the light canvas centralized", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css).toContain("--preview-content: 1040px");
    expect(css).toContain("--preview-rail-width: 280px");
    expect(css).toContain("--preview-topbar-height: 64px");
    expect(css).toContain("--preview-toc-width: 220px");
    expect(css).toContain("--preview-shell-bg: var(--oc-palette-paper-50)");
    expect(css).toContain(".page-layout-no-toc");
    expect(css).toContain("justify-content: center");
    expect(css).toContain("minmax(0, 860px) var(--preview-toc-width)");
    expect(css).toContain("left: calc(var(--preview-rail-width) - 1px)");
    expect(css).toContain("--preview-nav-surface: var(--oc-palette-paper-50)");
  });

  test("keeps shell typography legible and the token index structured", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css).toContain(".home-start-list strong");
    expect(css).toContain("font-size: 19px");
    expect(css).toContain(".search-trigger {");
    expect(css).toContain("font-size: 13px");
    expect(css).toContain("grid-template-columns: 176px minmax(0, 1fr)");
    expect(css).toContain(".theme-control-icon");
  });

  test("keeps reference page heroes compact", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css).toContain("padding: 34px 0 26px");
    expect(css).toContain("font-size: clamp(34px, 3.5vw, 48px)");
    expect(css).toContain("margin: 8px 0 14px");
    expect(css).toContain("font-size: 16px");
  });

  test("assigns shell page archetypes without changing canonical content", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(shell).toContain('overview: "home"');
    expect(shell).toContain('"foundation-tokens": "catalog"');
    expect(shell).toContain('"primitive-app-surface": "reference"');
    expect(shell).toContain('"composition-product": "composition"');
    expect(shell).toContain('document.body.dataset.pageKind =');
    expect(css).toContain('body[data-page-kind="catalog"]');
  });

  test("publishes a complete design system homepage", async () => {
    const [home, css] = await Promise.all([
      readFile("preview/index.html", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(home).toContain('class="home-hero"');
    expect(home).not.toContain('class="home-metrics"');
    expect(home).toContain('aria-labelledby="home-reference-title"');
    expect(home).toContain('aria-labelledby="home-start-title"');
    expect(home).toContain('href="./foundations/tokens/"');
    expect(home).toContain('href="./interface/primitives/"');
    expect(home).toContain('href="./resources/getting-started/"');
    expect(css).toContain(".home-hero");
    expect(css).toContain("font-size: clamp(42px, 4.2vw, 58px)");
    expect(css).toContain(".home-reference-grid");
  });

  test("uses a compact directory layout for index pages", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css).toContain('body[data-page-kind="index"] .intro-compact');
    expect(css).toContain('body[data-page-kind="index"] .reference-card');
    expect(css).toContain("min-height: 136px");
    expect(css).toContain('body[data-page-kind="index"] .route-card');
    expect(css).toContain("min-height: 88px");
  });

  test("keeps long token catalogs indexed and URL-addressable", async () => {
    const [content, preview, shell, css] = await Promise.all([
      readFile("preview/reference-content.js", "utf8"),
      readFile("preview/preview.js", "utf8"),
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(content).toContain('class="token-reference-layout"');
    expect(content).toContain('class="token-index"');
    expect(content).toContain("<span data-token-count></span> tokens");
    expect(content).not.toContain("data-token-filter");
    expect(preview).toContain('["Token", "Value"]');
    expect(preview).toContain('row.id = `token-${token.variable.slice(2)}`');
    expect(shell).toContain("#token-${token.variable.slice(2)}");
    expect(preview).toContain('link.setAttribute("aria-current", "location")');
    expect(preview).toContain("observeTokenGroups()");
    expect(css).toContain("position: sticky");
    expect(css).not.toContain("content-visibility: auto");
    expect(css).toContain('.token-index a[aria-current="location"]');
  });

  test("uses a responsive documentation layout around canonical primitive specimens", async () => {
    const [content, css] = await Promise.all([
      readFile("preview/reference-content.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(content).toContain('data-section-kind="preview"');
    expect(content).toContain('data-section-kind="markup"');
    expect(content).toContain('data-section-kind="guidance"');
    expect(css).toContain('body[data-page-kind="reference"] .reference-page');
    expect(css).toContain('[data-section-kind="preview"]');
    expect(css).toContain("grid-column: 1 / -1");
  });

  test("adapts guide and composition framing without changing specimens", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css).toContain('body[data-page-kind="guide"] .reference-page > section');
    expect(css).toContain('body[data-preview-page="resource-adapters"] .reference-page');
    expect(css).toContain('body[data-preview-page="resource-skills"] .principle-grid');
    expect(css).toContain('body[data-page-kind="composition"] .reference-page > section');
    expect(css).toContain('body[data-preview-page="composition-content"] .prose-sample');
    expect(css).toContain('body[data-page-kind="release"] .release-panel');
  });

  test("keeps the expanded shell within the mobile viewport", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const mobileStyles = css.slice(css.indexOf("@media (max-width: 680px)"));

    expect(mobileStyles).toContain("width: 44px");
    expect(mobileStyles).toContain(".home-hero");
    expect(mobileStyles).toContain(".home-reference-grid");
    expect(mobileStyles).toContain(".home-start-list a");
    expect(mobileStyles).toContain('body[data-page-kind="index"] .reference-card');
    expect(mobileStyles).toContain(".code-block-header button");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(mobileStyles).toContain("min-height: 44px");
  });
});
