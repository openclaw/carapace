import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { spawnLocalPty } from "@openclaw/libterminal/node";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const openclawRoot = resolve(
  process.env.OPENCLAW_SOURCE_DIR ?? join(repoRoot, "..", "openclaw"),
);
const requireFromOpenClaw = createRequire(join(openclawRoot, "package.json"));
const nodePty = requireFromOpenClaw("@lydell/node-pty");
const encoder = new TextEncoder();

const driver = {
  spawn(command, args, options) {
    return nodePty.spawn(command, args, {
      name: options.name,
      cols: options.columns,
      rows: options.rows,
      cwd: options.cwd,
      env: options.env,
    });
  },
};

const fixtureDefinitions = [
  {
    id: "agent-shell",
    kind: "agent",
    label: "Five-region agent shell",
    renderer: "OpenClaw agent TUI · Pi",
    columns: 80,
    rows: 24,
    stopAfter: "local ready | idle",
    summary: "OpenClaw agent shell with transcript, status, footer, and editor.",
  },
  {
    id: "agent-composer",
    kind: "agent",
    label: "Active multiline composer",
    renderer: "OpenClaw agent TUI · Pi",
    columns: 80,
    rows: 24,
    steps: [{ waitFor: "local ready | idle", write: "Compare the picker at 20 columns" }],
    stopAfter: "Compare the picker at 20 columns",
    summary: "Agent composer containing an unfinished prompt and the terminal cursor.",
  },
  {
    id: "agent-approval",
    kind: "agent",
    label: "Workspace skill approval",
    renderer: "OpenClaw agent TUI · Pi",
    columns: 80,
    rows: 24,
    steps: [{ waitFor: "local ready | idle", write: "skill approval proof\r" }],
    stopAfter: "Apply workspace skill proposal",
    summary: "Detailed approval with severity, request context, and conservative actions.",
  },
  {
    id: "agent-picker",
    kind: "agent",
    label: "Model picker overlay",
    renderer: "OpenClaw agent TUI · Pi",
    columns: 80,
    rows: 24,
    env: { OPENCLAW_TUI_PTY_PICKER_FIXTURE: "1" },
    steps: [{ waitFor: "local ready | idle", write: "\u000c" }],
    stopAfter: "fixture-model-2",
    summary: "Searchable model picker overlay with the current row retained.",
  },
  {
    id: "agent-tool",
    kind: "agent",
    label: "Tool execution in transcript",
    renderer: "OpenClaw agent TUI · Pi",
    columns: 80,
    rows: 24,
    env: { OPENCLAW_TUI_PTY_VERBOSE_LEVEL: "on" },
    steps: [{ waitFor: "local ready | idle", write: "tool chronology proof\r" }],
    stopAfter: "PTY_AFTER_TOOL",
    summary: "Assistant text before and after a completed Read File tool row.",
  },
  {
    id: "agent-transcript",
    kind: "agent",
    label: "User and assistant transcript",
    renderer: "OpenClaw agent TUI · Pi",
    columns: 80,
    rows: 24,
    steps: [{ waitFor: "local ready | idle", write: "Hello from Carapace\r" }],
    stopAfter: "PTY_RESPONSE: Hello from Carapace",
    summary: "User prompt followed by a completed assistant response in the transcript.",
  },
  {
    id: "setup-confirm",
    kind: "setup",
    scenario: "confirm",
    label: "Vertical setup confirmation",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 12,
    stopAfter: "Continue?",
    summary: "Security acknowledgement with No initially selected and Back available.",
  },
  {
    id: "setup-field-error",
    kind: "setup",
    scenario: "field-error",
    label: "Validated field input",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 12,
    steps: [{ waitFor: "Gateway port", write: "\r" }],
    stopAfter: "Enter a port from 1 to 65535",
    summary: "Gateway port field retaining an invalid value beside its validation message.",
  },
  {
    id: "setup-field-sensitive",
    kind: "setup",
    scenario: "field-sensitive",
    label: "Sensitive field input",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 12,
    steps: [{ waitFor: "Provider API key", write: "sk-example" }],
    finishAfterSteps: true,
    summary: "Provider API key input with the entered value masked from terminal output.",
  },
  {
    id: "setup-notices",
    kind: "setup",
    scenario: "notices",
    label: "Notes and plain output",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 16,
    stopAfter: "Ready to continue.",
    summary: "Flow intro, titled QuickStart note, unframed disclosure, and outro.",
  },
  {
    id: "setup-flow",
    kind: "setup",
    scenario: "flow",
    label: "Prompt flow with history",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 16,
    stopAfter: "→ next",
    summary: "Intro and note above an active setup prompt with Back and Next navigation.",
  },
  {
    id: "setup-selection",
    kind: "setup",
    scenario: "selection",
    label: "Single selection with hints",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 14,
    stopAfter: "Recommended local setup",
    summary: "Setup mode options with initial selection, recommendation copy, and descriptions.",
  },
  {
    id: "setup-multiselect",
    kind: "setup",
    scenario: "multiselect",
    label: "Searchable multiple selection",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 16,
    steps: [{ waitFor: "Enable hooks?", write: "mem" }],
    finishAfterSteps: true,
    summary: "Searchable hook multiselect with selected values, hints, and filtering.",
  },
  {
    id: "setup-progress",
    kind: "setup",
    scenario: "progress",
    label: "Active setup progress",
    renderer: "OpenClaw setup · Clack",
    columns: 72,
    rows: 10,
    stopAfter: "Verifying gateway reachability",
    summary: "Animated setup progress after its activity label has been updated.",
  },
];

