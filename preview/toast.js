export function bindToasts(root = document) {
  const regions = [...root.querySelectorAll("[data-toast-region]")];

  for (const region of regions) {
    if (!region.getAttribute("aria-live")) region.setAttribute("aria-live", "polite");
    if (!region.getAttribute("aria-relevant")) {
      region.setAttribute("aria-relevant", "additions removals");
    }

    for (const toast of region.querySelectorAll("[data-toast]")) {
      if (toast.getAttribute("role") === "status") toast.removeAttribute("role");
      const dismiss = toast.querySelector("[data-toast-dismiss]");
      dismiss?.addEventListener("click", () => {
        const toasts = [...region.querySelectorAll("[data-toast]")];
        const index = toasts.indexOf(toast);
        const adjacent = toasts[index + 1] || toasts[index - 1];
        const focusTarget = adjacent?.querySelector(
          "[data-toast-dismiss], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );

        toast.remove();
        if (focusTarget) {
          focusTarget.focus({ preventScroll: true });
        } else {
          region.tabIndex = -1;
          region.focus({ preventScroll: true });
        }
      });
    }
  }

  return regions.length;
}
