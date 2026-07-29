import { createGhosttyTerminal } from "@openclaw/libterminal/browser";
import { resolvePreviewSiteRoot } from "./router.js";

// Live terminal prompts: real Ghostty terminals accepting real keyboard
// input, driven by a small client-side engine that renders the exact glyph
// vocabulary of the captured OpenClaw Clack prompts (◆ │ └ ● ○ ◻ ◼ █).
// The captures on each page remain the canonical runtime proof; these are
// labeled interactive simulations so readers can feel focus, filtering,
// validation, and confirmation behavior without an OpenClaw install.

const encoder = new TextEncoder();

// Palette primitives, matching the theme-invariant capture surface.
const ESC = "\u001b";
const INK = {
  accent: `${ESC}[38;2;245;101;74m`,
  warning: `${ESC}[38;2;224;175;104m`,
  success: `${ESC}[38;2;125;200;140m`,
  muted: `${ESC}[38;2;138;138;138m`,
  dim: `${ESC}[2m`,
  bold: `${ESC}[1m`,
  reset: `${ESC}[0m`,
};

const CLEAR = `${ESC}[2J${ESC}[3J${ESC}[H${ESC}[?25l`;

function key(bytes) {
  const text = new TextDecoder().decode(bytes);
  if (text === `${ESC}[A`) return { name: "up" };
  if (text === `${ESC}[B`) return { name: "down" };
  if (text === `${ESC}[C`) return { name: "right" };
  if (text === `${ESC}[D`) return { name: "left" };
  if (text === "\r" || text === "\n") return { name: "enter" };
  if (text === "\t") return { name: "tab" };
  if (text === "\u007f" || text === "\b") return { name: "backspace" };
  if (text === "\u0003" || text === ESC) return { name: "cancel" };
  if (text === " ") return { name: "space" };
  if (text.length === 1 && text >= " " && text <= "~") return { name: "char", value: text };
  return { name: "unknown" };
}

function guide(lines, { state = "active", footer = "", error = "" } = {}) {
  const head = state === "error" ? `${INK.warning}▲${INK.reset}` : state === "done" ? `${INK.success}◇${INK.reset}` : `${INK.accent}◆${INK.reset}`;
  const bar = `${INK.muted}│${INK.reset}`;
  const out = [`${INK.muted}│${INK.reset}`];
  lines.forEach((line, index) => {
    out.push(index === 0 ? `${head}  ${line}` : `${bar}  ${line}`);
  });
  if (footer) out.push(`${bar}  ${INK.muted}${footer}${INK.reset}`);
  out.push(`${INK.muted}└${INK.reset}${error ? `  ${INK.warning}${error}${INK.reset}` : ""}`);
  return `${CLEAR}${out.join("\r\n")}`;
}

function radio(selected) {
  return selected ? `${INK.success}●${INK.reset}` : `${INK.muted}○${INK.reset}`;
}

function checkbox(checked) {
  return checked ? `${INK.success}◼${INK.reset}` : `${INK.muted}◻${INK.reset}`;
}

function focusLabel(label, focused) {
  return focused ? `${INK.bold}${label}${INK.reset}` : label;
}

function clip(text, max) {
  return text.length > max ? `${text.slice(0, Math.max(0, max - 1))}…` : text;
}