function stripTerminalControls(value) {
  return value
    .replace(/\x1B\][^\x07]*(?:\x07|\x1B\\)/g, "")
    .replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "")
    .replace(/\r/g, "");
}

function combineChunks(chunks) {
  const byteLength = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function capturePty(definition, command) {
  const env = {
    ...process.env,
    OPENCLAW_THEME: "dark",
    FORCE_COLOR: "3",
    COLORTERM: "truecolor",
    TERM: "xterm-256color",
    ...command.env,
    ...definition.env,
  };
  delete env.NO_COLOR;
  const session = await spawnLocalPty({
    command: command.executable,
    args: command.args,
    cwd: openclawRoot,
    env,
    name: "xterm-256color",
    size: { columns: definition.columns, rows: definition.rows },
    driver,
  });

  const chunks = [];
  const decoder = new TextDecoder();
  const steps = definition.steps ?? [];
  let observed = "";
  let stepIndex = 0;
  let completed = false;
  let killTimer;
  const finish = () => {
    if (completed) return;
    completed = true;
    killTimer = setTimeout(() => session.kill(), 300);
  };

  try {
    for await (const chunk of session.output) {
      chunks.push(chunk);
      observed += decoder.decode(chunk, { stream: true });
      const plain = stripTerminalControls(observed);
      const step = steps[stepIndex];
      if (step && plain.includes(step.waitFor)) {
        await session.write(encoder.encode(step.write));
        stepIndex += 1;
        if (stepIndex === steps.length && definition.finishAfterSteps) finish();
      }
      if (stepIndex === steps.length && definition.stopAfter && plain.includes(definition.stopAfter)) {
        finish();
      }
    }
    await session.exit;
  } finally {
    if (killTimer) clearTimeout(killTimer);
    if (!completed) session.kill();
  }

  if (!completed) {
    throw new Error(
      `${definition.id} did not reach its capture point. Output tail: ${stripTerminalControls(observed).slice(-1200)}`,
    );
  }
  return combineChunks(chunks);
}

function renderFixturesModule(fixtures) {
  const rendered = Object.fromEntries(
    fixtures.map(({ definition, bytes }) => [
      definition.id,
      {
        sourceSha,
        columns: definition.columns,
        rows: definition.rows,
        bytes: bytes.byteLength,
        encoding: "base64",
        data: Buffer.from(bytes).toString("base64"),
      },
    ]),
  );
  return `// Generated by scripts/capture-terminal-ui.mjs from OpenClaw ${sourceSha}.\nexport const terminalUiFixtures = Object.freeze(${JSON.stringify(rendered, null, 2)});\n`;
}

function renderManifestModule() {
  const manifest = Object.fromEntries(
    fixtureDefinitions.map(({ id, label, renderer, columns, rows, summary }) => [
      id,
      { sourceSha, label, renderer, columns, rows, summary },
    ]),
  );
  return `// Generated by scripts/capture-terminal-ui.mjs from OpenClaw ${sourceSha}.\nexport const terminalUiFixtureManifest = Object.freeze(${JSON.stringify(manifest, null, 2)});\n`;
}

const sourceSha = (
  await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: openclawRoot })
).stdout.trim();
const tempDir = await mkdtemp(join(tmpdir(), "carapace-terminal-ui-capture-"));

