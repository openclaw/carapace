import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { getReferenceArea, getReferencePage, introductionPage } from "./navigation.js";
import { mountPage } from "./page-lifecycle.js";
import { ReactShell } from "./react-shell.jsx";
import {
  createPreviewHistoryState,
  readPreviewHistoryState,
  resolvePreviewRoute,
  resolvePreviewSiteRoot,
  shouldInterceptPreviewLink,
  updatePreviewHistoryScroll,
} from "./router.js";
import { getStaticRouteContent } from "./static-route-content.js";

function routeLabel(pageId) {
  if (pageId === introductionPage.id) return "Carapace";
  const page = getReferencePage(pageId);
  const area = getReferenceArea(pageId);
  return page?.id === area?.id ? area.label : page?.label || "Carapace";
}

function updateDocumentMetadata(pageId) {
  const label = routeLabel(pageId);
  document.title = label === "Carapace" ? label : `${label} · Carapace`;
  document.body.dataset.previewPage = pageId;
  document.body.dataset.previewRoute = getReferenceArea(pageId)?.id || pageId;
}

function scrollToHash(hash) {
  if (!hash) return false;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // An invalid escape is not a valid in-page destination.
  }
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView();
  return true;
}

function RouteView({ route, siteRoot, navigation }) {
  const routeRootRef = useRef(null);
  const staticContent = useMemo(
    () => getStaticRouteContent(route.pageId, siteRoot),
    [route.pageId, siteRoot],
  );

  useLayoutEffect(() => {
    updateDocumentMetadata(route.pageId);
    const root = routeRootRef.current;
    if (!root) return undefined;
    const lifecycle = mountPage(root, { pageId: route.pageId });
    const refreshTheme = (event) => lifecycle.refreshTheme(event.detail?.theme);
    window.addEventListener("previewthemechange", refreshTheme);
    return () => {
      window.removeEventListener("previewthemechange", refreshTheme);
      lifecycle.cleanup();
    };
  }, [route.pageId, siteRoot, staticContent]);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (navigation.kind === "restore") {
        window.scrollTo(navigation.scrollX, navigation.scrollY);
        return;
      }
      if (!scrollToHash(route.hash)) window.scrollTo(0, 0);
      if (navigation.kind === "push") {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [navigation, route.hash]);

  return staticContent === null ? (
    <div className="preview-route-content" ref={routeRootRef}>
      <div className="page-layout">
        <article className="preview-stage reference-page" data-reference-content />
      </div>
    </div>
  ) : (
    <div
      className="preview-route-content"
      ref={routeRootRef}
      dangerouslySetInnerHTML={{ __html: staticContent }}
    />
  );
}

function PreviewApp({ initialRoute, siteRoot }) {
  const [entry, setEntry] = useState(() => ({
    route: initialRoute,
    navigation: { kind: "initial", sequence: 0, scrollX: 0, scrollY: 0 },
  }));
  const entryRef = useRef(entry);
  entryRef.current = entry;

  const saveCurrentScroll = useCallback(() => {
    const current = entryRef.current.route;
    const existing = readPreviewHistoryState(window.history.state);
    const state = existing
      ? updatePreviewHistoryScroll(window.history.state, window.scrollX, window.scrollY)
      : createPreviewHistoryState(
        current.pageId,
        { hash: current.hash, scrollX: window.scrollX, scrollY: window.scrollY },
        window.history.state,
      );
    window.history.replaceState(state, "", window.location.href);
  }, []);

  const navigate = useCallback((href) => {
    const target = resolvePreviewRoute(href, siteRoot);
    if (!target) return false;

    const current = entryRef.current.route;
    if (target.href === current.href) {
      if (!scrollToHash(target.hash)) window.scrollTo(0, 0);
      return true;
    }

    saveCurrentScroll();
    window.history.pushState(
      createPreviewHistoryState(target.pageId, { hash: target.hash }),
      "",
      target.href,
    );
    setEntry((previous) => ({
      route: target,
      navigation: {
        kind: "push",
        sequence: previous.navigation.sequence + 1,
        scrollX: 0,
        scrollY: 0,
      },
    }));
    return true;
  }, [saveCurrentScroll, siteRoot]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    let scrollFrame = 0;
    window.history.scrollRestoration = "manual";
    window.history.replaceState(
      createPreviewHistoryState(
        initialRoute.pageId,
        {
          hash: initialRoute.hash,
          scrollX: window.scrollX,
          scrollY: window.scrollY,
        },
        window.history.state,
      ),
      "",
      initialRoute.href,
    );

    const handleClick = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]");
      if (!anchor || !shouldInterceptPreviewLink(event, anchor, siteRoot)) return;
      event.preventDefault();
      navigate(anchor.href);
    };
    const handlePopState = (event) => {
      const route = resolvePreviewRoute(window.location.href, siteRoot);
      if (!route) return;
      const state = readPreviewHistoryState(event.state);
      setEntry((previous) => ({
        route,
        navigation: {
          kind: state?.pageId === route.pageId ? "restore" : "initial",
          sequence: previous.navigation.sequence + 1,
          scrollX: state?.scrollX || 0,
          scrollY: state?.scrollY || 0,
        },
      }));
    };
    const handlePageHide = () => saveCurrentScroll();
    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        saveCurrentScroll();
      });
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(scrollFrame);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [initialRoute, navigate, saveCurrentScroll, siteRoot]);

  return (
    <ReactShell
      currentPageId={entry.route.pageId}
      siteRootHref={siteRoot}
      onNavigate={navigate}
    >
      <RouteView
        key={entry.route.pageId}
        route={entry.route}
        siteRoot={siteRoot}
        navigation={entry.navigation}
      />
    </ReactShell>
  );
}

export function mountPreviewApp() {
  const siteRoot = resolvePreviewSiteRoot(window.location.href);
  const initialRoute = resolvePreviewRoute(window.location.href, siteRoot);
  if (!initialRoute) throw new Error(`Unknown preview route: ${window.location.href}`);

  const mount = document.createElement("div");
  mount.id = "preview-app";
  document.body.replaceChildren(mount);
  createRoot(mount).render(
    <PreviewApp initialRoute={initialRoute} siteRoot={siteRoot} />,
  );
}
