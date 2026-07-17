export function normalizeAgentDraft(value) {
  return String(value || "").trim();
}

export function findAgentSuggestionTarget(root, targetId) {
  if (!targetId) return null;
  if (typeof root.getElementById === "function") return root.getElementById(targetId);
  const candidates = typeof root.querySelectorAll === "function" ? root.querySelectorAll("[id]") : [];
  return [...candidates].find((candidate) => candidate.id === targetId) || null;
}

export function bindAgentComponentDemos(root = document) {
  const forms = [...root.querySelectorAll("[data-agent-chat-form]")];

  for (const form of forms) {
    const input = form.querySelector(".oc-agent-input");
    const transcript = form.closest(".oc-agent-chat")?.querySelector(".oc-agent-chat-messages");
    const status = form.closest(".oc-agent-chat")?.querySelector("[data-agent-chat-status]");
    if (!input || !transcript) continue;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const draft = normalizeAgentDraft(input.value);
      if (!draft) return;

      const item = form.ownerDocument.createElement("li");
      item.className = "oc-user-message";
      const message = form.ownerDocument.createElement("p");
      message.textContent = draft;
      item.append(message);
      transcript.append(item);
      const reduced = form.ownerDocument?.defaultView
        ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
      item.animate?.(
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
      input.value = "";
      transcript.scrollTop = transcript.scrollHeight;
      if (status) status.textContent = "Message sent";
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

  const retryButtons = [...root.querySelectorAll("[data-agent-retry]")];
  for (const button of retryButtons) {
    button.addEventListener("click", () => {
      const error = button.closest("[data-agent-error-message]");
      button.disabled = true;
      button.textContent = "Retrying…";
      error?.setAttribute("aria-busy", "true");
      error?.setAttribute("data-state", "retrying");
    });
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
  }

  return forms.length + composeForms.length + suggestions.length + modeSelectors.length + retryButtons.length + attachmentRemoveButtons.length + planApproveButtons.length + questionForms.length;
}
