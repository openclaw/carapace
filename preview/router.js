import { introductionPage, referencePages } from "./navigation.js";

export const previewHistoryKey = "carapacePreview";

const previewPages = [introductionPage, ...referencePages];
const previewPagesById = new Map(previewPages.map((page) => [page.id, page]));
const previewPagesByPath = new Map(previewPages.map((page) => [page.path, page]));
const previewPathsByLength = previewPages
  .map((page) => page.path)
  .filter(Boolean)
  .sort((left, right) => right.length - left.length);

function hrefOf(value) {
  return typeof value === "string" ? value : value?.href;
}

function parseUrl(value, base) {
  try {
    return new URL(hrefOf(value), base);
  } catch {
    return null;
  }
}

function withoutIndex(pathname) {
  return pathname.endsWith("/index.html")
    ? pathname.slice(0, -"index.html".length)
    : pathname;
}

function directoryPath(pathname) {
  const path = withoutIndex(pathname);
  return path.endsWith("/") ? path : `${path}/`;
}

function rootHref(url, pathname) {
  const root = new URL(url.href);
  root.pathname = pathname;
  root.search = "";
  root.hash = "";
  return root.href;
}

export function resolvePreviewSiteRoot(locationHref, previewRoot) {
  const location = parseUrl(locationHref);
  if (!location) throw new TypeError("A valid preview location is required");

  if (typeof previewRoot === "string") {
    const hintedRoot = parseUrl(previewRoot || "./", location);
    if (!hintedRoot) throw new TypeError("A valid preview root is required");
    return rootHref(hintedRoot, directoryPath(hintedRoot.pathname));
  }

  const currentPath = directoryPath(location.pathname);
  const routePath = previewPathsByLength.find((path) => currentPath.endsWith(`/${path}`));
  if (!routePath) return rootHref(location, currentPath);

  return rootHref(location, currentPath.slice(0, -routePath.length));
}

function relativePreviewPath(pathname, rootPathname) {
  if (!pathname.startsWith(rootPathname)) return null;

  const relativePath = withoutIndex(pathname.slice(rootPathname.length)).replace(/^\/+/, "");
  if (!relativePath) return "";
  if (/\.[a-z0-9]+$/i.test(relativePath)) return null;
  return relativePath.endsWith("/") ? relativePath : `${relativePath}/`;
}

export function resolvePreviewRoute(targetHref, siteRoot) {
  const root = parseUrl(siteRoot);
  const target = root && parseUrl(targetHref, root);
  if (!root || !target || target.origin !== root.origin) return null;

  const path = relativePreviewPath(target.pathname, directoryPath(root.pathname));
  const page = path === null ? undefined : previewPagesByPath.get(path);
  if (!page) return null;

  const canonicalUrl = new URL(page.path, root);
  canonicalUrl.search = target.search;
  canonicalUrl.hash = target.hash;

  return Object.freeze({
    pageId: page.id,
    path: page.path,
    hash: target.hash,
    search: target.search,
    href: canonicalUrl.href,
  });
}

function isModifiedClick(event) {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}

function opensOutsideCurrentContext(anchor) {
  const target = anchor.target?.trim().toLowerCase();
  return Boolean(target && target !== "_self");
}

function isDownload(anchor) {
  return anchor.hasAttribute?.("download") || Boolean(anchor.download);
}

function isDemonstrationLink(anchor) {
  return Boolean(anchor.closest?.("[data-workbench-inert-link]"));
}

export function shouldInterceptPreviewLink(event, anchor, siteRoot) {
  if (!event || !anchor || event.defaultPrevented || isModifiedClick(event)) return false;
  if (event.button !== undefined && event.button !== 0) return false;
  if (opensOutsideCurrentContext(anchor) || isDownload(anchor) || isDemonstrationLink(anchor)) {
    return false;
  }

  return Boolean(resolvePreviewRoute(anchor.href, siteRoot));
}

function normalizeHash(hash) {
  if (!hash) return "";
  return hash.startsWith("#") ? hash : `#${hash}`;
}

function normalizeScroll(value) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function createPreviewHistoryState(pageId, options = {}, baseState = {}) {
  if (!previewPagesById.has(pageId)) throw new TypeError(`Unknown preview page: ${pageId}`);

  const preservedState = baseState && typeof baseState === "object" ? baseState : {};
  return {
    ...preservedState,
    [previewHistoryKey]: {
      pageId,
      hash: normalizeHash(options.hash),
      scrollX: normalizeScroll(options.scrollX),
      scrollY: normalizeScroll(options.scrollY),
    },
  };
}

export function readPreviewHistoryState(state) {
  const previewState = state?.[previewHistoryKey];
  if (!previewState || typeof previewState !== "object") return null;
  if (!previewPagesById.has(previewState.pageId)) return null;
  if (typeof previewState.hash !== "string") return null;
  if (!Number.isFinite(previewState.scrollX) || !Number.isFinite(previewState.scrollY)) return null;

  return {
    pageId: previewState.pageId,
    hash: normalizeHash(previewState.hash),
    scrollX: normalizeScroll(previewState.scrollX),
    scrollY: normalizeScroll(previewState.scrollY),
  };
}

export function updatePreviewHistoryScroll(state, scrollX, scrollY) {
  const previewState = readPreviewHistoryState(state);
  if (!previewState) throw new TypeError("Preview history state is missing");

  return createPreviewHistoryState(
    previewState.pageId,
    { ...previewState, scrollX, scrollY },
    state,
  );
}
