import { describe, expect, test } from "bun:test";
import {
  bindAgentComponentDemos,
  findAgentSuggestionTarget,
  normalizeAgentDraft,
} from "../preview/agent-components-interactions.js";
import { getAgentReferenceContent } from "../preview/agent-components.js";
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

function keyboardEvent(key) {
  const event = new Event("keydown", { cancelable: true });
  Object.defineProperty(event, "key", { value: key });
  return event;
}

describe("preview behavior", () => {
  test("moves table-of-contents location to the selected section", () => {
    class Link {
      attributes = new Map();
      setAttribute(name, value) { this.attributes.set(name, value); }
      removeAttribute(name) { this.attributes.delete(name); }
      getAttribute(name) { return this.attributes.get(name); }
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
      setAttribute(name, value) { this.attributes.set(name, value); }
      removeAttribute(name) { this.attributes.delete(name); }
      getAttribute(name) { return this.attributes.get(name); }
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
      getAttribute(name) { return this.attributes.get(name); }
      setAttribute(name, value) { this.attributes.set(name, value); }
      removeAttribute(name) { this.attributes.delete(name); }
      focus() { this.focused = true; }
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
    control.querySelector = (selector) => ({
      "[role='combobox']": input,
      "[data-combobox-toggle]": toggle,
      "[role='listbox']": listbox,
    })[selector];
    control.contains = (target) => [input, toggle, listbox, ...options].includes(target);
    const root = { querySelectorAll: () => [control] };

    expect(bindCombobox(root)).toBe(1);

    input.value = "zz";
    input.dispatchEvent(new Event("input"));
    expect(options.every(({ hidden }) => hidden)).toBe(true);
    expect(input.getAttribute("aria-activedescendant")).toBeUndefined();
    expect(options.some(({ attributes }) => attributes.has("data-active"))).toBe(false);

    input.value = "";
    input.dispatchEvent(new Event("input"));
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

    input.value = "missing";
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(keyboardEvent("Enter"));
    expect(input.value).toBe("missing");
    expect(options.every(({ attributes }) => attributes.get("aria-selected") !== "true")).toBe(true);
  });

  test("filters and keyboard-navigates command palette results", () => {
    class Element extends EventTarget {
      attributes = new Map();
      hidden = false;
      value = "";
      textContent = "";
      focused = false;
      setAttribute(name, value) { this.attributes.set(name, value); }
      removeAttribute(name) { this.attributes.delete(name); }
      focus() { this.focused = true; }
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
      setAttribute(name, value) { this.attributes.set(name, value); }
      getAttribute(name) { return this.attributes.get(name); }
      closest(selector) { return selector === "[role='menuitem']" ? this : null; }
      focus() { this.focused = true; }
    }

    const trigger = new Element();
    const menu = new Element();
    menu.hidden = true;
    const items = [new Element(), new Element(), new Element()];
    const disabledItem = new Element();
    disabledItem.setAttribute("aria-disabled", "true");
    menu.querySelectorAll = () => [...items, disabledItem];
    const dropdown = new Element();
    dropdown.querySelector = (selector) => ({
      "[data-dropdown-trigger]": trigger,
      "[role='menu']": menu,
    })[selector];
    dropdown.contains = (target) => [trigger, menu, ...items].includes(target);
    const rootHandlers = {};
    const root = {
      querySelectorAll: () => [dropdown],
      addEventListener: (type, handler) => { rootHandlers[type] = handler; },
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
      setAttribute(name, value) { this.attributes.set(name, value); }
      getAttribute(name) { return this.attributes.get(name); }
      focus() { this.focused = true; }
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
      setAttribute(name, value) { this.attributes.set(name, value); }
      getAttribute(name) { return this.attributes.get(name); }
      hasAttribute(name) { return this.attributes.has(name); }
      focus() { this.focused = true; }
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
      setAttribute(name, value) { this.attributes.set(name, value); }
      getAttribute(name) { return this.attributes.get(name); }
      removeAttribute(name) { this.attributes.delete(name); }
      remove() { this.removed = true; }
      focus() { this.focused = true; }
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

  test("opens, dismisses, and collision-aligns tooltips", () => {
    class Element extends EventTarget {
      attributes = new Map();
      setAttribute(name, value) { this.attributes.set(name, value); }
      getAttribute(name) { return this.attributes.get(name); }
      removeAttribute(name) { this.attributes.delete(name); }
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
    tooltip.querySelector = (selector) => ({
      "[data-tooltip-trigger]": trigger,
      "[data-tooltip-content]": content,
    })[selector];
    const viewHandlers = { resize: [], scroll: [] };
    const view = {
      innerWidth: 300,
      addEventListener(type, handler) { viewHandlers[type].push(handler); },
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

  test("keeps agent search results inside the deployed preview base path", () => {
    const markup = getAgentReferenceContent("search-tool");
    expect(markup).toContain('href="../../resources/tailwind/"');
    expect(markup).toContain('href="../../foundations/tokens/"');
    expect(markup).not.toContain('href="/resources/');
    expect(markup).not.toContain('href="/foundations/');
  });

  test("keeps agent markdown links inside the deployed preview base path", () => {
    const markup = getAgentReferenceContent("markdown");
    expect(markup).toContain('href="../../foundations/tokens/"');
    expect(markup).not.toContain('href="/foundations/');
  });

  test("gives visible agent error actions a copy payload", () => {
    const markup = getAgentReferenceContent("error-message");

    expect(markup).toContain(
      'data-copy-text="Response interrupted: The connection ended before the response completed. Your draft is still available."',
    );
  });

  test("keeps agent chat suggestions actionable without making the transcript live", () => {
    const markup = getAgentReferenceContent("agent-chat");
    expect(markup).toContain('data-agent-suggestion-target="agent-chat-message"');
    expect(markup).toContain('data-agent-chat-status aria-live="polite"');
    expect(markup).not.toContain('oc-agent-chat-messages" aria-label="Conversation history" aria-live');
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
      append(child) { this.children.push(child); }
    }

    const ownerDocument = { createElement: () => new Element(ownerDocument) };
    const input = new Element(ownerDocument);
    const transcript = new Element(ownerDocument);
    const status = new Element(ownerDocument);
    transcript.scrollHeight = 320;
    transcript.scrollTop = 0;
    const form = new Element(ownerDocument);
    form.querySelector = () => input;
    form.closest = () => ({
      querySelector: (selector) => selector === ".oc-agent-chat-messages" ? transcript : status,
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
    expect(transcript.scrollTop).toBe(320);
    expect(transcript.children[0].className).toBe("oc-user-message");
    expect(transcript.children[0].children[0].textContent).toBe("Review the current diff.");
    expect(status.textContent).toBe("Message sent");
  });

  test("submits a standalone composer without navigating away", () => {
    const input = { value: "  Ship this update.  ", focused: false, focus() { this.focused = true; } };
    const status = { textContent: "" };
    const form = new EventTarget();
    form.querySelector = (selector) => selector === ".oc-agent-input" ? input : status;
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
      getElementById: (id) => id === "message" ? input : null,
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
    const summary = { focused: false, focus() { this.focused = true; } };
    const agent = new EventTarget();
    agent.checked = true;
    agent.value = "Agent";
    const plan = new EventTarget();
    plan.checked = false;
    plan.value = "Plan";
    const selector = {
      open: true,
      querySelector: (query) => query === "summary" ? summary : label,
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

  test("marks a failed agent response as retrying", () => {
    const attributes = new Map();
    const error = { setAttribute: (name, value) => attributes.set(name, value) };
    const button = new EventTarget();
    button.disabled = false;
    button.textContent = "Try again";
    button.closest = () => error;
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-retry]" ? [button] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    button.dispatchEvent(new Event("click"));
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe("Retrying…");
    expect(attributes.get("aria-busy")).toBe("true");
    expect(attributes.get("data-state")).toBe("retrying");
  });

  test("removes only the selected file attachment", () => {
    let removed = false;
    const attachment = { remove: () => { removed = true; } };
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

  test("labels plan step states and exposes only functional actions", () => {
    const markup = getAgentReferenceContent("plan-tool");
    expect(markup).toContain("Completed: ");
    expect(markup).toContain("In progress: ");
    expect(markup).toContain("Not started: ");
    expect(markup).not.toContain("Open details");
  });

  test("submits and skips agent questions without navigating", () => {
    const status = { textContent: "" };
    const skip = new EventTarget();
    const form = new EventTarget();
    form.dataset = {};
    form.querySelector = () => status;
    form.querySelectorAll = () => [skip];
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
    expect(markup).toContain("read_resource");
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
      getAttribute(name) { return this.attributes.get(name); }
      setAttribute(name, value) { this.attributes.set(name, value); }
      focus() { this.focused = true; }
    }

    const first = new Tab("first-panel");
    const second = new Tab("second-panel");
    const panels = [{ id: "first-panel", hidden: false }, { id: "second-panel", hidden: true }];
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

  test("reveals and conceals a sensitive value through its named control", () => {
    class Toggle extends EventTarget {
      attributes = new Map();
      textContent = "Show";
      setAttribute(name, value) { this.attributes.set(name, value); }
      getAttribute(name) { return this.attributes.get(name); }
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
    toggle.dispatchEvent(new Event("click"));
    expect(input.type).toBe("text");
    expect(toggle.textContent).toBe("Hide");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("Hide API key");

    toggle.dispatchEvent(new Event("click"));
    expect(input.type).toBe("password");
    expect(toggle.textContent).toBe("Show");
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
