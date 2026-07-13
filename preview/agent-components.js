function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function codeBlock(code) {
  return `<div class="code-block"><div class="code-block-header"><span>HTML</span><button type="button" data-copy-code>Copy</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function guidanceList(items) {
  return `<ul class="guidance-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

const agentIconPaths = {
  alert: '<path d="M10.3 4.2 2.7 18a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.7 4.2a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" />',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 9h16" />',
  chevron: '<path d="m9 10 3 3 3-3" />',
  close: '<path d="m8 8 8 8M16 8l-8 8" />',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />',
  file: '<path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h4" />',
  learn: '<circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" />',
  image: '<rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m4 17 4-4 3 3 3-3 6 6" />',
  mode: '<path d="M8.5 8.5a3.5 3.5 0 1 0 0 7c3.5 0 3.5-7 7-7a3.5 3.5 0 1 1 0 7c-3.5 0-3.5-7-7-7Z" />',
  model: '<path d="m12 3 7 4-7 4-7-4 7-4Z" /><path d="m5 7v8l7 4 7-4V7M12 11v8" />',
  paperclip: '<path d="M8.5 12.5 15 6a3.5 3.5 0 0 1 5 5l-8.5 8.5a5 5 0 0 1-7-7L13 4" />',
  search: '<circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" />',
  send: '<path d="m5 12 7-7 7 7M12 5v14" />',
  stop: '<rect x="7" y="7" width="10" height="10" rx="1.5" />',
  terminal: '<path d="m5 7 4 4-4 4M11 17h8" /><rect x="3" y="4" width="18" height="16" rx="2" />',
  sparkle: '<path d="m12 3 1.3 4.2L17.5 9l-4.2 1.8L12 15l-1.3-4.2L6.5 9l4.2-1.8L12 3Z" /><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />',
  write: '<path d="m4 20 4.2-1 10.4-10.4a2.1 2.1 0 0 0-3-3L5.2 16 4 20ZM13.8 7.4l3 3" />',
};

function agentIcon(name) {
  const paths = agentIconPaths[name] || "";
  return `<svg class="oc-agent-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function renderAgentComponent(component) {
  return `<header class="reference-intro"><p class="eyebrow">Agent component</p><h1>${component.title}</h1><p>${component.lede}</p></header>
    <section data-section-kind="preview" aria-labelledby="${component.slug}-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="${component.slug}-preview">${component.previewTitle}</h2></div><span class="oc-pill">.${component.className}</span></div><div class="specimen-frame agent-specimen">${component.preview}</div></section>
    <section data-section-kind="markup" aria-labelledby="${component.slug}-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="${component.slug}-markup">Canonical structure</h2></div></div>${codeBlock(component.markup)}</section>
    <section data-section-kind="guidance" aria-labelledby="${component.slug}-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="${component.slug}-guidance">Behavior and ownership</h2></div></div>${guidanceList(component.guidance)}</section>`;
}

const components = {
  "bash-tool": {
    slug: "bash-tool",
    title: "Bash Tool",
    className: "oc-agent-bash-tool",
    lede: "A terminal-specific tool surface that separates the executed command from its output and status.",
    previewTitle: "Command execution",
    preview: `<details class="oc-agent-tool oc-agent-bash-tool" data-status="success" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("terminal")}</span><span>Ran command</span><span class="oc-agent-tool-status">Exit 0</span></summary><div class="oc-agent-tool-content"><div class="oc-agent-bash-command"><span aria-hidden="true">$</span><code>bun run check</code></div><pre role="region" aria-label="Command output" tabindex="0"><code>29 pass · 0 fail\nFinished in 312ms</code></pre></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-bash-tool" open>
  <summary class="oc-agent-tool-summary"><span>Ran command</span><span class="oc-agent-tool-status">Exit 0</span></summary>
  <div class="oc-agent-tool-content"><div class="oc-agent-bash-command"><span>$</span><code>bun run check</code></div><pre role="region" aria-label="Command output" tabindex="0"><code>…</code></pre></div>
</details>`,
    guidance: ["Display the exact command separately from its output.", "Expose exit state in text and preserve output whitespace.", "Require consumer-controlled approval for commands with meaningful side effects."],
  },
  "generic-tool": {
    slug: "generic-tool",
    title: "Generic Tool",
    className: "oc-agent-tool",
    lede: "A shared disclosure surface for tool identity, execution state, input, and result content.",
    previewTitle: "Tool invocation and result",
    preview: `<details class="oc-agent-tool oc-agent-generic-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("code")}</span><span>Inspect workspace</span><span class="oc-agent-tool-status">Completed</span></summary><div class="oc-agent-tool-content"><p>Found three changed component files with no package-contract changes.</p></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-generic-tool" open>
  <summary class="oc-agent-tool-summary"><span>Inspect workspace</span><span class="oc-agent-tool-status">Completed</span></summary>
  <div class="oc-agent-tool-content"><p>Tool result summary.</p></div>
</details>`,
    guidance: ["Keep tool name and execution state visible while collapsed.", "Render input and output as selectable content.", "The consumer owns approval, cancellation, execution, streaming, and error handling."],
  },
  "error-message": {
    slug: "error-message",
    title: "Error Message",
    className: "oc-agent-error-message",
    lede: "A recoverable conversation error that explains what failed and exposes the next valid action.",
    previewTitle: "Recover from a failed response",
    preview: `<div class="oc-agent-error-message" role="alert" data-agent-error-message>
  <span class="oc-agent-error-icon" aria-hidden="true">${agentIcon("alert")}</span>
  <div class="oc-agent-error-copy"><strong>Response interrupted</strong><p>The connection ended before the response completed. Your draft is still available.</p><div class="oc-agent-error-actions"><button class="oc-agent-error-action" type="button" data-agent-retry>Try again</button><button class="oc-agent-error-action" type="button" data-copy-text="Response interrupted: The connection ended before the response completed. Your draft is still available.">Copy details</button></div></div>
</div>`,
    markup: `<div class="oc-agent-error-message" role="alert">
  <span class="oc-agent-error-icon" aria-hidden="true">…</span>
  <div class="oc-agent-error-copy"><strong>Response interrupted</strong><p>…</p><button class="oc-agent-error-action" type="button">Try again</button></div>
</div>`,
    guidance: ["State the failure in plain language and preserve any safe recovery action.", "Use an alert only when the error appears after an attempted action.", "The consumer owns error mapping, retry logic, logging, and destructive recovery decisions."],
  },
  "edit-tool": {
    slug: "edit-tool",
    title: "Edit Tool",
    className: "oc-agent-edit-tool",
    lede: "A file-change tool surface that identifies the target and summarizes additions and removals.",
    previewTitle: "File edit result",
    preview: `<details class="oc-agent-tool oc-agent-edit-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("write")}</span><span>styles/components.css</span><span class="oc-agent-tool-status"><span class="oc-agent-diff-add">+3</span> <span class="oc-agent-diff-remove">−1</span></span></summary><div class="oc-agent-tool-content"><div class="oc-agent-diff" role="region" aria-label="Changes to styles/components.css" tabindex="0"><div class="oc-agent-diff-line"><span>108</span><span aria-hidden="true"> </span><code>.oc-agent-tool {</code></div><div class="oc-agent-diff-line" data-kind="removed"><span>109</span><span aria-hidden="true">−</span><code>  min-height: 3rem;</code></div><div class="oc-agent-diff-line" data-kind="added"><span>109</span><span aria-hidden="true">+</span><code>  min-height: 2.25rem;</code></div><div class="oc-agent-diff-line" data-kind="added"><span>110</span><span aria-hidden="true">+</span><code>  font-size: var(--oc-font-size-sm);</code></div><div class="oc-agent-diff-line" data-kind="added"><span>111</span><span aria-hidden="true">+</span><code>  border-radius: var(--oc-radius-control);</code></div><div class="oc-agent-diff-line"><span>112</span><span aria-hidden="true"> </span><code>}</code></div></div></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-edit-tool" open>
  <summary class="oc-agent-tool-summary"><span>styles/components.css</span><span class="oc-agent-tool-status">+12 −2</span></summary>
  <div class="oc-agent-tool-content"><div class="oc-agent-diff" role="region" aria-label="Changes to styles/components.css" tabindex="0">…</div></div>
</details>`,
    guidance: ["Always identify the affected file or resource.", "Pair addition and removal counts with a readable change summary.", "The consumer owns approval, patch application, conflict handling, and rollback."],
  },
  "file-attachment": {
    slug: "file-attachment",
    title: "File Attachment",
    className: "oc-agent-file-attachment",
    lede: "A compact file record that exposes identity, size, upload status, and a safe removal action before submission.",
    previewTitle: "Attached file states",
    preview: `<ul class="oc-agent-attachment-list" aria-label="Attached files"><li class="oc-agent-file-attachment" data-agent-attachment><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("file")}</span><span class="oc-agent-file-details"><strong>project-brief.pdf</strong><span>PDF · 1.8 MB</span></span><button class="oc-agent-file-remove" type="button" aria-label="Remove project-brief.pdf" data-agent-attachment-remove>${agentIcon("close")}</button></li><li class="oc-agent-file-attachment" data-status="uploading" data-agent-attachment><span class="oc-agent-file-type" aria-hidden="true">${agentIcon("image")}</span><span class="oc-agent-file-details"><strong>interface.png</strong><span>Uploading · 62%</span><span class="oc-agent-file-progress" role="progressbar" aria-label="Uploading interface.png" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><span style="width: 62%"></span></span></span><button class="oc-agent-file-remove" type="button" aria-label="Cancel interface.png upload" data-agent-attachment-remove>${agentIcon("close")}</button></li></ul>`,
    markup: `<li class="oc-agent-file-attachment" data-status="uploading">
  <span class="oc-agent-file-type" aria-hidden="true">PNG</span>
  <span class="oc-agent-file-details">
    <strong>interface.png</strong>
    <span>Uploading · 62%</span>
    <span class="oc-agent-file-progress" role="progressbar" aria-label="Uploading interface.png" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><span style="width: 62%"></span></span>
  </span>
  <button class="oc-agent-file-remove" type="button" aria-label="Cancel interface.png upload">…</button>
</li>`,
    guidance: ["Keep the full filename available and allow long names to wrap or truncate without hiding the extension.", "Expose upload progress and failure in text and semantics, not color alone.", "Give every remove or cancel action a filename-specific accessible name; the consumer owns upload and cleanup."],
  },
  "agent-chat": {
    slug: "agent-chat",
    title: "Agent Chat",
    className: "oc-agent-chat",
    lede: "A complete conversation surface that keeps message history, suggestions, status, and message entry in one bounded workflow.",
    previewTitle: "Conversation workspace",
    preview: `<section class="oc-agent-chat" aria-label="Agent conversation">
  <ol class="oc-agent-chat-messages" aria-label="Conversation history">
    <li class="oc-agent-chat-turn">
      <span class="oc-agent-avatar" aria-hidden="true">${agentIcon("sparkle")}</span>
      <div><span class="oc-agent-message-role">OpenClaw</span><p>I can inspect the current workspace and explain the next safe step.</p></div>
    </li>
    <li class="oc-user-message"><p>Summarize the pending changes and flag anything risky.</p></li>
    <li class="oc-agent-chat-turn" data-status="streaming">
      <span class="oc-agent-avatar" aria-hidden="true">${agentIcon("sparkle")}</span>
      <div><span class="oc-agent-message-role">OpenClaw · responding</span><p>Reviewing the component contract, tests, and current diff…</p></div>
    </li>
  </ol>
  <div class="oc-agent-chat-composer">
    <div class="oc-agent-chat-suggestions" aria-label="Suggested prompts"><button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Review the pending changes" data-agent-suggestion-target="agent-chat-message">Review changes</button><button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Run the validation checks" data-agent-suggestion-target="agent-chat-message">Run checks</button></div>
    <form class="oc-agent-input-bar" data-agent-chat-form>
      <label class="sr-only" for="agent-chat-message">Message</label>
      <textarea id="agent-chat-message" class="oc-agent-input" rows="2" placeholder="Send a message…"></textarea>
      <div class="oc-agent-input-toolbar"><button class="oc-agent-input-action" type="button" aria-label="Attach files">${agentIcon("paperclip")}</button><button class="oc-agent-send-button" type="submit" aria-label="Send message">${agentIcon("send")}</button></div>
    </form>
    <span class="sr-only" data-agent-chat-status aria-live="polite"></span>
  </div>
</section>`,
    markup: `<section class="oc-agent-chat" aria-label="Agent conversation">
  <div class="oc-agent-chat-messages">…</div>
  <div class="oc-agent-chat-suggestions">…</div>
  <form class="oc-agent-input-bar">…</form>
  <span class="sr-only" aria-live="polite">Message sent</span>
</section>`,
    guidance: ["Keep the message list as the primary flexible region.", "Expose streamed updates through a polite live region without repeatedly announcing the entire transcript.", "The consumer owns message data, submission, stopping, attachments, and tool execution."],
  },
  "attachment-button": {
    slug: "attachment-button",
    title: "Attachment Button",
    className: "oc-agent-attachment-button",
    lede: "A composer action that opens file selection without competing with the current send or stop action.",
    previewTitle: "Add supporting files",
    preview: `<div class="oc-agent-button-row"><button class="oc-agent-attachment-button" type="button" aria-label="Attach files">${agentIcon("paperclip")}</button><button class="oc-agent-attachment-button" type="button" aria-label="Attach files" disabled>${agentIcon("paperclip")}</button></div>`,
    markup: `<button class="oc-agent-attachment-button" type="button" aria-label="Attach files">
  <svg aria-hidden="true">…</svg>
</button>`,
    guidance: ["Give icon-only attachment actions an explicit accessible name.", "Keep the button available next to the message field without making it the primary action.", "The consumer owns file selection, accepted types, size limits, upload, and error handling."],
  },
  "message-list": {
    slug: "message-list",
    title: "Message List",
    className: "oc-agent-message-list",
    lede: "A readable transcript that preserves message order, role, streaming state, and tool output within one scrollable history.",
    previewTitle: "Ordered conversation history",
    preview: `<ol class="oc-agent-message-list" aria-label="Conversation history">
  <li class="oc-user-message"><p>Which files changed, and is the package contract still intact?</p><footer class="oc-agent-message-meta">You · 2:14 PM</footer></li>
  <li class="oc-agent-message">
    <header class="oc-agent-message-header"><span class="oc-agent-avatar" aria-hidden="true">${agentIcon("sparkle")}</span><span class="oc-agent-message-role">OpenClaw</span></header>
    <div class="oc-agent-message-body"><p>Three component files changed. The exported package contract and every existing token remain intact.</p></div>
    <div class="oc-agent-message-actions"><button type="button" data-copy-text="Three component files changed. The exported package contract and every existing token remain intact.">Copy response</button></div>
  </li>
  <li class="oc-agent-message" data-status="streaming">
    <header class="oc-agent-message-header"><span class="oc-agent-avatar" aria-hidden="true">${agentIcon("sparkle")}</span><span class="oc-agent-message-role">OpenClaw · responding</span></header>
    <div class="oc-agent-message-body"><p>Checking the validation output and responsive preview…</p></div>
  </li>
</ol>`,
    markup: `<ol class="oc-agent-message-list" aria-label="Conversation history">
  <li class="oc-user-message">…</li>
  <li class="oc-agent-message" data-status="streaming">…</li>
</ol>`,
    guidance: ["Render messages in chronological document order.", "Use role text and semantics instead of color alone.", "Preserve the user's reading position when older messages are prepended."],
  },
  "mcp-tool": {
    slug: "mcp-tool",
    title: "MCP Tool",
    className: "oc-agent-mcp-tool",
    lede: "A protocol tool surface that identifies its server, capability, invocation state, and returned result.",
    previewTitle: "Connected capability call",
    preview: `<details class="oc-agent-tool oc-agent-mcp-tool" data-status="success" open><summary class="oc-agent-tool-summary"><span class="oc-agent-mcp-mark" aria-hidden="true">M</span><span>Listed resources</span><span class="oc-agent-tool-status">Completed</span></summary><div class="oc-agent-tool-content"><dl class="oc-agent-mcp-meta"><div><dt>Server</dt><dd>workspace</dd></div><div><dt>Capability</dt><dd>read_resource</dd></div></dl><pre class="oc-agent-mcp-output" role="region" aria-label="MCP tool result" tabindex="0"><code>{
  "resources": [
    { "name": "Design tokens", "uri": "design-system://tokens" },
    { "name": "Components", "uri": "design-system://components" }
  ]
}</code></pre></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-mcp-tool" open>
  <summary class="oc-agent-tool-summary"><span>Listed resources</span><span class="oc-agent-tool-status">Completed</span></summary>
  <div class="oc-agent-tool-content"><dl class="oc-agent-mcp-meta">…</dl><pre role="region" aria-label="MCP tool result" tabindex="0"><code>…</code></pre></div>
</details>`,
    guidance: ["Identify both server and capability in human-readable text.", "Keep authorization and connection failures distinct from tool-result errors.", "The consumer owns discovery, consent, credentials, invocation, and trust boundaries."],
  },
  "input-bar": {
    slug: "input-bar",
    title: "Input Bar",
    className: "oc-agent-input-bar",
    lede: "A message composer that keeps text entry, attachments, and the current send or stop action in one bounded control.",
    previewTitle: "Compose and submit",
    preview: `<form class="oc-agent-input-bar oc-agent-input-bar-standalone" data-agent-compose-form>
  <label class="sr-only" for="input-bar-message">Message</label>
  <textarea id="input-bar-message" class="oc-agent-input" rows="3" placeholder="Send a message…"></textarea>
  <div class="oc-agent-input-toolbar">
    <div class="oc-agent-input-tools">
      <button class="oc-agent-input-action" type="button" aria-label="Attach file">${agentIcon("paperclip")}</button>
      <button class="oc-agent-input-meta" type="button">${agentIcon("mode")}<span>Agent</span>${agentIcon("chevron")}</button>
      <button class="oc-agent-input-meta" type="button">${agentIcon("model")}<span>Balanced</span>${agentIcon("chevron")}</button>
    </div>
    <button class="oc-agent-send-button" type="submit" aria-label="Send message">${agentIcon("send")}</button>
  </div>
  <span class="sr-only" data-agent-compose-status aria-live="polite"></span>
</form>`,
    markup: `<form class="oc-agent-input-bar">
  <label class="sr-only" for="message">Message</label>
  <textarea id="message" class="oc-agent-input" placeholder="Send a message…"></textarea>
  <div class="oc-agent-input-toolbar">…</div>
</form>`,
    guidance: ["Keep one visible message field and one current primary action.", "Change the send action to stop while a response is streaming.", "The consumer owns submission, draft persistence, attachment processing, and keyboard shortcuts."],
  },
  markdown: {
    slug: "markdown",
    title: "Markdown",
    className: "oc-agent-markdown",
    lede: "Readable rich text for agent responses, with deliberate rhythm for prose, lists, links, quotes, and code.",
    previewTitle: "Structured response content",
    preview: `<article class="oc-agent-markdown">
  <h3>Validation complete</h3>
  <p>The component contract is ready for review. Inspect the <a href="../../foundations/tokens/">token reference</a> before adoption.</p>
  <ul><li>Keyboard behavior is preserved.</li><li>Colors resolve from <code>--oc-*</code> semantic tokens.</li></ul>
  <blockquote><p>Review the rendered state in both themes before adoption.</p></blockquote>
  <div class="oc-agent-markdown-table" tabindex="0" role="region" aria-label="Validation results"><table><thead><tr><th scope="col">Check</th><th scope="col">Result</th></tr></thead><tbody><tr><td>CSS contract</td><td>Passed</td></tr><tr><td>Preview build</td><td>Passed</td></tr></tbody></table></div>
  <pre><code>bun run check</code></pre>
</article>`,
    markup: `<article class="oc-agent-markdown">
  <h3>Validation complete</h3>
  <p>The component contract is ready for review. Inspect the <a href="../../foundations/tokens/">token reference</a>.</p>
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
    lede: "Short prompt starters that help users begin or continue a conversation without replacing free-form input.",
    previewTitle: "Useful next prompts",
    preview: `<div class="oc-agent-suggestion-demo">
  <form class="oc-agent-input-bar" data-agent-compose-form>
    <label class="sr-only" for="suggestion-demo-input">Message</label>
    <textarea id="suggestion-demo-input" class="oc-agent-input" rows="2" placeholder="Send a message…"></textarea>
    <div class="oc-agent-input-toolbar"><span></span><button class="oc-agent-send-button" type="submit" aria-label="Send message">${agentIcon("send")}</button></div>
    <span class="sr-only" data-agent-compose-status aria-live="polite"></span>
  </form>
  <div class="oc-agent-suggestions" aria-label="Suggested prompts">
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Draft a concise release note" data-agent-suggestion-target="suggestion-demo-input">${agentIcon("write")}<span>Write</span></button>
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Explain this component contract" data-agent-suggestion-target="suggestion-demo-input">${agentIcon("learn")}<span>Learn</span></button>
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Review the current implementation" data-agent-suggestion-target="suggestion-demo-input">${agentIcon("code")}<span>Code</span></button>
    <button class="oc-agent-suggestion" type="button" data-agent-suggestion-value="Summarize today's work" data-agent-suggestion-target="suggestion-demo-input">${agentIcon("calendar")}<span>From calendar</span></button>
  </div>
</div>`,
    markup: `<div class="oc-agent-suggestions" aria-label="Suggested prompts">
  <button class="oc-agent-suggestion" type="button">Summarize changes</button>
  <button class="oc-agent-suggestion" type="button">Run validation</button>
</div>`,
    guidance: ["Offer a small set of specific, context-aware prompts.", "Insert or submit the complete visible suggestion when selected.", "Disable suggestions while they would conflict with an active submission."],
  },
  "model-picker": {
    slug: "model-picker",
    title: "Model Picker",
    className: "oc-agent-model-picker",
    lede: "A compact model selector that exposes the current choice and preserves native form and keyboard behavior.",
    previewTitle: "Choose the execution model",
    preview: `<div class="oc-agent-model-demo">
  <label class="oc-agent-model-field"><span class="sr-only">Model</span>${agentIcon("model")}<select class="oc-agent-model-picker"><option>Fast · 2.1</option><option selected>Balanced · 4.6</option><option>Deep · 4.6</option></select>${agentIcon("chevron")}</label>
  <span class="oc-agent-model-badge" aria-label="Current model: Balanced, version 4.6">${agentIcon("model")}<strong>Balanced</strong><span>4.6</span></span>
</div>`,
    markup: `<label class="oc-agent-model-field">
  <span class="sr-only">Model</span>
  <svg aria-hidden="true">…</svg>
  <select class="oc-agent-model-picker"><option>Balanced · 4.6</option></select>
  <svg aria-hidden="true">…</svg>
</label>`,
    guidance: ["Show the selected model without requiring the menu to open.", "Use stable human-readable names and preserve capability details in the option label or adjacent help.", "The consumer owns availability, entitlement, persistence, and routing."],
  },
  "mode-selector": {
    slug: "mode-selector",
    title: "Mode Selector",
    className: "oc-agent-mode-selector",
    lede: "A compact choice between distinct agent execution behaviors such as direct work and planning.",
    previewTitle: "Choose an execution mode",
    preview: `<details class="oc-agent-mode-selector" data-agent-mode-selector>
  <summary>${agentIcon("mode")}<span data-agent-mode-label>Agent</span>${agentIcon("chevron")}</summary>
  <fieldset class="oc-agent-mode-menu"><legend class="sr-only">Execution mode</legend>
    <label class="oc-agent-mode-option"><input type="radio" name="mode" value="Agent" checked><span><strong>Agent</strong><small>Execute the task directly</small></span></label>
    <label class="oc-agent-mode-option"><input type="radio" name="mode" value="Plan"><span><strong>Plan</strong><small>Review the approach first</small></span></label>
  </fieldset>
</details>`,
    markup: `<details class="oc-agent-mode-selector">
  <summary><span>Agent</span></summary>
  <fieldset class="oc-agent-mode-menu">
    <legend class="sr-only">Execution mode</legend>
    <label class="oc-agent-mode-option"><input type="radio" name="mode" value="Agent" checked><span>Agent</span></label>
    <label class="oc-agent-mode-option"><input type="radio" name="mode" value="Plan"><span>Plan</span></label>
  </fieldset>
</details>`,
    guidance: ["Use modes only when they materially change how the agent works.", "Keep labels short and mutually exclusive.", "The consumer owns mode availability, persistence, and execution behavior."],
  },
  "send-button": {
    slug: "send-button",
    title: "Send Button",
    className: "oc-agent-send-button",
    lede: "The message composer action that communicates whether the next operation will send a draft or stop an active response.",
    previewTitle: "Send and stop states",
    preview: `<div class="oc-agent-button-row"><button class="oc-agent-send-button" type="button" aria-label="Send message">${agentIcon("send")}</button><button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">${agentIcon("stop")}</button><button class="oc-agent-send-button" type="button" aria-label="Send message" disabled>${agentIcon("send")}</button></div>`,
    markup: `<button class="oc-agent-send-button" type="submit" aria-label="Send message">
  <svg aria-hidden="true">…</svg>
</button>
<button class="oc-agent-send-button" type="button" data-state="stop" aria-label="Stop response">
  <svg aria-hidden="true">…</svg>
</button>`,
    guidance: ["Use submit only for the send state and a regular button for stop.", "Replace the accessible name when the action changes during streaming.", "Disable send when the current draft cannot be submitted; the consumer owns submission and cancellation."],
  },
  "user-message": {
    slug: "user-message",
    title: "User Message",
    className: "oc-agent-user-message",
    lede: "A distinct transcript entry for user-authored prompts and attachments.",
    previewTitle: "User-authored prompt",
    preview: `<div class="oc-agent-user-message-stack">
  <article class="oc-agent-user-message"><p>Summarize the changes in this branch and compare them with the attached mobile reference.</p></article>
  <div class="oc-agent-user-attachment">${agentIcon("image")}<span><strong>mobile-reference.png</strong><small>428 KB</small></span></div>
  <span class="oc-agent-message-meta">You · now</span>
</div>`,
    markup: `<div class="oc-agent-user-message-stack">
  <article class="oc-agent-user-message"><p>Summarize the changes in this branch.</p></article>
  <div class="oc-agent-user-attachment">…</div>
  <span class="oc-agent-message-meta">You · now</span>
</div>`,
    guidance: ["Keep user text selectable and in document order.", "Use alignment and surface treatment without relying on color alone.", "The consumer owns editing, retrying, timestamps, and attachment data."],
  },
  "todo-tool": {
    slug: "todo-tool",
    title: "Todo Tool",
    className: "oc-agent-todo-tool",
    lede: "A compact task-state surface for work the agent is tracking during a bounded run.",
    previewTitle: "Tracked task progress",
    preview: `<section class="oc-agent-todo-tool" aria-labelledby="todo-tool-title"><header><strong id="todo-tool-title">Update component reference</strong><span>2 of 3 complete</span></header><ul class="oc-agent-todo-list"><li data-state="complete"><span class="sr-only">Completed: </span>Inspect contract</li><li data-state="complete"><span class="sr-only">Completed: </span>Implement component</li><li data-state="active"><span class="sr-only">In progress: </span>Run visual check</li></ul></section>`,
    markup: `<section class="oc-agent-todo-tool" aria-labelledby="todo-tool-title">
  <header><strong id="todo-tool-title">Update component reference</strong><span>2 of 3 complete</span></header>
  <ul class="oc-agent-todo-list"><li data-state="complete"><span class="sr-only">Completed: </span>Inspect contract</li>…</ul>
</section>`,
    guidance: ["Keep task labels outcome-oriented and ordered.", "Expose complete, active, and pending states in text or semantics.", "The consumer owns task mutation, persistence, and completion rules."],
  },
  "thinking-tool": {
    slug: "thinking-tool",
    title: "Thinking Tool",
    className: "oc-agent-thinking-tool",
    lede: "A disclosure for concise reasoning summaries and active deliberation state without exposing hidden chain-of-thought.",
    previewTitle: "Reasoning summary",
    preview: `<details class="oc-agent-tool oc-agent-thinking-tool" data-status="complete" open><summary class="oc-agent-tool-summary"><span class="oc-agent-thinking-mark" aria-hidden="true">✦</span><span>Thought</span></summary><div class="oc-agent-tool-content"><p>Reviewed component coverage, compatibility constraints, and preview density before choosing the smallest sustainable change.</p></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-thinking-tool" open>
  <summary class="oc-agent-tool-summary"><span>Thought</span></summary>
  <div class="oc-agent-tool-content"><p>Concise reasoning summary.</p></div>
</details>`,
    guidance: ["Present only concise, user-relevant reasoning summaries.", "Distinguish active deliberation from completed reasoning.", "Do not imply access to or expose hidden chain-of-thought."],
  },
  "tool-group": {
    slug: "tool-group",
    title: "Tool Group",
    className: "oc-agent-tool-group",
    lede: "A bounded collection of related tool calls that preserves their order and shared task context.",
    previewTitle: "Related tool activity",
    preview: `<details class="oc-agent-tool-group" open><summary class="oc-agent-tool-group-summary"><strong>Task completed</strong><span>1 file, 1 search, and 1 command</span><time datetime="PT6S">6s</time></summary><ul class="oc-agent-tool-group-list"><li><span aria-hidden="true">${agentIcon("terminal")}</span><strong>Ran command</strong><code>bun run check</code></li><li><span aria-hidden="true">${agentIcon("search")}</span><strong>Found 3 results</strong><code>semantic tokens</code></li><li><span aria-hidden="true">${agentIcon("file")}</span><strong>Read</strong><code>styles/components.css</code></li></ul></details>`,
    markup: `<details class="oc-agent-tool-group" open>
  <summary class="oc-agent-tool-group-summary"><strong>Task completed</strong><span>1 file, 1 search, and 1 command</span><time datetime="PT6S">6s</time></summary>
  <ul class="oc-agent-tool-group-list"><li><span aria-hidden="true">…</span><strong>Ran command</strong><code>bun run check</code></li>…</ul>
</details>`,
    guidance: ["Group only calls that share one clear task.", "Preserve execution order and expose aggregate progress.", "Do not hide approvals, failures, or cancellation inside a collapsed group."],
  },
  "text-shimmer": {
    slug: "text-shimmer",
    title: "Text Shimmer",
    className: "oc-agent-text-shimmer",
    lede: "A restrained pending-state treatment for short status text while the next agent update is unavailable.",
    previewTitle: "Pending response state",
    preview: `<span class="oc-agent-text-shimmer" role="status" aria-live="polite">Thinking through the request…</span>`,
    markup: `<span class="oc-agent-text-shimmer" role="status" aria-live="polite">Thinking through the request…</span>`,
    guidance: ["Use shimmer only for genuinely pending content.", "Keep status text concise and meaningful without animation.", "Honor reduced-motion preferences and replace the status when work completes."],
  },
  "subagent-tool": {
    slug: "subagent-tool",
    title: "Subagent Tool",
    className: "oc-agent-subagent-tool",
    lede: "A delegated-work surface that identifies the worker, assigned objective, and current execution state.",
    previewTitle: "Delegated agent work",
    preview: `<details class="oc-agent-subagent-tool" open><summary class="oc-agent-subagent-summary"><span class="oc-agent-tool-avatar" aria-hidden="true">A</span><strong>Completed subagent</strong><span>Audit component accessibility</span><time datetime="PT6S">6s</time></summary><div class="oc-agent-subagent-content"><dl class="oc-agent-subagent-meta"><div><dt>Worker</dt><dd>Accessibility reviewer</dd></div><div><dt>Result</dt><dd>No blocking issues</dd></div></dl></div></details>`,
    markup: `<details class="oc-agent-subagent-tool" open>
  <summary class="oc-agent-subagent-summary"><span aria-hidden="true">A</span><strong>Completed subagent</strong><span>Audit component accessibility</span><time datetime="PT6S">6s</time></summary>
  <div class="oc-agent-subagent-content"><dl class="oc-agent-subagent-meta">…</dl></div>
</details>`,
    guidance: ["Identify delegated work by objective rather than an opaque identifier.", "Keep worker and execution state visible and traceable.", "The parent consumer owns delegation, interruption, permissions, and acceptance of results."],
  },
  "spiral-loader": {
    slug: "spiral-loader",
    title: "Spiral Loader",
    className: "oc-agent-spiral-loader",
    lede: "A compact indeterminate progress mark for agent work with no measurable completion value.",
    previewTitle: "Indeterminate agent activity",
    preview: `<span class="oc-agent-spiral-loader" role="status"><svg viewBox="0 0 24 24" aria-hidden="true"><circle class="oc-agent-spiral-track" cx="12" cy="12" r="9"></circle><path class="oc-agent-spiral-path" d="M12 12c0-1.1.9-2 2-2 1.7 0 3 1.3 3 3 0 2.8-2.2 5-5 5-3.9 0-7-3.1-7-7 0-5 4-9 9-9"></path></svg><span class="sr-only">Working</span></span>`,
    markup: `<span class="oc-agent-spiral-loader" role="status">
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle class="oc-agent-spiral-track" cx="12" cy="12" r="9"></circle><path class="oc-agent-spiral-path" d="…"></path></svg>
  <span class="sr-only">Working</span>
</span>`,
    guidance: ["Use only when progress cannot be measured.", "Pair the mark with accessible status text.", "Stop animation when the operation completes or when reduced motion is requested."],
  },
  "search-tool": {
    slug: "search-tool",
    title: "Search Tool",
    className: "oc-agent-search-tool",
    lede: "A search invocation surface that preserves the query, search scope, and returned result count.",
    previewTitle: "Search query and results",
    preview: `<details class="oc-agent-tool oc-agent-search-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("search")}</span><span>Found 3 results</span><span class="oc-agent-tool-status">Reference</span></summary><div class="oc-agent-tool-content"><p class="oc-agent-search-query">Searched for “semantic token adapter”</p><ol class="oc-agent-search-results"><li><a href="../../resources/tailwind/"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span><strong>Tailwind adapter</strong><small>/resources/tailwind/</small></span></a></li><li><a href="../../foundations/tokens/"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span><strong>Design tokens</strong><small>/foundations/tokens/</small></span></a></li><li><a href="../../resources/consumer-adapters/"><span class="oc-agent-search-result-icon" aria-hidden="true">${agentIcon("file")}</span><span><strong>Consumer adapters</strong><small>/resources/consumer-adapters/</small></span></a></li></ol></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-search-tool" open>
  <summary class="oc-agent-tool-summary"><span>Found 3 results</span><span class="oc-agent-tool-status">Reference</span></summary>
  <div class="oc-agent-tool-content"><p class="oc-agent-search-query">Searched for “semantic token adapter”</p><ol class="oc-agent-search-results">…</ol></div>
</details>`,
    guidance: ["Keep the submitted query visible after results arrive.", "Label result count and scope in text.", "The consumer owns search execution, ranking, source attribution, and navigation."],
  },
  "question-tool": {
    slug: "question-tool",
    title: "Question Tool",
    className: "oc-agent-question-tool",
    lede: "A blocking clarification surface that presents one focused question and explicit answer choices.",
    previewTitle: "Request a decision",
    preview: `<form class="oc-agent-tool oc-agent-question-tool" data-agent-question-form><header class="oc-agent-question-header"><span>${agentIcon("learn")} Question</span><span>1 of 2</span></header><fieldset><legend><span aria-hidden="true">1</span> How should we apply this change?</legend><label class="oc-agent-question-option"><input type="radio" name="scope" value="small" checked><span aria-hidden="true">A</span><span>Small scoped patch</span></label><label class="oc-agent-question-option"><input type="radio" name="scope" value="refactor"><span aria-hidden="true">B</span><span>Full refactor</span></label><label class="oc-agent-question-option oc-agent-question-freeform"><span aria-hidden="true">C</span><span class="sr-only">Custom answer</span><input type="text" name="custom-answer" placeholder="Type your answer"></label></fieldset><div class="oc-agent-question-actions"><button class="oc-agent-question-action" type="button" data-agent-question-skip>Skip</button><button class="oc-agent-question-action" type="submit" data-variant="primary">Next</button></div><span class="sr-only" data-agent-question-status aria-live="polite"></span></form>`,
    markup: `<form class="oc-agent-tool oc-agent-question-tool" data-agent-question-form>
  <header class="oc-agent-question-header"><span>Question</span><span>1 of 2</span></header>
  <fieldset><legend>How should we apply this change?</legend><label class="oc-agent-question-option"><input type="radio" name="scope" value="small"> Small scoped patch</label><label class="oc-agent-question-freeform"><span class="sr-only">Custom answer</span><input type="text" name="custom-answer"></label></fieldset>
  <div class="oc-agent-question-actions"><button type="button">Skip</button><button type="submit">Next</button></div>
  <span class="sr-only" aria-live="polite"></span>
</form>`,
    guidance: ["Ask one decision at a time and explain its direct consequence.", "Use native controls and allow a free-form answer when fixed choices are insufficient.", "The consumer owns submission, validation, timeouts, and whether work can continue without an answer."],
  },
  "plan-tool": {
    slug: "plan-tool",
    title: "Plan Tool",
    className: "oc-agent-plan-tool",
    lede: "A structured execution plan that communicates ordered steps and the current point of progress.",
    previewTitle: "Execution plan",
    preview: `<details class="oc-agent-tool oc-agent-plan-tool" data-agent-plan open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">${agentIcon("file")}</span><span>implementation-plan.md</span><span class="oc-agent-tool-status" data-agent-plan-status>Step 2 of 3</span></summary><div class="oc-agent-tool-content"><div class="oc-agent-plan-body"><h4>Refine agent component previews</h4><p>Align structure, interaction, and accessibility while preserving the existing component contract.</p><ol class="oc-agent-plan-list"><li data-state="complete"><span class="sr-only">Completed: </span>Inspect existing contract</li><li data-state="active"><span class="sr-only">In progress: </span>Implement the component</li><li><span class="sr-only">Not started: </span>Validate the preview</li></ol></div><footer class="oc-agent-plan-actions"><button class="oc-agent-plan-action" type="button" data-variant="primary" data-agent-plan-approve>Approve</button></footer></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-plan-tool" open>
  <summary class="oc-agent-tool-summary"><span>implementation-plan.md</span><span class="oc-agent-tool-status">Step 2 of 3</span></summary>
  <div class="oc-agent-tool-content"><div class="oc-agent-plan-body"><ol><li><span class="sr-only">Completed: </span>Inspect contract</li></ol></div><footer class="oc-agent-plan-actions"><button type="button">Approve</button></footer></div>
</details>`,
    guidance: ["Use ordered steps whose completion can be observed.", "Keep the active step and overall progress visible.", "The consumer owns plan generation, updates, approval, and execution."],
  },
};

export const agentReferenceContentIds = Object.keys(components);

export function getAgentReferenceContent(id) {
  const component = components[id];
  return component ? renderAgentComponent(component) : "";
}
