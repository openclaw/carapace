function setSensitiveToggleIcon(toggle, revealed) {
  const icon = revealed ? "eye-off" : "eye";
  toggle.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  toggle.ownerDocument?.defaultView?.lucide?.createIcons({
    root: toggle,
    attrs: {
      "aria-hidden": "true",
      "stroke-width": "1.75",
    },
  });
}

export function bindSensitiveInputs(root = document) {
  const controls = [...root.querySelectorAll("[data-sensitive-input]")];
  let bound = 0;

  for (const control of controls) {
    const input = control.querySelector("[data-sensitive-value]");
    const mask = control.querySelector("[data-sensitive-mask]");
    const maskText = mask?.querySelector("[data-sensitive-mask-text]");
    const toggle = control.querySelector("[data-toggle-sensitive]");
    if (!input || !toggle) continue;

    const label = toggle.getAttribute("data-sensitive-label") || "value";
    // sync runs on every input/scroll event; only rebuild the toggle icon on
    // reveal transitions so scrolling does not thrash innerHTML + createIcons.
    let lastRevealed = null;
    const sync = () => {
      const revealed = input.type === "text";
      control.dataset.revealed = String(revealed);
      if (mask) {
        mask.hidden = revealed;
        if (maskText) {
          maskText.textContent = revealed ? "" : "*".repeat([...input.value].length);
          maskText.style.transform = `translateX(${-input.scrollLeft}px)`;
        }
      }
      control.dataset.sensitiveMaskReady = String(Boolean(mask && maskText));
      if (revealed !== lastRevealed) {
        lastRevealed = revealed;
        setSensitiveToggleIcon(toggle, revealed);
        toggle.setAttribute("aria-pressed", String(revealed));
        toggle.setAttribute("aria-label", `${revealed ? "Hide" : "Show"} ${label}`);
      }
    };

    sync();
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    input.addEventListener("focus", sync);
    input.addEventListener("scroll", sync);
    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      sync();
    });
    bound += 1;
  }

  return bound;
}
