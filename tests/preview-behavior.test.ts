import { describe, expect, test } from "bun:test";
import {
  bindAgentComponentDemos,
  findAgentSuggestionTarget,
  normalizeAgentDraft,
} from "../preview/agent-components-interactions.js";
import { getAgentReferenceContent } from "../preview/agent-components.js";
import {
  operationsApplicationMarkup,
  settingsApplicationMarkup,
  workspaceApplicationMarkup,
} from "../preview/application-screens.js";
import {
  bindExampleDialog,
  exampleDialogAttribute,
  exampleDialogSelector,
} from "../preview/interaction.js";
import { bindCombobox } from "../preview/combobox.js";
import { bindCommandPalettes } from "../preview/command-palette.js";
import { bindDropdowns } from "../preview/dropdown.js";
import { bindMenuBars } from "../preview/menu-bar.js";
import { bindToolbars } from "../preview/toolbar.js";
import { bindToasts } from "../preview/toast.js";
import { bindTooltips } from "../preview/tooltip.js";
import {
  getReferenceContent,
  skillsInstallCommand,
  skillsUpdateCommand,
} from "../preview/reference-content.js";
import { resolveTokenHash, syncTokenHash } from "../preview/token-catalog.js";
import { bindTabs } from "../preview/tabs.js";
import { getScrollFadeState } from "../preview/shell.js";
import { setCurrentSidebarLink } from "../preview/sidebar.js";
import { setCurrentTableOfContentsLink } from "../preview/table-of-contents.js";
import { bindSensitiveInputs } from "../preview/sensitive-input.js";
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
  errorMessageWorkbenchMarkup,
  fileAttachmentWorkbenchMarkup,
  appSurfaceWorkbenchMarkup,
  heroWorkbenchMarkup,
  sectionWorkbenchMarkup,
  inputAreaWorkbenchMarkup,
  inputGroupWorkbenchMarkup,
  linkWorkbenchMarkup,
  loaderWorkbenchMarkup,
  skeletonLineWorkbenchMarkup,
  messageListWorkbenchMarkup,
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
  toolWorkbenchMarkup,
  todoToolWorkbenchMarkup,
  planToolWorkbenchMarkup,
  questionToolWorkbenchMarkup,
  toastWorkbenchMarkup,
  userMessageWorkbenchMarkup,
} from "../preview/component-workbench-config.js";

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
      '<a class="oc-link" href="/foundations/" data-workbench-inert-link>Inline link</a>',
    );
    expect(linkWorkbenchMarkup({ variant: "muted" })).toBe(
      '<a class="oc-link oc-link-muted" href="/resources/" data-workbench-inert-link>Muted link</a>',
    );
    expect(linkWorkbenchMarkup({ variant: "standalone" })).toBe(
      '<a class="oc-link oc-link-standalone" href="/components/" data-workbench-inert-link>Browse components</a>',
    );
    expect(linkWorkbenchMarkup({ variant: "standalone" })).not.toContain("data-lucide");
    expect(linkWorkbenchMarkup({ variant: "standalone" })).not.toContain("→");
    expect(linkWorkbenchMarkup({ variant: "standalone", disabled: true })).toBe(
      '<a class="oc-link oc-link-standalone" role="link" aria-disabled="true" tabindex="-1">Browse components</a>',
    );

    const reference = getReferenceContent("primitive-link");
    expect(reference).toContain('class="oc-link oc-link-standalone"');
    expect(reference).toContain(">Browse components</a>");
    expect(reference).not.toMatch(
      /oc-link-standalone[^>]*>Browse components[\s\S]*?data-lucide="arrow-right"/,
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
      '<button class="oc-action oc-action-secondary" type="button">Review</button>',
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

  test("renders Settings as shared anatomy with existing controls and connection states", () => {
    const ready = settingsApplicationMarkup();
    const compactOffline = settingsApplicationMarkup({
      navigation: "compact",
      density: "compact",
      state: "offline",
    });

    expect(ready).toContain('class="oc-app-frame" data-navigation="expanded"');
    expect(ready).toContain('class="oc-settings-group"');
    expect(ready).toContain('class="oc-switch" type="checkbox" role="switch"');
    expect(ready).toContain('class="oc-segmented" role="group" aria-label="Theme"');
    expect(ready).toContain('class="oc-segmented" role="group" aria-label="Interface density"');
    expect(compactOffline).toContain('data-navigation="compact"');
    expect(compactOffline).toContain('data-density="compact"');
    expect(compactOffline).toContain("Gateway unavailable");
    expect(compactOffline).toContain("oc-status-error");
  });

  test("renders Operations with channel, automation, loading, and error states", () => {
    const channels = operationsApplicationMarkup();
    const loading = operationsApplicationMarkup({ state: "loading" });
    const automationLoading = operationsApplicationMarkup({
      view: "automation",
      state: "loading",
    });
    const automationError = operationsApplicationMarkup({
      view: "automation",
      state: "error",
    });

    expect(channels).toContain('class="oc-pane oc-master-detail"');
    expect(channels).toContain("Channel network");
    expect(channels).toContain('class="oc-summary-strip"');
    expect(channels).toContain('class="oc-resource-list"');
    expect(channels).toContain("Recent delivery");
    expect(channels).toContain("Discord");
    expect(channels).toContain('aria-pressed="true"');
    expect(channels).not.toContain("aria-selected");
    expect(loading).toContain("Loading Discord configuration");
    expect(automationLoading).toContain("Loading automation configuration");
    expect(automationError).toContain("Scheduled work");
    expect(automationError).toContain("Last run failed");
  });

  test("renders Workspace with right, bottom, and hidden inspector modes", () => {
    const right = workspaceApplicationMarkup();
    const bottom = workspaceApplicationMarkup({ dock: "bottom", status: "idle" });
    const hidden = workspaceApplicationMarkup({ dock: "hidden", inspector: false });

    expect(right).toContain('data-dock="right"');
    expect(right).toContain('class="oc-workspace-grid"');
    expect(right).toContain('data-inspector="true"');
    expect(right).toContain('aria-label="Sessions"');
    expect(right).toContain('aria-label="Inspector"');
    expect(bottom).toContain('data-dock="bottom"');
    expect(bottom).toContain('data-inspector="true"');
    expect(bottom).toContain("Agent idle");
    expect(hidden).not.toContain('aria-label="Inspector"');
    expect(hidden).toContain('data-inspector="false"');
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
    expect(markdownWorkbenchMarkup({ example: "table" })).toContain("Validation results");
    expect(markdownWorkbenchMarkup({ example: "streaming" })).toContain("Final answer coming next");
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
      layout: "row",
    });
    const muted = providerLogoWorkbenchMarkup({
      size: "lg",
      label: true,
      state: "muted",
      layout: "stack",
    });

    expect(defaults).toContain('class="provider-logo-gallery" data-layout="wrap"');
    expect(defaults).toContain('data-provider="openai"');
    expect(defaults).toContain('data-provider="gemini"');
    expect(defaults).toContain('data-provider="xai"');
    expect(defaults).toContain("<svg");
    expect(defaults).toContain("<span>OpenAI</span>");
    expect(defaults).toContain("<span>Gemini</span>");
    expect(defaults).toContain("<span>xAI</span>");
    expect(defaults).not.toContain(">O</span>");
    expect(defaults).not.toContain(">G</span>");
    expect(defaults).not.toContain(">X</span>");

    expect(markOnly).toContain("oc-provider-logo-sm");
    expect(markOnly).toContain('data-layout="row"');
    expect(markOnly).toContain('data-selected="true"');
    expect(markOnly).toContain('aria-label="OpenAI"');
    expect(markOnly).not.toContain("<span>OpenAI</span>");
    expect(markOnly).not.toContain("oc-provider-logo-muted");

    expect(muted).toContain("oc-provider-logo-lg");
    expect(muted).toContain("oc-provider-logo-muted");
    expect(muted).toContain('aria-disabled="true"');
    expect(muted).toContain('data-layout="stack"');
    expect(muted).not.toContain("data-selected");

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
    expect(modelPickerWorkbenchMarkup({ value: "gpt-5-6" })).toContain(
      'type="radio" name="workbench-agent-model" value="gpt-5-6" checked',
    );
    expect(modelPickerWorkbenchMarkup({ value: "gpt-5-6" })).toContain("<strong>GPT-5.6</strong>");
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

  test("maps shared tool lifecycle into visible running and complete output", () => {
    expect(toolWorkbenchMarkup({ kind: "bash", state: "animating", open: true })).toContain(
      "Running command",
    );
    expect(toolWorkbenchMarkup({ kind: "bash", state: "animating", open: true })).not.toContain(
      "29 pass · 0 fail",
    );
    expect(toolWorkbenchMarkup({ kind: "bash", state: "complete", open: true })).toContain(
      "29 pass · 0 fail",
    );
    expect(toolWorkbenchMarkup({ kind: "search", state: "complete", open: false })).not.toContain(
      " open",
    );
    expect(toolWorkbenchMarkup({ kind: "thinking", state: "animating" })).toContain("Thinking");
  });

  test("keeps specialized tool states faithful to their public data", () => {
    expect(todoToolWorkbenchMarkup({ status: "pending" })).toContain('data-state="pending"');
    expect(todoToolWorkbenchMarkup({ status: "in_progress" })).toContain('data-state="active"');
    expect(todoToolWorkbenchMarkup({ status: "completed" })).toContain('data-state="complete"');
    expect(planToolWorkbenchMarkup({ state: "complete", approved: true })).toContain("Approved");
    expect(questionToolWorkbenchMarkup({ state: "answered", allowSkip: true })).toContain(
      "Small scoped patch",
    );
    expect(questionToolWorkbenchMarkup({ state: "open", allowSkip: false })).not.toContain(
      "data-agent-question-skip",
    );
  });

  test("renders distinct Agent Chat empty, streaming, and error states", () => {
    expect(agentChatWorkbenchMarkup({ example: "empty", status: "ready" })).not.toContain(
      "Conversation history",
    );
    expect(agentChatWorkbenchMarkup({ example: "suggestions", status: "ready" })).toContain(
      'aria-label="Suggested prompts"',
    );
    expect(agentChatWorkbenchMarkup({ example: "basic", status: "streaming" })).toContain(
      'data-status="streaming"',
    );
    expect(agentChatWorkbenchMarkup({ example: "basic", status: "error" })).toContain(
      "Request failed",
    );
    expect(agentChatWorkbenchMarkup({ example: "empty", status: "error" })).toContain(
      "Request failed",
    );
  });

  test("keeps transcript copy actions opt-in", () => {
    expect(messageListWorkbenchMarkup({ status: "ready", copyToolbar: true })).toContain(
      "Copy response",
    );
    expect(messageListWorkbenchMarkup({ status: "ready", copyToolbar: false })).not.toContain(
      "Copy response",
    );
  });

  test("moves table-of-contents location to the selected section", () => {
    class Link {
      attributes = new Map();
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
    }

    const overview = new Link();
    const guidance = new Link();
    overview.setAttribute("aria-current", "location");
    const nav = { querySelectorAll: () => [overview, guidance] };

    expect(setCurrentTableOfContentsLink(nav, guidance)).toBe(true);
    expect(overview.getAttribute("aria-current")).toBeUndefined();
    expect(guidance.getAttribute("aria-current")).toBe("location");
  });

  test("moves sidebar current-page state to the selected destination", () => {
    class Link {
      attributes = new Map();
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
    }

    const overview = new Link();
    const activity = new Link();
    overview.setAttribute("aria-current", "page");
    const nav = { querySelectorAll: () => [overview, activity] };

    expect(setCurrentSidebarLink(nav, activity)).toBe(true);
    expect(overview.getAttribute("aria-current")).toBeUndefined();
    expect(activity.getAttribute("aria-current")).toBe("page");
  });

  test("keeps combobox active state aligned with filtered options", () => {
    class Element extends EventTarget {
      attributes = new Map();
      dataset = {};
      hidden = false;
      value = "";
      focused = false;
      constructor({ id = "", text = "" } = {}) {
        super();
        this.id = id;
        this.textContent = text;
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
      focus() {
        this.focused = true;
      }
    }

    const input = new Element();
    const toggle = new Element();
    const options = [
      new Element({ id: "option-action", text: "Action" }),
      new Element({ id: "option-button", text: "Button" }),
      new Element({ id: "option-card", text: "Card" }),
    ];
    const listbox = new Element();
    listbox.querySelectorAll = () => options;
    const control = new Element();
    control.querySelector = (selector) =>
      ({
        "[role='combobox']": input,
        "[data-combobox-toggle]": toggle,
        "[role='listbox']": listbox,
      })[selector];
    control.contains = (target) => [input, toggle, listbox, ...options].includes(target);
    const root = { querySelectorAll: () => [control] };

    expect(bindCombobox(root)).toBe(1);
    expect(bindCombobox(root)).toBe(0);

    input.value = "zz";
    input.dispatchEvent(new Event("input"));
    expect(options.every(({ hidden }) => hidden)).toBe(true);
    expect(listbox.hidden).toBe(true);
    expect(input.getAttribute("aria-activedescendant")).toBeUndefined();
    expect(options.some(({ attributes }) => attributes.has("data-active"))).toBe(false);

    input.value = "";
    input.dispatchEvent(new Event("input"));
    expect(listbox.hidden).toBe(false);
    expect(input.getAttribute("aria-activedescendant")).toBe("option-action");

    input.dispatchEvent(keyboardEvent("ArrowUp"));
    expect(input.getAttribute("aria-activedescendant")).toBe("option-card");

    const home = keyboardEvent("Home");
    input.dispatchEvent(home);
    expect(home.defaultPrevented).toBe(false);
    expect(input.getAttribute("aria-activedescendant")).toBe("option-card");

    const end = keyboardEvent("End");
    input.dispatchEvent(end);
    expect(end.defaultPrevented).toBe(false);
    expect(input.getAttribute("aria-activedescendant")).toBe("option-card");

    input.dispatchEvent(keyboardEvent("Enter"));
    expect(input.value).toBe("Card");
    expect(options[2].getAttribute("aria-selected")).toBe("true");

    input.value = "missing";
    input.dispatchEvent(new Event("input"));
    expect(options.every(({ attributes }) => attributes.get("aria-selected") === "false")).toBe(
      true,
    );
    input.dispatchEvent(keyboardEvent("Enter"));
    expect(input.value).toBe("missing");
    expect(options.every(({ attributes }) => attributes.get("aria-selected") !== "true")).toBe(
      true,
    );
  });

  test("filters and keyboard-navigates command palette results", () => {
    class Element extends EventTarget {
      attributes = new Map();
      hidden = false;
      value = "";
      textContent = "";
      focused = false;
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
      focus() {
        this.focused = true;
      }
    }

    const trigger = new Element();
    const input = new Element();
    const status = new Element();
    const empty = new Element();
    empty.hidden = true;
    const items = ["Open components", "Inspect tokens", "Switch theme"].map((label) => {
      const item = new Element();
      item.textContent = label;
      return item;
    });
    const dialog = new Element();
    dialog.showModal = () => {};
    dialog.close = () => dialog.dispatchEvent(new Event("close"));
    const palette = {
      querySelector(selector) {
        return {
          dialog,
          "[data-command-palette-open]": trigger,
          "[data-command-palette-input]": input,
          "[data-command-palette-status]": status,
          "[data-command-palette-empty]": empty,
        }[selector];
      },
      querySelectorAll: () => items,
    };
    const root = { querySelectorAll: () => [palette] };

    expect(bindCommandPalettes(root)).toBe(1);
    expect(status.textContent).toBe("3 commands available.");
    expect(items[0].attributes.has("data-active")).toBe(true);

    input.value = "missing";
    input.dispatchEvent(new Event("input"));
    expect(empty.hidden).toBe(false);
    expect(status.textContent).toBe("0 commands available.");

    input.value = "";
    input.dispatchEvent(new Event("input"));
    const home = keyboardEvent("Home");
    input.dispatchEvent(home);
    expect(home.defaultPrevented).toBe(false);
    expect(items.every((item) => !item.focused)).toBe(true);

    input.dispatchEvent(keyboardEvent("ArrowDown"));
    expect(items[0].focused).toBe(true);
    items[0].dispatchEvent(keyboardEvent("End"));
    expect(items[2].focused).toBe(true);
    items[2].focused = false;
    items[0].dispatchEvent(keyboardEvent("ArrowUp"));
    expect(items[2].focused).toBe(true);

    const markup = getReferenceContent("primitive-command-palette");
    expect(markup).toContain('class="oc-command-palette-status sr-only"');
    expect(markup).toContain('class="oc-command-palette-search-icon"');
    expect(markup).toContain('class="oc-command-palette-item-label"');
    expect(markup).toContain('class="oc-command-palette-item-keys"');
    expect(markup).toContain('class="oc-command-palette-footer"');
  });

  test("activates the current command from the search input with Enter", () => {
    class Element extends EventTarget {
      attributes = new Map();
      hidden = false;
      value = "";
      textContent = "";
      clickCount = 0;
      focused = false;
      onClick = null;
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
      closest(selector) {
        return selector === "[data-command-palette-item]" ? this : null;
      }
      focus() {
        this.focused = true;
      }
      click() {
        this.clickCount += 1;
        this.onClick?.();
      }
    }

    const trigger = new Element();
    const input = new Element();
    const items = ["Open components", "Inspect tokens", "Switch theme"].map((label) => {
      const item = new Element();
      item.textContent = label;
      return item;
    });
    const dialog = new Element();
    dialog.showModal = () => {};
    dialog.close = () => dialog.dispatchEvent(new Event("close"));
    for (const item of items) {
      item.onClick = () => {
        const click = new Event("click");
        Object.defineProperty(click, "target", { value: item });
        dialog.dispatchEvent(click);
      };
    }
    const palette = {
      querySelector(selector) {
        return {
          dialog,
          "[data-command-palette-open]": trigger,
          "[data-command-palette-input]": input,
        }[selector];
      },
      querySelectorAll: () => items,
    };
    const root = { querySelectorAll: () => [palette] };

    expect(bindCommandPalettes(root)).toBe(1);

    input.value = "tokens";
    input.dispatchEvent(new Event("input"));
    const enter = keyboardEvent("Enter");
    input.dispatchEvent(enter);

    expect(enter.defaultPrevented).toBe(true);
    expect(items.map(({ clickCount }) => clickCount)).toEqual([0, 1, 0]);
    expect(trigger.focused).toBe(true);
    expect(input.value).toBe("");

    input.value = "missing";
    input.dispatchEvent(new Event("input"));
    const emptyEnter = keyboardEvent("Enter");
    input.dispatchEvent(emptyEnter);

    expect(emptyEnter.defaultPrevented).toBe(false);
    expect(items.map(({ clickCount }) => clickCount)).toEqual([0, 1, 0]);
  });

  test("moves focus through dropdown menus and closes after native Tab focus", async () => {
    class Element extends EventTarget {
      attributes = new Map();
      handlers = {};
      hidden = false;
      disabled = false;
      focused = false;
      addEventListener(type, handler) {
        this.handlers[type] = handler;
        super.addEventListener(type, handler);
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      closest(selector) {
        return selector === "[role='menuitem']" ? this : null;
      }
      focus() {
        this.focused = true;
      }
    }

    const trigger = new Element();
    const menu = new Element();
    menu.hidden = true;
    const items = [new Element(), new Element(), new Element()];
    const disabledItem = new Element();
    disabledItem.setAttribute("aria-disabled", "true");
    menu.querySelectorAll = () => [...items, disabledItem];
    const dropdown = new Element();
    dropdown.querySelector = (selector) =>
      ({
        "[data-dropdown-trigger]": trigger,
        "[role='menu']": menu,
      })[selector];
    dropdown.contains = (target) => [trigger, menu, ...items].includes(target);
    const rootHandlers = {};
    const root = {
      querySelectorAll: () => [dropdown],
      addEventListener: (type, handler) => {
        rootHandlers[type] = handler;
      },
    };

    expect(bindDropdowns(root)).toBe(1);
    trigger.dispatchEvent(new Event("click"));
    expect(menu.hidden).toBe(false);
    expect(items[0].focused).toBe(true);

    items[0].dispatchEvent(keyboardEvent("ArrowDown"));
    expect(items[1].focused).toBe(true);
    items[1].dispatchEvent(keyboardEvent("End"));
    expect(items[2].focused).toBe(true);
    items[2].dispatchEvent(keyboardEvent("Home"));
    expect(items[0].focused).toBe(true);

    const afterMenu = new Element();
    const tab = keyboardEvent("Tab");
    items[0].dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
    expect(menu.hidden).toBe(false);
    afterMenu.focus();
    const focusout = new Event("focusout");
    Object.defineProperty(focusout, "relatedTarget", { value: afterMenu });
    dropdown.dispatchEvent(focusout);
    await Promise.resolve();
    expect(menu.hidden).toBe(true);

    trigger.dispatchEvent(new Event("click"));
    const beforeMenu = new Element();
    const shiftTab = keyboardEvent("Tab");
    Object.defineProperty(shiftTab, "shiftKey", { value: true });
    items[0].dispatchEvent(shiftTab);
    expect(shiftTab.defaultPrevented).toBe(false);
    expect(menu.hidden).toBe(false);
    beforeMenu.focus();
    const reverseFocusout = new Event("focusout");
    Object.defineProperty(reverseFocusout, "relatedTarget", { value: beforeMenu });
    dropdown.dispatchEvent(reverseFocusout);
    await Promise.resolve();
    expect(menu.hidden).toBe(true);

    trigger.dispatchEvent(new Event("click"));
    items[0].dispatchEvent(keyboardEvent("Escape"));
    expect(trigger.focused).toBe(true);

    trigger.dispatchEvent(new Event("click"));
    rootHandlers.click({ target: new Element() });
    expect(menu.hidden).toBe(true);

    trigger.dispatchEvent(new Event("click"));
    dropdown.handlers.click({ target: disabledItem });
    expect(menu.hidden).toBe(false);
    dropdown.handlers.click({ target: items[0] });
    expect(menu.hidden).toBe(true);
  });

  test("roves across menu bar items and opens their menus", () => {
    class Element extends EventTarget {
      attributes = new Map();
      hidden = false;
      focused = false;
      tabIndex = 0;
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      focus() {
        this.focused = true;
      }
    }

    const menuItems = [new Element(), new Element()];
    const menu = new Element();
    menu.hidden = true;
    menu.querySelectorAll = () => menuItems;
    const dropdown = { querySelector: () => menu };
    const first = new Element();
    first.closest = () => dropdown;
    const second = new Element();
    second.closest = () => null;
    const menubar = { querySelectorAll: () => [first, second] };
    const root = { querySelectorAll: () => [menubar] };

    expect(bindMenuBars(root)).toBe(1);
    expect([first.tabIndex, second.tabIndex]).toEqual([0, -1]);

    first.dispatchEvent(keyboardEvent("ArrowRight"));
    expect(second.focused).toBe(true);
    expect([first.tabIndex, second.tabIndex]).toEqual([-1, 0]);
    second.dispatchEvent(keyboardEvent("ArrowLeft"));
    expect(first.focused).toBe(true);

    first.dispatchEvent(keyboardEvent("ArrowDown"));
    expect(menu.hidden).toBe(false);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    expect(menuItems[0].focused).toBe(true);
  });

  test("roves through toolbar controls and toggles pressed state", () => {
    class Button extends EventTarget {
      attributes = new Map();
      focused = false;
      tabIndex = 0;
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      hasAttribute(name) {
        return this.attributes.has(name);
      }
      focus() {
        this.focused = true;
      }
    }

    const bold = new Button();
    bold.setAttribute("aria-pressed", "true");
    const italic = new Button();
    italic.setAttribute("aria-pressed", "false");
    const unavailable = new Button();
    unavailable.setAttribute("aria-disabled", "true");
    unavailable.setAttribute("aria-pressed", "false");
    const link = new Button();
    const toolbar = { querySelectorAll: () => [bold, italic, unavailable, link] };
    const root = { querySelectorAll: () => [toolbar] };

    expect(bindToolbars(root)).toBe(1);
    expect([bold.tabIndex, italic.tabIndex, link.tabIndex]).toEqual([0, -1, -1]);
    expect(unavailable.tabIndex).toBe(-1);

    bold.dispatchEvent(keyboardEvent("ArrowRight"));
    expect(italic.focused).toBe(true);
    italic.dispatchEvent(keyboardEvent("ArrowRight"));
    expect(link.focused).toBe(true);
    expect(unavailable.focused).toBe(false);
    italic.dispatchEvent(keyboardEvent("End"));
    expect(link.focused).toBe(true);
    link.dispatchEvent(keyboardEvent("Home"));
    expect(bold.focused).toBe(true);

    bold.dispatchEvent(new Event("click"));
    expect(bold.getAttribute("aria-pressed")).toBe("false");
    link.dispatchEvent(new Event("click"));
    expect(link.hasAttribute("aria-pressed")).toBe(false);
    unavailable.dispatchEvent(new Event("click"));
    expect(unavailable.getAttribute("aria-pressed")).toBe("false");
  });

  test("announces and dismisses toast notifications", () => {
    class Element extends EventTarget {
      attributes = new Map();
      removed = false;
      focused = false;
      tabIndex = 0;
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
      remove() {
        this.removed = true;
      }
      focus() {
        this.focused = true;
      }
    }

    const dismiss = new Element();
    const nextDismiss = new Element();
    const toast = new Element();
    toast.setAttribute("role", "status");
    toast.querySelector = () => dismiss;
    const nextToast = new Element();
    nextToast.setAttribute("role", "status");
    nextToast.querySelector = () => nextDismiss;
    const region = new Element();
    region.querySelectorAll = () => [toast, nextToast].filter((item) => !item.removed);
    const root = { querySelectorAll: () => [region] };

    expect(bindToasts(root)).toBe(1);
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.getAttribute("aria-relevant")).toBe("additions removals");
    expect(toast.getAttribute("role")).toBeUndefined();
    expect(nextToast.getAttribute("role")).toBeUndefined();
    dismiss.dispatchEvent(new Event("click"));
    expect(toast.removed).toBe(true);
    expect(nextDismiss.focused).toBe(true);
    nextDismiss.dispatchEvent(new Event("click"));
    expect(nextToast.removed).toBe(true);
    expect(region.focused).toBe(true);
    expect(region.tabIndex).toBe(-1);

    const markup = getReferenceContent("primitive-toast");
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain("data-toast-dismiss");
    expect(markup).not.toContain('class="oc-toast" role="status"');
  });

  test("creates a toast from an explicit trigger", () => {
    class Element extends EventTarget {
      attributes = new Map();
      children = [];
      dataset = {};
      focused = false;
      removed = false;
      id = "";
      parentElement = null;
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
      append(child) {
        child.parentElement = this;
        this.children.push(child);
      }
      prepend(child) {
        child.parentElement = this;
        this.children.unshift(child);
      }
      get lastElementChild() {
        return this.children.at(-1);
      }
      remove() {
        this.removed = true;
        if (this.parentElement?.children) {
          this.parentElement.children = this.parentElement.children.filter(
            (child) => child !== this,
          );
        }
      }
      focus() {
        this.focused = true;
      }
    }

    const region = new Element();
    region.id = "home-toast-region";
    region.querySelectorAll = () => region.children.filter(({ removed }) => !removed);
    const templateToast = new Element();
    templateToast.cloneNode = () => {
      const toast = new Element();
      const dismiss = new Element();
      toast.querySelector = () => dismiss;
      toast.dismiss = dismiss;
      return toast;
    };
    const template = { content: { firstElementChild: templateToast } };
    const trigger = new Element();
    trigger.setAttribute("aria-controls", region.id);
    trigger.parentElement = { querySelector: () => template };
    const root = {
      querySelectorAll: (selector) => (selector === "[data-toast-region]" ? [region] : [trigger]),
    };

    expect(bindToasts(root)).toBe(1);
    for (let index = 0; index < 4; index += 1) {
      trigger.dispatchEvent(new Event("click"));
    }
    expect(region.children).toHaveLength(3);
    expect(region.dataset.toastStack).toBe("multiple");
    expect(region.children[0].getAttribute("data-toast-bound")).toBe("true");
    const dismissedToast = region.children[0];
    dismissedToast.dismiss.dispatchEvent(new Event("click"));
    expect(dismissedToast.removed).toBe(true);
    expect(region.children).toHaveLength(2);
    expect(region.children[0].dismiss.focused).toBe(true);
  });

  test("opens, dismisses, and collision-aligns tooltips", () => {
    class Element extends EventTarget {
      attributes = new Map();
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      removeAttribute(name) {
        this.attributes.delete(name);
      }
    }

    const trigger = new Element();
    const content = new Element();
    let measuredWhileOpen;
    let measurementCount = 0;
    content.getBoundingClientRect = () => {
      measurementCount += 1;
      measuredWhileOpen = content.getAttribute("data-open") != null;
      return { top: -4, left: -6, right: 318 };
    };
    const tooltip = new Element();
    tooltip.querySelector = (selector) =>
      ({
        "[data-tooltip-trigger]": trigger,
        "[data-tooltip-content]": content,
      })[selector];
    const viewHandlers = { resize: [], scroll: [] };
    const view = {
      innerWidth: 300,
      addEventListener(type, handler) {
        viewHandlers[type].push(handler);
      },
    };
    const root = {
      defaultView: view,
      querySelectorAll: () => [tooltip],
    };
    view.document = root;

    expect(bindTooltips(root)).toBe(1);
    expect(bindTooltips(root)).toBe(1);
    expect(viewHandlers.resize).toHaveLength(1);
    expect(viewHandlers.scroll).toHaveLength(1);
    tooltip.dispatchEvent(new Event("pointerenter"));
    expect(measuredWhileOpen).toBe(false);
    expect(measurementCount).toBe(1);
    expect(content.getAttribute("data-open")).toBe("");
    expect(content.getAttribute("data-placement")).toBe("bottom");
    expect(content.getAttribute("data-align")).toBe("start");
    viewHandlers.resize[0]();
    expect(measurementCount).toBe(2);

    tooltip.dispatchEvent(keyboardEvent("Escape"));
    expect(content.getAttribute("data-open")).toBeUndefined();
    expect(tooltip.getAttribute("data-suppressed")).toBe("");
    tooltip.dispatchEvent(new Event("pointerleave"));
    expect(tooltip.getAttribute("data-suppressed")).toBeUndefined();

    tooltip.dispatchEvent(new Event("pointerenter"));
    tooltip.dispatchEvent(new Event("focusin"));
    tooltip.dispatchEvent(keyboardEvent("Escape"));
    tooltip.dispatchEvent(new Event("pointerleave"));
    expect(tooltip.getAttribute("data-suppressed")).toBe("");
    tooltip.dispatchEvent(new Event("focusout"));
    expect(tooltip.getAttribute("data-suppressed")).toBeUndefined();

    const markup = getReferenceContent("primitive-tooltip");
    expect(markup).toContain("data-tooltip-trigger");
    expect(markup).toContain('aria-label="Copy component markup"');
  });

  test("keeps agent search results informational rather than navigable", () => {
    const markup = getAgentReferenceContent("search-tool");
    expect(markup).toContain("Searched for");
    expect(markup).toContain("/foundations/tokens/");
    expect(markup).not.toContain("<a href");
  });

  test("keeps agent markdown links inside the deployed preview base path", () => {
    const markup = getAgentReferenceContent("markdown");
    expect(markup).toContain('href="../../foundations/tokens/"');
    expect(markup).not.toContain('href="/foundations/');
  });

  test("keeps the agent error message plain and alert-scoped", () => {
    const markup = getAgentReferenceContent("error-message");

    expect(markup).toContain('class="oc-agent-error-message" role="alert"');
    expect(markup).toContain("Something went wrong");
    expect(markup).not.toContain("data-agent-retry");
  });

  test("keeps agent chat suggestions actionable without making the transcript live", () => {
    const markup = getAgentReferenceContent("agent-chat");
    expect(markup).toContain('data-agent-suggestion-target="agent-chat-message"');
    expect(markup).toContain('data-agent-chat-status aria-live="polite"');
    expect(markup).not.toContain(
      'oc-agent-chat-messages" aria-label="Conversation history" aria-live',
    );
  });

  test("submits a trimmed agent chat draft into the visible transcript", () => {
    class Element extends EventTarget {
      children = [];
      className = "";
      textContent = "";
      value = "  Review the current diff.  ";
      ownerDocument;
      constructor(ownerDocument) {
        super();
        this.ownerDocument = ownerDocument;
      }
      append(child) {
        this.children.push(child);
      }
    }

    const ownerDocument = { createElement: () => new Element(ownerDocument) };
    const input = new Element(ownerDocument);
    const transcript = new Element(ownerDocument);
    const scroller = new Element(ownerDocument);
    const status = new Element(ownerDocument);
    scroller.scrollHeight = 320;
    scroller.scrollTop = 0;
    const form = new Element(ownerDocument);
    form.querySelector = () => input;
    form.closest = () => ({
      querySelector: (selector) => {
        if (selector === ".oc-agent-message-list-content") return transcript;
        if (selector === ".oc-agent-message-list") return scroller;
        return status;
      },
    });
    const root = {
      querySelectorAll(selector) {
        return selector === "[data-agent-chat-form]" ? [form] : [];
      },
    };

    expect(normalizeAgentDraft(input.value)).toBe("Review the current diff.");
    expect(bindAgentComponentDemos(root)).toBe(1);
    const submit = new Event("submit", { cancelable: true });
    form.dispatchEvent(submit);

    expect(submit.defaultPrevented).toBe(true);
    expect(input.value).toBe("");
    expect(scroller.scrollTop).toBe(320);
    const turn = transcript.children[0];
    expect(turn.className).toBe("oc-agent-turn");
    expect(turn.children[0].className).toBe("oc-agent-user-message-stack");
    expect(turn.children[0].children[0].className).toBe("oc-agent-user-message");
    expect(turn.children[0].children[0].children[0].textContent).toBe("Review the current diff.");
    expect(status.textContent).toBe("Message sent");
  });

  test("submits a standalone composer without navigating away", () => {
    const input = {
      value: "  Ship this update.  ",
      focused: false,
      focus() {
        this.focused = true;
      },
    };
    const status = { textContent: "" };
    const form = new EventTarget();
    form.querySelector = (selector) => (selector === ".oc-agent-input" ? input : status);
    const root = {
      querySelectorAll(selector) {
        return selector === "[data-agent-compose-form]" ? [form] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    const submit = new Event("submit", { cancelable: true });
    form.dispatchEvent(submit);

    expect(submit.defaultPrevented).toBe(true);
    expect(input.value).toBe("");
    expect(input.focused).toBe(true);
    expect(status.textContent).toBe("Message sent");
  });

  test("moves a selected suggestion into its linked composer", () => {
    const inputEvents = [];
    const input = new EventTarget();
    input.value = "";
    input.focused = false;
    input.focus = () => (input.focused = true);
    input.addEventListener("input", () => inputEvents.push(input.value));
    const suggestion = new EventTarget();
    suggestion.dataset = {
      agentSuggestionTarget: "message",
      agentSuggestionValue: "Review the implementation",
    };
    suggestion.textContent = "Review";
    const root = {
      getElementById: (id) => (id === "message" ? input : null),
      querySelectorAll(selector) {
        return selector === "[data-agent-suggestion-value]" ? [suggestion] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    suggestion.dispatchEvent(new Event("click"));
    expect(input.value).toBe("Review the implementation");
    expect(input.focused).toBe(true);
    expect(inputEvents).toEqual(["Review the implementation"]);
  });

  test("finds a suggestion target when the binding root is an element", () => {
    const input = { id: "message" };
    const root = {
      querySelectorAll(selector) {
        return selector === "[id]" ? [input] : [];
      },
    };

    expect(findAgentSuggestionTarget(root, "message")).toBe(input);
    expect(findAgentSuggestionTarget(root, "missing")).toBe(null);
  });

  test("updates and closes the agent mode selector", () => {
    const label = { textContent: "Agent" };
    const summary = {
      focused: false,
      focus() {
        this.focused = true;
      },
    };
    const agent = new EventTarget();
    agent.checked = true;
    agent.value = "Agent";
    const plan = new EventTarget();
    plan.checked = false;
    plan.value = "Plan";
    const selector = {
      open: true,
      querySelector: (query) => (query === "summary" ? summary : label),
      querySelectorAll: () => [agent, plan],
    };
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-mode-selector]" ? [selector] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    agent.checked = false;
    plan.checked = true;
    plan.dispatchEvent(new Event("change"));
    expect(label.textContent).toBe("Plan");
    expect(selector.open).toBe(false);
    expect(summary.focused).toBe(true);
  });

  test("updates and closes the agent model picker", () => {
    const name = { textContent: "Balanced" };
    const version = { textContent: "4.6" };
    const summary = {
      focused: false,
      focus() {
        this.focused = true;
      },
    };
    const balanced = new EventTarget();
    balanced.checked = true;
    balanced.value = "Balanced";
    balanced.dataset = { agentModelOptionVersion: "4.6" };
    const fast = new EventTarget();
    fast.checked = false;
    fast.value = "Fast";
    fast.dataset = { agentModelOptionVersion: "2.1" };
    const picker = {
      open: true,
      querySelector: (query) => {
        if (query === "[data-agent-model-name]") return name;
        if (query === "[data-agent-model-version]") return version;
        return summary;
      },
      querySelectorAll: () => [balanced, fast],
    };
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-model-picker]" ? [picker] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    balanced.checked = false;
    fast.checked = true;
    fast.dispatchEvent(new Event("change"));
    expect(name.textContent).toBe("Fast");
    expect(version.textContent).toBe("2.1");
    expect(picker.open).toBe(false);
    expect(summary.focused).toBe(true);
  });

  test("removes only the selected file attachment", () => {
    let removed = false;
    const attachment = {
      remove: () => {
        removed = true;
      },
    };
    const button = new EventTarget();
    button.closest = () => attachment;
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-attachment-remove]" ? [button] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    button.dispatchEvent(new Event("click"));
    expect(removed).toBe(true);
  });

  test("marks an approved plan without submitting the page", () => {
    const attributes = new Map();
    const status = { textContent: "Step 2 of 3" };
    const plan = {
      querySelector: () => status,
      setAttribute: (name, value) => attributes.set(name, value),
    };
    const button = new EventTarget();
    button.disabled = false;
    button.textContent = "Approve";
    button.closest = () => plan;
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-plan-approve]" ? [button] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    button.dispatchEvent(new Event("click"));
    expect(attributes.get("data-state")).toBe("approved");
    expect(status.textContent).toBe("Approved");
    expect(button.disabled).toBe(true);
  });

  test("keeps the plan card named, expandable, and approvable", () => {
    const markup = getAgentReferenceContent("plan-tool");
    expect(markup).toContain("plan-working.md");
    expect(markup).toContain('aria-label="Expand plan" aria-expanded="false"');
    expect(markup).toContain("Read detailed plan");
    expect(markup).toContain("data-agent-plan-approve");
  });

  test("submits and skips agent questions without navigating", () => {
    const status = { textContent: "" };
    const skip = new EventTarget();
    const form = new EventTarget();
    form.dataset = {};
    form.querySelector = () => status;
    form.querySelectorAll = (selector) => {
      if (selector === "[data-agent-question-skip]") return [skip];
      return [];
    };
    const root = {
      querySelectorAll(selector) {
        return selector === "[data-agent-question-form]" ? [form] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    const submit = new Event("submit", { cancelable: true });
    form.dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(true);
    expect(form.dataset.state).toBe("answered");
    expect(status.textContent).toBe("Answer submitted");

    skip.dispatchEvent(new Event("click"));
    expect(form.dataset.state).toBe("skipped");
    expect(status.textContent).toBe("Question skipped");
  });

  test("keeps MCP results named and keyboard scrollable", () => {
    const markup = getAgentReferenceContent("mcp-tool");
    expect(markup).toContain('aria-label="MCP tool result"');
    expect(markup).toContain('tabindex="0"');
    expect(markup).toContain("design-system://tokens");
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

    const input = { type: "password" };
    const toggle = new Toggle();
    toggle.setAttribute("data-sensitive-label", "API key");
    const control = {
      querySelector(selector) {
        if (selector === "[data-sensitive-value]") return input;
        if (selector === "[data-toggle-sensitive]") return toggle;
        return null;
      },
    };
    const root = { querySelectorAll: () => [control] };

    expect(bindSensitiveInputs(root)).toBe(1);
    expect(toggle.innerHTML).toContain('data-lucide="eye"');
    toggle.dispatchEvent(new Event("click"));
    expect(input.type).toBe("text");
    expect(toggle.innerHTML).toContain('data-lucide="eye-off"');
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("Hide API key");

    toggle.dispatchEvent(new Event("click"));
    expect(input.type).toBe("password");
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
});
