import { introductionPage, referencePages } from "./navigation.js";

export const previewRoutes = Object.freeze([introductionPage, ...referencePages]);

function pathSegments(path) {
  return path.split("/").filter(Boolean);
}

export function getRouteRoot(path) {
  const depth = pathSegments(path).length;
  return depth === 0 ? "./" : "../".repeat(depth);
}

function getRouteLabel(route) {
  return route.id === route.areaId ? route.areaLabel || route.label : route.label;
}

export async function createRouteHtml(indexHtml, route) {
  const root = getRouteRoot(route.path);
  const routeId = route.areaId || route.id;
  const label = getRouteLabel(route);
  const title = label === "Home" ? "Carapace" : `${label} · Carapace`;
  const canonicalUrl = new URL(route.path, "https://carapace.design/").href;

  const bodyPattern = /<body\b([^>]*)>[\s\S]*?<\/body>/i;
  if (!bodyPattern.test(indexHtml)) {
    throw new Error("The preview entry is missing a body element");
  }

  const rewriteAsset = (_match, attribute, quote, value) => {
    const rewritten = value.startsWith("./") ? `${root}${value.slice(2)}` : value;
    return `${attribute}=${quote}${rewritten}${quote}`;
  };

  return indexHtml
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(
      /(<link\s+rel=["']canonical["']\s+href=)(["']).*?\2/i,
      `$1"${canonicalUrl}"`,
    )
    .replace(
      /(<meta\s+property=["']og:url["']\s+content=)(["']).*?\2/i,
      `$1"${canonicalUrl}"`,
    )
    .replace(/\b(href|src)=(["'])(.*?)\2/gi, rewriteAsset)
    .replace(bodyPattern, (_match, attributes) => {
      const routeAttributes = attributes
        .replace(/\sdata-preview-(?:root|page|route)=(["']).*?\1/gi, "")
        .trim();
      const preservedAttributes = routeAttributes ? ` ${routeAttributes}` : "";
      return `<body${preservedAttributes} data-preview-root="${root}" data-preview-page="${route.id}" data-preview-route="${routeId}"><div id="preview-app"></div></body>`;
    });
}

export function createPreviewRouteStubsPlugin(routes = previewRoutes) {
  return {
    name: "carapace-preview-route-stubs",
    apply: "build",
    enforce: "post",
    async generateBundle(_options, bundle) {
      const entry = bundle["index.html"];
      if (!entry || entry.type !== "asset" || typeof entry.source !== "string") {
        this.error("The preview build did not emit index.html");
      }

      for (const route of routes) {
        if (!route.path) continue;
        this.emitFile({
          type: "asset",
          fileName: `${route.path}index.html`,
          source: await createRouteHtml(entry.source, route),
        });
      }
    },
  };
}
