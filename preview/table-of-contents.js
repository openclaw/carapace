export function setCurrentTableOfContentsLink(nav, current) {
  if (!nav || !current) return false;

  for (const link of nav.querySelectorAll(".oc-table-of-contents-link")) {
    if (link === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }

  return true;
}

export function bindTablesOfContents(root = document) {
  const navs = [...root.querySelectorAll(".oc-table-of-contents")];

  for (const nav of navs) {
    nav.addEventListener("click", (event) => {
      const link = event.target.closest?.(".oc-table-of-contents-link");
      if (link && nav.contains(link)) setCurrentTableOfContentsLink(nav, link);
    });
  }

  return navs.length;
}
