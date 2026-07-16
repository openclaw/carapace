import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import { build } from "vite";
import {
  createPreviewRouteStubsPlugin,
  createRouteHtml,
  getRouteRoot,
  previewRoutes,
} from "../preview/build-routes.js";

async function findIndexFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findIndexFiles(path)));
    if (entry.isFile() && entry.name === "index.html") files.push(path);
  }
  return files;
}

describe("preview route build", () => {
  test("keeps one HTML document in source", async () => {
    const indexes = await findIndexFiles("preview");
    expect(indexes.map((path) => relative("preview", path))).toEqual(["index.html"]);
  });

  test("derives route roots from manifest depth", () => {
    expect(getRouteRoot("")).toBe("./");
    expect(getRouteRoot("foundations/")).toBe("../");
    expect(getRouteRoot("interface/primitives/button/")).toBe("../../../");
  });

  test("rewrites a neutral bootstrap document for a deep link", () => {
    const html = createRouteHtml(
      '<title>Carapace</title><link href="./assets/app.css"><body data-preview-route="overview" data-preview-page="overview" data-preview-root="./"><main class="home-component-grid">Home</main><script type="module" src="./assets/app.js"></script></body>',
      {
        id: "primitive-button",
        label: "Button",
        path: "interface/primitives/button/",
        areaId: "interface",
      },
    );

    expect(html).toContain("<title>Button · Carapace</title>");
    expect(html).toContain('data-preview-route="interface"');
    expect(html).toContain('data-preview-page="primitive-button"');
    expect(html).toContain('data-preview-root="../../../"');
    expect(html).toContain('href="../../../assets/app.css"');
    expect(html).toContain('src="../../../assets/app.js"');
    expect(html).toContain('<div id="preview-app"></div>');
    expect(html).not.toContain("home-component-grid");
    expect(html).not.toContain(">Home</main>");
  });

  test("uses area names for overview document titles", () => {
    const source = '<title>Carapace</title><body data-preview-route="overview" data-preview-page="overview" data-preview-root="./"><script type="module" src="./app.js"></script></body>';

    for (const [id, title] of [
      ["foundations", "Foundations · Carapace"],
      ["interface", "Components · Carapace"],
      ["compositions", "Compositions · Carapace"],
      ["resources", "Resources · Carapace"],
    ]) {
      const route = previewRoutes.find((entry) => entry.id === id);
      expect(route).toBeDefined();
      expect(createRouteHtml(source, route!)).toContain(`<title>${title}</title>`);
    }
  });

  test("emits one deep-link stub for every non-root manifest route", () => {
    const emitted: Array<{ fileName: string; source: string }> = [];
    const plugin = createPreviewRouteStubsPlugin();

    plugin.generateBundle.call(
      {
        emitFile(asset) {
          emitted.push(asset);
        },
        error(message) {
          throw new Error(message);
        },
      },
      {},
      {
        "index.html": {
          type: "asset",
          fileName: "index.html",
          source:
            '<title>Carapace</title><body data-preview-route="overview" data-preview-page="overview" data-preview-root="./"><script src="./assets/app.js"></script></body>',
        },
      },
    );

    const expectedRoutes = previewRoutes.filter((route) => route.path);
    expect(emitted).toHaveLength(expectedRoutes.length);
    expect(new Set(emitted.map(({ fileName }) => fileName)).size).toBe(expectedRoutes.length);
    expect(new Set(emitted.map(({ fileName }) => fileName))).toEqual(
      new Set(expectedRoutes.map(({ path }) => `${path}index.html`)),
    );
    expect(emitted.map(({ fileName }) => fileName)).toContain(
      "interface/primitives/button/index.html",
    );
  });

  test(
    "builds every manifest route with resolvable assets and no duplicated Home markup",
    async () => {
      const outputDirectory = await mkdtemp(join(tmpdir(), "carapace-preview-"));

      try {
        await build({
          root: resolve("preview"),
          base: "./",
          logLevel: "silent",
          plugins: [createPreviewRouteStubsPlugin()],
          build: {
            emptyOutDir: true,
            outDir: outputDirectory,
            rollupOptions: { input: resolve("preview/index.html") },
          },
        });

        const expectedFiles = new Set([
          "index.html",
          ...previewRoutes
            .filter(({ path }) => path)
            .map(({ path }) => `${path}index.html`),
        ]);
        const builtIndexes = await findIndexFiles(outputDirectory);
        expect(new Set(builtIndexes.map((path) => relative(outputDirectory, path)))).toEqual(
          expectedFiles,
        );

        const deepRoutePath = join(
          outputDirectory,
          "interface/primitives/button/index.html",
        );
        const deepRouteHtml = await readFile(deepRoutePath, "utf8");
        expect(deepRouteHtml).toContain("<title>Button · Carapace</title>");
        expect(deepRouteHtml).toContain('<div id="preview-app"></div>');
        expect(deepRouteHtml).not.toContain("home-component-grid");
        expect(deepRouteHtml.length).toBeLessThan(2_000);

        const assetUrls = [...deepRouteHtml.matchAll(/(?:href|src)="([^"]+)"/g)]
          .map(([, value]) => value)
          .filter((value) => !value.startsWith("http"));
        expect(assetUrls.length).toBeGreaterThan(0);
        for (const value of assetUrls) {
          await expect(stat(resolve(dirname(deepRoutePath), value))).resolves.toBeDefined();
        }

        expect((await readFile(join(outputDirectory, "CNAME"), "utf8")).trim()).toBe(
          "carapace.design",
        );
      } finally {
        await rm(outputDirectory, { recursive: true, force: true });
      }
    },
    15_000,
  );
});
