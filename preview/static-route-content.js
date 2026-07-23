import homeHtml from "./index.html?raw";
import compositionsHtml from "./static-routes/compositions.html?raw";
import interfaceHtml from "./static-routes/interface.html?raw";
import resourcesHtml from "./static-routes/resources.html?raw";
import homeArtworkUrl from "./assets/carapace-home-artwork.avif?url";

const staticRoutes = new Map([
  ["overview", { html: homeHtml, path: "", document: true }],
  ["interface", { html: interfaceHtml, path: "interface/", document: false }],
  ["compositions", { html: compositionsHtml, path: "compositions/", document: false }],
  ["resources", { html: resourcesHtml, path: "resources/", document: false }],
]);

const lazyStaticRoutes = new Map([
  [
    "introduction",
    {
      path: "introduction/",
      load: () => import("./static-routes/introduction.html?raw").then(({ default: html }) => html),
    },
  ],
]);

function rewriteUrl(value, pageUrl) {
  if (!value || value.startsWith("data:") || value.startsWith("blob:")) return value;
  return new URL(value, pageUrl).href;
}

function renderStaticRouteContent(route, siteRoot) {
  const pageUrl = new URL(route.path, siteRoot);
  const source = route.document
    ? route.html
    : `<main class="preview-main">${route.html}</main>`;
  const parsed = new DOMParser().parseFromString(source, "text/html");
  const main = parsed.querySelector("main.preview-main");
  if (!main) return null;

  main.querySelector(".canvas-header")?.remove();
  for (const element of main.querySelectorAll("[href], [src]")) {
    if (element.hasAttribute("href")) {
      element.setAttribute("href", rewriteUrl(element.getAttribute("href"), pageUrl));
    }
    if (element.hasAttribute("src")) {
      const source = element.getAttribute("src");
      element.setAttribute(
        "src",
        source === "./assets/carapace-home-artwork.avif"
          ? homeArtworkUrl
          : rewriteUrl(source, pageUrl),
      );
    }
  }

  return main.innerHTML;
}

export function getStaticRouteContent(pageId, siteRoot) {
  const route = staticRoutes.get(pageId);
  return route ? renderStaticRouteContent(route, siteRoot) : null;
}

export async function loadStaticRouteContent(pageId, siteRoot) {
  const route = lazyStaticRoutes.get(pageId);
  if (!route) return getStaticRouteContent(pageId, siteRoot);

  const html = await route.load();
  return renderStaticRouteContent({ ...route, html, document: false }, siteRoot);
}

export function hasStaticRouteContent(pageId) {
  return staticRoutes.has(pageId) || lazyStaticRoutes.has(pageId);
}
