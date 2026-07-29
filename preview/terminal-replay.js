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
        fontSize: 20,
        scrollback: 0,
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
    host.dataset.terminalReplayState = "ready";
    return controller;
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
    void mountTerminalReplay(host, fixture, abortController.signal).then((controller) => {
      if (!controller) return;
      if (abortController.signal.aborted) {
        controller.dispose();
        return;
      }
      controllers.add(controller);
    });
  }

  return () => {
    abortController.abort();
    for (const controller of controllers) controller.dispose();
    controllers.clear();
  };
}
