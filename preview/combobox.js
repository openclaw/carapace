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
    const clearActive = () => {
      activeIndex = -1;
      for (const option of options) option.removeAttribute("data-active");
      input.removeAttribute("aria-activedescendant");
    };
    const setOpen = (open) => {
      listbox.hidden = !open;
      input.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-expanded", String(open));
      if (!open) clearActive();
    };
    const setActive = (index) => {
      const visible = visibleOptions();
      clearActive();
      if (visible.length === 0) return null;
      activeIndex = (index + visible.length) % visible.length;
      const option = visible[activeIndex];
      option.setAttribute("data-active", "");
      input.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView?.({ block: "nearest" });
      return option;
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
      clearActive();
      setOpen(true);
      if (visibleOptions().length) setActive(0);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (listbox.hidden) setOpen(true);
        const visible = visibleOptions();
        const next = activeIndex < 0
          ? event.key === "ArrowDown" ? 0 : visible.length - 1
          : activeIndex + (event.key === "ArrowDown" ? 1 : -1);
        setActive(next);
      } else if (event.key === "Enter" && activeIndex >= 0) {
        const option = visibleOptions()[activeIndex];
        if (option) {
          event.preventDefault();
          select(option);
        } else {
          clearActive();
        }
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
