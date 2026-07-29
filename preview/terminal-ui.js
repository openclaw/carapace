import { terminalUiFixtureManifest } from "./terminal-fixtures/manifest.js";
import { terminalTokens } from "./terminal-tokens.js";

const openClawBase = "https://github.com/openclaw/openclaw/blob/";

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
  const sha = terminalUiFixtureManifest["agent-shell"].sourceSha;
  return `<a href="${openClawBase}${sha}/${path}${lines}" target="_blank" rel="noreferrer">${label}</a>`;
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

function tokenCode(value) {
  return `<code>${value}</code>`;
}

function replayFigure(id) {
  const fixture = terminalUiFixtureManifest[id];
  if (!fixture) throw new Error(`Unknown terminal fixture: ${id}`);
  return `<figure class="terminal-runtime-capture">
    <figcaption><span><small>${fixture.renderer}</small><strong>${fixture.label}</strong></span><span class="terminal-replay-controls"><button class="terminal-replay-again" type="button" data-terminal-replay-again hidden>Replay</button><code>OpenClaw ${fixture.sourceSha.slice(0, 8)} · ${fixture.columns} × ${fixture.rows}</code></span></figcaption>
    <div class="terminal-replay-viewport" aria-label="${fixture.label}, terminal capture at ${fixture.columns} columns by ${fixture.rows} rows">
      <div class="terminal-replay-host" data-terminal-replay="${id}" aria-hidden="true" inert></div>
    </div>
    <p class="sr-only">${fixture.summary}</p>
    <p class="terminal-replay-error" data-terminal-replay-error hidden>The terminal renderer could not load. Reload the page to try again.</p>
  </figure>`;
}

