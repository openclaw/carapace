export const toastToneOptions = [
  { label: "Neutral", value: "neutral" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Information", value: "info" },
];

export const toastLifecycleOptions = [
  { label: "Timed", value: "timed" },
  { label: "Persistent", value: "persistent" },
];

const toastPresentations = {
  neutral: {
    icon: "bell",
    title: "Notification",
    message: "This is a toast notification.",
  },
  success: {
    icon: "circle-check",
    title: "Changes saved",
    message: "The component reference is up to date.",
  },
  warning: {
    icon: "triangle-alert",
    title: "Action needed",
    message: "Review the changes before continuing.",
  },
  error: {
    icon: "circle-alert",
    title: "Update failed",
    message: "Resolve the reported issue before trying again.",
  },
  info: {
    icon: "info",
    title: "Reference available",
    message: "A new component reference is ready to review.",
  },
};

const toastLifetimes = new WeakMap();
const focusableSelector =
  "[data-toast-dismiss], [data-workbench-toast-dismiss], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export function resolveToastTone(tone) {
  return toastToneOptions.some(({ value }) => value === tone) ? tone : "neutral";
}

export function resolveToastLifecycle(tone, lifecycle) {
  if (resolveToastTone(tone) === "error") return "persistent";
  return toastLifecycleOptions.some(({ value }) => value === lifecycle)
    ? lifecycle
    : "timed";
}

export function getToastPresentation(tone) {
  return toastPresentations[resolveToastTone(tone)];
}

const motion = (element, keyframes, duration) => {
  const view = element.ownerDocument?.defaultView;
  if (!view || typeof element.animate !== "function") return null;
  const reduced = view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const frames = reduced ? keyframes.map(({ opacity }) => ({ opacity })) : keyframes;
  return element.animate(frames, {
    duration: reduced ? 100 : duration,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  });
};

export function animateWorkbenchToast(toast, opening) {
  return motion(
    toast,
    opening
      ? [
          { opacity: 0, transform: "translateY(150%)" },
          { opacity: 1, transform: "translateY(0)" },
        ]
      : [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(150%)" },
        ],
    500,
  );
}

export function bindToastLifetime(toast, onExpire, duration = 5000) {
  const lifecycle = resolveToastLifecycle(
    toast.dataset?.toastTone,
    toast.dataset?.toastLifecycle,
  );
  if (toast.dataset) toast.dataset.toastLifecycle = lifecycle;
  toastLifetimes.get(toast)?.cancel();
  if (lifecycle !== "timed") return null;

  const view = toast.ownerDocument?.defaultView ?? globalThis;
  const now = () => view.performance?.now?.() ?? Date.now();
  let remaining = duration;
  let startedAt = 0;
  let timer = null;
  const pausedBy = new Set();

  const clear = () => {
    if (timer == null) return;
    view.clearTimeout(timer);
    timer = null;
  };
  const schedule = () => {
    if (timer != null || pausedBy.size) return;
    startedAt = now();
    timer = view.setTimeout(() => {
      timer = null;
      onExpire();
    }, remaining);
  };
  const pause = (reason) => {
    if (pausedBy.has(reason)) return;
    pausedBy.add(reason);
    if (timer == null) return;
    remaining = Math.max(0, remaining - (now() - startedAt));
    clear();
  };
  const resume = (reason) => {
    pausedBy.delete(reason);
    schedule();
  };
  const onPointerEnter = () => pause("pointer");
  const onPointerLeave = () => resume("pointer");
  const onFocusIn = () => pause("focus");
  const onFocusOut = (event) => {
    if (event.relatedTarget && toast.contains?.(event.relatedTarget)) return;
    resume("focus");
  };
  const cancel = () => {
    clear();
    toast.removeEventListener("pointerenter", onPointerEnter);
    toast.removeEventListener("pointerleave", onPointerLeave);
    toast.removeEventListener("focusin", onFocusIn);
    toast.removeEventListener("focusout", onFocusOut);
    toastLifetimes.delete(toast);
  };

  toast.addEventListener("pointerenter", onPointerEnter);
  toast.addEventListener("pointerleave", onPointerLeave);
  toast.addEventListener("focusin", onFocusIn);
  toast.addEventListener("focusout", onFocusOut);
  const controller = { cancel, pause, resume };
  toastLifetimes.set(toast, controller);
  schedule();
  return controller;
}

function syncToastStack(region) {
  const count = region.querySelectorAll("[data-toast], .oc-toast").length;
  if (region.dataset) region.dataset.toastStack = count > 1 ? "multiple" : "single";
}

function removeToastImmediately(toast) {
  toastLifetimes.get(toast)?.cancel();
  toast.remove();
}

export async function dismissToast(
  region,
  toast,
  { returnFocus, restoreFocus = true, offset = 8 } = {},
) {
  const toasts = [...region.querySelectorAll("[data-toast], .oc-toast")];
  const index = toasts.indexOf(toast);
  const adjacent = toasts[index + 1] || toasts[index - 1];
  const focusTarget = adjacent?.querySelector(focusableSelector) ?? returnFocus;
  toastLifetimes.get(toast)?.cancel();
  toast.inert = true;
  toast.setAttribute?.("aria-hidden", "true");

  const animation = motion(
    toast,
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: `translateY(${offset}px)` },
    ],
    offset > 8 ? 500 : 160,
  );
  if (animation) await animation.finished;
  toast.remove();
  syncToastStack(region);

  if (!restoreFocus) return true;
  if (focusTarget) {
    focusTarget.focus({ preventScroll: true });
  } else {
    region.tabIndex = -1;
    region.focus({ preventScroll: true });
  }
  return true;
}

