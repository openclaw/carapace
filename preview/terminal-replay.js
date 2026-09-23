import { createGhosttyTerminal } from "@openclaw/libterminal/browser";
import { resolvePreviewSiteRoot } from "./router.js";
import { terminalUiFixtures } from "./terminal-fixtures/terminal-ui-fixtures.js";
import { terminalFontFamily, terminalTheme } from "./terminal-theme.js";

function decodeBase64(value) {
  const binary = globalThis.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
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
        theme: terminalTheme(host),
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

// Re-streams the capture in small timed slices so the reader can watch the
// runtime paint the frame instead of receiving it as a still image.
async function animateReplay(controller, fixture, signal) {
  const bytes = decodeBase64(fixture.data);
  controller.write(new TextEncoder().encode("\u001b[2J\u001b[3J\u001b[H"));
  const slice = Math.max(256, Math.ceil(bytes.byteLength / 48));
  for (let offset = 0; offset < bytes.byteLength; offset += slice) {
    if (signal.aborted) return;
    controller.write(bytes.subarray(offset, offset + slice));
    await new Promise((resolve) => setTimeout(resolve, 28));
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
      const button = host.closest(".terminal-runtime-capture")?.querySelector("[data-terminal-replay-again]");
      if (button) {
        let playing = false;
        button.hidden = false;
        button.addEventListener("click", () => {
          if (playing) return;
          playing = true;
          void animateReplay(controller, fixture, abortController.signal).finally(() => {
            playing = false;
          });
        });
      }
    });
  }

  return () => {
    abortController.abort();
    for (const controller of controllers) controller.dispose();
    controllers.clear();
  };
}
