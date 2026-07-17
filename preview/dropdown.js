export function bindDropdowns(root = document) {
  const dropdowns = [...root.querySelectorAll("[data-dropdown]")];
  const schedule = root.defaultView?.queueMicrotask?.bind(root.defaultView)
    || globalThis.queueMicrotask
    || ((callback) => Promise.resolve().then(callback));

  for (const dropdown of dropdowns) {
    const trigger = dropdown.querySelector("[data-dropdown-trigger]");
    const menu = dropdown.querySelector("[role='menu']");
    if (!trigger || !menu) continue;

    const menuItems = () => [...menu.querySelectorAll("[role='menuitem']")]
      .filter((item) => !item.hidden && !item.disabled && item.getAttribute?.("aria-disabled") !== "true");
    let closing = false;
    const animate = (opening) => {
      if (typeof menu.animate !== "function") return null;
      const reduced = menu.ownerDocument?.defaultView
        ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
      return menu.animate(
        opening
          ? [
              { opacity: 0, transform: reduced ? "none" : "translateY(-8px) scale(0.95)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ]
          : [
              { opacity: 1, transform: "translateY(0) scale(1)" },
              { opacity: 0, transform: reduced ? "none" : "translateY(-4px) scale(0.98)" },
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

    for (const item of menuItems()) {
      item.tabIndex = -1;
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
  }

  return dropdowns.length;
}