export function createWorkbenchToastRegion(document, workbench) {
  const existing = workbench.querySelector("[data-workbench-toast-portal]");
  if (existing) return existing;
  const region = document.createElement("div");
  region.className = "oc-toast-region component-workbench-toast-region";
  region.dataset.workbenchToastPortal = "";
  region.dataset.toastStack = "single";
  region.setAttribute("aria-label", "Notifications");
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-relevant", "additions removals");
  const canvas = workbench.querySelector("[data-workbench-canvas]");
  (canvas ?? workbench).append(region);
  return region;
}

export function removeWorkbenchToastRegion(workbench) {
  const region = workbench?.querySelector("[data-workbench-toast-portal]");
  if (!region) return false;
  for (const toast of region.querySelectorAll(".oc-toast")) {
    toastLifetimes.get(toast)?.cancel();
  }
  region.remove();
  return true;
}

export function createWorkbenchToast(
  document,
  { dismissible = true, lifecycle = "timed", tone = "neutral" } = {},
) {
  const selectedTone = resolveToastTone(tone);
  const selectedLifecycle = resolveToastLifecycle(selectedTone, lifecycle);
  const presentation = getToastPresentation(selectedTone);
  const canDismiss = dismissible || selectedTone === "error";
  const toast = document.createElement("div");
  toast.className = "oc-toast";
  toast.dataset.toastTone = selectedTone;
  toast.dataset.toastLifecycle = selectedLifecycle;
  if (selectedLifecycle === "timed" && !canDismiss) toast.tabIndex = 0;
  toast.innerHTML = `<span class="oc-toast-status-icon" aria-hidden="true"><i data-lucide="${presentation.icon}"></i></span>
<div class="oc-toast-content">
  <p class="oc-toast-title">${presentation.title}</p>
  <p class="oc-toast-message">${presentation.message}</p>
</div>${canDismiss
    ? '<button class="oc-toast-close" type="button" aria-label="Dismiss notification" data-workbench-toast-dismiss><i data-lucide="x"></i></button>'
    : ""}`;
  return toast;
}

function syncWorkbenchVisibleControl(workbench, visible) {
  const visibleControl = workbench.querySelector('[data-workbench-control="visible"]');
  if (visibleControl) visibleControl.checked = visible;
}

export function syncWorkbenchToastVisibility(workbench, region) {
  const activeRegion = workbench.querySelector("[data-workbench-toast-portal]");
  if (activeRegion !== region || region.children.length) return false;
  syncWorkbenchVisibleControl(workbench, false);
  return true;
}

export function showWorkbenchToast(workbench, options) {
  const document = workbench.ownerDocument ?? globalThis.document;
  const region = createWorkbenchToastRegion(document, workbench);
  const toast = createWorkbenchToast(document, options);
  region.prepend(toast);
  while (region.children.length > 3) removeToastImmediately(region.lastElementChild);
  syncToastStack(region);
  syncWorkbenchVisibleControl(workbench, true);
  document.defaultView?.lucide?.createIcons({
    root: region,
    attrs: { "aria-hidden": "true", "stroke-width": "1.75" },
  });
  animateWorkbenchToast(toast, true);
  bindToastLifetime(toast, async () => {
    await dismissToast(region, toast, { restoreFocus: false, offset: 150 });
    syncWorkbenchToastVisibility(workbench, region);
  });
  return toast;
}

function bindWorkbenchToastEvents(root) {
  const document = root.ownerDocument || root;
  if (!document.documentElement?.dataset || typeof document.addEventListener !== "function") return;
  if (document.documentElement.dataset.workbenchToastDelegated === "true") return;
  document.documentElement.dataset.workbenchToastDelegated = "true";

  document.addEventListener("click", async (event) => {
    const trigger = event.target.closest("[data-workbench-toast-trigger]");
    if (trigger) {
      const workbench = trigger.closest(".component-workbench");
      if (!workbench) return;
      showWorkbenchToast(workbench, {
        dismissible: trigger.dataset.toastDismissible !== "false",
        lifecycle: trigger.dataset.toastLifecycle,
        tone: trigger.dataset.toastTone,
      });
      return;
    }

    const dismiss = event.target.closest("[data-workbench-toast-dismiss]");
    const toast = dismiss?.closest(".oc-toast");
    const region = toast?.closest("[data-workbench-toast-portal]");
    const workbench = region?.closest(".component-workbench");
    if (!toast || !region || !workbench) return;
    const returnFocus = workbench.querySelector("[data-workbench-toast-trigger]");
    await dismissToast(region, toast, { returnFocus, offset: 150 });
    syncWorkbenchToastVisibility(workbench, region);
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
  toast.querySelector("[data-toast-dismiss]")?.addEventListener("click", () => {
    void dismissToast(region, toast, { returnFocus });
  });
  bindToastLifetime(toast, () => {
    void dismissToast(region, toast, { restoreFocus: false });
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
      region.prepend(toast);
      bindToast(region, toast, trigger);
      while (region.children.length > 3) removeToastImmediately(region.lastElementChild);
      syncToastStack(region);
      region.ownerDocument?.defaultView?.lucide?.createIcons({
        attrs: { "aria-hidden": "true", "stroke-width": "1.75" },
      });
    });
  }

  return regions.length;
}
