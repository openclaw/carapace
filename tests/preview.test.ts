import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
import { transform } from "lightningcss";
import {
  getWorkbenchShellProfile,
  getWorkbenchViewportModes,
  isComponentWorkbenchPage,
  preserveWorkbenchScrollPosition,
  resolveWorkbenchPageHref,
  workbenchCanvasThemes,
  workbenchViewportModes,
} from "../preview/component-workbench.js";
import {
  WORKBENCH_ALL_VALUE,
  getWorkbenchComparison,
  getWorkbenchControlOptions,
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
import { icon } from "../preview/icons.js";
import {
  getAdjacentReferencePages,
  getReferenceMaturity,
  getReferencePage,
  introductionPage,
  referenceAreas,
  referencePages,
} from "../preview/navigation.js";
import { bindCopyActions, createFeedbackReporter } from "../preview/page-lifecycle.js";
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
const legacyDisplayName = ["OpenClaw", "Design System"].join(" ");
const legacyPackageName = ["@openclaw", "design-system"].join("/");

describe("preview contracts", () => {
  test("resolves adjacent workbench pages from the site root", () => {
    expect(
      resolveWorkbenchPageHref("interface/primitives/autocomplete/", "http://127.0.0.1:4173/"),
    ).toBe("http://127.0.0.1:4173/interface/primitives/autocomplete/");
    expect(
      resolveWorkbenchPageHref(
        "interface/primitives/autocomplete/",
        "https://openclaw.github.io/design-system/",
      ),
    ).toBe("https://openclaw.github.io/design-system/interface/primitives/autocomplete/");
  });

  test("limits the component workbench to component reference pages", () => {
    expect(workbenchViewportModes.map(({ id }) => id)).toEqual(["desktop", "tablet", "mobile"]);
    expect(workbenchViewportModes.map(({ label }) => label)).toEqual([
      "Full width",
      "Medium width",
      "Narrow width",
    ]);
    expect(getWorkbenchViewportModes("primitive-grid").map(({ id }) => id)).toEqual([
      "desktop",
      "tablet",
      "mobile",
    ]);
    expect(getWorkbenchViewportModes("primitive-table").map(({ id }) => id)).toEqual([
      "desktop",
      "mobile",
    ]);
    for (const pageId of [
      "application-settings",
      "application-operations",
      "application-workspace",
    ]) {
      expect(getWorkbenchViewportModes(pageId).map(({ id }) => id)).toEqual([
        "desktop",
        "tablet",
        "mobile",
      ]);
      expect(isComponentWorkbenchPage(pageId)).toBe(true);
      expect(getWorkbenchShellProfile(pageId)).toEqual({
        canvasPreset: "viewport",
        supportsViewport: true,
      });
      expect(getReferenceMaturity(pageId)).toBe("Candidate");
    }
    expect(getWorkbenchViewportModes("primitive-card")).toEqual([]);
    expect(getWorkbenchViewportModes("primitive-avatar")).toEqual([]);
    expect(workbenchCanvasThemes.map(({ id }) => id)).toEqual(["light", "dark"]);
    expect(isComponentWorkbenchPage("primitive-action")).toBe(true);
    expect(isComponentWorkbenchPage("input-bar")).toBe(true);
    expect(isComponentWorkbenchPage("interface-examples")).toBe(false);
    expect(isComponentWorkbenchPage("foundation-colors")).toBe(false);
    expect(isComponentWorkbenchPage("chart-base")).toBe(false);
    expect(isComponentWorkbenchPage("interface")).toBe(false);
  });

  test("adapts shared workbench chrome to the kind of component being demonstrated", () => {
    expect(getWorkbenchShellProfile("primitive-badge")).toEqual({
      canvasPreset: "inline",
      supportsViewport: false,
    });
    expect(getWorkbenchShellProfile("primitive-input")).toEqual({
      canvasPreset: "form",
      supportsViewport: false,
    });
    expect(getWorkbenchShellProfile("primitive-card")).toEqual({
      canvasPreset: "panel",
      supportsViewport: false,
    });
    expect(getWorkbenchShellProfile("primitive-grid")).toEqual({
      canvasPreset: "data",
      supportsViewport: true,
    });
    expect(getWorkbenchShellProfile("agent-chat")).toEqual({
      canvasPreset: "viewport",
      supportsViewport: true,
    });
  });

  test("preserves page position while choice controls update the specimen", () => {
    const scroller = { scrollLeft: 18, scrollTop: 640 };
    const result = preserveWorkbenchScrollPosition(scroller, () => {
      scroller.scrollLeft = 0;
      scroller.scrollTop = 0;
      return "updated";
    });

    expect(result).toBe("updated");
    expect(scroller).toEqual({ scrollLeft: 18, scrollTop: 640 });
  });

  test("provides a surface role for the Grid specimen", () => {
    expect(getReferenceContent("primitive-grid")).toContain(
      'class="specimen-frame oc-app-surface"',
    );
  });

  test("models Grid column variants and item counts through the workbench schema", () => {
    const definition = getWorkbenchDefinition("primitive-grid");

    expect(definition?.controls).toMatchObject([
      {
        id: "columns",
        label: "Columns",
        type: "choice",
        options: [
          { label: "Auto", value: "auto" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
      {
        id: "items",
        label: "Items",
        type: "choice",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "6", value: "6" },
        ],
      },
    ]);
    expect(normalizeWorkbenchState(definition, { columns: "auto", items: "6" })).toEqual({
      columns: "auto",
      items: "6",
    });
    expect(normalizeWorkbenchState(definition, { columns: "5", items: "9" })).toEqual({
      columns: "3",
      items: "3",
    });
    expect(definition?.markup({ columns: "2", items: "4" })).toContain('class="oc-grid oc-grid-2"');
    expect(definition?.markup({ columns: "2", items: "4" })).toContain("Tokens");
    expect(definition?.markup({ columns: "auto", items: "2" })).toContain(
      'class="oc-grid oc-grid-auto"',
    );
  });

  test("models App Surface toolbar and nested card without inventing modifiers", () => {
    const definition = getWorkbenchDefinition("primitive-app-surface");

    expect(definition?.controls).toMatchObject([
      { id: "toolbar", label: "Toolbar", type: "toggle" },
      { id: "card", label: "Card", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { toolbar: false, card: false })).toEqual({
      toolbar: false,
      card: false,
    });
    expect(normalizeWorkbenchState(definition, { toolbar: "yes", card: "yes" })).toEqual({
      toolbar: true,
      card: true,
    });
    expect(definition?.markup({ toolbar: true, card: true })).toContain('class="oc-app-surface"');
    expect(definition?.markup({ toolbar: true, card: true })).toContain(
      'class="primitive-app-surface-toolbar"',
    );
    expect(definition?.markup({ toolbar: true, card: true })).toContain(
      'class="oc-card primitive-app-surface-card"',
    );
    expect(definition?.markup({ toolbar: false, card: false })).toContain("OpenClaw application");
    expect(definition?.markup({ toolbar: false, card: false })).not.toContain(
      "primitive-app-surface-toolbar",
    );
    expect(definition?.markup({ toolbar: false, card: false })).not.toContain("oc-card");
    expect(getReferenceContent("primitive-app-surface")).toContain(
      'class="specimen-frame oc-app-surface"',
    );
    expect(getReferenceContent("primitive-app-surface")).toContain(
      'class="primitive-app-surface-toolbar"',
    );
    expect(getReferenceContent("primitive-app-surface")).toContain(
      'class="oc-card primitive-app-surface-card"',
    );
  });

  test("models application surfaces through bounded state controls", () => {
    const settings = getWorkbenchDefinition("application-settings");
    const operations = getWorkbenchDefinition("application-operations");
    const workspace = getWorkbenchDefinition("application-workspace");

    expect(settings?.defaults).toEqual({
      navigation: "expanded",
      density: "comfortable",
      state: "ready",
    });
    expect(settings?.controls.map(({ id }) => id)).toEqual(["navigation", "density", "state"]);
    expect(settings?.markup({ ...settings.defaults, state: "offline" })).toContain(
      "Gateway unavailable",
    );

    expect(operations?.controls.map(({ id }) => id)).toEqual(["view", "state", "navigation"]);
    expect(operations?.markup({ ...operations.defaults, view: "automation" })).toContain(
      "Scheduled work",
    );

    expect(workspace?.controls.map(({ id }) => id)).toEqual([
      "dock",
      "inspector",
      "status",
      "navigation",
    ]);
    expect(workspace?.markup({ ...workspace.defaults, dock: "bottom" })).toContain(
      'data-dock="bottom"',
    );
    expect(getReferenceContent("application-operations")).toContain(
      '&lt;section class="oc-pane oc-master-detail"&gt;',
    );
  });

  test("models Hero lede and consumer-owned actions without inventing modifiers", () => {
    const definition = getWorkbenchDefinition("primitive-hero");

    expect(definition?.controls).toMatchObject([
      { id: "lede", label: "Lede", type: "toggle" },
      { id: "actions", label: "Actions", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { lede: false, actions: true })).toEqual({
      lede: false,
      actions: true,
    });
    expect(normalizeWorkbenchState(definition, { lede: "yes", actions: "yes" })).toEqual({
      lede: true,
      actions: false,
    });
    expect(definition?.markup({ lede: true, actions: false })).toContain('class="oc-hero-lede"');
    expect(definition?.markup({ lede: true, actions: false })).not.toContain("<button");
    expect(definition?.markup({ lede: false, actions: true })).not.toContain("oc-hero-lede");
    expect(definition?.markup({ lede: false, actions: true })).toContain(
      'class="oc-action oc-action-primary"',
    );
  });

  test("models Section eyebrow, copy, and adjacent action without inventing modifiers", () => {
    const definition = getWorkbenchDefinition("primitive-section");

    expect(definition?.controls).toMatchObject([
      { id: "eyebrow", label: "Eyebrow", type: "toggle" },
      { id: "copy", label: "Copy", type: "toggle" },
      { id: "actions", label: "Actions", type: "toggle" },
    ]);
    expect(
      normalizeWorkbenchState(definition, { eyebrow: false, copy: false, actions: false }),
    ).toEqual({
      eyebrow: false,
      copy: false,
      actions: false,
    });
    expect(
      normalizeWorkbenchState(definition, { eyebrow: "yes", copy: "yes", actions: "yes" }),
    ).toEqual({
      eyebrow: true,
      copy: true,
      actions: true,
    });
    expect(definition?.markup({ eyebrow: true, copy: true, actions: true })).toContain(
      'class="oc-eyebrow"',
    );
    expect(definition?.markup({ eyebrow: true, copy: true, actions: true })).toContain(
      'class="oc-section-copy"',
    );
    expect(definition?.markup({ eyebrow: true, copy: true, actions: true })).toContain(
      'class="oc-action oc-action-secondary"',
    );
    expect(definition?.markup({ eyebrow: false, copy: false, actions: false })).not.toContain(
      "oc-eyebrow",
    );
    expect(definition?.markup({ eyebrow: false, copy: false, actions: false })).not.toContain(
      "oc-section-copy",
    );
    expect(definition?.markup({ eyebrow: false, copy: false, actions: false })).not.toContain(
      "oc-action",
    );
    expect(definition?.markup({ eyebrow: true, copy: true, actions: true })).toContain(
      "Build with OpenClaw",
    );
  });

  test("keeps workbench Flow connectors between markers instead of through titles", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const labCss = await readFile("preview/lab.css", "utf8");

    // Lab list steps reserve space with margin-right for card connectors.
    expect(labCss).toContain(
      ".oc-flow-list .oc-flow-step:not(:last-child) {\n  margin-right: 3rem;\n}",
    );

    // Workbench must clear that margin and draw marker-to-marker rules in the gap.
    expect(css).toContain(
      ".component-workbench-frame .oc-flow-step:not(:last-child) {\n  margin-right: 0;\n}",
    );
    expect(css).toContain("left: var(--oc-flow-marker-size);");
    expect(css).toContain("right: calc(-1 * var(--oc-flow-connector-gap));");
    expect(css).toContain("top: calc(var(--oc-flow-marker-size) / 2);");
    expect(css).not.toMatch(
      /\.component-workbench-frame \.oc-flow-step:not\(:last-child\)::after\s*\{[^}]*\bleft:\s*38px;/,
    );
    expect(css).not.toMatch(
      /\.component-workbench-frame \.oc-flow-step:not\(:last-child\)::after\s*\{[^}]*\btop:\s*26px;/,
    );

    // Mobile workbench frame stacks vertically along the marker axis.
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .component-workbench-frame .oc-flow-list {\n  grid-template-columns: minmax(0, 1fr);\n  column-gap: 0;\n  row-gap: var(--oc-flow-connector-gap);\n}',
    );
    expect(css).toContain(
      "left: calc(var(--oc-flow-marker-size) / 2);\n  width: 1px;\n  height: auto;",
    );
  });

  test("adapts the Grid specimen to workbench viewport controls", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="desktop"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="desktop"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-3 {\n  grid-template-columns: repeat(3, minmax(0, 1fr));',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="desktop"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-4 {\n  grid-template-columns: repeat(4, minmax(0, 1fr));',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="tablet"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-2,\n.component-workbench-canvas[data-viewport="tablet"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-3,\n.component-workbench-canvas[data-viewport="tablet"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-4 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-2,\n.component-workbench-canvas[data-viewport="mobile"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-3,\n.component-workbench-canvas[data-viewport="mobile"]\n  .component-workbench-frame\n  > .specimen-frame\n  > .oc-grid-4 {\n  grid-template-columns: minmax(0, 1fr);',
    );
  });

  test("provides a surface role for the Layer Card specimen", () => {
    expect(getReferenceContent("primitive-layer-card")).toContain(
      'class="specimen-frame oc-app-surface"',
    );
  });

  test("builds Layer Card depth from an elevated band and solid primary", async () => {
    const css = await readFile("preview/lab.css", "utf8");
    const previewCss = await readFile("preview/preview.css", "utf8");
    const specimen = getReferenceContent("primitive-layer-card");

    expect(css).not.toContain(".oc-layer-card::before");
    expect(css).not.toContain(".oc-layer-card::after");
    expect(css).toContain(".oc-layer-card:has(> .oc-layer-card-secondary)");
    expect(css).toContain("background: var(--oc-bg-elevated);");
    expect(css).toContain("background: var(--oc-bg-surface);");
    expect(css).toContain("border-radius: var(--oc-radius-surface) var(--oc-radius-surface) 0 0;");
    expect(css).toContain(
      ".oc-layer-card-primary:has(> .oc-layer-card-icon) {\n  display: grid;\n  grid-template-columns: 2.5rem minmax(0, 1fr);\n  gap: var(--oc-space-4);\n  align-items: start;\n}",
    );
    expect(css).toContain("margin-bottom: calc(var(--oc-space-2) * -1);");
    expect(previewCss).not.toContain(
      ".component-workbench-frame .oc-layer-card-secondary,\n.component-workbench-frame .oc-layer-card-primary",
    );
    expect(previewCss).not.toContain(
      "box-shadow: 0 8px 24px color-mix(in srgb, var(--oc-palette-ink-950) 8%, transparent);",
    );
    expect(specimen).toContain('class="oc-layer-card"');
    expect(specimen).toContain('class="oc-layer-card-secondary"');
    expect(specimen).toContain('class="oc-layer-card-primary"');
    expect(specimen).toContain("layered card for navigation");
  });

  test("uses the shared chevron for Autocomplete disclosure", async () => {
    const css = await readFile("preview/lab.css", "utf8");

    expect(css).toContain(".oc-combobox-toggle::before");
    expect(css).toContain('.oc-combobox-toggle[aria-expanded="true"]::before');
    expect(css).not.toContain(".oc-autocomplete-control");
  });

  test("keeps workbench focus neutral in both isolated themes", async () => {
    const css = await readFile("preview/preview.css", "utf8");

    expect(css.match(/--oc-focus-ring: oklch\(0\.935 0 0 \/ 0\.72\);/g)).toHaveLength(2);
    expect(css.match(/--oc-focus-ring: oklch\(0\.15 0 0 \/ 0\.7\);/g)).toHaveLength(2);
    expect(css).not.toContain("--oc-focus-ring: rgb(79 200 174 / 0.72);");
    expect(css).not.toContain("--oc-focus-ring: rgb(20 128 110 / 0.58);");
  });

  test("wraps complete workbench code without nested scrolling", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const source = await readFile("preview/component-workbench.js", "utf8");
    const preRule =
      css.match(/\.component-workbench-dock-panel \.code-block pre \{([^}]*)\}/)?.[1] ?? "";
    const codeRule = css.match(/\.component-workbench-code-readable code \{([^}]*)\}/)?.[1] ?? "";

    expect(preRule).toContain("overflow-x: hidden;");
    expect(preRule).toContain("overflow-y: hidden;");
    expect(preRule).toContain("overflow-wrap: anywhere;");
    expect(preRule).toContain("white-space: pre-wrap;");
    expect(preRule).not.toContain("max-height:");
    expect(codeRule).toContain("min-width: 0;");
    expect(codeRule).not.toContain("min-width: max-content;");
    expect(source).toContain('copy.textContent = "Copy code"');
    expect(source).toContain('status.setAttribute("aria-live", "polite")');
    expect(source).toContain("dock.dataset.tabsKey");

    const lifecycle = await readFile("preview/page-lifecycle.js", "utf8");
    expect(lifecycle).toContain("function bindCopyActions(root, reportFeedback)");
    expect(lifecycle).toContain("[data-copy-token], [data-copy-code], [data-copy-text]");
    expect(lifecycle).toContain('codeBlock?.querySelector("code")?.textContent');
  });

  test("restores shared copy feedback after repeat clicks and route cleanup", async () => {
    let nextTimer = 1;
    const timers = new Map<number, () => void>();
    const view = {
      navigator: { clipboard: { writeText: async () => undefined } },
      setTimeout(callback: () => void) {
        const id = nextTimer++;
        timers.set(id, callback);
        return id;
      },
      clearTimeout(id: number) {
        timers.delete(id);
      },
    };
    const classes = new Set<string>();
    const feedback = {
      textContent: "",
      classList: {
        add: (name: string) => classes.add(name),
        remove: (name: string) => classes.delete(name),
      },
    };
    const status = { textContent: "" };
    const code = { textContent: "<button>Save</button>" };
    const codeBlock = {
      querySelector(selector: string) {
        if (selector === "code") return code;
        if (selector === "[data-copy-code-status]") return status;
        return null;
      },
    };
    const button = {
      dataset: {},
      textContent: "Copy code",
      classList: { add() {}, remove() {} },
      hasAttribute: (name: string) => name === "data-copy-code",
      querySelector() {
        return null;
      },
      closest(selector: string) {
        if (selector.startsWith("[data-copy-token]")) return button;
        if (selector === ".code-block") return codeBlock;
        return null;
      },
    };
    let click: ((event: { target: typeof button }) => Promise<void>) | undefined;
    const root = {
      ownerDocument: { defaultView: view },
      contains: () => true,
      addEventListener(_type: string, listener: typeof click) {
        click = listener;
      },
      removeEventListener() {},
    };
    const reporter = createFeedbackReporter({ querySelector: () => feedback }, view);
    const stop = bindCopyActions(root, reporter.show);

    await click?.({ target: button });
    await click?.({ target: button });
    expect(button.textContent).toBe("Copied");
    expect(status.textContent).toBe("Code copied.");
    expect(timers.size).toBe(2);

    const copyReset = Math.max(...timers.keys());
    const reset = timers.get(copyReset);
    timers.delete(copyReset);
    reset?.();
    expect(button.textContent).toBe("Copy code");
    expect(status.textContent).toBe("");

    await click?.({ target: button });
    stop();
    reporter.cleanup();
    expect(button.textContent).toBe("Copy code");
    expect(status.textContent).toBe("");
    expect(feedback.textContent).toBe("");
    expect(classes.has("is-visible")).toBe(false);
    expect(timers.size).toBe(0);
  });

  test("preserves icon-only clipboard actions while announcing copy status", async () => {
    let nextTimer = 1;
    const timers = new Map<number, () => void>();
    const view = {
      navigator: { clipboard: { writeText: async () => undefined } },
      setTimeout(callback: () => void) {
        const id = nextTimer++;
        timers.set(id, callback);
        return id;
      },
      clearTimeout(id: number) {
        timers.delete(id);
      },
    };
    const status = { textContent: "" };
    const icon = { tagName: "I" };
    const textContainer = {
      querySelector(selector: string) {
        if (selector === "[data-copy-status]") return status;
        return null;
      },
    };
    const button = {
      dataset: { copyText: "@openclaw/carapace" },
      textContent: "",
      classList: { add() {}, remove() {} },
      hasAttribute: () => false,
      querySelector(selector: string) {
        if (selector === "svg, [data-lucide]") return icon;
        return null;
      },
      closest(selector: string) {
        if (selector.startsWith("[data-copy-token]")) return button;
        if (selector.startsWith("[data-copy-code]")) return null;
        if (selector.startsWith("[data-copy-text]")) return button;
        if (selector === ".oc-clipboard-text") return textContainer;
        return null;
      },
    };
    let click: ((event: { target: typeof button }) => Promise<void>) | undefined;
    const root = {
      ownerDocument: { defaultView: view },
      contains: () => true,
      addEventListener(_type: string, listener: typeof click) {
        click = listener;
      },
      removeEventListener() {},
    };
    const stop = bindCopyActions(root, () => undefined);

    await click?.({ target: button });
    expect(button.textContent).toBe("");
    expect(button.querySelector("svg, [data-lucide]")).toBe(icon);
    expect(status.textContent).toBe("Copied to clipboard.");
    expect(timers.size).toBe(1);

    const reset = timers.get([...timers.keys()][0]!);
    timers.delete([...timers.keys()][0]!);
    reset?.();
    expect(status.textContent).toBe("");
    expect(button.querySelector("svg, [data-lucide]")).toBe(icon);
    stop();
  });

  test("keeps preview-only hover boundaries neutral", async () => {
    const lab = await readFile("preview/lab.css", "utf8");
    const shell = await readFile("preview/preview.css", "utf8");

    for (const selector of [
      ".oc-input-group:hover:not(:has(.oc-input:disabled))",
      ".oc-sensitive-input:hover",
      '.oc-button-secondary:hover:not(:disabled):not([aria-disabled="true"])',
      ".oc-date-input:hover:not(:disabled)",
    ]) {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const declarations = lab.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
      expect(declarations).toContain("border-color: var(--oc-border-strong)");
    }

    for (const selector of [
      ".route-card:hover",
      ".search-trigger:hover",
      ".button-secondary:hover",
    ]) {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const declarations = shell.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
      expect(declarations).toContain("border-color: var(--oc-border-strong)");
    }
  });

  test("keeps light-mode specimen shells on elevated white", async () => {
    const lab = await readFile("preview/lab.css", "utf8");
    const shell = await readFile("preview/preview.css", "utf8");

    const secondary = lab.match(/\.oc-button-secondary\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(secondary).toContain("background: var(--oc-bg-elevated);");
    expect(secondary).not.toContain("background: var(--oc-surface-interactive);");

    const toolbar = lab.match(/\.oc-toolbar\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(toolbar).toContain("background: var(--oc-bg-elevated);");

    const clipboard = lab.match(/\.oc-clipboard-text\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(clipboard).toContain("background: var(--oc-bg-elevated);");

    for (const selector of [
      ".text-hierarchy-demo",
      ".toolbar-demo",
      ".toast-stage-content",
      ".segmented-demo > p",
      ".menubar-app-canvas-surface",
      ".reference-card.foundations-card-featured",
    ]) {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const declarations = shell.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
      expect(declarations).toContain("background: var(--oc-bg-elevated);");
      expect(declarations).not.toContain("var(--oc-surface-secondary-soft)");
      expect(declarations).not.toContain("var(--oc-bg-surface)");
    }

    const lightCanvas =
      shell.match(
        /\.component-workbench-canvas\[data-workbench-theme="light"\]\s*\{([^}]*)\}/,
      )?.[1] ?? "";
    expect(lightCanvas).toContain("--oc-bg-page: oklch(0.985 0 0);");
    expect(lightCanvas).toContain("--oc-bg-elevated: oklch(1 0 0);");
    expect(lightCanvas).not.toContain("--oc-bg-page: var(--oc-palette-paper-100);");
  });

  test("publishes only real action variants through the workbench schema", () => {
    const definition = getWorkbenchDefinition("primitive-action");

    expect(definition?.controls[0]).toMatchObject({
      id: "variant",
      type: "choice",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Ghost", value: "ghost" },
        { label: "Icon", value: "icon" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { variant: "secondary" })).toEqual({
      variant: "secondary",
    });
    expect(normalizeWorkbenchState(definition, { variant: "loading" })).toEqual({
      variant: WORKBENCH_ALL_VALUE,
    });
  });

  test("publishes ClipboardText action variants through the workbench schema", () => {
    const definition = getWorkbenchDefinition("primitive-clipboard-text");

    expect(definition?.controls[0]).toMatchObject({
      id: "variant",
      type: "choice",
      compare: "rows",
      options: [
        { label: "Label", value: "label" },
        { label: "Icon", value: "icon" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { variant: "label" })).toEqual({
      variant: "label",
    });
    expect(normalizeWorkbenchState(definition, { variant: "ghost" })).toEqual({
      variant: WORKBENCH_ALL_VALUE,
    });
    expect(getWorkbenchComparison(definition, { variant: WORKBENCH_ALL_VALUE })).toMatchObject({
      layout: "rows",
      items: [
        { label: "Label", state: { variant: "label" } },
        { label: "Icon", state: { variant: "icon" } },
      ],
    });
  });

  test("offers All only for comparable visual variants", () => {
    const action = getWorkbenchDefinition("primitive-action");
    const control = action?.controls[0];
    const state = normalizeWorkbenchState(action, { variant: WORKBENCH_ALL_VALUE });

    expect(getWorkbenchControlOptions(control).map(({ label }) => label)).toEqual([
      "All",
      "Primary",
      "Secondary",
      "Ghost",
      "Icon",
    ]);
    expect(getWorkbenchComparison(action, state)).toMatchObject({
      layout: "rows",
      items: [
        { label: "Primary", state: { variant: "primary" } },
        { label: "Secondary", state: { variant: "secondary" } },
        { label: "Ghost", state: { variant: "ghost" } },
        { label: "Icon", state: { variant: "icon" } },
      ],
    });

    const sendButton = getWorkbenchDefinition("send-button");
    expect(getWorkbenchControlOptions(sendButton?.controls[0]).map(({ label }) => label)).toEqual([
      "Idle",
      "Typing",
      "Streaming",
    ]);
    expect(normalizeWorkbenchState(sendButton, { state: WORKBENCH_ALL_VALUE })).toEqual({
      state: "idle",
    });
  });

  test("models Banner tones and its optional adjacent action", () => {
    const definition = getWorkbenchDefinition("primitive-banner");

    expect(definition?.controls).toMatchObject([
      {
        id: "tone",
        type: "choice",
        options: [
          { label: "Default", value: "default" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Information", value: "info" },
        ],
      },
      { id: "action", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { tone: "success", action: false })).toEqual({
      tone: "success",
      action: false,
    });
    expect(normalizeWorkbenchState(definition, { tone: "unknown", action: "yes" })).toEqual({
      tone: WORKBENCH_ALL_VALUE,
      action: true,
    });
  });

  test("publishes only real Link variants through the workbench schema", () => {
    const definition = getWorkbenchDefinition("primitive-link");

    expect(definition?.controls).toMatchObject([
      {
        id: "variant",
        type: "choice",
        compare: "rows",
        options: [
          { label: "Inline", value: "inline" },
          { label: "Muted", value: "muted" },
          { label: "Standalone", value: "standalone" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(getWorkbenchControlOptions(definition?.controls[0]).map(({ label }) => label)).toEqual([
      "All",
      "Inline",
      "Muted",
      "Standalone",
    ]);
    expect(normalizeWorkbenchState(definition, { variant: "muted", disabled: true })).toEqual({
      variant: "muted",
      disabled: true,
    });
    expect(normalizeWorkbenchState(definition, { variant: "underline", disabled: "yes" })).toEqual({
      variant: WORKBENCH_ALL_VALUE,
      disabled: false,
    });
    expect(
      getWorkbenchComparison(definition, { variant: WORKBENCH_ALL_VALUE, disabled: false }),
    ).toMatchObject({
      layout: "rows",
      items: [
        { label: "Inline", state: { variant: "inline", disabled: false } },
        { label: "Muted", state: { variant: "muted", disabled: false } },
        { label: "Standalone", state: { variant: "standalone", disabled: false } },
      ],
    });
  });

  test("models Table interactive rows as an opt-in behavior", () => {
    const definition = getWorkbenchDefinition("primitive-table");

    expect(definition?.controls).toMatchObject([
      { id: "interactive", label: "Interactive rows", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { interactive: true })).toEqual({
      interactive: true,
    });
    expect(normalizeWorkbenchState(definition, { interactive: "yes" })).toEqual({
      interactive: false,
    });
  });

  test("models native Select values and disabled state without synthetic variants", () => {
    const definition = getWorkbenchDefinition("primitive-select");

    expect(definition?.controls).toMatchObject([
      {
        id: "value",
        type: "choice",
        options: [
          { label: "Balanced", value: "balanced" },
          { label: "Fast", value: "fast" },
          { label: "Deep", value: "deep" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { value: "fast", disabled: true })).toEqual({
      value: "fast",
      disabled: true,
    });
    expect(normalizeWorkbenchState(definition, { value: "unknown", disabled: "yes" })).toEqual({
      value: "balanced",
      disabled: false,
    });
  });

  test("models Input Area states from the shared field contract", () => {
    const definition = getWorkbenchDefinition("primitive-input-area");

    expect(definition?.controls).toMatchObject([
      {
        id: "state",
        type: "choice",
        compare: "stack",
        options: [
          { label: "Default", value: "default" },
          { label: "Invalid", value: "invalid" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      { id: "message", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, {})).toEqual({
      state: WORKBENCH_ALL_VALUE,
      message: true,
    });
    expect(normalizeWorkbenchState(definition, { state: "invalid", message: false })).toEqual({
      state: "invalid",
      message: false,
    });
    expect(normalizeWorkbenchState(definition, { state: "readonly", message: "yes" })).toEqual({
      state: WORKBENCH_ALL_VALUE,
      message: true,
    });
    expect(
      getWorkbenchComparison(definition, normalizeWorkbenchState(definition, {})),
    ).toMatchObject({
      layout: "stack",
      items: [
        { label: "Default", state: { state: "default", message: true } },
        { label: "Invalid", state: { state: "invalid", message: true } },
        { label: "Disabled", state: { state: "disabled", message: true } },
      ],
    });
  });

  test("models Input Group addon positions and field states without inventing readonly", () => {
    const definition = getWorkbenchDefinition("primitive-input-group");

    expect(definition?.controls).toMatchObject([
      {
        id: "addon",
        type: "choice",
        compare: "stack",
        options: [
          { label: "Prefix", value: "prefix" },
          { label: "Suffix", value: "suffix" },
          { label: "Both", value: "both" },
        ],
      },
      {
        id: "state",
        type: "choice",
        options: [
          { label: "Default", value: "default" },
          { label: "Invalid", value: "invalid" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      { id: "message", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, {})).toEqual({
      addon: WORKBENCH_ALL_VALUE,
      state: "default",
      message: true,
    });
    expect(
      normalizeWorkbenchState(definition, {
        addon: "suffix",
        state: "invalid",
        message: false,
      }),
    ).toEqual({
      addon: "suffix",
      state: "invalid",
      message: false,
    });
    expect(
      normalizeWorkbenchState(definition, {
        addon: "leading",
        state: "readonly",
        message: "yes",
      }),
    ).toEqual({
      addon: WORKBENCH_ALL_VALUE,
      state: "default",
      message: true,
    });
    expect(
      getWorkbenchComparison(definition, normalizeWorkbenchState(definition, {})),
    ).toMatchObject({
      layout: "stack",
      items: [
        {
          label: "Prefix",
          state: { addon: "prefix", state: "default", message: true },
        },
        {
          label: "Suffix",
          state: { addon: "suffix", state: "default", message: true },
        },
        {
          label: "Both",
          state: { addon: "both", state: "default", message: true },
        },
      ],
    });
  });

  test("models free-entry Autocomplete values and disabled state", () => {
    const definition = getWorkbenchDefinition("primitive-autocomplete");

    expect(definition?.controls).toMatchObject([
      {
        id: "value",
        type: "choice",
        options: [
          { label: "Empty", value: "" },
          { label: "Action", value: "Action" },
          { label: "Card", value: "Card" },
          { label: "Input", value: "Input" },
          { label: "Select", value: "Select" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { value: "Card", disabled: true })).toEqual({
      value: "Card",
      disabled: true,
    });
  });

  test("restores Autocomplete focus after a selected value rerenders the specimen", () => {
    const definition = getWorkbenchDefinition("primitive-autocomplete");
    const initialInput = Object.assign(new EventTarget(), { value: "Card" });
    const replacementInput = {
      focused: false,
      focus() {
        this.focused = true;
      },
    };
    let currentInput = initialInput;
    const specimen = {
      querySelectorAll: () => [],
      querySelector: (selector) => (selector === "input" ? currentInput : null),
    };

    definition?.bind?.(specimen, {}, (id, value) => {
      expect([id, value]).toEqual(["value", "Card"]);
      currentInput = replacementInput;
    });
    initialInput.dispatchEvent(new Event("change"));

    expect(replacementInput.focused).toBe(true);
  });

  test("models only observable Toast demo states", () => {
    const definition = getWorkbenchDefinition("primitive-toast");

    expect(definition?.controls).toMatchObject([
      { id: "visible", type: "toggle" },
      { id: "dismissible", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { visible: true, dismissible: false })).toEqual({
      visible: true,
      dismissible: false,
    });
  });

  test("models the Composer status and disabled states documented by the component", () => {
    const definition = getWorkbenchDefinition("input-bar");

    expect(definition?.controls).toMatchObject([
      {
        id: "status",
        type: "choice",
        options: [
          { label: "Ready", value: "ready" },
          { label: "Submitted", value: "submitted" },
          { label: "Streaming", value: "streaming" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(
      normalizeWorkbenchState(definition, { status: "submitted", disabled: true }),
    ).toMatchObject({
      status: "submitted",
      disabled: true,
    });
  });

  test("models exact Agent input-family variant sets", () => {
    expect(getWorkbenchDefinition("send-button")?.controls[0]).toMatchObject({
      id: "state",
      options: [
        { label: "Idle", value: "idle" },
        { label: "Typing", value: "typing" },
        { label: "Streaming", value: "streaming" },
      ],
    });
    expect(getWorkbenchDefinition("attachment-button")?.controls[0]).toMatchObject({
      id: "icon",
      options: [
        { label: "Plus", value: "plus" },
        { label: "Paperclip", value: "paperclip" },
      ],
    });
    expect(getWorkbenchDefinition("file-attachment")?.controls.map(({ id }) => id)).toEqual([
      "kind",
      "display",
      "removable",
    ]);
    expect(getWorkbenchDefinition("suggestions")?.controls).toMatchObject([
      { id: "disabled", type: "toggle" },
    ]);
    expect(getWorkbenchDefinition("model-picker")?.controls[0].id).toBe("value");
    expect(getWorkbenchDefinition("mode-selector")?.controls[0].id).toBe("value");
  });

  test("models documented Error Message examples", () => {
    const definition = getWorkbenchDefinition("error-message");

    expect(definition?.controls).toMatchObject([
      {
        id: "example",
        type: "choice",
        options: [
          { label: "Interrupted", value: "interrupted" },
          { label: "Rate limit", value: "rate-limit" },
        ],
      },
    ]);
  });

  test("models documented Markdown examples", () => {
    const definition = getWorkbenchDefinition("markdown");

    expect(definition?.controls[0]).toMatchObject({
      id: "example",
      type: "choice",
      options: [
        { label: "Release notes", value: "release" },
        { label: "Table and links", value: "table" },
        { label: "Streaming update", value: "streaming" },
      ],
    });
  });

  test("models documented Loader sizes and label visibility", () => {
    const definition = getWorkbenchDefinition("primitive-loader");

    expect(definition?.controls).toMatchObject([
      {
        id: "size",
        type: "choice",
        compare: "rows",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { id: "label", type: "toggle" },
    ]);
    expect(getWorkbenchControlOptions(definition?.controls[0]).map(({ label }) => label)).toEqual([
      "All",
      "Small",
      "Medium",
      "Large",
    ]);
    expect(normalizeWorkbenchState(definition, { size: "sm", label: false })).toEqual({
      size: "sm",
      label: false,
    });
    expect(normalizeWorkbenchState(definition, { size: "xl", label: "yes" })).toEqual({
      size: WORKBENCH_ALL_VALUE,
      label: true,
    });
    expect(
      getWorkbenchComparison(
        definition,
        normalizeWorkbenchState(definition, { size: WORKBENCH_ALL_VALUE }),
      ),
    ).toMatchObject({
      layout: "rows",
      items: [
        { label: "Small", state: { size: "sm", label: true } },
        { label: "Medium", state: { size: "md", label: true } },
        { label: "Large", state: { size: "lg", label: true } },
      ],
    });
  });

  test("models documented Skeleton Line count and width variants", () => {
    const definition = getWorkbenchDefinition("primitive-skeleton-line");

    expect(definition?.controls).toMatchObject([
      {
        id: "count",
        type: "choice",
        compare: "stack",
        options: [
          { label: "One", value: "1" },
          { label: "Three", value: "3" },
          { label: "Five", value: "5" },
        ],
      },
      {
        id: "width",
        type: "choice",
        options: [
          { label: "Full", value: "full" },
          { label: "Mixed", value: "mixed" },
          { label: "Short", value: "short" },
        ],
      },
    ]);
    expect(getWorkbenchControlOptions(definition?.controls[0]).map(({ label }) => label)).toEqual([
      "All",
      "One",
      "Three",
      "Five",
    ]);
    expect(normalizeWorkbenchState(definition, { count: "1", width: "short" })).toEqual({
      count: "1",
      width: "short",
    });
    expect(normalizeWorkbenchState(definition, { count: "9", width: "wide" })).toEqual({
      count: WORKBENCH_ALL_VALUE,
      width: "mixed",
    });
    expect(
      getWorkbenchComparison(
        definition,
        normalizeWorkbenchState(definition, { count: WORKBENCH_ALL_VALUE, width: "full" }),
      ),
    ).toMatchObject({
      layout: "stack",
      items: [
        { label: "One", state: { count: "1", width: "full" } },
        { label: "Three", state: { count: "3", width: "full" } },
        { label: "Five", state: { count: "5", width: "full" } },
      ],
    });
  });

  test("models Provider Logo size, label, state, and layout controls", () => {
    const definition = getWorkbenchDefinition("primitive-provider-logo");

    expect(definition?.controls).toMatchObject([
      {
        id: "size",
        type: "choice",
        compare: "rows",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { id: "label", type: "toggle" },
      {
        id: "state",
        type: "choice",
        options: [
          { label: "Default", value: "default" },
          { label: "Selected", value: "selected" },
          { label: "Muted", value: "muted" },
        ],
      },
      {
        id: "layout",
        type: "choice",
        options: [
          { label: "Wrap", value: "wrap" },
          { label: "Row", value: "row" },
          { label: "Stack", value: "stack" },
        ],
      },
    ]);
    expect(normalizeWorkbenchState(definition, {})).toEqual({
      size: WORKBENCH_ALL_VALUE,
      label: true,
      state: "default",
      layout: "wrap",
    });
    expect(
      normalizeWorkbenchState(definition, {
        size: "lg",
        label: false,
        state: "selected",
        layout: "stack",
      }),
    ).toEqual({
      size: "lg",
      label: false,
      state: "selected",
      layout: "stack",
    });
    expect(
      normalizeWorkbenchState(definition, {
        size: "xl",
        label: "yes",
        state: "unknown",
        layout: "grid",
      }),
    ).toEqual({
      size: WORKBENCH_ALL_VALUE,
      label: true,
      state: "default",
      layout: "wrap",
    });
    expect(
      definition?.markup({ size: "sm", label: true, state: "default", layout: "wrap" }),
    ).toContain("oc-provider-logo-sm");
    expect(
      definition?.markup({ size: "md", label: false, state: "selected", layout: "row" }),
    ).toContain('data-selected="true"');
    expect(
      definition?.markup({ size: "lg", label: true, state: "muted", layout: "stack" }),
    ).toContain("oc-provider-logo-muted");
  });

  test("models documented Spiral Loader sizes", () => {
    const definition = getWorkbenchDefinition("spiral-loader");

    expect(definition?.controls[0]).toMatchObject({
      id: "size",
      type: "choice",
      options: [
        { label: "Small", value: "16" },
        { label: "Medium", value: "24" },
        { label: "Large", value: "32" },
      ],
    });
  });

  test("models documented Text Shimmer examples", () => {
    const definition = getWorkbenchDefinition("text-shimmer");

    expect(definition?.controls[0]).toMatchObject({
      id: "example",
      type: "choice",
      options: [
        { label: "Inline status", value: "inline" },
        { label: "Delayed shimmer", value: "delayed" },
        { label: "Fast shimmer", value: "fast" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { example: "fast" })).toEqual({
      example: "fast",
    });
    expect(normalizeWorkbenchState(definition, { example: "unknown" })).toEqual({
      example: WORKBENCH_ALL_VALUE,
    });
  });

  test("models supported User Message content", () => {
    const definition = getWorkbenchDefinition("user-message");

    expect(definition?.controls[0]).toMatchObject({
      id: "content",
      type: "choice",
      options: [
        { label: "Text only", value: "text" },
        { label: "With image", value: "image" },
        { label: "With file", value: "file" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { content: "file" })).toEqual({
      content: "file",
    });
    expect(normalizeWorkbenchState(definition, { content: "unknown" })).toEqual({
      content: WORKBENCH_ALL_VALUE,
    });
  });

  test("models Agent tool lifecycle without synthetic states", () => {
    for (const pageId of ["bash-tool", "edit-tool", "generic-tool"]) {
      const definition = getWorkbenchDefinition(pageId);
      expect(definition?.controls).toMatchObject([
        {
          id: "state",
          type: "choice",
          options: [
            { label: "Running", value: "animating" },
            { label: "Complete", value: "complete" },
          ],
        },
      ]);
      expect(normalizeWorkbenchState(definition, { state: "pending" })).toEqual({
        state: "complete",
      });
    }

    for (const pageId of [
      "mcp-tool",
      "search-tool",
      "thinking-tool",
      "subagent-tool",
      "tool-group",
    ]) {
      const definition = getWorkbenchDefinition(pageId);
      expect(definition?.controls).toMatchObject([
        {
          id: "state",
          type: "choice",
          options: [
            { label: "Running", value: "animating" },
            { label: "Complete", value: "complete" },
          ],
        },
        { id: "open", type: "toggle" },
      ]);
      expect(normalizeWorkbenchState(definition, { state: "pending", open: "yes" })).toEqual({
        state: "complete",
        open: true,
      });
    }
  });

  test("models exact Plan, Todo, and Question states", () => {
    expect(getWorkbenchDefinition("plan-tool")?.controls).toMatchObject([
      {
        id: "state",
        options: [
          { label: "Running", value: "animating" },
          { label: "Complete", value: "complete" },
        ],
      },
      { id: "open", type: "toggle" },
      { id: "approved", type: "toggle" },
    ]);
    expect(getWorkbenchDefinition("todo-tool")?.controls[0]).toMatchObject({
      id: "status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "In progress", value: "in_progress" },
        { label: "Completed", value: "completed" },
      ],
    });
    expect(getWorkbenchDefinition("question-tool")?.controls).toMatchObject([
      {
        id: "state",
        options: [
          { label: "Open", value: "open" },
          { label: "Answered", value: "answered" },
        ],
      },
      { id: "allowSkip", type: "toggle" },
    ]);
  });

  test("models Agent Chat examples and ChatStatus values from the reference contract", () => {
    const definition = getWorkbenchDefinition("agent-chat");

    expect(definition?.controls).toMatchObject([
      {
        id: "example",
        type: "choice",
        options: [
          { label: "Basic", value: "basic" },
          { label: "Empty", value: "empty" },
          { label: "Suggestions", value: "suggestions" },
          { label: "Attachments", value: "attachments" },
        ],
      },
      {
        id: "status",
        type: "choice",
        options: [
          { label: "Ready", value: "ready" },
          { label: "Submitted", value: "submitted" },
          { label: "Streaming", value: "streaming" },
          { label: "Error", value: "error" },
        ],
      },
      { id: "copyToolbar", type: "toggle" },
    ]);
  });

  test("models transcript status and copy affordance independently", () => {
    const definition = getWorkbenchDefinition("message-list");

    expect(
      normalizeWorkbenchState(definition, {
        status: "streaming",
        copyToolbar: false,
      }),
    ).toEqual({ status: "streaming", copyToolbar: false });
  });

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

    const areaOverviewIds = new Set(["foundations", "interface", "compositions", "resources"]);
    for (const area of referenceAreas.filter(({ id }) => areaOverviewIds.has(id))) {
      const fragment = await readFile(`preview/static-routes/${area.id}.html`, "utf8");
      expect(fragment).toContain('class="preview-stage"');
      expect(fragment).not.toContain("<html");
      expect(fragment).not.toContain(legacyDisplayName);
    }

    const foundations = await readFile("preview/static-routes/foundations.html", "utf8");
    expect(foundations).toContain('class="intro intro-compact foundations-overview"');
    expect(foundations).toContain('class="foundations-card-grid"');
    expect(foundations).toContain('class="reference-card foundations-card-featured"');
    expect(foundations).toContain('class="foundations-card-cluster"');
    expect(foundations).toContain('href="./tokens/"');
    expect(foundations).toContain('href="./typography/"');
    expect(foundations).toContain('href="./base/"');
    expect(foundations.match(/class="reference-card[^"]*"/g)).toHaveLength(7);

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

  test("publishes the introduction as a live primitive grid", async () => {
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

    expect(introductionPage).toEqual({
      id: "overview",
      label: "Home",
      path: "",
      keywords: "home overview carapace visual contract",
    });
    expect(home).toContain('data-preview-route="overview"');
    expect(home).toContain('class="home-component-grid"');
    expect(home).toContain('class="home-component-cell home-brand-cell"');
    expect(home).toMatch(
      /<div class="home-brand-intro">\s*<code class="home-brand-package">@openclaw\/carapace<\/code>/,
    );
    expect(home).toContain('<h1 id="preview-title">Carapace</h1>');
    expect(home).toContain("A carapace is a protective outer shell.");
    expect(home).not.toContain('class="home-hero"');
    expect(home).toContain('class="oc-clipboard-action oc-clipboard-action-icon"');
    expect(home).toContain('data-lucide="copy"');
    expect(home.match(/home-component-cell/g)).toHaveLength(39);
    expect(home.match(/class="home-component-cell"/g)).toHaveLength(38);
    expect(new Set(componentLabels).size).toBe(38);
    expect(new Set(componentPaths).size).toBe(38);
    expect(componentLabels).toContain("Suggestions");
    expect(componentLabels).toContain("Bash Tool");
    expect(componentLabels).toContain("Thinking Tool");
    expect(componentLabels).toContain("Dialog");
    expect(componentLabels).toContain("Clipboard Text");
    expect(componentLabels).not.toContain("Plan Tool");
    expect(home).toContain('href="./agent-components/suggestions/"');
    expect(home).toContain('href="./agent-components/bash-tool/"');
    expect(home).toContain('href="./agent-components/thinking-tool/"');
    expect(home).toContain('href="./interface/primitives/dialog/"');
    expect(home).toContain('href="./interface/primitives/clipboard-text/"');
    expect(componentPaths.every((path) => referencePages.some((page) => page.path === path))).toBe(
      true,
    );
    expect(home.match(/oc-app-surface/g)).toHaveLength(1);
    expect(previewStyles).toContain(
      "--home-grid-row-height: calc((100dvh - var(--preview-topbar-height) - 1px) / 2)",
    );
    expect(previewStyles).toContain("grid-auto-rows: var(--home-grid-row-height)");
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
    expect(getAdjacentReferencePages("primitive-grid")).toMatchObject({
      previous: { id: "primitive-flow" },
      next: { id: "primitive-hero" },
    });
    expect(getAdjacentReferencePages("primitive-input")).toMatchObject({
      previous: { id: "primitive-hero" },
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
    expect(avatar).toContain("Never rely on the status indicator alone");
  });

  test("keeps Avatar preview, usage, and code variants on one reference model", () => {
    const reference = getComponentWorkbenchReference("primitive-avatar");
    const allCode = formatComponentWorkbenchCode(avatarWorkbenchExamples);

    expect(reference?.examples).toBe(avatarWorkbenchExamples);
    expect(avatarWorkbenchExamples.map(({ id }) => id)).toEqual([
      "small",
      "default",
      "large",
      "presence",
    ]);
    expect(allCode.match(/<!-- (Small|Default|Large|Presence) -->/g)).toHaveLength(4);
    expect(allCode).not.toContain("...");
    expect(allCode).toContain("oc-avatar-sm");
    expect(allCode).toContain("oc-avatar-lg");
    expect(allCode).toContain("oc-avatar-status");
    const content = getReferenceContent("primitive-avatar");
    expect(content).toContain("&lt;!-- Small --&gt;");
    expect(content).toContain("&lt;!-- Presence --&gt;");
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
