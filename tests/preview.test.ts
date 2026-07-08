import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";

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
});
