const openClawSha = "e1e1c1879bf4924e070463b499f3f3b264092f4a";
const piSha = "20be4b18d4c57487f8993d2762bace129f0cf7c6";
const clackSha = "dc5bce8aae84a57b5863124adfaa839c1db1fa23";

const openClawBase = `https://github.com/openclaw/openclaw/blob/${openClawSha}/`;
const piBase = `https://github.com/earendil-works/pi/blob/${piSha}/packages/tui/`;
const clackBase = `https://github.com/bombshell-dev/clack/blob/${clackSha}/`;

function pageIntro(title, lede) {
  return `<header class="reference-intro"><p class="eyebrow">Terminal UI</p><h1>${title}</h1><p>${lede}</p></header>`;
}

function sectionIntro(id, eyebrow, title, copy = "") {
  return `<div class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h2 id="${id}">${title}</h2></div>${copy ? `<p class="section-copy">${copy}</p>` : ""}</div>`;
}

function guidanceList(items) {
  return `<ul class="guidance-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function sourceLink(path, label, lines = "") {
  return `<a href="${openClawBase}${path}${lines}" target="_blank" rel="noreferrer">${label}</a>`;
}

function piLink(path, label, lines = "") {
  return `<a href="${piBase}${path}${lines}" target="_blank" rel="noreferrer">${label}</a>`;
}

function clackLink(path, label, lines = "") {
  return `<a href="${clackBase}${path}${lines}" target="_blank" rel="noreferrer">${label}</a>`;
}

function rendererLabel(label) {
  return `<p class="terminal-renderer-label">${label}</p>`;
}

function referenceTable(headers, rows) {
  return `<div class="table-wrap reference-table terminal-reference-table"><table><thead><tr>${headers.map((header) => `<th scope="col">${header}</th>`).join("")}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell, index) => `${index === 0 ? '<th scope="row">' : "<td>"}${cell}${index === 0 ? "</th>" : "</td>"}`)
          .join("")}</tr>`,
    )
    .join("")}</tbody></table></div>`;
}

function transcriptRowsMarkup() {
  return `<div class="terminal-pattern-stack" aria-label="OpenClaw transcript states">
    <article class="terminal-pattern-row is-user"><span class="terminal-pattern-label">User</span><p>Audit the current TUI before extracting it.</p></article>
    <article class="terminal-pattern-row is-user"><span class="terminal-pattern-label">Attachment only</span><p>Attached image</p></article>
    <article class="terminal-pattern-row is-assistant"><span class="terminal-pattern-label">Assistant · streaming</span><p>There is one conversation shell, with transient overlays and inline states<span class="terminal-cursor" aria-hidden="true">▋</span></p></article>
    <article class="terminal-pattern-row is-system"><span class="terminal-pattern-label">System</span><p>tools expanded</p></article>
    <article class="terminal-pattern-row is-pending"><span class="terminal-pattern-label">Pending</span><p>Response is taking longer than expected…</p></article>
    <article class="terminal-pattern-row is-btw"><span class="terminal-pattern-label">BTW: what changed?</span><p>The picker stays open while this inline result remains in scrollback.</p><small>Press Enter or Esc to dismiss</small></article>
  </div>`;
}

function toolCardMarkup(state = "running", expanded = false) {
  const content = {
    running: ["🔧 Read (running)", "src/tui/theme/theme.ts", "Reading semantic roles…"],
    success: ["✓ Read", "src/tui/theme/theme.ts", "Found 24 terminal roles"],
    error: ["× Shell", "bun run check", "error: command exited with status 1"],
  }[state];
  return `<article class="terminal-tool-card" data-state="${state}">
    <header><strong>${content[0]}</strong><span>${content[1]}</span></header>
    <pre>${content[2]}${expanded ? "\nassistantText: terminal default\nselectedPrefix: accent + bold\ntoolErrorBg: semantic error surface" : ""}</pre>
    ${expanded ? "" : '<small>… output bounded in the collapsed state</small>'}
  </article>`;
}

