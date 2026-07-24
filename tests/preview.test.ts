import { describe, expect, test } from "bun:test";
import {
  readFile,
} from "node:fs/promises";
import {
  transform,
} from "lightningcss";
import {
  WORKBENCH_ALL_VALUE,
  getWorkbenchComparison,
  getWorkbenchDefinition,
  normalizeWorkbenchState,
} from "../preview/component-workbench-config.js";
import {
  avatarWorkbenchExamples,
  buttonWorkbenchExamples,
  createFallbackComponentWorkbenchReference,
  formatComponentWorkbenchCode,
  formatWorkbenchMarkup,
  getComponentWorkbenchReference,
} from "../preview/component-reference.js";
import {
  icon,
} from "../preview/icons.js";
import {
  getAdjacentReferencePages,
  getReferenceMaturity,
  getReferencePage,
  homePage,
  referenceAreas,
  referencePages,
} from "../preview/navigation.js";
import {
  getReferenceContent,
  referenceContentIds,
} from "../preview/reference-content.js";
import {
  groupSearchResults,
  rankSearchEntries,
} from "../preview/search.js";
import {
  resolveOpenSidebarAreas,
} from "../preview/shell.js";
import {
  nextThemeMode,
  resolveThemeMode,
  themeModes,
} from "../preview/theme.js";
import {
  tokenDefinitions,
  tokenGroups,
} from "../preview/token-catalog.js";

