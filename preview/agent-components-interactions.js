export function normalizeAgentDraft(value) {
  return String(value || "").trim();
}

export function findAgentSuggestionTarget(root, targetId) {
  if (!targetId) return null;
  if (typeof root.getElementById === "function") return root.getElementById(targetId);
  const candidates = typeof root.querySelectorAll === "function" ? root.querySelectorAll("[id]") : [];
  return [...candidates].find((candidate) => candidate.id === targetId) || null;
}

function createAttributedAvatar(doc, chat, userName) {
  const existing = chat?.querySelector?.('[data-author="user"] .oc-avatar');
  const cloned = existing?.cloneNode?.(true);
  if (cloned) return cloned;

  const avatar = doc.createElement("span");
  avatar.className = "oc-avatar oc-avatar-xs";
  avatar.setAttribute("aria-hidden", "true");
  const fallback = doc.createElement("span");
  fallback.className = "oc-avatar-fallback";
  fallback.textContent = userName.slice(0, 2).toUpperCase();
  avatar.append(fallback);
  return avatar;
}

function appendAttributedUserMessage(doc, chat, transcript, draft, userName) {
  const message = doc.createElement("article");
  message.className = "oc-agent-attributed-message";
  message.setAttribute("data-author", "user");

  const avatar = createAttributedAvatar(doc, chat, userName);

  const content = doc.createElement("div");
  content.className = "oc-agent-message-content";
  const author = doc.createElement("header");
  author.className = "oc-agent-message-author";
  const name = doc.createElement("strong");
  name.textContent = userName;
  const role = doc.createElement("span");
  role.className = "oc-agent-message-role";
  role.textContent = "You";
  author.append(name);
  author.append(role);

  const bubble = doc.createElement("div");
  bubble.className = "oc-agent-message-bubble";
  const paragraph = doc.createElement("p");
  paragraph.textContent = draft;
  bubble.append(paragraph);
  content.append(author);
  content.append(bubble);
  message.append(avatar);
  message.append(content);
  transcript.append(message);
  return message;
}

function appendDirectUserMessage(doc, transcript, draft) {
  const turn = doc.createElement("div");
  turn.className = "oc-agent-turn";
  const stack = doc.createElement("div");
  stack.className = "oc-agent-user-message-stack";
  const bubble = doc.createElement("div");
  bubble.className = "oc-agent-user-message";
  const message = doc.createElement("p");
  message.textContent = draft;
  bubble.append(message);
  stack.append(bubble);
  turn.append(stack);
  transcript.append(turn);
  return turn;
}

export function appendAgentUserMessage({ form, input, chat, transcript, scroller, status } = {}) {
  const draft = normalizeAgentDraft(input?.value);
  if (!form || !input || !draft) return null;
  input.value = "";
  input.dispatchEvent?.(new Event("input"));
  if (status) status.textContent = "Message sent";
  if (!transcript) return null;

  const doc = form.ownerDocument;
  const attributed = chat?.dataset?.attribution === "participants";
  const userName = chat?.dataset?.userName || "Shelly";
  const message = attributed
    ? appendAttributedUserMessage(doc, chat, transcript, draft, userName)
    : appendDirectUserMessage(doc, transcript, draft);
  const reduced = doc.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
  message.animate?.(
    reduced
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
    {
      duration: reduced ? 100 : 200,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    },
  );
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
  return message;
}

