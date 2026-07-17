const dialogMotion = (dialog, opening) => {
  const reduced = dialog.ownerDocument.defaultView
    ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return dialog.animate(
    opening
      ? [
          { opacity: 0, transform: reduced ? "none" : "scale(0.9)" },
          { opacity: 1, transform: "scale(1)" },
        ]
      : [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: reduced ? "none" : "scale(0.9)" },
        ],
    {
      duration: reduced ? 100 : 150,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    },
  );
};

export function bindDialogs(root = document) {
  const components = [...root.querySelectorAll("[data-dialog]")];

  for (const component of components) {
    const dialog = component.querySelector("dialog");
    const trigger = component.querySelector("[data-dialog-open]");
    if (!dialog || !trigger) continue;

    const close = async () => {
      if (!dialog.open || dialog.dataset.closing === "true") return;
      dialog.dataset.closing = "true";
      await dialogMotion(dialog, false).finished;
      delete dialog.dataset.closing;
      dialog.close();
    };

    trigger.addEventListener("click", () => {
      dialog.showModal();
      dialogMotion(dialog, true);
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-dialog-close]")) close();
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      close();
    });
    dialog.addEventListener("close", () => trigger.focus());
  }

  return components.length;
}