function emphasizeMatch(value, query) {
  if (!query) return value;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value.replace(new RegExp(escapedQuery, "gi"), "<mark>$&</mark>");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function pickerMarkup(
  kind = "model",
  query = kind === "session" ? "car" : "gpt",
  selectedIndex = 0,
  interactive = false,
) {
  const rows =
    kind === "session"
      ? [
          ["Carapace terminal audit", "2m · Catalog current TUI states"],
          ["Release verification", "1h · Validate published artifacts"],
          ["Plugin migration", "3h · Move provider ownership"],
        ]
      : [
          ["openai/gpt-5.5", "GPT-5.5"],
          ["anthropic/claude-sonnet-4-6", "Claude Sonnet 4.6"],
          ["google/gemini-3.1-pro", "Gemini 3.1 Pro"],
        ];
  const normalizedQuery = query.toLowerCase();
  const visibleRows = normalizedQuery
    ? rows.filter(([label, description]) =>
        `${label} ${description}`.toLowerCase().includes(normalizedQuery),
      )
    : rows;
  const filterControl =
    interactive && kind === "session"
      ? `<input type="text" value="${escapeHtml(query)}" data-terminal-filter-input aria-label="Filter sessions" />`
      : `<span>${escapeHtml(query)}</span><i aria-hidden="true">▋</i>`;
  return `<div class="terminal-picker" data-kind="${kind}">
    <label>${kind === "session" ? "Filter" : "Search"}: ${filterControl}</label>
    <div class="terminal-picker-divider" aria-hidden="true"></div>
    ${
      visibleRows.length
        ? visibleRows
            .map(
              ([label, description], index) =>
                `<div class="terminal-picker-row${index === selectedIndex ? " is-selected" : ""}"><span aria-hidden="true">${index === selectedIndex ? "›" : " "}</span><strong>${emphasizeMatch(label, query)}</strong><small>${emphasizeMatch(description, query)}</small></div>`,
            )
            .join("")
        : '<div class="terminal-picker-empty">No matches</div>'
    }
  </div>`;
}

function decisionActionMarkup(action, label, selected, interactive) {
  const className = `terminal-decision-action${selected ? " is-selected" : ""}`;
  const content = `${selected ? "›" : " "} ${label}`;
  return interactive
    ? `<button class="${className}" type="button" data-terminal-decision="${action}">${content}</button>`
    : `<span class="${className}">${content}</span>`;
}

function approvalMarkup(kind = "approval", armed = false, selection, interactive = false) {
  if (kind === "task") {
    const selected = selection || (armed ? "start" : "dismiss");
    return `<div class="terminal-decision" data-kind="task">
      <strong>Suggested follow-up: Add compact terminal proof</strong>
      <p><span>Project:</span> openclaw/carapace</p>
      <p><span>Why:</span> The 20×18 picker state needs a durable specimen.</p>
      <p><span>Instructions:</span> Add a focused width test and browser proof.</p>
      ${armed ? '<p class="terminal-confirmation">Press Enter again to start this task in a worktree.</p>' : ""}
      <div class="terminal-decision-actions">${decisionActionMarkup("start", "Start in worktree", selected === "start", interactive)}${decisionActionMarkup("dismiss", "Dismiss", selected === "dismiss", interactive)}</div>
    </div>`;
  }
  const selected = selection || (armed ? "allow" : "deny");
  return `<div class="terminal-decision" data-kind="approval">
    <strong>Plugin approval: Publish design reference</strong>
    <p><span>Severity:</span> Critical</p>
    <p><span>Tool:</span> exec</p>
    <p><span>Request:</span> Push the terminal-ui branch to the shared remote.</p>
    ${armed ? '<p class="terminal-confirmation">Press Enter again to allow once.</p>' : ""}
    <div class="terminal-decision-actions">${decisionActionMarkup("deny", "Deny", selected === "deny", interactive)}${decisionActionMarkup("allow", "Allow once", selected === "allow", interactive)}</div>
  </div>`;
}

export function terminalShellMarkup({
  width = "100x30",
  theme = "dark",
  scenario = "streaming",
  expanded = false,
  armed = false,
  filter,
  selection,
  notice,
} = {}) {
  const [columns, rows] = width.split("x");
  const pickerSelection = Number.isInteger(Number(selection)) ? Number(selection) : 0;
  const overlay = ["approval", "task", "session"].includes(scenario) ? scenario : "none";
  const activity = {
    idle: "connected | idle",
    streaming: "⠋ streaming · 00:12 | connected",
    tool: "connected | idle",
    error: "connected | error",
    approval: "waiting for approval | connected",
    task: "waiting for decision | connected",
    session: "connected | idle",
  }[scenario];
  const toolState = scenario === "error" ? "error" : scenario === "tool" ? "success" : "running";

  return `<div class="terminal-frame" data-terminal-frame data-theme="${theme}" data-width="${width}" style="--terminal-columns:${columns};--terminal-rows:${rows}" tabindex="0" aria-label="OpenClaw terminal reference at ${columns} columns by ${rows} rows">
    <header class="terminal-frame-bar"><span class="terminal-frame-dots" aria-hidden="true"><i></i><i></i><i></i></span><strong>OpenClaw reference</strong><span>${columns} × ${rows}</span></header>
    <div class="terminal-screen">
      <div class="terminal-buffer">
        <div class="terminal-shell-header">openclaw tui - local - agent main - session carapace</div>
        <div class="terminal-turn is-user">Audit every current screen before extracting the design system.</div>
        <div class="terminal-turn is-assistant">The current product is one shell with transcript rows, work cards, and focus-capturing overlays.${scenario === "streaming" ? '<span class="terminal-cursor" aria-hidden="true">▋</span>' : ""}</div>
        ${["tool", "error", "streaming"].includes(scenario) ? toolCardMarkup(toolState, expanded) : ""}
        ${scenario === "idle" ? `<div class="terminal-system-row">${notice || "session history loaded"}</div>` : ""}
        <div class="terminal-shell-status" data-state="${scenario}">${activity}</div>
        <div class="terminal-shell-footer">main | carapace | openai/gpt-5.5 | tools ${expanded ? "expanded" : "collapsed"} | 18k tokens</div>
        <div class="terminal-editor"><span aria-hidden="true">›</span><span class="terminal-editor-copy">${overlay === "none" ? "Message OpenClaw" : ""}</span><i aria-hidden="true">▋</i></div>
      </div>
      ${overlay === "approval" ? `<div class="terminal-overlay">${approvalMarkup("approval", armed, selection, true)}</div>` : ""}
      ${overlay === "task" ? `<div class="terminal-overlay">${approvalMarkup("task", armed, selection, true)}</div>` : ""}
      ${overlay === "session" ? `<div class="terminal-overlay">${pickerMarkup("session", filter, pickerSelection, true)}</div>` : ""}
    </div>
  </div>`;
}

export function terminalWorkbenchMarkup() {
  return `<div class="terminal-workbench" data-terminal-workbench>
    <form class="terminal-workbench-controls" aria-label="Terminal specimen controls">
      <label>Size<select data-terminal-control="width">
        <option value="100x30">100 × 30</option><option value="80x20">80 × 20</option><option value="64x18">64 × 18</option><option value="20x18">20 × 18</option>
      </select></label>
      <label>Theme<select data-terminal-control="theme"><option value="dark">Dark</option><option value="light">Light</option></select></label>
      <label>State<select data-terminal-control="scenario">
        <option value="streaming">Streaming</option><option value="idle">Idle</option><option value="tool">Tool complete</option><option value="error">Tool error</option><option value="approval">Approval</option><option value="task">Task suggestion</option><option value="session">Session picker</option>
      </select></label>
      <label class="terminal-workbench-toggle"><input type="checkbox" data-terminal-control="expanded" /> Expanded tool output</label>
    </form>
    <p class="terminal-workbench-status" data-terminal-status role="status" aria-live="polite">100 by 30, dark, streaming</p>
    <div class="terminal-workbench-stage" data-terminal-stage>${terminalShellMarkup()}</div>
  </div>`;
}

function setupFrameMarkup(content, label = "OpenClaw setup", renderer = "Setup flow (Clack)") {
  return `<div class="terminal-setup-frame" aria-label="${label}"><div class="terminal-setup-bar"><strong>${label}</strong><span>${renderer}</span></div><div class="terminal-setup-screen">${content}</div></div>`;
}

function setupPromptMarkup({
  message,
  value = "",
  hint = "",
  state = "active",
  sensitive = false,
}) {
  const shownValue = sensitive ? "•".repeat(Math.max(8, value.length)) : value;
  const symbol = state === "error" ? "▲" : state === "submit" ? "◇" : "◆";
  return `<div class="terminal-setup-prompt" data-state="${state}"><span class="terminal-guide">${symbol}</span><div><strong>${message}</strong><p>${shownValue || `<span class="terminal-placeholder">${hint}</span>`}${state === "active" ? '<i aria-hidden="true">▋</i>' : ""}</p>${state === "error" ? `<small>${hint}</small>` : ""}</div></div>`;
}

function setupSelectionMarkup({ multiple = false, searchable = false } = {}) {
  const options = [
    ["OpenAI", "Detected credential", true],
    ["Anthropic", "API key", multiple],
    ["Ollama", "Local provider", false],
  ];
  const visibleOptions = searchable ? options.slice(0, 1) : options;
  return `<div class="terminal-setup-select"><div class="terminal-guide">◆</div><div><strong>${multiple ? "Choose providers" : "Choose a provider"}</strong>${searchable ? '<p class="terminal-setup-search">Search: open<span aria-hidden="true">▋</span> <small>1 match</small></p>' : ""}<div class="terminal-setup-options">${visibleOptions
    .map(
      ([label, hint, selected], index) =>
        `<span class="${index === 0 ? "is-focused" : ""}"><b>${multiple ? (selected ? "◼" : "◻") : index === 0 ? "●" : "○"}</b><em>${label}</em><small>${hint}</small></span>`,
    )
    .join("")}</div><p class="terminal-key-hint">${multiple ? "space toggle · enter submit" : "↑/↓ move · enter select"} · esc cancel</p></div></div>`;
}

function setupConfirmMarkup(layout = "inline") {
  return `<div class="terminal-setup-confirm" data-layout="${layout}"><span class="terminal-guide">◆</span><div><strong>Continue with guided setup?</strong><div class="terminal-setup-confirm-actions"><span class="is-focused">● Yes</span><span>○ No</span></div><p class="terminal-key-hint">← back · enter confirm</p></div></div>`;
}

function setupProgressMarkup(determinate = false) {
  return `<div class="terminal-setup-progress"><span class="terminal-guide">${determinate ? "◒" : "◐"}</span><div><strong>${determinate ? "Installing selected skills" : "Verifying provider access"}</strong><p>${determinate ? "████████████░░░░ 75%" : "Checking openai/gpt-5.5…"}</p></div></div>`;
}

function optionAnatomyMarkup() {
  return setupFrameMarkup(
    `<div class="terminal-option-question"><span class="terminal-guide">◆</span><strong>Use current model (openai/gpt-5.6-sol)?</strong></div><div class="terminal-option-list"><span class="is-selected"><b>●</b><span><strong>Continue with current model</strong><small>openai/gpt-5.6-sol · current · recommended</small></span></span><span><b>○</b><span><strong>See other options</strong><small>Browse detected and manually configured providers</small></span></span><span class="is-disabled"><b>○</b><span><strong>Use local model</strong><small>Unavailable · no local runtime detected</small></span></span></div><p class="terminal-key-hint">↑/↓ to navigate · Enter: confirm</p>`,
    "Rich option anatomy",
  );
}

function discoverySummaryMarkup() {
  return setupFrameMarkup(
    `<div class="terminal-discovery-note"><span>◇</span><div><strong>AI found</strong><p><span>Current model</span><em>openai/gpt-5.6-sol · already configured · recommended</em></p><p><span>OpenAI API key</span><em>environment variable set · recommended</em></p><p><span>Claude Code</span><em>installed · recommended</em></p><p><span>Codex</span><em>logged in · recommended</em></p></div></div>`,
    "Discovery summary",
  );
}

function overviewContent() {
  return `${pageIntro("Terminal UI", "Terminal translations of Carapace components, grounded in OpenClaw's current agent TUI and setup flows.")}
    <section class="terminal-hero" aria-labelledby="terminal-overview-model">${sectionIntro("terminal-overview-model", "Two renderers", "One design language, two terminal compositions", "The retained agent TUI uses Pi. Onboarding and command setup use Clack. Carapace documents what they share without pretending they are one runtime.")}
      <div class="terminal-overview-pair"><div>${rendererLabel("Agent TUI (Pi)")}${terminalShellMarkup({ width: "64x18", scenario: "streaming" })}</div><div>${rendererLabel("Setup flow (Clack)")}${setupFrameMarkup(`${setupPromptMarkup({ message: "Workspace directory", value: "~/.openclaw/workspace" })}${setupSelectionMarkup()}`)}</div></div>
    </section>
    <section aria-labelledby="terminal-overview-reuse">${sectionIntro("terminal-overview-reuse", "Reuse", "Start with existing Carapace guidance")}${referenceTable(["Need", "Reuse first", "Terminal UI adds"], [
      ["Color and type", '<a href="/foundations/colors/">Colors</a> · <a href="/foundations/typography/">Typography</a>', "ANSI/default foreground and cell-width constraints"],
      ["Inputs and choices", '<a href="/interface/primitives/input/">Input</a> · <a href="/interface/primitives/select/">Select</a> · <a href="/interface/primitives/combobox/">Combobox</a>', "Cursor ownership, compact lists, prompt history"],
      ["Agent semantics", '<a href="/agent-components/">Agent Components</a>', "Transcript, tool, composer, and approval translations"],
      ["Flow and loading", '<a href="/interface/primitives/flow/">Flow</a> · <a href="/interface/primitives/loader/">Loader</a>', "Append-only guide lines and terminal progress"],
    ])}</section>
    <section aria-labelledby="terminal-overview-boundary">${sectionIntro("terminal-overview-boundary", "Boundary", "Reference, not a new runtime")}${guidanceList([
      "Design in columns and rows; preserve graphemes, ANSI styles, OSC 8 links, and focused-input cursor placement.",
      "Use the host terminal's foreground and font. Reuse Carapace semantic colors; do not add a TUI palette or typography scale.",
      "Keep product behavior, keybindings, history, and renderer adapters in OpenClaw, Pi, and Clack.",
      "Label version-specific limits as reference facts, not Carapace tokens.",
    ])}<div class="terminal-baseline"><div><span>OpenClaw</span><code>${openClawSha.slice(0, 12)}</code></div><div><span>Pi TUI</span><code>0.81.1</code></div><div><span>Clack prompts</span><code>1.7.0</code></div></div></section>`;
}

function transcriptContent() {
  return `${pageIntro("Transcript", "A terminal transcript distinguishes authorship, neutral system context, streaming work, and dismissible side results without turning every line into a card.")}
    <section aria-labelledby="terminal-transcript-grammar">${sectionIntro("terminal-transcript-grammar", "Grammar", "Rows carry different weight")}${transcriptRowsMarkup()}</section>
    <section aria-labelledby="terminal-transcript-content">${sectionIntro("terminal-transcript-content", "Terminal fallbacks", "Keep unavailable content explicit")}
      ${referenceTable(["Content", "Terminal rendering", "Lifecycle"], [
        ["Attachment-only user turn", "Attached image / file / labeled file", "Persists as an ordinary user row"],
        ["Pairing QR", "Sanitized terminalText after assistant prose", "Part of the assistant message"],
        ["Empty local final", "(no output)", "May remain for local runs; external empty finals suppress it"],
        ["Tool media", "MIME, size, and omitted placeholder", "No native terminal image surface today"],
        ["Command feedback", "Plain system rows", "Returns to scrollback; not a modal"],
      ])}
    </section>
    <section aria-labelledby="terminal-transcript-boundary">${sectionIntro("terminal-transcript-boundary", "Cross-surface contract", "Translate Agent Components into cells")}${guidanceList([
      "Use Agent Components for medium-neutral message and Markdown semantics.",
      "Terminal UI owns default-foreground prose, filled user rows, ANSI/OSC 8 wrapping, and streaming segmentation.",
      "BTW stays an inline transcript card; it is not a Pi overlay.",
      "OpenClaw prunes long transcripts around a 180-component implementation limit; do not promote that number to a design token.",
    ])}<p class="terminal-source-note">Sources: ${sourceLink("src/tui/components/chat-log.ts", "chat log", "#L244-L655")}, ${sourceLink("src/tui/tui-formatters.ts", "terminal formatters", "#L230-L463")}, and ${sourceLink("src/tui/components/hyperlink-markdown.ts", "OSC 8 links", "#L11-L43")}.</p></section>`;
}

function agentShellContent() {
  return `${pageIntro("Agent shell", "The OpenClaw reference is a five-region vertical composition. Its hierarchy comes from order in the terminal buffer, not fixed web chrome.")}
    <section aria-labelledby="terminal-shell-anatomy">${sectionIntro("terminal-shell-anatomy", "Anatomy", "Header → transcript → status → footer → editor")}
      <ol class="terminal-shell-anatomy"><li><span>01</span><strong>Header</strong><p>Backend, agent, and session identity.</p></li><li><span>02</span><strong>Transcript</strong><p>User, assistant, system, BTW, and work rows.</p></li><li><span>03</span><strong>Status</strong><p>Connection, activity, and elapsed time.</p></li><li><span>04</span><strong>Footer</strong><p>Mutable agent, session, model, modes, goal, and token facts.</p></li><li><span>05</span><strong>Editor</strong><p>Default focus, multiline input, and autocomplete.</p></li></ol>
      ${terminalShellMarkup({ width: "100x30", scenario: "tool", expanded: true })}
    </section>
    <section aria-labelledby="terminal-shell-workbench">${sectionIntro("terminal-shell-workbench", "Workbench", "Size, theme, and state")}${terminalWorkbenchMarkup()}</section>
    <section aria-labelledby="terminal-shell-rules">${sectionIntro("terminal-shell-rules", "Guidance", "Preserve terminal composition")}${guidanceList([
      "The transcript may push the header above the active viewport; do not document it as sticky.",
      "The footer wraps through Pi Text. It does not currently remove lower-priority parts at a breakpoint.",
      "Overlays temporarily own focus; closing them restores the editor.",
      "Descriptions disappear before labels or selection at narrow widths; cell measurements, not CSS breakpoints, decide fit.",
    ])}<p class="terminal-source-note">Current composition: ${sourceLink("src/tui/tui.ts", "root sequence", "#L840-L859")}.</p></section>`;
}

function composerContent() {
  return `${pageIntro("Composer", "Multiline agent input with terminal-native cursor, history, paste, and completion behavior.")}
    <section aria-labelledby="terminal-composer-specimen">${sectionIntro("terminal-composer-specimen", "Primary specimen", "The active bottom of the agent shell")}${rendererLabel("Agent TUI (Pi)")}<div class="terminal-editor-specimen"><span>›</span><p>Compare the picker at 20 columns,<br />then keep the selected row visible.</p><i aria-hidden="true">▋</i></div></section>
    <section aria-labelledby="terminal-composer-states">${sectionIntro("terminal-composer-states", "States", "Input owns the keyboard while focused")}${referenceTable(["State", "Behavior", "Related Carapace guidance"], [
      ["Editing", "Enter submits; Shift+Enter or Ctrl+J inserts a newline", '<a href="/agent-components/input-bar/">Agent Composer</a>'],
      ["History", "Earlier submitted input can return to the editor", '<a href="/interface/primitives/input-area/">Input Area</a>'],
      ["Completion", "Slash and path matches attach above the editor", '<a href="/interface/primitives/autocomplete/">Autocomplete</a>'],
      ["Paste", "Large or multiline paste remains one authored input", '<a href="/foundations/base/">Base styles</a>'],
    ])}</section>
    <section aria-labelledby="terminal-composer-guidance">${sectionIntro("terminal-composer-guidance", "Guidance", "Keep focus physical")}${guidanceList(["Propagate focus to the embedded editor so the hardware cursor and IME window stay aligned.", "Let overlays and inline results take Enter or Escape only while they visibly own focus.", "Wrap input in cells; never hide the prompt, cursor, or primary submit behavior to preserve metadata."])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/components/custom-editor.ts", "OpenClaw editor")} and ${piLink("src/components/editor.ts", "Pi editor")}.</p></section>`;
}

function confirmationContent() {
  return `${pageIntro("Confirmation", "Simple setup questions and detailed agent approvals share explicit choices, visible consequences, and safe defaults.")}
    <section aria-labelledby="terminal-confirm-setup">${sectionIntro("terminal-confirm-setup", "Setup variants", "Inline or vertical")}${rendererLabel("Setup flow (Clack)")}<div class="terminal-confirm-grid">${setupFrameMarkup(setupConfirmMarkup("inline"), "Inline confirm")}${setupFrameMarkup(setupConfirmMarkup("vertical"), "Vertical confirm")}</div></section>
    <section aria-labelledby="terminal-confirm-agent">${sectionIntro("terminal-confirm-agent", "Detailed decisions", "Select, arm, commit")}${rendererLabel("Agent TUI (Pi)")}<div class="terminal-overlay-pair"><div>${approvalMarkup("approval")}</div><div>${approvalMarkup("task")}</div></div></section>
    <section aria-labelledby="terminal-confirm-guidance">${sectionIntro("terminal-confirm-guidance", "Guidance", "Match risk to ceremony")}${guidanceList(["Use ordinary yes/no for reversible setup choices; show the initial value in the selection.", "Enter privileged agent decisions on Deny or Dismiss when available.", "Require a second commit for privileged or costly actions; changing selection disarms it.", "Keep severity textual and pair every resolved outcome with words, not color alone."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/clack-navigation-prompts.ts", "setup confirm", "#L738-L798")} and ${sourceLink("src/tui/tui-plugin-approvals.ts", "agent approval", "#L288-L416")}.</p></section>`;
}

function fieldInputContent() {
  return `${pageIntro("Field input", "Single-line setup input for ordinary values, sensitive values, validation, and submitted history.")}
    <section aria-labelledby="terminal-field-specimen">${sectionIntro("terminal-field-specimen", "Primary specimen", "One prompt shell, four important states")}${rendererLabel("Setup flow (Clack)")}<div class="terminal-field-grid">${setupFrameMarkup(setupPromptMarkup({ message: "Workspace directory", hint: "~/.openclaw/workspace" }), "Placeholder")}${setupFrameMarkup(setupPromptMarkup({ message: "Gateway port", value: "99999", hint: "Enter a port from 1 to 65535", state: "error" }), "Validation")}${setupFrameMarkup(setupPromptMarkup({ message: "Provider API key", value: "sk-example", sensitive: true }), "Sensitive")}${setupFrameMarkup(setupPromptMarkup({ message: "Workspace directory", value: "~/.openclaw/workspace", state: "submit" }), "Submitted")}</div></section>
    <section aria-labelledby="terminal-field-guidance">${sectionIntro("terminal-field-guidance", "Guidance", "Protect secrets and preserve context")}${guidanceList(["Reuse Input and Sensitive Input semantics; Terminal UI only adds guide-line, cursor, and scrollback behavior.", "Keep validation next to the active prompt and leave the value editable.", "Mask sensitive values while active, never echo them on submit, and never replay-cache them for Back/Next.", "Collapse submitted ordinary values into prompt history so the flow remains legible."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/clack-prompter.ts", "text and password routing", "#L288-L329")} and ${sourceLink("src/wizard/navigation-prompter.ts", "sensitive history rule", "#L155-L165")}.</p></section>`;
}

function onboardingContent() {
  const flow = `<div class="terminal-setup-message is-intro"><span>┌</span><strong>OpenClaw guided setup</strong></div><div class="terminal-setup-note"><span>│</span><div><strong>Welcome</strong><p>We’ll detect a working provider, configure your workspace, and hand off to chat.</p></div></div><div class="terminal-setup-history"><span>◇</span><p>Continue with guided setup? <strong>Yes</strong></p></div>${setupProgressMarkup()}${setupSelectionMarkup()}<div class="terminal-setup-footer">← back · ↑/↓ move · enter select</div>`;
  return `${pageIntro("Onboarding", "OpenClaw's end-to-end setup composition, built from the prompt components documented in this section.")}
    <section aria-labelledby="terminal-onboarding-guided">${sectionIntro("terminal-onboarding-guided", "Primary specimen", "Guided first run")}${rendererLabel("Setup flow (Clack)")}${setupFrameMarkup(flow, "OpenClaw guided setup")}</section>
    <section aria-labelledby="terminal-onboarding-sequence">${sectionIntro("terminal-onboarding-sequence", "Sequence", "Orient, decide, verify, apply, hand off")}${referenceTable(["Stage", "Components", "What remains visible"], [
      ["Orient", "Intro · welcome note · risk note", "Purpose and escape hatch"],
      ["Choose", "Confirm · select · sensitive input", "Submitted, non-secret answers"],
      ["Verify", "Indeterminate progress · result note", "Candidate and latency or failure"],
      ["Apply", "Progress · summary note", "What configuration changed"],
      ["Hand off", "Outro · browser/TUI/chat choice", "Where the user continues"],
    ])}</section>
    <section aria-labelledby="terminal-onboarding-branches">${sectionIntro("terminal-onboarding-branches", "Variants", "Branches, not new component families")}${referenceTable(["Flow", "Distinct job", "Reused components"], [
      ["Guided", "Detect and verify the fastest working route", "Note, confirm, select, sensitive input, progress, outro"],
      ["Classic", "Choose quickstart, advanced, keep, or import paths", "The same prompt set with broader branching"],
      ["Remote", "Discover or enter a gateway and establish trust", "Confirm, progress, select, text, sensitive input, note"],
      ["Channel / plugin", "Configure integrations after the base runtime", "Select, multiselect, fields, confirm, notes"],
    ])}<p class="terminal-source-note">Current guided flow: ${sourceLink("src/commands/onboard-guided.ts", "onboarding sequence", "#L109-L540")}. Classic: ${sourceLink("src/wizard/setup.ts", "classic setup", "#L75-L234")}.</p></section>`;
}

function promptFlowContent() {
  return `${pageIntro("Prompt flow", "The append-only guide that connects setup prompts, remembers safe answers, and makes navigation boundaries visible.")}
    <section aria-labelledby="terminal-flow-specimen">${sectionIntro("terminal-flow-specimen", "Primary specimen", "Active prompt plus collapsed history")}${rendererLabel("Setup flow (Clack)")}${setupFrameMarkup(`<div class="terminal-setup-message is-intro"><span>┌</span><strong>Configure OpenClaw</strong></div><div class="terminal-setup-history"><span>◇</span><p>Setup mode <strong>QuickStart</strong></p></div><div class="terminal-setup-note"><span>│</span><div><strong>Gateway</strong><p>Local gateway detected.</p></div></div>${setupPromptMarkup({ message: "Gateway port", value: "18789" })}<div class="terminal-setup-footer">← back · → next · enter submit</div>`, "Prompt history")}</section>
    <section aria-labelledby="terminal-flow-states">${sectionIntro("terminal-flow-states", "Flow states", "Every transition has a terminal shape")}${referenceTable(["State", "Rendering", "Rule"], [
      ["Intro / outro", "Guide start or end plus message", "Name the flow and the next destination"],
      ["Note / plain", "Bordered context or unframed output", "Use note for human framing; plain for raw disclosure"],
      ["Submit", "Active prompt collapses into history", "Keep ordinary answers scannable"],
      ["Cancel", "Red guide end and cancellation copy", "Distinguish user cancellation from silent owner abort"],
      ["Back / next", "Footer actions when available", "Next accepts the remembered answer without replaying side effects"],
    ])}</section>
    <section aria-labelledby="terminal-flow-history">${sectionIntro("terminal-flow-history", "History", "Navigation is a behavior contract")}${guidanceList(["Cache ordinary answers and suppress duplicate notes or output while revisiting prompts.", "Never cache or replay sensitive answers.", "Disable Back after irreversible writes instead of pretending the prior prompt can safely rerun.", "Restore the terminal before handing control to a browser, external CLI, or the agent TUI."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/navigation-prompter.ts", "history and irreversible boundaries", "#L86-L299")} and ${clackLink("packages/prompts/src/messages.ts", "Clack flow messages", "#L31-L73")}.</p></section>`;
}

function selectionContent() {
  return `${pageIntro("Selection", "Single and multiple choice, with searchable setup variants and retained agent pickers.")}
    <section aria-labelledby="terminal-selection-anatomy">${sectionIntro("terminal-selection-anatomy", "Option anatomy", "Show the choice, its identity, and why it matters")}${rendererLabel("Setup flow (Clack)")}${optionAnatomyMarkup()}
      ${referenceTable(["Part", "Purpose", "Terminal rule"], [
        ["Marker", "Focused, selected, or checked state", "Keep it in the first cell; never rely on color alone"],
        ["Label", "The action or object being chosen", "Lead with the clearest differentiator"],
        ["Value", "Stable identity such as provider/model", "Keep separate from the human label"],
        ["Annotation", "Current, default, recommended, configured", "Secondary plain text; render each meaning once"],
        ["Description", "Consequence or reason to choose", "Use a second line; remove before identity or status at narrow widths"],
        ["Availability", "Disabled or unavailable plus reason", "Dim the option but keep the reason readable"],
      ])}</section>
    <section aria-labelledby="terminal-selection-semantics">${sectionIntro("terminal-selection-semantics", "Meaning", "Current, default, selected, and recommended are different")}${guidanceList(["Current names the saved or active value. Default names the initial selection when no saved answer exists.", "Recommended is product advice, not selection state. A recommended option may be unselected; a current option may not be recommended.", "Selected is transient interaction state. Use the marker and emphasis for it, not a duplicate text suffix.", "Configured and available describe readiness. When unavailable, state the reason instead of removing the option when discovery context matters."])}</section>
    <section aria-labelledby="terminal-selection-discovery">${sectionIntro("terminal-selection-discovery", "Discovery summary", "A rich list can inform without being selectable", "The onboarding summary reports detected candidates and status first; the next prompt turns that evidence into a choice.")}${discoverySummaryMarkup()}</section>
    <section aria-labelledby="terminal-selection-setup">${sectionIntro("terminal-selection-setup", "Variants", "Radio, checkbox, and searchable lists")}${rendererLabel("Setup flow (Clack)")}<div class="terminal-selection-grid">${setupFrameMarkup(setupSelectionMarkup(), "Select")}${setupFrameMarkup(setupSelectionMarkup({ multiple: true }), "Multiselect")}${setupFrameMarkup(setupSelectionMarkup({ searchable: true }), "Searchable select")}${setupFrameMarkup(setupSelectionMarkup({ multiple: true, searchable: true }), "Searchable multiselect")}</div></section>
    <section aria-labelledby="terminal-selection-agent">${sectionIntro("terminal-selection-agent", "Agent pickers", "The same selection semantics in an overlay")}${rendererLabel("Agent TUI (Pi)")}<div class="terminal-picker-grid">${pickerMarkup("model")}${pickerMarkup("session")}</div></section>
    <section aria-labelledby="terminal-selection-guidance">${sectionIntro("terminal-selection-guidance", "Guidance", "Selection must survive compact terminals")}${guidanceList(["Preserve the focused option while clipping and show top or bottom ellipses when rows are omitted.", "At wide widths, metadata may follow the label; at narrow widths, put it on the next line and remove optional description first.", "Use tokenized substring filtering for current setup search; do not document it as fuzzy search.", "Keep search mode, keyboard-navigation mode, selection count, required errors, and no-match states explicit."])}<p class="terminal-source-note">Sources: ${sourceLink("src/commands/onboard-guided.ts", "guided discovery and route choice", "#L224-L331")}, ${sourceLink("src/wizard/clack-navigation-prompts.ts", "setup selection renderers", "#L98-L735")}, and ${sourceLink("src/tui/components/selectors.ts", "agent selectors")}.</p></section>`;
}

function statusProgressContent() {
  return `${pageIntro("Status and progress", "Persistent agent activity and transient setup work use related status semantics with different lifecycles.")}
    <section aria-labelledby="terminal-status-agent">${sectionIntro("terminal-status-agent", "Persistent status", "Connection and activity share one shell line")}${rendererLabel("Agent TUI (Pi)")}<div class="terminal-status-list" role="list"><span role="listitem">connected <i>|</i> idle</span><span role="listitem">⠋ waiting · 00:12 <i>|</i> connected</span><span role="listitem">⠋ finishing context · 01:08 <i>|</i> connected</span><span role="listitem" data-state="error">error <i>|</i> connected</span><span role="listitem">local stopped <i>|</i> idle</span></div></section>
    <section aria-labelledby="terminal-status-setup">${sectionIntro("terminal-status-setup", "Transient progress", "Indeterminate and determinate")}${rendererLabel("Setup flow (Clack) and OpenClaw CLI reporter")}<div class="terminal-progress-grid">${setupFrameMarkup(setupProgressMarkup(), "Indeterminate")}${setupFrameMarkup(setupProgressMarkup(true), "Determinate", "OpenClaw CLI reporter")}</div></section>
    <section aria-labelledby="terminal-status-guidance">${sectionIntro("terminal-status-guidance", "Guidance", "State what is happening and how it ended")}${guidanceList(["Pair animation with a changing activity label; clamp the label to terminal width without splitting graphemes.", "Use determinate percentage only when the CLI reporter has real progress.", "Stop with a completion or failure message when the outcome matters; clear only truly transient work.", "Reuse Loader and status colors; terminal glyphs are the medium translation, not new semantic tokens."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/clack-prompter.ts", "wizard progress", "#L354-L406")} and ${sourceLink("src/cli/progress.ts", "determinate CLI progress", "#L61-L166")}.</p></section>`;
}

function toolExecutionContent() {
  return `${pageIntro("Tool execution", "Agent tool work appears in the transcript with explicit lifecycle and bounded disclosure.")}
    <section aria-labelledby="terminal-tool-states">${sectionIntro("terminal-tool-states", "States", "Running, success, and error")}${rendererLabel("Agent TUI (Pi)")}<div class="terminal-tool-grid">${toolCardMarkup("running")}${toolCardMarkup("success")}${toolCardMarkup("error", true)}</div></section>
    <section aria-labelledby="terminal-tool-disclosure">${sectionIntro("terminal-tool-disclosure", "Disclosure", "Bound output without hiding outcomes")}${guidanceList(["Translate Generic Tool and Interactive Tool semantics into terminal rows; do not redefine their lifecycle here.", "Pair pending, success, and error surfaces with a label or outcome glyph.", "End collapsed output with an ellipsis and preserve retained detail when expanded.", "Treat the current 12-rendered-line collapsed limit as an OpenClaw fact, not a Carapace token."])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/components/tool-execution.ts", "tool execution", "#L22-L189")}.</p></section>`;
}

const terminalContents = {
  "terminal-ui": overviewContent,
  "terminal-agent-shell": agentShellContent,
  "terminal-composer": composerContent,
  "terminal-confirmation": confirmationContent,
  "terminal-field-input": fieldInputContent,
  "terminal-onboarding": onboardingContent,
  "terminal-prompt-flow": promptFlowContent,
  "terminal-selection": selectionContent,
  "terminal-status-progress": statusProgressContent,
  "terminal-tool-execution": toolExecutionContent,
  "terminal-transcript": transcriptContent,
};

export const terminalUiContentIds = Object.freeze(Object.keys(terminalContents));

export function getTerminalUiContent(id) {
  return terminalContents[id]?.();
}
