import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
import { referencePages } from "../preview/navigation.js";
import { referenceContentIds } from "../preview/reference-content.js";
import { groupSearchResults, rankSearchEntries } from "../preview/search.js";
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
    expect(shell).toContain("data-theme-choice");
    expect(config).toContain("collectHtmlInputs(previewRoot)");
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

  test("keeps page copy output clean and the mobile sticky budget explicit", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(shell).toContain('copy.textContent = "Copy text"');
    expect(shell).toContain('copy.setAttribute("aria-label", "Copy page text")');
    expect(shell).toContain(
      'clone.querySelectorAll(".page-navigation, .inline-toc, [data-copy-code]")',
    );
    expect(shell).toContain("document.body.append(clone)");
    expect(shell).toContain("return clone.innerText.trim()");
    expect(shell).toContain('showShellFeedback("Page text copied.")');
    expect(css).toContain("--preview-canvas-header-height: 48px");
    expect(css).toContain("min-height: var(--preview-canvas-header-height)");
  });

  test("gives shell controls immediate feedback without leaking motion preferences", async () => {
    const [shell, css] = await Promise.all([
      readFile("preview/shell.js", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    for (const marker of [
      "oc-segmented-item shell-control",
      "mobile-nav-trigger shell-control",
      "search-trigger shell-control",
      "mobile-nav-close shell-control",
      'copy.className = "shell-control"',
    ]) {
      expect(shell).toContain(marker);
    }
    expect(css).toContain("touch-action: manipulation");

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
    expect(shell).toContain("⌘&nbsp;K");
    expect(css).toContain(".search-field:focus-within");
    expect(css).toContain("overscroll-behavior: contain");

    const mobileStart = css.indexOf("@media (max-width: 900px)");
    const compactStart = css.indexOf("@media (max-width: 680px)");
    const mobileStyles = css.slice(mobileStart, compactStart);
    for (const marker of [
      ".mobile-nav-trigger,",
      ".brand {",
      ".search-trigger {",
      ".theme-control .oc-segmented-item",
      ".canvas-actions button",
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
    expect(shell).toContain('toggle.setAttribute("aria-expanded", String(expanded))');
    expect(shell).toContain("panel.hidden = !expanded");
    expect(shell).not.toContain('<a class="sidebar-area-link"');
    expect(shell).not.toContain('<p class="eyebrow">Reference</p>');
    expect(css).toContain(".sidebar-area-toggle");
    expect(css).toContain('.sidebar-area-toggle[aria-expanded="true"]::after');
    expect(css).toContain(".sidebar-pages[hidden]");
  });

  test("keeps reference page heroes compact", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css).toContain("padding: 34px 0 26px");
    expect(css).toContain("font-size: clamp(40px, 5vw, 60px)");
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
    expect(css).toContain(".version span::before");
    expect(css).toContain("background: var(--oc-border-accent)");
  });

  test("publishes a complete design system homepage", async () => {
    const [home, css] = await Promise.all([
      readFile("preview/index.html", "utf8"),
      readFile("preview/preview.css", "utf8"),
    ]);

    expect(home).toContain('class="home-hero"');
    expect(home).toContain('class="home-metrics"');
    expect(home).toContain('aria-labelledby="home-reference-title"');
    expect(home).toContain('aria-labelledby="home-start-title"');
    expect(home).toContain('href="./foundations/tokens/"');
    expect(home).toContain('href="./interface/primitives/"');
    expect(home).toContain('href="./resources/getting-started/"');
    expect(css).toContain(".home-hero");
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
});