const widgets = {
  select: () => {
    const options = [
      { label: "QuickStart (recommended)", hint: "Recommended local setup." },
      { label: "Advanced", hint: "Choose every setting." },
      { label: "Import from Claude", hint: "~/.claude" },
    ];
    let index = 0;
    let done = false;
    return {
      frame() {
        if (done) {
          return guide([`Setup mode`, `${INK.dim}${options[index].label}${INK.reset}`], { state: "done", footer: "press R to restart" });
        }
        const rows = options.map((option, i) => {
          const hint = i === index ? ` ${INK.muted}(${clip(option.hint, 34)})${INK.reset}` : "";
          return `${radio(i === index)} ${focusLabel(option.label, i === index)}${hint}`;
        });
        return guide(["Setup mode", ...rows], { footer: "← back  → next  ↑/↓ option  Enter confirm" });
      },
      handle(k) {
        if (done) {
          if (k.name === "char" && k.value.toLowerCase() === "r") done = false;
          return;
        }
        if (k.name === "up") index = (index + options.length - 1) % options.length;
        if (k.name === "down") index = (index + 1) % options.length;
        if (k.name === "enter") done = true;
        if (k.name === "cancel") index = 0;
      },
    };
  },

  multiselect: () => {
    const options = [
      { label: "session-memory", hint: "Save context on /new" },
      { label: "command-logger", hint: "Log command events" },
      { label: "bootstrap-extra-files", hint: "Add workspace files" },
    ];
    let index = 0;
    let filter = "";
    let done = false;
    const picked = new Set(["session-memory"]);
    const visible = () => options.filter((option) => option.label.includes(filter));
    return {
      frame() {
        const shown = visible();
        if (done) {
          const value = [...picked].join(", ") || "none";
          return guide(["Enable hooks?", `${INK.dim}${value}${INK.reset}`], { state: "done", footer: "press R to restart" });
        }
        const searchRow = `${INK.muted}Search:${INK.reset} ${filter}${INK.accent}█${INK.reset} ${INK.muted}(${shown.length} match${shown.length === 1 ? "" : "es"})${INK.reset}`;
        const rows = shown.map((option, i) => {
          const hint = i === index ? ` ${INK.muted}(${clip(option.hint, 34)})${INK.reset}` : "";
          return `${checkbox(picked.has(option.label))} ${focusLabel(option.label, i === index)}${hint}`;
        });
        if (!rows.length) rows.push(`${INK.muted}No hook matches "${filter}"${INK.reset}`);
        return guide(["Enable hooks?", searchRow, ...rows], { footer: "↑/↓ to navigate • Tab: select • Enter: confirm • Type: to search" });
      },
      handle(k) {
        if (done) {
          if (k.name === "char" && k.value.toLowerCase() === "r") { done = false; filter = ""; }
          return;
        }
        const shown = visible();
        if (k.name === "up") index = (index + shown.length - 1) % Math.max(shown.length, 1);
        if (k.name === "down") index = (index + 1) % Math.max(shown.length, 1);
        if ((k.name === "tab" || k.name === "space") && shown[index]) {
          const label = shown[index].label;
          if (picked.has(label)) picked.delete(label);
          else picked.add(label);
        }
        if (k.name === "char") { filter += k.value; index = 0; }
        if (k.name === "backspace") { filter = filter.slice(0, -1); index = 0; }
        if (k.name === "enter") done = true;
        if (k.name === "cancel") { filter = ""; index = 0; }
      },
    };
  },

  confirm: () => {
    let no = true;
    let done = false;
    return {
      frame() {
        if (done) {
          return guide(["Continue with lock-down?", `${INK.dim}${no ? "No" : "Yes"}${INK.reset}`], { state: "done", footer: "press R to restart" });
        }
        return guide(
          [
            "Personal-by-default; shared or multi-user use requires lock-down. Continue?",
            `${radio(!no)} ${focusLabel("Yes", !no)}`,
            `${radio(no)} ${focusLabel("No", no)}`,
          ],
          { footer: "← back  ↑/↓ option  Enter confirm" },
        );
      },
      handle(k) {
        if (done) {
          if (k.name === "char" && k.value.toLowerCase() === "r") done = false;
          return;
        }
        if (k.name === "up" || k.name === "down") no = !no;
        if (k.name === "char" && k.value.toLowerCase() === "y") no = false;
        if (k.name === "char" && k.value.toLowerCase() === "n") no = true;
        if (k.name === "enter") done = true;
      },
    };
  },

  composer: () => {
    const transcript = [];
    let value = "";
    const replies = [
      "Noted. I will keep the transcript and composer in one shell.",
      "Streaming reply complete; the status row returns to idle.",
      "Try a longer prompt -- the composer owns wrapping and the cursor.",
    ];
    return {
      frame() {
        const rows = [];
        for (const turn of transcript.slice(-2)) {
          rows.push(`${INK.muted}›${INK.reset} ${INK.bold}${clip(turn.user, 70)}${INK.reset}`);
          rows.push(`${INK.muted}${clip(turn.reply, 74)}${INK.reset}`);
        }
        if (!rows.length) rows.push(`${INK.muted}Transcript is empty. Type below and press Enter to send.${INK.reset}`);
        rows.push("");
        rows.push(`${INK.accent}>${INK.reset} ${clip(value, 70)}${INK.accent}█${INK.reset}`);
        return guide(["Agent composer", ...rows], { footer: "Type · Enter send · R restart" });
      },
      handle(k) {
        if (k.name === "char" && k.value.toLowerCase() === "r" && value === "") {
          transcript.length = 0;
          return;
        }
        if (k.name === "char") value += k.value;
        if (k.name === "space") value += " ";
        if (k.name === "backspace") value = value.slice(0, -1);
        if (k.name === "enter" && value.trim()) {
          transcript.push({ user: value.trim(), reply: replies[transcript.length % replies.length] });
          value = "";
        }
      },
    };
  },

  flow: () => {
    const modes = ["QuickStart (recommended)", "Advanced"];
    let step = 0;
    let mode = 0;
    let hooks = true;
    let done = false;
    return {
      frame() {
        const history = step > 0 || done
          ? [`${INK.success}◇${INK.reset}  ${INK.muted}Setup mode${INK.reset}`, `${INK.muted}│  ${INK.dim}${modes[mode]}${INK.reset}`]
          : [];
        if (done) {
          return `${CLEAR}${[...history, ""].join("\r\n")}${guide(["Enable hooks now?", `${INK.dim}${hooks ? "Yes" : "No"}${INK.reset}`], { state: "done", footer: "press R to restart" }).slice(CLEAR.length)}`;
        }
        if (step === 0) {
          const rows = modes.map((label, i) => `${radio(i === mode)} ${focusLabel(label, i === mode)}`);
          return guide(["Setup mode", ...rows], { footer: "→ next  ↑/↓ option  Enter confirm" });
        }
        return `${CLEAR}${[...history, ""].join("\r\n")}${guide(["Enable hooks now?", `${radio(hooks)} ${focusLabel("Yes", hooks)}`, `${radio(!hooks)} ${focusLabel("No", !hooks)}`], { footer: "← back  ↑/↓ option  Enter confirm" }).slice(CLEAR.length)}`;
      },
      handle(k) {
        if (done) {
          if (k.name === "char" && k.value.toLowerCase() === "r") { done = false; step = 0; }
          return;
        }
        if (step === 0) {
          if (k.name === "up" || k.name === "down") mode = (mode + 1) % modes.length;
          if (k.name === "enter" || k.name === "right") step = 1;
          return;
        }
        if (k.name === "left") step = 0;
        if (k.name === "up" || k.name === "down") hooks = !hooks;
        if (k.name === "enter") done = true;
      },
    };
  },

  progress: () => {
    const spinner = ["◐", "◓", "◑", "◒"];
    let phase = 0;
    let state = "running";
    return {
      interval: 160,
      frame() {
        if (state === "done") {
          return guide(["Checking local gateway", `${INK.dim}Gateway reachable.${INK.reset}`], { state: "done", footer: "press R to restart" });
        }
        if (state === "failed") {
          return guide(["Checking local gateway", `${INK.dim}Gateway did not answer.${INK.reset}`], { state: "error", footer: "press R to restart", error: "Connection refused on 127.0.0.1:18789" });
        }
        return guide([
          "Checking local gateway",
          `${INK.accent}${spinner[phase % spinner.length]}${INK.reset} Verifying gateway reachability`,
        ], { footer: "C complete  F fail  R restart" });
      },
      tick() {
        if (state !== "running") return false;
        phase += 1;
        return true;
      },
      handle(k) {
        if (k.name === "char") {
          const value = k.value.toLowerCase();
          if (value === "c") state = "done";
          if (value === "f") state = "failed";
          if (value === "r") { state = "running"; phase = 0; }
        }
      },
    };
  },

  text: () => {
    let value = "18789";
    let error = "";
    let done = false;
    const validate = (v) => (Number(v) >= 1 && Number(v) <= 65535 ? "" : "Enter a port from 1 to 65535");
    return {
      frame() {
        if (done) {
          return guide(["Gateway port", `${INK.dim}${value}${INK.reset}`], { state: "done", footer: "press R to restart" });
        }
        return guide(["Gateway port", `${value}${INK.accent}█${INK.reset}`], {
          state: error ? "error" : "active",
          footer: "← back  → next  Enter submit",
          error,
        });
      },
      handle(k) {
        if (done) {
          if (k.name === "char" && k.value.toLowerCase() === "r") { done = false; value = ""; error = ""; }
          return;
        }
        if (k.name === "char") { value += k.value; error = ""; }
        if (k.name === "backspace") { value = value.slice(0, -1); error = ""; }
        if (k.name === "enter") {
          error = validate(value);
          if (!error) done = true;
        }
      },
    };
  },
};

