export function bindCommandPalettes(root = document) {
  const palettes = [...root.querySelectorAll("[data-command-palette]")];

  for (const palette of palettes) {
    const dialog = palette.querySelector("dialog");
    const trigger = palette.querySelector("[data-command-palette-open]");
    const input = palette.querySelector("[data-command-palette-input]");
    const items = [...palette.querySelectorAll("[data-command-palette-item]")];
    const status = palette.querySelector("[data-command-palette-status]");
    const empty = palette.querySelector("[data-command-palette-empty]");
    if (!dialog || !trigger || !input) continue;

    let activeIndex = -1;
    const visibleItems = () => items.filter((item) => !item.hidden);
    const clearActive = () => {
      activeIndex = -1;
      for (const item of items) {
        item.tabIndex = -1;
        item.removeAttribute("data-active");
      }
    };
    const setActive = (index, focus = true) => {
      const visible = visibleItems();
      clearActive();
      if (!visible.length) return null;
      activeIndex = (index + visible.length) % visible.length;
      const item = visible[activeIndex];
      item.tabIndex = 0;
      item.setAttribute("data-active", "");
      item.scrollIntoView?.({ block: "nearest" });
      if (focus) item.focus();
      return item;
    };
    const announce = () => {
      const count = visibleItems().length;
      if (status) status.textContent = `${count} ${count === 1 ? "command" : "commands"} available.`;
      if (empty) empty.hidden = count !== 0;
    };
    const filter = () => {
      const query = input.value.trim().toLowerCase();
      for (const item of items) item.hidden = query !== "" && !item.textContent.toLowerCase().includes(query);
      clearActive();
      announce();
    };

    const handleNavigation = (event, item) => {
      const visible = visibleItems();
      if (!visible.length) return;
      const current = item ? visible.indexOf(item) : -1;
      const target = event.key === "ArrowDown"
        ? current + 1
        : event.key === "ArrowUp"
          ? current < 0 ? visible.length - 1 : current - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? visible.length - 1
              : null;
      if (target === null) return;
      event.preventDefault();
      setActive(target);
    };

    trigger.addEventListener("click", () => {
      dialog.showModal();
      filter();
      input.focus();
    });
    input.addEventListener("input", filter);
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") handleNavigation(event);
    });
    for (const item of items) {
      item.tabIndex = -1;
      item.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          dialog.close();
          return;
        }
        handleNavigation(event, item);
      });
    }
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-command-palette-close]")) dialog.close();
      if (event.target.closest("[data-command-palette-item]")) dialog.close();
    });
    dialog.addEventListener("close", () => {
      input.value = "";
      filter();
      trigger.focus();
    });
    filter();
  }

  return palettes.length;
}