try {
  const fixtureSupportUrl = pathToFileURL(
    join(openclawRoot, "src/tui/tui-pty-harness-fixture-test-support.ts"),
  ).href;
  const createAgentFixture = `import { writeTuiPtyFixtureScript } from ${JSON.stringify(fixtureSupportUrl)}; await writeTuiPtyFixtureScript(process.argv[1]);`;
  await execFileAsync(
    "node",
    ["--import", "tsx", "--input-type=module", "-e", createAgentFixture, tempDir],
    { cwd: openclawRoot },
  );
  const agentScript = join(tempDir, "run-tui-pty-fixture.mts");

  const prompterUrl = pathToFileURL(join(openclawRoot, "src/wizard/clack-prompter.ts")).href;
  const securityNoteUrl = pathToFileURL(
    join(openclawRoot, "src/wizard/setup.security-note.ts"),
  ).href;
  const setupScript = join(tempDir, "run-setup-fixture.mts");
  await writeFile(
    setupScript,
    `import { createClackPrompter } from ${JSON.stringify(prompterUrl)};
import { getSecurityConfirmMessage } from ${JSON.stringify(securityNoteUrl)};

const prompter = createClackPrompter();
const navigation = { canGoBack: true, canGoForward: true };
switch (process.env.CARAPACE_CAPTURE_SCENARIO) {
  case "confirm":
    await prompter.confirm({ message: getSecurityConfirmMessage(), initialValue: false, layout: "vertical", navigation: { canGoBack: true } });
    break;
  case "field-error":
    await prompter.text({ message: "Gateway port", initialValue: "99999", validate: (value) => Number(value) >= 1 && Number(value) <= 65535 ? undefined : "Enter a port from 1 to 65535", navigation });
    break;
  case "field-sensitive":
    await prompter.text({ message: "Provider API key", sensitive: true, validate: (value) => value.trim() ? undefined : "Required", navigation: { canGoBack: true } });
    break;
  case "notices":
    await prompter.intro("OpenClaw setup");
    await prompter.note("Gateway port: 18789\\nBind: Loopback\\nAuthentication: Token (default)", "QuickStart");
    await prompter.plain?.("Scan disclosure: no files are uploaded.");
    await prompter.outro("Ready to continue.");
    setInterval(() => {}, 1000);
    break;
  case "flow":
    await prompter.intro("Configure OpenClaw");
    await prompter.note("Local gateway detected.", "Gateway");
    await prompter.select({ message: "Setup mode", options: [{ value: "quickstart", label: "QuickStart (recommended)", hint: "Recommended local setup. Change details later with openclaw configure." }, { value: "advanced", label: "Advanced" }], initialValue: "quickstart", navigation });
    break;
  case "selection":
    await prompter.select({ message: "Setup mode", options: [{ value: "quickstart", label: "QuickStart (recommended)", hint: "Recommended local setup. Change details later with openclaw configure." }, { value: "advanced", label: "Advanced", hint: "Choose every gateway, model, and channel setting." }, { value: "import", label: "Import from Claude", hint: "~/.claude" }], initialValue: "quickstart", navigation });
    break;
  case "multiselect":
    await prompter.multiselect({ message: "Enable hooks?", options: [{ value: "session-memory", label: "session-memory", hint: "Save session context on /new or /reset" }, { value: "command-logger", label: "command-logger", hint: "Log command events" }, { value: "bootstrap-extra-files", label: "bootstrap-extra-files", hint: "Inject additional workspace files" }], initialValues: ["session-memory"], searchable: true, navigation });
    break;
  case "progress": {
    const progress = prompter.progress("Checking local gateway");
    setTimeout(() => progress.update("Verifying gateway reachability"), 150);
    setInterval(() => {}, 1000);
    break;
  }
  default:
    throw new Error("Unknown capture scenario");
}
`,
    "utf8",
  );

  const fixtures = [];
  for (const definition of fixtureDefinitions) {
    const command = definition.kind === "agent"
      ? {
          executable: "node",
          args: ["--import", "tsx", agentScript],
          env: { OPENCLAW_TUI_PTY_LOG_PATH: join(tempDir, `${definition.id}.jsonl`) },
        }
      : {
          executable: "node",
          args: ["--import", "tsx", setupScript],
          env: { CARAPACE_CAPTURE_SCENARIO: definition.scenario },
        };
    process.stderr.write(`Capturing ${definition.id}…\n`);
    fixtures.push({ definition, bytes: await capturePty(definition, command) });
  }

  await writeFile(
    join(repoRoot, "preview/terminal-fixtures/terminal-ui-fixtures.js"),
    renderFixturesModule(fixtures),
    "utf8",
  );
  await writeFile(
    join(repoRoot, "preview/terminal-fixtures/manifest.js"),
    renderManifestModule(),
    "utf8",
  );
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
