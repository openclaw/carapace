const openClawSha = "9e5e6f961e1a918be0bd7d8c3bc8e98a7e24249c";
const piSha = "20be4b18d4c57487f8993d2762bace129f0cf7c6";

const openClawBase = `https://github.com/openclaw/openclaw/blob/${openClawSha}/`;
const piBase = `https://github.com/earendil-works/pi/blob/${piSha}/packages/tui/`;

function pageIntro(title, lede) {
  return `<header class="reference-intro"><p class="eyebrow">Terminal UI</p><h1>${title}</h1><p>${lede}</p></header>`;
}

function sectionIntro(id, eyebrow, title, copy = "") {
  return `<div class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h2 id="${id}">${title}</h2></div>${copy ? `<p class="section-copy">${copy}</p>` : ""}</div>`;
}

function guidanceList(items) {
  return `<ul class="guidance-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function codeBlock(code, language = "text") {
  const escaped = code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return `<div class="code-block"><div class="code-block-header"><span>${language}</span><button type="button" data-copy-code>Copy</button></div><pre><code>${escaped}</code></pre></div>`;
}

function sourceLink(path, label, lines = "") {
  return `<a href="${openClawBase}${path}${lines}" target="_blank" rel="noreferrer">${label}</a>`;
}

function piLink(path, label, lines = "") {
  return `<a href="${piBase}${path}${lines}" target="_blank" rel="noreferrer">${label}</a>`;
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

const terminalRoleRows = [
  ["Default foreground", "Assistant prose", "Inherit the terminal foreground; do not force branded ink."],
  ["Primary text", "Editor and labels", "High-contrast content that must remain legible."],
  ["Muted text", "System notices and metadata", "Secondary context, never the only carrier of state."],
  ["Primary accent", "Active selection and confirmation", "Coral in Carapace specimens; use sparingly."],
  ["Secondary accent", "Focus, connection, and context", "Sea in Carapace specimens."],
  ["Success / warning / error", "Tool and run outcomes", "Reserve for outcomes and pair with text or a glyph."],
  ["Inset surface", "User-authored turn", "Distinguish authorship without turning every row into a card."],
  ["Work surface", "Tool pending / success / error", "Low-chroma state surface with readable content."],
];

const glyphRows = [
  ["›", "Current selection", "Pair with emphasis; never rely on color alone."],
  ["…", "Truncated or undisclosed content", "Name what is omitted or offer expansion."],
  ["⠋", "Active work", "Pair motion with an activity label and elapsed time."],
  ["✓ / ! / ×", "Outcome", "Use a stable text label beside the glyph."],
  ["│ ─ ┌ ┐ └ ┘", "Structure", "Measure by terminal columns and provide an ASCII-safe fallback."],
  ["🔧", "Tool identity", "Treat emoji width as runtime-sensitive; the label remains authoritative."],
];

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

function overviewContent() {
  return `${pageIntro("Terminal UI", "A cell-first design language extracted from OpenClaw's current terminal client: one conversation shell, a small set of terminal patterns, and explicit runtime boundaries.")}
    <section class="terminal-hero" aria-labelledby="terminal-overview-model">
      ${sectionIntro("terminal-overview-model", "Mental model", "One shell, not a route tree", "OpenClaw renders a vertical buffer. Transcript content, work, status, and input share one flow; pickers and decisions temporarily capture focus above it.")}
      ${terminalShellMarkup({ scenario: "streaming" })}
    </section>
    <section aria-labelledby="terminal-overview-boundary">${sectionIntro("terminal-overview-boundary", "Ownership", "Design contract versus runtime", "Carapace documents the semantic terminal language. OpenClaw keeps product behavior, and Pi keeps terminal mechanics.")}
      ${referenceTable(["Owner", "Owns here", "Does not move"], [
        ["Carapace", "Roles, hierarchy, state guidance, reference specimens, testing guidance", "No exported terminal runtime or CSS API in Lab"],
        ["OpenClaw", "Agent/session/model meaning, transcript order, approvals, shortcuts", "No OpenClaw source changes in this extraction"],
        ["Pi TUI 0.81.1", "Rendering, cells, focus/cursor, editor, Markdown, lists, overlays", "No second TUI framework"],
      ])}
    </section>
    <section aria-labelledby="terminal-overview-principles">${sectionIntro("terminal-overview-principles", "Principles", "Medium-specific, product-grounded")}${guidanceList([
      "Design in terminal columns and rows; DOM pixels only approximate the reference specimen.",
      "Preserve assistant prose in the terminal's default foreground.",
      "Pair color with text, glyphs, ordering, or shape so state never depends on color alone.",
      "Treat the focused surface as the owner of Enter, Escape, arrows, and confirmation.",
      "Keep this area in Lab until another terminal consumer proves a shared reusable interface.",
    ])}</section>`;
}

function colorContent() {
  return `${pageIntro("Color and contrast", "Use terminal color for hierarchy and outcomes, while preserving the user's foreground as the most durable reading surface.")}
    <section aria-labelledby="terminal-color-roles">${sectionIntro("terminal-color-roles", "Semantic roles", "Meaning before palette", "These roles are extracted from current OpenClaw use. Carapace's browser specimen maps primary emphasis to coral and context/focus to sea without claiming a new ANSI token API.")}
      ${referenceTable(["Role", "Current use", "Guidance"], terminalRoleRows)}
    </section>
    <section aria-labelledby="terminal-color-themes">${sectionIntro("terminal-color-themes", "Themes", "The relationship survives light and dark")}
      <div class="terminal-theme-pair">${terminalShellMarkup({ width: "64x18", theme: "dark", scenario: "idle" })}${terminalShellMarkup({ width: "64x18", theme: "light", scenario: "idle" })}</div>
    </section>
    <section aria-labelledby="terminal-color-approval">${sectionIntro("terminal-color-approval", "Guardrail", "Do not invent severity colors")}${guidanceList([
      "Current Info, Warning, and Critical approval metadata use the same muted text role.",
      "Coral marks an active choice or primary confirmation; it does not tint the entire shell.",
      "Sea communicates focus, connection, and secondary context.",
      "Outcome colors are reserved for actual success, warning, and error states.",
    ])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/theme/theme.ts", "OpenClaw terminal theme", "#L90-L223")} and ${sourceLink("src/tui/tui-plugin-approvals.ts", "approval metadata", "#L40-L58")}.</p></section>`;
}

function cellsContent() {
  return `${pageIntro("Cells, spacing, and glyphs", "Terminal layout is measured in visible columns. ANSI sequences are zero-width; graphemes, emoji, and borders still have to fit.")}
    <section aria-labelledby="terminal-cell-model">${sectionIntro("terminal-cell-model", "Cell model", "Every rendered line fits its width", "Pi rejects component output that exceeds the supplied terminal width. Wrapping and truncation must preserve ANSI state and grapheme boundaries.")}
      <div class="terminal-cell-demo" aria-label="A twelve-column terminal cell grid"><div class="terminal-cell-ruler">${Array.from({ length: 12 }, (_, index) => `<span>${(index + 1) % 10}</span>`).join("")}</div><div class="terminal-cell-line"><span>›</span><span>O</span><span>p</span><span>e</span><span>n</span><span>C</span><span>l</span><span>a</span><span>w</span><span>…</span><span> </span><span> </span></div></div>
      ${codeBlock(`render(width: number): string[]\nvisibleWidth("\\x1b[31mOpenClaw\\x1b[0m") // 8\ntruncateToWidth(line, width)`, "typescript")}
    </section>
    <section aria-labelledby="terminal-glyphs">${sectionIntro("terminal-glyphs", "Glyph vocabulary", "Structure stays readable without color")}${referenceTable(["Glyph", "Meaning", "Rule"], glyphRows)}</section>
    <section aria-labelledby="terminal-spacing">${sectionIntro("terminal-spacing", "Spacing", "Blank lines are layout")}${guidanceList([
      "Use deliberate blank rows between transcript turns and before bounded work surfaces.",
      "Indent plain system notices instead of boxing every status message.",
      "Keep selection prefixes and borders inside the component's width budget.",
      "Label any textual fallback for media or unsupported terminal capability.",
    ])}<p class="terminal-source-note">Runtime contract: ${piLink("src/tui.ts", "Pi Component.render", "#L64-L120")} and ${piLink("src/utils.ts", "ANSI-aware width utilities", "#L216-L267")}.</p></section>`;
}

function widthContent() {
  return `${pageIntro("Width, viewport, and density", "The active view is the bottom of a vertical terminal buffer. Width changes wrapping, detail, and overlays; height changes which earlier rows remain visible.")}
    <section aria-labelledby="terminal-width-matrix">${sectionIntro("terminal-width-matrix", "Reference matrix", "Tested sizes, not web breakpoints")}
      ${referenceTable(["Terminal", "Current proof", "Design consequence"], [
        ["100 × 30", "Default PTY harness", "Full labels, descriptions, and ordinary transcript density"],
        ["80 × 20", "Approval matrix", "Pi overlay reaches its default 80-column cap"],
        ["64 × 18", "Compact approval matrix", "Long decision copy wraps while actions remain reachable"],
        ["20 × 18", "Picker + BTW PTY proof", "Descriptions disappear; selection and focus still survive"],
      ])}
    </section>
    <section aria-labelledby="terminal-viewport">${sectionIntro("terminal-viewport", "Viewport", "Bottom-aligned, not fixed chrome", "The header and older transcript rows can move above the viewport. Status, footer, and editor remain near the active bottom because they are later children in the buffer, not because CSS pins them.")}
      <div class="terminal-viewport-diagram"><span class="is-past">older transcript above viewport</span><span>recent transcript</span><strong>status · footer · editor</strong><i aria-hidden="true"></i></div>
    </section>
    <section aria-labelledby="terminal-density-rules">${sectionIntro("terminal-density-rules", "Responsive rules", "Collapse detail before meaning")}${guidanceList([
      "At 40 columns or less, list descriptions disappear while labels and the selected prefix remain.",
      "Overlays use the available terminal width up to Pi's current 80-column default.",
      "Wrap prose and editor input; truncate comparison metadata; page long decision detail.",
      "Treat audited values as OpenClaw reference defaults, not universal Carapace tokens.",
    ])}</section>`;
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

function workStatusContent() {
  return `${pageIntro("Work and status", "Name active work in the shell, preserve elapsed time for long operations, and let tool cards disclose bounded detail inside the transcript.")}
    <section aria-labelledby="terminal-status-hierarchy">${sectionIntro("terminal-status-hierarchy", "Shell status", "Connection and activity share one line")}
      <div class="terminal-status-list" role="list"><span role="listitem">connected <i>|</i> idle</span><span role="listitem">⠋ waiting · 00:12 <i>|</i> connected</span><span role="listitem">⠋ finishing context · 01:08 <i>|</i> connected</span><span role="listitem" data-state="error">error <i>|</i> connected</span><span role="listitem">local stopped <i>|</i> idle</span></div>
    </section>
    <section aria-labelledby="terminal-tool-states">${sectionIntro("terminal-tool-states", "Tool cards", "One anatomy, explicit lifecycle")}
      <div class="terminal-tool-grid">${toolCardMarkup("running")}${toolCardMarkup("success")}${toolCardMarkup("error", true)}</div>
    </section>
    <section aria-labelledby="terminal-work-disclosure">${sectionIntro("terminal-work-disclosure", "Disclosure", "Bound work without hiding outcomes")}${guidanceList([
      "Pending, success, and error pair state surfaces with a running label or outcome glyph.",
      "Collapsed output ends with an ellipsis and remains bounded; expanded output preserves retained detail.",
      "Current OpenClaw caps collapsed tool output at 12 rendered lines, but the design contract is bounded disclosure—not the literal number.",
      "Verbose mode controls whether tool calls, partial output, and results enter the transcript at all.",
    ])}<p class="terminal-source-note">Sources: ${sourceLink("src/tui/tui.ts", "status rendering", "#L1056-L1241")} and ${sourceLink("src/tui/components/tool-execution.ts", "tool execution", "#L22-L189")}.</p></section>`;
}

function inputSelectionContent() {
  return `${pageIntro("Input and selection", "The focused terminal surface owns the keyboard. Editors, autocomplete, search, filtering, and settings share a visible cursor and unambiguous selection.")}
    <section aria-labelledby="terminal-editor-anatomy">${sectionIntro("terminal-editor-anatomy", "Editor", "Multiline input stays at the active bottom")}
      <div class="terminal-editor-specimen"><span>›</span><p>Compare the picker at 20 columns,<br />then keep the selected row visible.</p><i aria-hidden="true">▋</i></div>
    </section>
    <section aria-labelledby="terminal-picker-patterns">${sectionIntro("terminal-picker-patterns", "Selection", "Searchable and filterable variants")}
      <div class="terminal-picker-grid">${pickerMarkup("model")}${pickerMarkup("session")}</div>
      <p class="section-copy">Model, agent, and context use the searchable pattern. Sessions use the filterable variant, where the first Escape clears a nonempty filter and the next Escape closes.</p>
    </section>
    <section aria-labelledby="terminal-key-scope">${sectionIntro("terminal-key-scope", "Keyboard scope", "Document precedence, not only shortcuts")}
      ${referenceTable(["Focused surface", "Keys", "Meaning"], [
        ["Editor", "Enter · Shift+Enter · Ctrl+J", "Submit or insert a newline"],
        ["Picker", "↑/↓ · Ctrl+P/N · Enter · Esc", "Move, choose, clear/cancel"],
        ["Decision", "↑/↓ · Enter · Esc · PgUp/PgDn", "Choose, arm/commit, cancel, page detail"],
        ["BTW result", "Enter with empty editor · Esc", "Dismiss only when no overlay owns the key"],
      ])}
      ${guidanceList([
        "Propagate focus to the embedded Pi Input or Editor so the hardware cursor and IME candidate window are positioned correctly.",
        "Emphasize query matches inside labels and descriptions, while keeping the selected arrow and text weight distinct.",
        "Hide descriptions at extreme width before hiding labels or selection.",
      ])}
    </section>`;
}

function overlayContent() {
  return `${pageIntro("Overlays and decisions", "Terminal overlays capture focus without automatic dialog chrome. Decisions enter conservatively, name consequences, and require an explicit second commit for privileged actions.")}
    <section aria-labelledby="terminal-overlay-anatomy">${sectionIntro("terminal-overlay-anatomy", "Overlay", "A composited terminal layer")}
      <div class="terminal-overlay-pair"><div>${approvalMarkup("approval")}</div><div>${approvalMarkup("task")}</div></div>
    </section>
    <section aria-labelledby="terminal-decision-sequence">${sectionIntro("terminal-decision-sequence", "Decision grammar", "Select, arm, commit")}
      <ol class="terminal-decision-sequence"><li><strong>Enter safely.</strong><span>Deny or Dismiss is selected when available.</span></li><li><strong>Move deliberately.</strong><span>Changing selection disarms any pending confirmation.</span></li><li><strong>Name the consequence.</strong><span>The confirmation sentence says what the second Enter will do.</span></li><li><strong>Resolve visibly.</strong><span>Show stale, expired, denied, accepted, or failed outcomes in words.</span></li></ol>
    </section>
    <section aria-labelledby="terminal-decision-variants">${sectionIntro("terminal-decision-variants", "Variants", "One pattern, current product-specific specimens")}
      ${referenceTable(["Specimen", "Safe entry", "Important difference"], [
        ["Local-shell consent", "No first", "Permission lasts only for the current TUI session"],
        ["Plugin / workspace-skill approval", "Deny when available", "Allow requires a second Enter; severity remains textual metadata"],
        ["Suggested follow-up task", "Dismiss when available", "Accept-only capability selects Start, but still requires a second Enter"],
      ])}
      <p class="terminal-source-note">Sources: ${sourceLink("src/tui/tui-local-shell.ts", "local consent", "#L32-L84")}, ${sourceLink("src/tui/tui-plugin-approvals.ts", "plugin approvals", "#L288-L416")}, and ${sourceLink("src/tui/tui-task-suggestions.ts", "task suggestions", "#L234-L361")}.</p>
    </section>`;
}

function agentShellContent() {
  return `${pageIntro("Agent shell", "The OpenClaw reference is a five-region vertical composition. Its hierarchy comes from order in the terminal buffer, not fixed web chrome.")}
    <section aria-labelledby="terminal-shell-anatomy">${sectionIntro("terminal-shell-anatomy", "Anatomy", "Header → transcript → status → footer → editor")}
      <ol class="terminal-shell-anatomy"><li><span>01</span><strong>Header</strong><p>Backend, agent, and session identity.</p></li><li><span>02</span><strong>Transcript</strong><p>User, assistant, system, BTW, and work rows.</p></li><li><span>03</span><strong>Status</strong><p>Connection, activity, and elapsed time.</p></li><li><span>04</span><strong>Footer</strong><p>Mutable agent, session, model, modes, goal, and token facts.</p></li><li><span>05</span><strong>Editor</strong><p>Default focus, multiline input, and autocomplete.</p></li></ol>
      ${terminalShellMarkup({ width: "100x30", scenario: "tool", expanded: true })}
    </section>
    <section aria-labelledby="terminal-shell-rules">${sectionIntro("terminal-shell-rules", "Composition rules", "Keep current behavior distinct from proposals")}${guidanceList([
      "The transcript may push the header above the active viewport; do not document it as sticky.",
      "The footer wraps through Pi Text. It does not currently remove lower-priority parts at a breakpoint.",
      "Overlays temporarily own focus; closing them restores the editor.",
      "External provider authentication suspends this shell and is not a Terminal UI component.",
      "Any future compact-shell hierarchy must be labeled as a design proposal until OpenClaw adopts it.",
    ])}<p class="terminal-source-note">Current composition: ${sourceLink("src/tui/tui.ts", "root sequence", "#L840-L859")}.</p></section>`;
}

function responsiveContent() {
  return `${pageIntro("Responsive terminals", "Inspect the same OpenClaw shell across tested terminal sizes, themes, and catalog-derived states. The browser workbench is a reference simulator, not a terminal emulator.")}
    <section aria-labelledby="terminal-responsive-workbench">${sectionIntro("terminal-responsive-workbench", "Workbench", "One composition, multiple constraints")}${terminalWorkbenchMarkup()}</section>
    <section aria-labelledby="terminal-responsive-reading">${sectionIntro("terminal-responsive-reading", "Reading the specimen", "Observed behavior versus visual approximation")}${guidanceList([
      "100×30, 80×20, 64×18, and 20×18 come from current PTY defaults or explicit compact tests.",
      "The specimen approximates terminal cells in CSS; Pi remains the authority for actual grapheme and ANSI width.",
      "At narrow widths, inspect labels, selected prefixes, editor focus, decision actions, and omitted descriptions.",
      "Test light and dark relationships without forcing assistant prose away from the terminal foreground.",
    ])}</section>`;
}

function piAdapterContent() {
  return `${pageIntro("Pi TUI adapter", "Pi TUI 0.81.1 is the current rendering engine. Keep its mechanics in OpenClaw's adapter and map Carapace guidance onto semantic theme roles.")}
    <section aria-labelledby="terminal-pi-contract">${sectionIntro("terminal-pi-contract", "Runtime contract", "Use the engine that already exists")}
      ${referenceTable(["Pi primitive", "OpenClaw use", "Carapace concern"], [
        ["TUI / Container", "Root vertical buffer and focus routing", "Shell hierarchy and state ownership"],
        ["Text / Markdown / Box", "Messages, notices, and tool work", "Readable roles, wrapping, and disclosure"],
        ["Editor / Input", "Composer, search, and filtering", "Focus, cursor, IME, and keyboard precedence"],
        ["SelectList / SettingsList", "Pickers and settings", "Selected prefix, descriptions, compact density"],
        ["showOverlay", "Pickers, consent, approvals, suggestions", "One active decision and explicit cancellation"],
      ])}
    </section>
    <section aria-labelledby="terminal-pi-mapping">${sectionIntro("terminal-pi-mapping", "Local mapping", "Map roles, not components")}
      ${codeBlock(`// OpenClaw-owned adapter sketch\nconst terminalTheme = {\n  assistantText: (text) => text, // terminal default foreground\n  selectedPrefix: accentPrimary,\n  selectedText: boldAccentPrimary,\n  focusContext: accentSecondary,\n  toolPendingBg: statusInfoSurface,\n  toolSuccessBg: statusSuccessSurface,\n  toolErrorBg: statusErrorSurface,\n};`, "typescript")}
      ${guidanceList([
        "Do not import browser CSS into an ANSI renderer.",
        "Do not copy Pi's renderer, cursor marker, width algorithms, or overlay controller into Carapace.",
        "Reapply ANSI styles after wraps and preserve OSC 8 link state through line breaks.",
        "Keep exact shortcuts, commands, and backend behavior inside OpenClaw.",
      ])}
    </section>
    <section aria-labelledby="terminal-pi-version">${sectionIntro("terminal-pi-version", "Audited dependency", "Pin guidance to a real runtime")}
      <p class="section-copy">This reference was checked against <a href="https://github.com/earendil-works/pi/tree/${piSha}" target="_blank" rel="noreferrer"><code>@earendil-works/pi-tui@0.81.1</code> at <code>${piSha.slice(0, 7)}</code></a>. Re-audit focus, overlays, width, and built-in component behavior when the dependency changes.</p>
    </section>`;
}

function testingContent() {
  return `${pageIntro("Testing", "Prove terminal design with cell-width assertions, focused input behavior, PTY scenarios, and visual inspection of the browser specimens.")}
    <section aria-labelledby="terminal-test-layers">${sectionIntro("terminal-test-layers", "Proof layers", "Each layer answers a different question")}
      ${referenceTable(["Layer", "Proves", "Examples"], [
        ["Component", "Width, wrapping, state labels, bounded output", "Messages, tools, lists, approvals"],
        ["Behavior", "Focus, key ownership, confirmation, stale resolution", "Picker clear/cancel; approval arm/commit"],
        ["PTY", "Actual terminal rendering and input at named rows/columns", "100×30 default; 64×18 approval; 20×18 picker"],
        ["Browser specimen", "Carapace hierarchy, contrast, and responsive documentation", "Light/dark and every workbench state"],
      ])}
    </section>
    <section aria-labelledby="terminal-test-matrix">${sectionIntro("terminal-test-matrix", "Minimum matrix", "Test state and size together")}
      <div class="terminal-test-grid">${["Idle shell", "Streaming assistant", "Tool running", "Tool error", "Approval safe default", "Approval armed", "Task suggestion", "Session picker", "Attachment-only turn", "BTW + overlay", "Local stopped", "External auth exclusion"].map((label) => `<span>${label}</span>`).join("")}</div>
    </section>
    <section aria-labelledby="terminal-test-checklist">${sectionIntro("terminal-test-checklist", "Checks", "A terminal failure is often invisible at one comfortable size")}${guidanceList([
      "Assert that every rendered line fits the supplied width after ANSI is ignored.",
      "Verify cursor and IME placement for every wrapper that embeds Input or Editor.",
      "Verify Escape and Enter precedence with overlays, BTW, active runs, and nonempty filters.",
      "Verify outcomes remain understandable with color removed.",
      "Verify long copy, bidi-safe sanitization, media fallbacks, and compact action reachability.",
      "Use actual PTY proof for runtime changes; browser screenshots validate this reference, not Pi behavior.",
    ])}</section>`;
}

function openClawReferenceContent() {
  return `${pageIntro("OpenClaw reference", "The extraction baseline is versioned to current OpenClaw source. Product behavior stays in OpenClaw; this page records what the Carapace specimens are grounded in.")}
    <section aria-labelledby="terminal-reference-baseline">${sectionIntro("terminal-reference-baseline", "Baseline", "27 observed surfaces, one shell")}
      <div class="terminal-baseline"><div><span>OpenClaw</span><code>${openClawSha.slice(0, 12)}</code></div><div><span>Pi TUI</span><code>0.81.1 · ${piSha.slice(0, 12)}</code></div><div><span>Carapace maturity</span><code>Lab</code></div></div>
      ${referenceTable(["Family", "Observed surfaces", "Public placement"], [
        ["Shell", "Conversation shell, header, status, footer", "Agent shell / Work and status"],
        ["Transcript", "User, assistant, system, pending, BTW", "Transcript"],
        ["Work", "Tool execution card", "Work and status"],
        ["Input", "Editor, slash/path autocomplete", "Input and selection"],
        ["Choice", "Model, agent, session, context, settings", "Input and selection"],
        ["Decisions", "Local consent, plugin/workspace approval, task suggestion", "Overlays and decisions"],
        ["Outputs", "Local shell, help, status, command feedback", "Transcript sequences"],
      ])}
    </section>
    <section aria-labelledby="terminal-reference-modes">${sectionIntro("terminal-reference-modes", "Availability", "Gateway and local project the same shell")}
      ${referenceTable(["Capability", "Gateway", "Local embedded"], [
        ["Shell, transcript, editor, pickers, settings", "Yes", "Yes"],
        ["Tools, streaming, BTW", "Yes", "Yes"],
        ["Plugin / workspace approvals", "Yes", "Yes, bridged locally"],
        ["Suggested follow-up tasks", "When negotiated", "Not currently exposed"],
        ["/auth", "Not a TUI command", "Suspends for external CLI"],
        ["! local shell", "Runs on TUI host", "Runs on TUI host"],
      ])}
    </section>
    <section aria-labelledby="terminal-reference-limits">${sectionIntro("terminal-reference-limits", "Reference values", "Implementation facts, not design tokens")}${guidanceList([
      "180 transcript components before pruning, with active content protected where possible.",
      "40,000 UTF-16 characters retained from local-shell output by default.",
      "12 rendered lines in collapsed tool output; 12/11-line task-detail viewport and page movement.",
      "Descriptions disappear at 40 columns or less; Pi overlays currently cap at 80 columns by default.",
      "Provider-auth visuals, terminal images, arbitrary TUI apps, and multi-pane layouts are not current OpenClaw surfaces.",
    ])}<p class="terminal-source-note">Browse the audited <a href="https://github.com/openclaw/openclaw/tree/${openClawSha}/src/tui" target="_blank" rel="noreferrer">OpenClaw <code>src/tui</code> tree</a> and <a href="https://github.com/earendil-works/pi/tree/${piSha}/packages/tui" target="_blank" rel="noreferrer">Pi TUI source</a>.</p></section>`;
}

const terminalContents = {
  "terminal-ui": overviewContent,
  "terminal-color": colorContent,
  "terminal-cells": cellsContent,
  "terminal-width": widthContent,
  "terminal-transcript": transcriptContent,
  "terminal-work-status": workStatusContent,
  "terminal-input-selection": inputSelectionContent,
  "terminal-overlays-decisions": overlayContent,
  "terminal-agent-shell": agentShellContent,
  "terminal-responsive": responsiveContent,
  "terminal-pi-adapter": piAdapterContent,
  "terminal-testing": testingContent,
  "terminal-openclaw-reference": openClawReferenceContent,
};

export const terminalUiContentIds = Object.freeze(Object.keys(terminalContents));

export function getTerminalUiContent(id) {
  return terminalContents[id]?.();
}
