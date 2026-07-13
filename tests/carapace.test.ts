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
  return new Set(
    [...source.matchAll(/\.(oc-[a-z0-9-]+)/g)].map((match) => `.${match[1]}`),
  );
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

  test("the evidence-backed control minimum remains additive", async () => {
    const tokens = await readFile("styles/tokens.css", "utf8");
    const controls = await readFile("styles/candidate/controls.css", "utf8");

    expect(tokens).toContain("--oc-control-min-height: 2.75rem;");
    expect(controls).toContain("min-height: var(--oc-control-min-height);");
    expect(controls).not.toContain("min-height: 2.75rem;");
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
    expect(components).toContain("@media (prefers-reduced-motion: reduce)");
    expect(components).toContain("transform: none");
  });

  test("candidate entry points are isolated by responsibility", async () => {
    const controls = await readFile("styles/candidate/controls.css", "utf8");
    const feedback = await readFile("styles/candidate/feedback.css", "utf8");
    const data = await readFile("styles/candidate/data.css", "utf8");

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
      ".oc-badge-neutral",
      ".oc-badge-success",
      ".oc-badge-warning",
      ".oc-badge-error",
      ".oc-badge-info",
      ".oc-banner",
      ".oc-banner-indicator",
      ".oc-banner-content",
      ".oc-banner-title",
      ".oc-banner-success",
      ".oc-banner-warning",
      ".oc-banner-error",
      ".oc-banner-info",
      ".oc-empty",
      ".oc-empty-content",
      ".oc-empty-icon",
      ".oc-empty-title",
      ".oc-empty-description",
      ".oc-empty-actions",
      ".oc-loader",
      ".oc-loader-spinner",
      ".oc-loader-sm",
      ".oc-loader-lg",
      ".oc-skeleton-line",
      ".oc-skeleton-line-short",
    ]);
    expectClasses(data, [
      ".oc-table",
      ".oc-table-wrap",
      ".oc-table-interactive",
      ".oc-resource-list",
      ".oc-resource-list-item",
      ".oc-resource-list-link",
      ".oc-resource-list-content",
      ".oc-resource-list-title",
      ".oc-resource-list-description",
      ".oc-resource-list-meta",
      ".oc-resource-list-arrow",
    ]);

    for (const candidate of [controls, feedback, data]) {
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

    expect(controls).toMatch(
      /\.oc-input\[aria-invalid="true"\][\s\S]*?--oc-status-error-fg/,
    );
    expect(controls).toMatch(
      /\.oc-checkbox:indeterminate[\s\S]*?--oc-accent-primary/,
    );
    expect(controls).toMatch(
      /@media \(forced-colors: active\)[\s\S]*?appearance: auto/,
    );
    expect(controls).toMatch(
      /\.oc-switch:checked[\s\S]*?--oc-accent-primary/,
    );
    expect(feedback).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation: none/,
    );
    expect(data).toMatch(/\.oc-table-wrap[\s\S]*?overflow-x: auto/);
    expect(data).toMatch(/\.oc-resource-list-link:focus-visible[\s\S]*?--oc-focus-ring/);

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

    for (const selector of [".oc-table-wrap", ".oc-table", ".oc-resource-list"]) {
      expect(ruleDeclarations(data, selector)).toContain("box-sizing: border-box");
    }

    expect(data).toMatch(
      /\.oc-table-interactive tbody tr:is\(:hover, :focus-within\)/,
    );
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
    expect(lab).toContain(".oc-command-palette");
    expect(lab).toContain(".oc-chart");
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
          path !== "preview/assets/openclaw-mark.png" &&
          path !== "preview/assets/openclaw-mark-hover.png" &&
          forbiddenExtensions.test(path),
      ),
    ).toEqual([]);
  });
});
