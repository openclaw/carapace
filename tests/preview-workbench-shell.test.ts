import { describe, expect, test } from "bun:test";
import {
  readFile,
} from "node:fs/promises";
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
  getWorkbenchDefinition,
  normalizeWorkbenchState,
} from "../preview/component-workbench-config.js";
import {
  icon,
} from "../preview/icons.js";
import {
  getReferenceMaturity,
} from "../preview/navigation.js";
import {
  bindCopyActions,
  createFeedbackReporter,
} from "../preview/page-lifecycle.js";
import {
  getReferenceContent,
} from "../preview/reference-content.js";

describe("workbench shell contracts", () => {
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
      "application-sessions",
      "application-quick-chat",
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
    expect(isComponentWorkbenchPage("effect-interaction")).toBe(false);
    expect(isComponentWorkbenchPage("effect-loading")).toBe(false);
    expect(isComponentWorkbenchPage("effect-attention")).toBe(false);
    expect(isComponentWorkbenchPage("effect-transition")).toBe(false);
    expect(isComponentWorkbenchPage("foundation-colors")).toBe(false);
    expect(isComponentWorkbenchPage("chart-base")).toBe(false);
    expect(isComponentWorkbenchPage("interface")).toBe(false);
  });
  test("retries lazy route content without caching a blank route", async () => {
    const app = await readFile("preview/app.jsx", "utf8");
    const staticRoutes = await readFile("preview/static-route-content.js", "utf8");
    const vite = await readFile("preview/vite.config.ts", "utf8");
    const packageJson = await readFile("package.json", "utf8");

    expect(app).toContain("referenceRuntimePromise = undefined");
    expect(app).toContain("loadStaticRouteContent(route.pageId, siteRoot)");
    expect(app).toContain('className="reference-runtime-error" role="alert"');
    expect(app).toContain("setReferenceLoadAttempt((attempt) => attempt + 1)");
    expect(app).toContain("mountReferenceRuntime(root, route.pageId);");
    expect(app).toContain(
      "finishMount();\n        restoreRouteScroll(routeNavigationRef.current, routeHashRef.current);",
    );
    expect(app).toContain("ref={lazyStaticContentRef}");
    expect(app).toContain('key={`lazy-static:${route.pageId}`}');
    expect(app).toContain('key={`reference:${route.pageId}`}');
    expect(app).toContain("restoreRouteScroll(navigation, route.hash);");
    expect(staticRoutes).toContain('import("./static-routes/introduction.html?raw")');
    expect(staticRoutes).not.toContain(
      'import introductionHtml from "./static-routes/introduction.html?raw"',
    );
    expect(vite).not.toContain("glimm");
    expect(packageJson).not.toContain('"glimm"');
  });
  test("keeps preview scrolling off synchronous per-frame work", async () => {
    const app = await readFile("preview/app.jsx", "utf8");
    const bootstrap = await readFile("preview/preview.js", "utf8");
    const lifecycle = await readFile("preview/page-lifecycle.js", "utf8");
    const styles = await readFile("preview/preview.css", "utf8");
    const topbar = styles.match(/(?:^|\n)\.topbar\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(app).not.toContain("GlimmProvider");
    expect(app).not.toContain("scrollFrame");
    expect(app).not.toContain('addEventListener("scroll"');
    expect(app).not.toContain("scrollSaveTimeoutRef");
    expect(app).toContain("existing.scrollY === window.scrollY");
    expect(app).toContain("scrollPositionsRef.current.set(outgoingHistoryEntryId");
    expect(app).toContain("persistScrollPosition(outgoingHistoryEntryId, outgoingPosition)");
    expect(app).toContain("readPersistedScrollPosition(historyEntryId)");
    expect(app).toContain("clearPersistedScrollPosition(currentHistoryEntryRef.current)");
    expect(bootstrap).not.toContain("lucide");
    expect(lifecycle).toContain('import("./lucide.js")');
    expect(lifecycle).toContain("view.requestAnimationFrame");
    expect(topbar).not.toContain("backdrop-filter");
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
      canvasPreset: "wide",
      supportsViewport: false,
    });
    expect(getWorkbenchShellProfile("primitive-provider-logo")).toEqual({
      canvasPreset: "wide",
      supportsViewport: false,
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
    const sessions = getWorkbenchDefinition("application-sessions");
    const quickChat = getWorkbenchDefinition("application-quick-chat");

    expect(settings?.defaults).toEqual({
      density: "compact",
      state: "ready",
    });
    expect(settings?.controls.map(({ id }) => id)).toEqual(["density", "state"]);
    expect(settings?.markup({ ...settings.defaults, state: "offline" })).toContain(
      "Gateway unavailable",
    );

    expect(operations?.controls.map(({ id }) => id)).toEqual(["view", "state", "navigation"]);
    expect(operations?.markup({ ...operations.defaults, view: "automation" })).toContain(
      "Automations",
    );

    expect(workspace?.controls.map(({ id }) => id)).toEqual([
      "dock",
      "status",
      "model",
      "picker",
      "thinking",
      "fast",
      "voice",
      "camera",
    ]);
    expect(workspace?.markup({ ...workspace.defaults, dock: "bottom" })).toContain(
      'data-dock="bottom"',
    );
    expect(workspace?.markup({ ...workspace.defaults, dock: "bottom" })).toContain(
      'data-inspector="true"',
    );
    expect(workspace?.markup({ ...workspace.defaults, dock: "hidden" })).toContain(
      'data-inspector="false"',
    );
    expect(
      workspace?.markup({
        ...workspace.defaults,
        model: "anthropic/claude-opus-4-8",
        picker: true,
      }),
    ).toContain('class="oc-model-picker" data-workbench-model-picker open');

    expect(sessions?.controls.map(({ id }) => id)).toEqual(["state", "navigation"]);
    expect(sessions?.markup({ ...sessions.defaults, state: "loading" })).toContain(
      "Loading sessions",
    );
    expect(sessions?.markup({ ...sessions.defaults, state: "empty" })).toContain(
      "No sessions found",
    );
    expect(sessions?.markup({ ...sessions.defaults, state: "error" })).toContain(
      "Could not load sessions",
    );

    expect(quickChat?.controls.map(({ id }) => id)).toEqual([
      "status",
      "model",
      "picker",
      "thinking",
      "fast",
    ]);
    expect(quickChat?.markup({ ...quickChat.defaults, status: "active" })).toContain(
      'data-state="active"',
    );

    const createButton = (dataset = {}, attributes = {}) =>
      Object.assign(new EventTarget(), {
        dataset,
        getAttribute: (name) => attributes[name] ?? null,
        setAttribute: (name, value) => {
          attributes[name] = value;
        },
      });

    const operationsNavigation = createButton();
    const automationView = createButton({ workbenchApplicationView: "automation" });
    const operationsUpdates = [];
    operations?.bind?.(
      {
        querySelector: (selector) =>
          selector === "[data-workbench-application-navigation]" ? operationsNavigation : null,
        querySelectorAll: (selector) =>
          selector === "[data-workbench-application-view]" ? [automationView] : [],
      },
      operations.defaults,
      (id, value) => operationsUpdates.push([id, value]),
    );
    operationsNavigation.dispatchEvent(new Event("click"));
    automationView.dispatchEvent(new Event("click"));
    expect(operationsUpdates).toEqual([
      ["navigation", "compact"],
      ["view", "automation"],
    ]);

    const workspaceDock = createButton();
    const workspaceInspectorHide = createButton();
    const workspaceModel = createButton({
      workbenchApplicationModel: "anthropic/claude-opus-4-8",
    });
    workspaceModel.textContent = "Claude Opus 4.8 Anthropic";
    const grokModel = createButton({
      workbenchApplicationModel: "xai/grok-4",
    });
    grokModel.textContent = "Grok 4 xAI";
    const recentProvider = createButton(
      { workbenchModelProvider: "recent" },
      { "aria-pressed": "true" },
    );
    const anthropicProvider = createButton(
      { workbenchModelProvider: "anthropic" },
      { "aria-pressed": "false" },
    );
    const workspaceSearch = Object.assign(new EventTarget(), { value: "" });
    const workspacePicker = Object.assign(new EventTarget(), { open: false });
    const workspaceThinking = Object.assign(
      createButton({ thinkingValues: "auto,low,medium,high,xhigh" }),
      {
        value: "2",
        style: { setProperty() {} },
      },
    );
    const workspaceFast = createButton({}, { "aria-checked": "true" });
    const workspaceUpdates = [];
    const workspaceState = { ...workspace.defaults };
    workspace?.bind?.(
      {
        querySelector: (selector) =>
          ({
            "[data-workbench-application-dock]": workspaceDock,
            "[data-workbench-application-inspector-hide]": workspaceInspectorHide,
            "[data-workbench-model-search]": workspaceSearch,
            "[data-workbench-model-picker]": workspacePicker,
            "[data-workbench-model-thinking]": workspaceThinking,
            "[data-workbench-model-fast]": workspaceFast,
          })[selector] ?? null,
        querySelectorAll: (selector) => {
          if (selector === "[data-workbench-application-model]") {
            return [workspaceModel, grokModel];
          }
          if (selector === "[data-workbench-model-provider]") {
            return [recentProvider, anthropicProvider];
          }
          return [];
        },
      },
      workspaceState,
      (id, value) => {
        workspaceState[id] = value;
        workspaceUpdates.push([id, value]);
      },
    );
    expect(workspaceModel.hidden).toBe(false);
    expect(grokModel.hidden).toBe(true);
    workspaceDock.dispatchEvent(new Event("click"));
    workspaceInspectorHide.dispatchEvent(new Event("click"));
    anthropicProvider.dispatchEvent(new Event("click"));
    workspaceSearch.value = "claude";
    workspaceSearch.dispatchEvent(new Event("input"));
    workspaceModel.dispatchEvent(new Event("click"));
    workspacePicker.open = true;
    workspacePicker.dispatchEvent(new Event("toggle"));
    workspaceThinking.dispatchEvent(new Event("change"));
    workspaceFast.dispatchEvent(new Event("click"));
    expect(workspaceUpdates).toEqual([
      ["dock", "bottom"],
      ["dock", "hidden"],
      ["modelProvider", "anthropic"],
      ["modelQuery", "claude"],
      ["model", "anthropic/claude-opus-4-8"],
      ["picker", true],
      ["thinking", "medium"],
    ]);
    // Claude Opus has no fast mode: selecting it disables the toggle, so the
    // click above must not emit a fast update.
    expect(workspaceFast.disabled).toBe(true);
    const rerenderedWorkspace = workspace?.markup(workspaceState) ?? "";
    expect(rerenderedWorkspace).toContain(
      'aria-pressed="true" data-workbench-model-provider="anthropic"',
    );
    expect(rerenderedWorkspace).toContain('value="claude" data-workbench-model-search');

    const hiddenWorkspaceDock = createButton();
    const hiddenWorkspaceUpdates = [];
    workspace?.bind?.(
      {
        querySelector: (selector) =>
          selector === "[data-workbench-application-dock]" ? hiddenWorkspaceDock : null,
        querySelectorAll: () => [],
      },
      { ...workspace.defaults, dock: "hidden" },
      (id, value) => hiddenWorkspaceUpdates.push([id, value]),
    );
    hiddenWorkspaceDock.dispatchEvent(new Event("click"));
    expect(hiddenWorkspaceUpdates).toEqual([["dock", "right"]]);

    expect(getReferenceContent("application-operations")).toContain(
      '&lt;section class="oc-pane oc-master-detail"&gt;',
    );
    expect(getReferenceContent("application-settings")).toContain(
      '&lt;label class="oc-switch-label"&gt;',
    );
    expect(getReferenceContent("application-settings")).toContain(
      "&lt;span&gt;Automatic updates&lt;/span&gt;",
    );
    expect(getReferenceContent("application-workspace")).toContain(
      '&lt;div class="oc-chat-shell" data-dock="right" data-inspector="true"&gt;',
    );
    expect(getReferenceContent("application-workspace")).toContain(
      '&lt;div class="oc-model-controls"&gt;',
    );
    expect(getReferenceContent("application-workspace")).toContain(
      '&lt;footer class="oc-workspace-composer"&gt;',
    );
    expect(getReferenceContent("application-sessions")).toContain(
      '&lt;table class="oc-table oc-session-table"&gt;',
    );
    expect(getReferenceContent("application-quick-chat")).toContain(
      '&lt;section class="oc-quick-chat" data-state="idle"&gt;',
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
  test("keeps Flow geometry canonical across horizontal and vertical specimens", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const labCss = await readFile("preview/lab.css", "utf8");

    expect(labCss).toContain("--oc-flow-connector-gap: 2.5rem;");
    expect(labCss).toContain("grid-template-columns: repeat(3, minmax(8rem, 1fr));");
    expect(labCss).toContain("background-attachment: local, local, scroll, scroll;");
    expect(labCss).toContain("background-size:\n    2rem 100%,");
    expect(labCss).toContain('.oc-flow[data-orientation="vertical"]');
    expect(labCss).toContain("left: calc(var(--oc-flow-marker-size) / 2);");
    expect(labCss).toContain(".oc-flow-step[aria-current=\"step\"] .oc-flow-marker::after");
    expect(css).not.toContain(".component-workbench-frame .oc-flow-list {");
    expect(css).not.toContain(".component-workbench-frame .oc-flow-step:not(:last-child)::after");
  });
  test("anchors disclosure motion and scopes Meter sheen to its track", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const labCss = await readFile("preview/lab.css", "utf8");

    expect(css).toContain(
      'body[data-preview-page="primitive-collapsible"] .component-workbench-canvas',
    );
    expect(css).toContain("place-items: start center;");
    expect(labCss).toContain("transition-behavior: allow-discrete;");
    expect(labCss).toContain(
      '.oc-meter[data-state="active"][data-effect="sheen"] .oc-meter-track::after',
    );
    expect(labCss).not.toContain("bottom: 1.6rem;");
  });
  test("models Collapsible, Flow, and Meter workbench states", () => {
    expect(getWorkbenchDefinition("primitive-collapsible")?.controls).toMatchObject([
      { id: "open", type: "toggle" },
    ]);
    expect(getWorkbenchDefinition("primitive-flow")?.controls).toMatchObject([
      {
        id: "orientation",
        type: "choice",
        options: [
          { label: "Horizontal", value: "horizontal" },
          { label: "Vertical", value: "vertical" },
        ],
      },
    ]);
    expect(getWorkbenchDefinition("primitive-meter")?.controls).toMatchObject([
      {
        id: "value",
        type: "choice",
        options: [
          { label: "Low", value: "24" },
          { label: "Balanced", value: "64" },
          { label: "Ready", value: "82" },
        ],
      },
      { id: "active", type: "toggle" },
    ]);
  });
  test("publishes transition effects with a static reduced-motion outcome", async () => {
    const css = await readFile("preview/preview.css", "utf8");
    const effects = getReferenceContent("effects");
    const transition = getReferenceContent("effect-transition");

    expect(effects).toContain('href="./transition/"');
    expect(transition).toContain('class="effect-transition-demo"');
    expect(transition).toContain('role="group" aria-label="Task state transition"');
    expect(transition).toContain('data-state="current"');
    expect(transition).toContain('<p class="eyebrow">Semantics</p>');
    expect(transition).toContain('&lt;div role="status" aria-live="polite"&gt;');
    expect(css).toContain("@keyframes effect-transition-enter");
    expect(css).toContain('.effect-transition-state[data-state="current"] {\n    animation: none;');
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
  test("adapts application specimens to simulated workbench viewports", async () => {
    const css = await readFile("preview/lab.css", "utf8");
    const workbench = await readFile("preview/component-workbench.js", "utf8");

    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="tablet"] .oc-summary-strip {\n  grid-template-columns: repeat(2, minmax(0, 1fr));',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="tablet"] .oc-workspace-inspector-action {\n  display: none;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-settings-navigation-list {\n  display: flex;\n  overflow-x: auto;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-settings-navigation-item {\n  width: max-content;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-identity-panel {\n  grid-template-columns: auto minmax(0, 1fr);',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-identity-meta {\n  grid-column: 1 / -1;\n  justify-content: flex-start;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-workspace-sessions {\n  grid-row: auto;\n  max-height: 15rem;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"]\n  .oc-app-frame[data-dock="bottom"][data-inspector="true"]\n  .oc-workspace-sessions {\n  grid-row: auto;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-workspace-inspector-action {\n  display: none;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"]\n  :is(.oc-chat-shell, .oc-quick-chat-stage) {\n  position: relative;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-model-picker {\n  position: static;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-model-menu {\n  position: absolute;',
    );
    expect(css).toContain(
      '.component-workbench-canvas[data-viewport="mobile"] .oc-session-cell {\n  min-width: 0;',
    );
    expect(workbench).toContain('createElement("div", "component-workbench-header-actions")');
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
});
