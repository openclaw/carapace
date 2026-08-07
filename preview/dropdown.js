const dropdownPositions = new WeakMap();
const registeredViews = new WeakSet();

function registerView(view) {
  if (!view?.document?.querySelectorAll || registeredViews.has(view)) return;

  const repositionOpenDropdowns = (event) => {
    if (
      event?.type === "scroll"
      && (
        event.target?.getAttribute?.("role") === "menu"
        || event.target?.closest?.("[role='menu']")
      )
    ) {
      return;
    }
    for (const dropdown of view.document.querySelectorAll("[data-dropdown]")) {
      dropdownPositions.get(dropdown)?.();
    }
  };

  view.addEventListener("resize", repositionOpenDropdowns);
  view.addEventListener("scroll", repositionOpenDropdowns, { passive: true, capture: true });
  registeredViews.add(view);
}

export function bindDropdowns(root = document) {
  const dropdowns = [...root.querySelectorAll("[data-dropdown]")];
  const view = root.defaultView || globalThis.window;
  registerView(view);
  const schedule = root.defaultView?.queueMicrotask?.bind(root.defaultView)
    || globalThis.queueMicrotask
    || ((callback) => Promise.resolve().then(callback));

  for (const dropdown of dropdowns) {
    const trigger = dropdown.querySelector("[data-dropdown-trigger]");
    const menu = dropdown.querySelector("[role='menu']");
    if (!trigger || !menu) continue;

    const allMenuItems = () => [...menu.querySelectorAll("[role='menuitem']")]
      .filter((item) => !item.hidden);
    const menuItems = () => allMenuItems()
      .filter((item) => !item.disabled && item.getAttribute?.("aria-disabled") !== "true");
    let closing = false;
    const position = () => {
      if (!view || menu.hidden || !trigger.getBoundingClientRect || !menu.getBoundingClientRect) {
        return;
      }
      const margin = 8;
      const gap = 8;
      const viewportWidth = view.innerWidth;
      const viewportHeight = view.innerHeight;
      menu.removeAttribute("data-placement");
      menu.removeAttribute("data-align");
      menu.style?.setProperty("--oc-dropdown-offset-x", "0px");
      menu.style?.setProperty(
        "--oc-dropdown-max-width",
        `${Math.max(0, viewportWidth - margin * 2)}px`,
      );

      const triggerRect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const availableAbove = Math.max(0, triggerRect.top - gap - margin);
      const availableBelow = Math.max(0, viewportHeight - triggerRect.bottom - gap - margin);
      const menuHeight = Math.max(menu.scrollHeight || 0, menuRect.height || 0);
      const placement = menuHeight > availableBelow && availableAbove > availableBelow
        ? "top"
        : "bottom";
      const offsetX = menuRect.left < margin
        ? margin - menuRect.left
        : menuRect.right > viewportWidth - margin
          ? viewportWidth - margin - menuRect.right
          : 0;
      menu.setAttribute("data-placement", placement);
      menu.setAttribute("data-align", offsetX > 0 ? "start" : "end");
      menu.style?.setProperty("--oc-dropdown-offset-x", `${offsetX}px`);
      menu.style?.setProperty(
        "--oc-dropdown-max-height",
        `${placement === "top" ? availableAbove : availableBelow}px`,
      );
    };
    const repositionIfOpen = () => {
      if (!menu.hidden) position();
    };
    const animate = (opening) => {
      if (typeof menu.animate !== "function") return null;
      const reduced = menu.ownerDocument?.defaultView
        ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const offset = menu.getAttribute("data-placement") === "top" ? "8px" : "-8px";
      const closingOffset = menu.getAttribute("data-placement") === "top" ? "4px" : "-4px";
      return menu.animate(
        opening
          ? [
              { opacity: 0, transform: reduced ? "none" : `translateY(${offset}) scale(0.95)` },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ]
          : [
              { opacity: 1, transform: "translateY(0) scale(1)" },
              { opacity: 0, transform: reduced ? "none" : `translateY(${closingOffset}) scale(0.98)` },
            ],
        {
          duration: reduced ? 100 : 150,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
        },
      );
    };
    const close = async ({ focus = false } = {}) => {
      if (menu.hidden || closing) return;
      closing = true;
      trigger.setAttribute("aria-expanded", "false");
      const animation = animate(false);
      if (animation) await animation.finished;
      menu.hidden = true;
      closing = false;
      if (focus) trigger.focus();
    };
    const focusItem = (index) => {
      const items = menuItems();
      if (!items.length) return null;
      const item = items[(index + items.length) % items.length];
      item.focus();
      return item;
    };
    const open = (index = 0) => {
      closing = false;
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      position();
      animate(true);
      focusItem(index);
    };
    const handleItemKeydown = (event, item) => {
      const items = menuItems();
      const index = items.indexOf(item);
      if (event.key === "Escape") {
        event.preventDefault();
        close({ focus: true });
        return;
      }
      const target = event.key === "ArrowDown"
        ? index + 1
        : event.key === "ArrowUp"
          ? index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : null;
      if (target === null) return;
      event.preventDefault();
      focusItem(target);
    };

    for (const item of allMenuItems()) {
      item.tabIndex = -1;
      if (!menuItems().includes(item)) continue;
      item.addEventListener("keydown", (event) => handleItemKeydown(event, item));
    }
    trigger.addEventListener("click", () => {
      if (menu.hidden) open(0);
      else close({ focus: true });
    });
    trigger.addEventListener("keydown", (event) => {
      const index = event.key === "ArrowUp" || event.key === "End" ? -1 : 0;
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      open(index);
    });
    dropdown.addEventListener("click", (event) => {
      const item = event.target.closest("[role='menuitem']");
      if (item && menuItems().includes(item)) close({ focus: true });
    });
    dropdown.addEventListener("keydown", (event) => {
      if (
        menu.hidden
        || !event.metaKey
        || event.ctrlKey
        || event.altKey
        || event.shiftKey
        || event.key.toLowerCase() !== "d"
      ) {
        return;
      }
      const item = menuItems().find((candidate) =>
        candidate.getAttribute?.("aria-keyshortcuts")?.split(/\s+/).includes("Meta+D"));
      if (!item) return;
      event.preventDefault();
      item.click();
      close({ focus: true });
    });
    dropdown.addEventListener("focusout", (event) => {
      const next = event.relatedTarget;
      schedule(() => {
        const active = next || root.activeElement;
        if (!active || !dropdown.contains(active)) close();
      });
    });
    root.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) close();
    });
    dropdownPositions.set(dropdown, repositionIfOpen);
  }

  return dropdowns.length;
}
