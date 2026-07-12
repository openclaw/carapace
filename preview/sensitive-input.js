export function bindSensitiveInputs(root = document) {
  const controls = [...root.querySelectorAll("[data-sensitive-input]")];
  let bound = 0;

  for (const control of controls) {
    const input = control.querySelector("[data-sensitive-value]");
    const toggle = control.querySelector("[data-toggle-sensitive]");
    if (!input || !toggle) continue;

    const label = toggle.getAttribute("data-sensitive-label") || "value";
    const sync = () => {
      const revealed = input.type === "text";
      toggle.textContent = revealed ? "Hide" : "Show";
      toggle.setAttribute("aria-pressed", String(revealed));
      toggle.setAttribute("aria-label", `${revealed ? "Hide" : "Show"} ${label}`);
    };

    sync();
    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      sync();
    });
    bound += 1;
  }

  return bound;
}
