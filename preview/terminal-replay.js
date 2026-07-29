import { createGhosttyTerminal } from "@openclaw/libterminal/browser";
import { resolvePreviewSiteRoot } from "./router.js";
import { terminalUiFixtures } from "./terminal-fixtures/terminal-ui-fixtures.js";

function decodeBase64(value) {
  const binary = globalThis.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function terminalFontFamily(host) {
  const document = host.ownerDocument;
  return (
    document.defaultView
      ?.getComputedStyle(document.documentElement)
      .getPropertyValue("--oc-font-mono")
      .trim() || "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  );
}

function fitTerminalToViewport(host, controller) {
  const viewport = host.parentElement;
  const view = host.ownerDocument.defaultView;
  const canvas = host.querySelector("canvas");
  if (!viewport || !view || !canvas) return;

  const viewportStyle = view.getComputedStyle(viewport);
  const horizontalPadding =
    (Number.parseFloat(viewportStyle.paddingLeft) || 0) +
    (Number.parseFloat(viewportStyle.paddingRight) || 0);
  const availableWidth = viewport.clientWidth - horizontalPadding;
  const renderedWidth = canvas.getBoundingClientRect().width;
  const currentFontSize = controller.terminal.options.fontSize;
  if (availableWidth <= 0 || renderedWidth <= 0) return;

  const fittedFontSize = Math.floor(
    (currentFontSize * availableWidth) / renderedWidth,
  );
  const nextFontSize = Math.max(11, Math.min(20, fittedFontSize));
  if (nextFontSize !== currentFontSize) {
    controller.terminal.options.fontSize = nextFontSize;
  }
}

async function mountTerminalReplay(host, fixture, signal) {
  host.dataset.terminalReplayState = "loading";
  try {
    const siteRoot = resolvePreviewSiteRoot(host.ownerDocument.location.href);
    const controller = await createGhosttyTerminal({
      parent: host,
      runtimeOptions: { wasmUrl: new URL("vendor/ghostty-vt.wasm", siteRoot).href },
      terminalOptions: {
        cursorBlink: false,
        cursorStyle: "block",
        fontFamily: terminalFontFamily(host),
        fontSize: 11,
        theme: {
          background: "#0e1015",
          foreground: "#e8e3d5",
          cursor: "#ff5a2d",
          cursorAccent: "#0e1015",
        },
      },
      size: { columns: fixture.columns, rows: fixture.rows },
      autoFit: false,
      readOnly: true,
      signal,
    });
    controller.write(decodeBase64(fixture.data));
    fitTerminalToViewport(host, controller);
    const ResizeObserver = host.ownerDocument.defaultView?.ResizeObserver;
    const resizeObserver = ResizeObserver
      ? new ResizeObserver(() => fitTerminalToViewport(host, controller))
      : undefined;
    if (resizeObserver && host.parentElement) {
      resizeObserver.observe(host.parentElement);
    }
    host.dataset.terminalReplayState = "ready";
    return { controller, resizeObserver };
  } catch (error) {
    if (signal.aborted) return undefined;
    host.dataset.terminalReplayState = "error";
    const fallback = host.parentElement?.querySelector("[data-terminal-replay-error]");
    if (fallback) fallback.hidden = false;
    console.error("Failed to render terminal capture", error);
    return undefined;
  }
}

export function bindTerminalReplays(root = globalThis.document) {
  const abortController = new AbortController();
  const controllers = new Set();
  const hosts = [...root.querySelectorAll("[data-terminal-replay]")];

  for (const host of hosts) {
    const fixture = terminalUiFixtures[host.dataset.terminalReplay];
    if (!fixture) {
      host.dataset.terminalReplayState = "error";
      continue;
    }
    void mountTerminalReplay(host, fixture, abortController.signal).then((mounted) => {
      if (!mounted) return;
      if (abortController.signal.aborted) {
        mounted.resizeObserver?.disconnect();
        mounted.controller.dispose();
        return;
      }
      controllers.add(mounted);
    });
  }

  return () => {
    abortController.abort();
    for (const mounted of controllers) {
      mounted.resizeObserver?.disconnect();
      mounted.controller.dispose();
    }
    controllers.clear();
  };
}