export function bindAgentComponentDemos(root = document) {
  const forms = [...root.querySelectorAll("[data-agent-chat-form]")];

  for (const form of forms) {
    const input = form.querySelector(".oc-agent-input");
    const chat = form.closest(".oc-agent-chat");
    const transcript = chat?.querySelector(".oc-agent-message-list-content");
    const scroller = chat?.querySelector(".oc-agent-message-list");
    const status = chat?.querySelector("[data-agent-chat-status]");
    if (!input || !transcript) continue;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      appendAgentUserMessage({ form, input, chat, transcript, scroller, status });
    });
  }

  const composeForms = [...root.querySelectorAll("[data-agent-compose-form]")];
  for (const form of composeForms) {
    const input = form.querySelector(".oc-agent-input");
    const status = form.querySelector("[data-agent-compose-status]");
    if (!input) continue;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const draft = normalizeAgentDraft(input.value);
      if (!draft) return;
      input.value = "";
      if (status) status.textContent = "Message sent";
      input.focus();
    });
  }

  for (const attach of root.querySelectorAll(".oc-agent-attachment-button")) {
    attach.addEventListener("click", () => {
      const container = attach.closest(".oc-agent-input-container");
      if (!container) return;
      const doc = attach.ownerDocument;
      let rowContainer = container.querySelector("[data-agent-attachment-row]");
      if (!rowContainer) {
        rowContainer = doc.createElement("div");
        rowContainer.className = "oc-agent-attachment-row";
        rowContainer.setAttribute("data-agent-attachment-row", "");
        container.prepend(rowContainer);
      }
      const names = ["component-spec.md", "tokens.css", "screenshot.png", "notes.txt"];
      const name = names[rowContainer.children.length % names.length];
      const chip = doc.createElement("span");
      chip.className = "oc-agent-file-attachment";
      chip.setAttribute("data-agent-attachment", "");
      chip.innerHTML = `<span class="oc-agent-file-name">${name}</span><button class="oc-agent-file-remove" type="button" aria-label="Remove ${name}" data-agent-attachment-remove><i data-lucide="x" aria-hidden="true"></i></button>`;
      rowContainer.append(chip);
      chip.querySelector("[data-agent-attachment-remove]").addEventListener("click", () => chip.remove());
      attach.ownerDocument.defaultView?.lucide?.createIcons({ root: chip });
      const status = attach.closest("form")?.querySelector("[data-agent-chat-status], [data-agent-compose-status]");
      if (status) status.textContent = `${name} attached`;
    });
  }

  for (const timer of root.querySelectorAll("[data-collab-elapsed]")) {
    const base = parseInt(timer.textContent, 10) || 0;
    const started = Date.now();
    const tick = setInterval(() => {
      if (!timer.isConnected) {
        clearInterval(tick);
        return;
      }
      timer.textContent = `${base + Math.round((Date.now() - started) / 1000)}s`;
    }, 1000);
  }

  const suggestions = [...root.querySelectorAll("[data-agent-suggestion-value]")];
  for (const suggestion of suggestions) {
    const targetId = suggestion.dataset.agentSuggestionTarget;
    const input = findAgentSuggestionTarget(root, targetId);
    if (!input) continue;
    suggestion.addEventListener("click", () => {
      input.value = suggestion.dataset.agentSuggestionValue || suggestion.textContent.trim();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });
  }

  const modeSelectors = [...root.querySelectorAll("[data-agent-mode-selector]")];
  for (const selector of modeSelectors) {
    const label = selector.querySelector("[data-agent-mode-label]");
    const summary = selector.querySelector("summary");
    const inputs = [...selector.querySelectorAll('input[type="radio"]')];
    for (const input of inputs) {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        if (label) label.textContent = input.value;
        selector.open = false;
        summary?.focus();
      });
    }
  }

  const modelPickers = [...root.querySelectorAll("[data-agent-model-picker]")];
  for (const picker of modelPickers) {
    const name = picker.querySelector("[data-agent-model-name]");
    const version = picker.querySelector("[data-agent-model-version]");
    const summary = picker.querySelector("summary");
    const inputs = [...picker.querySelectorAll('input[type="radio"]')];
    for (const input of inputs) {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        if (name) name.textContent = input.value;
        if (version) version.textContent = input.dataset.agentModelOptionVersion || "";
        picker.open = false;
        summary?.focus();
      });
    }
  }

  const attachmentRemoveButtons = [...root.querySelectorAll("[data-agent-attachment-remove]")];
  for (const button of attachmentRemoveButtons) {
    button.addEventListener("click", async () => {
      const attachment = button.closest("[data-agent-attachment]");
      if (!attachment) return;
      const reduced = attachment.ownerDocument?.defaultView
        ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const animation = attachment.animate?.(
        reduced
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { opacity: 1, transform: "translateX(0)" },
              { opacity: 0, transform: "translateX(8px)" },
            ],
        {
          duration: reduced ? 100 : 160,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        },
      );
      if (animation) await animation.finished;
      attachment.remove();
    });
  }

  const planApproveButtons = [...root.querySelectorAll("[data-agent-plan-approve]")];
  for (const button of planApproveButtons) {
    button.addEventListener("click", () => {
      const plan = button.closest("[data-agent-plan]");
      const status = plan?.querySelector("[data-agent-plan-status]");
      plan?.setAttribute("data-state", "approved");
      if (status) status.textContent = "Approved";
      button.disabled = true;
      button.textContent = "Approved";
    });
  }

  const questionForms = [...root.querySelectorAll("[data-agent-question-form]")];
  for (const form of questionForms) {
    const status = form.querySelector("[data-agent-question-status]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.dataset.state = "answered";
      if (status) status.textContent = "Answer submitted";
    });
    for (const button of form.querySelectorAll("[data-agent-question-skip]")) {
      button.addEventListener("click", () => {
        form.dataset.state = "skipped";
        if (status) status.textContent = "Question skipped";
      });
    }
    for (const custom of form.querySelectorAll(".oc-agent-question-option-custom")) {
      const radio = custom.querySelector('input[type="radio"]');
      const field = custom.querySelector('input[type="text"]');
      if (!radio || !field) continue;
      const selectCustom = () => {
        if (radio.checked) return;
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      };
      field.addEventListener("focus", selectCustom);
      field.addEventListener("input", selectCustom);
    }
  }

  const dropTargets = [...root.querySelectorAll("[data-agent-file-drop]")];
  for (const target of dropTargets) {
    let dragDepth = 0;
    const hasFiles = (event) => {
      const types = Array.from(event.dataTransfer?.types ?? []);
      return (event.dataTransfer?.files?.length ?? 0) > 0 || types.includes("Files");
    };
    const setActive = (active) => {
      target.dataset.dropActive = String(active);
    };
    target.addEventListener("dragenter", (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth += 1;
      setActive(true);
    });
    target.addEventListener("dragover", (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });
    target.addEventListener("dragleave", () => {
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) setActive(false);
    });
    target.addEventListener("drop", (event) => {
      const count = event.dataTransfer?.files?.length ?? 0;
      if (count === 0) return;
      event.preventDefault();
      dragDepth = 0;
      setActive(false);
      const status = target.querySelector("[data-agent-chat-status]");
      if (status) status.textContent = count === 1 ? "1 file attached" : `${count} files attached`;
    });
  }

  return forms.length + composeForms.length + suggestions.length + modeSelectors.length + modelPickers.length + attachmentRemoveButtons.length + planApproveButtons.length + questionForms.length + dropTargets.length;
}
