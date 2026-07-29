import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";
import { getReferenceMaturity, referenceAreas } from "../preview/navigation.js";
import { getReferenceContent } from "../preview/reference-content.js";
import { terminalUiFixtureManifest } from "../preview/terminal-fixtures/manifest.js";
import { terminalUiFixtures } from "../preview/terminal-fixtures/terminal-ui-fixtures.js";
import { getTerminalUiContent, terminalUiContentIds } from "../preview/terminal-ui.js";

describe("Terminal UI reference", () => {
  test("publishes a flat top-level area with the reviewed information architecture", () => {
    const area = referenceAreas.find(({ id }) => id === "terminal-ui");
    expect(area).toBeDefined();
    expect(area?.label).toBe("Terminal UI");
    expect(area?.path).toBe("terminal-ui/");
    expect(area?.pages).toHaveLength(11);
    expect(area?.pages[0]).toMatchObject({
      id: "terminal-ui",
      label: "Overview",
      hiddenFromSidebar: true,
    });
    expect(area?.pages.every(({ group }) => group === undefined)).toBe(true);
    expect(area?.pages.slice(1).map(({ label }) => label)).toEqual([
      "Agent shell",
      "Composer",
      "Confirmation",
      "Field input",
      "Notices and output",
      "Prompt flow",
      "Selection",
      "Status and progress",
      "Tool execution",
      "Transcript",
    ]);
    for (const page of area?.pages ?? []) expect(getReferenceMaturity(page.id)).toBe("Lab");
  });

  test("renders content and libterminal replay hooks for every route", () => {
    expect(terminalUiContentIds).toHaveLength(11);
    for (const id of terminalUiContentIds) {
      const content = getTerminalUiContent(id);
      expect(content).toContain('class="reference-intro"');
      expect(content).toContain("<h1>");
      expect(content).toContain("data-terminal-replay=");
      expect(content).not.toContain("data-terminal-workbench");
      expect(getReferenceContent(id)).toBe(content);
    }
  });

  test("keeps every visual specimen backed by a generated PTY fixture", () => {
    const fixtureIds = Object.keys(terminalUiFixtureManifest);
    expect(fixtureIds).toHaveLength(14);
    expect(Object.keys(terminalUiFixtures)).toEqual(fixtureIds);

    for (const id of fixtureIds) {
      const manifest = terminalUiFixtureManifest[id];
      const fixture = terminalUiFixtures[id];
      expect(fixture.sourceSha).toBe(manifest.sourceSha);
      expect(fixture.columns).toBe(manifest.columns);
      expect(fixture.rows).toBe(manifest.rows);
      expect(fixture.encoding).toBe("base64");
      expect(fixture.bytes).toBeGreaterThan(100);
      expect(fixture.data.length).toBeGreaterThan(100);
    }
  });

  test("documents rich onboarding primitives without a composite onboarding screen", () => {
    const confirmation = getTerminalUiContent("terminal-confirmation");
    const fields = getTerminalUiContent("terminal-field-input");
    const notices = getTerminalUiContent("terminal-notices-output");
    const flow = getTerminalUiContent("terminal-prompt-flow");
    const selection = getTerminalUiContent("terminal-selection");
    const status = getTerminalUiContent("terminal-status-progress");

    expect(getTerminalUiContent("terminal-onboarding")).toBeUndefined();
    expect(confirmation).toContain('data-terminal-replay="setup-confirm"');
    expect(confirmation).toContain('data-terminal-replay="agent-approval"');
    expect(fields).toContain('data-terminal-replay="setup-field-error"');
    expect(fields).toContain('data-terminal-replay="setup-field-sensitive"');
    expect(notices).toContain('data-terminal-replay="setup-notices"');
    expect(flow).toContain('data-terminal-replay="setup-flow"');
    expect(selection).toContain('data-terminal-replay="setup-selection"');
    expect(selection).toContain('data-terminal-replay="setup-multiselect"');
    expect(selection).toContain('data-terminal-replay="agent-picker"');
    expect(selection).toContain("A default is the initial selection");
    expect(selection).toContain("Subtext");
    expect(status).toContain('data-terminal-replay="setup-progress"');
  });

  test("uses libterminal and Ghostty as the sole terminal rendering path", async () => {
    const replay = await readFile("preview/terminal-replay.js", "utf8");
    const terminalUi = await readFile("preview/terminal-ui.js", "utf8");
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));

    expect(replay).toContain('from "@openclaw/libterminal/browser"');
    expect(replay).toContain("createGhosttyTerminal");
    expect(replay).toContain("terminalUiFixtures");
    expect(replay).toContain("fitTerminalToViewport");
    expect(replay).toContain("ResizeObserver");
    expect(terminalUi).not.toContain("terminalShellMarkup");
    expect(terminalUi).not.toContain("setupFrameMarkup");
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
    expect(terminalCss).toContain(".terminal-replay-host");
    expect(terminalCss).toContain("min-width: 100%");
    expect(terminalCss).not.toContain(".terminal-frame");
    expect(skill).toContain("references/terminal-ui.md");
    expect(guidance).toContain("Keep the Carapace Terminal UI area in Lab");
    expect(guidance).toContain("libterminal");
    expect(guidance).toContain("Ghostty");
  });
});
