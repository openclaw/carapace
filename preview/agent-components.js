import {
  agentAvatarMarkup,
  attributedMessageMarkup,
  collaborationTranscriptMarkup,
} from "./agent-identity.js";

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function codeBlock(code) {
  return `<div class="code-block"><div class="code-block-header"><span>HTML</span><button type="button" data-copy-code>Copy</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function guidanceList(items) {
  return `<ul class="guidance-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

const agentLucideNames = {
  "arrow-up": "arrow-up",
  "arrow-right": "arrow-right",
  check: "check",
  chevron: "chevron-down",
  "chevron-right": "chevron-right",
  "chevron-up": "chevron-up",
  "chevrons-down": "chevrons-down",
  close: "x",
  copy: "copy",
  file: "file-text",
  "file-code": "file-code",
  image: "image",
  mode: "mouse-pointer-2",
  model: "box",
  paperclip: "paperclip",
  plus: "plus",
  question: "circle-help",
  search: "search",
  sparkle: "sparkles",
  spinner: "loader-circle",
  stop: "square",
  terminal: "terminal",
  write: "pen-line",
};

export function agentIcon(name) {
  const lucideName = agentLucideNames[name] || name;
  return `<i class="oc-agent-icon" data-lucide="${lucideName}" aria-hidden="true"></i>`;
}

function renderAgentComponent(component) {
  return `<header class="reference-intro"><p class="eyebrow">Agent component</p><h1>${component.title}</h1><p>${component.lede}</p></header>
    <section data-section-kind="preview" aria-labelledby="${component.slug}-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="${component.slug}-preview">${component.previewTitle}</h2></div><span class="oc-pill">.${component.className}</span></div><div class="specimen-frame agent-specimen">${component.preview}</div></section>
    <section data-section-kind="markup" aria-labelledby="${component.slug}-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="${component.slug}-markup">Canonical structure</h2></div></div>${codeBlock(component.markup)}</section>
    <section data-section-kind="guidance" aria-labelledby="${component.slug}-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="${component.slug}-guidance">Behavior and ownership</h2></div></div>${guidanceList(component.guidance)}</section>`;
}

const chevronMarkup = `<span class="oc-agent-tool-row-chevron" aria-hidden="true">${agentIcon("chevron-right")}</span>`;

function toolRow({ icon = "", label, detail = "", meta = "", panel = "", open = true } = {}) {
  const iconMarkup = icon ? `<span class="oc-agent-tool-row-icon" aria-hidden="true">${icon}</span>` : "";
  const detailMarkup = detail ? `<span class="oc-agent-tool-row-detail">${detail}</span>` : "";
  const metaMarkup = meta ? `<span class="oc-agent-tool-row-meta">${meta}</span>` : "";
  if (!panel) {
    return `<div class="oc-agent-tool-row">${iconMarkup}<span class="oc-agent-tool-row-label">${label}</span>${detailMarkup}${metaMarkup}</div>`;
  }
  return `<details class="oc-agent-tool-row"${open ? " open" : ""}><summary class="oc-agent-tool-row-summary">${iconMarkup}<span class="oc-agent-tool-row-label">${label}</span>${detailMarkup}${metaMarkup}${chevronMarkup}</summary><div class="oc-agent-tool-row-panel">${panel}</div></details>`;
}

function sendButton(state = "idle") {
  if (state === "stop") {
    return `<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button>`;
  }
  const disabled = state === "idle" ? "" : "";
  return `<button class="oc-agent-send-button" type="submit" data-state="${state}" aria-label="Send message"${disabled}>${agentIcon("arrow-up")}</button>`;
}

function collaborationAvatar(name) {
  return agentAvatarMarkup(name);
}

function composerMarkup({ id, rows = 1, tools = "", suggestions = "", attachments = "", statusAttr = "data-agent-compose-status", formAttr = "data-agent-compose-form", send = sendButton("idle") } = {}) {
  return `<form class="oc-agent-input-bar" ${formAttr}>
  <div class="oc-agent-input-container">
    ${attachments}<label class="sr-only" for="${id}">Message</label>
    <textarea id="${id}" class="oc-agent-input" rows="${rows}" placeholder="Send a message..."></textarea>
    <div class="oc-agent-input-toolbar">
      <div class="oc-agent-input-tools"><button class="oc-agent-attachment-button" type="button" aria-label="Attach">${agentIcon("plus")}</button>${tools}</div>
      <div class="oc-agent-input-actions">${send}</div>
    </div>
  </div>
  ${suggestions}<span class="sr-only" ${statusAttr} aria-live="polite"></span>
</form>`;
}

const components = {
  "interactive-tool": {
    slug: "interactive-tool",
    title: "Interactive Tool",
    className: "oc-agent-interactive-tool",
    lede: "A shared activity surface for terminal output, live previews, and generated artifacts with compact status rows and optional inspectable panels.",
    previewTitle: "Terminal, preview, and artifact results",
    preview: `<div class="oc-agent-tool-row-list">
  ${toolRow({
    icon: agentIcon("terminal"),
    label: "Ran command",
    detail: "bun run check",
    meta: "312 ms",
    panel: `<div class="oc-agent-tool-card oc-agent-interactive-tool oc-agent-bash-tool" data-variant="terminal" data-status="complete"><div class="oc-agent-tool-card-body oc-agent-bash-terminal"><div class="oc-agent-bash-command"><span aria-hidden="true">$ </span><code>bun run check</code></div><pre class="oc-agent-bash-output" role="region" aria-label="Command output" tabindex="0"><code>29 pass · 0 fail\nFinished in 312ms</code></pre></div></div>`,
  })}
  ${toolRow({
    icon: agentIcon("globe"),
    label: "Preview ready",
    detail: "127.0.0.1:4173",
    panel: `<div class="oc-agent-tool-card oc-agent-interactive-tool" data-variant="browser"><header class="oc-agent-interactive-header"><span>${agentIcon("globe")} Preview</span><code>127.0.0.1:4173</code><button type="button" aria-label="Open preview">${agentIcon("external-link")}</button></header><div class="oc-agent-interactive-preview" role="img" aria-label="Compact application preview"><span class="oc-agent-interactive-preview-sidebar"></span><span class="oc-agent-interactive-preview-content"><i></i><i></i><i></i></span></div></div>`,
    open: false,
  })}
  ${toolRow({
    icon: agentIcon("image"),
    label: "Artifact ready",
    detail: "application-surface.png",
    panel: `<div class="oc-agent-tool-card oc-agent-interactive-tool" data-variant="artifact"><header class="oc-agent-interactive-header"><span>${agentIcon("image")} Generated artifact</span><span>PNG</span><button type="button" aria-label="Download artifact">${agentIcon("download")}</button></header></div>`,
    open: false,
  })}
</div>`,
    markup: `<details class="oc-agent-tool-row" open>
  <summary class="oc-agent-tool-row-summary">Tool status and summary</summary>
  <div class="oc-agent-tool-row-panel">
    <div class="oc-agent-tool-card oc-agent-interactive-tool" data-variant="terminal|browser|artifact">…</div>
  </div>
</details>`,
    guidance: ["Use one compact activity row regardless of the underlying tool type.", "Open a panel only when the result benefits from inspection, interaction, copying, or download.", "Keep execution, sandboxing, iframe permissions, media lifecycle, and destructive-action approval consumer-owned."],
  },
  "generic-tool": {
    slug: "generic-tool",
    title: "Generic Tool",
    className: "oc-agent-tool-row",
    lede: "The shared minimal tool row: an optional icon, the tool name, and a muted detail in one quiet line.",
    previewTitle: "Tool invocation row",
    preview: `<div class="oc-agent-tool-row-list">
  ${toolRow({ icon: agentIcon("file"), label: "Read file", detail: "styles/components.css" })}
  ${toolRow({ icon: agentIcon("search"), label: "Grep", detail: "semantic tokens" })}
  ${toolRow({ icon: agentIcon("terminal"), label: '<span class="oc-agent-text-shimmer">Running command</span>', detail: "bun run check" })}
</div>`,
    markup: `<div class="oc-agent-tool-row">
  <span class="oc-agent-tool-row-icon" aria-hidden="true">…</span>
  <span class="oc-agent-tool-row-label">Read file</span>
  <span class="oc-agent-tool-row-detail">styles/components.css</span>
</div>`,
    guidance: ["Keep the row to one line: icon, name, then truncated detail.", "Swap the label for a text shimmer while the call is pending.", "The consumer owns approval, cancellation, execution, streaming, and error handling."],
  },
  approval: {
    slug: "approval",
    title: "Approval",
    className: "oc-approval-card",
    lede: "A decision card for agent permission requests: command preview, risk framing, and explicit allow or deny actions, with additional requests queued below.",
    previewTitle: "Pending approval with a queue",
    preview: `<div class="oc-approval-queue" style="max-width: 34rem;">
  <article class="oc-approval-card" data-state="pending">
    <header class="oc-approval-header">${agentIcon("shield-check")}<h3 class="oc-approval-title">Run command</h3><time>now</time></header>
    <p class="oc-approval-sub">Personal agent · session Carapace parity</p>
    <code class="oc-approval-command">git push origin feat/app-surface-parity</code>
    <dl class="oc-approval-meta">
      <dt>Host</dt><dd>vincent-mbp.local</dd>
      <dt>Directory</dt><dd>~/Projects/carapace</dd>
    </dl>
    <div class="oc-approval-warning">${agentIcon("triangle-alert")}<span>Pushes to a shared remote branch.</span></div>
    <div class="oc-approval-actions">
      <button class="oc-action oc-action-ghost" type="button">Deny</button>
      <button class="oc-action oc-action-secondary" type="button">Allow always</button>
      <button class="oc-action oc-action-primary" type="button">Allow once</button>
    </div>
    <p class="oc-approval-resolution">${agentIcon("check")}<span>Approved by Vincent · applies to this session</span></p>
  </article>
  <div class="oc-approval-queue-header"><span>2 more waiting</span><button class="oc-action oc-action-ghost" type="button">Review all</button></div>
  <div class="oc-approval-queue-item">${agentIcon("terminal")}<code>bun run check</code><time>12s</time></div>
  <div class="oc-approval-queue-item">${agentIcon("globe")}<code>fetch https://docs.openclaw.ai/tools</code><time>31s</time></div>
</div>`,
    markup: `<article class="oc-approval-card" data-state="pending">
  <header class="oc-approval-header">…<h3 class="oc-approval-title">Run command</h3><time>now</time></header>
  <p class="oc-approval-sub">Personal agent · session Carapace parity</p>
  <code class="oc-approval-command">git push origin feat/app-surface-parity</code>
  <div class="oc-approval-warning">…<span>Pushes to a shared remote branch.</span></div>
  <div class="oc-approval-actions">
    <button class="oc-action oc-action-ghost" type="button">Deny</button>
    <button class="oc-action oc-action-primary" type="button">Allow once</button>
  </div>
</article>`,
    guidance: ["State exactly what will run; never summarize the command away.", "Keep deny reachable without scrolling and visually quieter than allow.", "Resolved cards keep the command visible as the transcript record.", "Queue further requests below the active decision instead of stacking modals.", "The consumer owns approval policy, scope persistence, and transport."],
  },
  "error-message": {
    slug: "error-message",
    title: "Error Message",
    className: "oc-agent-error-message",
    lede: "A left-aligned error surface with a plain title and muted explanation, rendered inline in the transcript.",
    previewTitle: "Failed response",
    preview: `<div class="oc-agent-error-message" role="alert">
  <strong>Something went wrong</strong>
  <p>The response could not be completed. Your draft is still available.</p>
</div>`,
    markup: `<div class="oc-agent-error-message" role="alert">
  <strong>Something went wrong</strong>
  <p>The response could not be completed.</p>
</div>`,
    guidance: ["State the failure in plain language with a short title and muted message.", "Use an alert only when the error appears after an attempted action.", "The consumer owns error mapping, retry logic, logging, and recovery actions."],
  },
  "edit-tool": {
    slug: "edit-tool",
    title: "Edit Tool",
    className: "oc-agent-edit-tool",
    lede: "A diff card that names the edited file in its header, shows addition and removal counts, and renders the change below.",
    previewTitle: "File edit result",
    preview: `<div class="oc-agent-tool-card oc-agent-edit-tool" data-status="complete">
  <header class="oc-agent-tool-card-header"><span class="oc-agent-tool-card-icon" aria-hidden="true">${agentIcon("file-code")}</span><span class="oc-agent-tool-card-title">Edited components.css</span><span class="oc-agent-diff-stats"><span class="oc-agent-diff-add">+3</span> <span class="oc-agent-diff-remove">−1</span></span></header>
  <div class="oc-agent-tool-card-body oc-agent-diff" role="region" aria-label="Changes to styles/components.css" tabindex="0"><div class="oc-agent-diff-line"><span>108</span><span aria-hidden="true"> </span><code>.oc-agent-tool {</code></div><div class="oc-agent-diff-line" data-kind="removed"><span>109</span><span aria-hidden="true">−</span><code>  min-height: 3rem;</code></div><div class="oc-agent-diff-line" data-kind="added"><span>109</span><span aria-hidden="true">+</span><code>  min-height: 2.25rem;</code></div><div class="oc-agent-diff-line" data-kind="added"><span>110</span><span aria-hidden="true">+</span><code>  font-size: var(--oc-font-size-sm);</code></div><div class="oc-agent-diff-line" data-kind="added"><span>111</span><span aria-hidden="true">+</span><code>  border-radius: var(--oc-radius-control);</code></div><div class="oc-agent-diff-line"><span>112</span><span aria-hidden="true"> </span><code>}</code></div></div>
</div>`,
    markup: `<div class="oc-agent-tool-card oc-agent-edit-tool" data-status="complete">
  <header class="oc-agent-tool-card-header">
    <span class="oc-agent-tool-card-icon" aria-hidden="true">…</span>
    <span class="oc-agent-tool-card-title">Edited components.css</span>
    <span class="oc-agent-diff-stats"><span class="oc-agent-diff-add">+3</span> <span class="oc-agent-diff-remove">−1</span></span>
  </header>
  <div class="oc-agent-tool-card-body oc-agent-diff" role="region" aria-label="Changes to styles/components.css" tabindex="0">…</div>
</div>`,
    guidance: ["Always identify the affected file in the header.", "Pair addition and removal counts with the rendered diff.", "The consumer owns approval, patch application, conflict handling, and rollback."],
  },
  "file-attachment": {
    slug: "file-attachment",
    title: "File Attachment",
    className: "oc-agent-file-attachment",
    lede: "A compact staged-file chip with a type icon, filename, size, and a floating remove control.",
    previewTitle: "Attached file chips",
    preview: `<ul class="oc-agent-attachment-list" aria-label="Attached files">
  <li class="oc-agent-file-attachment" data-kind="file" data-agent-attachment><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-file-details"><strong>component-spec.md</strong><span>3.1 KB</span></span><button class="oc-agent-file-remove" type="button" aria-label="Remove component-spec.md" data-agent-attachment-remove>${agentIcon("close")}</button></li>
  <li class="oc-agent-file-attachment" data-kind="image" data-agent-attachment><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("image")}</span><span class="oc-agent-file-details"><strong>interface.png</strong><span>842 KB</span></span><button class="oc-agent-file-remove" type="button" aria-label="Remove interface.png" data-agent-attachment-remove>${agentIcon("close")}</button></li>
  <li class="oc-agent-file-attachment" data-display="image-only" data-kind="image" data-agent-attachment><span class="oc-agent-file-preview" role="img" aria-label="mobile-reference.png">${agentIcon("image")}</span><button class="oc-agent-file-remove" type="button" aria-label="Remove mobile-reference.png" data-agent-attachment-remove>${agentIcon("close")}</button></li>
</ul>`,
    markup: `<li class="oc-agent-file-attachment" data-kind="file">
  <span class="oc-agent-file-type" aria-hidden="true">…</span>
  <span class="oc-agent-file-details"><strong>component-spec.md</strong><span>3.1 KB</span></span>
  <button class="oc-agent-file-remove" type="button" aria-label="Remove component-spec.md">…</button>
</li>`,
    guidance: ["Keep the full filename available and truncate without hiding the extension.", "Render image attachments as thumbnails with data-display=\"image-only\" when a preview exists.", "Give every remove action a filename-specific accessible name; the consumer owns upload and cleanup."],
  },
  "agent-chat": {
    slug: "agent-chat",
    title: "Agent Chat",
    className: "oc-agent-chat",
    lede: "The complete conversation surface: a scrollable message list above a composer, sharing one bounded column.",
    previewTitle: "Conversation workspace",
    preview: `<section class="oc-agent-chat" data-layout="compact" data-attribution="participants" data-user-name="Mina" aria-label="Agent conversation">
  <div class="oc-agent-message-list" role="log" aria-label="Conversation history">
    <div class="oc-agent-message-list-content">
      ${attributedMessageMarkup({ author: "user", name: "Mina", role: "You", message: "Summarize the pending changes and flag anything risky." })}
      ${attributedMessageMarkup({
        name: "OpenClaw",
        role: "Assistant",
        content: `<div class="oc-agent-assistant-turn">
        ${toolRow({ icon: agentIcon("search"), label: "Found 3 results", detail: "semantic tokens" })}
        <div class="oc-agent-markdown"><p>Three component files changed. The exported package contract and every existing token remain intact.</p></div>
      </div>`,
      })}
    </div>
  </div>
  <div class="oc-agent-chat-suggestions" aria-label="Suggested prompts"><button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Review the pending changes" data-agent-suggestion-target="agent-chat-message">Review changes</button><button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Run the validation checks" data-agent-suggestion-target="agent-chat-message">Run checks</button></div>
  ${composerMarkup({
    id: "agent-chat-message",
    formAttr: "data-agent-chat-form",
    statusAttr: "data-agent-chat-status",
    tools: `<button class="oc-agent-attachment-button" type="button" aria-label="Capture screenshot">${agentIcon("camera")}</button><button class="oc-agent-attachment-button" type="button" aria-label="Dictate">${agentIcon("mic")}</button><button class="oc-agent-attachment-button" type="button" aria-label="Talk mode">${agentIcon("audio-lines")}</button>`,
  })}
</section>`,
    markup: `<section class="oc-agent-chat" data-layout="compact" data-attribution="participants" aria-label="Agent conversation">
  <div class="oc-agent-message-list" role="log" aria-label="Conversation history">…</div>
  <div class="oc-agent-chat-suggestions">…</div>
  <form class="oc-agent-input-bar">…</form>
  <span class="sr-only" aria-live="polite">Message sent</span>
</section>`,
    guidance: ["Use data-layout=\"compact\" in reference and embedded surfaces; use data-layout=\"viewport\" only when the chat owns a full application pane.", "Keep each 20px avatar beside its author and message content instead of in a detached transcript rail.", "Expose streamed updates through a polite live region without repeatedly announcing the entire transcript.", "The consumer owns message data, submission, stopping, attachments, media capture, and tool execution."],
  },
  "agent-collaboration": {
    slug: "agent-collaboration",
    title: "Agent Collaboration",
    className: "oc-agent-collaboration",
    lede: "A transcript-native multi-agent surface that keeps the active facepile, shared objective, named specialists, and their contributions in one compact conversational flow.",
    previewTitle: "Agents thinking and collaborating",
    preview: collaborationTranscriptMarkup(),
    markup: `<section class="oc-agent-collaboration" data-variant="transcript" data-state="thinking" aria-label="Multi-agent collaboration">
  <header class="oc-agent-collaboration-presence" role="status">
    <span class="oc-avatar-stack oc-agent-collaboration-facepile" data-state="thinking" aria-hidden="true">…</span>
    <strong>Agents thinking</strong><span aria-hidden="true">·</span><time aria-hidden="true">5s</time>
  </header>
  <p class="oc-agent-collaboration-summary">Collaborating with the team on application parity</p>
  <div class="oc-agent-collaboration-stream" role="list">
    <article class="oc-agent-attributed-message" data-author="agent">…</article>
  </div>
</section>`,
    guidance: ["Name every participant and mark exactly one coordinating leader.", "Keep the active facepile, shared objective, and named contributions in the transcript instead of a second task dashboard.", "Keep author identity compact with a 20px avatar bubble beside its message.", "Do not announce the elapsed timer every second; the visible status text carries the accessible state.", "Animate only active avatars with transform and opacity, honor reduced motion, and let the consumer own orchestration, permissions, cancellation, and result acceptance."],
  },
  "attachment-button": {
    slug: "attachment-button",
    title: "Attachment Button",
    className: "oc-agent-attachment-button",
    lede: "A round ghost composer action that opens file selection without competing with the send action.",
    previewTitle: "Add supporting files",
    preview: `<div class="oc-agent-button-row"><button class="oc-agent-attachment-button" type="button" aria-label="Attach">${agentIcon("plus")}</button><button class="oc-agent-attachment-button" type="button" aria-label="Attach">${agentIcon("paperclip")}</button><button class="oc-agent-attachment-button" type="button" aria-label="Attach" disabled>${agentIcon("plus")}</button></div>`,
    markup: `<button class="oc-agent-attachment-button" type="button" aria-label="Attach">
  <svg aria-hidden="true">…</svg>
</button>`,
    guidance: ["Give the icon-only action an explicit accessible name.", "Default to the plus glyph; use the paperclip for a literal attach affordance.", "The consumer owns file selection, accepted types, size limits, upload, and error handling."],
  },
  "message-list": {
    slug: "message-list",
    title: "Message List",
    className: "oc-agent-message-list",
    lede: "A readable transcript that groups each user prompt with the assistant work that answers it, without avatars or role labels.",
    previewTitle: "Ordered conversation history",
    preview: `<div class="oc-agent-message-list" role="log" aria-label="Conversation history">
  <div class="oc-agent-message-list-content">
    <div class="oc-agent-turn">
      <div class="oc-agent-user-message-stack"><div class="oc-agent-user-message"><p>Which files changed, and is the package contract still intact?</p></div><span class="oc-agent-message-meta">2:14 PM</span></div>
      <div class="oc-agent-assistant-turn">
        ${toolRow({ icon: agentIcon("file"), label: "Read file", detail: "styles/components.css" })}
        <div class="oc-agent-markdown"><p>Three component files changed. The exported package contract and every existing token remain intact.</p></div>
        <div class="oc-agent-message-toolbar"><button class="oc-agent-copy-button" type="button" aria-label="Copy response" data-copy-text="Three component files changed. The exported package contract and every existing token remain intact.">${agentIcon("copy")}</button></div>
      </div>
    </div>
    <div class="oc-agent-turn">
      <div class="oc-agent-user-message-stack"><div class="oc-agent-user-message"><p>Run the validation checks.</p></div></div>
      <div class="oc-agent-tool-row oc-agent-planning"><span class="oc-agent-spinner" aria-hidden="true">${agentIcon("spinner")}</span><span class="oc-agent-text-shimmer">Processing...</span></div>
    </div>
  </div>
</div>`,
    markup: `<div class="oc-agent-message-list" role="log" aria-label="Conversation history">
  <div class="oc-agent-message-list-content">
    <div class="oc-agent-turn">
      <div class="oc-agent-user-message-stack">…</div>
      <div class="oc-agent-assistant-turn">…</div>
    </div>
  </div>
</div>`,
    guidance: ["Render turns in chronological document order: user prompt, then assistant parts.", "Show the planning row with a spiral loader and shimmer while the next reply has no content.", "Preserve the user's reading position when older messages are prepended."],
  },
  "mcp-tool": {
    slug: "mcp-tool",
    title: "MCP Tool",
    className: "oc-agent-mcp-tool",
    lede: "A protocol tool row that names the capability in verb form, previews its arguments, and expands into the returned payload.",
    previewTitle: "Connected capability call",
    preview: `<div class="oc-agent-mcp-tool">${toolRow({
      label: "Listed resources",
      detail: "server: workspace",
      panel: `<div class="oc-agent-tool-card"><pre class="oc-agent-code-block" role="region" aria-label="MCP tool result" tabindex="0"><code>{
  "resources": [
    { "name": "Design tokens", "uri": "design-system://tokens" },
    { "name": "Components", "uri": "design-system://components" }
  ]
}</code></pre></div>`,
    })}</div>`,
    markup: `<details class="oc-agent-tool-row" open>
  <summary class="oc-agent-tool-row-summary"><span class="oc-agent-tool-row-label">Listed resources</span><span class="oc-agent-tool-row-detail">server: workspace</span><span class="oc-agent-tool-row-chevron" aria-hidden="true">…</span></summary>
  <div class="oc-agent-tool-row-panel"><div class="oc-agent-tool-card"><pre class="oc-agent-code-block" role="region" aria-label="MCP tool result" tabindex="0"><code>…</code></pre></div></div>
</details>`,
    guidance: ["Use active verbs while running and completed verbs when done (Listing → Listed).", "Preview the most relevant arguments as the muted row detail.", "The consumer owns discovery, consent, credentials, invocation, and trust boundaries."],
  },
  "input-bar": {
    slug: "input-bar",
    title: "Composer",
    className: "oc-agent-input-bar",
    lede: "A message composer with staged attachments, an auto-growing field, and a toolbar of quiet actions around one send button.",
    previewTitle: "Compose and submit",
    preview: composerMarkup({
      id: "input-bar-message",
      rows: 2,
      tools: `<details class="oc-agent-mode-selector" data-agent-mode-selector>
        <summary aria-label="Select mode">${agentIcon("mode")}<span data-agent-mode-label>Agent</span>${agentIcon("chevron")}</summary>
        <fieldset class="oc-agent-mode-menu"><legend class="sr-only">Execution mode</legend><label class="oc-agent-mode-option"><input class="sr-only" type="radio" name="input-bar-mode" value="Agent" checked><span class="oc-agent-mode-option-copy"><strong>Agent</strong><small>Complete tasks directly</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label><label class="oc-agent-mode-option"><input class="sr-only" type="radio" name="input-bar-mode" value="Plan"><span class="oc-agent-mode-option-copy"><strong>Plan</strong><small>Plan before making changes</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label></fieldset>
      </details><span class="oc-agent-model-badge"><strong>Extra High</strong><span>5.6 Sol</span></span>`,
    }),
    markup: `<form class="oc-agent-input-bar">
  <div class="oc-agent-input-container">
    <label class="sr-only" for="message">Message</label>
    <textarea id="message" class="oc-agent-input" rows="1" placeholder="Send a message..."></textarea>
    <div class="oc-agent-input-toolbar">
      <div class="oc-agent-input-tools"><button class="oc-agent-attachment-button" type="button" aria-label="Attach">…</button></div>
      <div class="oc-agent-input-actions"><button class="oc-agent-send-button" type="submit" data-state="idle" aria-label="Send message">…</button></div>
    </div>
  </div>
</form>`,
    guidance: ["Keep one visible message field and one current primary action.", "Change the send action to stop while a response is streaming or submitted.", "The consumer owns submission, draft persistence, attachment processing, and keyboard shortcuts."],
  },
  markdown: {
    slug: "markdown",
    title: "Markdown",
    className: "oc-agent-markdown",
    lede: "Readable rich text for agent responses, with deliberate rhythm for prose, lists, links, quotes, and code.",
    previewTitle: "Structured response content",
    preview: `<article class="oc-agent-markdown">
  <h3>Validation complete</h3>
  <p>The component contract is ready for review. Inspect the <a class="oc-link" href="../../foundations/tokens/" data-workbench-inert-link>token reference</a> before adoption.</p>
  <ul><li>Keyboard behavior is preserved.</li><li>Colors resolve from <code>--oc-*</code> semantic tokens.</li></ul>
  <blockquote><p>Review the rendered state in both themes before adoption.</p></blockquote>
  <div class="oc-agent-markdown-table" tabindex="0" role="region" aria-label="Validation results"><table><thead><tr><th scope="col">Check</th><th scope="col">Result</th></tr></thead><tbody><tr><td>CSS contract</td><td>Passed</td></tr><tr><td>Preview build</td><td>Passed</td></tr></tbody></table></div>
  <pre><code>bun run check</code></pre>
</article>`,
    markup: `<article class="oc-agent-markdown">
  <h3>Validation complete</h3>
  <p>The component contract is ready for review. Inspect the <a class="oc-link" href="../../foundations/tokens/">token reference</a>.</p>
  <ul><li>Keyboard behavior is preserved.</li></ul>
  <blockquote><p>Review the rendered state before adoption.</p></blockquote>
  <div class="oc-agent-markdown-table" tabindex="0"><table>…</table></div>
  <pre><code>bun run check</code></pre>
</article>`,
    guidance: ["Sanitize generated HTML before rendering it into the document.", "Preserve a clear heading hierarchy relative to the surrounding transcript.", "Keep links, code, tables, and quoted content keyboard accessible and horizontally contained."],
  },
  "suggestions": {
    slug: "suggestions",
    title: "Suggestions",
    className: "oc-agent-suggestions",
    lede: "Short prompt starters rendered as quiet chips below the composer, inserting their value into the field on selection.",
    previewTitle: "Useful next prompts",
    preview: `<div class="oc-agent-suggestion-demo">
  ${composerMarkup({ id: "suggestion-demo-input", rows: 1 })}
  <div class="oc-agent-suggestions" aria-label="Suggested prompts">
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Draft a concise release note" data-agent-suggestion-target="suggestion-demo-input">${agentIcon("write")}<span>Write</span></button>
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Explain this component contract" data-agent-suggestion-target="suggestion-demo-input">${agentIcon("search")}<span>Learn</span></button>
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Review the current implementation" data-agent-suggestion-target="suggestion-demo-input">${agentIcon("file-code")}<span>Code</span></button>
  </div>
</div>`,
    markup: `<div class="oc-agent-suggestions" aria-label="Suggested prompts">
  <button class="oc-agent-suggestion" type="button">Summarize changes</button>
  <button class="oc-agent-suggestion" type="button">Run validation</button>
</div>`,
    guidance: ["Offer a small set of specific, context-aware prompts.", "Insert the complete visible suggestion into the field when selected.", "Disable suggestions while they would conflict with an active submission."],
  },
  "model-picker": {
    slug: "model-picker",
    title: "Model Picker",
    className: "oc-agent-model-picker",
    lede: "A quiet text trigger that shows the current model and version, opening a menu of options with a check on the active one.",
    previewTitle: "Choose the execution model",
    preview: `<div class="oc-agent-model-demo">
  <details class="oc-agent-model-picker" data-agent-model-picker>
    <summary aria-label="Select model"><strong data-agent-model-name>Extra High</strong><span data-agent-model-version>5.6 Sol</span>${agentIcon("chevron")}</summary>
    <fieldset class="oc-agent-model-menu"><legend class="sr-only">Model</legend>
      <label class="oc-agent-model-option"><input class="sr-only" type="radio" name="model" value="GPT-5.6 Fast" data-agent-model-option-version="5.6"><span class="oc-agent-model-option-copy">GPT-5.6 Fast <small>5.6</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label>
      <label class="oc-agent-model-option"><input class="sr-only" type="radio" name="model" value="Extra High" data-agent-model-option-version="5.6 Sol" checked><span class="oc-agent-model-option-copy">Extra High <small>5.6 Sol</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label>
      <label class="oc-agent-model-option"><input class="sr-only" type="radio" name="model" value="GPT-5.6" data-agent-model-option-version="5.6"><span class="oc-agent-model-option-copy">GPT-5.6 <small>5.6</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label>
    </fieldset>
  </details>
  <span class="oc-agent-model-badge" aria-label="Current model: Extra High, version 5.6 Sol"><strong>Extra High</strong><span>5.6 Sol</span></span>
</div>`,
    markup: `<details class="oc-agent-model-picker">
  <summary aria-label="Select model"><strong>Extra High</strong><span>5.6 Sol</span>…</summary>
  <fieldset class="oc-agent-model-menu">
    <legend class="sr-only">Model</legend>
    <label class="oc-agent-model-option"><input class="sr-only" type="radio" name="model" value="Extra High" checked><span class="oc-agent-model-option-copy">Extra High <small>5.6 Sol</small></span></label>
  </fieldset>
</details>`,
    guidance: ["Show the selected model and version without requiring the menu to open.", "Mark the active option with a visible check, not color alone.", "The consumer owns availability, entitlement, persistence, and routing."],
  },
  "mode-selector": {
    slug: "mode-selector",
    title: "Mode Selector",
    className: "oc-agent-mode-selector",
    lede: "A quiet composer trigger that switches between distinct agent behaviors through a small option menu.",
    previewTitle: "Choose an execution mode",
    preview: `<details class="oc-agent-mode-selector" data-agent-mode-selector>
  <summary aria-label="Select mode">${agentIcon("mode")}<span data-agent-mode-label>Agent</span>${agentIcon("chevron")}</summary>
  <fieldset class="oc-agent-mode-menu"><legend class="sr-only">Execution mode</legend>
    <label class="oc-agent-mode-option"><input class="sr-only" type="radio" name="mode" value="Agent" checked><span class="oc-agent-mode-option-copy"><strong>Agent</strong><small>Complete tasks directly</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label>
    <label class="oc-agent-mode-option"><input class="sr-only" type="radio" name="mode" value="Plan"><span class="oc-agent-mode-option-copy"><strong>Plan</strong><small>Plan before making changes</small></span><span class="oc-agent-mode-check" aria-hidden="true">${agentIcon("check")}</span></label>
  </fieldset>
</details>`,
    markup: `<details class="oc-agent-mode-selector">
  <summary aria-label="Select mode"><span data-agent-mode-label>Agent</span></summary>
  <fieldset class="oc-agent-mode-menu">
    <legend class="sr-only">Execution mode</legend>
    <label class="oc-agent-mode-option"><input class="sr-only" type="radio" name="mode" value="Agent" checked><span class="oc-agent-mode-option-copy"><strong>Agent</strong><small>Complete tasks directly</small></span></label>
  </fieldset>
</details>`,
    guidance: ["Use modes only when they materially change how the agent works.", "Mark the active mode with a visible check and keep labels short and mutually exclusive.", "The consumer owns mode availability, persistence, and execution behavior."],
  },
  "send-button": {
    slug: "send-button",
    title: "Send Button",
    className: "oc-agent-send-button",
    lede: "A round composer action with three states: idle, typing, and a stop control while a response streams.",
    previewTitle: "Idle, typing, and stop states",
    preview: `<div class="oc-agent-button-row"><button class="oc-agent-send-button" type="submit" data-state="idle" aria-label="Send message" disabled>${agentIcon("arrow-up")}</button><button class="oc-agent-send-button" type="submit" data-state="typing" aria-label="Send message">${agentIcon("arrow-up")}</button><button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button></div>`,
    markup: `<button class="oc-agent-send-button" type="submit" data-state="typing" aria-label="Send message">
  <svg aria-hidden="true">…</svg>
</button>
<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">
  <svg aria-hidden="true">…</svg>
</button>`,
    guidance: ["Use submit only for the send states and a regular button for stop.", "Replace the accessible name when the action changes during streaming.", "Keep idle visually muted and only enable send once the draft can be submitted."],
  },
  "user-message": {
    slug: "user-message",
    title: "User Message",
    className: "oc-agent-user-message",
    lede: "A right-aligned bubble for user prompts, stacking attachments above the text.",
    previewTitle: "User-authored prompt",
    preview: `<div class="oc-agent-user-message-stack">
  <div class="oc-agent-file-attachment" data-kind="image"><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("image")}</span><span class="oc-agent-file-details"><strong>mobile-reference.png</strong><span>428 KB</span></span></div>
  <div class="oc-agent-user-message"><p>Summarize the changes in this branch and compare them with the attached mobile reference.</p></div>
  <span class="oc-agent-message-meta">2:14 PM</span>
</div>`,
    markup: `<div class="oc-agent-user-message-stack">
  <div class="oc-agent-user-message"><p>Summarize the changes in this branch.</p></div>
  <span class="oc-agent-message-meta">2:14 PM</span>
</div>`,
    guidance: ["Keep user text selectable and in document order.", "Stack attachments above the bubble, aligned to the same edge.", "The consumer owns editing, retrying, timestamps, and attachment data."],
  },
  "todo-tool": {
    slug: "todo-tool",
    title: "Todo Tool",
    className: "oc-agent-todo-list",
    lede: "A quiet task list with circular status markers: empty for pending, an arrow while active, and a check when complete.",
    previewTitle: "Tracked task progress",
    preview: `<ul class="oc-agent-todo-list">
  <li data-state="complete"><span class="oc-agent-todo-marker" aria-hidden="true">${agentIcon("check")}</span><span class="sr-only">Completed: </span><span class="oc-agent-todo-text">Inspect contract</span></li>
  <li data-state="complete"><span class="oc-agent-todo-marker" aria-hidden="true">${agentIcon("check")}</span><span class="sr-only">Completed: </span><span class="oc-agent-todo-text">Implement component</span></li>
  <li data-state="active"><span class="oc-agent-todo-marker" aria-hidden="true">${agentIcon("arrow-right")}</span><span class="sr-only">In progress: </span><span class="oc-agent-todo-text">Run visual check</span></li>
  <li data-state="pending"><span class="oc-agent-todo-marker" aria-hidden="true"></span><span class="sr-only">Not started: </span><span class="oc-agent-todo-text">Publish reference</span></li>
</ul>`,
    markup: `<ul class="oc-agent-todo-list">
  <li data-state="complete"><span class="oc-agent-todo-marker" aria-hidden="true">…</span><span class="sr-only">Completed: </span><span class="oc-agent-todo-text">Inspect contract</span></li>
  <li data-state="active"><span class="oc-agent-todo-marker" aria-hidden="true">…</span><span class="sr-only">In progress: </span><span class="oc-agent-todo-text">Run visual check</span></li>
  <li data-state="pending"><span class="oc-agent-todo-marker" aria-hidden="true"></span><span class="sr-only">Not started: </span><span class="oc-agent-todo-text">Publish reference</span></li>
</ul>`,
    guidance: ["Keep task labels outcome-oriented and ordered.", "Expose complete, active, and pending states in text and semantics, not markers alone.", "Shimmer a short status line while the list itself is still streaming."],
  },
  "thinking-tool": {
    slug: "thinking-tool",
    title: "Thinking Tool",
    className: "oc-agent-thinking-tool",
    lede: "An expandable row labeled Thinking or Thought that reveals a concise reasoning summary without exposing hidden chain-of-thought.",
    previewTitle: "Reasoning summary",
    preview: `<div class="oc-agent-thinking-tool">${toolRow({
      label: "Thought",
      panel: `<p class="oc-agent-thinking-content">Reviewed component coverage, compatibility constraints, and preview density before choosing the smallest sustainable change.</p>`,
    })}</div>`,
    markup: `<details class="oc-agent-tool-row" open>
  <summary class="oc-agent-tool-row-summary"><span class="oc-agent-tool-row-label">Thought</span><span class="oc-agent-tool-row-chevron" aria-hidden="true">…</span></summary>
  <div class="oc-agent-tool-row-panel"><p class="oc-agent-thinking-content">Concise reasoning summary.</p></div>
</details>`,
    guidance: ["Present only concise, user-relevant reasoning summaries.", "Shimmer the Thinking label during active deliberation and settle on Thought.", "Do not imply access to or expose hidden chain-of-thought."],
  },
  "tool-group": {
    slug: "tool-group",
    title: "Tool Group",
    className: "oc-agent-tool-group",
    lede: "One summary row for a batch of related tool calls, expanding into the ordered nested rows it contains.",
    previewTitle: "Related tool activity",
    preview: `<div class="oc-agent-tool-group">${toolRow({
      label: "Task completed",
      detail: "1 file, 1 search, and 1 command",
      meta: "6s",
      panel: `<div class="oc-agent-tool-row-list">
        ${toolRow({ icon: agentIcon("terminal"), label: "Ran command", detail: "bun run check" })}
        ${toolRow({ icon: agentIcon("search"), label: "Found 3 results", detail: "semantic tokens" })}
        ${toolRow({ icon: agentIcon("file"), label: "Read file", detail: "styles/components.css" })}
      </div>`,
    })}</div>`,
    markup: `<details class="oc-agent-tool-row" open>
  <summary class="oc-agent-tool-row-summary"><span class="oc-agent-tool-row-label">Task completed</span><span class="oc-agent-tool-row-detail">1 file, 1 search, and 1 command</span><span class="oc-agent-tool-row-meta">6s</span><span class="oc-agent-tool-row-chevron" aria-hidden="true">…</span></summary>
  <div class="oc-agent-tool-row-panel"><div class="oc-agent-tool-row-list">…nested tool rows…</div></div>
</details>`,
    guidance: ["Group only calls that share one clear task and summarize their counts in the detail.", "Preserve execution order and show elapsed time as the trailing meta.", "Do not hide approvals, failures, or cancellation inside a collapsed group."],
  },
  "text-shimmer": {
    slug: "text-shimmer",
    title: "Text Shimmer",
    className: "oc-agent-text-shimmer",
    lede: "A restrained pending-state treatment for short status text while the next agent update is unavailable.",
    previewTitle: "Pending response state",
    preview: `<span class="oc-agent-text-shimmer" role="status" aria-live="polite">Thinking through the request...</span>`,
    markup: `<span class="oc-agent-text-shimmer" role="status" aria-live="polite">Thinking through the request...</span>`,
    guidance: ["Use shimmer only for genuinely pending content.", "Keep status text concise and meaningful without animation.", "Honor reduced-motion preferences and replace the status when work completes."],
  },
  "subagent-tool": {
    slug: "subagent-tool",
    title: "Subagent Tool",
    className: "oc-agent-subagent-tool",
    lede: "A delegated-work row that names the subagent objective, tracks elapsed time, and expands into its nested tool activity.",
    previewTitle: "Delegated agent work",
    preview: `<div class="oc-agent-subagent-tool">${toolRow({
      icon: collaborationAvatar("Atlas"),
      label: "Completed Subagent",
      detail: '<span class="oc-agent-subagent-name"><strong>Atlas</strong><small>Audit component accessibility</small></span>',
      meta: "6s",
      panel: `<div class="oc-agent-tool-row-list">
        ${toolRow({ icon: agentIcon("file"), label: "Read file", detail: "styles/components.css" })}
        ${toolRow({ icon: agentIcon("search"), label: "Grep", detail: "aria-label" })}
      </div>`,
    })}</div>`,
    markup: `<details class="oc-agent-tool-row" open>
  <summary class="oc-agent-tool-row-summary"><span class="oc-avatar oc-avatar-xs">…</span><span class="oc-agent-tool-row-label">Completed Subagent</span><span class="oc-agent-tool-row-detail"><span class="oc-agent-subagent-name"><strong>Atlas</strong><small>Audit component accessibility</small></span></span><span class="oc-agent-tool-row-meta">6s</span><span class="oc-agent-tool-row-chevron" aria-hidden="true">…</span></summary>
  <div class="oc-agent-tool-row-panel"><div class="oc-agent-tool-row-list">…nested tool rows…</div></div>
</details>`,
    guidance: ["Name the delegated agent and its objective instead of showing an opaque identifier.", "Shimmer the label and surface the latest nested call while running.", "The parent consumer owns delegation, interruption, permissions, and acceptance of results."],
  },
  "spiral-loader": {
    slug: "spiral-loader",
    title: "Spiral Loader",
    className: "oc-agent-spiral-loader",
    lede: "A compact indeterminate progress mark for agent work with no measurable completion value.",
    previewTitle: "Indeterminate agent activity",
    preview: `<span class="oc-agent-spiral-loader" role="status"><span class="oc-agent-spiral-ring" aria-hidden="true"></span><span class="sr-only">Working</span></span>`,
    markup: `<span class="oc-agent-spiral-loader" role="status">
  <span class="oc-agent-spiral-ring" aria-hidden="true"></span>
  <span class="sr-only">Working</span>
</span>`,
    guidance: ["Use only when progress cannot be measured.", "Pair the mark with accessible status text.", "Stop animation when the operation completes or when reduced motion is requested."],
  },
  "search-tool": {
    slug: "search-tool",
    title: "Search Tool",
    className: "oc-agent-search-tool",
    lede: "A result-count row that expands into a card preserving the query and the ordered result list.",
    previewTitle: "Search query and results",
    preview: `<div class="oc-agent-search-tool">${toolRow({
      label: "Found 3 results",
      panel: `<div class="oc-agent-tool-card oc-agent-search-card">
        <header class="oc-agent-tool-card-header"><strong>Searched for</strong><span class="oc-agent-search-query">“semantic token adapter”</span></header>
        <div class="oc-agent-search-results">
          <div class="oc-agent-search-result"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-search-result-title">Tailwind adapter</span><span class="oc-agent-search-result-meta">/resources/tailwind/</span></div>
          <div class="oc-agent-search-result"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-search-result-title">Design tokens</span><span class="oc-agent-search-result-meta">/foundations/tokens/</span></div>
          <div class="oc-agent-search-result"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-search-result-title">Consumer adapters</span><span class="oc-agent-search-result-meta">/resources/consumer-adapters/</span></div>
        </div>
      </div>`,
    })}</div>`,
    markup: `<details class="oc-agent-tool-row" open>
  <summary class="oc-agent-tool-row-summary"><span class="oc-agent-tool-row-label">Found 3 results</span><span class="oc-agent-tool-row-chevron" aria-hidden="true">…</span></summary>
  <div class="oc-agent-tool-row-panel">
    <div class="oc-agent-tool-card oc-agent-search-card">
      <header class="oc-agent-tool-card-header"><strong>Searched for</strong><span class="oc-agent-search-query">“semantic token adapter”</span></header>
      <div class="oc-agent-search-results">…</div>
    </div>
  </div>
</details>`,
    guidance: ["Keep the submitted query visible in the expanded card header.", "Expose the expand affordance only once results exist.", "The consumer owns search execution, ranking, source attribution, and navigation."],
  },
  "question-tool": {
    slug: "question-tool",
    title: "Question Tool",
    className: "oc-agent-question-tool",
    lede: "A blocking clarification prompt with lettered answer choices, an optional custom answer, and skip and send actions.",
    previewTitle: "Request a decision",
    preview: `<form class="oc-agent-question-tool" data-agent-question-form>
  <header class="oc-agent-question-header"><span class="oc-agent-question-header-label">${agentIcon("question")}Question</span><span class="oc-agent-question-nav"><button type="button" aria-label="Previous question" disabled>${agentIcon("chevron-up")}</button><span>1 of 2</span><button type="button" aria-label="Next question">${agentIcon("chevron")}</button></span></header>
  <div class="oc-agent-question-body">
    <fieldset>
      <legend class="oc-agent-question-title"><span class="oc-agent-question-badge" aria-hidden="true">1</span>How should we apply this change?</legend>
      <label class="oc-agent-question-option"><input class="sr-only" type="radio" name="scope" value="small" checked><span class="oc-agent-question-badge" aria-hidden="true">A</span><span class="oc-agent-question-option-label">Small scoped patch</span></label>
      <label class="oc-agent-question-option"><input class="sr-only" type="radio" name="scope" value="refactor"><span class="oc-agent-question-badge" aria-hidden="true">B</span><span class="oc-agent-question-option-label">Full refactor</span></label>
      <label class="oc-agent-question-option oc-agent-question-option-custom"><input class="sr-only" type="radio" name="scope" value="custom"><span class="oc-agent-question-badge" aria-hidden="true">C</span><span class="oc-agent-question-custom-field"><span class="sr-only">Custom answer</span><input id="question-custom-answer" type="text" name="custom-answer" placeholder="Type your answer"></span></label>
    </fieldset>
    <div class="oc-agent-question-actions"><button class="oc-agent-question-skip" type="button" data-agent-question-skip>Skip</button><button class="oc-agent-question-submit" type="submit">Send</button></div>
  </div>
  <span class="sr-only" data-agent-question-status aria-live="polite"></span>
</form>`,
    markup: `<form class="oc-agent-question-tool">
  <header class="oc-agent-question-header"><span class="oc-agent-question-header-label">Question</span><span class="oc-agent-question-nav">1 of 2</span></header>
  <div class="oc-agent-question-body">
    <fieldset>
      <legend class="oc-agent-question-title"><span class="oc-agent-question-badge" aria-hidden="true">1</span>How should we apply this change?</legend>
      <label class="oc-agent-question-option"><input class="sr-only" type="radio" name="scope" value="small"><span class="oc-agent-question-badge" aria-hidden="true">A</span><span class="oc-agent-question-option-label">Small scoped patch</span></label>
    </fieldset>
    <div class="oc-agent-question-actions"><button class="oc-agent-question-skip" type="button">Skip</button><button class="oc-agent-question-submit" type="submit">Send</button></div>
  </div>
</form>`,
    guidance: ["Ask one decision at a time and letter the answer choices.", "Use native controls and allow a free-form answer when fixed choices are insufficient.", "The consumer owns submission, validation, timeouts, and whether work can continue without an answer."],
  },
  "plan-tool": {
    slug: "plan-tool",
    title: "Plan Tool",
    className: "oc-agent-plan-tool",
    lede: "A plan card that names its document, previews the summary, and pairs a read action with a small primary approval.",
    previewTitle: "Execution plan",
    preview: `<div class="oc-agent-tool-card oc-agent-plan-tool" data-state="ready" data-agent-plan>
  <header class="oc-agent-tool-card-header"><span class="oc-agent-tool-card-icon" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-tool-card-title">plan-working.md</span><button class="oc-agent-plan-expand" type="button" aria-label="Expand plan" aria-expanded="false">${agentIcon("chevrons-down")}</button></header>
  <div class="oc-agent-plan-body">
    <p class="oc-agent-plan-title">Refine agent component previews</p>
    <div class="oc-agent-plan-summary"><p>Align structure, interaction, and accessibility with the reference while preserving the existing component contract. Start from the shared tool row, then port the card tools and composer states.</p></div>
  </div>
  <footer class="oc-agent-plan-footer"><button class="oc-agent-plan-read" type="button">Read detailed plan</button><button class="oc-agent-plan-approve" type="button" data-agent-plan-approve>Approve</button></footer>
</div>`,
    markup: `<div class="oc-agent-tool-card oc-agent-plan-tool" data-state="ready">
  <header class="oc-agent-tool-card-header">
    <span class="oc-agent-tool-card-icon" aria-hidden="true">…</span>
    <span class="oc-agent-tool-card-title">plan-working.md</span>
    <button class="oc-agent-plan-expand" type="button" aria-label="Expand plan" aria-expanded="false">…</button>
  </header>
  <div class="oc-agent-plan-body">
    <p class="oc-agent-plan-title">Refine agent component previews</p>
    <div class="oc-agent-plan-summary"><p>…</p></div>
  </div>
  <footer class="oc-agent-plan-footer">
    <button class="oc-agent-plan-read" type="button">Read detailed plan</button>
    <button class="oc-agent-plan-approve" type="button">Approve</button>
  </footer>
</div>`,
    guidance: ["Name the plan document in the header and keep the summary clamped until expanded.", "Keep the approval as a small primary action that settles into Approved.", "The consumer owns plan generation, updates, approval, and execution."],
  },
};

export const agentReferenceContentIds = Object.keys(components);

export function getAgentReferenceContent(id) {
  const component = components[id];
  return component ? renderAgentComponent(component) : "";
}
