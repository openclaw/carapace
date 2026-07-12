import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
import { transform } from "lightningcss";
import { icon } from "../preview/icons.js";
import {
  getAdjacentReferencePages,
  getReferenceMaturity,
  getReferencePage,
  introductionPage,
  referencePages,
} from "../preview/navigation.js";
import { getReferenceContent, referenceContentIds } from "../preview/reference-content.js";
import { groupSearchResults, rankSearchEntries } from "../preview/search.js";
import { resolveOpenSidebarAreas } from "../preview/shell.js";
import { nextThemeMode, resolveThemeMode, themeModes } from "../preview/theme.js";
import { tokenDefinitions, tokenGroups } from "../preview/token-catalog.js";

const canonicalPreviewImports = [
  "../styles/tokens.css",
  "../styles/themes.css",
  "../styles/typography.css",
  "../styles/themes/product.css",
  "../styles/base.css",
  "../styles/components.css",
];

describe("preview contracts", () => {
  test("loads canonical styles through valid CSS", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const imports = [...css.matchAll(/@import\s+"([^"]+)"/g)].map(([, path]) => path);

    expect(imports.slice(0, canonicalPreviewImports.length)).toEqual(canonicalPreviewImports);
    expect(() =>
      transform({
        filename: "preview/preview.css",
        code: Buffer.from(css),
      }),
    ).not.toThrow();
  });

  test("keeps the route manifest, files, and rendered content aligned", async () => {
    expect(new Set(referencePages.map(({ id }) => id)).size).toBe(referencePages.length);
    expect(new Set(referencePages.map(({ path }) => path)).size).toBe(referencePages.length);

    for (const page of referencePages) {
      const html = await readFile(`preview/${page.path}index.html`, "utf8");
      expect(html).toContain(`data-preview-page="${page.id}"`);
      expect(html).toContain("data-shell-header");
      expect(html).toContain("data-shell-sidebar");
    }

    const areaOverviewIds = new Set(["foundations", "interface", "compositions", "resources"]);
    const contentPageIds = referencePages
      .map(({ id }) => id)
      .filter((id) => !areaOverviewIds.has(id))
      .sort();
    expect([...referenceContentIds].sort()).toEqual(contentPageIds);

    for (const id of referenceContentIds) {
      const content = getReferenceContent(id);
      expect(content).toContain('class="reference-intro"');
      expect(content).toContain("<h1>");
    }
  });

  test("publishes the introduction as a live primitive grid", async () => {
    const home = await readFile("preview/index.html", "utf8");
    const previewStyles = await readFile("preview/preview.css", "utf8");
    const previewScript = await readFile("preview/preview.js", "utf8");
    const destinations = [...home.matchAll(/href="([^"]+)"/g)].map(([, href]) => href);
    const componentLabels = [
      ...home.matchAll(/class="home-component-link"[^>]*>([^<]+)<\/a>/g),
    ].map(([, label]) => label);
    const componentPaths = [
      ...home.matchAll(/class="home-component-link" href="\.\/([^"]+)"/g),
    ].map(([, path]) => path);

    expect(introductionPage).toEqual({
      id: "overview",
      label: "Home",
      path: "",
      keywords: "home overview carapace visual contract",
    });
    expect(home).toContain('data-preview-route="overview"');
    expect(home).toContain('class="home-component-grid"');
    expect(home).toContain('class="home-component-cell home-brand-cell"');
    expect(home).toContain('<h1 id="preview-title">Carapace</h1>');
    expect(home).toContain("A carapace is a protective outer shell.");
    expect(home).not.toContain('class="home-hero"');
    expect(home.match(/home-component-cell/g)).toHaveLength(33);
    expect(home.match(/class="home-component-cell"/g)).toHaveLength(32);
    expect(new Set(componentLabels).size).toBe(32);
    expect(new Set(componentPaths).size).toBe(32);
    expect(componentPaths.every((path) => referencePages.some((page) => page.path === path))).toBe(
      true,
    );
    expect(home.match(/oc-app-surface/g)).toHaveLength(1);
    expect(previewStyles).toContain(
      "--home-grid-row-height: calc((100dvh - var(--preview-topbar-height) - 1px) / 2)",
    );
    expect(previewStyles).toContain("grid-auto-rows: var(--home-grid-row-height)");
    expect(previewStyles).toContain(".home-chart .oc-chart-plot");
    expect(previewStyles).toContain(".home-table .oc-table");
    expect(previewStyles).toContain(".home-agent-input-bar");
    expect(previewStyles).toContain(".home-agent-question");
    expect(previewStyles).toContain(".home-agent-tool-group");
    expect(previewStyles).toContain(".home-page-header");
    expect(previewScript).toContain('.home-component-grid .oc-segmented');
    expect(componentLabels.slice(0, 8)).toEqual([
      "Action",
      "Input Bar",
      "Select",
      "Toolbar",
      "Input",
      "Question Tool",
      "Tool Group",
      "Table",
    ]);

    for (const path of [
      "./interface/primitives/action/",
      "./agent-components/input-bar/",
      "./interface/primitives/select/",
      "./interface/primitives/toolbar/",
      "./interface/primitives/input/",
      "./agent-components/question-tool/",
      "./agent-components/tool-group/",
      "./interface/primitives/table/",
    ]) {
      expect(destinations).toContain(path);
    }
  });

  test("publishes the Carapace repository and domain contract", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      homepage: string;
      name: string;
      repository: { url: string };
    };
    const cname = await readFile("preview/public/CNAME", "utf8");
    const shell = await readFile("preview/shell.js", "utf8");

    expect(packageJson).toMatchObject({
      name: "@openclaw/carapace",
      repository: { url: "https://github.com/openclaw/carapace.git" },
      homepage: "https://carapace.design/",
    });
    expect(cname.trim()).toBe("carapace.design");
    expect(shell).toContain("https://github.com/openclaw/carapace");
    expect(shell).not.toContain(["Design", "System"].join(" "));
  });

  test("classifies every component reference by runtime maturity", () => {
    const componentPages = referencePages.filter((page) =>
      ["interface", "agent-components", "charts", "blocks"].includes(page.areaId),
    );
    const stable = componentPages
      .filter((page) => getReferenceMaturity(page.id) === "Stable")
      .map((page) => page.id)
      .sort();
    const candidate = componentPages
      .filter((page) => getReferenceMaturity(page.id) === "Candidate")
      .map((page) => page.id)
      .sort();

    expect(componentPages.every((page) => getReferenceMaturity(page.id))).toBe(true);
    expect(stable).toEqual(
      [
        "primitive-action",
        "primitive-app-surface",
        "primitive-card",
        "primitive-hero",
        "primitive-pill",
        "primitive-section",
        "primitive-segmented",
      ].sort(),
    );
    expect(candidate).toEqual(
      [
        "block-resource-list",
        "primitive-badge",
        "primitive-banner",
        "primitive-checkbox",
        "primitive-empty",
        "primitive-input",
        "primitive-input-area",
        "primitive-label",
        "primitive-loader",
        "primitive-radio",
        "primitive-select",
        "primitive-skeleton-line",
        "primitive-switch",
        "primitive-table",
      ].sort(),
    );
  });

  test("documents every public package export", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      exports: Record<string, string>;
    };
    const content = getReferenceContent("resource-package-exports");

    for (const specifier of Object.keys(packageJson.exports)) {
      expect(content).toContain(specifier);
    }
  });

  test("cycles light, dark, and system themes", () => {
    expect(themeModes).toEqual(["light", "dark", "system"]);
    expect(themeModes.map(nextThemeMode)).toEqual(["dark", "system", "light"]);
    expect(resolveThemeMode("light", true)).toBe("light");
    expect(resolveThemeMode("dark", false)).toBe("dark");
    expect(resolveThemeMode("system", true)).toBe("dark");
    expect(resolveThemeMode("system", false)).toBe("light");
  });

  test("renders accessible shell icons", () => {
    for (const name of ["menu", "search", "github", "sun", "moon", "system"] as const) {
      const markup = icon(name);
      expect(markup).toContain("<svg");
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).toMatch(/<(path|circle|rect)/);
    }
  });

  test("renders the header search as a complete command field", async () => {
    const shell = await readFile("preview/shell.js", "utf8");
    const previewStyles = await readFile("preview/preview.css", "utf8");

    expect(shell).toContain("shell-command-field");
    expect(shell).toContain("Search routes, tokens, and primitives…");
    expect(shell).toContain("<kbd>⌘ K</kbd>");
    expect(previewStyles).toContain("width: min(100%, 480px)");
    expect(previewStyles).toContain("justify-self: center");
    expect(previewStyles).toContain(".search-field:focus-within");
    expect(previewStyles).toContain(".topbar-actions {\n  grid-column: 3;\n  display: flex;\n  gap: 8px;");
    expect(shell).toContain('${icon("menu")}');
    expect(previewStyles).toContain(".mobile-nav-trigger svg");
    expect(previewStyles).toContain("transform: translateX(-50%)");
    expect(previewStyles).toContain(".search-trigger:is(:hover, :active)");
  });

  test("renders foundation pages at the sidebar root", async () => {
    const shell = await readFile("preview/shell.js", "utf8");

    expect(shell).toContain('.filter((area) => area.id !== "foundations")');
    expect(shell.match(/class="sidebar-root-link"/g)).toHaveLength(2);
    expect(await readFile("preview/preview.css", "utf8")).toContain(
      ".sidebar-root-link + .sidebar-area",
    );
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

  test("ranks and groups search results within the global limit", () => {
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

  test("preserves independent sidebar disclosures and local page sequence", () => {
    expect([...resolveOpenSidebarAreas(null)]).toEqual([]);
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
      previous: { id: "primitive-button" },
      next: { id: "primitive-checkbox" },
    });
    expect(getAdjacentReferencePages("primitive-avatar")).toMatchObject({
      previous: { id: "primitive-autocomplete" },
      next: { id: "primitive-badge" },
    });
    expect(getAdjacentReferencePages("resource-theming")).toEqual({
      previous: undefined,
      next: undefined,
    });
  });

  test("documents an accessible avatar primitive and its public variants", () => {
    expect(getReferencePage("primitive-avatar")).toMatchObject({
      label: "Avatar",
      path: "interface/primitives/avatar/",
      areaId: "interface",
    });

    const avatar = getReferenceContent("primitive-avatar");
    expect(avatar).toContain("oc-avatar-sm");
    expect(avatar).toContain("oc-avatar-lg");
    expect(avatar).toContain('class="oc-avatar-image"');
    expect(avatar).toContain('role="img"');
    expect(avatar).toContain('aria-label="OpenClaw"');
    expect(avatar).toContain('class="oc-avatar-status" aria-hidden="true"');
    expect(avatar).toContain("Online");
    expect(avatar).toContain("Never rely on the status indicator alone");
  });
});
