import { describe, expect, test } from "bun:test";
import {
  appendAgentUserMessage,
  bindAgentComponentDemos,
  findAgentSuggestionTarget,
  normalizeAgentDraft,
} from "../preview/agent-components-interactions.js";
import {
  getAgentReferenceContent,
} from "../preview/agent-components.js";
import {
  collaborationTranscriptMarkup,
} from "../preview/agent-identity.js";
import {
  bindInteractiveToolActions,
  agentChatWorkbenchMarkup,
  messageListWorkbenchMarkup,
  toolWorkbenchMarkup,
  todoToolWorkbenchMarkup,
  planToolWorkbenchMarkup,
  questionToolWorkbenchMarkup,
} from "../preview/component-workbench-config.js";

describe("agent component behavior", () => {
  test("keeps collaboration facepile names separate from error status", () => {
    const failed = collaborationTranscriptMarkup({ state: "error" });

    expect(failed).toContain('role="img" aria-label="Shelly, Barnacle, Scampi, Krill"');
    expect(failed).toContain("Agents paused");
    expect(failed).not.toContain("are collaborating");
  });
  test("maps shared tool lifecycle into visible running and complete output", () => {
    expect(toolWorkbenchMarkup({ kind: "interactive", state: "animating", open: true })).toContain(
      "Running command",
    );
    expect(
      toolWorkbenchMarkup({ kind: "interactive", state: "animating", open: true }),
    ).not.toContain(
      "29 pass · 0 fail",
    );
    expect(toolWorkbenchMarkup({ kind: "interactive", state: "complete", open: true })).toContain(
      "29 pass · 0 fail",
    );
    expect(
      toolWorkbenchMarkup({ kind: "interactive", state: "complete", open: false }),
    ).not.toContain('<details class="oc-agent-tool-row" open');
    expect(
      toolWorkbenchMarkup({
        kind: "interactive",
        variant: "browser",
        state: "complete",
        open: true,
      }),
    ).toContain('data-variant="browser"');
    const browser = toolWorkbenchMarkup({
      kind: "interactive",
      variant: "browser",
      state: "complete",
      open: true,
    });
    expect(browser).toContain('aria-label="Compact OpenClaw application preview"');
    expect(browser).toContain('aria-label="Open preview in a new tab"');
    expect(browser).toContain("Carapace parity");
    const artifact = toolWorkbenchMarkup({
      kind: "interactive",
      variant: "artifact",
      state: "complete",
      open: true,
    });
    expect(artifact).toContain("Carapace application artwork preview");
    expect(artifact).toContain('download="application-surface.avif"');
    expect(toolWorkbenchMarkup({ kind: "interactive", state: "complete" })).toContain(
      "data-workbench-tool-copy",
    );
    const openingBrowser = toolWorkbenchMarkup({
      kind: "interactive",
      variant: "browser",
      state: "animating",
      open: true,
    });
    expect(openingBrowser).toContain("Connecting to preview");
    expect(openingBrowser).not.toContain('aria-label="Compact application preview"');
    expect(openingBrowser).not.toContain('aria-label="Open preview"');
    const failedArtifact = toolWorkbenchMarkup({
      kind: "interactive",
      variant: "artifact",
      state: "failed",
      open: true,
    });
    expect(failedArtifact).toContain("Artifact generation failed");
    expect(failedArtifact).toContain('role="alert"');
    expect(failedArtifact).not.toContain("Ready to inspect");
    expect(failedArtifact).not.toContain('aria-label="Download artifact"');
    expect(toolWorkbenchMarkup({ kind: "search", state: "complete", open: false })).not.toContain(
      " open",
    );
    expect(toolWorkbenchMarkup({ kind: "thinking", state: "animating" })).toContain("Thinking");
  });
  test("copies interactive terminal output through its live action", async () => {
    const attributes = new Map();
    const copy = Object.assign(new EventTarget(), {
      setAttribute(name, value) {
        attributes.set(name, value);
      },
    });
    const status = { textContent: "" };
    const output = { textContent: "29 pass · 0 fail" };
    const writes = [];
    const specimen = {
      querySelector(selector) {
        if (selector === "[data-workbench-tool-status]") return status;
        if (selector === "[data-workbench-tool-copy]") return copy;
        if (selector === ".oc-agent-bash-output code") return output;
        return null;
      },
    };

    expect(bindInteractiveToolActions(specimen, { writeText: (value) => writes.push(value) })).toBe(
      1,
    );
    copy.dispatchEvent(new Event("click"));
    await Promise.resolve();

    expect(writes).toEqual(["29 pass · 0 fail"]);
    expect(attributes.get("data-state")).toBe("copied");
    expect(status.textContent).toBe("Command output copied");

    const failedAttributes = new Map();
    const failedCopy = Object.assign(new EventTarget(), {
      setAttribute(name, value) {
        failedAttributes.set(name, value);
      },
    });
    const failedStatus = { textContent: "" };
    bindInteractiveToolActions(
      {
        querySelector(selector) {
          if (selector === "[data-workbench-tool-status]") return failedStatus;
          if (selector === "[data-workbench-tool-copy]") return failedCopy;
          if (selector === ".oc-agent-bash-output code") return output;
          return null;
        },
      },
      undefined,
    );
    failedCopy.dispatchEvent(new Event("click"));
    await Promise.resolve();
    expect(failedAttributes.get("data-state")).toBe("error");
    expect(failedStatus.textContent).toBe("Command output could not be copied");
  });
  test("keeps specialized tool states faithful to their public data", () => {
    expect(todoToolWorkbenchMarkup({ status: "pending" })).toContain('data-state="pending"');
    expect(todoToolWorkbenchMarkup({ status: "in_progress" })).toContain('data-state="active"');
    expect(todoToolWorkbenchMarkup({ status: "completed" })).toContain('data-state="complete"');
    expect(planToolWorkbenchMarkup({ state: "complete", approved: true })).toContain("Approved");
    expect(questionToolWorkbenchMarkup({ state: "answered", allowSkip: true })).toContain(
      "Focused checks",
    );
    expect(questionToolWorkbenchMarkup({ state: "answered" })).toContain(
      'class="oc-agent-question-summary"',
    );
    expect(questionToolWorkbenchMarkup({ state: "open", allowSkip: false })).not.toContain(
      "data-agent-question-skip",
    );
    expect(questionToolWorkbenchMarkup({ state: "submitting" })).toContain("<fieldset disabled>");
    expect(questionToolWorkbenchMarkup({ state: "error" })).toContain('role="alert"');
    expect(questionToolWorkbenchMarkup({ state: "error" })).toContain("Try again");
    expect(questionToolWorkbenchMarkup({ state: "error" })).toContain("Focused checks");
  });
  test("renders distinct Agent Chat empty, streaming, and error states", () => {
    const multiUser = agentChatWorkbenchMarkup({ example: "multi-user", status: "ready" });
    const multiAgent = agentChatWorkbenchMarkup({ example: "multi-agent", status: "ready" });
    const media = agentChatWorkbenchMarkup({ example: "media", status: "ready" });
    const userArticle = media.slice(
      media.indexOf('data-author="user"'),
      media.indexOf("</article>") + "</article>".length,
    );

    expect(agentChatWorkbenchMarkup({ example: "empty", status: "ready" })).not.toContain(
      "Conversation history",
    );
    expect(agentChatWorkbenchMarkup({ example: "suggestions", status: "ready" })).toContain(
      'aria-label="Suggested prompts"',
    );
    expect(agentChatWorkbenchMarkup({ example: "suggestions", status: "error" })).toContain(
      'data-attribution="none"',
    );
    expect(agentChatWorkbenchMarkup({ example: "basic", status: "streaming" })).toContain(
      'data-status="streaming"',
    );
    expect(agentChatWorkbenchMarkup({ example: "basic", status: "error" })).toContain(
      "Request failed",
    );
    expect(agentChatWorkbenchMarkup({ example: "empty", status: "error" })).toContain(
      "Request failed",
    );
    expect(agentChatWorkbenchMarkup({ example: "multi-user", status: "error" })).toContain(
      "Request failed",
    );
    expect(agentChatWorkbenchMarkup({ example: "media", status: "streaming" })).toContain(
      'data-status="streaming"',
    );
    expect(multiUser).toContain('class="oc-avatar-image"');
    expect(multiUser).toContain("<strong>OpenClaw</strong>");
    expect(multiUser).not.toContain('role="listitem"');
    expect(agentChatWorkbenchMarkup({ example: "multi-agent", status: "streaming" })).toContain(
      'data-variant="transcript"',
    );
    expect(agentChatWorkbenchMarkup({ example: "multi-agent", status: "streaming" })).toContain(
      "Agents thinking",
    );
    expect(multiAgent).toContain("Agents ready");
    expect(multiAgent).toContain("<strong>Shelly</strong>");
    expect(multiAgent).toContain("<strong>Barnacle</strong>");
    expect(multiAgent).toContain('role="listitem"');
    const multiAgentError = agentChatWorkbenchMarkup({
      example: "multi-agent",
      status: "error",
    });
    expect(multiAgentError).toContain('data-state="error"');
    expect(multiAgentError).toContain("Agents paused");
    expect(multiAgentError).toContain('role="alert"');
    expect(multiAgentError).not.toContain("Agents thinking");
    expect(media).toContain('data-kind="video"');
    expect(media).toContain('data-kind="audio"');
    expect(media).toContain("4 attachments ready");
    expect(userArticle).toContain("oc-agent-media-grid");
    expect(agentChatWorkbenchMarkup({ example: "media", status: "ready" })).not.toContain(
      "Inspecting 4 attachments",
    );
    expect(agentChatWorkbenchMarkup({ example: "media", status: "streaming" })).toContain(
      "Inspecting 4 attachments",
    );
    expect(agentChatWorkbenchMarkup({ example: "media", status: "submitted" })).toContain(
      "surface-audit.pdf · queued",
    );
    expect(agentChatWorkbenchMarkup({ example: "media", status: "submitted" })).toContain(
      "Queued 4 attachments",
    );
    expect(agentChatWorkbenchMarkup({ example: "media", status: "error" })).toContain(
      "Attachment inspection failed",
    );
    expect(agentChatWorkbenchMarkup({ example: "empty", status: "ready" })).toContain(
      "data-agent-file-drop",
    );
  });
  test("keeps transcript copy actions opt-in", () => {
    expect(messageListWorkbenchMarkup({ status: "ready", copyToolbar: true })).toContain(
      "Copy response",
    );
    expect(messageListWorkbenchMarkup({ status: "ready", copyToolbar: false })).not.toContain(
      "Copy response",
    );
  });
  test("keeps agent search results informational rather than navigable", () => {
    const markup = getAgentReferenceContent("search-tool");
    expect(markup).toContain("Searched for");
    expect(markup).toContain("/foundations/tokens/");
    expect(markup).not.toContain("<a href");
  });
  test("keeps agent markdown links inside the deployed preview base path", () => {
    const markup = getAgentReferenceContent("markdown");
    expect(markup).toContain('href="../../foundations/tokens/"');
    expect(markup).not.toContain('href="/foundations/');
  });
  test("keeps the agent error message plain and alert-scoped", () => {
    const markup = getAgentReferenceContent("error-message");

    expect(markup).toContain('class="oc-agent-error-message" role="alert"');
    expect(markup).toContain("Something went wrong");
    expect(markup).not.toContain("data-agent-retry");
  });
  test("keeps agent chat suggestions actionable without making the transcript live", () => {
    const markup = getAgentReferenceContent("agent-chat");
    expect(markup).toContain('data-agent-suggestion-target="agent-chat-message"');
    expect(markup).toContain('data-agent-chat-status aria-live="polite"');
    expect(markup).not.toContain(
      'oc-agent-chat-messages" aria-label="Conversation history" aria-live',
    );
  });
  test("submits a trimmed agent chat draft into the visible transcript", () => {
    class Element extends EventTarget {
      children = [];
      className = "";
      textContent = "";
      value = "  Review the current diff.  ";
      ownerDocument;
      constructor(ownerDocument) {
        super();
        this.ownerDocument = ownerDocument;
      }
      append(child) {
        this.children.push(child);
      }
    }

    const ownerDocument = { createElement: () => new Element(ownerDocument) };
    const input = new Element(ownerDocument);
    let inputEvents = 0;
    input.addEventListener("input", () => (inputEvents += 1));
    const transcript = new Element(ownerDocument);
    const scroller = new Element(ownerDocument);
    const status = new Element(ownerDocument);
    scroller.scrollHeight = 320;
    scroller.scrollTop = 0;
    const form = new Element(ownerDocument);
    form.querySelector = () => input;
    form.closest = () => ({
      querySelector: (selector) => {
        if (selector === ".oc-agent-message-list-content") return transcript;
        if (selector === ".oc-agent-message-list") return scroller;
        return status;
      },
    });
    const root = {
      querySelectorAll(selector) {
        return selector === "[data-agent-chat-form]" ? [form] : [];
      },
    };

    expect(normalizeAgentDraft(input.value)).toBe("Review the current diff.");
    expect(bindAgentComponentDemos(root)).toBe(1);
    const submit = new Event("submit", { cancelable: true });
    form.dispatchEvent(submit);

    expect(submit.defaultPrevented).toBe(true);
    expect(input.value).toBe("");
    expect(inputEvents).toBe(1);
    expect(scroller.scrollTop).toBe(320);
    const turn = transcript.children[0];
    expect(turn.className).toBe("oc-agent-turn");
    expect(turn.children[0].className).toBe("oc-agent-user-message-stack");
    expect(turn.children[0].children[0].className).toBe("oc-agent-user-message");
    expect(turn.children[0].children[0].children[0].textContent).toBe("Review the current diff.");
    expect(status.textContent).toBe("Message sent");
  });
  test("preserves participant attribution when a multi-user chat submits", () => {
    class Element {
      children = [];
      attributes = new Map();
      className = "";
      dataset = {};
      textContent = "";
      value = "";
      ownerDocument;
      constructor(ownerDocument) {
        this.ownerDocument = ownerDocument;
      }
      append(child) {
        this.children.push(child);
      }
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
    }

    const ownerDocument = {
      createElement: () => new Element(ownerDocument),
      defaultView: { matchMedia: () => ({ matches: true }) },
    };
    const form = new Element(ownerDocument);
    const input = new Element(ownerDocument);
    input.value = "  Keep the participant bubble attached.  ";
    const transcript = new Element(ownerDocument);
    const scroller = new Element(ownerDocument);
    scroller.scrollHeight = 480;
    const status = new Element(ownerDocument);
    const generatedAvatar = new Element(ownerDocument);
    generatedAvatar.className = "oc-avatar oc-avatar-xs oc-avatar-pixel";
    const generatedImage = new Element(ownerDocument);
    generatedImage.className = "oc-avatar-image";
    generatedAvatar.append(generatedImage);
    generatedAvatar.cloneNode = () => generatedAvatar;
    const chat = {
      dataset: { attribution: "participants", userName: "Shelly" },
      querySelector: () => generatedAvatar,
    };

    const message = appendAgentUserMessage({
      form,
      input,
      chat,
      transcript,
      scroller,
      status,
    });

    expect(message?.className).toBe("oc-agent-attributed-message");
    expect(message?.attributes.get("data-author")).toBe("user");
    expect(message?.children[0].className).toBe("oc-avatar oc-avatar-xs oc-avatar-pixel");
    expect(message?.children[0].children[0].className).toBe("oc-avatar-image");
    expect(message?.children[1].children[0].children[0].textContent).toBe("Shelly");
    expect(message?.children[1].children[0].children[1].textContent).toBe("You");
    expect(message?.children[1].children[1].children[0].textContent).toBe(
      "Keep the participant bubble attached.",
    );
    expect(input.value).toBe("");
    expect(scroller.scrollTop).toBe(480);
    expect(status.textContent).toBe("Message sent");
  });
  test("preserves empty-state submit feedback without a transcript", () => {
    const input = { value: "  Start a new conversation.  " };
    const status = { textContent: "" };
    const form = { ownerDocument: {} };

    expect(
      appendAgentUserMessage({
        form,
        input,
        chat: { dataset: { attribution: "participants" } },
        status,
      }),
    ).toBe(null);
    expect(input.value).toBe("");
    expect(status.textContent).toBe("Message sent");
  });
  test("submits a standalone composer without navigating away", () => {
    const input = {
      value: "  Ship this update.  ",
      focused: false,
      focus() {
        this.focused = true;
      },
    };
    const status = { textContent: "" };
    const form = new EventTarget();
    form.querySelector = (selector) => (selector === ".oc-agent-input" ? input : status);
    const root = {
      querySelectorAll(selector) {
        return selector === "[data-agent-compose-form]" ? [form] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    const submit = new Event("submit", { cancelable: true });
    form.dispatchEvent(submit);

    expect(submit.defaultPrevented).toBe(true);
    expect(input.value).toBe("");
    expect(input.focused).toBe(true);
    expect(status.textContent).toBe("Message sent");
  });
  test("moves a selected suggestion into its linked composer", () => {
    const inputEvents = [];
    const input = new EventTarget();
    input.value = "";
    input.focused = false;
    input.focus = () => (input.focused = true);
    input.addEventListener("input", () => inputEvents.push(input.value));
    const suggestion = new EventTarget();
    suggestion.dataset = {
      agentSuggestionTarget: "message",
      agentSuggestionValue: "Review the implementation",
    };
    suggestion.textContent = "Review";
    const root = {
      getElementById: (id) => (id === "message" ? input : null),
      querySelectorAll(selector) {
        return selector === "[data-agent-suggestion-value]" ? [suggestion] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    suggestion.dispatchEvent(new Event("click"));
    expect(input.value).toBe("Review the implementation");
    expect(input.focused).toBe(true);
    expect(inputEvents).toEqual(["Review the implementation"]);
  });
  test("finds a suggestion target when the binding root is an element", () => {
    const input = { id: "message" };
    const root = {
      querySelectorAll(selector) {
        return selector === "[id]" ? [input] : [];
      },
    };

    expect(findAgentSuggestionTarget(root, "message")).toBe(input);
    expect(findAgentSuggestionTarget(root, "missing")).toBe(null);
  });
  test("updates and closes the agent mode selector", () => {
    const label = { textContent: "Agent" };
    const summary = {
      focused: false,
      focus() {
        this.focused = true;
      },
    };
    const agent = new EventTarget();
    agent.checked = true;
    agent.value = "Agent";
    const plan = new EventTarget();
    plan.checked = false;
    plan.value = "Plan";
    const selector = {
      open: true,
      querySelector: (query) => (query === "summary" ? summary : label),
      querySelectorAll: () => [agent, plan],
    };
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-mode-selector]" ? [selector] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    agent.checked = false;
    plan.checked = true;
    plan.dispatchEvent(new Event("change"));
    expect(label.textContent).toBe("Plan");
    expect(selector.open).toBe(false);
    expect(summary.focused).toBe(true);
  });
  test("updates and closes the agent model picker", () => {
    const name = { textContent: "Balanced" };
    const version = { textContent: "4.6" };
    const summary = {
      focused: false,
      focus() {
        this.focused = true;
      },
    };
    const balanced = new EventTarget();
    balanced.checked = true;
    balanced.value = "Balanced";
    balanced.dataset = { agentModelOptionVersion: "4.6" };
    const fast = new EventTarget();
    fast.checked = false;
    fast.value = "Fast";
    fast.dataset = { agentModelOptionVersion: "2.1" };
    const picker = {
      open: true,
      querySelector: (query) => {
        if (query === "[data-agent-model-name]") return name;
        if (query === "[data-agent-model-version]") return version;
        return summary;
      },
      querySelectorAll: () => [balanced, fast],
    };
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-model-picker]" ? [picker] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    balanced.checked = false;
    fast.checked = true;
    fast.dispatchEvent(new Event("change"));
    expect(name.textContent).toBe("Fast");
    expect(version.textContent).toBe("2.1");
    expect(picker.open).toBe(false);
    expect(summary.focused).toBe(true);
  });
  test("removes only the selected file attachment", () => {
    let removed = false;
    const attachment = {
      remove: () => {
        removed = true;
      },
    };
    const button = new EventTarget();
    button.closest = () => attachment;
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-attachment-remove]" ? [button] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    button.dispatchEvent(new Event("click"));
    expect(removed).toBe(true);
  });
  test("marks an approved plan without submitting the page", () => {
    const attributes = new Map();
    const status = { textContent: "Step 2 of 3" };
    const plan = {
      querySelector: () => status,
      setAttribute: (name, value) => attributes.set(name, value),
    };
    const button = new EventTarget();
    button.disabled = false;
    button.textContent = "Approve";
    button.closest = () => plan;
    const root = {
      querySelectorAll(query) {
        return query === "[data-agent-plan-approve]" ? [button] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    button.dispatchEvent(new Event("click"));
    expect(attributes.get("data-state")).toBe("approved");
    expect(status.textContent).toBe("Approved");
    expect(button.disabled).toBe(true);
  });
  test("keeps the plan card named, expandable, and approvable", () => {
    const markup = getAgentReferenceContent("plan-tool");
    expect(markup).toContain("plan-working.md");
    expect(markup).toContain('aria-label="Expand plan" aria-expanded="false"');
    expect(markup).toContain("Read detailed plan");
    expect(markup).toContain("data-agent-plan-approve");
  });
  test("submits and skips agent questions without navigating", () => {
    const status = { textContent: "" };
    const skip = new EventTarget();
    const form = new EventTarget();
    form.dataset = {};
    form.querySelector = () => status;
    form.querySelectorAll = (selector) => {
      if (selector === "[data-agent-question-skip]") return [skip];
      return [];
    };
    const root = {
      querySelectorAll(selector) {
        return selector === "[data-agent-question-form]" ? [form] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);
    const submit = new Event("submit", { cancelable: true });
    form.dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(true);
    expect(form.dataset.state).toBe("answered");
    expect(status.textContent).toBe("Answer submitted");

    skip.dispatchEvent(new Event("click"));
    expect(form.dataset.state).toBe("skipped");
    expect(status.textContent).toBe("Question skipped");
  });
  test("accepts file drops without reacting to dragged text", () => {
    const status = { textContent: "" };
    const target = new EventTarget();
    target.dataset = {};
    target.querySelector = () => status;
    const root = {
      querySelectorAll(selector) {
        return selector === "[data-agent-file-drop]" ? [target] : [];
      },
    };

    expect(bindAgentComponentDemos(root)).toBe(1);

    const textDrag = new Event("dragenter", { cancelable: true });
    Object.defineProperty(textDrag, "dataTransfer", {
      value: { types: ["text/plain"], files: [] },
    });
    target.dispatchEvent(textDrag);
    expect(textDrag.defaultPrevented).toBe(false);
    expect(target.dataset.dropActive).toBeUndefined();

    const textDrop = new Event("drop", { cancelable: true });
    Object.defineProperty(textDrop, "dataTransfer", {
      value: { types: ["text/plain"], files: [] },
    });
    target.dispatchEvent(textDrop);
    expect(textDrop.defaultPrevented).toBe(false);
    expect(status.textContent).toBe("");

    const fileDrag = new Event("dragenter", { cancelable: true });
    Object.defineProperty(fileDrag, "dataTransfer", {
      value: { types: ["Files"], files: [] },
    });
    target.dispatchEvent(fileDrag);
    expect(fileDrag.defaultPrevented).toBe(true);
    expect(target.dataset.dropActive).toBe("true");

    const fileDrop = new Event("drop", { cancelable: true });
    Object.defineProperty(fileDrop, "dataTransfer", {
      value: { types: ["Files"], files: [{ name: "reference.png" }] },
    });
    target.dispatchEvent(fileDrop);
    expect(fileDrop.defaultPrevented).toBe(true);
    expect(target.dataset.dropActive).toBe("false");
    expect(status.textContent).toBe("1 file attached");
  });
  test("keeps MCP results named and keyboard scrollable", () => {
    const markup = getAgentReferenceContent("mcp-tool");
    expect(markup).toContain('aria-label="MCP tool result"');
    expect(markup).toContain('tabindex="0"');
    expect(markup).toContain("design-system://tokens");
  });
});