async function mountTerminalLive(host, widgetId, signal) {
  const factory = widgets[widgetId];
  if (!factory) return undefined;
  const widget = factory();
  host.dataset.terminalLiveState = "loading";
  try {
    const siteRoot = resolvePreviewSiteRoot(host.ownerDocument.location.href);
    const columns = Number(host.dataset.terminalLiveColumns || 80);
    const rows = Number(host.dataset.terminalLiveRows || 10);
    const controller = await createGhosttyTerminal({
      parent: host,
      runtimeOptions: { wasmUrl: new URL("vendor/ghostty-vt.wasm", siteRoot).href },
      terminalOptions: {
        cursorBlink: false,
        cursorStyle: "block",
        fontFamily: terminalFontFamily(host),
        fontSize: 20,
        scrollback: 0,
        theme: captureTheme(host),
      },
      size: { columns, rows },
      autoFit: false,
      readOnly: false,
      signal,
      onData: (bytes) => {
        widget.handle(key(bytes));
        controller.write(encoder.encode(widget.frame()));
      },
    });
    controller.write(encoder.encode(widget.frame()));
    host.dataset.terminalLiveState = "ready";
    // Keystrokes land in the renderer's hidden textarea; clicking anywhere on
    // the surface must focus it or the prompt looks dead.
    const focusInput = () => (host.querySelector("textarea") ?? host).focus();
    host.addEventListener("mousedown", (event) => {
      event.preventDefault();
      focusInput();
    });
    let timer;
    if (widget.interval && widget.tick) {
      timer = setInterval(() => {
        if (signal.aborted) return;
        if (widget.tick()) controller.write(encoder.encode(widget.frame()));
      }, widget.interval);
      signal.addEventListener("abort", () => clearInterval(timer), { once: true });
    }
    return controller;
  } catch (error) {
    if (signal.aborted) return undefined;
    host.dataset.terminalLiveState = "error";
    console.error("Failed to mount live terminal", error);
    return undefined;
  }
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

function captureTheme(host) {
  const resolve = (property, fallback) => {
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
  };
  const background = resolve("--terminal-capture-bg", "#0d0d0f");
  return {
    background,
    foreground: resolve("--terminal-capture-fg", "#ededed"),
    cursor: resolve("--terminal-capture-cursor", "#f5654a"),
    cursorAccent: background,
  };
}

export function bindTerminalLive(root = globalThis.document) {
  const abortController = new AbortController();
  const controllers = new Set();
  for (const host of root.querySelectorAll("[data-terminal-live]")) {
    void mountTerminalLive(host, host.dataset.terminalLive, abortController.signal).then((controller) => {
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
