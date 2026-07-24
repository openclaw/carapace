import { describe, expect, test } from "bun:test";
import {
  quickChatApplicationMarkup,
  workspaceApplicationMarkup,
} from "../preview/application-screens.js";
import {
  bindExampleDialog,
  exampleDialogAttribute,
  exampleDialogSelector,
} from "../preview/interaction.js";
import {
  getReferenceContent,
  skillsInstallCommand,
  skillsUpdateCommand,
} from "../preview/reference-content.js";
import {
  resolveTokenHash,
  syncTokenHash,
} from "../preview/token-catalog.js";
import {
  bindTabs,
} from "../preview/tabs.js";
import {
  getScrollFadeState,
} from "../preview/shell.js";
import {
  bindSensitiveInputs,
} from "../preview/sensitive-input.js";
import {
  preventWorkbenchDemoLinkNavigation,
  setWorkbenchCanvasTheme,
  setWorkbenchViewport,
} from "../preview/component-workbench.js";
import {
  actionWorkbenchMarkup,
  clipboardTextWorkbenchMarkup,
  agentChatWorkbenchMarkup,
  attachmentButtonWorkbenchMarkup,
  autocompleteWorkbenchMarkup,
  bannerWorkbenchMarkup,
  composerWorkbenchMarkup,
  collapsibleWorkbenchMarkup,
  errorMessageWorkbenchMarkup,
  fileAttachmentWorkbenchMarkup,
  flowWorkbenchMarkup,
  appSurfaceWorkbenchMarkup,
  heroWorkbenchMarkup,
  sectionWorkbenchMarkup,
  inputAreaWorkbenchMarkup,
  inputGroupWorkbenchMarkup,
  linkWorkbenchMarkup,
  loaderWorkbenchMarkup,
  meterWorkbenchMarkup,
  skeletonLineWorkbenchMarkup,
  brandBannerWorkbenchMarkup,
  providerLogoWorkbenchMarkup,
  markdownWorkbenchMarkup,
  modeSelectorWorkbenchMarkup,
  modelPickerWorkbenchMarkup,
  selectWorkbenchMarkup,
  sendButtonWorkbenchMarkup,
  spiralLoaderWorkbenchMarkup,
  suggestionsWorkbenchMarkup,
  tableWorkbenchMarkup,
  textShimmerWorkbenchMarkup,
  toastWorkbenchMarkup,
  userMessageWorkbenchMarkup,
} from "../preview/component-workbench-config.js";
import { bannerTones } from "../preview/banner-artwork.js";

function keyboardEvent(key) {
  const event = new Event("keydown", { cancelable: true });
  Object.defineProperty(event, "key", { value: key });
  return event;
}

