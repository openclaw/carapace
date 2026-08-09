import { describe, expect, test } from "bun:test";
import {
  bindCombobox,
} from "../preview/combobox.js";
import {
  bindCommandPalettes,
} from "../preview/command-palette.js";
import {
  bindDropdowns,
} from "../preview/dropdown.js";
import {
  bindMenuBars,
} from "../preview/menu-bar.js";
import {
  bindToolbars,
} from "../preview/toolbar.js";
import {
  animateWorkbenchToast,
  bindToastLifetime,
  bindToasts,
  createWorkbenchToast,
  createWorkbenchToastRegion,
  dismissToast,
  syncWorkbenchToastVisibility,
} from "../preview/toast.js";
import {
  bindTooltips,
} from "../preview/tooltip.js";
import {
  getReferenceContent,
} from "../preview/reference-content.js";
import {
  bindSidebars,
  setCurrentSidebarLink,
  setSidebarCollapsed,
  setSidebarDisclosure,
  setSidebarWorkspace,
} from "../preview/sidebar.js";
import {
  getTableOfContentsEntries,
  setCurrentTableOfContentsLink,
} from "../preview/table-of-contents.js";
import {
  sidebarWorkbenchMarkup,
} from "../preview/component-workbench-config.js";

function keyboardEvent(key) {
  const event = new Event("keydown", { cancelable: true });
  Object.defineProperty(event, "key", { value: key });
  return event;
}

