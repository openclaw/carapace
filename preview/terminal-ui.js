import { terminalUiFixtureManifest } from "./terminal-fixtures/manifest.js";

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

function replayFigure(id) {
  const fixture = terminalUiFixtureManifest[id];
  if (!fixture) throw new Error(`Unknown terminal fixture: ${id}`);
  return `<figure class="terminal-runtime-capture">
    <figcaption><span><small>${fixture.renderer}</small><strong>${fixture.label}</strong></span><code>OpenClaw ${fixture.sourceSha.slice(0, 8)} · ${fixture.columns} × ${fixture.rows}</code></figcaption>
    <div class="terminal-replay-viewport" aria-label="${fixture.label}, terminal capture at ${fixture.columns} columns by ${fixture.rows} rows">
      <div class="terminal-replay-host" data-terminal-replay="${id}" aria-hidden="true" inert></div>
    </div>
    <p class="sr-only">${fixture.summary}</p>
    <p class="terminal-replay-error" data-terminal-replay-error hidden>The terminal renderer could not load. Reload the page to try again.</p>
  </figure>`;
}

function specimenSection(id, eyebrow, title, copy, fixtures) {
  const captures = fixtures.map(replayFigure).join("");
  return `<section aria-labelledby="${id}">${sectionIntro(id, eyebrow, title, copy)}<div class="terminal-capture-stack">${captures}</div></section>`;
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
    <section aria-labelledby="terminal-overview-rendering">${sectionIntro("terminal-overview-rendering", "Rendering contract", "Capture once, replay faithfully")}${guidanceList(["Run the real Pi or Clack component inside a fixed-size PTY.", "Capture the exact output bytes with libterminal; do not transcribe glyphs or colors into HTML.", "Replay those bytes through libterminal’s Ghostty terminal in read-only mode.", "Regenerate fixtures when the audited OpenClaw runtime changes."])}</section>`;
}

function agentShellContent() {
  return `${pageIntro("Agent shell", "The retained OpenClaw TUI is one five-region conversation shell, not a collection of browser panels.")}
    ${specimenSection("terminal-shell-specimen", "Primary specimen", "Header, transcript, status, footer, composer", "The terminal runtime owns spacing, truncation, focus, and rendering.", ["agent-shell"])}
    <section aria-labelledby="terminal-shell-anatomy">${sectionIntro("terminal-shell-anatomy", "Anatomy", "Five regions in stable order")}${referenceTable(["Region", "Job"], [["Header", "Agent and session identity"], ["Transcript", "User, assistant, system, and tool output"], ["Status", "Connection and current activity"], ["Footer", "Agent, session, model, tools, and token context"], ["Composer", "Focused message input"]])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/tui-app.ts", "agent shell composition")}.</p></section>`;
}

function composerContent() {
  return `${pageIntro("Composer", "The focused editor at the bottom of the agent shell owns text entry, cursor behavior, history, paste, and completion.")}
    ${specimenSection("terminal-composer-specimen", "Primary specimen", "Active multiline input", "The specimen retains the real terminal cursor and editor wrapping.", ["agent-composer"])}
    <section aria-labelledby="terminal-composer-guidance">${sectionIntro("terminal-composer-guidance", "Guidance", "Let the terminal editor own input")}${guidanceList(["Treat visible columns, not browser pixels, as the wrapping boundary.", "Keep cursor and IME placement inside the terminal runtime.", "Do not restyle the composer as a browser text area.", "Preserve Escape and Enter precedence across completion, overlays, and submission."])}</section>`;
}

function confirmationContent() {
  return `${pageIntro("Confirmation", "Simple setup confirmations and detailed agent approvals share decision semantics but keep their native renderer and density.")}
    ${specimenSection("terminal-confirmation-specimens", "Variants", "Simple confirmation and detailed approval", "Setup uses Clack’s connected guide. Agent approvals appear within the Pi shell.", ["setup-confirm", "agent-approval"])}
    <section aria-labelledby="terminal-confirmation-guidance">${sectionIntro("terminal-confirmation-guidance", "Guidance", "Make the consequence and safe default explicit")}${guidanceList(["Select the conservative action first when one exists.", "Keep a simple yes/no confirmation compact; use detail only when the decision needs context.", "Name the consequence in the prompt, not only in surrounding prose.", "Preserve denied, accepted, expired, and failed outcomes in terminal history."])}</section>`;
}

function fieldInputContent() {
  return `${pageIntro("Field input", "Setup fields keep value, validation, masking, and navigation inside one active Clack prompt.")}
    ${specimenSection("terminal-field-specimens", "Variants", "Validation and sensitive input", "These are captures of OpenClaw’s production Clack adapter, including its error and password renderers.", ["setup-field-error", "setup-field-sensitive"])}
    <section aria-labelledby="terminal-field-guidance">${sectionIntro("terminal-field-guidance", "Guidance", "Keep feedback attached to the active value")}${guidanceList(["Show validation beside the field without replacing its value.", "Mask sensitive input and omit it from submitted history and replay caches.", "Use placeholders as input guidance, not as saved values.", "Back and Next are flow controls; they do not become browser buttons."])}<p class="terminal-source-note">Source: ${sourceLink("src/wizard/clack-prompter.ts", "text and password prompts")}.</p></section>`;
}

function noticesOutputContent() {
  return `${pageIntro("Notices and output", "Setup uses titled notes for framed context and plain output for disclosures that should not look selectable.")}
    ${specimenSection("terminal-notices-specimen", "Primary specimen", "Intro, note, plain disclosure, and outro", "The connected Clack guide communicates sequence while keeping informational output distinct from choices.", ["setup-notices"])}
    <section aria-labelledby="terminal-notices-guidance">${sectionIntro("terminal-notices-guidance", "Guidance", "Inform without implying interaction")}${guidanceList(["Use a titled note for grouped human-readable context.", "Use plain output for disclosures, paths, and machine-oriented facts that should remain unframed.", "Do not render informational lists with selection markers or hover states.", "Wrap to terminal columns while preserving the guide’s visual continuity."])}<p class="terminal-source-note">Sources: ${sourceLink("src/wizard/prompts.ts", "note and plain contracts")} and ${sourceLink("packages/terminal-core/src/note.ts", "terminal note wrapping")}.</p></section>`;
}

function promptFlowContent() {
  return `${pageIntro("Prompt flow", "A setup flow is an append-only guide with visible context, one active prompt, and navigation derived from remembered answers.")}
    ${specimenSection("terminal-flow-specimen", "Primary specimen", "History, note, active prompt, Back, and Next", "The active prompt remains connected to earlier context instead of replacing the screen.", ["setup-flow"])}
    <section aria-labelledby="terminal-flow-guidance">${sectionIntro("terminal-flow-guidance", "Guidance", "Preserve sequence without replaying side effects")}${guidanceList(["Collapse completed ordinary answers into history; never retain sensitive answers.", "Show Back and Next only when their destination is valid.", "Next may reuse a remembered answer without replaying output or side effects.", "Disable backward navigation across irreversible work."])}</section>`;
}

function selectionContent() {
  return `${pageIntro("Selection", "One component family covers single, multiple, searchable, and agent-overlay selection while preserving option meaning.")}
    ${specimenSection("terminal-selection-specimens", "Variants", "Single, searchable multiple, and agent picker", "The captures show defaults, recommendation copy, option subtext, selected values, filtering, and focus in the actual runtimes.", ["setup-selection", "setup-multiselect", "agent-picker"])}
    <section aria-labelledby="terminal-selection-anatomy">${sectionIntro("terminal-selection-anatomy", "Option anatomy", "Marker, label, value, annotation, and subtext")}${referenceTable(["Part", "Rule"], [["Marker", "Communicates focus or selection without color alone"], ["Label", "Human-readable identity; keep it before optional detail"], ["Stable value", "Runtime identity; it need not be shown"], ["Annotation", "Use distinct words for current, default, selected, recommended, and configured"], ["Subtext", "Explain consequences or provenance; remove before label or marker at narrow widths"]])}</section>
    <section aria-labelledby="terminal-selection-defaults">${sectionIntro("terminal-selection-defaults", "Defaults", "A default is the initial selection, not a generic badge")}${guidanceList(["Place focus on the initial value when the prompt opens.", "Use recommendation copy only when the product actually recommends that choice.", "Keep option hints attached to their option; do not turn them into detached cards.", "Preserve the focused row when filtering or clipping long lists."])}</section>`;
}

function statusProgressContent() {
  return `${pageIntro("Status and progress", "Agent status is persistent shell context; setup progress is a transient step in the connected guide.")}
    ${specimenSection("terminal-status-specimens", "Variants", "Persistent status and transient progress", "Both specimens retain their native terminal composition and state vocabulary.", ["agent-shell", "setup-progress"])}
    <section aria-labelledby="terminal-status-guidance">${sectionIntro("terminal-status-guidance", "Guidance", "State what is happening and how it ended")}${guidanceList(["Pair animation with a changing activity label.", "Clamp labels to terminal width without splitting graphemes.", "Stop meaningful work with a completion or failure message; clear only truly transient work.", "Reuse Carapace status semantics instead of inventing TUI-only colors."])}</section>`;
}

function toolExecutionContent() {
  return `${pageIntro("Tool execution", "Agent tool work appears inline in the transcript with explicit chronology and bounded disclosure.")}
    ${specimenSection("terminal-tool-specimen", "Primary specimen", "Completed tool work in transcript context", "Assistant text before and after the tool row makes the execution order unambiguous.", ["agent-tool"])}
    <section aria-labelledby="terminal-tool-guidance">${sectionIntro("terminal-tool-guidance", "Guidance", "Bound output without hiding the outcome")}${guidanceList(["Keep pending, success, and error distinguishable with text or glyphs as well as color.", "Retain tool chronology in the transcript.", "Bound long output and name omitted content.", "Treat current line limits as OpenClaw facts, not Carapace tokens."])}<p class="terminal-source-note">Source: ${sourceLink("src/tui/components/tool-execution.ts", "tool execution rendering")}.</p></section>`;
}

function transcriptContent() {
  return `${pageIntro("Transcript", "User prompts, assistant responses, system notices, and tool results share one scrollback-aware conversation buffer.")}
    ${specimenSection("terminal-transcript-specimen", "Primary specimen", "User and assistant turn", "The capture preserves the real user-row surface, streaming completion, status, and surrounding shell.", ["agent-transcript"])}
    <section aria-labelledby="terminal-transcript-guidance">${sectionIntro("terminal-transcript-guidance", "Guidance", "Keep content legible in one history")}${guidanceList(["Use the terminal foreground for assistant prose and a neutral inset surface for user-authored turns.", "Keep system notices muted and inline.", "Represent attachment-only turns explicitly instead of inventing message text.", "Preserve zero-output and interrupted states rather than collapsing them into blank space."])}</section>`;
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
