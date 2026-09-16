// Optional hover readout for Carapace chart primitives (oc-sparkline,
// oc-bars). The CSS stays fully usable without this module; calling
// initChartHover() activates any `.oc-chart-hover[data-oc-hover]` wrapper,
// where data-oc-hover is a JSON array of [label, value] pairs matching the
// chart's periods left to right.
export function initChartHover(root = document) {
  for (const band of root.querySelectorAll(".oc-chart-hover[data-oc-hover]")) {
    if (band.dataset.ocHoverBound === "true") continue;
    const unit = band.getAttribute("data-oc-hover-unit") || "";
    let readouts;
    try {
      const points = JSON.parse(band.getAttribute("data-oc-hover"));
      if (!Array.isArray(points) || points.length === 0) continue;
      if (!points.every((point) => Array.isArray(point) && point.length >= 2)) continue;
      // Prepare every period before binding so malformed data cannot throw on hover
      // or leave a partially usable chart with shifted period indices.
      readouts = points.map(([label, value]) =>
        `${label} · ${Number(value).toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`,
      );
    } catch {
      continue;
    }
    band.dataset.ocHoverBound = "true";
    const tip = document.createElement("div");
    tip.className = "oc-chart-tip";
    tip.hidden = true;
    const cursor = document.createElement("div");
    cursor.className = "oc-chart-cursor";
    cursor.hidden = true;
    band.append(cursor, tip);
    band.addEventListener("mousemove", (event) => {
      const rect = band.getBoundingClientRect();
      if (rect.width === 0) return;
      const share = (event.clientX - rect.left) / rect.width;
      const index = Math.min(readouts.length - 1, Math.max(0, Math.floor(share * readouts.length)));
      // Cursor sits on the hovered period's center; the tip clamps so it
      // never escapes the band on the first or last periods.
      const x = ((index + 0.5) / readouts.length) * rect.width;
      tip.textContent = readouts[index];
      tip.hidden = false;
      cursor.hidden = false;
      cursor.style.left = `${x.toFixed(1)}px`;
      tip.style.left = `${Math.min(rect.width - 60, Math.max(60, x)).toFixed(1)}px`;
    });
    band.addEventListener("mouseleave", () => {
      tip.hidden = true;
      cursor.hidden = true;
    });
  }
}
