export function setCurrentSidebarLink(nav, current) {
  if (!nav || !current) return false;

  for (const link of nav.querySelectorAll(".oc-sidebar-link")) {
    if (link === current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }

  return true;
}

export function bindSidebars(root = document) {
  const navs = [...root.querySelectorAll(".oc-sidebar-nav")];

  for (const nav of navs) {
    nav.addEventListener("click", (event) => {
      const link = event.target.closest?.(".oc-sidebar-link");
      if (link && nav.contains(link)) setCurrentSidebarLink(nav, link);
    });
  }

  return navs.length;
}
