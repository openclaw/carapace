const boundSidebars = new WeakSet();
const boundDocuments = new WeakSet();

export function setCurrentSidebarLink(nav, current) {
  if (!nav || !current) return false;

  for (const link of nav.querySelectorAll(".oc-sidebar-link")) {
    if (link === current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }

  return true;
}

export function setSidebarDisclosure(toggle, panel, expanded) {
  if (!toggle || !panel) return false;
  toggle.setAttribute("aria-expanded", String(expanded));
  const supportsAnimatedDisclosure = Boolean(
    panel.querySelector?.(".oc-sidebar-group-items-inner") ||
      panel.matches?.("[data-sidebar-workspace-menu]"),
  );
  panel.hidden = supportsAnimatedDisclosure ? false : !expanded;
  panel.setAttribute?.("data-open", String(expanded));
  panel.setAttribute?.("aria-hidden", String(!expanded));
  panel.inert = !expanded;
  return true;
}

function setSidebarCollapseIcon(toggle, collapsed) {
  if (!toggle) return;
  const icon = collapsed ? "panel-left-open" : "panel-left-close";
  toggle.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  toggle.ownerDocument?.defaultView?.lucide?.createIcons({
    root: toggle,
    attrs: {
      "aria-hidden": "true",
      "stroke-width": "1.75",
    },
  });
}

function dispatchSidebarEvent(sidebar, type, detail) {
  if (!sidebar?.dispatchEvent) return;
  const EventConstructor = sidebar.ownerDocument?.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  if (EventConstructor) {
    sidebar.dispatchEvent(new EventConstructor(type, { bubbles: true, detail }));
    return;
  }
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, "detail", { value: detail });
  sidebar.dispatchEvent(event);
}

export function setSidebarCollapsed(sidebar, toggle, collapsed) {
  if (!sidebar || !toggle) return false;
  sidebar.setAttribute("data-collapsed", String(collapsed));
  toggle.setAttribute("aria-expanded", String(!collapsed));
  toggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  setSidebarCollapseIcon(toggle, collapsed);

  if (collapsed) {
    const workspaceToggle = sidebar.querySelector("[data-sidebar-workspace-toggle]");
    const workspaceMenu = sidebar.querySelector("[data-sidebar-workspace-menu]");
    setSidebarDisclosure(workspaceToggle, workspaceMenu, false);
  }
  dispatchSidebarEvent(sidebar, "oc-sidebar-collapse-change", { collapsed });
  return true;
}

export function setSidebarWorkspace(sidebar, option) {
  if (!sidebar || !option) return false;
  const workspace = option.getAttribute("data-sidebar-workspace-id");
  const name = option.getAttribute("data-sidebar-workspace-name");
  const description = option.getAttribute("data-sidebar-workspace-description");
  const optionAvatarImage = option.querySelector?.("img.oc-avatar-image");
  if (!workspace || !name || !description || !optionAvatarImage) return false;

  sidebar.setAttribute("data-sidebar-workspace", workspace);
  for (const candidate of sidebar.querySelectorAll("[data-sidebar-workspace-option]")) {
    candidate.setAttribute("aria-checked", String(candidate === option));
  }

  const title = sidebar.querySelector("[data-sidebar-workspace-title]");
  const subtitle = sidebar.querySelector("[data-sidebar-workspace-subtitle]");
  const avatar = sidebar.querySelector("[data-sidebar-workspace-avatar]");
  if (title) title.textContent = name;
  if (subtitle) subtitle.textContent = description;
  if (avatar) avatar.setAttribute("aria-label", `${name} workspace`);
  if (avatar?.replaceChildren) {
    const avatarImage = optionAvatarImage.cloneNode(true);
    avatarImage.alt = "";
    avatar.replaceChildren(avatarImage);
  }

  for (const panel of sidebar.querySelectorAll("[data-sidebar-workspace-panel]")) {
    const active = panel.getAttribute("data-sidebar-workspace-panel") === workspace;
    panel.setAttribute("data-active", String(active));
    panel.setAttribute("aria-hidden", String(!active));
    panel.inert = !active;
  }

  dispatchSidebarEvent(sidebar, "oc-sidebar-workspace-change", { workspace });
  return true;
}

function workspaceOptions(sidebar) {
  return [...sidebar.querySelectorAll("[data-sidebar-workspace-option]")];
}

