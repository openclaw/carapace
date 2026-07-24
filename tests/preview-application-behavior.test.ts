import { describe, expect, test } from "bun:test";
import {
  applicationCameraPreviewMarkup,
  applicationComposerPrimaryMarkup,
  operationsApplicationMarkup,
  quickChatApplicationMarkup,
  sessionsApplicationMarkup,
  settingsApplicationMarkup,
  workspaceApplicationMarkup,
} from "../preview/application-screens.js";
import {
  applicationModelControlsMarkup,
  bindApplicationModelControls,
} from "../preview/application-model-controls.js";
import {
  bindApplicationComposer,
} from "../preview/component-workbench-config.js";

describe("application surface behavior", () => {
  test("renders Settings as shared anatomy with existing controls and connection states", () => {
    const ready = settingsApplicationMarkup();
    const compactOffline = settingsApplicationMarkup({
      density: "compact",
      state: "offline",
    });

    expect(ready).toContain('class="oc-settings-shell" data-density="compact"');
    expect(ready).not.toContain('class="oc-app-frame"');
    expect(ready).not.toContain('class="oc-app-toolbar"');
    expect(ready).toContain('class="oc-settings-group"');
    expect(ready).toContain('class="oc-settings-navigation-list" aria-label="Settings sections"');
    expect(ready).toContain('class="oc-switch" type="checkbox" role="switch"');
    expect(ready).toContain('class="oc-segmented" role="group" aria-label="Theme"');
    expect(ready).toContain('class="oc-segmented" role="group" aria-label="Interface density"');
    expect(ready).not.toContain("data-workbench-application-navigation");
    expect(ready).not.toMatch(/class="oc-status[^"]*" role="status"/);
    expect(compactOffline).toContain('data-density="compact"');
    expect(compactOffline).toContain("Gateway unavailable");
    expect(compactOffline).toContain("Offline");
    expect(compactOffline).toContain("oc-status-error");
  });
  test("renders Operations with channel, automation, loading, and error states", () => {
    const channels = operationsApplicationMarkup();
    const channelError = operationsApplicationMarkup({ state: "error" });
    const loading = operationsApplicationMarkup({ state: "loading" });
    const automationLoading = operationsApplicationMarkup({
      view: "automation",
      state: "loading",
    });
    const automationError = operationsApplicationMarkup({
      view: "automation",
      state: "error",
    });

    expect(channels).toContain('class="oc-pane oc-master-detail"');
    expect(channels).toContain("Channels");
    expect(channels).toContain('class="oc-summary-strip oc-page-header-summary"');
    expect(channels).not.toContain('class="oc-app-toolbar"');
    expect(channels).toContain('class="oc-app-resource-list"');
    expect(channels).toContain("Recent delivery");
    expect(channels).toContain("Discord");
    expect(channels).not.toContain('aria-label="Operations view"');
    expect(channels).toContain("Add channel");
    expect(channels).toContain("5 configured");
    expect(channels).toContain("4 connected");
    expect(channels).not.toContain("6 configured");
    expect(channelError).toContain("Discord token expired");
    expect(channelError).toContain("3 connected");
    expect(channelError).not.toContain("4 connected");
    expect(channelError).toContain('data-tone="error"');
    expect(channels).toContain('aria-pressed="true"');
    expect(channels).not.toContain("aria-selected");
    expect(loading).toContain("Loading Discord configuration");
    expect(loading).toContain('class="oc-loader" role="status"');
    expect(automationLoading).toContain("Loading automation configuration");
    expect(automationError).toContain("Automations");
    expect(automationError).toContain("Last run failed");
  });
  test("renders Workspace with right, bottom, and hidden inspector modes", () => {
    const right = workspaceApplicationMarkup();
    const bottom = workspaceApplicationMarkup({ dock: "bottom", status: "idle" });
    const bottomWithoutInspector = workspaceApplicationMarkup({
      dock: "bottom",
      inspector: false,
    });
    const hidden = workspaceApplicationMarkup({ dock: "hidden", inspector: false });

    expect(right).toContain('data-dock="right"');
    expect(right).toContain('class="oc-chat-shell"');
    expect(right).not.toContain('class="oc-app-frame"');
    expect(right).toContain('class="oc-workspace-grid"');
    expect(right).toContain('data-inspector="true"');
    expect(right).toContain("data-workbench-application-dock");
    expect(right).toContain("oc-workspace-inspector-action");
    expect(right).toContain("data-workbench-application-inspector-hide");
    expect(right).not.toContain("application-workspace");
    expect(right).toContain('aria-label="Sessions"');
    expect(right).toContain('aria-label="Inspector"');
    expect(right).toContain('class="oc-model-controls"');
    expect(right).toContain("GPT-5.5");
    expect(right).toContain("Reasoning");
    expect(right).toContain("Fast");
    expect(right).toContain("data-workbench-composer-talk");
    expect(right).toContain("data-workbench-composer-dictation");
    expect(bottom).toContain('data-dock="bottom"');
    expect(bottom).toContain('data-inspector="true"');
    expect(bottom).toContain("Agent idle");
    expect(bottomWithoutInspector).toContain('data-dock="bottom"');
    expect(bottomWithoutInspector).toContain('data-inspector="false"');
    expect(bottomWithoutInspector).not.toContain('aria-label="Inspector"');
    expect(hidden).not.toContain('aria-label="Inspector"');
    expect(hidden).toContain('data-dock="hidden"');
    expect(hidden).toContain('data-inspector="false"');
  });
  test("renders application model controls with picker, reasoning, and locked states", () => {
    const controls = applicationModelControlsMarkup({
      model: "anthropic/claude-opus-4-8",
      thinking: "medium",
      fast: false,
      open: true,
    });
    const locked = applicationModelControlsMarkup({ locked: true });

    expect(controls).toContain('class="oc-model-picker" data-workbench-model-picker open');
    expect(controls).toContain('role="group" aria-label="Models"');
    expect(controls).toContain(
      'aria-pressed="true" data-workbench-application-model="anthropic/claude-opus-4-8"',
    );
    expect(controls).toContain('data-workbench-model-search');
    expect(controls).toContain('data-workbench-model-provider="anthropic"');
    expect(controls).toContain("data-workbench-model-reset");
    expect(controls).toContain("data-workbench-model-picker");
    expect(controls).toContain("data-workbench-model-thinking");
    expect(controls).toContain('data-thinking-values="auto,low,medium,high,xhigh"');
    expect(controls).toContain('aria-valuetext="Medium"');
    expect(controls).toContain("data-workbench-model-fast");
    expect(controls).toContain('role="switch"');
    expect(controls).toContain("Claude Opus 4.8");
    expect(controls).toContain("Anthropic");
    expect(controls).toContain("Selected model: Claude Opus 4.8 by Anthropic");
    expect(controls).toContain('aria-label="Reasoning level"');
    expect(controls).toContain("Unavailable for this model");
    expect(controls).not.toContain('type="checkbox"');
    expect(locked).toContain('data-locked="true"');
    expect(locked).toContain(" disabled");
    expect(locked).not.toContain("data-workbench-model-reset");
    expect(locked).not.toContain("<details");
    expect(locked).not.toContain("oc-model-menu-settings");
    expect(locked).toContain("reasoning High");
  });
  test("updates reasoning without replacing the focused range", () => {
    const attributes = new Map();
    const styles = new Map();
    const thinking = Object.assign(new EventTarget(), {
      dataset: { thinkingValues: "auto,low,medium,high,xhigh" },
      value: "2",
      style: { setProperty: (name, value) => styles.set(name, value) },
      setAttribute: (name, value) => attributes.set(name, value),
    });
    const output = { textContent: "" };
    const updates = [];
    const specimen = {
      querySelector(selector) {
        return (
          {
            "[data-workbench-model-thinking]": thinking,
            "[data-workbench-model-thinking-output]": output,
          }[selector] ?? null
        );
      },
      querySelectorAll: () => [],
    };

    bindApplicationModelControls(specimen, { modelProvider: "recent" }, (...args) =>
      updates.push(args),
    );
    thinking.dispatchEvent(new Event("input"));
    thinking.dispatchEvent(new Event("change"));

    expect(output.textContent).toBe("Medium");
    expect(attributes.get("aria-valuetext")).toBe("Medium");
    expect(styles.get("--oc-model-reasoning-fill")).toBe("50%");
    expect(updates).toEqual([
      ["thinking", "medium", { render: false }],
      ["thinking", "medium", { render: false }],
    ]);
  });
  test("renders Sessions as a compact collection with ready, loading, and empty states", () => {
    const ready = sessionsApplicationMarkup();
    const loading = sessionsApplicationMarkup({ state: "loading" });
    const empty = sessionsApplicationMarkup({ state: "empty" });
    const failed = sessionsApplicationMarkup({ state: "error" });

    expect(ready).toContain('class="oc-app-content oc-session-content"');
    expect(ready).toContain('class="oc-session-toolbar"');
    expect(ready).toContain('class="oc-table oc-session-table"');
    expect(ready).toContain("Carapace parity");
    expect(ready).toContain("GPT-5.5");
    expect(ready).toContain('aria-label="Select Carapace parity" checked');
    expect(ready).toContain('aria-label="Actions for Carapace parity"');
    expect(loading).toContain('aria-busy="true"');
    expect(loading).toContain("Loading sessions");
    expect(empty).toContain("No sessions found");
    expect(empty).not.toContain('class="oc-session-table"');
    expect(failed).toContain('role="alert"');
    expect(failed).toContain("Could not load sessions");
    expect(failed).toContain("Retry");
    expect(failed).not.toContain('class="oc-session-table"');
  });
  test("renders Quick Chat with captured context and shared model controls", () => {
    const idle = quickChatApplicationMarkup({ picker: true });
    const active = quickChatApplicationMarkup({
      status: "active",
      model: "google/gemini-2.5-pro",
    });
    const error = quickChatApplicationMarkup({ status: "error" });

    expect(idle).toContain('class="oc-quick-chat" data-state="idle"');
    expect(idle).toContain('<form class="oc-quick-chat-input-row"');
    expect(idle).toContain('aria-label="Select agent"');
    expect(idle).toContain("Safari — OpenClaw docs");
    expect(idle).toContain('class="oc-model-picker" data-workbench-model-picker open');
    expect(idle).not.toContain('class="oc-quick-chat-reply"');
    expect(active).toContain('data-state="active"');
    expect(active).toContain("Gemini 2.5 Pro");
    expect(active).toContain('aria-label="Stop response"');
    expect(idle).toContain('aria-label="Send message"');
    expect(error).toContain('data-state="error"');
    expect(error).toContain("could not reach the gateway");
    expect(error).toContain('class="oc-quick-chat-reply"');
    expect(error).toContain('aria-label="Retry connection"');
    expect(error).not.toContain('aria-label="Send message"');
  });
  test("adapts composer primary actions to draft, dictation, talk, and camera state", () => {
    expect(applicationCameraPreviewMarkup({ camera: true })).toContain(
      'button type="button" aria-label="Switch camera" data-workbench-camera-switch',
    );
    expect(applicationComposerPrimaryMarkup({ busy: true, voice: "listening" })).toContain(
      'aria-label="Stop response"',
    );
    expect(applicationComposerPrimaryMarkup({ busy: true, voice: "listening" })).not.toContain(
      "oc-composer-voice-live",
    );
    const input = Object.assign(new EventTarget(), { value: "" });
    const send = { hidden: false };
    const classes = new Set();
    const attributes = new Map([["aria-pressed", "false"]]);
    const capturedPointers = [];
    const dictation = Object.assign(new EventTarget(), {
      hidden: false,
      setPointerCapture(pointerId) {
        capturedPointers.push(pointerId);
      },
      classList: {
        toggle(name, active) {
          if (active) classes.add(name);
          else classes.delete(name);
        },
      },
      getAttribute: (name) => attributes.get(name) ?? null,
      setAttribute: (name, value) => attributes.set(name, value),
    });
    const dictationStatus = { hidden: true };
    const talk = new EventTarget();
    const updates = [];
    const specimen = {
      querySelector(selector) {
        return (
          {
            "[data-workbench-composer-input]": input,
            "[data-workbench-composer-send]": send,
            "[data-workbench-composer-dictation]": dictation,
            "[data-workbench-composer-dictation-status]": dictationStatus,
          }[selector] ?? null
        );
      },
      querySelectorAll: (selector) =>
        selector === "[data-workbench-composer-talk]" ? [talk] : [],
    };

    bindApplicationComposer(specimen, { voice: "idle", camera: false }, (id, value) =>
      updates.push([id, value]),
    );
    expect(send.disabled).toBe(true);

    input.value = "Ship the compact composer";
    input.dispatchEvent(new Event("input"));
    expect(send.disabled).toBe(false);
    // The mic keeps its slot on the left of send instead of swapping out.
    expect(dictation.hidden).toBe(false);

    input.value = "";
    input.dispatchEvent(new Event("input"));
    dictation.dispatchEvent(Object.assign(new Event("pointerdown"), { pointerId: 7 }));
    expect(attributes.get("aria-pressed")).toBe("true");
    expect(classes.has("is-active")).toBe(true);
    expect(dictationStatus.hidden).toBe(false);
    expect(capturedPointers).toEqual([7]);
    dictation.dispatchEvent(new Event("pointerup"));
    expect(attributes.get("aria-pressed")).toBe("false");
    expect(classes.has("is-active")).toBe(false);
    expect(dictationStatus.hidden).toBe(true);

    const keydown = Object.assign(new Event("keydown"), { key: "Enter", repeat: false });
    const keyup = Object.assign(new Event("keyup"), { key: "Enter" });
    dictation.dispatchEvent(keydown);
    expect(attributes.get("aria-pressed")).toBe("true");
    dictation.dispatchEvent(keyup);
    expect(attributes.get("aria-pressed")).toBe("false");

    talk.dispatchEvent(new Event("click"));
    expect(updates).toEqual([
      ["draft", "Ship the compact composer"],
      ["draft", ""],
      ["voice", "listening"],
    ]);

    const camera = new EventTarget();
    const cameraUpdates = [];
    bindApplicationComposer(
      {
        querySelector: (selector) =>
          selector === "[data-workbench-composer-camera]" ? camera : null,
        querySelectorAll: () => [],
      },
      { voice: "listening", camera: true },
      (id, value) => cameraUpdates.push([id, value]),
    );
    camera.dispatchEvent(new Event("click"));
    expect(cameraUpdates).toEqual([["camera", false]]);
  });
});