describe("interaction widget behavior", () => {
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
  test("derives a nested introduction outline from titled sections", () => {
    const source = {
      querySelectorAll: () => [
        { id: "purpose", tagName: "H2", textContent: " Purpose " },
        { id: "origin", tagName: "H3", textContent: "Origin" },
        { id: "adoption", tagName: "H2", textContent: "Adoption" },
      ],
    };

    expect(getTableOfContentsEntries(source)).toEqual([
      { id: "purpose", label: "Purpose", level: 2 },
      { id: "origin", label: "Origin", level: 3 },
      { id: "adoption", label: "Adoption", level: 2 },
    ]);
    expect(getTableOfContentsEntries(null)).toEqual([]);
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
    const inactiveWorkspace = new Link();
    overview.setAttribute("aria-current", "page");
    inactiveWorkspace.setAttribute("aria-current", "page");
    const nav = { querySelectorAll: () => [overview, activity] };

    expect(setCurrentSidebarLink(nav, activity)).toBe(true);
    expect(overview.getAttribute("aria-current")).toBeUndefined();
    expect(activity.getAttribute("aria-current")).toBe("page");
    expect(inactiveWorkspace.getAttribute("aria-current")).toBe("page");
  });
  test("keeps sidebar disclosure state aligned with its controlled panel", () => {
    const attributes = new Map();
    const toggle = {
      setAttribute(name, value) {
        attributes.set(name, value);
      },
    };
    const panelAttributes = new Map();
    const panel = {
      hidden: true,
      inert: true,
      querySelector() {
        return {};
      },
      setAttribute(name, value) {
        panelAttributes.set(name, value);
      },
    };

    expect(setSidebarDisclosure(toggle, panel, true)).toBe(true);
    expect(attributes.get("aria-expanded")).toBe("true");
    expect(panel.hidden).toBe(false);
    expect(panel.inert).toBe(false);
    expect(panelAttributes.get("data-open")).toBe("true");
    expect(panelAttributes.get("aria-hidden")).toBe("false");

    expect(setSidebarDisclosure(toggle, panel, false)).toBe(true);
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(panel.hidden).toBe(false);
    expect(panel.inert).toBe(true);
    expect(panelAttributes.get("data-open")).toBe("false");
    expect(panelAttributes.get("aria-hidden")).toBe("true");
  });
  test("preserves hidden fallback behavior for direct-child disclosure markup", () => {
    const toggle = { setAttribute() {} };
    const panel = {
      hidden: false,
      inert: false,
      querySelector() {
        return null;
      },
      matches() {
        return false;
      },
      setAttribute() {},
    };

    expect(setSidebarDisclosure(toggle, panel, false)).toBe(true);
    expect(panel.hidden).toBe(true);
    expect(setSidebarDisclosure(toggle, panel, true)).toBe(true);
    expect(panel.hidden).toBe(false);
  });
  test("uses the shared avatar contract across the sidebar specimen", () => {
    const sidebar = getReferenceContent("primitive-sidebar");

    expect(sidebar).toContain('class="oc-avatar oc-avatar-sm oc-avatar-pixel"');
    expect(sidebar).toContain('class="oc-avatar-image"');
    expect(sidebar).toContain("data-sidebar-workspace-toggle");
    expect(sidebar).toContain("data-sidebar-group-toggle");
    expect(sidebar).toContain('role="menuitemradio"');
    expect(sidebar).toContain('aria-label="Workspace navigation"');
    expect(sidebar).toContain("data-sidebar-collapse");
    expect(sidebar).not.toContain("oc-sidebar-avatar");
  });
  test("renders distinct workspace presets and compact rail state", () => {
    const expanded = sidebarWorkbenchMarkup({ workspace: "labs" });
    const collapsed = sidebarWorkbenchMarkup({ workspace: "personal", collapsed: true });

    expect(expanded).toContain('data-sidebar-workspace="labs"');
    expect(expanded).toContain(
      'data-sidebar-workspace-panel="labs" data-active="true" aria-hidden="false"',
    );
    expect(expanded).toContain("Prototype queue");
    expect(collapsed).toContain('data-sidebar-workspace="personal" data-collapsed="true"');
    expect(collapsed).toContain(
      'data-sidebar-workspace-panel="personal" data-active="true" aria-hidden="false"',
    );
    expect(collapsed).toContain("Inbox");
    expect(collapsed).toContain('aria-label="Expand sidebar"');
    expect(expanded).not.toContain("data-sidebar-workspace-avatar-src");
  });
  test("collapses the sidebar rail and closes an open workspace menu", () => {
    class Element {
      attributes = new Map();
      hidden = false;
      innerHTML = "";
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
    }

    const workspaceToggle = new Element();
    workspaceToggle.setAttribute("aria-expanded", "true");
    const workspaceMenu = new Element();
    workspaceMenu.matches = (selector) => selector === "[data-sidebar-workspace-menu]";
    const sidebar = new Element();
    sidebar.querySelector = (selector) =>
      ({
        "[data-sidebar-workspace-toggle]": workspaceToggle,
        "[data-sidebar-workspace-menu]": workspaceMenu,
      })[selector] ?? null;
    const collapse = new Element();

    expect(setSidebarCollapsed(sidebar, collapse, true)).toBe(true);
    expect(sidebar.getAttribute("data-collapsed")).toBe("true");
    expect(collapse.getAttribute("aria-expanded")).toBe("false");
    expect(collapse.getAttribute("aria-label")).toBe("Expand sidebar");
    expect(collapse.innerHTML).toContain('data-lucide="panel-left-open"');
    expect(workspaceToggle.getAttribute("aria-expanded")).toBe("false");
    expect(workspaceMenu.hidden).toBe(false);
    expect(workspaceMenu.getAttribute("data-open")).toBe("false");
    expect(workspaceMenu.inert).toBe(true);
  });
  test("updates the visible workspace identity and selected option", () => {
    class Option {
      attributes = new Map();
      avatarImage;
      constructor(id, name, description, avatarSrc) {
        this.attributes.set("data-sidebar-workspace-id", id);
        this.attributes.set("data-sidebar-workspace-name", name);
        this.attributes.set("data-sidebar-workspace-description", description);
        this.avatarImage = {
          alt: "Workspace",
          src: avatarSrc,
          cloneNode() {
            return { alt: this.alt, src: this.src };
          },
        };
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
      querySelector(selector) {
        return selector === "img.oc-avatar-image" ? this.avatarImage : null;
      }
    }

    const current = new Option("openclaw", "OpenClaw", "Design workspace", "openclaw.png");
    const selected = new Option("labs", "Labs", "Product experiments", "labs.png");
    const title = { textContent: "" };
    const subtitle = { textContent: "" };
    const avatarAttributes = new Map();
    let avatarImage = null;
    const avatar = {
      setAttribute(name, value) {
        avatarAttributes.set(name, value);
      },
      replaceChildren(image) {
        avatarImage = image;
      },
    };
    class Panel {
      attributes = new Map();
      inert = false;
      constructor(id) {
        this.attributes.set("data-sidebar-workspace-panel", id);
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
      getAttribute(name) {
        return this.attributes.get(name);
      }
    }
    const currentPanel = new Panel("openclaw");
    const selectedPanel = new Panel("labs");
    const sidebarAttributes = new Map();
    class Sidebar extends EventTarget {
      setAttribute(name, value) {
        sidebarAttributes.set(name, value);
      }
      querySelectorAll(selector) {
        if (selector === "[data-sidebar-workspace-option]") return [current, selected];
        if (selector === "[data-sidebar-workspace-panel]") return [currentPanel, selectedPanel];
        return [];
      }
      querySelector(selector) {
        return (
          {
            "[data-sidebar-workspace-title]": title,
            "[data-sidebar-workspace-subtitle]": subtitle,
            "[data-sidebar-workspace-avatar]": avatar,
          }[selector] ?? null
        );
      }
    }
    const sidebar = new Sidebar();
    let selectedWorkspace = "";
    sidebar.addEventListener("oc-sidebar-workspace-change", (event) => {
      selectedWorkspace = event.detail.workspace;
    });

    expect(setSidebarWorkspace(sidebar, selected)).toBe(true);
    expect(sidebarAttributes.get("data-sidebar-workspace")).toBe("labs");
    expect(current.getAttribute("aria-checked")).toBe("false");
    expect(selected.getAttribute("aria-checked")).toBe("true");
    expect(title.textContent).toBe("Labs");
    expect(subtitle.textContent).toBe("Product experiments");
    expect(avatarAttributes.get("aria-label")).toBe("Labs workspace");
    expect(avatarImage?.src).toBe("labs.png");
    expect(avatarImage?.alt).toBe("");
    expect(currentPanel.getAttribute("data-active")).toBe("false");
    expect(currentPanel.inert).toBe(true);
    expect(selectedPanel.getAttribute("data-active")).toBe("true");
    expect(selectedPanel.inert).toBe(false);
    expect(selectedWorkspace).toBe("labs");
  });
  test("opens the workspace menu from the keyboard and dismisses it outside", () => {
    class Element extends EventTarget {
      attributes = new Map();
      inert = false;
      hidden = false;
      focused = false;
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

    const document = new (class extends EventTarget {
      querySelectorAll() {
        return [sidebar];
      }
    })();
    const toggle = new Element();
    toggle.setAttribute("aria-expanded", "false");
    const menu = new Element();
    menu.matches = (selector) => selector === "[data-sidebar-workspace-menu]";
    menu.contains = (target) => target === selected;
    const selected = new Element();
    selected.setAttribute("aria-checked", "true");
    const sidebar = new (class extends Element {
      ownerDocument = document;
      contains(target) {
        return target === this || target === toggle || target === menu || target === selected;
      }
      querySelector(selector) {
        return (
          {
            "[data-sidebar-workspace-toggle]": toggle,
            "[data-sidebar-workspace-menu]": menu,
            ".oc-sidebar-nav": null,
            "[data-sidebar-collapse]": null,
          }[selector] ?? null
        );
      }
      querySelectorAll(selector) {
        if (selector === "[data-sidebar-workspace-option]") return [selected];
        return [];
      }
    })();
    const root = { querySelectorAll: () => [sidebar] };

    expect(bindSidebars(root)).toBe(1);
    toggle.dispatchEvent(keyboardEvent("ArrowDown"));
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(menu.getAttribute("data-open")).toBe("true");
    expect(selected.focused).toBe(true);

    const triggerFocus = new Event("focusout");
    Object.defineProperty(triggerFocus, "relatedTarget", { value: toggle });
    menu.dispatchEvent(triggerFocus);
    expect(menu.getAttribute("data-open")).toBe("true");
    toggle.dispatchEvent(new Event("click"));
    expect(menu.getAttribute("data-open")).toBe("false");

    toggle.dispatchEvent(keyboardEvent("ArrowDown"));
    selected.dispatchEvent(keyboardEvent("Tab"));
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(menu.getAttribute("data-open")).toBe("false");

    toggle.dispatchEvent(keyboardEvent("ArrowDown"));
    document.dispatchEvent(new Event("pointerdown"));
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(menu.getAttribute("data-open")).toBe("false");
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
      removeAttribute(name) {
        this.attributes.delete(name);
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
      click() {
        this.dispatchEvent(new Event("click"));
      }
    }

    const trigger = new Element();
    trigger.getBoundingClientRect = () => ({ top: 100, right: 100, bottom: 124, left: 0 });
    const menu = new Element();
    menu.hidden = true;
    menu.setAttribute("role", "menu");
    const menuStyles = new Map();
    menu.style = {
      setProperty: (name, value) => menuStyles.set(name, value),
      removeProperty: (name) => menuStyles.delete(name),
    };
    menu.scrollHeight = 128;
    let menuRectReads = 0;
    menu.getBoundingClientRect = () => {
      menuRectReads += 1;
      return {
        top: 132,
        right: 180,
        bottom: 170,
        left: -40,
        height: 38,
      };
    };
    const items = [new Element(), new Element(), new Element()];
    items[0].setAttribute("aria-keyshortcuts", "Meta+D");
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
    const viewHandlers = { resize: [], scroll: [] };
    const view = {
      innerWidth: 240,
      innerHeight: 180,
      addEventListener(type, handler) {
        viewHandlers[type].push(handler);
      },
    };
    const root = {
      defaultView: view,
      querySelectorAll: () => [dropdown],
      addEventListener: (type, handler) => {
        rootHandlers[type] = handler;
      },
    };
    view.document = root;

    expect(bindDropdowns(root)).toBe(1);
    trigger.dispatchEvent(new Event("click"));
    expect(menu.hidden).toBe(false);
    expect(items[0].focused).toBe(true);
    expect(disabledItem.tabIndex).toBe(-1);
    expect(menu.getAttribute("data-placement")).toBe("top");
    expect(menu.getAttribute("data-align")).toBe("start");
    expect(menuStyles.get("--oc-dropdown-max-width")).toBe("224px");
    expect(menuStyles.get("--oc-dropdown-max-height")).toBe("84px");
    expect(menuStyles.get("--oc-dropdown-offset-x")).toBe("48px");
    expect(viewHandlers.resize).toHaveLength(1);
    expect(viewHandlers.scroll).toHaveLength(1);
    const readsBeforeMenuScroll = menuRectReads;
    viewHandlers.scroll[0]({ type: "scroll", target: menu });
    expect(menuRectReads).toBe(readsBeforeMenuScroll);

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

    let duplicateCount = 0;
    items[0].addEventListener("click", () => duplicateCount += 1);
    trigger.dispatchEvent(new Event("click"));
    const duplicate = keyboardEvent("d");
    Object.defineProperty(duplicate, "metaKey", { value: true });
    dropdown.dispatchEvent(duplicate);
    expect(duplicate.defaultPrevented).toBe(true);
    expect(duplicateCount).toBe(1);
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
      removeAttribute(name) {
        this.attributes.delete(name);
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
    menu.scrollHeight = 160;
    menu.style = { setProperty() {} };
    menu.getBoundingClientRect = () => ({ top: 124, right: 220, bottom: 164, left: 40, height: 40 });
    menu.querySelectorAll = () => menuItems;
    const dropdown = { querySelector: () => menu };
    const first = new Element();
    first.closest = () => dropdown;
    first.getBoundingClientRect = () => ({ top: 110, right: 120, bottom: 134, left: 40 });
    const second = new Element();
    second.closest = () => null;
    const menubar = { querySelectorAll: () => [first, second] };
    const view = {
      innerWidth: 240,
      innerHeight: 180,
      addEventListener() {},
    };
    const root = { defaultView: view, querySelectorAll: () => [menubar] };
    view.document = { querySelectorAll: () => [dropdown] };

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
    expect(menu.getAttribute("data-placement")).toBe("top");
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
  test("mounts the workbench Toast portal inside the themed canvas", () => {
    const canvas = {
      dataset: { workbenchTheme: "dark" },
      append(child) {
        child.parentElement = this;
      },
    };
    const workbench = {
      querySelector: (selector) => (selector === "[data-workbench-canvas]" ? canvas : null),
    };
    const document = {
      createElement() {
        return {
          dataset: {},
          parentElement: null,
          attributes: new Map(),
          setAttribute(name, value) {
            this.attributes.set(name, value);
          },
        };
      },
    };

    const region = createWorkbenchToastRegion(document, workbench);

    expect(region.parentElement).toBe(canvas);
    expect(region.parentElement.dataset.workbenchTheme).toBe("dark");
    expect(region.getAttribute?.("aria-live") ?? region.attributes.get("aria-live")).toBe("polite");
  });
  test("restores workbench Toast focus to an adjacent action, trigger, then region", async () => {
    class Element {
      children = [];
      focused = false;
      removed = false;
      tabIndex = 0;
      querySelector() {
        return null;
      }
      focus() {
        this.focused = true;
      }
      remove() {
        this.removed = true;
        this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
      }
    }

    const adjacentDismiss = new Element();
    const adjacent = new Element();
    adjacent.querySelector = () => adjacentDismiss;
    const first = new Element();
    const adjacentRegion = new Element();
    adjacentRegion.children = [first, adjacent];
    adjacentRegion.querySelectorAll = () => adjacentRegion.children;
    first.parentElement = adjacentRegion;
    adjacent.parentElement = adjacentRegion;

    await dismissToast(adjacentRegion, first, { returnFocus: new Element() });
    expect(adjacentDismiss.focused).toBe(true);

    const trigger = new Element();
    const only = new Element();
    const triggerRegion = new Element();
    triggerRegion.children = [only];
    triggerRegion.querySelectorAll = () => triggerRegion.children;
    only.parentElement = triggerRegion;
    await dismissToast(triggerRegion, only, { returnFocus: trigger });
    expect(trigger.focused).toBe(true);

    const fallback = new Element();
    const fallbackRegion = new Element();
    fallbackRegion.children = [fallback];
    fallbackRegion.querySelectorAll = () => fallbackRegion.children;
    fallback.parentElement = fallbackRegion;
    await dismissToast(fallbackRegion, fallback);
    expect(fallbackRegion.focused).toBe(true);
    expect(fallbackRegion.tabIndex).toBe(-1);
  });
  test("makes a Toast non-interactive while its dismissal animation completes", async () => {
    let finishAnimation;
    const attributes = new Map();
    const toast = {
      inert: false,
      ownerDocument: {
        defaultView: { matchMedia: () => ({ matches: false }) },
      },
      animate() {
        return {
          finished: new Promise((resolve) => {
            finishAnimation = resolve;
          }),
        };
      },
      setAttribute(name, value) {
        attributes.set(name, value);
      },
      remove() {},
    };
    const region = {
      dataset: {},
      querySelectorAll: () => [toast],
    };

    const dismissal = dismissToast(region, toast, { restoreFocus: false });

    expect(toast.inert).toBe(true);
    expect(attributes.get("aria-hidden")).toBe("true");
    finishAnimation();
    await dismissal;
  });
  test("does not hide the Visible control from a stale Toast portal", () => {
    const visibleControl = { checked: true };
    const activeRegion = { children: [{}] };
    const staleRegion = { children: [] };
    const workbench = {
      querySelector(selector) {
        if (selector === "[data-workbench-toast-portal]") return activeRegion;
        if (selector === '[data-workbench-control="visible"]') return visibleControl;
        return null;
      },
    };

    expect(syncWorkbenchToastVisibility(workbench, staleRegion)).toBe(false);
    expect(visibleControl.checked).toBe(true);

    activeRegion.children = [];
    expect(syncWorkbenchToastVisibility(workbench, activeRegion)).toBe(true);
    expect(visibleControl.checked).toBe(false);
  });
  test("pauses timed Toasts for hover and focus while errors remain persistent", () => {
    let now = 0;
    let nextTimer = 0;
    const timers = new Map();
    const view = {
      performance: { now: () => now },
      setTimeout(callback, delay) {
        nextTimer += 1;
        timers.set(nextTimer, { callback, delay });
        return nextTimer;
      },
      clearTimeout(timer) {
        timers.delete(timer);
      },
    };
    class Toast extends EventTarget {
      dataset = {};
      ownerDocument = { defaultView: view };
      contains(target) {
        return target === this;
      }
    }

    const timed = new Toast();
    timed.dataset.toastLifecycle = "timed";
    let expired = false;
    bindToastLifetime(timed, () => {
      expired = true;
    }, 5000);
    expect([...timers.values()].at(-1).delay).toBe(5000);

    now = 1200;
    timed.dispatchEvent(new Event("pointerenter"));
    expect(timers.size).toBe(0);
    timed.dispatchEvent(new Event("pointerleave"));
    expect([...timers.values()].at(-1).delay).toBe(3800);

    now = 1700;
    timed.dispatchEvent(new Event("focusin"));
    expect(timers.size).toBe(0);
    const focusout = new Event("focusout");
    Object.defineProperty(focusout, "relatedTarget", { value: null });
    timed.dispatchEvent(focusout);
    expect([...timers.values()].at(-1).delay).toBe(3300);
    [...timers.values()].at(-1).callback();
    expect(expired).toBe(true);

    const error = new Toast();
    error.dataset.toastTone = "error";
    error.dataset.toastLifecycle = "timed";
    expect(bindToastLifetime(error, () => {}, 5000)).toBeNull();
    expect(error.dataset.toastLifecycle).toBe("persistent");

    timers.clear();
    const rebound = new Toast();
    rebound.dataset.toastTone = "neutral";
    rebound.dataset.toastLifecycle = "timed";
    bindToastLifetime(rebound, () => {}, 5000);
    expect(timers.size).toBe(1);
    rebound.dataset.toastTone = "error";
    expect(bindToastLifetime(rebound, () => {}, 5000)).toBeNull();
    expect(timers.size).toBe(0);
  });
  test("keeps timed non-dismissible workbench Toasts keyboard-pausable", () => {
    const document = {
      createElement() {
        return { dataset: {}, tabIndex: -1, innerHTML: "", className: "" };
      },
    };

    const timed = createWorkbenchToast(document, {
      dismissible: false,
      lifecycle: "timed",
    });
    const persistent = createWorkbenchToast(document, {
      dismissible: false,
      lifecycle: "persistent",
    });

    expect(timed.tabIndex).toBe(0);
    expect(persistent.tabIndex).toBe(-1);
  });
  test("keeps Toast motion opacity-only when reduced motion is requested", () => {
    let keyframes;
    let options;
    const toast = {
      ownerDocument: {
        defaultView: { matchMedia: () => ({ matches: true }) },
      },
      animate(frames, animationOptions) {
        keyframes = frames;
        options = animationOptions;
        return { finished: Promise.resolve() };
      },
    };

    animateWorkbenchToast(toast, true);

    expect(keyframes).toEqual([{ opacity: 0 }, { opacity: 1 }]);
    expect(options.duration).toBe(100);
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
    const triggerTwo = new Element();
    const contentTwo = new Element();
    contentTwo.getBoundingClientRect = () => ({ top: 20, left: 20, right: 120 });
    const tooltipTwo = new Element();
    tooltipTwo.querySelector = (selector) =>
      ({
        "[data-tooltip-trigger]": triggerTwo,
        "[data-tooltip-content]": contentTwo,
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
      querySelectorAll: () => [tooltip, tooltipTwo],
    };
    view.document = root;

    let emptyViewListeners = 0;
    expect(bindTooltips({
      defaultView: {
        addEventListener() {
          emptyViewListeners += 1;
        },
      },
      querySelectorAll: () => [],
    })).toBe(0);
    expect(emptyViewListeners).toBe(0);

    expect(bindTooltips(root)).toBe(2);
    expect(bindTooltips(root)).toBe(2);
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

    tooltip.dispatchEvent(new Event("focusin"));
    tooltipTwo.dispatchEvent(new Event("pointerenter"));
    expect(content.getAttribute("data-open")).toBeUndefined();
    expect(tooltip.getAttribute("data-suppressed")).toBe("");
    expect(contentTwo.getAttribute("data-open")).toBe("");
    tooltipTwo.dispatchEvent(new Event("pointerleave"));
    expect(contentTwo.getAttribute("data-open")).toBeUndefined();
    expect(tooltip.getAttribute("data-suppressed")).toBeUndefined();
    expect(content.getAttribute("data-open")).toBe("");

    tooltipTwo.dispatchEvent(new Event("pointerenter"));
    tooltip.dispatchEvent(new Event("focusin"));
    expect(contentTwo.getAttribute("data-open")).toBeUndefined();
    expect(tooltipTwo.getAttribute("data-suppressed")).toBe("");
    expect(tooltip.getAttribute("data-suppressed")).toBeUndefined();
    expect(content.getAttribute("data-open")).toBe("");

    tooltip.dispatchEvent(keyboardEvent("Escape"));
    expect(content.getAttribute("data-open")).toBeUndefined();
    expect(tooltip.getAttribute("data-suppressed")).toBe("");
    tooltip.dispatchEvent(new Event("pointerleave"));
    expect(tooltip.getAttribute("data-suppressed")).toBe("");
    tooltip.dispatchEvent(new Event("focusout"));
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
});
