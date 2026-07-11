export const exampleDialogAttribute = "data-example-dialog";
export const exampleDialogSelector = `[${exampleDialogAttribute}]`;

export function bindExampleDialog(root = document) {
  const trigger = root.querySelector("[data-open-dialog]");
  const dialog = root.querySelector(exampleDialogSelector);
  if (!trigger || !dialog) return false;

  trigger.addEventListener("click", () => dialog.showModal());
  return true;
}
