export const exampleDialogAttribute = "data-example-dialog";
export const exampleDialogSelector = `[${exampleDialogAttribute}]`;

export function bindExampleDialog(root = document) {
  const trigger = root.querySelector("[data-open-dialog]");
  const dialog = root.querySelector(exampleDialogSelector);
  if (!trigger || !dialog) return false;

  trigger.addEventListener("click", () => {
    dialog.showModal();
    const reduced = dialog.ownerDocument?.defaultView
      ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    dialog.animate?.(
      reduced
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: "scale(0.97)" },
            { opacity: 1, transform: "scale(1)" },
          ],
      {
        duration: reduced ? 120 : 200,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    );
  });
  return true;
}
