export function bindMenuBars(root = document) {
  const menuBars = [...root.querySelectorAll("[data-menubar]")];

  for (const menuBar of menuBars) {
    const items = [...menuBar.querySelectorAll("[data-menubar-item]")];
    if (!items.length) continue;

    const menuFor = (item) => item.closest?.("[data-dropdown]")?.querySelector("[role='menu']");
    const menuItemsFor = (item) => {
      const menu = menuFor(item);
      return menu
        ? [...menu.querySelectorAll("[role='menuitem']")]
            .filter((entry) => !entry.hidden && !entry.disabled && entry.getAttribute?.("aria-disabled") !== "true")
        : [];
    };
    const closeItem = (item) => {
      const menu = menuFor(item);
      if (!menu) return;
      menu.hidden = true;
      item.setAttribute("aria-expanded", "false");
    };
    const closeAll = () => {
      for (const item of items) closeItem(item);
    };
    const setCurrent = (item, focus = false) => {
      for (const candidate of items) candidate.tabIndex = candidate === item ? 0 : -1;
      if (focus) item.focus();
    };
    const openItem = (item, itemIndex = 0) => {
      const menu = menuFor(item);
      const entries = menuItemsFor(item);
      if (!menu || !entries.length) return false;
      closeAll();
      menu.hidden = false;
      item.setAttribute("aria-expanded", "true");
      entries[(itemIndex + entries.length) % entries.length].focus();
      return true;
    };
    const move = (item, offset, keepOpen = false) => {
      const index = items.indexOf(item);
      const next = items[(index + offset + items.length) % items.length];
      closeAll();
      setCurrent(next, true);
      if (keepOpen) openItem(next);
      return next;
    };

    items.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
      item.addEventListener("focus", () => setCurrent(item));
      item.addEventListener("click", () => setCurrent(item));
      item.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(item, event.key === "ArrowRight" ? 1 : -1, item.getAttribute("aria-expanded") === "true");
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          closeAll();
          setCurrent(event.key === "Home" ? items[0] : items.at(-1), true);
        } else if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
          if (!menuFor(item)) return;
          event.preventDefault();
          openItem(item, event.key === "ArrowUp" ? -1 : 0);
        } else if (event.key === "Escape" && item.getAttribute("aria-expanded") === "true") {
          event.preventDefault();
          closeItem(item);
          item.focus();
        }
      });

      for (const entry of menuItemsFor(item)) {
        entry.addEventListener("keydown", (event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const next = move(item, event.key === "ArrowRight" ? 1 : -1);
          if (!openItem(next)) next.focus();
        });
      }
    });
  }

  return menuBars.length;
}
