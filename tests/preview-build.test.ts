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

  test("keeps route bootstrap scripts outside replaceable body content", async () => {
    const source = await readFile("preview/index.html", "utf8");
    const headEnd = source.indexOf("</head>");
    const bodyStart = source.indexOf("<body");

    expect(headEnd).toBeGreaterThan(-1);
    expect(bodyStart).toBeGreaterThan(headEnd);
    expect(source.slice(0, headEnd)).toContain(
      '<script type="module" src="./preview.js"></script>',
    );
    expect(source).not.toContain("cdn.jsdelivr.net");
    expect(source).not.toContain("unpkg.com");
    expect(source.slice(bodyStart)).not.toContain("<script");
  });

  test("publishes complete social preview metadata", async () => {
    const source = await readFile("preview/index.html", "utf8");

    expect(source).toContain('<link rel="canonical" href="https://carapace.design/"');
    expect(source).toContain(
      '<meta property="og:image" content="https://carapace.design/carapace-og.png"',
    );
    expect(source).toContain('<meta property="og:image:width" content="1200"');
    expect(source).toContain('<meta property="og:image:height" content="630"');
    expect(source).toContain('<meta name="twitter:card" content="summary_large_image"');
    expect(source).toContain(
      '<meta name="twitter:image" content="https://carapace.design/carapace-og.png"',
    );
  });

  test("derives route roots from manifest depth", () => {
    expect(getRouteRoot("")).toBe("./");
    expect(getRouteRoot("introduction/")).toBe("../");
    expect(getRouteRoot("interface/primitives/button/")).toBe("../../../");
  });

  test("rewrites a neutral bootstrap document for a deep link", async () => {
    const html = await createRouteHtml(
      '<title>Carapace</title><link rel="canonical" href="https://carapace.design/"><meta property="og:url" content="https://carapace.design/"><link href="./assets/app.css"><script type="module" src="./assets/app.js"></script><body data-preview-route="overview" data-preview-page="overview" data-preview-root="./"><main class="home-component-grid">Home</main></body>',
      {
        id: "primitive-button",
        label: "Button",
        path: "interface/primitives/button/",
        areaId: "interface",
      },
    );

    expect(html).toContain("<title>Button · Carapace</title>");
    expect(html).toContain(
      '<link rel="canonical" href="https://carapace.design/interface/primitives/button/"',
    );
    expect(html).toContain(
      '<meta property="og:url" content="https://carapace.design/interface/primitives/button/"',
    );
    expect(html).toContain('data-preview-route="interface"');
    expect(html).toContain('data-preview-page="primitive-button"');
    expect(html).toContain('data-preview-root="../../../"');
    expect(html).toContain('href="../../../assets/app.css"');
    expect(html).toContain('src="../../../assets/app.js"');
    expect(html).toContain('<div id="preview-app"></div>');
    expect(html).not.toContain("home-component-grid");
    expect(html).not.toContain(">Home</main>");
  });

  test("serves deep development routes without parsing the Home grid", async () => {
    const plugin = createPreviewRouteStubsPlugin();
    const source = await readFile("preview/index.html", "utf8");
    const html = await plugin.transformIndexHtml?.(source, {
      path: "/index.html",
      originalUrl: "/interface/primitives/button/",
      server: {},
    } as never);

    expect(html).toContain('data-preview-page="primitive-button"');
    expect(html).toContain('<div id="preview-app"></div>');
    expect(html).not.toContain("home-component-grid");
  });

  test("uses area names for overview document titles", async () => {
    const source = '<title>Carapace</title><script type="module" src="./app.js"></script><body data-preview-route="overview" data-preview-page="overview" data-preview-root="./"></body>';

    for (const [id, title] of [
      ["introduction", "Introduction · Carapace"],
      ["interface", "Components · Carapace"],
      ["effects", "Effects · Carapace"],
      ["compositions", "Compositions · Carapace"],
      ["resources", "Resources · Carapace"],
    ]) {
      const route = previewRoutes.find((entry) => entry.id === id);
      expect(route).toBeDefined();
      expect(await createRouteHtml(source, route!)).toContain(`<title>${title}</title>`);
    }
  });

  test("emits one deep-link stub for every non-root manifest route", async () => {
    const emitted: Array<{ fileName: string; source: string }> = [];
    const plugin = createPreviewRouteStubsPlugin();

    await plugin.generateBundle.call(
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
            '<title>Carapace</title><link rel="canonical" href="https://carapace.design/"><script src="./assets/app.js"></script><body data-preview-route="overview" data-preview-page="overview" data-preview-root="./"></body>',
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
    expect(emitted.map(({ fileName }) => fileName)).toContain("introduction/index.html");
    expect(emitted.map(({ fileName }) => fileName)).toContain("foundations/index.html");
    const foundationsAlias = emitted.find(
      ({ fileName }) => fileName === "foundations/index.html",
    );
    expect(foundationsAlias?.source).toContain('data-preview-page="introduction"');
    expect(foundationsAlias?.source).toContain(
      'rel="canonical" href="https://carapace.design/introduction/"',
    );
    expect(emitted.map(({ fileName }) => fileName)).toContain(
      "agent-components/bash-tool/index.html",
    );
    const bashAlias = emitted.find(
      ({ fileName }) => fileName === "agent-components/bash-tool/index.html",
    );
    expect(bashAlias?.source).toContain(
      'rel="canonical" href="https://carapace.design/agent-components/interactive-tool/"',
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
        expect(deepRouteHtml.length).toBeLessThan(3_000);

        const scripts = [...deepRouteHtml.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
          ([, value]) => value,
        );
        const entryScript = scripts.find((value) => value.includes("/assets/index-"));
        expect(entryScript).toBeDefined();
        const entryPath = resolve(dirname(deepRoutePath), entryScript);
        const entryStats = await stat(entryPath);
        expect(entryStats.size).toBeLessThan(150_000);
        expect(await readFile(entryPath, "utf8")).not.toContain(
          "One visual contract for the OpenClaw product family",
        );
        const builtScripts = (await readdir(join(outputDirectory, "assets")))
          .filter((fileName) => fileName.endsWith(".js"));
        const lazyIntroductionChunks = await Promise.all(
          builtScripts.map(async (fileName) => ({
            fileName,
            source: await readFile(join(outputDirectory, "assets", fileName), "utf8"),
          })),
        );
        expect(
          lazyIntroductionChunks.some(({ source }) =>
            source.includes("One visual contract for the OpenClaw product family"),
          ),
        ).toBe(true);
        expect(deepRouteHtml).not.toContain("preview-reference");
        expect(deepRouteHtml).not.toContain("preview-components");

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
        await expect(stat(join(outputDirectory, "carapace-og.png"))).resolves.toMatchObject({
          size: expect.any(Number),
        });
      } finally {
        await rm(outputDirectory, { recursive: true, force: true });
      }
    },
    15_000,
  );
});
