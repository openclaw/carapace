export function bindToolbars(root = document) {
  const toolbars = [...root.querySelectorAll("[data-toolbar]")];

  for (const toolbar of toolbars) {
    const controls = [];
    for (const control of toolbar.querySelectorAll("[data-toolbar-item]")) {
      if (control.disabled || control.getAttribute?.("aria-disabled") === "true") {
        control.tabIndex = -1;
      } else {
        controls.push(control);
      }
    }
    if (!controls.length) continue;

    const setCurrent = (control, focus = false) => {
      for (const candidate of controls) candidate.tabIndex = candidate === control ? 0 : -1;
      if (focus) control.focus();
    };

    controls.forEach((control, index) => {
      control.tabIndex = index === 0 ? 0 : -1;
      control.addEventListener("focus", () => setCurrent(control));
      control.addEventListener("click", () => {
        setCurrent(control);
        if (control.hasAttribute("aria-pressed")) {
          control.setAttribute("aria-pressed", String(control.getAttribute("aria-pressed") !== "true"));
        }
      });
      control.addEventListener("keydown", (event) => {
        const target = event.key === "ArrowRight" || event.key === "ArrowDown"
          ? (index + 1) % controls.length
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? (index - 1 + controls.length) % controls.length
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? controls.length - 1
                : null;
        if (target === null) return;
        event.preventDefault();
        setCurrent(controls[target], true);
      });
    });
  }

  return toolbars.length;
}
