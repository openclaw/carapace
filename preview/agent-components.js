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
};

export const agentReferenceContentIds = Object.keys(components);

export function getAgentReferenceContent(id) {
  const component = components[id];
  return component ? renderAgentComponent(component) : "";
}
