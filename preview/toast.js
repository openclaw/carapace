const motion = (element, keyframes, duration) => {
  const view = element.ownerDocument?.defaultView;
  if (!view || typeof element.animate !== "function") return null;
  const reduced = view
    ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frames = reduced ? keyframes.map(({ opacity }) => ({ opacity })) : keyframes;
  return element.animate(frames, {
    duration: reduced ? 100 : duration,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  });
};

const workbenchMessages = [
  ["Toast created", "This is a toast notification."],
  ["Changes saved", "The component reference is up to date."],
  ["Connection restored", "Live updates are available again."],
];

function createWorkbenchToast(document, dismissible, sequence) {
  const toast = document.createElement("div");
  const [title, message] = workbenchMessages[sequence % workbenchMessages.length];
  toast.className = "oc-toast";
  toast.innerHTML = `<div class="oc-toast-content">
  <p class="oc-toast-title">${title}</p>
  <p class="oc-toast-message">${message}</p>
</div>${dismissible
    ? '<button class="oc-toast-close" type="button" aria-label="Dismiss notification" data-workbench-toast-dismiss><i data-lucide="x"></i></button>'
    : ""}`;
  return toast;
}

function bindWorkbenchToastEvents(root) {
  const document = root.ownerDocument || root;
  if (!document.documentElement?.dataset || typeof document.addEventListener !== "function") return;
  if (document.documentElement.dataset.workbenchToastDelegated === "true") return;
  document.documentElement.dataset.workbenchToastDelegated = "true";
  let sequence = 0;

  document.addEventListener("click", async (event) => {
    const trigger = event.target.closest("[data-workbench-toast-trigger]");
    if (trigger) {
      const workbench = trigger.closest(".component-workbench");
      if (!workbench) return;
      let region = workbench.querySelector(":scope > [data-workbench-toast-portal]");
      if (!region) {
        region = document.createElement("div");
        region.className = "oc-toast-region component-workbench-toast-region";
        region.dataset.workbenchToastPortal = "";
        region.dataset.toastStack = "single";
        region.setAttribute("aria-label", "Notifications");
        region.setAttribute("aria-live", "polite");
        region.setAttribute("aria-relevant", "additions removals");
        workbench.append(region);
      }

      const toast = createWorkbenchToast(
        document,
        trigger.dataset.toastDismissible !== "false",
        sequence,
      );
      sequence += 1;
      region.prepend(toast);
      while (region.children.length > 3) region.lastElementChild?.remove();
      region.dataset.toastStack = region.children.length > 1 ? "multiple" : "single";
      const visibleControl = workbench.querySelector('[data-workbench-control="visible"]');
      if (visibleControl) visibleControl.checked = true;
      document.defaultView?.lucide?.createIcons({
        attrs: { "aria-hidden": "true", "stroke-width": "1.75" },
      });
      motion(
        toast,
        [
          { opacity: 0, transform: "translateY(150%)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        500,
      );
      return;
    }

    const dismiss = event.target.closest("[data-workbench-toast-dismiss]");
    const toast = dismiss?.closest(".oc-toast");
    const region = toast?.closest("[data-workbench-toast-portal]");
    if (!toast || !region) return;
    const animation = motion(
      toast,
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(150%)" },
      ],
      500,
    );
    if (animation) await animation.finished;
    toast.remove();
    region.dataset.toastStack = region.children.length > 1 ? "multiple" : "single";
    if (!region.children.length) region.remove();
  });
}

function bindToast(region, toast, returnFocus) {
  if (toast.getAttribute("data-toast-bound") === "true") return;
  toast.setAttribute("data-toast-bound", "true");
  motion(
    toast,
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    200,
  );

  if (toast.getAttribute("role") === "status") toast.removeAttribute("role");
  const dismiss = toast.querySelector("[data-toast-dismiss]");
  dismiss?.addEventListener("click", async () => {
    const toasts = [...region.querySelectorAll("[data-toast]")];
    const index = toasts.indexOf(toast);
    const adjacent = toasts[index + 1] || toasts[index - 1];
    const focusTarget = adjacent?.querySelector(
      "[data-toast-dismiss], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    );

    const animation = motion(
      toast,
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(8px)" },
      ],
      160,
    );
    if (animation) await animation.finished;
    toast.remove();
    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
    } else if (returnFocus) {
      returnFocus.focus({ preventScroll: true });
    } else {
      region.tabIndex = -1;
      region.focus({ preventScroll: true });
    }
  });
}

export function bindToasts(root = document) {
  bindWorkbenchToastEvents(root);
  const regions = [...root.querySelectorAll("[data-toast-region]")];

  for (const region of regions) {
    if (!region.getAttribute("aria-live")) region.setAttribute("aria-live", "polite");
    if (!region.getAttribute("aria-relevant")) {
      region.setAttribute("aria-relevant", "additions removals");
    }

    for (const toast of region.querySelectorAll("[data-toast]")) bindToast(region, toast);
  }

  for (const trigger of root.querySelectorAll("[data-toast-trigger]")) {
    if (trigger.getAttribute("data-toast-bound") === "true") continue;
    const region = regions.find(({ id }) => id === trigger.getAttribute("aria-controls"));
    const template = trigger.parentElement?.querySelector("[data-toast-template]");
    if (!region || !template?.content.firstElementChild) continue;
    trigger.setAttribute("data-toast-bound", "true");
    trigger.addEventListener("click", () => {
      const toast = template.content.firstElementChild.cloneNode(true);
      region.append(toast);
      bindToast(region, toast, trigger);
    });
  }

  return regions.length;
}
