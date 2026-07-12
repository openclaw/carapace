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
    const close = ({ focus = false } = {}) => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
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
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
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
      if (event.target.closest("[role='menuitem']")) close({ focus: true });
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
