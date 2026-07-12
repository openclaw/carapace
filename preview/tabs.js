export function bindTabs(root = document) {
  const tabsets = [...root.querySelectorAll("[data-tabs]")];

  for (const tabset of tabsets) {
    const tabs = [...tabset.querySelectorAll('[role="tab"]')];
    const panels = [...tabset.querySelectorAll('[role="tabpanel"]')];
    if (!tabs.length || !panels.length) continue;

    const activate = (tab, focus = false) => {
      for (const item of tabs) {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      }
      for (const panel of panels) panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      if (focus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        activate(tabs[(index + direction + tabs.length) % tabs.length], true);
      });
    });
  }

  return tabsets.length;
}
