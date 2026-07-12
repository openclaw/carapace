export function bindDropdowns(root = document) {
  const dropdowns = [...root.querySelectorAll("[data-dropdown]")];

  for (const dropdown of dropdowns) {
    const trigger = dropdown.querySelector("[data-dropdown-trigger]");
    const menu = dropdown.querySelector("[role='menu']");
    if (!trigger || !menu) continue;

    const close = ({ focus = false } = {}) => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (focus) trigger.focus();
    };
    trigger.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    });
    dropdown.addEventListener("click", (event) => {
      if (event.target.closest("[role='menuitem']")) close({ focus: true });
    });
    dropdown.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !menu.hidden) {
        event.preventDefault();
        close({ focus: true });
      }
    });
    root.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) close();
    });
  }

  return dropdowns.length;
}
