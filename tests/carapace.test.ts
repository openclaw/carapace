import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { transform } from "lightningcss";
import { compile } from "tailwindcss";

async function listCssFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return listCssFiles(path);
      return entry.name.endsWith(".css") ? [path] : [];
    }),
  );
  return files.flat();
}

function customProperties(source: string, pattern: RegExp) {
  return new Set([...source.matchAll(pattern)].map((match) => match[1]));
}

function componentClasses(source: string) {
  return new Set([...source.matchAll(/\.(oc-[a-z0-9-]+)/g)].map((match) => `.${match[1]}`));
}

function expectClasses(source: string, expected: string[]) {
  expect([...componentClasses(source)].sort()).toEqual([...expected].sort());
}

function ruleDeclarations(source: string, selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

describe("CSS contract", () => {
  test("every distributed stylesheet parses", async () => {
    for (const path of await listCssFiles("styles")) {
      const source = await readFile(path);
      expect(() =>
        transform({
          code: source,
          filename: path,
          minify: false,
        }),
      ).not.toThrow();
    }
  });

  test("all canonical variable references are defined", async () => {
    const sources = await Promise.all(
      (await listCssFiles("styles")).map((path) => readFile(path, "utf8")),
    );
    const combined = sources.join("\n");
    const definitions = customProperties(combined, /(--oc-[\w-]+)\s*:/g);
    const references = customProperties(combined, /var\((--oc-[\w-]+)/g);

    expect([...references].filter((name) => !definitions.has(name))).toEqual([]);
  });

  test("the required semantic theme contract exists", async () => {
    const themes = await readFile("styles/themes.css", "utf8");
    for (const variable of [
      "--oc-bg-page",
      "--oc-bg-surface",
      "--oc-bg-elevated",
      "--oc-bg-recessed",
      "--oc-bg-contrast",
      "--oc-accent-primary",
      "--oc-accent-secondary",
      "--oc-text-primary",
      "--oc-text-secondary",
      "--oc-text-muted",
      "--oc-text-inactive",
      "--oc-text-inverse",
      "--oc-text-link",
      "--oc-text-on-accent",
      "--oc-border-subtle",
      "--oc-border-strong",
      "--oc-control-bg",
      "--oc-control-bg-hover",
      "--oc-focus-ring",
    ]) {
      expect(themes).toContain(`${variable}:`);
    }
    expect(themes).toContain('html[data-theme="light"]');
    expect(themes).toContain('html[data-theme="dark"]');
  });

  test("the evidence-backed control minimum remains additive", async () => {
    const tokens = await readFile("styles/tokens.css", "utf8");
    const controls = await readFile("styles/candidate/controls.css", "utf8");

    expect(tokens).toContain("--oc-control-min-height: 2.75rem;");
    expect(controls).toContain("min-height: var(--oc-control-min-height);");
    expect(controls).not.toContain("min-height: 2.75rem;");
  });

  test("keeps generic control hover boundaries neutral", async () => {
    const controls = await readFile("styles/candidate/controls.css", "utf8");

    for (const selector of [
      ".oc-input:hover:not(:disabled)",
      ".oc-checkbox:hover:not(:disabled)",
      ".oc-radio:hover:not(:disabled)",
      ".oc-switch:hover:not(:disabled)",
      ".oc-select:hover:not(:disabled)",
      ".oc-textarea:hover:not(:disabled)",
    ]) {
      const declarations = ruleDeclarations(controls, selector);
      expect(declarations).toContain("border-color: var(--oc-border-strong)");
      expect(declarations).not.toContain("var(--oc-border-accent)");
    }
  });

  test("the default component entry point contains only the stable floor", async () => {
    const components = await readFile("styles/components.css", "utf8");
    const references = customProperties(components, /var\((--[\w-]+)/g);

    expect([...references].filter((name) => !name.startsWith("--oc-"))).toEqual([]);
    expectClasses(components, [
      ".oc-app-surface",
      ".oc-hero",
      ".oc-hero-title",
      ".oc-hero-lede",
      ".oc-section",
      ".oc-section-header",
      ".oc-section-heading",
      ".oc-section-title",
      ".oc-section-copy",
      ".oc-eyebrow",
      ".oc-card",
      ".oc-card-interactive",
      ".oc-action",
      ".oc-action-primary",
      ".oc-action-secondary",
      ".oc-action-ghost",
      ".oc-action-icon",
      ".oc-segmented",
      ".oc-segmented-item",
      ".oc-pill",
    ]);

    expect(components).toContain("border-radius: var(--oc-radius-surface)");
    expect(components).toContain("border-radius: var(--oc-radius-control)");
    expect(components).toContain("border-radius: var(--oc-radius-inset)");
    expect(references).not.toContain("--oc-radius-full");
    expect(components).toContain('html[data-theme="light"] .oc-action-secondary');
    expect(components).toContain('html[data-theme-resolved="light"] .oc-action-secondary');
    expect(components).toContain("@media (prefers-reduced-motion: reduce)");
    expect(components).toContain("transform: none");
  });

  test("candidate entry points are isolated by responsibility", async () => {
    const controls = await readFile("styles/candidate/controls.css", "utf8");
    const feedback = await readFile("styles/candidate/feedback.css", "utf8");
    const data = await readFile("styles/candidate/data.css", "utf8");
    const application = await readFile("styles/candidate/application.css", "utf8");
    const agent = await readFile("styles/candidate/agent.css", "utf8");
    const lab = await readFile("preview/lab.css", "utf8");

    expectClasses(agent, [
      ".oc-activity-indicator",
      ".oc-activity-indicator-motion",
      ".oc-agent-icon",
      ".oc-approval-actions",
      ".oc-approval-card",
      ".oc-approval-command",
      ".oc-approval-header",
      ".oc-approval-meta",
      ".oc-approval-queue",
      ".oc-approval-queue-header",
      ".oc-approval-queue-item",
      ".oc-approval-resolution",
      ".oc-approval-sub",
      ".oc-approval-title",
      ".oc-approval-warning",
      ".oc-compaction",
      ".oc-json-collapse",
      ".oc-json-collapse-size",
      ".oc-tool-kv",
      ".oc-turn-recap",
      ".oc-work-group",
      ".oc-work-group-header",
    ]);

    expectClasses(controls, [
      ".oc-field",
      ".oc-field-label",
      ".oc-field-message",
      ".oc-input",
      ".oc-check",
      ".oc-checkbox",
      ".oc-radio",
      ".oc-radio-group",
      ".oc-radio-option",
      ".oc-switch",
      ".oc-switch-label",
      ".oc-select",
      ".oc-select-wrap",
      ".oc-textarea",
      ".oc-label",
      ".oc-label-required",
      ".oc-label-optional",
      ".oc-label-description",
    ]);
    expectClasses(feedback, [
      ".oc-badge",
      ".oc-badge-error",
      ".oc-badge-info",
      ".oc-badge-neutral",
      ".oc-badge-success",
      ".oc-badge-warning",
      ".oc-banner",
      ".oc-banner-action",
      ".oc-banner-content",
      ".oc-banner-dismiss",
      ".oc-banner-error",
      ".oc-banner-indicator",
      ".oc-banner-info",
      ".oc-banner-success",
      ".oc-banner-title",
      ".oc-banner-warning",
      ".oc-empty",
      ".oc-empty-actions",
      ".oc-empty-content",
      ".oc-empty-description",
      ".oc-empty-icon",
      ".oc-empty-title",
      ".oc-loader",
      ".oc-loader-lg",
      ".oc-loader-sm",
      ".oc-loader-spinner",
      ".oc-skeleton-line",
      ".oc-skeleton-line-short",
    ]);
    expectClasses(data, [
      ".oc-code-block",
      ".oc-code-block-copy",
      ".oc-code-block-header",
      ".oc-resource-list",
      ".oc-resource-list-arrow",
      ".oc-resource-list-content",
      ".oc-resource-list-description",
      ".oc-resource-list-item",
      ".oc-resource-list-link",
      ".oc-resource-list-meta",
      ".oc-resource-list-title",
      ".oc-search-field",
      ".oc-table",
      ".oc-table-bulk-actions",
      ".oc-table-bulk-bar",
      ".oc-table-bulk-count",
      ".oc-table-empty-cell",
      ".oc-table-expand",
      ".oc-table-expander",
      ".oc-table-expansion",
      ".oc-table-filter-add",
      ".oc-table-filter-chip",
      ".oc-table-filters",
      ".oc-table-footer",
      ".oc-table-interactive",
      ".oc-table-shell",
      ".oc-table-sort",
      ".oc-table-sort-icon",
      ".oc-table-toolbar",
      ".oc-table-wrap",
    ]);
    expectClasses(application, [
      ".oc-action",
      ".oc-activity-copy",
      ".oc-activity-item",
      ".oc-activity-list",
      ".oc-activity-marker",
      ".oc-agent-attributed-message",
      ".oc-agent-chat",
      ".oc-agent-collaboration",
      ".oc-agent-collaboration-facepile",
      ".oc-agent-collaboration-presence",
      ".oc-agent-collaboration-stream",
      ".oc-agent-collaboration-summary",
      ".oc-agent-interactive-artifact",
      ".oc-agent-interactive-artifact-thumb",
      ".oc-agent-interactive-facts",
      ".oc-agent-interactive-header",
      ".oc-agent-interactive-preview",
      ".oc-agent-interactive-preview-brand",
      ".oc-agent-interactive-preview-content",
      ".oc-agent-interactive-preview-sidebar",
      ".oc-agent-interactive-preview-thread",
      ".oc-agent-interactive-state",
      ".oc-agent-interactive-tool",
      ".oc-agent-interactive-tool-row",
      ".oc-agent-message-author",
      ".oc-agent-message-bubble",
      ".oc-agent-message-content",
      ".oc-agent-message-list",
      ".oc-agent-message-list-content",
      ".oc-agent-message-role",
      ".oc-app-content",
      ".oc-app-frame",
      ".oc-app-main",
      ".oc-app-navigation",
      ".oc-app-navigation-body",
      ".oc-app-navigation-brand",
      ".oc-app-navigation-collapse",
      ".oc-app-navigation-context",
      ".oc-app-navigation-context-chevron",
      ".oc-app-navigation-context-copy",
      ".oc-app-navigation-context-icon",
      ".oc-app-navigation-footer",
      ".oc-app-navigation-footer-copy",
      ".oc-app-navigation-header",
      ".oc-app-navigation-icon",
      ".oc-app-navigation-item",
      ".oc-app-navigation-item-label",
      ".oc-app-navigation-label",
      ".oc-app-navigation-list",
      ".oc-app-navigation-meta",
      ".oc-app-navigation-presence",
      ".oc-app-navigation-section",
      ".oc-app-navigation-title",
      ".oc-app-resource-list",
      ".oc-app-resource-list-copy",
      ".oc-app-resource-list-icon",
      ".oc-app-resource-list-item",
      ".oc-app-resource-list-meta",
      ".oc-app-resource-search",
      ".oc-avatar",
      ".oc-avatar-fallback",
      ".oc-avatar-image",
      ".oc-avatar-lg",
      ".oc-avatar-overflow",
      ".oc-avatar-pixel",
      ".oc-avatar-sm",
      ".oc-avatar-stack",
      ".oc-avatar-xs",
      ".oc-badge",
      ".oc-brand-banner",
      ".oc-brand-banner-art",
      ".oc-brand-banner-content",
      ".oc-chat-shell",
      ".oc-command-palette",
      ".oc-command-palette-empty",
      ".oc-command-palette-footer",
      ".oc-command-palette-group-label",
      ".oc-command-palette-item",
      ".oc-command-palette-item-icon",
      ".oc-command-palette-item-keys",
      ".oc-command-palette-item-label",
      ".oc-command-palette-list",
      ".oc-command-palette-results",
      ".oc-command-palette-search",
      ".oc-command-palette-search-icon",
      ".oc-command-palette-status",
      ".oc-composer-camera-person",
      ".oc-composer-camera-preview",
      ".oc-composer-camera-toggle",
      ".oc-composer-dictation-status",
      ".oc-composer-primary-actions",
      ".oc-composer-primary-button",
      ".oc-composer-tool",
      ".oc-composer-voice-bars",
      ".oc-composer-voice-live",
      ".oc-connect",
      ".oc-connect-alternative",
      ".oc-connect-code",
      ".oc-connect-copy",
      ".oc-connect-qr",
      ".oc-connect-title",
      ".oc-context-usage",
      ".oc-detail-grid",
      ".oc-detail-grid-span",
      ".oc-detail-header",
      ".oc-detail-section",
      ".oc-detail-section-icon",
      ".oc-field",
      ".oc-hovercard",
      ".oc-hovercard-copy",
      ".oc-hovercard-facts",
      ".oc-hovercard-header",
      ".oc-hovercard-identity",
      ".oc-hovercard-meta",
      ".oc-hovercard-title",
      ".oc-inspector-activity",
      ".oc-inspector-facts",
      ".oc-inspector-files",
      ".oc-inspector-meter",
      ".oc-inspector-scroll",
      ".oc-inspector-section",
      ".oc-lightbox",
      ".oc-lightbox-actions",
      ".oc-lightbox-header",
      ".oc-lightbox-stage",
      ".oc-log-level",
      ".oc-log-message",
      ".oc-log-row",
      ".oc-log-stream",
      ".oc-log-subsystem",
      ".oc-log-time",
      ".oc-master-detail",
      ".oc-master-pane",
      ".oc-menu-panel",
      ".oc-menu-panel-copy",
      ".oc-menu-panel-footer",
      ".oc-menu-panel-header",
      ".oc-menu-panel-item",
      ".oc-menu-panel-list",
      ".oc-menu-panel-usage",
      ".oc-menu-panel-usage-label",
      ".oc-menu-panel-usage-row",
      ".oc-menu-panel-usage-value",
      ".oc-model-check",
      ".oc-model-controls",
      ".oc-model-menu",
      ".oc-model-menu-footer",
      ".oc-model-menu-layout",
      ".oc-model-menu-settings",
      ".oc-model-option",
      ".oc-model-option-copy",
      ".oc-model-option-provider",
      ".oc-model-options",
      ".oc-model-picker",
      ".oc-model-provider-mark",
      ".oc-model-providers",
      ".oc-model-reasoning-control",
      ".oc-model-reasoning-dot",
      ".oc-model-reasoning-dot-default",
      ".oc-model-reasoning-dots",
      ".oc-model-reasoning-range",
      ".oc-model-reasoning-row",
      ".oc-model-reasoning-stop",
      ".oc-model-reasoning-stops",
      ".oc-model-search",
      ".oc-model-setting-heading",
      ".oc-model-setting-reset",
      ".oc-model-setting-row",
      ".oc-model-speed-row",
      ".oc-model-speed-toggle",
      ".oc-model-trigger",
      ".oc-option-card",
      ".oc-option-card-copy",
      ".oc-option-card-icon",
      ".oc-option-card-meta",
      ".oc-option-card-thumb",
      ".oc-option-group",
      ".oc-owner-chip",
      ".oc-page-header",
      ".oc-page-header-actions",
      ".oc-page-header-compact",
      ".oc-page-header-content",
      ".oc-page-header-description",
      ".oc-page-header-kicker",
      ".oc-page-header-summary",
      ".oc-page-header-title",
      ".oc-pane",
      ".oc-pane-actions",
      ".oc-pane-body",
      ".oc-pane-body-flush",
      ".oc-pane-description",
      ".oc-pane-header",
      ".oc-pane-header-identity",
      ".oc-pane-heading",
      ".oc-pane-identity-icon",
      ".oc-pane-state",
      ".oc-pane-title",
      ".oc-pane-title-row",
      ".oc-panel-tab",
      ".oc-panel-tab-close",
      ".oc-panel-tab-strip",
      ".oc-quick-chat",
      ".oc-quick-chat-action",
      ".oc-quick-chat-agent",
      ".oc-quick-chat-composer",
      ".oc-quick-chat-context",
      ".oc-quick-chat-header",
      ".oc-quick-chat-input-row",
      ".oc-quick-chat-reply",
      ".oc-quick-chat-send",
      ".oc-quick-chat-stage",
      ".oc-quick-chat-toolbar",
      ".oc-run-spinner",
      ".oc-search-field",
      ".oc-segmented",
      ".oc-select-wrap",
      ".oc-session-badges",
      ".oc-session-cell",
      ".oc-session-cell-owner-muted",
      ".oc-session-cell-title",
      ".oc-session-content",
      ".oc-session-list",
      ".oc-session-list-avatar",
      ".oc-session-list-copy",
      ".oc-session-list-item",
      ".oc-session-table",
      ".oc-session-table-wrap",
      ".oc-session-toolbar",
      ".oc-settings-detail",
      ".oc-settings-detail-scroll",
      ".oc-settings-group",
      ".oc-settings-inline-actions",
      ".oc-settings-navigation",
      ".oc-settings-navigation-footer",
      ".oc-settings-navigation-header",
      ".oc-settings-navigation-icon",
      ".oc-settings-navigation-item",
      ".oc-settings-navigation-kicker",
      ".oc-settings-navigation-list",
      ".oc-settings-row",
      ".oc-settings-row-content",
      ".oc-settings-row-control",
      ".oc-settings-row-description",
      ".oc-settings-row-stacked",
      ".oc-settings-row-title",
      ".oc-settings-search",
      ".oc-settings-section",
      ".oc-settings-section-header",
      ".oc-settings-section-heading",
      ".oc-settings-section-title",
      ".oc-settings-shell",
      ".oc-split",
      ".oc-split-divider",
      ".oc-split-pane",
      ".oc-split-pane-body",
      ".oc-status",
      ".oc-status-error",
      ".oc-status-indicator",
      ".oc-status-info",
      ".oc-status-label",
      ".oc-status-success",
      ".oc-status-warning",
      ".oc-summary-metric",
      ".oc-summary-metric-copy",
      ".oc-summary-metric-icon",
      ".oc-summary-strip",
      ".oc-unread-dot",
      ".oc-workspace-compose-actions",
      ".oc-workspace-compose-box",
      ".oc-workspace-compose-toolbar",
      ".oc-workspace-composer",
      ".oc-workspace-conversation",
      ".oc-workspace-grid",
      ".oc-workspace-inspector",
      ".oc-workspace-inspector-action",
      ".oc-workspace-progress",
      ".oc-workspace-sessions",
      ".oc-workspace-sessions-footer",
      ".oc-workspace-transcript",
    ]);

    for (const candidate of [controls, feedback, data, application]) {
      expect(candidate).not.toContain("@import");
      expect(
        [...customProperties(candidate, /var\((--[\w-]+)/g)].every((name) =>
          name.startsWith("--oc-"),
        ),
      ).toBe(true);
    }
  });

  test("candidate behavior includes native states and accessibility fallbacks", async () => {
    const controls = await readFile("styles/candidate/controls.css", "utf8");
    const feedback = await readFile("styles/candidate/feedback.css", "utf8");
    const data = await readFile("styles/candidate/data.css", "utf8");
    const application = await readFile("styles/candidate/application.css", "utf8");
    const lab = await readFile("preview/lab.css", "utf8");

    expect(controls).toMatch(/\.oc-input\[aria-invalid="true"\][\s\S]*?--oc-status-error-fg/);
    expect(controls).toMatch(/\.oc-checkbox:indeterminate[\s\S]*?--oc-accent-primary/);
    expect(controls).toMatch(/@media \(forced-colors: active\)[\s\S]*?appearance: auto/);
    expect(controls).toMatch(/\.oc-switch:checked[\s\S]*?--oc-accent-primary/);
    expect(feedback).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation: none/);
    expect(data).toMatch(/\.oc-table-wrap[\s\S]*?overflow-x: auto/);
    expect(data).toMatch(/\.oc-resource-list-link:focus-visible[\s\S]*?--oc-focus-ring/);
    expect(application).toMatch(/\.oc-app-navigation-item:focus-visible[\s\S]*?--oc-focus-ring/);
    expect(application).toMatch(
      /\.oc-app-resource-search:focus-within[\s\S]*?--oc-input-focus-ring/,
    );
    expect(application).toMatch(/\.oc-settings-search:focus-within[\s\S]*?--oc-input-focus-ring/);
    expect(application).toMatch(
      /\.oc-avatar\[data-state="speaking"\]::after[\s\S]*?z-index: 2[\s\S]*?pointer-events: none/,
    );
    expect(application).toMatch(
      /@media \(max-width: 48rem\)[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/,
    );
    expect(application).not.toMatch(
      /\.oc-app-navigation-section:not\(:first-child\)[\s\S]*?display: none/,
    );
    expect(application).toMatch(
      /data-navigation="compact"[\s\S]*?\.oc-app-navigation-item-label[\s\S]*?clip-path: inset\(50%\)/,
    );
    expect(application).toContain('.oc-model-providers button[aria-pressed="true"]');
    expect(application).toContain('.oc-model-option[aria-pressed="true"]');
    expect(application).not.toContain('.oc-model-option[aria-selected="true"]');
    expect(application).toMatch(
      /\.oc-app-content > :is\(\.oc-settings-shell, \.oc-workspace-grid\)[\s\S]*?grid-row: 1 \/ -1/,
    );
    expect(application).toMatch(
      /\.oc-master-detail \{[\s\S]*?grid-template-rows: minmax\(0, 1fr\)/,
    );
    expect(application).toMatch(
      /\.oc-app-navigation \{[\s\S]*?grid-template-rows: auto auto minmax\(0, 1fr\) auto/,
    );
    expect(application).toMatch(
      /\.oc-master-pane \{[\s\S]*?grid-template-rows: auto auto minmax\(0, 1fr\)/,
    );
    expect(application).toMatch(/\.oc-settings-shell\[data-density="compact"\] \.oc-settings-row/);
    expect(ruleDeclarations(application, ".oc-settings-detail-scroll")).toContain(
      "box-sizing: border-box",
    );
    expect(application).toMatch(/\.oc-app-frame\[data-inspector="false"\] \.oc-workspace-grid/);
    expect(application).toMatch(
      /\.oc-app-frame\[data-dock="bottom"\]\[data-inspector="true"\] \.oc-workspace-grid/,
    );
    expect(application).not.toMatch(
      /\.oc-app-frame\[data-dock="bottom"\](?!\[data-inspector="true"\])/,
    );
    expect(application).not.toContain(".application-workspace");
    expect(application).toContain(".oc-workspace-composer");
    expect(lab).not.toContain(".oc-workspace-composer");
    const viewportContract = application.slice(
      application.indexOf("/* Viewport-safe application contract */"),
    );
    expect(viewportContract).toMatch(
      /:is\(\.oc-app-frame, \.oc-chat-shell, \.oc-settings-shell, \.oc-quick-chat-stage\)[\s\S]*?min-height: 0/,
    );
    expect(ruleDeclarations(viewportContract, ".oc-quick-chat-stage")).toContain("height: auto");
    expect(ruleDeclarations(viewportContract, ".oc-quick-chat-stage")).toContain("min-height: 0");
    expect(ruleDeclarations(application, ".oc-quick-chat-input-row .oc-model-menu")).toContain(
      "top: calc(100% + var(--oc-space-2))",
    );
    expect(ruleDeclarations(application, ".oc-quick-chat-input-row .oc-model-menu")).toContain(
      "bottom: auto",
    );
    expect(application).toContain("td:not([colspan])");
    expect(ruleDeclarations(application, ".oc-workspace-compose-box")).toContain(
      "overflow: visible",
    );
    expect(application).not.toMatch(/(?:^|\n)\.oc-resource-(?:list|search)/);
    expect(application).toMatch(/\.oc-master-detail > \.oc-pane \{[\s\S]*?border-width: 0/);
    expect(application).toMatch(
      /@media \(max-width: 48rem\)[\s\S]*?\.oc-master-detail > \.oc-pane \{[\s\S]*?min-height: 0/,
    );
    expect(application).toMatch(
      /@media \(max-width: 48rem\)[\s\S]*?grid-template-columns: 1\.25rem minmax\(0, 1fr\) auto/,
    );
    expect(application).toMatch(
      /@media \(max-width: 48rem\)[\s\S]*?\.oc-settings-navigation-list \{[\s\S]*?overflow-x: auto/,
    );
    expect(application).toMatch(
      /@media \(max-width: 48rem\)[\s\S]*?\.oc-app-frame\[data-dock="bottom"\]\[data-inspector="true"\] \.oc-workspace-sessions[\s\S]*?grid-row: auto/,
    );
    expect(application).toMatch(
      /@media \(max-width: 48rem\)[\s\S]*?\.oc-chat-shell\[data-dock="bottom"\]\[data-inspector="true"\] \.oc-workspace-sessions[\s\S]*?grid-row: auto/,
    );
    expect(application).toMatch(
      /@media \(max-width: 34rem\)[\s\S]*?\.oc-chat-shell\[data-dock="bottom"\]\[data-inspector="true"\] \.oc-workspace-grid[\s\S]*?grid-template-rows: minmax\(0, 1fr\)/,
    );
    expect(application).toMatch(
      /@media \(max-width: 34rem\)[\s\S]*?\.oc-master-detail \{[\s\S]*?grid-template-rows: minmax\(10rem, 0\.4fr\) minmax\(0, 1fr\)/,
    );
    expect(application).not.toMatch(
      /@media \(max-width: 34rem\)[\s\S]*?\.oc-fast-mode \{[\s\S]*?display: none/,
    );
    expect(application).toMatch(
      /@media \(max-width: 34rem\)[\s\S]*?\.oc-quick-chat-input-row \{[\s\S]*?grid-template-columns: auto auto minmax\(0, 1fr\) auto auto/,
    );
    expect(application).toMatch(
      /@media \(max-width: 34rem\)[\s\S]*?\.oc-quick-chat-input-row \[data-compact-hide\] \{[\s\S]*?display: none/,
    );
    expect(application).toMatch(
      /@media \(max-width: 64rem\)[\s\S]*?\.oc-workspace-inspector-action \{[\s\S]*?display: none/,
    );
    expect(application).toMatch(/@media \(forced-colors: active\)[\s\S]*?Highlight/);

    for (const selector of [
      ".oc-input",
      ".oc-checkbox",
      ".oc-radio",
      ".oc-switch",
      ".oc-select",
      ".oc-textarea",
    ]) {
      expect(ruleDeclarations(controls, selector)).toContain("box-sizing: border-box");
    }

    for (const selector of [".oc-badge", ".oc-banner", ".oc-empty"]) {
      expect(ruleDeclarations(feedback, selector)).toContain("box-sizing: border-box");
    }

    expect(ruleDeclarations(feedback, ".oc-empty-description")).toContain("text-wrap: pretty");

    for (const selector of [".oc-table-wrap", ".oc-table", ".oc-resource-list"]) {
      expect(ruleDeclarations(data, selector)).toContain("box-sizing: border-box");
    }

    for (const selector of [".oc-app-frame", ".oc-page-header", ".oc-pane", ".oc-settings-row"]) {
      expect(ruleDeclarations(application, selector)).toContain("box-sizing: border-box");
    }

    expect(data).toMatch(/\.oc-table-interactive tbody tr:is\(:hover, :focus-within\)/);
  });

  test("the default import graph cannot load candidates or lab styles", async () => {
    const aggregate = await readFile("styles/styles.css", "utf8");
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    const lab = await readFile("preview/lab.css", "utf8");

    expect(
      aggregate
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    ).toEqual([
      '@import "./tokens.css";',
      '@import "./themes.css";',
      '@import "./typography.css";',
      '@import "./base.css";',
      '@import "./components.css";',
    ]);
    expect(aggregate).not.toContain("candidate/");
    expect(aggregate).not.toContain("lab.css");
    expect(Object.values(packageJson.exports)).not.toContain("./preview/lab.css");
    expect(lab).toContain(".oc-agent-chat");
    expect(lab).not.toContain(".oc-command-palette");
    expect(await readFile("styles/candidate/application.css", "utf8")).toContain(
      ".oc-command-palette",
    );
    expect(lab).toContain(".oc-chart");
  });

  test("ClawHub compatibility covers explicit and system light modes", async () => {
    const compatibility = await readFile("styles/compat/clawhub.css", "utf8");
    expect(compatibility).toContain('[data-theme-family="claw"][data-theme-resolved="light"]');
    expect(compatibility).toContain('[data-theme-family="claw"][data-theme-mode="system"]');
    expect(compatibility).toContain("--ink-muted:");
  });

  test("the Tailwind dark variant compiles to OpenClaw theme selectors", async () => {
    const adapter = await readFile("styles/tailwind.css", "utf8");
    const compiler = await compile(`${adapter}\n@tailwind utilities;`);
    const output = compiler.build(["dark:bg-bg"]);

    expect(output).toContain('html[data-theme="dark"]');
    expect(output).toContain('[data-theme-resolved="dark"]');
    expect(output).toContain(".dark\\:bg-bg");
  });

  test("the release does not include restricted binary assets", async () => {
    const forbiddenExtensions = /\.(otf|ttf|woff2?|png|jpe?g|gif|webp|avif)$/i;
    const files = await readdir(".", { recursive: true });
    expect(
      files.filter(
        (path) =>
          !path.startsWith(".git/") &&
          !path.startsWith("node_modules/") &&
          !path.startsWith("dist/") &&
          path !== "preview/assets/openclaw-mark.png" &&
          path !== "preview/assets/openclaw-mark-hover.png" &&
          path !== "preview/assets/user-vincentkoc.png" &&
          path !== "preview/assets/user-steipete.png" &&
          path !== "preview/assets/carapace-home-artwork.avif" &&
          path !== "preview/public/carapace-og.png" &&
          forbiddenExtensions.test(path),
      ),
    ).toEqual([]);
  });
});
