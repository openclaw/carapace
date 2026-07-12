export function bindDialogs(root = document) {
  const components = [...root.querySelectorAll("[data-dialog]")];

  for (const component of components) {
    const dialog = component.querySelector("dialog");
    const trigger = component.querySelector("[data-dialog-open]");
    if (!dialog || !trigger) continue;

    trigger.addEventListener("click", () => dialog.showModal());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-dialog-close]")) dialog.close();
    });
    dialog.addEventListener("close", () => trigger.focus());
  }

  return components.length;
}
