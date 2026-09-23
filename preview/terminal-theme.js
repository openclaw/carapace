export function terminalFontFamily(host) {
  const document = host.ownerDocument;
  return (
    document.defaultView
      ?.getComputedStyle(document.documentElement)
      .getPropertyValue("--oc-font-mono")
      .trim() || "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  );
}

// Resolve CSS color expressions inside the capture host so the canvas and
// viewport chrome use the same palette, including inherited overrides.
function resolveCaptureColor(host, property, fallback) {
  const document = host.ownerDocument;
  const view = document.defaultView;
  if (!view) return fallback;
  const probe = document.createElement("span");
  probe.style.color = `var(${property}, ${fallback})`;
  probe.style.display = "none";
  host.append(probe);
  const value = view.getComputedStyle(probe).color;
  probe.remove();
  return value || fallback;
}

export function terminalTheme(host) {
  const background = resolveCaptureColor(host, "--terminal-capture-bg", "#0d0d0f");
  return {
    background,
    foreground: resolveCaptureColor(host, "--terminal-capture-fg", "#ededed"),
    cursor: resolveCaptureColor(host, "--terminal-capture-cursor", "#f5654a"),
    cursorAccent: background,
  };
}
