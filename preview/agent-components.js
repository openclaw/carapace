function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function codeBlock(code) {
  return `<div class="code-block"><div class="code-block-header"><span>HTML</span><button type="button" data-copy-code>Copy</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function guidanceList(items) {
  return `<ul class="guidance-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
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
    preview: `<details class="oc-agent-tool oc-agent-bash-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">›_</span><span>Run validation</span><span class="oc-agent-tool-status">Exit 0</span></summary><div class="oc-agent-tool-content"><pre><code>$ bun run check\n23 pass · 0 fail</code></pre></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-bash-tool" open>
  <summary class="oc-agent-tool-summary"><span>Run validation</span><span class="oc-agent-tool-status">Exit 0</span></summary>
  <div class="oc-agent-tool-content"><pre><code>$ bun run check</code></pre></div>
</details>`,
    guidance: ["Display the exact command separately from its output.", "Expose exit state in text and preserve output whitespace.", "Require consumer-controlled approval for commands with meaningful side effects."],
  },
  "generic-tool": {
    slug: "generic-tool",
    title: "Generic Tool",
    className: "oc-agent-tool",
    lede: "A shared disclosure surface for tool identity, execution state, input, and result content.",
    previewTitle: "Tool invocation and result",
    preview: `<details class="oc-agent-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">◇</span><span>Inspect workspace</span><span class="oc-agent-tool-status">Completed</span></summary><div class="oc-agent-tool-content"><code>3 files changed</code></div></details>`,
    markup: `<details class="oc-agent-tool" open>
  <summary class="oc-agent-tool-summary"><span>Inspect workspace</span><span class="oc-agent-tool-status">Completed</span></summary>
  <div class="oc-agent-tool-content">…</div>
</details>`,
    guidance: ["Keep tool name and execution state visible while collapsed.", "Render input and output as selectable content.", "The consumer owns approval, cancellation, execution, streaming, and error handling."],
  },
  "error-message": {
    slug: "error-message",
    title: "Error Message",
    className: "oc-agent-error-message",
    lede: "A recoverable conversation error that explains what failed and exposes the next valid action.",
    previewTitle: "Recover from a failed response",
    preview: `<div class="oc-agent-error-message" role="alert"><div><strong>Response failed</strong><p>The connection ended before the response completed.</p></div><button class="oc-button oc-button-secondary" type="button">Retry</button></div>`,
    markup: `<div class="oc-agent-error-message" role="alert">
  <div><strong>Response failed</strong><p>The connection ended before the response completed.</p></div>
  <button class="oc-button oc-button-secondary" type="button">Retry</button>
</div>`,
    guidance: ["State the failure in plain language and preserve any safe recovery action.", "Use an alert only when the error appears after an attempted action.", "The consumer owns error mapping, retry logic, logging, and destructive recovery decisions."],
  },
  "edit-tool": {
    slug: "edit-tool",
    title: "Edit Tool",
    className: "oc-agent-edit-tool",
    lede: "A file-change tool surface that identifies the target and summarizes additions and removals.",
    previewTitle: "File edit result",
    preview: `<details class="oc-agent-tool oc-agent-edit-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">±</span><span>styles/components.css</span><span class="oc-agent-tool-status"><span class="oc-agent-diff-add">+12</span> <span class="oc-agent-diff-remove">−2</span></span></summary><div class="oc-agent-tool-content"><code>Added the component state styles.</code></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-edit-tool" open>
  <summary class="oc-agent-tool-summary"><span>styles/components.css</span><span class="oc-agent-tool-status">+12 −2</span></summary>
  <div class="oc-agent-tool-content">…</div>
</details>`,
    guidance: ["Always identify the affected file or resource.", "Pair addition and removal counts with a readable change summary.", "The consumer owns approval, patch application, conflict handling, and rollback."],
  },
  "agent-chat": {
    slug: "agent-chat",
    title: "Agent Chat",
    className: "oc-agent-chat",
    lede: "A complete conversation surface that keeps message history, suggestions, status, and message entry in one bounded workflow.",
    previewTitle: "Conversation workspace",
    preview: `<section class="oc-agent-chat" aria-label="Agent conversation"><div class="oc-agent-chat-messages" aria-live="polite"><article class="oc-agent-message"><span class="oc-agent-message-role">Assistant</span><p>I can inspect the current workspace and explain the next safe step.</p></article><article class="oc-user-message"><p>Summarize the pending changes.</p></article></div><div class="oc-agent-chat-suggestions" aria-label="Suggested prompts"><button class="oc-agent-suggestion" type="button">Review changes</button><button class="oc-agent-suggestion" type="button">Run checks</button></div><form class="oc-agent-input-bar"><label class="sr-only" for="agent-chat-message">Message</label><textarea id="agent-chat-message" class="oc-agent-input" rows="1" placeholder="Send a message…"></textarea><button class="oc-agent-send-button" type="submit" aria-label="Send message">↑</button></form></section>`,
    markup: `<section class="oc-agent-chat" aria-label="Agent conversation">
  <div class="oc-agent-chat-messages" aria-live="polite">…</div>
  <div class="oc-agent-chat-suggestions">…</div>
  <form class="oc-agent-input-bar">…</form>
</section>`,
    guidance: ["Keep the message list as the primary flexible region.", "Expose streamed updates through a polite live region without repeatedly announcing the entire transcript.", "The consumer owns message data, submission, stopping, attachments, and tool execution."],
  },
  "message-list": {
    slug: "message-list",
    title: "Message List",
    className: "oc-agent-message-list",
    lede: "A readable transcript that preserves message order, role, streaming state, and tool output within one scrollable history.",
    previewTitle: "Ordered conversation history",
    preview: `<ol class="oc-agent-message-list" aria-label="Conversation history"><li class="oc-user-message"><p>Which files changed?</p></li><li class="oc-agent-message"><span class="oc-agent-message-role">Assistant</span><p>Three component files and one reference route changed.</p></li><li class="oc-agent-message" data-status="streaming"><span class="oc-agent-message-role">Assistant · responding</span><p>Checking the validation output…</p></li></ol>`,
    markup: `<ol class="oc-agent-message-list" aria-label="Conversation history">
  <li class="oc-user-message">…</li>
  <li class="oc-agent-message" data-status="streaming">…</li>
</ol>`,
    guidance: ["Render messages in chronological document order.", "Use role text and semantics instead of color alone.", "Preserve the user's reading position when older messages are prepended."],
  },
  "input-bar": {
    slug: "input-bar",
    title: "Input Bar",
    className: "oc-agent-input-bar",
    lede: "A message composer that keeps text entry, attachments, and the current send or stop action in one bounded control.",
    previewTitle: "Compose and submit",
    preview: `<form class="oc-agent-input-bar oc-agent-input-bar-standalone"><button class="oc-agent-input-action" type="button" aria-label="Attach file">+</button><label class="sr-only" for="input-bar-message">Message</label><textarea id="input-bar-message" class="oc-agent-input" rows="2" placeholder="Send a message…"></textarea><button class="oc-agent-send-button" type="submit" aria-label="Send message">↑</button></form>`,
    markup: `<form class="oc-agent-input-bar">
  <button class="oc-agent-input-action" type="button" aria-label="Attach file">+</button>
  <label class="sr-only" for="message">Message</label>
  <textarea id="message" class="oc-agent-input" placeholder="Send a message…"></textarea>
  <button class="oc-agent-send-button" type="submit" aria-label="Send message">↑</button>
</form>`,
    guidance: ["Keep one visible message field and one current primary action.", "Change the send action to stop while a response is streaming.", "The consumer owns submission, draft persistence, attachment processing, and keyboard shortcuts."],
  },
  "suggestions": {
    slug: "suggestions",
    title: "Suggestions",
    className: "oc-agent-suggestions",
    lede: "Short prompt starters that help users begin or continue a conversation without replacing free-form input.",
    previewTitle: "Useful next prompts",
    preview: `<div class="oc-agent-suggestions" aria-label="Suggested prompts"><button class="oc-agent-suggestion" type="button">Summarize changes</button><button class="oc-agent-suggestion" type="button">Run validation</button><button class="oc-agent-suggestion" type="button">Explain the failure</button></div>`,
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
    preview: `<label class="oc-agent-model-field"><span class="oc-agent-model-label">Model</span><select class="oc-agent-model-picker"><option>OpenClaw Fast</option><option>OpenClaw Balanced</option><option>OpenClaw Deep</option></select></label>`,
    markup: `<label class="oc-agent-model-field">
  <span class="oc-agent-model-label">Model</span>
  <select class="oc-agent-model-picker">
    <option>OpenClaw Fast</option>
    <option>OpenClaw Balanced</option>
  </select>
</label>`,
    guidance: ["Show the selected model without requiring the menu to open.", "Use stable human-readable names and preserve capability details in the option label or adjacent help.", "The consumer owns availability, entitlement, persistence, and routing."],
  },
  "mode-selector": {
    slug: "mode-selector",
    title: "Mode Selector",
    className: "oc-agent-mode-selector",
    lede: "A compact choice between distinct agent execution behaviors such as direct work and planning.",
    previewTitle: "Choose an execution mode",
    preview: `<fieldset class="oc-agent-mode-selector"><legend class="sr-only">Execution mode</legend><label class="oc-agent-mode-option"><input type="radio" name="mode" checked><span>Agent</span></label><label class="oc-agent-mode-option"><input type="radio" name="mode"><span>Plan</span></label></fieldset>`,
    markup: `<fieldset class="oc-agent-mode-selector">
  <legend class="sr-only">Execution mode</legend>
  <label class="oc-agent-mode-option"><input type="radio" name="mode" checked><span>Agent</span></label>
  <label class="oc-agent-mode-option"><input type="radio" name="mode"><span>Plan</span></label>
</fieldset>`,
    guidance: ["Use modes only when they materially change how the agent works.", "Keep labels short and mutually exclusive.", "The consumer owns mode availability, persistence, and execution behavior."],
  },
  "user-message": {
    slug: "user-message",
    title: "User Message",
    className: "oc-agent-user-message",
    lede: "A distinct transcript entry for user-authored prompts and attachments.",
    previewTitle: "User-authored prompt",
    preview: `<article class="oc-agent-user-message"><p>Summarize the changes in this branch.</p><footer class="oc-agent-message-meta">You · now</footer></article>`,
    markup: `<article class="oc-agent-user-message">
  <p>Summarize the changes in this branch.</p>
  <footer class="oc-agent-message-meta">You · now</footer>
</article>`,
    guidance: ["Keep user text selectable and in document order.", "Use alignment and surface treatment without relying on color alone.", "The consumer owns editing, retrying, timestamps, and attachment data."],
  },
  "todo-tool": {
    slug: "todo-tool",
    title: "Todo Tool",
    className: "oc-agent-todo-tool",
    lede: "A compact task-state surface for work the agent is tracking during a bounded run.",
    previewTitle: "Tracked task progress",
    preview: `<details class="oc-agent-tool oc-agent-todo-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">☑</span><span>Update component reference</span><span class="oc-agent-tool-status">2 of 3</span></summary><div class="oc-agent-tool-content"><ul class="oc-agent-todo-list"><li data-state="complete">Inspect contract</li><li data-state="complete">Implement component</li><li data-state="active">Run visual check</li></ul></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-todo-tool" open>
  <summary class="oc-agent-tool-summary"><span>Update component reference</span><span class="oc-agent-tool-status">2 of 3</span></summary>
  <div class="oc-agent-tool-content"><ul class="oc-agent-todo-list">…</ul></div>
</details>`,
    guidance: ["Keep task labels outcome-oriented and ordered.", "Expose complete, active, and pending states in text or semantics.", "The consumer owns task mutation, persistence, and completion rules."],
  },
  "text-shimmer": {
    slug: "text-shimmer",
    title: "Text Shimmer",
    className: "oc-agent-text-shimmer",
    lede: "A restrained pending-state treatment for short status text while the next agent update is unavailable.",
    previewTitle: "Pending response state",
    preview: `<span class="oc-agent-text-shimmer" role="status">Thinking through the request</span>`,
    markup: `<span class="oc-agent-text-shimmer" role="status">Thinking through the request</span>`,
    guidance: ["Use shimmer only for genuinely pending content.", "Keep status text concise and meaningful without animation.", "Honor reduced-motion preferences and replace the status when work completes."],
  },
  "spiral-loader": {
    slug: "spiral-loader",
    title: "Spiral Loader",
    className: "oc-agent-spiral-loader",
    lede: "A compact indeterminate progress mark for agent work with no measurable completion value.",
    previewTitle: "Indeterminate agent activity",
    preview: `<span class="oc-agent-spiral-loader" role="status"><span class="sr-only">Working</span></span>`,
    markup: `<span class="oc-agent-spiral-loader" role="status"><span class="sr-only">Working</span></span>`,
    guidance: ["Use only when progress cannot be measured.", "Pair the mark with accessible status text.", "Stop animation when the operation completes or when reduced motion is requested."],
  },
  "search-tool": {
    slug: "search-tool",
    title: "Search Tool",
    className: "oc-agent-search-tool",
    lede: "A search invocation surface that preserves the query, search scope, and returned result count.",
    previewTitle: "Search query and results",
    preview: `<details class="oc-agent-tool oc-agent-search-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">⌕</span><span>Search “token adapter”</span><span class="oc-agent-tool-status">4 results</span></summary><div class="oc-agent-tool-content"><ol class="oc-agent-search-results"><li><a href="#">Tailwind adapter</a></li><li><a href="#">Token contract</a></li></ol></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-search-tool" open>
  <summary class="oc-agent-tool-summary"><span>Search “token adapter”</span><span class="oc-agent-tool-status">4 results</span></summary>
  <div class="oc-agent-tool-content"><ol class="oc-agent-search-results">…</ol></div>
</details>`,
    guidance: ["Keep the submitted query visible after results arrive.", "Label result count and scope in text.", "The consumer owns search execution, ranking, source attribution, and navigation."],
  },
  "plan-tool": {
    slug: "plan-tool",
    title: "Plan Tool",
    className: "oc-agent-plan-tool",
    lede: "A structured execution plan that communicates ordered steps and the current point of progress.",
    previewTitle: "Execution plan",
    preview: `<details class="oc-agent-tool oc-agent-plan-tool" open><summary class="oc-agent-tool-summary"><span class="oc-agent-tool-icon" aria-hidden="true">≡</span><span>Implementation plan</span><span class="oc-agent-tool-status">Step 2 of 3</span></summary><div class="oc-agent-tool-content"><ol class="oc-agent-plan-list"><li data-state="complete">Inspect existing contract</li><li data-state="active">Implement the component</li><li>Validate the preview</li></ol></div></details>`,
    markup: `<details class="oc-agent-tool oc-agent-plan-tool" open>
  <summary class="oc-agent-tool-summary"><span>Implementation plan</span><span class="oc-agent-tool-status">Step 2 of 3</span></summary>
  <div class="oc-agent-tool-content"><ol class="oc-agent-plan-list">…</ol></div>
</details>`,
    guidance: ["Use ordered steps whose completion can be observed.", "Keep the active step and overall progress visible.", "The consumer owns plan generation, updates, approval, and execution."],
  },
};

export const agentReferenceContentIds = Object.keys(components);

export function getAgentReferenceContent(id) {
  const component = components[id];
  return component ? renderAgentComponent(component) : "";
}
