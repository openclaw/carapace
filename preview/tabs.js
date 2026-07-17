const tabSelection = new Map();

function getTabValue(tab) {
  return tab.dataset?.tabValue || tab.getAttribute("aria-controls");
}

export function bindTabs(root = document) {
  const tabsets = [...root.querySelectorAll("[data-tabs]")];

  for (const tabset of tabsets) {
    const tabs = [...tabset.querySelectorAll('[role="tab"]')];
    const panels = [...tabset.querySelectorAll('[role="tabpanel"]')];
    if (!tabs.length || !panels.length) continue;
    const list = typeof tabset.querySelector === "function"
      ? tabset.querySelector('[role="tablist"]')
      : null;
    const document = list?.ownerDocument;
    const indicator = document?.createElement && list?.appendChild
      ? document.createElement("span")
      : null;
    if (indicator) {
      indicator.className = "oc-tabs-indicator";
      indicator.setAttribute("aria-hidden", "true");
      list.appendChild(indicator);
    }

    const key = tabset.dataset?.tabsKey;
    const activate = (tab, focus = false) => {
      const scroller = tabset.ownerDocument?.scrollingElement;
      const scrollLeft = scroller?.scrollLeft;
      const scrollTop = scroller?.scrollTop;
      for (const item of tabs) {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      }
      for (const panel of panels) panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      if (list && indicator) {
        list.style?.setProperty("--oc-active-tab-left", `${tab.offsetLeft || 0}px`);
        list.style?.setProperty("--oc-active-tab-width", `${tab.offsetWidth || 0}px`);
        indicator.dataset.rendered = "true";
      }
      if (key) tabSelection.set(key, getTabValue(tab));
      if (focus) tab.focus();
      if (scroller) {
        scroller.scrollLeft = scrollLeft;
        scroller.scrollTop = scrollTop;
      }
    };

    const remembered = key && tabSelection.get(key);
    const initial = remembered
      ? tabs.find((tab) => getTabValue(tab) === remembered)
      : tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    if (initial) activate(initial);

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
