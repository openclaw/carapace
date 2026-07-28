import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
import { getReferenceMaturity, referenceAreas } from "../preview/navigation.js";
import { getReferenceContent } from "../preview/reference-content.js";
import {
  getTerminalUiContent,
  terminalShellMarkup,
  terminalUiContentIds,
  terminalWorkbenchMarkup,
} from "../preview/terminal-ui.js";
import { getTerminalFrameKeyAction } from "../preview/terminal-ui-interactions.js";

describe("Terminal UI reference", () => {
  test("publishes a top-level Lab area with the reviewed information architecture", () => {
    const area = referenceAreas.find(({ id }) => id === "terminal-ui");
    expect(area).toBeDefined();
    expect(area?.label).toBe("Terminal UI");
    expect(area?.path).toBe("terminal-ui/");
    expect(area?.pages).toHaveLength(13);
    expect(area?.pages[0]).toMatchObject({
      id: "terminal-ui",
      label: "Overview",
    });
    expect(area?.pages[0].group).toBeUndefined();
    expect(new Set(area?.pages.slice(1).map(({ group }) => group))).toEqual(
      new Set(["Foundations", "Patterns", "Compositions", "Resources"]),
    );
    for (const page of area?.pages ?? []) expect(getReferenceMaturity(page.id)).toBe("Lab");
  });

  test("renders content for every Terminal UI route", () => {
    expect(terminalUiContentIds).toHaveLength(13);
    for (const id of terminalUiContentIds) {
      const content = getTerminalUiContent(id);
      expect(content).toContain('class="reference-intro"');
      expect(content).toContain("<h1>");
      expect(getReferenceContent(id)).toBe(content);
    }
  });

  test("preserves the current five-region shell in order", () => {
    const shell = terminalShellMarkup({ scenario: "streaming" });
    const regions = [
      "terminal-shell-header",
      "terminal-turn is-user",
      "terminal-shell-status",
      "terminal-shell-footer",
      "terminal-editor",
    ];
    const positions = regions.map((region) => shell.indexOf(region));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
    expect(shell).toContain('terminal-turn is-assistant">The current product');
    expect(shell).toContain("streaming · 00:12");
  });

  test("offers only catalog-backed terminal sizes and states", () => {
    const workbench = terminalWorkbenchMarkup();

    for (const size of ["100x30", "80x20", "64x18", "20x18"]) {
      expect(workbench).toContain(`value="${size}"`);
    }
    for (const state of ["streaming", "idle", "tool", "error", "approval", "task", "session"]) {
      expect(workbench).toContain(`value="${state}"`);
    }
    expect(workbench).toContain('aria-live="polite"');
    expect(workbench).toContain("Expanded tool output");
    expect(terminalShellMarkup({ scenario: "tool" })).toContain("connected | idle");
    expect(terminalShellMarkup({ scenario: "tool" })).not.toContain("running ·");
    expect(terminalShellMarkup({ scenario: "error" })).toContain("connected | error");
    expect(terminalShellMarkup({ scenario: "error" })).not.toContain("error | connected");
    expect(terminalShellMarkup({ scenario: "idle", notice: "approval denied" })).toContain(
      '<div class="terminal-system-row">approval denied</div>',
    );
  });

  test("keeps conservative decisions and second confirmation visible", () => {
    const approval = terminalShellMarkup({ scenario: "approval" });
    const armedApproval = terminalShellMarkup({ scenario: "approval", armed: true });
    const task = terminalShellMarkup({ scenario: "task" });
    const armedTask = terminalShellMarkup({ scenario: "task", armed: true });

    expect(approval).toContain('is-selected" type="button" data-terminal-decision="deny"');
    expect(approval).not.toContain("Press Enter again to allow once");
    expect(armedApproval).toContain("Press Enter again to allow once");
    expect(armedApproval).toContain('data-terminal-decision="allow">› Allow once');
    expect(task).toContain('data-terminal-decision="dismiss">› Dismiss');
    expect(armedTask).toContain("Press Enter again to start this task in a worktree");
  });

  test("routes frame keys through the visible safe action and filter precedence", () => {
    expect(
      getTerminalFrameKeyAction({
        key: "Enter",
        scenario: "approval",
        selectedAction: "deny",
      }),
    ).toBe("deny");
    expect(
      getTerminalFrameKeyAction({
        key: "Enter",
        scenario: "task",
        selectedAction: "dismiss",
      }),
    ).toBe("dismiss");
    expect(
      getTerminalFrameKeyAction({ key: "Escape", scenario: "session", filter: "car" }),
    ).toBe("clear-filter");
    expect(
      getTerminalFrameKeyAction({ key: "Escape", scenario: "session", filter: "" }),
    ).toBe("close-picker");
    expect(getTerminalFrameKeyAction({ key: "Escape", scenario: "task" })).toBe("hide");
    expect(getTerminalFrameKeyAction({ key: "ArrowDown", scenario: "approval" })).toBe(
      "next",
    );
    expect(
      getTerminalFrameKeyAction({ key: "p", ctrlKey: true, scenario: "task" }),
    ).toBe("previous");
    expect(getTerminalFrameKeyAction({ key: "Enter", scenario: "session" })).toBe(
      "open-session",
    );
    expect(terminalShellMarkup({ scenario: "session", filter: "" })).toContain(
      'data-terminal-filter-input aria-label="Filter sessions"',
    );
    expect(terminalShellMarkup({ scenario: "session" })).not.toContain(
      "Release verification",
    );
    expect(terminalShellMarkup({ scenario: "session", filter: "" })).toContain(
      "Release verification",
    );
    expect(terminalShellMarkup({ scenario: "session", filter: "zzz" })).toContain(
      "No matches",
    );
    expect(terminalShellMarkup({ scenario: "approval", selection: "allow" })).toContain(
      'is-selected" type="button" data-terminal-decision="allow"',
    );
    expect(
      terminalShellMarkup({ scenario: "session", filter: "", selection: "1" }),
    ).toContain('<span aria-hidden="true">›</span><strong>Release verification</strong>');
    expect(getTerminalUiContent("terminal-input-selection")).toContain(
      '<small><mark>GPT</mark>-5.5</small>',
    );
    expect(getTerminalUiContent("terminal-overlays-decisions")).not.toContain(
      "data-terminal-decision",
    );
  });

  test("documents audit corrections without inventing exported runtime API", async () => {
    const transcript = getTerminalUiContent("terminal-transcript");
    const decisions = getTerminalUiContent("terminal-overlays-decisions");
    const workStatus = getTerminalUiContent("terminal-work-status");
    const reference = getTerminalUiContent("terminal-openclaw-reference");
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));

    expect(transcript).toContain("Attachment-only user turn");
    expect(transcript).toContain("<p>Attached image</p>");
    expect(transcript).not.toContain("Attached image:");
    expect(transcript).toContain("Pairing QR");
    expect(transcript).toContain("(no output)");
    expect(decisions).toContain("Dismiss when available");
    expect(decisions).toContain("severity remains textual metadata");
    expect(reference).toContain("180 transcript components");
    expect(workStatus).toContain("local stopped");
    expect(Object.keys(packageJson.exports)).not.toContain("./terminal.css");
    expect(Object.keys(packageJson.exports)).not.toContain("./terminal-ui");
  });

  test("ships terminal styles only in the preview and terminal guidance in the skill", async () => {
    const previewCss = await readFile("preview/preview.css", "utf8");
    const terminalCss = await readFile("preview/terminal-ui.css", "utf8");
    const skill = await readFile("openclaw-carapace/SKILL.md", "utf8");
    const guidance = await readFile(
      "openclaw-carapace/references/terminal-ui.md",
      "utf8",
    );

    expect(previewCss).toContain('@import "./terminal-ui.css"');
    expect(terminalCss).toContain(".terminal-frame");
    expect(terminalCss).toContain('.terminal-frame[data-width="20x18"]');
    expect(skill).toContain("references/terminal-ui.md");
    expect(guidance).toContain("Keep the Carapace Terminal UI area in Lab");
    expect(guidance).toContain("default foreground");
  });
});