function moveWorkspaceFocus(sidebar, option, direction) {
  const options = workspaceOptions(sidebar);
  const current = options.indexOf(option);
  if (current < 0 || options.length === 0) return;
  options[(current + direction + options.length) % options.length].focus();
}

function bindDocumentOutsideClose(document) {
  if (!document || boundDocuments.has(document)) return;
  boundDocuments.add(document);
  document.addEventListener("pointerdown", (event) => {
    for (const sidebar of document.querySelectorAll(".oc-sidebar")) {
      if (sidebar.contains(event.target)) continue;
      setSidebarDisclosure(
        sidebar.querySelector("[data-sidebar-workspace-toggle]"),
        sidebar.querySelector("[data-sidebar-workspace-menu]"),
        false,
      );
    }
  });
}

export function bindSidebars(root = document, options = {}) {
  const sidebars = [...root.querySelectorAll(".oc-sidebar")];

  for (const sidebar of sidebars) {
    if (boundSidebars.has(sidebar)) continue;
    boundSidebars.add(sidebar);
    bindDocumentOutsideClose(sidebar.ownerDocument);

    const nav = sidebar.querySelector(".oc-sidebar-nav");
    nav?.addEventListener("click", (event) => {
      const link = event.target.closest?.(".oc-sidebar-link");
      const workspace = link?.closest?.("[data-sidebar-workspace-panel]");
      if (link && nav.contains(link)) setCurrentSidebarLink(workspace ?? nav, link);
    });

    const workspaceToggle = sidebar.querySelector("[data-sidebar-workspace-toggle]");
    const workspaceMenu = sidebar.querySelector("[data-sidebar-workspace-menu]");
    workspaceToggle?.addEventListener("click", () => {
      setSidebarDisclosure(
        workspaceToggle,
        workspaceMenu,
        workspaceToggle.getAttribute("aria-expanded") !== "true",
      );
    });
    workspaceToggle?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      setSidebarDisclosure(workspaceToggle, workspaceMenu, true);
      const choices = workspaceOptions(sidebar);
      const selected = choices.find((choice) => choice.getAttribute("aria-checked") === "true");
      (selected ?? choices[event.key === "ArrowDown" ? 0 : choices.length - 1])?.focus();
    });

    for (const option of workspaceOptions(sidebar)) {
      option.addEventListener("click", () => {
        if (!setSidebarWorkspace(sidebar, option)) return;
        setSidebarDisclosure(workspaceToggle, workspaceMenu, false);
        workspaceToggle?.focus();
        options.onWorkspaceChange?.(option.getAttribute("data-sidebar-workspace-id"));
      });
      option.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          moveWorkspaceFocus(sidebar, option, event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          const choices = workspaceOptions(sidebar);
          choices[event.key === "Home" ? 0 : choices.length - 1]?.focus();
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setSidebarDisclosure(workspaceToggle, workspaceMenu, false);
          workspaceToggle?.focus();
          return;
        }
        if (event.key === "Tab") setSidebarDisclosure(workspaceToggle, workspaceMenu, false);
      });
    }
    workspaceMenu?.addEventListener("focusout", (event) => {
      if (event.relatedTarget && workspaceMenu.contains(event.relatedTarget)) return;
      if (event.relatedTarget === workspaceToggle) return;
      setSidebarDisclosure(workspaceToggle, workspaceMenu, false);
    });

    for (const toggle of sidebar.querySelectorAll("[data-sidebar-group-toggle]")) {
      const group = toggle.closest("[data-sidebar-group]");
      const panel = group?.querySelector("[data-sidebar-group-panel]");
      toggle.addEventListener("click", () => {
        setSidebarDisclosure(toggle, panel, toggle.getAttribute("aria-expanded") !== "true");
      });
    }

    const collapse = sidebar.querySelector("[data-sidebar-collapse]");
    collapse?.addEventListener("click", () => {
      const collapsed = sidebar.getAttribute("data-collapsed") !== "true";
      setSidebarCollapsed(sidebar, collapse, collapsed);
      options.onCollapsedChange?.(collapsed);
    });

    sidebar.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || workspaceToggle?.getAttribute("aria-expanded") !== "true") {
        return;
      }
      setSidebarDisclosure(workspaceToggle, workspaceMenu, false);
      workspaceToggle.focus();
    });
  }

  return sidebars.length;
}