function specimenSection(id, eyebrow, title, copy, fixtures) {
  const captures = fixtures.map(replayFigure).join("");
  return `<section data-section-kind="preview" aria-labelledby="${id}">${sectionIntro(id, eyebrow, title, copy)}<div class="terminal-capture-stack">${captures}</div></section>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function codeBlock(code, language = "html") {
  return `<div class="code-block"><div class="code-block-header"><span>${language}</span><button type="button" data-copy-code>Copy</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

// Interactive simulation of the captured prompt: a real Ghostty terminal
// wired to a client-side engine speaking the same glyph vocabulary. The
// captures below each one remain the canonical runtime proof.
function liveFigure(widget, title, hint, { rows = 10 } = {}) {
  return `<figure class="terminal-live-figure">
    <figcaption><span><small>Interactive · simulation</small><strong>${title}</strong></span><code>80 × ${rows} · click to focus</code></figcaption>
    <div class="terminal-live-viewport">
      <div class="terminal-live-host" data-terminal-live="${widget}" data-terminal-live-rows="${rows}" role="application" aria-label="${title}, interactive terminal simulation"></div>
    </div>
    <p class="terminal-live-hint">${hint}</p>
  </figure>`;
}

function liveSection(id, title, copy, widget, hint, options = {}) {
  return `<section data-section-kind="preview" aria-labelledby="${id}"><div class="section-heading"><div><p class="eyebrow">Try it</p><h2 id="${id}">${title}</h2></div><p class="section-copy">${copy}</p></div>${liveFigure(widget, title, hint, options)}</section>`;
}

function markupSection(id, title, fixtureId) {
  const fixture = terminalUiFixtureManifest[fixtureId];
  const snippet = `<figure class="terminal-runtime-capture">
  <div class="terminal-replay-viewport">
    <div data-terminal-replay="${fixtureId}"></div>
  </div>
</figure>

<script type="module">
  import { createGhosttyTerminal } from "@openclaw/libterminal/browser";
  import { terminalUiFixtures } from "./terminal-fixtures/terminal-ui-fixtures.js";

  const fixture = terminalUiFixtures["${fixtureId}"]; // ${fixture.columns} × ${fixture.rows}, OpenClaw ${fixture.sourceSha.slice(0, 8)}
  const controller = await createGhosttyTerminal({
    parent: document.querySelector('[data-terminal-replay="${fixtureId}"]'),
    size: { columns: fixture.columns, rows: fixture.rows },
    readOnly: true,
  });
  controller.write(Uint8Array.from(atob(fixture.data), (c) => c.charCodeAt(0)));
</script>`;
  return `<section data-section-kind="markup" aria-labelledby="${id}"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="${id}">${title}</h2></div></div>${codeBlock(snippet)}</section>`;
}

function overviewContent() {
  return `${pageIntro("Terminal UI", "Terminal-specific composition rules extracted from OpenClaw’s current Pi agent shell and Clack setup flows.")}
    ${specimenSection("terminal-overview-runtime", "Runtime proof", "Real terminal output, replayed in the browser", "The specimens are raw PTY byte streams captured from OpenClaw components with libterminal, then rendered by Ghostty WASM. HTML provides only the documentation around them.", ["agent-shell", "setup-selection"])}
    <section aria-labelledby="terminal-overview-boundary">${sectionIntro("terminal-overview-boundary", "Scope", "Reuse Carapace; add only terminal constraints")}${referenceTable(["Reuse", "Terminal UI adds"], [
      ["Colors and semantic status", "ANSI role mapping and host-theme behavior"],
      ["Typography", "Cell width, graphemes, and terminal font constraints"],
      ["Inputs, selections, approvals, loaders", "Keyboard ownership, cursor, history, and row/column limits"],
      ["Agent components", "The five-region shell and transcript composition"],
    ])}</section>
    <section aria-labelledby="terminal-overview-aliases">${sectionIntro("terminal-overview-aliases", "Tokens", "Semantic aliases", "Terminal roles reuse the existing Carapace color and typography contract. They do not create a second palette or type scale.")}${referenceTable(["Terminal role", "Carapace token"], [
      ["Background", tokenCode(terminalTokens.colors.background)],
      ["Foreground", tokenCode(terminalTokens.colors.foreground)],
      ["Muted", tokenCode(terminalTokens.colors.muted)],
      ["Active and cursor", tokenCode(terminalTokens.colors.active)],
      ["Focus", tokenCode(terminalTokens.colors.focus)],
      ["Success", tokenCode(terminalTokens.colors.success)],
      ["Warning", tokenCode(terminalTokens.colors.warning)],
      ["Error", tokenCode(terminalTokens.colors.error)],
      ["Font family", tokenCode(terminalTokens.font.family)],
    ])}</section>
    <section aria-labelledby="terminal-overview-spacing">${sectionIntro("terminal-overview-spacing", "Tokens", "Cell geometry", "These are the shared geometry values found in both audited Clack and Pi surfaces.")}${referenceTable(["Token", "Value", "Use"], [
      [tokenCode(terminalTokens.spacing.markerLabel.name), `${terminalTokens.spacing.markerLabel.value} ${terminalTokens.spacing.markerLabel.unit}`, "Gap between a marker and its label"],
      [tokenCode(terminalTokens.spacing.leadingPrefix.name), `${terminalTokens.spacing.leadingPrefix.value} ${terminalTokens.spacing.leadingPrefix.unit}`, "Guide, focus, or selection prefix before content"],
    ])}</section>
    <section aria-labelledby="terminal-overview-viewports">${sectionIntro("terminal-overview-viewports", "Tokens", "Validation profiles, not forced component widths", "Use these profiles to compare behavior across terminal sizes. Components still receive and fit the width supplied by their runtime.")}${referenceTable(["Token", "Columns", "Proof target"], [
      [tokenCode(terminalTokens.viewports.compact.name), terminalTokens.viewports.compact.value, "Narrow behavior and optional-detail removal"],
      [tokenCode(terminalTokens.viewports.standard.name), terminalTokens.viewports.standard.value, "Comfortable everyday terminal"],
      [tokenCode(terminalTokens.viewports.reference.name), terminalTokens.viewports.reference.value, "Canonical Carapace capture"],
    ])}</section>
    <section data-section-kind="guidance" aria-labelledby="terminal-overview-rendering">${sectionIntro("terminal-overview-rendering", "Rendering contract", "Capture once, replay faithfully")}${guidanceList(["Run the real Pi or Clack component inside a fixed-size PTY.", "Capture the exact output bytes with libterminal; do not transcribe glyphs or colors into HTML.", "Replay those bytes through libterminal’s Ghostty terminal in read-only mode.", "Regenerate fixtures when the audited OpenClaw runtime changes."])}</section>`;
}

function agentShellContent() {
  return `${pageIntro("Agent shell", "The retained OpenClaw TUI is one five-region conversation shell, not a collection of browser panels.")}
    ${specimenSection("terminal-shell-specimen", "Primary specimen", "Header, transcript, status, footer, composer", "The terminal runtime owns spacing, truncation, focus, and rendering.", ["agent-shell"])}
    <section aria-labelledby="terminal-shell-anatomy">${sectionIntro("terminal-shell-anatomy", "Anatomy", "Five regions in stable order")}${referenceTable(["Region", "Job"], [["Header", "Agent and session identity"], ["Transcript", "User, assistant, system, and tool output"], ["Status", "Connection and current activity"], ["Footer", "Agent, session, model, tools, and token context"], ["Composer", "Focused message input"]])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/tui.ts", "agent shell composition")}.</p></section>
    ${markupSection("terminal-shell-markup", "Replay this capture", "agent-shell")}`;
}

function composerContent() {
  return `${pageIntro("Composer", "The focused editor at the bottom of the agent shell owns text entry, cursor behavior, history, paste, and completion.")}
    ${liveSection("terminal-composer-live", "Send a message", "Type into the composer and press Enter; the turn joins the transcript and the input clears.", "composer", "Type · Enter send · R restart", { rows: 10 })}
    ${specimenSection("terminal-composer-specimen", "Primary specimen", "Active multiline input", "The specimen retains the real terminal cursor and editor wrapping.", ["agent-composer"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-composer-guidance">${sectionIntro("terminal-composer-guidance", "Guidance", "Let the terminal editor own input")}${guidanceList(["Treat visible columns, not browser pixels, as the wrapping boundary.", "Keep cursor and IME placement inside the terminal runtime.", "Do not restyle the composer as a browser text area.", "Preserve Escape and Enter precedence across completion, overlays, and submission."])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/tui.ts", "composer wiring")}.</p></section>
    ${markupSection("terminal-composer-markup", "Replay this capture", "agent-composer")}`;
}

function confirmationContent() {
  return `${pageIntro("Confirmation", "Simple setup confirmations and detailed agent approvals share decision semantics but keep their native renderer and density.")}
    ${liveSection("terminal-confirmation-live", "Vertical confirmation", "The conservative answer starts focused; arrows or Y/N move it, Enter commits.", "confirm", "↑/↓ or Y/N · Enter confirm · R restart", { rows: 8 })}
    ${specimenSection("terminal-confirmation-specimens", "Runtime proof", "Simple confirmation and detailed approval", "Setup uses Clack’s connected guide. Agent approvals appear within the Pi shell.", ["setup-confirm", "agent-approval"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-confirmation-guidance">${sectionIntro("terminal-confirmation-guidance", "Guidance", "Make the consequence and safe default explicit")}${guidanceList(["Select the conservative action first when one exists.", "Keep a simple yes/no confirmation compact; use detail only when the decision needs context.", "Name the consequence in the prompt, not only in surrounding prose.", "Preserve denied, accepted, expired, and failed outcomes in terminal history."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/clack-prompter.ts", "setup confirmation adapter")} and ${sourceLink("src/tui/tui-plugin-approvals.ts", "agent approval overlay")}.</p></section>
    ${markupSection("terminal-confirmation-markup", "Replay the approval capture", "agent-approval")}`;
}

function fieldInputContent() {
  return `${pageIntro("Field input", "Setup fields keep value, validation, masking, and navigation inside one active Clack prompt.")}
    ${liveSection("terminal-field-live", "Validated field", "Clear the port and submit to trip validation; the value stays beside its error.", "text", "Type digits · Backspace edit · Enter submit · R restart", { rows: 7 })}
    ${specimenSection("terminal-field-specimens", "Variants", "Validation and sensitive input", "These are captures of OpenClaw’s production Clack adapter, including its error and password renderers.", ["setup-field-error", "setup-field-sensitive"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-field-guidance">${sectionIntro("terminal-field-guidance", "Guidance", "Keep feedback attached to the active value")}${guidanceList(["Show validation beside the field without replacing its value.", "Mask sensitive input and omit it from submitted history and replay caches.", "Use placeholders as input guidance, not as saved values.", "Back and Next are flow controls; they do not become browser buttons."])}<p class="terminal-source-note">Source: ${sourceLink("src/wizard/clack-prompter.ts", "text and password prompts")}.</p></section>
    ${markupSection("terminal-field-markup", "Replay the field capture", "setup-field-error")}`;
}

function noticesOutputContent() {
  return `${pageIntro("Notices and output", "Setup uses titled notes for framed context and plain output for disclosures that should not look selectable.")}
    ${specimenSection("terminal-notices-specimen", "Primary specimen", "Intro, note, plain disclosure, and outro", "The connected Clack guide communicates sequence while keeping informational output distinct from choices.", ["setup-notices"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-notices-guidance">${sectionIntro("terminal-notices-guidance", "Guidance", "Inform without implying interaction")}${guidanceList(["Use a titled note for grouped human-readable context.", "Use plain output for disclosures, paths, and machine-oriented facts that should remain unframed.", "Do not render informational lists with selection markers or hover states.", "Wrap to terminal columns while preserving the guide’s visual continuity."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/prompts.ts", "note and plain contracts")} and ${sourceLink("packages/terminal-core/src/note.ts", "terminal note wrapping")}.</p></section>
    ${markupSection("terminal-notices-markup", "Replay this capture", "setup-notices")}`;
}

function promptFlowContent() {
  return `${pageIntro("Prompt flow", "A setup flow is an append-only guide with visible context, one active prompt, and navigation derived from remembered answers.")}
    ${liveSection("terminal-flow-live", "Two steps with history", "Confirm the mode, watch it collapse into history, then use ← to walk back to the remembered answer.", "flow", "↑/↓ option · Enter/→ next · ← back · R restart", { rows: 11 })}
    ${specimenSection("terminal-flow-specimen", "Primary specimen", "History, note, active prompt, Back, and Next", "The active prompt remains connected to earlier context instead of replacing the screen.", ["setup-flow"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-flow-guidance">${sectionIntro("terminal-flow-guidance", "Guidance", "Preserve sequence without replaying side effects")}${guidanceList(["Collapse completed ordinary answers into history; never retain sensitive answers.", "Show Back and Next only when their destination is valid.", "Next may reuse a remembered answer without replaying output or side effects.", "Disable backward navigation across irreversible work."])}<p class="terminal-source-note">Source: ${sourceLink("src/wizard/navigation-prompter.ts", "prompt navigation")}.</p></section>
    ${markupSection("terminal-flow-markup", "Replay this capture", "setup-flow")}`;
}

function selectionContent() {
  return `${pageIntro("Selection", "One component family covers single, multiple, searchable, and agent-overlay selection while preserving option meaning.")}
    ${liveSection("terminal-selection-live", "Single selection", "Arrow through the options, feel the focus hint move, press Enter to confirm, R to restart.", "select", "↑/↓ move focus · Enter confirm · R restart", { rows: 9 })}
    ${liveSection("terminal-selection-live-multi", "Searchable multiple selection", "Type to filter, Tab or Space to toggle, Enter to confirm.", "multiselect", "Type to filter · Tab/Space toggle · Enter confirm · R restart", { rows: 10 })}
    ${specimenSection("terminal-selection-specimens", "Runtime proof", "Single, searchable multiple, and agent picker", "The captures show defaults, recommendation copy, option subtext, selected values, filtering, and focus in the actual runtimes.", ["setup-selection", "setup-multiselect", "agent-picker"])}
    <section aria-labelledby="terminal-selection-anatomy">${sectionIntro("terminal-selection-anatomy", "Option anatomy", "Marker, label, value, annotation, and subtext")}${referenceTable(["Part", "Rule"], [["Marker", "Communicates focus or selection without color alone"], ["Label", "Human-readable identity; keep it before optional detail"], ["Stable value", "Runtime identity; it need not be shown"], ["Annotation", "Use distinct words for current, default, selected, recommended, and configured"], ["Subtext", "Explain consequences or provenance; remove before label or marker at narrow widths"]])}</section>
    <section data-section-kind="guidance" aria-labelledby="terminal-selection-defaults">${sectionIntro("terminal-selection-defaults", "Defaults", "A default is the initial selection, not a generic badge")}${guidanceList(["Place focus on the initial value when the prompt opens.", "Use recommendation copy only when the product actually recommends that choice.", "Keep option hints attached to their option; do not turn them into detached cards.", "Preserve the focused row when filtering or clipping long lists."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/clack-prompter.ts", "setup selection adapter")} and ${sourceLink("src/tui/tui-plugin-approvals.ts", "Pi selection overlay pattern")}.</p></section>
    ${markupSection("terminal-selection-markup", "Replay the selection capture", "setup-selection")}`;
}

function statusProgressContent() {
  return `${pageIntro("Status and progress", "Agent status is persistent shell context; setup progress is a transient step in the connected guide.")}
    ${liveSection("terminal-status-live", "Animated progress", "The spinner runs until the work ends; complete it, fail it, and restart it.", "progress", "C complete · F fail · R restart", { rows: 7 })}
    ${specimenSection("terminal-status-specimens", "Variants", "Persistent status and transient progress", "Both specimens retain their native terminal composition and state vocabulary.", ["agent-shell", "setup-progress"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-status-guidance">${sectionIntro("terminal-status-guidance", "Guidance", "State what is happening and how it ended")}${guidanceList(["Pair animation with a changing activity label.", "Clamp labels to terminal width without splitting graphemes.", "Stop meaningful work with a completion or failure message; clear only truly transient work.", "Reuse Carapace status semantics instead of inventing TUI-only colors."])}<p class="terminal-source-note">Sources: ${sourceLink("src/tui/tui.ts", "agent status rendering")} and ${sourceLink("src/wizard/clack-prompter.ts", "setup progress adapter")}.</p></section>
    ${markupSection("terminal-shell-markup", "Replay this capture", "agent-shell")}`;
}

function toolExecutionContent() {
  return `${pageIntro("Tool execution", "Agent tool work appears inline in the transcript with explicit chronology and bounded disclosure.")}
    ${specimenSection("terminal-tool-specimen", "Primary specimen", "Completed tool work in transcript context", "Assistant text before and after the tool row makes the execution order unambiguous.", ["agent-tool"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-tool-guidance">${sectionIntro("terminal-tool-guidance", "Guidance", "Bound output without hiding the outcome")}${guidanceList(["Keep pending, success, and error distinguishable with text or glyphs as well as color.", "Retain tool chronology in the transcript.", "Bound long output and name omitted content.", "Treat current line limits as OpenClaw facts, not Carapace tokens."])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/components/tool-execution.ts", "tool execution rendering")}.</p></section>
    ${markupSection("terminal-tool-markup", "Replay this capture", "agent-tool")}`;
}

function transcriptContent() {
  return `${pageIntro("Transcript", "User prompts, assistant responses, system notices, and tool results share one scrollback-aware conversation buffer.")}
    ${specimenSection("terminal-transcript-specimen", "Primary specimen", "User and assistant turn", "The capture preserves the real user-row surface, streaming completion, status, and surrounding shell.", ["agent-transcript"])}
    <section data-section-kind="guidance" aria-labelledby="terminal-transcript-guidance">${sectionIntro("terminal-transcript-guidance", "Guidance", "Keep content legible in one history")}${guidanceList(["Use the terminal foreground for assistant prose and a neutral inset surface for user-authored turns.", "Keep system notices muted and inline.", "Represent attachment-only turns explicitly instead of inventing message text.", "Preserve zero-output and interrupted states rather than collapsing them into blank space."])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/components/chat-log.ts", "transcript lifecycle")}.</p></section>
    ${markupSection("terminal-transcript-markup", "Replay this capture", "agent-transcript")}`;
}

const terminalContents = {
  "terminal-ui": overviewContent,
  "terminal-agent-shell": agentShellContent,
  "terminal-composer": composerContent,
  "terminal-confirmation": confirmationContent,
  "terminal-field-input": fieldInputContent,
  "terminal-notices-output": noticesOutputContent,
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
