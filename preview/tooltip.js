const boundTooltips = new WeakSet();
const tooltipPositions = new WeakMap();
const registeredViews = new WeakSet();
const activeTooltips = new WeakMap();

function registerView(view) {
  if (!view?.document?.querySelectorAll || registeredViews.has(view)) return;

  const repositionOpenTooltips = () => {
    for (const tooltip of view.document.querySelectorAll("[data-tooltip]")) {
      tooltipPositions.get(tooltip)?.();
    }
  };

  view.addEventListener("resize", repositionOpenTooltips);
  view.addEventListener("scroll", repositionOpenTooltips, { passive: true, capture: true });
  registeredViews.add(view);
}

export function bindTooltips(root = document) {
  const tooltips = [...root.querySelectorAll("[data-tooltip]")];
  if (tooltips.length === 0) return 0;
  const view = root.defaultView || globalThis.window;
  const activeScope = view || root;
  registerView(view);

  for (const tooltip of tooltips) {
    if (boundTooltips.has(tooltip)) continue;
    const trigger = tooltip.querySelector("[data-tooltip-trigger]");
    const content = tooltip.querySelector("[data-tooltip-content]");
    if (!trigger || !content) continue;

    let hovered = false;
    let focused = false;
    let escapeSuppressed = false;

    const position = () => {
      if (!content.getBoundingClientRect || !view) return;
      content.removeAttribute("data-placement");
      content.removeAttribute("data-align");
      const rect = content.getBoundingClientRect();
      content.setAttribute("data-placement", rect.top < 8 ? "bottom" : "top");
      if (rect.left < 8) content.setAttribute("data-align", "start");
      else if (rect.right > view.innerWidth - 8) content.setAttribute("data-align", "end");
      else content.setAttribute("data-align", "center");
    };
    const eligible = () => hovered || focused;
    const show = ({ previous = null } = {}) => {
      if (escapeSuppressed || !eligible()) return false;
      tooltip.removeAttribute("data-suppressed");
      const active = activeTooltips.get(activeScope);
      let preempted = previous;
      if (active?.tooltip !== tooltip) {
        if (active?.eligible()) preempted = active;
        active?.hide({ suppress: true, restore: false });
      }
      position();
      content.setAttribute("data-open", "");
      activeTooltips.set(activeScope, { tooltip, show, hide, eligible, previous: preempted });
      return true;
    };
    const hide = ({ suppress = false, restore = true } = {}) => {
      if (suppress) tooltip.setAttribute("data-suppressed", "");
      content.removeAttribute("data-open");
      const active = activeTooltips.get(activeScope);
      const previous = active?.tooltip === tooltip ? active.previous : null;
      if (active?.tooltip === tooltip) {
        activeTooltips.delete(activeScope);
      }
      if (restore && previous?.eligible()) {
        previous.tooltip.removeAttribute("data-suppressed");
        previous.show({ previous: previous.previous });
      }
    };
    const repositionIfOpen = () => {
      if (content.getAttribute("data-open") != null) position();
    };
    const reset = () => {
      if (hovered || focused) return;
      escapeSuppressed = false;
      tooltip.removeAttribute("data-suppressed");
      hide({ restore: true });
    };

    tooltip.addEventListener("pointerenter", () => {
      hovered = true;
      show();
    });
    tooltip.addEventListener("pointerleave", () => {
      hovered = false;
      reset();
    });
    tooltip.addEventListener("focusin", () => {
      focused = true;
      show();
    });
    tooltip.addEventListener("focusout", (event) => {
      if (event.relatedTarget && tooltip.contains?.(event.relatedTarget)) return;
      focused = false;
      reset();
    });
    tooltip.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      escapeSuppressed = true;
      tooltip.setAttribute("data-suppressed", "");
      hide({ restore: false });
    });
    tooltipPositions.set(tooltip, repositionIfOpen);
    boundTooltips.add(tooltip);
  }

  return tooltips.length;
}
