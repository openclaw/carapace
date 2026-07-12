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
        const target = event.key === "ArrowRight"
          ? (index + 1) % tabs.length
          : event.key === "ArrowLeft"
            ? (index - 1 + tabs.length) % tabs.length
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? tabs.length - 1
                : null;
        if (target === null) return;
        event.preventDefault();
        activate(tabs[target], true);
      });
    });
  }

  return tabsets.length;
}