describe("preview behavior", () => {
  test("keeps the workbench canvas and viewport controls synchronized", () => {
    class Button {
      attributes = new Map();
      constructor(viewport) {
        this.dataset = { workbenchViewport: viewport };
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
    }

    const canvas = { dataset: { viewport: "desktop" } };
    const buttons = [new Button("desktop"), new Button("tablet"), new Button("mobile")];
    const workbench = {
      querySelector: () => canvas,
      querySelectorAll: () => buttons,
    };

    expect(setWorkbenchViewport(workbench, "mobile")).toBe(true);
    expect(canvas.dataset.viewport).toBe("mobile");
    expect(buttons.map((button) => button.attributes.get("aria-pressed"))).toEqual([
      "false",
      "false",
      "true",
    ]);
    expect(setWorkbenchViewport(workbench, "wide")).toBe(false);
    expect(canvas.dataset.viewport).toBe("mobile");
  });
  test("changes only the workbench canvas color theme", () => {
    class Button {
      attributes = new Map();
      constructor(theme) {
        this.dataset = { workbenchTheme: theme };
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
    }

    const canvas = { dataset: { workbenchTheme: "dark" } };
    const buttons = [new Button("light"), new Button("dark")];
    const workbench = {
      querySelector: () => canvas,
      querySelectorAll: () => buttons,
    };

    expect(setWorkbenchCanvasTheme(workbench, "light")).toBe(true);
    expect(canvas.dataset.workbenchTheme).toBe("light");
    expect(buttons.map((button) => button.attributes.get("aria-pressed"))).toEqual([
      "true",
      "false",
    ]);
    expect(setWorkbenchCanvasTheme(workbench, "system")).toBe(false);
  });
  test("cancels demonstration link navigation without disabling real links", () => {
    const demoLink = {
      blurred: false,
      blur() {
        this.blurred = true;
      },
      closest: (selector) => (selector === "[data-workbench-inert-link]" ? demoLink : null),
    };
    const realLink = { closest: () => null };

    for (const detail of [0, 1]) {
      const activation = new Event("click", { cancelable: true });
      Object.defineProperties(activation, {
        detail: { value: detail },
        target: { value: demoLink },
      });

      expect(preventWorkbenchDemoLinkNavigation(activation)).toBe(true);
      expect(activation.defaultPrevented).toBe(true);
      expect(demoLink.blurred).toBe(false);
    }

    const realNavigation = new Event("click", { cancelable: true });
    Object.defineProperty(realNavigation, "target", { value: realLink });

    expect(preventWorkbenchDemoLinkNavigation(realNavigation)).toBe(false);
    expect(realNavigation.defaultPrevented).toBe(false);
  });
  test("marks only route-changing specimen links as workbench demonstrations", () => {
    for (const pageId of ["primitive-breadcrumbs", "primitive-link", "primitive-pagination"]) {
      expect(getReferenceContent(pageId)).toContain("data-workbench-inert-link");
    }
    expect(markdownWorkbenchMarkup({ example: "table" })).toContain("data-workbench-inert-link");
    expect(linkWorkbenchMarkup({ variant: "standalone" })).toContain("data-workbench-inert-link");

    for (const pageId of ["primitive-card", "primitive-sidebar", "primitive-table-of-contents"]) {
      expect(getReferenceContent(pageId)).not.toContain("data-workbench-inert-link");
    }
  });
  test("keeps action specimen markup aligned with the selected public variant", () => {
    expect(actionWorkbenchMarkup({ variant: "secondary" })).toBe(
      '<button class="oc-action oc-action-secondary" type="button">\n  Secondary\n</button>',
    );
    expect(actionWorkbenchMarkup({ variant: "icon" })).toBe(
      '<button class="oc-action oc-action-icon" type="button" aria-label="Add item">\n  +\n</button>',
    );
  });
  test("keeps ClipboardText specimen markup aligned with label and icon actions", () => {
    expect(clipboardTextWorkbenchMarkup({ variant: "label" })).toContain(
      'class="oc-clipboard-action" type="button" aria-label="Copy package specifier"',
    );
    expect(clipboardTextWorkbenchMarkup({ variant: "label" })).toContain(">Copy</button>");
    expect(clipboardTextWorkbenchMarkup({ variant: "label" })).not.toContain(
      "oc-clipboard-action-icon",
    );
    expect(clipboardTextWorkbenchMarkup({ variant: "icon" })).toContain(
      'class="oc-clipboard-action oc-clipboard-action-icon"',
    );
    expect(clipboardTextWorkbenchMarkup({ variant: "icon" })).toContain('data-lucide="copy"');
    expect(clipboardTextWorkbenchMarkup({ variant: "icon" })).not.toContain(">Copy</button>");

    const reference = getReferenceContent("primitive-clipboard-text");
    expect(reference).toContain('class="oc-clipboard-action oc-clipboard-action-icon"');
    expect(reference).toContain('data-lucide="copy"');
  });
  test("keeps Link specimen markup aligned with public variants and a single trailing arrow", () => {
    expect(linkWorkbenchMarkup({ variant: "inline" })).toBe(
      '<a class="oc-link" href="/introduction/" data-workbench-inert-link>Inline link</a>',
    );
    expect(linkWorkbenchMarkup({ variant: "muted" })).toBe(
      '<a class="oc-link oc-link-muted" href="/resources/" data-workbench-inert-link>Muted link</a>',
    );
    expect(linkWorkbenchMarkup({ variant: "standalone" })).toBe(
      '<a class="oc-link oc-link-standalone" href="/interface/" data-workbench-inert-link>Browse components <i data-lucide="arrow-right" aria-hidden="true"></i></a>',
    );
    expect(linkWorkbenchMarkup({ variant: "standalone" })).toContain(
      'data-lucide="arrow-right"',
    );
    expect(linkWorkbenchMarkup({ variant: "standalone" })).not.toContain("→");
    expect(linkWorkbenchMarkup({ variant: "standalone", disabled: true })).toBe(
      '<a class="oc-link oc-link-standalone" role="link" aria-disabled="true" tabindex="-1">Browse components <i data-lucide="arrow-right" aria-hidden="true"></i></a>',
    );

    const reference = getReferenceContent("primitive-link");
    expect(reference).toContain('class="oc-link oc-link-standalone"');
    expect(reference).toMatch(
      /oc-link-standalone[^>]*>[\s\S]*?Interface library[\s\S]*?data-lucide="arrow-right"/,
    );
  });
  test("renders anchored Collapsible, two-axis Flow, and active Meter states", () => {
    expect(collapsibleWorkbenchMarkup({ open: true })).toContain(
      '<details class="oc-collapsible" open>',
    );
    expect(collapsibleWorkbenchMarkup({ open: false })).toContain(
      '<details class="oc-collapsible">',
    );

    const horizontal = flowWorkbenchMarkup({ orientation: "horizontal" });
    const vertical = flowWorkbenchMarkup({ orientation: "vertical" });
    expect(horizontal).toContain('class="oc-flow-viewport"');
    expect(horizontal).toContain('data-orientation="horizontal"');
    expect(vertical).not.toContain("oc-flow-viewport");
    expect(vertical).toContain('data-orientation="vertical"');

    const active = meterWorkbenchMarkup({ value: "82", active: true });
    const settled = meterWorkbenchMarkup({ value: "64", active: false });
    expect(active).toContain('data-state="active" data-effect="sheen"');
    expect(active).toContain('class="oc-meter-track"');
    expect(settled).not.toContain("data-effect");
    expect(settled).toContain('value="64"');
    expect(meterWorkbenchMarkup({ value: "82", active: false })).toContain(
      "Measurement settled at its current value",
    );
  });
  test("renders Banner tones without relying on color alone", () => {
    const neutral = bannerWorkbenchMarkup({ tone: "default", action: false });
    const success = bannerWorkbenchMarkup({ tone: "success", action: true });
    const warning = bannerWorkbenchMarkup({ tone: "warning", action: true });
    const error = bannerWorkbenchMarkup({ tone: "error", action: false });
    const info = bannerWorkbenchMarkup({ tone: "info", action: false });

    expect(neutral).toContain('class="oc-banner"');
    expect(neutral).not.toContain("oc-banner-default");
    expect(neutral).not.toContain("<button");
    expect(success).toContain('class="oc-banner oc-banner-success"');
    expect(success).toContain("Changes saved");
    expect(warning).toContain('class="oc-banner oc-banner-warning"');
    expect(warning).toContain("Update available");
    expect(error).toContain('class="oc-banner oc-banner-error"');
    expect(error).toContain("Update failed");
    expect(info).toContain('class="oc-banner oc-banner-info"');
    expect(info).toContain("Reference available");
    for (const markup of [neutral, success, warning, error, info]) {
      expect(markup).toContain('role="status"');
      expect(markup).toContain('class="oc-banner-indicator" aria-hidden="true"');
    }
    expect(success).toContain(
      '<button class="oc-action oc-action-secondary oc-banner-action" type="button">Review</button>',
    );
  });
  test("renders App Surface with optional toolbar chrome and nested card", () => {
    const defaultSurface = appSurfaceWorkbenchMarkup();
    const foundationOnly = appSurfaceWorkbenchMarkup({ toolbar: false, card: false });
    const toolbarOnly = appSurfaceWorkbenchMarkup({ toolbar: true, card: false });
    const cardOnly = appSurfaceWorkbenchMarkup({ toolbar: false, card: true });

    expect(defaultSurface).toContain('class="primitive-app-surface-demo"');
    expect(defaultSurface).toContain("OpenClaw application");
    expect(defaultSurface).toContain("Children inherit the canonical interface foundation.");
    expect(defaultSurface).toContain('class="primitive-app-surface-toolbar"');
    expect(defaultSurface).toContain('class="oc-pill"');
    expect(defaultSurface).toContain('class="oc-action oc-action-ghost"');
    expect(defaultSurface).toContain('class="oc-action oc-action-secondary"');
    expect(defaultSurface).toContain('class="oc-card primitive-app-surface-card"');
    expect(defaultSurface).toContain("Nested card");
    expect(foundationOnly).toContain("OpenClaw application");
    expect(foundationOnly).not.toContain("primitive-app-surface-toolbar");
    expect(foundationOnly).not.toContain("oc-card");
    expect(toolbarOnly).toContain('class="primitive-app-surface-toolbar"');
    expect(toolbarOnly).not.toContain("oc-card");
    expect(cardOnly).toContain('class="oc-card primitive-app-surface-card"');
    expect(cardOnly).not.toContain("primitive-app-surface-toolbar");
  });
  test("renders Hero with optional lede and consumer-owned actions", () => {
    const defaultHero = heroWorkbenchMarkup();
    const titleOnly = heroWorkbenchMarkup({ lede: false, actions: false });
    const withActions = heroWorkbenchMarkup({ lede: true, actions: true });

    expect(defaultHero).toContain('class="oc-hero"');
    expect(defaultHero).toContain('class="oc-hero-title"');
    expect(defaultHero).toContain('class="oc-hero-lede"');
    expect(defaultHero).not.toContain("<button");
    expect(titleOnly).toContain("Build the thing that builds things.");
    expect(titleOnly).not.toContain("oc-hero-lede");
    expect(titleOnly).not.toContain("<button");
    expect(withActions).toContain('class="oc-hero-lede"');
    expect(withActions).toContain('class="oc-action oc-action-primary"');
    expect(withActions).toContain('class="oc-action oc-action-secondary"');
    expect(withActions).not.toContain("oc-hero-actions");
  });
  test("renders Section with optional eyebrow, copy, and adjacent action", () => {
    const defaultSection = sectionWorkbenchMarkup();
    const titleOnly = sectionWorkbenchMarkup({
      eyebrow: false,
      copy: false,
      actions: false,
    });
    const withoutAction = sectionWorkbenchMarkup({
      eyebrow: true,
      copy: true,
      actions: false,
    });

    expect(defaultSection).toContain('class="oc-section"');
    expect(defaultSection).toContain('class="oc-section-header"');
    expect(defaultSection).toContain('class="oc-eyebrow"');
    expect(defaultSection).toContain("Featured");
    expect(defaultSection).toContain('class="oc-section-title"');
    expect(defaultSection).toContain("Build with OpenClaw");
    expect(defaultSection).toContain('class="oc-section-copy"');
    expect(defaultSection).toContain('class="oc-action oc-action-secondary"');
    expect(defaultSection).toContain("Browse");
    expect(defaultSection).toContain('data-lucide="arrow-right"');
    expect(defaultSection).toContain("data-workbench-inert-link");
    expect(titleOnly).toContain("Build with OpenClaw");
    expect(titleOnly).not.toContain("oc-eyebrow");
    expect(titleOnly).not.toContain("oc-section-copy");
    expect(titleOnly).not.toContain("oc-action");
    expect(withoutAction).toContain('class="oc-eyebrow"');
    expect(withoutAction).toContain('class="oc-section-copy"');
    expect(withoutAction).not.toContain("oc-action");
  });
  test("renders Table interaction only with real row actions", () => {
    const staticTable = tableWorkbenchMarkup({ interactive: false });
    const interactiveTable = tableWorkbenchMarkup({ interactive: true });

    expect(staticTable).toContain('class="oc-table"');
    expect(staticTable).not.toContain("oc-table-interactive");
    expect(staticTable).not.toContain('<th scope="col">Action</th>');
    expect(staticTable).not.toContain("<button");
    expect(interactiveTable).toContain('class="oc-table oc-table-interactive"');
    expect(interactiveTable).toContain('<th scope="col">Action</th>');
    expect(interactiveTable).toContain('aria-label="Open Button"');
    expect(interactiveTable).toContain('aria-label="Open Dialog"');
    expect(interactiveTable).toContain('aria-label="Open Table"');
    for (const markup of [staticTable, interactiveTable]) {
      expect(markup).toContain('role="region"');
      expect(markup).toContain('aria-label="Component status"');
      expect(markup).toContain('tabindex="0"');
      expect(markup).toContain('<caption class="sr-only">');
      expect(markup).toContain('scope="col"');
    }
  });
  test("serializes the selected native option and disabled state", () => {
    expect(selectWorkbenchMarkup({ value: "fast", disabled: true })).toContain(
      '<select class="oc-select" id="workbench-select-model" name="model" disabled>',
    );
    expect(selectWorkbenchMarkup({ value: "fast", disabled: true })).toContain(
      '<option value="fast" selected>Fast</option>',
    );
    expect(selectWorkbenchMarkup({ value: "fast", disabled: true })).not.toContain(
      '<option value="balanced" selected>',
    );
  });
  test("renders Input Area states from the shared field contract", () => {
    const defaults = inputAreaWorkbenchMarkup({ state: "default", message: true });
    const invalid = inputAreaWorkbenchMarkup({ state: "invalid", message: true });
    const disabled = inputAreaWorkbenchMarkup({ state: "disabled", message: true });
    const withoutMessage = inputAreaWorkbenchMarkup({ state: "invalid", message: false });

    expect(defaults).toContain('class="oc-textarea"');
    expect(defaults).toContain("Markdown is supported.");
    expect(defaults).toContain('aria-describedby="workbench-input-area-default-message"');
    expect(invalid).toContain('aria-invalid="true"');
    expect(invalid).toContain("Enter at least 20 characters.");
    expect(invalid).toContain("Short note");
    expect(disabled).toContain(" disabled");
    expect(disabled).toContain("Read-only after archival.");
    expect(disabled).not.toContain("oc-field-message");
    expect(withoutMessage).toContain('aria-invalid="true"');
    expect(withoutMessage).not.toContain("oc-field-message");
    expect(withoutMessage).not.toContain("aria-describedby");
  });
  test("renders Input Group addon positions and field states from real markup", () => {
    const prefix = inputGroupWorkbenchMarkup({
      addon: "prefix",
      state: "default",
      message: true,
    });
    const suffixInvalid = inputGroupWorkbenchMarkup({
      addon: "suffix",
      state: "invalid",
      message: true,
    });
    const bothDisabled = inputGroupWorkbenchMarkup({
      addon: "both",
      state: "disabled",
      message: true,
    });
    const withoutMessage = inputGroupWorkbenchMarkup({
      addon: "prefix",
      state: "invalid",
      message: false,
    });

    expect(prefix).toContain('class="oc-input-group"');
    expect(prefix).toContain('class="oc-input-group-addon" id="workbench-input-group-prefix"');
    expect(prefix).toContain("github.com/");
    expect(prefix).toContain("Owner and repository path.");
    expect(prefix).toContain(
      'aria-describedby="workbench-input-group-prefix workbench-input-group-message"',
    );
    expect(prefix).not.toContain("workbench-input-group-suffix");
    expect(suffixInvalid).toContain("seconds");
    expect(suffixInvalid).toContain('aria-invalid="true"');
    expect(suffixInvalid).toContain('value="0"');
    expect(suffixInvalid).toContain("Enter at least 1 second.");
    expect(suffixInvalid).toContain(
      'aria-describedby="workbench-input-group-suffix workbench-input-group-message"',
    );
    expect(bothDisabled).toContain("https://");
    expect(bothDisabled).toContain("/v1");
    expect(bothDisabled).toContain(" disabled");
    expect(bothDisabled).toContain(
      'aria-describedby="workbench-input-group-prefix workbench-input-group-suffix"',
    );
    expect(bothDisabled).not.toContain("oc-field-message");
    expect(withoutMessage).toContain('aria-invalid="true"');
    expect(withoutMessage).toContain('aria-describedby="workbench-input-group-prefix"');
    expect(withoutMessage).not.toContain("oc-field-message");
  });
  test("renders Autocomplete as a free-entry combobox with a controlled listbox", () => {
    const markup = autocompleteWorkbenchMarkup({ value: "Card", disabled: true });

    expect(markup).toContain('class="oc-autocomplete" data-combobox');
    expect(markup).toContain('data-combobox-free-entry="true"');
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain('aria-autocomplete="list"');
    expect(markup).toContain('id="workbench-autocomplete-options" role="listbox" hidden');
    expect(markup).toContain('class="oc-combobox-toggle"');
    expect(markup).toContain('tabindex="-1"');
    expect(markup).toContain('value="Card"');
    expect(markup).toContain(" disabled");
    expect(markup).toContain('role="option" aria-selected="true" data-value="Card"');
    expect(markup).not.toContain("<datalist");
  });
  test("keeps Toast dismissal optional in the rendered markup", () => {
    expect(toastWorkbenchMarkup({ dismissible: true })).toContain('button class="oc-toast-close"');
    expect(toastWorkbenchMarkup({ dismissible: false })).not.toContain("oc-toast-close");
    expect(toastWorkbenchMarkup({ dismissible: false })).toContain('aria-live="polite"');
  });
  test("maps Composer ChatStatus and disabled state to its real affordances", () => {
    expect(composerWorkbenchMarkup({ status: "ready", draft: "Review this" })).toContain(
      'type="submit" data-state="typing" aria-label="Send message"',
    );
    expect(composerWorkbenchMarkup({ status: "submitted" })).toContain(
      'type="button" data-state="stop" aria-label="Stop response"',
    );
    expect(composerWorkbenchMarkup({ status: "streaming" })).not.toContain(
      'aria-label="Send message"',
    );
    expect(composerWorkbenchMarkup({ status: "ready", disabled: true })).toContain(
      'textarea id="workbench-composer-message" class="oc-agent-input" rows="1" placeholder="Send a message..." disabled',
    );
  });
  test("keeps Error Message inline, plain, and free of synthetic actions", () => {
    const interrupted = errorMessageWorkbenchMarkup({ example: "interrupted" });
    const rateLimit = errorMessageWorkbenchMarkup({ example: "rate-limit" });

    expect(interrupted).toContain('role="alert"');
    expect(interrupted).toContain("Something went wrong");
    expect(interrupted).not.toContain("<button");
    expect(rateLimit).toContain("Rate limit reached");
    expect(rateLimit).not.toContain("<button");
  });
  test("renders distinct Markdown content examples", () => {
    expect(markdownWorkbenchMarkup({ example: "release" })).toContain("Release notes");
    expect(markdownWorkbenchMarkup({ example: "table" })).toContain(
      'class="oc-link" href="../../foundations/tokens/"',
    );
    expect(markdownWorkbenchMarkup({ example: "long-form" })).toContain(
      'data-density="article"',
    );
    const streaming = markdownWorkbenchMarkup({ example: "streaming" });
    expect(streaming).toContain("Final answer coming next");
    expect(streaming).toContain('class="oc-code-token-keyword"');
    expect(streaming).toContain('class="oc-code-token-string"');
    expect(streaming).not.toContain('class="code-keyword"');
  });
  test("renders Loader sizes with visible or assistive labels only", () => {
    const small = loaderWorkbenchMarkup({ size: "sm", label: true });
    const medium = loaderWorkbenchMarkup({ size: "md", label: true });
    const large = loaderWorkbenchMarkup({ size: "lg", label: false });

    expect(small).toContain('class="oc-loader oc-loader-sm"');
    expect(small).toContain("<span>Loading…</span>");
    expect(small).not.toContain("sr-only");
    expect(medium).toContain('class="oc-loader"');
    expect(medium).not.toContain("oc-loader-md");
    expect(medium).toContain("<span>Syncing components…</span>");
    expect(large).toContain('class="oc-loader oc-loader-lg"');
    expect(large).toContain('<span class="sr-only">Loading…</span>');
    expect(large).not.toContain("<span>Loading…</span>");
    for (const markup of [small, medium, large]) {
      expect(markup).toContain('role="status" aria-atomic="true"');
      expect(markup).toContain('class="oc-loader-spinner" aria-hidden="true"');
    }

    const reference = getReferenceContent("primitive-loader");
    expect(reference).toContain("primitive-loader-list");
    expect(reference).toContain("oc-loader-sm");
    expect(reference).toContain("oc-loader-lg");
  });
  test("renders Skeleton Line count and width variants with a sized demo shell", () => {
    const oneShort = skeletonLineWorkbenchMarkup({ count: "1", width: "short" });
    const threeMixed = skeletonLineWorkbenchMarkup({ count: "3", width: "mixed" });
    const fiveFull = skeletonLineWorkbenchMarkup({ count: "5", width: "full" });

    expect(oneShort).toContain('class="workbench-skeleton-demo"');
    expect(oneShort).toContain('aria-busy="true"');
    expect(oneShort.match(/class="oc-skeleton-line[^"]*"/g)).toHaveLength(1);
    expect(oneShort).toContain("oc-skeleton-line-short");
    expect(threeMixed.match(/class="oc-skeleton-line"/g)).toHaveLength(2);
    expect(threeMixed.match(/oc-skeleton-line-short/g)).toHaveLength(1);
    expect(fiveFull.match(/class="oc-skeleton-line"/g)).toHaveLength(5);
    expect(fiveFull).not.toContain("oc-skeleton-line-short");
    for (const markup of [oneShort, threeMixed, fiveFull]) {
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).toContain('role="status"');
      expect(markup).toContain("Content is loading…");
    }

    const reference = getReferenceContent("primitive-skeleton-line");
    expect(reference).toContain("workbench-skeleton-demo");
    expect(reference).toContain("oc-skeleton-line-short");
  });
  test("renders Provider Logo marks as inline SVG with size, label, state, and layout variants", () => {
    const defaults = providerLogoWorkbenchMarkup();
    const markOnly = providerLogoWorkbenchMarkup({
      size: "sm",
      label: false,
      state: "selected",
      layout: "marks",
    });
    const muted = providerLogoWorkbenchMarkup({
      size: "lg",
      label: true,
      state: "muted",
      layout: "stack",
    });
    const profiles = providerLogoWorkbenchMarkup({
      size: "sm",
      label: false,
      framed: true,
      state: "muted",
      layout: "profiles",
    });

    expect(defaults).toContain('class="provider-logo-gallery" data-layout="wrap"');
    expect(defaults).toContain('data-provider="openai"');
    expect(defaults).toContain('data-provider="gemini"');
    expect(defaults).toContain('data-provider="xai"');
    expect(defaults).toContain('data-provider="deepseek"');
    expect(defaults).toContain('data-provider="kimi"');
    expect(defaults).toContain('data-provider="perplexity"');
    expect(defaults).toContain("<svg");
    expect(defaults).toContain("<span>OpenAI</span>");
    expect(defaults).toContain("<span>Gemini</span>");
    expect(defaults).toContain("<span>xAI</span>");
    expect(defaults).not.toContain(">O</span>");
    expect(defaults).not.toContain(">G</span>");
    expect(defaults).not.toContain(">X</span>");

    expect(markOnly).toContain("oc-provider-logo-sm");
    expect(markOnly).toContain('data-layout="marks"');
    expect(markOnly).toContain("oc-provider-logo-passive");
    expect(markOnly).toContain('title="OpenAI"');
    expect(markOnly).not.toContain("<span>OpenAI</span>");
    expect(markOnly).not.toContain("oc-provider-logo-muted");

    expect(muted).toContain("oc-provider-logo-lg");
    expect(muted).toContain("oc-provider-logo-muted");
    expect(muted).not.toContain(" disabled");
    expect(muted).toContain('data-layout="stack"');
    expect(muted).not.toContain("data-selected");
    expect(profiles).toContain('data-layout="profiles"');
    expect(profiles).toContain("oc-provider-logo-sm");
    expect(profiles).toContain("oc-provider-logo-framed");
    expect(profiles).toContain("oc-provider-logo-muted");
    expect(profiles).toContain('<span class="sr-only">OpenAI</span>');
    expect(profiles).not.toContain(" disabled");
    expect(profiles).not.toContain("</svg>OpenAI</span>");

    const reference = getReferenceContent("primitive-provider-logo");
    expect(reference).toContain('data-provider="openai"');
    expect(reference).toContain("<svg");
    expect(reference).not.toContain('aria-hidden="true">O</');
  });
  test("renders Spiral Loader at the selected square size", () => {
    const markup = spiralLoaderWorkbenchMarkup({ size: "32" });

    expect(markup).toContain('style="width: 32px; height: 32px"');
    expect(markup).toContain('<span class="sr-only">Working</span>');
  });
  test("renders distinct Text Shimmer timing examples", () => {
    const inline = textShimmerWorkbenchMarkup({ example: "inline" });
    const delayed = textShimmerWorkbenchMarkup({ example: "delayed" });
    const fast = textShimmerWorkbenchMarkup({ example: "fast" });

    expect(inline).toContain("Syncing metadata");
    expect(inline).toContain("animation-duration: 1.4s");
    expect(inline).not.toContain("animation-delay");
    expect(delayed).toContain("Calculating risk score");
    expect(delayed).toContain("animation-duration: 2.2s; animation-delay: 0.6s");
    expect(fast).toContain("Rapid sync");
    expect(fast).toContain("animation-duration: 0.9s");
    expect(fast).not.toContain("animation-delay");
    for (const markup of [inline, delayed, fast]) {
      expect(markup).toContain('class="oc-agent-text-shimmer"');
      expect(markup).toContain('role="status" aria-live="polite"');
    }
  });
  test("renders supported User Message content without synthetic actions", () => {
    const text = userMessageWorkbenchMarkup({ content: "text" });
    const image = userMessageWorkbenchMarkup({ content: "image" });
    const file = userMessageWorkbenchMarkup({ content: "file" });

    expect(text).toContain("Share the latest status.");
    expect(text).not.toContain("oc-agent-user-attachment");
    expect(image).toContain("mobile-reference.png");
    expect(image).toContain("Here is the screenshot.");
    expect(file).toContain("component-spec.md");
    expect(file).toContain("Review the attached component specification.");
    for (const markup of [text, image, file]) {
      expect(markup).toContain('class="oc-agent-user-message"');
      expect(markup).toContain('class="oc-agent-message-meta"');
      expect(markup).not.toContain("<button");
    }
  });
  test("renders exact input-family variants from the reference contract", () => {
    expect(sendButtonWorkbenchMarkup({ state: "idle" })).toContain("disabled");
    expect(sendButtonWorkbenchMarkup({ state: "typing" })).toContain('aria-label="Send message"');
    expect(sendButtonWorkbenchMarkup({ state: "streaming" })).toContain('data-state="stop"');
    expect(attachmentButtonWorkbenchMarkup({ icon: "plus" })).toContain('aria-label="Attach"');
    expect(attachmentButtonWorkbenchMarkup({ icon: "plus" })).toContain('data-lucide="plus"');
    expect(attachmentButtonWorkbenchMarkup({ icon: "paperclip" })).toContain(
      'data-lucide="paperclip"',
    );
    expect(suggestionsWorkbenchMarkup({ disabled: true })).toContain(" disabled");
    expect(modelPickerWorkbenchMarkup({ model: "anthropic/claude-opus-4-8" })).toContain(
      'data-workbench-application-model="anthropic/claude-opus-4-8"',
    );
    expect(modelPickerWorkbenchMarkup({ model: "anthropic/claude-opus-4-8" })).toContain(
      "<strong>Claude Opus 4.8</strong>",
    );
    expect(modelPickerWorkbenchMarkup({ model: "anthropic/claude-opus-4-8" })).toContain(
      "<small>Anthropic</small>",
    );
    expect(modelPickerWorkbenchMarkup({ model: "anthropic/claude-opus-4-8" })).toContain(
      'data-workbench-model-provider="anthropic"',
    );
    expect(modelPickerWorkbenchMarkup()).toContain(
      'data-workbench-application-model="xai/grok-4" data-model-provider="xAI" hidden',
    );
    expect(
      modelPickerWorkbenchMarkup({ model: "google/gemini-2.5-pro" }),
    ).not.toContain(
      'data-workbench-application-model="google/gemini-2.5-pro" data-model-provider="Google" hidden',
    );
    const filteredModelPicker = modelPickerWorkbenchMarkup({
      modelProvider: "google",
      modelQuery: "gem",
    });
    expect(filteredModelPicker).toContain(
      'aria-pressed="true" data-workbench-model-provider="google"',
    );
    expect(filteredModelPicker).toContain(
      'data-workbench-application-model="google/gemini-2.5-pro" data-model-provider="Google"',
    );
    expect(filteredModelPicker).toContain('value="gem" data-workbench-model-search');
    const providerFilteredModelPicker = modelPickerWorkbenchMarkup({
      modelProvider: "xai",
      modelQuery: "grok",
    });
    expect(providerFilteredModelPicker).toContain(
      'data-workbench-application-model="xai/grok-4" data-model-provider="xAI"',
    );
    expect(providerFilteredModelPicker).not.toContain(
      'data-workbench-application-model="xai/grok-4" data-model-provider="xAI" hidden',
    );
    expect(modelPickerWorkbenchMarkup()).toContain("data-workbench-model-reset disabled");
    expect(modelPickerWorkbenchMarkup({ fast: false })).not.toContain(
      "data-workbench-model-reset disabled",
    );
    expect(modelPickerWorkbenchMarkup({ locked: true })).toContain(" disabled");
    expect(workspaceApplicationMarkup({ draft: "Keep this draft" })).toContain(
      "data-workbench-composer-input>Keep this draft</textarea>",
    );
    expect(quickChatApplicationMarkup({ draft: "Quick draft" })).toContain(
      "data-workbench-composer-input>Quick draft</textarea>",
    );
    expect(agentChatWorkbenchMarkup({ draft: "Agent draft" })).toContain(
      "data-workbench-composer-input>Agent draft</textarea>",
    );
    expect(modeSelectorWorkbenchMarkup({ value: "plan" })).toContain(
      "<span data-agent-mode-label>Plan</span>",
    );
  });
  test("keeps File Attachment display and removal independently configurable", () => {
    expect(
      fileAttachmentWorkbenchMarkup({ kind: "image", display: "image-only", removable: true }),
    ).toContain('data-display="image-only"');
    expect(
      fileAttachmentWorkbenchMarkup({ kind: "image", display: "image-only", removable: true }),
    ).toContain('aria-label="Remove interface.png"');
    expect(
      fileAttachmentWorkbenchMarkup({ kind: "file", display: "image-only", removable: false }),
    ).not.toContain('data-display="image-only"');
    expect(fileAttachmentWorkbenchMarkup({ kind: "file", removable: false })).not.toContain(
      "oc-agent-file-remove",
    );
  });
  test("shows sidebar fades only toward hidden navigation content", () => {
    expect(getScrollFadeState(0, 600, 900)).toEqual({ up: false, down: true });
    expect(getScrollFadeState(150, 600, 900)).toEqual({ up: true, down: true });
    expect(getScrollFadeState(300, 600, 900)).toEqual({ up: true, down: false });
    expect(getScrollFadeState(0, 600, 600)).toEqual({ up: false, down: false });
  });
  test("switches tab panels and wraps arrow-key navigation", () => {
    class Tab extends EventTarget {
      attributes = new Map();
      tabIndex = 0;
      focused = false;
      constructor(controls) {
        super();
        this.attributes.set("aria-controls", controls);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      focus() {
        this.focused = true;
      }
    }

    const first = new Tab("first-panel");
    const second = new Tab("second-panel");
    const panels = [
      { id: "first-panel", hidden: false },
      { id: "second-panel", hidden: true },
    ];
    const tabset = {
      querySelectorAll(selector) {
        return selector === '[role="tab"]' ? [first, second] : panels;
      },
    };
    const root = { querySelectorAll: () => [tabset] };

    expect(bindTabs(root)).toBe(1);
    second.dispatchEvent(new Event("click"));
    expect(second.getAttribute("aria-selected")).toBe("true");
    expect(panels.map((panel) => panel.hidden)).toEqual([true, false]);

    const left = new Event("keydown", { cancelable: true });
    Object.defineProperty(left, "key", { value: "ArrowLeft" });
    first.dispatchEvent(left);
    expect(second.focused).toBe(true);
    expect(second.getAttribute("aria-selected")).toBe("true");

    second.focused = false;
    first.focused = false;
    second.dispatchEvent(keyboardEvent("Home"));
    expect(first.focused).toBe(true);
    first.dispatchEvent(keyboardEvent("End"));
    expect(second.focused).toBe(true);

    const markup = getReferenceContent("primitive-tabs");
    expect(markup).toContain('type="button"');
    expect(markup).toContain('id="component-tabs-preview-trigger"');
    expect(markup).not.toContain('id="tab-preview"');
  });
  test("restores keyed tab selections without moving the page", () => {
    class Tab extends EventTarget {
      attributes = new Map();
      dataset;
      tabIndex = 0;
      constructor(value, controls, selected = false) {
        super();
        this.dataset = { tabValue: value };
        this.attributes.set("aria-controls", controls);
        this.attributes.set("aria-selected", String(selected));
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      focus() {}
    }

    const createTabset = () => {
      const tabs = [new Tab("usage", "usage-panel", true), new Tab("code", "code-panel")];
      const panels = [
        { id: "usage-panel", hidden: false },
        { id: "code-panel", hidden: true },
      ];
      const scrollingElement = { scrollLeft: 12, scrollTop: 240 };
      return {
        tabs,
        panels,
        tabset: {
          dataset: { tabsKey: "component-workbench-avatar" },
          ownerDocument: { scrollingElement },
          querySelectorAll(selector) {
            return selector === '[role="tab"]' ? tabs : panels;
          },
        },
        scrollingElement,
      };
    };

    const first = createTabset();
    bindTabs({ querySelectorAll: () => [first.tabset] });
    first.tabs[1].dispatchEvent(new Event("click"));
    expect(first.scrollingElement.scrollTop).toBe(240);

    const second = createTabset();
    bindTabs({ querySelectorAll: () => [second.tabset] });
    expect(second.tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(second.panels.map((panel) => panel.hidden)).toEqual([true, false]);
    expect(second.scrollingElement.scrollTop).toBe(240);
  });
  test("reveals and conceals a sensitive value through its named control", () => {
    class Input extends EventTarget {
      type = "password";
      value = "secret";
    }
    class Toggle extends EventTarget {
      attributes = new Map();
      innerHTML = "";
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
    }

    const input = new Input();
    const maskText = { textContent: "", style: { transform: "" } };
    const mask = {
      hidden: false,
      querySelector: () => maskText,
    };
    const toggle = new Toggle();
    toggle.setAttribute("data-sensitive-label", "API key");
    const control = {
      dataset: {},
      querySelector(selector) {
        if (selector === "[data-sensitive-value]") return input;
        if (selector === "[data-sensitive-mask]") return mask;
        if (selector === "[data-toggle-sensitive]") return toggle;
        return null;
      },
    };
    const root = { querySelectorAll: () => [control] };

    expect(bindSensitiveInputs(root)).toBe(1);
    expect(control.dataset.revealed).toBe("false");
    expect(control.dataset.sensitiveMaskReady).toBe("true");
    expect(maskText.textContent).toBe("******");
    expect(toggle.innerHTML).toContain('data-lucide="eye"');
    input.value = "longer-key";
    input.dispatchEvent(new Event("input"));
    expect(maskText.textContent).toBe("**********");
    expect(maskText.textContent).not.toContain(input.value);
    toggle.dispatchEvent(new Event("click"));
    expect(input.type).toBe("text");
    expect(control.dataset.revealed).toBe("true");
    expect(mask.hidden).toBe(true);
    expect(maskText.textContent).toBe("");
    expect(toggle.innerHTML).toContain('data-lucide="eye-off"');
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("Hide API key");

    toggle.dispatchEvent(new Event("click"));
    expect(input.type).toBe("password");
    expect(control.dataset.revealed).toBe("false");
    expect(mask.hidden).toBe(false);
    expect(maskText.textContent).toBe("**********");
    expect(toggle.innerHTML).toContain('data-lucide="eye"');
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(toggle.getAttribute("aria-label")).toBe("Show API key");
  });
  test("binds the interaction example to its own dialog", () => {
    const trigger = new EventTarget();
    let exampleOpens = 0;
    let searchOpens = 0;
    const exampleDialog = { showModal: () => exampleOpens++ };
    const searchDialog = { showModal: () => searchOpens++ };
    const root = {
      querySelector(selector) {
        if (selector === "[data-open-dialog]") return trigger;
        if (selector === exampleDialogSelector) return exampleDialog;
        if (selector === "dialog") return searchDialog;
        return null;
      },
    };

    expect(bindExampleDialog(root)).toBe(true);
    trigger.dispatchEvent(new Event("click"));
    expect(exampleOpens).toBe(1);
    expect(searchOpens).toBe(0);

    const markup = getReferenceContent("interface-examples");
    expect(markup).toContain(exampleDialogAttribute);
    expect(markup).toContain('aria-labelledby="interaction-example-dialog-title"');
    expect(markup).toContain('id="interaction-example-dialog-title"');
  });
  test("resolves and schedules token deep links after the catalog renders", () => {
    expect(resolveTokenHash("#token-group-font")).toEqual({
      targetId: "token-group-font",
      groupId: "font",
    });
    expect(resolveTokenHash("#token-oc-font-display")).toEqual({
      targetId: "token-oc-font-display",
      groupId: "font",
    });
    expect(resolveTokenHash("#missing")).toBeNull();

    const frames = [];
    let scrollOptions;
    const state = syncTokenHash("#token-group-font", {
      getElementById: (id) =>
        id === "token-group-font"
          ? { scrollIntoView: (options) => (scrollOptions = options) }
          : null,
      schedule: (callback) => frames.push(callback),
    });

    expect(state).toEqual({ targetId: "token-group-font", groupId: "font" });
    expect(scrollOptions).toBeUndefined();
    frames.shift()();
    expect(scrollOptions).toBeUndefined();
    frames.shift()();
    expect(scrollOptions).toEqual({ block: "start" });
  });
  test("publishes the current project skill installation contract", () => {
    expect(skillsInstallCommand).toContain("npx skills@1.5.16 add");
    expect(skillsInstallCommand).toContain("openclaw-design");
    expect(skillsInstallCommand).toContain("openclaw-design-audit");
    expect(skillsInstallCommand).toContain("--agent codex");
    expect(skillsUpdateCommand).toBe("npx skills@1.5.16 update --project --yes");

    const skills = getReferenceContent("resource-skills");
    const release = getReferenceContent("resource-release");
    expect(skills).toContain(skillsInstallCommand);
    expect(skills).toContain(skillsUpdateCommand);
    expect(skills).toContain("repository default branch");
    expect(release).toContain("Agent guidance follows the repository default branch");
    expect(release).not.toContain("Runtime assets and skills always release together");
  });
  test("brand banner varies the crab artwork instead of adding assets", () => {
    const banner = brandBannerWorkbenchMarkup({
      variant: "close",
      shader: "dither",
      tone: "ocean",
    });
    expect(banner).toContain("carapace-home-artwork");
    expect(banner).toContain('data-variant="close"');
    expect(banner).toContain('data-shader="dither"');
    expect(banner).toContain('data-tone="ocean"');
    expect(brandBannerWorkbenchMarkup({ asset: "mark" })).toContain("openclaw-mark");
    expect(brandBannerWorkbenchMarkup({ asset: "lobster" })).toContain(
      "carapace-lobster-artwork",
    );
    expect(brandBannerWorkbenchMarkup({ asset: "hermit" })).toContain(
      "carapace-hermit-artwork",
    );
    // Every tone is a four-step palette the shader can index directly.
    for (const palette of Object.values(bannerTones)) {
      expect(palette).toHaveLength(4);
    }
  });
});