const canonicalPreviewImports = [
  "../styles/tokens.css",
  "../styles/themes.css",
  "../styles/typography.css",
  "../styles/themes/product.css",
  "../styles/base.css",
  "../styles/components.css",
];
const legacyDisplayName = ["OpenClaw", "Design System"].join(" ");
const legacyPackageName = ["@openclaw", "design-system"].join("/");

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
  test("keeps the route manifest and rendered content aligned", async () => {
    expect(new Set(referencePages.map(({ id }) => id)).size).toBe(referencePages.length);
    expect(new Set(referencePages.map(({ path }) => path)).size).toBe(referencePages.length);

    const areaOverviewIds = new Set([
      "foundations",
      "interface",
      "compositions",
      "resources",
    ]);
    for (const area of referenceAreas.filter(({ id }) => areaOverviewIds.has(id))) {
      const routeFile = area.id === "foundations" ? "introduction" : area.id;
      const fragment = await readFile(`preview/static-routes/${routeFile}.html`, "utf8");
      expect(fragment).toContain('class="preview-stage"');
      expect(fragment).not.toContain("<html");
      expect(fragment).not.toContain(legacyDisplayName);
    }

    const introduction = await readFile("preview/static-routes/introduction.html", "utf8");
    expect(introduction).toContain('class="intro introduction-page"');
    expect(introduction).toContain('class="introduction-toc"');
    expect(introduction).toContain('class="introduction-reader"');
    expect(introduction).toContain('data-generated-toc');
    expect(introduction).toContain('data-toc-links');
    expect(introduction).toContain('class="introduction-toc-related"');
    expect(introduction).toContain('id="application-parity"');
    expect(introduction).toContain('id="preview-workflow"');
    expect(introduction).toContain('id="accessibility"');
    expect(introduction).toContain('id="contributing"');
    expect(introduction).toContain("Related resources");
    expect(introduction).toContain('class="foundations-card-grid"');
    expect(introduction).toContain('class="reference-card foundations-card-featured"');
    expect(introduction).toContain('class="foundations-card-cluster"');
    expect(introduction).toContain('href="../foundations/tokens/"');
    expect(introduction).toContain('href="../foundations/typography/"');
    expect(introduction).toContain('href="../foundations/base/"');
    expect(introduction.match(/class="reference-card[^"]*"/g)).toHaveLength(7);
    expect(introduction.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length).toBeGreaterThanOrEqual(
      1200,
    );

    const contentPageIds = referencePages
      .map(({ id }) => id)
      .filter((id) => id !== "introduction" && !areaOverviewIds.has(id))
      .sort();
    expect([...referenceContentIds].sort()).toEqual(contentPageIds);

    for (const id of referenceContentIds) {
      const content = getReferenceContent(id);
      expect(content).toContain('class="reference-intro"');
      expect(content).toContain("<h1>");
    }
  });
  test("organizes Typography around roles, scale, and licensed assets", async () => {
    const content = getReferenceContent("foundation-typography");
    const css = await readFile("preview/preview.css", "utf8");

    expect(content).toContain('id="type-roles"');
    expect(content).toContain('class="type-role-grid"');
    expect(content).toContain("--oc-font-display");
    expect(content).toContain("--oc-font-body");
    expect(content).toContain("--oc-font-serif");
    expect(content).toContain("--oc-font-mono");
    expect(content).toContain('id="type-scale"');
    expect(content).toContain('class="type-scale-list"');
    expect(content).toContain("--oc-font-size-3xl");
    expect(content).toContain("--oc-font-size-xs");
    expect(content).toContain("Licensed fonts stay with the consumer");
    expect(content).toContain(
      "Use Switzer and Sentient only where the consumer holds the appropriate license.",
    );
    expect(content).toContain("fallback stacks, not font binaries");
    expect(content).not.toContain('class="type-specimens"');
    expect(css).toContain(".type-role-grid");
    expect(css).toContain(".type-scale-row");
    const typeRoleCard = css.match(/\.type-role-card\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(typeRoleCard).toContain("border-radius: var(--oc-radius-surface)");
    const typeScaleList = css.match(/\.type-scale-list\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(typeScaleList).toContain("border-radius: var(--oc-radius-surface)");
  });
  test("applies surface radius to Foundations reference cards", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const shapeIntro = getReferenceContent("foundation-shape-depth");
    const referenceCard = css.match(/(?:^|\n)\.reference-card\s*\{([^}]*)\}/)?.[1] ?? "";
    const colorStatusCard = css.match(/(?:^|\n)\.color-status-card\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(referenceCard).toContain("border-radius: var(--oc-radius-surface)");
    expect(colorStatusCard).toContain("border-radius: var(--oc-radius-surface)");
    expect(shapeIntro).toContain("Semantic geometry uses surface, control, and inset roles");
    expect(shapeIntro).not.toContain("keeps product UI square");
  });
  test("publishes Home as a live primitive grid", async () => {
    const home = await readFile("preview/index.html", "utf8");
    const previewStyles = await readFile("preview/preview.css", "utf8");
    const pageLifecycle = await readFile("preview/page-lifecycle.js", "utf8");
    const destinations = [...home.matchAll(/href="([^"]+)"/g)].map(([, href]) => href);
    const componentLabels = [
      ...home.matchAll(/class="home-component-link"[^>]*>([^<]+)<\/a>/g),
    ].map(([, label]) => label);
    const componentPaths = [
      ...home.matchAll(/class="home-component-link" href="\.\/([^"]+)"/g),
    ].map(([, path]) => path);

    expect(homePage).toEqual({
      id: "overview",
      label: "Home",
      path: "",
      keywords: "home overview carapace visual contract",
    });
    expect(home).toContain('data-preview-route="overview"');
    expect(home).toContain('class="home-component-grid"');
    expect(home).toContain('class="home-component-cell home-brand-cell"');
    expect(home).toMatch(/<div class="home-brand-intro">\s*<p class="eyebrow">/);
    expect(home).not.toContain('class="home-brand-package"');
    expect(home).toContain('<h1 id="preview-title">Carapace</h1>');
    expect(home).toContain("Shared tokens, components, agent patterns, and application anatomy");
    expect(home).toContain("Carapace is the durable visual contract between products");
    expect(home).not.toContain('class="home-hero"');
    expect(home).toContain('class="oc-clipboard-action oc-clipboard-action-icon"');
    expect(home).toContain('data-lucide="copy"');
    expect(home).toContain('class="oc-sensitive-mask"');
    expect(home.match(/home-component-cell/g)).toHaveLength(45);
    expect(home.match(/class="home-component-cell"/g)).toHaveLength(44);
    expect(new Set(componentLabels).size).toBe(44);
    expect(new Set(componentPaths).size).toBe(44);
    expect(componentLabels).toContain("Suggestions");
    expect(componentLabels).toContain("Interactive Tool");
    expect(componentLabels).toContain("Multi-agent Activity");
    expect(componentLabels).toContain("Thinking Tool");
    expect(componentLabels).toContain("Dialog");
    expect(componentLabels).toContain("Clipboard Text");
    expect(componentLabels).toContain("Model Picker");
    expect(componentLabels).toContain("Provider Logo");
    expect(componentLabels).toContain("Question Tool");
    expect(componentLabels).toContain("Agent Chat");
    expect(componentLabels).toContain("Application Surface");
    expect(componentLabels).not.toContain("Plan Tool");
    expect(home).toContain('href="./agent-components/suggestions/"');
    expect(home).toContain('href="./agent-components/interactive-tool/"');
    expect(home).toContain('href="./agent-components/agent-collaboration/"');
    expect(home).toContain('href="./agent-components/thinking-tool/"');
    expect(home).toContain('href="./interface/primitives/dialog/"');
    expect(home).toContain('href="./interface/primitives/clipboard-text/"');
    expect(home).toContain('href="./agent-components/model-picker/"');
    expect(home).toContain('href="./interface/primitives/provider-logo/"');
    expect(home).toContain('aria-label="Anthropic"');
    expect(home).toContain('aria-label="Mistral"');
    expect(home).toContain('data-provider="openai"');
    expect(home).toContain('data-provider="gemini"');
    expect(home).toContain('data-avatar-seed="Mina"');
    expect(home).toContain('data-avatar-seed="Quinn"');
    expect(home).not.toContain('aria-label="OpenAI"><span class="oc-provider-logo-mark" aria-hidden="true">OA');
    expect(home).toContain('href="./agent-components/question-tool/"');
    expect(home).toContain('href="./agent-components/agent-chat/"');
    expect(home).toContain('href="./applications/sessions/"');
    expect(componentPaths.every((path) => referencePages.some((page) => page.path === path))).toBe(
      true,
    );
    expect(home.match(/oc-app-surface/g)).toHaveLength(1);
    expect(previewStyles).toContain("--home-grid-row-height: clamp(12rem, 24vw, 17rem)");
    expect(previewStyles).toContain(
      "grid-auto-rows: minmax(var(--home-grid-row-height), auto)",
    );
    expect(previewStyles).toContain("content-visibility: auto");
    expect(previewStyles).toContain(
      "contain-intrinsic-size: auto var(--home-grid-row-height)",
    );
    // The brand cell is always above the fold and must not let the
    // render-skipping placeholder cap its row height and clip the intro copy.
    expect(previewStyles).toMatch(
      /\.home-brand-cell \{[\s\S]*?content-visibility: visible[\s\S]*?contain-intrinsic-size: none/,
    );
    expect(previewStyles).not.toContain(".home-component-cell:has(");
    expect(previewStyles).not.toContain(".home-component-cell:hover");
    expect(previewStyles).toContain(".home-agent-input-bar");
    expect(previewStyles).toContain(".home-agent-tool-group");
    expect(previewStyles).toContain("margin: auto 0 8px");
    const labStyles = await readFile("preview/lab.css", "utf8");
    expect(labStyles).toContain(".oc-clipboard-action-icon");
    expect(home).not.toContain('class="oc-pagination-link" href="#"');
    expect(home).toContain(
      'class="oc-autocomplete home-input-demo" data-combobox data-combobox-free-entry="true"><label class="oc-field-label"',
    );
    expect(home).toContain('id="home-autocomplete-options" role="listbox" hidden');
    expect(pageLifecycle).toContain(".home-component-grid .oc-segmented");
    expect(pageLifecycle).toContain("hydrateAvatarFixtures(root)");
    expect(componentLabels.slice(0, 8)).toEqual([
      "Button",
      "Composer",
      "Select",
      "Tool Group",
      "Input",
      "Combobox",
      "Tabs",
      "Switch",
    ]);

    for (const path of [
      "./interface/primitives/button/",
      "./agent-components/input-bar/",
      "./interface/primitives/select/",
      "./agent-components/tool-group/",
      "./interface/primitives/input/",
      "./interface/primitives/combobox/",
      "./interface/primitives/tabs/",
      "./interface/primitives/switch/",
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
    const home = await readFile("preview/index.html", "utf8");
    const referenceContent = await readFile("preview/reference-content.js", "utf8");
    const shell = await readFile("preview/shell.js", "utf8");

    expect(packageJson).toMatchObject({
      name: "@openclaw/carapace",
      repository: { url: "https://github.com/openclaw/carapace.git" },
      homepage: "https://carapace.design/",
    });
    expect(cname.trim()).toBe("carapace.design");
    expect(shell).toContain("https://github.com/openclaw/carapace");
    expect(home).toContain("@openclaw/carapace");
    expect(home).not.toContain(legacyDisplayName);
    expect(home).not.toContain(legacyPackageName);
    expect(referenceContent).not.toContain(legacyPackageName);
    expect(shell).not.toContain(legacyDisplayName);
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
  test("documents unavailable links and collapsed menus without active behavior", async () => {
    const lab = await readFile("preview/lab.css", "utf8");
    const dropdown = getReferenceContent("primitive-dropdown");

    expect(lab).toContain('.oc-link[aria-disabled="true"]:not([href])');
    expect(lab).toContain('.oc-pagination-link[aria-disabled="true"]:not([href])');
    expect(dropdown).toContain('<ul class="oc-dropdown-menu" role="menu" hidden>');
  });
  test("documents separate accessible names and descriptions for charts", async () => {
    const customChart = getReferenceContent("chart-custom");
    const chartSources = await Promise.all(
      ["preview/index.html", "preview/reference-content.js"].map((path) => readFile(path, "utf8")),
    );

    expect(customChart).toContain(
      'aria-labelledby="chart-title" aria-describedby="chart-description"',
    );
    expect(customChart).toContain(
      '&lt;title id="chart-title"&gt;Completion distribution&lt;/title&gt;',
    );
    expect(customChart).toContain('&lt;desc id="chart-description"&gt;');
    expect(chartSources.join("\n")).not.toMatch(/aria-labelledby="[^"]+-title [^"]+-description"/);
  });
  test("keeps Sankey flow widths proportional to the published totals", () => {
    const sankey = getReferenceContent("chart-sankey");
    const flowWidths = [...sankey.matchAll(/stroke-width="(\d+)"/g)].map(([, width]) =>
      Number(width),
    );

    expect(flowWidths.slice(0, 3)).toEqual([78, 28, 14]);
    expect(sankey).toContain("780 completed, 280 moved to review, and 140 were blocked");
    expect(sankey).toContain('x="60" y="90" width="30" height="120"');
    expect(sankey).toContain('x="510" y="41" width="30" height="78"');
    expect(sankey).toContain('x="510" y="166" width="30" height="28"');
    expect(sankey).toContain('x="510" y="239" width="30" height="14"');
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
    for (const name of ["menu", "search", "github", "external", "sun", "moon", "system"] as const) {
      const markup = icon(name);
      expect(markup).toContain("<svg");
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).toMatch(/<(path|circle|rect)/);
    }
  });
  test("uses local brand marks without adding click behavior", async () => {
    const shell = await readFile("preview/shell.js", "utf8");

    expect(shell).toContain('new URL("./assets/openclaw-mark.png", import.meta.url).href');
    expect(shell).toContain('new URL("./assets/openclaw-mark-hover.png", import.meta.url).href');
    expect(shell).toContain('src="${brandMarkUrl}"');
    expect(shell).toContain('src="${brandMarkHoverUrl}"');
    expect(shell).toContain("const faviconUrl = brandMarkHoverUrl;");
    expect(shell).toContain('<span class="brand-wordmark">Carapace</span>');
    expect(shell).not.toContain("openclaw.ai/favicon.svg");
    expect(shell).not.toContain('document.querySelector(".brand")?.addEventListener("click"');
  });
  test("keeps canonical metadata aligned with client-side routes", async () => {
    const app = await readFile("preview/app.jsx", "utf8");

    expect(app).toContain("document.querySelector('link[rel=\"canonical\"]')");
    expect(app).toContain("document.querySelector('meta[property=\"og:url\"]')");
    expect(app).toContain('new URL(path, "https://carapace.design/")');
    expect(app).toContain("updateDocumentMetadata(route.pageId, route.path)");
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
    expect(previewStyles).toContain(
      ".topbar-actions {\n  grid-column: 3;\n  display: flex;\n  gap: 8px;",
    );
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

    expect(getAdjacentReferencePages("introduction")).toEqual({
      previous: undefined,
      next: expect.objectContaining({ id: "foundation-tokens" }),
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
    expect(getAdjacentReferencePages("primitive-grid")).toMatchObject({
      previous: { id: "primitive-flow" },
      next: { id: "primitive-hero" },
    });
    expect(getAdjacentReferencePages("primitive-input")).toMatchObject({
      previous: { id: "primitive-indicators" },
      next: { id: "primitive-input-area" },
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
    expect(avatar).toContain("Preview fixture generator");
    expect(avatar).toContain("No image request leaves the browser");
    expect(avatar).toContain("Production alternative: DiceBear");
    expect(avatar).toContain("Generated pixel identities");
    expect(avatar).toContain("Never rely on the status indicator or animation alone");
  });
  test("keeps Avatar preview, usage, and code variants on one reference model", () => {
    const reference = getComponentWorkbenchReference("primitive-avatar");
    const allCode = formatComponentWorkbenchCode(avatarWorkbenchExamples);

    expect(reference?.examples).toBe(avatarWorkbenchExamples);
    expect(avatarWorkbenchExamples.map(({ id }) => id)).toEqual([
      "inline",
      "small",
      "default",
      "large",
      "presence",
      "stack",
      "thinking",
      "speaking",
      "overflow",
    ]);
    expect(
      allCode.match(
        /<!-- (Inline|Small|Default|Large|Presence|Stack|Thinking|Speaking|Overflow) -->/g,
      ),
    ).toHaveLength(9);
    expect(allCode).not.toContain("...");
    expect(allCode).toContain("oc-avatar-sm");
    expect(allCode).toContain("oc-avatar-lg");
    expect(allCode).toContain("oc-avatar-status");
    expect(allCode).toContain("oc-avatar-stack");
    expect(allCode).toContain(
      '<span class="oc-avatar-stack" role="img" aria-label="Mina, Atlas, and Review">',
    );
    expect(allCode).toContain(
      '<span class="oc-avatar-stack" role="img" aria-label="Mina, Atlas, Sora, and 3 more participants">',
    );
    expect(allCode).toContain('data-state="thinking"');
    expect(allCode).toContain('data-state="speaking"');
    expect(allCode).toContain("oc-avatar-overflow");
    const content = getReferenceContent("primitive-avatar");
    expect(content).toContain("&lt;!-- Inline --&gt;");
    expect(content).toContain("&lt;!-- Small --&gt;");
    expect(content).toContain("&lt;!-- Presence --&gt;");
    expect(content).toContain("&lt;!-- Thinking --&gt;");
    expect(content).toContain("&lt;!-- Speaking --&gt;");
    expect(content).toContain("&lt;!-- Overflow --&gt;");
  });
  test("keeps every Button variant discoverable in canvas, usage, and code", () => {
    const definition = getWorkbenchDefinition("primitive-button");
    const reference = getComponentWorkbenchReference("primitive-button");
    const state = normalizeWorkbenchState(definition);
    const comparison = getWorkbenchComparison(definition, state);
    const allCode = formatComponentWorkbenchCode(buttonWorkbenchExamples);

    expect(buttonWorkbenchExamples.map(({ id }) => id)).toEqual([
      "primary",
      "secondary",
      "ghost",
      "disabled",
    ]);
    expect(reference?.examples).toBe(buttonWorkbenchExamples);
    expect(state).toEqual({ variant: WORKBENCH_ALL_VALUE });
    expect(comparison).toMatchObject({
      layout: "rows",
      items: [
        { label: "Primary", state: { variant: "primary" } },
        { label: "Secondary", state: { variant: "secondary" } },
        { label: "Ghost", state: { variant: "ghost" } },
        { label: "Disabled", state: { variant: "disabled" } },
      ],
    });
    expect(allCode.match(/<!-- (Primary|Secondary|Ghost|Disabled) -->/g)).toHaveLength(4);
    expect(allCode).not.toContain("...");
    expect(allCode).toContain("oc-button-primary");
    expect(allCode).toContain("oc-button-secondary");
    expect(allCode).toContain("oc-button-ghost");
    expect(allCode).toContain(" disabled");
  });
  test("renders legacy guidance through the shared Usage contract", async () => {
    const reference = createFallbackComponentWorkbenchReference("Hover, focus, and active", [
      "Keep the whole surface responsible for one action.",
      "Choose the semantic element in the consumer.",
    ]);
    const source = await readFile("preview/component-workbench.js", "utf8");
    const css = await readFile("preview/preview.css", "utf8");

    expect(reference).toEqual({
      usage: [
        {
          title: "Hover, focus, and active",
          items: [
            "Keep the whole surface responsible for one action.",
            "Choose the semantic element in the consumer.",
          ],
        },
      ],
    });
    expect(createFallbackComponentWorkbenchReference("Guidance", ["  ", ""])).toBeUndefined();
    expect(source).toContain("createFallbackComponentWorkbenchReference");
    expect(source).not.toContain("usagePanel.append(guidance)");
    expect(css).not.toContain(".component-workbench-dock-panel > .guidance-list");
  });
  test("formats complete component markup through the shared workbench renderer", async () => {
    const source = await readFile("preview/component-workbench.js", "utf8");
    const css = await readFile("preview/preview.css", "utf8");
    const compact =
      '<details class="oc-agent-tool" open><summary><span>Ran command</span><span data-status="success">Exit 0</span></summary><div><button type="button" aria-label="Copy result">Copy</button></div></details>';
    const formatted = formatWorkbenchMarkup(compact);

    expect(source).not.toContain("workbenchCodeSelections");
    expect(source).not.toContain("highlightCompleteCode");
    expect(source).not.toContain("component-workbench-code-complete");
    expect(source).toContain("highlightWorkbenchCode");
    expect(source).toContain("formatWorkbenchMarkup");
    expect(source).toContain("renderWorkbenchCode(code, definition.markup(state))");
    expect(source).toContain('classList.add("component-workbench-code-readable")');
    expect(source).toContain('data-lucide="sliders-horizontal"');
    expect(formatted).toContain("\n  <summary>");
    expect(formatted).toContain("\n    <span>Ran command</span>");
    expect(formatted).toContain('\n    <span data-status="success">Exit 0</span>');
    expect(formatted).toContain(
      '\n    <button type="button" aria-label="Copy result">Copy</button>',
    );
    expect(formatted).toContain("\n</details>");
    expect(formatWorkbenchMarkup(formatted)).toBe(formatted);
    expect(
      formatWorkbenchMarkup('<button disabled data-label="More > actions">Open</button>'),
    ).toBe('<button disabled data-label="More > actions">Open</button>');
    expect(formatWorkbenchMarkup("<pre><code>line 1\n  line 2</code></pre>")).toContain(
      "line 1\n  line 2",
    );
    expect(css).toContain(".component-workbench-code-token.is-tag");
    expect(css).toContain(".component-workbench-code-token.is-string");
    expect(css).toContain(".component-workbench-code-readable code");
    expect(css).toContain("line-height: 1.8;");
    expect(css).toContain("--oc-accent-secondary");
    expect(css).not.toContain(".component-workbench-code-complete");
    expect(css).not.toContain("component-workbench-code-example-field");
  });
});
