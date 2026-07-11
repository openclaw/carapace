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

describe("preview behavior", () => {
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
