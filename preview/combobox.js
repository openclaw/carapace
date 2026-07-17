export function bindCombobox(root = document) {
  const controls = [...root.querySelectorAll("[data-combobox]")];
  let bound = 0;

  for (const control of controls) {
    if (control.dataset.comboboxBound === "true") continue;

    const input = control.querySelector("[role='combobox']");
    const toggle = control.querySelector("[data-combobox-toggle]");
    const listbox = control.querySelector("[role='listbox']");
    if (!input || !toggle || !listbox) continue;

    control.dataset.comboboxBound = "true";
    bound += 1;
    const options = [...listbox.querySelectorAll("[role='option']")];
    const freeEntry = control.dataset.comboboxFreeEntry === "true";
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
      if (open) {
        const reduced = listbox.ownerDocument?.defaultView
          ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
        listbox.animate?.(
          [
            { opacity: 0, transform: reduced ? "none" : "translateY(-8px) scale(0.95)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          {
            duration: reduced ? 100 : 150,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          },
        );
      }
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
      input.dispatchEvent(new Event("change", { bubbles: true }));
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
        option.setAttribute("aria-selected", "false");
      }
      clearActive();
      const visible = visibleOptions();
      setOpen(visible.length > 0);
      if (!freeEntry && visible.length) setActive(0);
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
    listbox.addEventListener("pointerdown", (event) => event.preventDefault());
    control.addEventListener("focusout", (event) => {
      if (!control.contains(event.relatedTarget)) setOpen(false);
    });
  }

  return bound;
}
