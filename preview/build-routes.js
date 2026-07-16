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
  let foundBody = false;

  const rewriteRelativeAsset = (element, attribute) => {
    const value = element.getAttribute(attribute);
    if (value?.startsWith("./")) {
      element.setAttribute(attribute, `${root}${value.slice(2)}`);
    }
  };

  const response = new HTMLRewriter()
    .on("title", {
      element(element) {
        element.setInnerContent(title);
      },
    })
    .on("body", {
      element(element) {
        foundBody = true;
        element.setAttribute("data-preview-root", root);
        element.setAttribute("data-preview-page", route.id);
        element.setAttribute("data-preview-route", routeId);
        element.setInnerContent('<div id="preview-app"></div>', { html: true });
      },
    })
    .on("[href]", {
      element(element) {
        rewriteRelativeAsset(element, "href");
      },
    })
    .on("[src]", {
      element(element) {
        rewriteRelativeAsset(element, "src");
      },
    })
    .transform(new Response(indexHtml));

  const html = await response.text();
  if (!foundBody) throw new Error("The preview entry is missing a body element");
  return html;
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
