import { describe, expect, test } from "bun:test";
import {
  bindExampleDialog,
  exampleDialogAttribute,
  exampleDialogSelector,
} from "../preview/interaction.js";
import {
  getReferenceContent,
  skillsInstallCommand,
  skillsUpdateCommand,
} from "../preview/reference-content.js";
import { resolveTokenHash, syncTokenHash } from "../preview/token-catalog.js";
import { bindTabs } from "../preview/tabs.js";
import { getScrollFadeState } from "../preview/shell.js";

describe("preview behavior", () => {
  test("shows sidebar fades only toward hidden navigation content", () => {
    expect(getScrollFadeState(0, 600, 900)).toEqual({ up: false, down: true });
    expect(getScrollFadeState(150, 600, 900)).toEqual({ up: true, down: true });
    expect(getScrollFadeState(300, 600, 900)).toEqual({ up: true, down: false });
    expect(getScrollFadeState(0, 600, 600)).toEqual({ up: false, down: false });
  });

  test("switches tab panels and wraps arrow-key navigation", () => {
    class Tab extends EventTarget {
      attributes = new Map();
      tabIndex = 0;
      focused = false;
      constructor(controls) {
        super();
        this.attributes.set("aria-controls", controls);
      }
      getAttribute(name) { return this.attributes.get(name); }
      setAttribute(name, value) { this.attributes.set(name, value); }
      focus() { this.focused = true; }
    }

    const first = new Tab("first-panel");
    const second = new Tab("second-panel");
    const panels = [{ id: "first-panel", hidden: false }, { id: "second-panel", hidden: true }];
    const tabset = {
      querySelectorAll(selector) {
        return selector === '[role="tab"]' ? [first, second] : panels;
      },
    };
    const root = { querySelectorAll: () => [tabset] };

    expect(bindTabs(root)).toBe(1);
    second.dispatchEvent(new Event("click"));
    expect(second.getAttribute("aria-selected")).toBe("true");
    expect(panels.map((panel) => panel.hidden)).toEqual([true, false]);

    const left = new Event("keydown", { cancelable: true });
    Object.defineProperty(left, "key", { value: "ArrowLeft" });
    first.dispatchEvent(left);
    expect(second.focused).toBe(true);
    expect(second.getAttribute("aria-selected")).toBe("true");
  });

  test("binds the interaction example to its own dialog", () => {
    const trigger = new EventTarget();
    let exampleOpens = 0;
    let searchOpens = 0;
    const exampleDialog = { showModal: () => exampleOpens++ };
    const searchDialog = { showModal: () => searchOpens++ };
    const root = {
      querySelector(selector) {
        if (selector === "[data-open-dialog]") return trigger;
        if (selector === exampleDialogSelector) return exampleDialog;
        if (selector === "dialog") return searchDialog;
        return null;
      },
    };

    expect(bindExampleDialog(root)).toBe(true);
    trigger.dispatchEvent(new Event("click"));
    expect(exampleOpens).toBe(1);
    expect(searchOpens).toBe(0);

    const markup = getReferenceContent("interface-examples");
    expect(markup).toContain(exampleDialogAttribute);
    expect(markup).toContain('aria-labelledby="interaction-example-dialog-title"');
    expect(markup).toContain('id="interaction-example-dialog-title"');
  });

  test("resolves and schedules token deep links after the catalog renders", () => {
    expect(resolveTokenHash("#token-group-font")).toEqual({
      targetId: "token-group-font",
      groupId: "font",
    });
    expect(resolveTokenHash("#token-oc-font-display")).toEqual({
      targetId: "token-oc-font-display",
      groupId: "font",
    });
    expect(resolveTokenHash("#missing")).toBeNull();

    const frames = [];
    let scrollOptions;
    const state = syncTokenHash("#token-group-font", {
      getElementById: (id) =>
        id === "token-group-font"
          ? { scrollIntoView: (options) => (scrollOptions = options) }
          : null,
      schedule: (callback) => frames.push(callback),
    });

    expect(state).toEqual({ targetId: "token-group-font", groupId: "font" });
    expect(scrollOptions).toBeUndefined();
    frames.shift()();
    expect(scrollOptions).toBeUndefined();
    frames.shift()();
    expect(scrollOptions).toEqual({ block: "start" });
  });

  test("publishes the current project skill installation contract", () => {
    expect(skillsInstallCommand).toContain("npx skills@1.5.16 add");
    expect(skillsInstallCommand).toContain("openclaw-design");
    expect(skillsInstallCommand).toContain("openclaw-design-audit");
    expect(skillsInstallCommand).toContain("--agent codex");
    expect(skillsUpdateCommand).toBe("npx skills@1.5.16 update --project --yes");

    const skills = getReferenceContent("resource-skills");
    const release = getReferenceContent("resource-release");
    expect(skills).toContain(skillsInstallCommand);
    expect(skills).toContain(skillsUpdateCommand);
    expect(skills).toContain("repository default branch");
    expect(release).toContain("Agent guidance follows the repository default branch");
    expect(release).not.toContain("Runtime assets and skills always release together");
  });
});
