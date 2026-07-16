import { introductionPage, referencePages } from "./navigation.js";

export const previewRoutes = Object.freeze([introductionPage, ...referencePages]);

function pathSegments(path) {
  return path.split("/").filter(Boolean);
}

export function getRouteRoot(path) {
  const depth = pathSegments(path).length;
  return depth === 0 ? "./" : "../".repeat(depth);
}

function replaceAttribute(html, attribute, value) {
  const pattern = new RegExp(`(${attribute}=["'])[^"']*(["'])`);
  return html.replace(pattern, `$1${value}$2`);
}

function replaceTitle(html, label) {
  const title = label === "Home" ? "Carapace" : `${label} · Carapace`;
  return html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
}

function createNeutralBody(html) {
  return html.replace(
    /(<body\b[^>]*>)([\s\S]*)(<\/body>)/,
    (_match, openingTag, content, closingTag) => {
      const scripts = [...content.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)]
        .map(([script]) => script)
        .join("\n    ");
      const bootstrap = scripts ? `\n    ${scripts}` : "";
      return `${openingTag}\n    <div id="preview-app"></div>${bootstrap}\n  ${closingTag}`;
    },
  );
}

function getRouteLabel(route) {
  return route.id === route.areaId ? route.areaLabel || route.label : route.label;
}

export function createRouteHtml(indexHtml, route) {
  const root = getRouteRoot(route.path);
  const routeId = route.areaId || route.id;

  return replaceTitle(
    replaceAttribute(
      replaceAttribute(
        replaceAttribute(
          createNeutralBody(indexHtml).replace(
            /\b(href|src)=(["'])\.\/([^"']*)\2/g,
            (_, attribute, quote, value) => `${attribute}=${quote}${root}${value}${quote}`,
          ),
          "data-preview-root",
          root,
        ),
        "data-preview-page",
        route.id,
      ),
      "data-preview-route",
      routeId,
    ),
    getRouteLabel(route),
  );
}

export function createPreviewRouteStubsPlugin(routes = previewRoutes) {
  return {
    name: "carapace-preview-route-stubs",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const entry = bundle["index.html"];
      if (!entry || entry.type !== "asset" || typeof entry.source !== "string") {
        this.error("The preview build did not emit index.html");
      }

      for (const route of routes) {
        if (!route.path) continue;
        this.emitFile({
          type: "asset",
          fileName: `${route.path}index.html`,
          source: createRouteHtml(entry.source, route),
        });
      }
    },
  };
}
