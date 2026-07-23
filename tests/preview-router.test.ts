import { describe, expect, test } from "bun:test";
import {
  createPreviewHistoryState,
  readPreviewHistoryState,
  resolvePreviewRoute,
  resolvePreviewSiteRoot,
  shouldInterceptPreviewLink,
  updatePreviewHistoryScroll,
} from "../preview/router.js";
import { homePage, referencePages } from "../preview/navigation.js";

function click(overrides = {}) {
  return {
    altKey: false,
    button: 0,
    ctrlKey: false,
    defaultPrevented: false,
    metaKey: false,
    shiftKey: false,
    ...overrides,
  };
}

function link(href, overrides = {}) {
  const attributes = new Set(overrides.attributes || []);
  return {
    href,
    target: "",
    closest: () => null,
    hasAttribute: (name) => attributes.has(name),
    ...overrides,
  };
}

describe("preview router", () => {
  test("resolves a stable site root for local and GitHub Pages routes", () => {
    expect(
      resolvePreviewSiteRoot(
        "http://127.0.0.1:4173/interface/primitives/action/#usage",
        "../../../",
      ),
    ).toBe("http://127.0.0.1:4173/");
    expect(
      resolvePreviewSiteRoot(
        "https://openclaw.github.io/design-system/interface/primitives/action/",
        "../../../",
      ),
    ).toBe("https://openclaw.github.io/design-system/");

    expect(
      resolvePreviewSiteRoot(
        "https://openclaw.github.io/design-system/interface/primitives/action/index.html",
      ),
    ).toBe("https://openclaw.github.io/design-system/");
    expect(
      resolvePreviewSiteRoot("https://openclaw.github.io/design-system/index.html"),
    ).toBe("https://openclaw.github.io/design-system/");
  });

  test("maps canonical, extensionless, index, and hashed URLs to known pages", () => {
    const siteRoot = "https://openclaw.github.io/design-system/";

    expect(resolvePreviewRoute(`${siteRoot}introduction`, siteRoot)).toMatchObject({
      pageId: "introduction",
      path: "introduction/",
      hash: "",
    });
    expect(resolvePreviewRoute(`${siteRoot}foundations/`, siteRoot)).toMatchObject({
      pageId: "introduction",
      path: "introduction/",
      href: `${siteRoot}introduction/`,
    });
    expect(resolvePreviewRoute(`${siteRoot}foundations/colors`, siteRoot)).toMatchObject({
      pageId: "foundation-colors",
      path: "foundations/colors/",
      hash: "",
    });
    expect(resolvePreviewRoute(`${siteRoot}agent-components/bash-tool/`, siteRoot)).toMatchObject({
      pageId: "interactive-tool",
      path: "agent-components/interactive-tool/",
      href: `${siteRoot}agent-components/interactive-tool/`,
    });
    expect(
      resolvePreviewRoute(`${siteRoot}interface/primitives/action/index.html#usage`, siteRoot),
    ).toMatchObject({
      pageId: "primitive-action",
      path: "interface/primitives/action/",
      hash: "#usage",
    });
    expect(resolvePreviewRoute(`${siteRoot}#home`, siteRoot)).toMatchObject({
      pageId: "overview",
      path: "",
      hash: "#home",
    });

    expect(resolvePreviewRoute("https://openclaw.github.io/foundations/colors/", siteRoot)).toBeNull();
    expect(resolvePreviewRoute(`${siteRoot}assets/openclaw-mark.png`, siteRoot)).toBeNull();
    expect(resolvePreviewRoute(`${siteRoot}missing/`, siteRoot)).toBeNull();

    expect(
      resolvePreviewRoute(
        "http://127.0.0.1:4173/interface/primitives/action/",
        "http://127.0.0.1:4173/",
      )?.pageId,
    ).toBe("primitive-action");
  });

  test("resolves every page published by the navigation manifest", () => {
    const siteRoot = "https://openclaw.github.io/design-system/";

    for (const page of [homePage, ...referencePages]) {
      expect(resolvePreviewRoute(new URL(page.path, siteRoot), siteRoot)?.pageId).toBe(page.id);
    }
  });

  test("intercepts only unmodified same-origin links to known preview pages", () => {
    const siteRoot = "https://openclaw.github.io/design-system/";
    const page = link(`${siteRoot}interface/primitives/action/#usage`);

    expect(shouldInterceptPreviewLink(click(), page, siteRoot)).toBe(true);

    for (const modifier of ["altKey", "ctrlKey", "metaKey", "shiftKey"]) {
      expect(shouldInterceptPreviewLink(click({ [modifier]: true }), page, siteRoot)).toBe(false);
    }
    expect(shouldInterceptPreviewLink(click({ button: 1 }), page, siteRoot)).toBe(false);
    expect(shouldInterceptPreviewLink(click({ defaultPrevented: true }), page, siteRoot)).toBe(false);
    expect(shouldInterceptPreviewLink(click(), link(page.href, { target: "_blank" }), siteRoot)).toBe(
      false,
    );
    expect(
      shouldInterceptPreviewLink(click(), link(page.href, { attributes: ["download"] }), siteRoot),
    ).toBe(false);
    expect(
      shouldInterceptPreviewLink(
        click(),
        link(page.href, { closest: (selector) => selector === "[data-workbench-inert-link]" }),
        siteRoot,
      ),
    ).toBe(false);
    expect(
      shouldInterceptPreviewLink(click(), link("https://example.com/components/"), siteRoot),
    ).toBe(false);
    expect(
      shouldInterceptPreviewLink(click(), link(`${siteRoot}assets/openclaw-mark.png`), siteRoot),
    ).toBe(false);
    expect(shouldInterceptPreviewLink(click(), link(`${siteRoot}unknown/`), siteRoot)).toBe(false);
  });

  test("stores validated route, scroll, and hash data without replacing other history state", () => {
    const state = createPreviewHistoryState(
      "primitive-action",
      { hash: "usage", scrollX: 12, scrollY: 480 },
      { analytics: "preserved" },
    );

    expect(state.analytics).toBe("preserved");
    expect(readPreviewHistoryState(state)).toEqual({
      pageId: "primitive-action",
      hash: "#usage",
      scrollX: 12,
      scrollY: 480,
    });

    const scrolled = updatePreviewHistoryScroll(state, 4, 920);
    expect(readPreviewHistoryState(scrolled)).toEqual({
      pageId: "primitive-action",
      hash: "#usage",
      scrollX: 4,
      scrollY: 920,
    });
    expect(scrolled.analytics).toBe("preserved");

    expect(readPreviewHistoryState({ pageId: "primitive-action" })).toBeNull();
    expect(readPreviewHistoryState({ carapacePreview: { pageId: "missing" } })).toBeNull();
    expect(() => createPreviewHistoryState("missing")).toThrow("Unknown preview page");
  });
});
