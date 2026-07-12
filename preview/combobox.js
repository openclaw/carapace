export function bindCombobox(root = document) {
  const controls = [...root.querySelectorAll("[data-combobox]")];

  for (const control of controls) {
    const input = control.querySelector("[role='combobox']");
    const toggle = control.querySelector("[data-combobox-toggle]");
    const listbox = control.querySelector("[role='listbox']");
    if (!input || !toggle || !listbox) continue;

    const options = [...listbox.querySelectorAll("[role='option']")];
    let activeIndex = -1;

    const visibleOptions = () => options.filter((option) => !option.hidden);
    const setOpen = (open) => {
      listbox.hidden = !open;
      input.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-expanded", String(open));
      if (!open) {
        activeIndex = -1;
        input.removeAttribute("aria-activedescendant");
      }
    };
    const setActive = (index) => {
      const visible = visibleOptions();
      if (visible.length === 0) return;
      activeIndex = (index + visible.length) % visible.length;
      for (const option of options) option.removeAttribute("data-active");
      const option = visible[activeIndex];
      option.setAttribute("data-active", "");
      input.setAttribute("aria-activedescendant", option.id);
    };
    const select = (option) => {
      input.value = option.dataset.value || option.textContent.trim();
      for (const item of options) item.setAttribute("aria-selected", String(item === option));
      setOpen(false);
      input.focus();
    };

    toggle.addEventListener("click", () => {
      const open = listbox.hidden;
      setOpen(open);
      if (open) input.focus();
    });
    input.addEventListener("focus", () => setOpen(true));
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      for (const option of options) {
        option.hidden = query !== "" && !option.textContent.toLowerCase().includes(query);
      }
      setOpen(true);
      setActive(0);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (listbox.hidden) setOpen(true);
        setActive(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
      } else if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        select(visibleOptions()[activeIndex]);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    });
    listbox.addEventListener("click", (event) => {
      const option = event.target.closest("[role='option']");
      if (option) select(option);
    });
    control.addEventListener("focusout", (event) => {
      if (!control.contains(event.relatedTarget)) setOpen(false);
    });
  }

  return controls.length;
}
