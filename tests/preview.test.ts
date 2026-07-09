import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
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
    ]) {
      expect(css).toContain(`@import "${path}"`);
    }
  });

  test("covers the three consumer surface categories", async () => {
    const html = await readFile("preview/index.html", "utf8");
    expect(html).toContain('id="product"');
    expect(html).toContain('id="content"');
    expect(html).toContain('id="composition"');
    expect(html).toContain("data-theme-choice");
    expect(html).toContain("data-open-dialog");
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
});
