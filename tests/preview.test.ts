import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
import { referencePages } from "../preview/navigation.js";
import { referenceContentIds } from "../preview/reference-content.js";
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
});
