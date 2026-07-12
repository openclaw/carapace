export function bindCommandPalettes(root = document) {
  const palettes = [...root.querySelectorAll("[data-command-palette]")];

  for (const palette of palettes) {
    const dialog = palette.querySelector("dialog");
    const trigger = palette.querySelector("[data-command-palette-open]");
    const input = palette.querySelector("[data-command-palette-input]");
    const items = [...palette.querySelectorAll("[data-command-palette-item]")];
    if (!dialog || !trigger || !input) continue;

    const filter = () => {
      const query = input.value.trim().toLowerCase();
      for (const item of items) item.hidden = query !== "" && !item.textContent.toLowerCase().includes(query);
    };

    trigger.addEventListener("click", () => {
      dialog.showModal();
      input.focus();
    });
    input.addEventListener("input", filter);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-command-palette-close]")) dialog.close();
      if (event.target.closest("[data-command-palette-item]")) dialog.close();
    });
    dialog.addEventListener("close", () => {
      input.value = "";
      filter();
      trigger.focus();
    });
  }

  return palettes.length;
}
