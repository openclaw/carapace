const activeObservers = new WeakMap();

export function getTableOfContentsEntries(source) {
  if (!source?.querySelectorAll) return [];

  return [...source.querySelectorAll("h2[id], h3[id]")].map((heading) => ({
    id: heading.id,
    label: heading.textContent?.trim() || heading.id,
    level: heading.tagName === "H3" ? 3 : 2,
  }));
}

export function populateGeneratedTablesOfContents(root = document) {
  const document = root.ownerDocument ?? root;
  const navs = [...root.querySelectorAll("[data-generated-toc]")];

  for (const nav of navs) {
    const sourceSelector = nav.getAttribute("data-toc-source");
    const source = sourceSelector ? document.querySelector(sourceSelector) : null;
    const links = nav.querySelector("[data-toc-links]");
    if (!source || !links) continue;

    const anchors = getTableOfContentsEntries(source).map((entry) => {
      const anchor = document.createElement("a");
      anchor.className = `introduction-toc-link introduction-toc-level-${entry.level}`;
      anchor.href = `#${entry.id}`;
      anchor.textContent = entry.label;
      return anchor;
    });
    links.replaceChildren(...anchors);
  }

  return navs.length;
}

export function disconnectTablesOfContents(root = document) {
  const document = root.ownerDocument ?? root;
  activeObservers.get(document)?.disconnect();
  activeObservers.delete(document);
}

export function setCurrentTableOfContentsLink(nav, current) {
  if (!nav || !current) return false;

  for (const link of nav.querySelectorAll('.oc-table-of-contents-link, a[href^="#"]')) {
    if (link === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }

  return true;
}

export function bindTablesOfContents(root = document) {
  populateGeneratedTablesOfContents(root);
  const navs = [...root.querySelectorAll(".oc-table-of-contents, .introduction-toc")];

  for (const nav of navs) {
    nav.addEventListener("click", (event) => {
      const link = event.target.closest?.('.oc-table-of-contents-link, a[href^="#"]');
      if (link && nav.contains(link)) setCurrentTableOfContentsLink(nav, link);
    });
    const first = nav.querySelector('a[href^="#"]');
    if (first) setCurrentTableOfContentsLink(nav, first);
  }

  const view = root.ownerDocument?.defaultView ?? root.defaultView;
  const document = root.ownerDocument ?? root;
  disconnectTablesOfContents(document);

  if (view?.IntersectionObserver) {
    const linksByTarget = new Map();
    for (const nav of navs) {
      for (const link of nav.querySelectorAll('a[href^="#"]')) {
        const id = decodeURIComponent(link.getAttribute("href").slice(1));
        const target = document.getElementById(id);
        if (target) linksByTarget.set(target, { nav, link });
      }
    }

    const observer = new view.IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        const active = visible[0] ? linksByTarget.get(visible[0].target) : null;
        if (active) setCurrentTableOfContentsLink(active.nav, active.link);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] },
    );
    for (const target of linksByTarget.keys()) observer.observe(target);
    activeObservers.set(document, observer);
  }

  return navs.length;
}
