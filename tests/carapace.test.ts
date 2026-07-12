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
      "--oc-accent-primary",
      "--oc-accent-secondary",
      "--oc-text-primary",
      "--oc-text-secondary",
      "--oc-text-muted",
      "--oc-text-on-accent",
      "--oc-border-subtle",
      "--oc-focus-ring",
    ]) {
      expect(themes).toContain(`${variable}:`);
    }
    expect(themes).toContain('html[data-theme="light"]');
    expect(themes).toContain('html[data-theme="dark"]');
  });

  test("shared component primitives only consume canonical tokens", async () => {
    const components = await readFile("styles/components.css", "utf8");
    const references = customProperties(components, /var\((--[\w-]+)/g);

    expect([...references].filter((name) => !name.startsWith("--oc-"))).toEqual([]);
    for (const className of [
      ".oc-app-surface",
      ".oc-hero",
      ".oc-section-header",
      ".oc-card",
      ".oc-action",
      ".oc-segmented",
      ".oc-input",
      ".oc-checkbox",
      ".oc-radio",
      ".oc-switch",
      ".oc-select",
      ".oc-textarea",
      ".oc-label",
      ".oc-input-group",
      ".oc-sensitive-input",
      ".oc-autocomplete",
      ".oc-badge",
      ".oc-banner",
      ".oc-breadcrumbs",
      ".oc-button",
      ".oc-clipboard-text",
      ".oc-code-highlighted",
      ".oc-collapsible",
      ".oc-combobox",
      ".oc-command-palette",
      ".oc-date-picker",
      ".oc-dialog",
      ".oc-dropdown",
      ".oc-empty",
      ".oc-flow",
      ".oc-grid",
      ".oc-layer-card",
      ".oc-link",
      ".oc-loader",
      ".oc-menubar",
      ".oc-meter",
      ".oc-pagination",
      ".oc-popover",
      ".oc-provider-logo",
      ".oc-sidebar",
      ".oc-skeleton-line",
      ".oc-table",
      ".oc-table-of-contents",
      ".oc-tabs",
      ".oc-text",
      ".oc-toolbar",
      ".oc-toast",
      ".oc-tooltip",
      ".oc-chart",
      ".oc-chart-colors",
      ".oc-timeseries",
      ".oc-map",
      ".oc-sankey",
      ".oc-custom-chart",
      ".oc-page-header",
      ".oc-resource-list",
      ".oc-delete-resource",
      ".oc-agent-chat",
      ".oc-agent-error-message",
      ".oc-agent-tool",
      ".oc-agent-bash-tool",
      ".oc-agent-edit-tool",
      ".oc-agent-search-tool",
      ".oc-agent-input-bar",
      ".oc-agent-suggestions",
      ".oc-agent-model-picker",
      ".oc-agent-mode-selector",
      ".oc-agent-user-message",
      ".oc-agent-text-shimmer",
      ".oc-agent-spiral-loader",
      ".oc-agent-message-list",
    ]) {
      expect(components).toContain(className);
    }

    expect(components).toContain("border-radius: var(--oc-radius-surface)");
    expect(components).toContain("border-radius: var(--oc-radius-control)");
    expect(components).toContain("border-radius: var(--oc-radius-inset)");
    expect(references).not.toContain("--oc-radius-full");
    expect(components).toContain("@media (prefers-reduced-motion: reduce)");
    expect(components).toContain("transform: none");
  });

  test("ClawHub compatibility covers explicit and system light modes", async () => {
    const compatibility = await readFile("styles/compat/clawhub.css", "utf8");
    expect(compatibility).toContain(
      '[data-theme-family="claw"][data-theme-resolved="light"]',
    );
    expect(compatibility).toContain(
      '[data-theme-family="claw"][data-theme-mode="system"]',
    );
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
          forbiddenExtensions.test(path),
      ),
    ).toEqual([]);
  });
});
