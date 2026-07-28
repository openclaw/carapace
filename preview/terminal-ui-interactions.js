import { terminalShellMarkup } from "./terminal-ui.js";

function readTerminalWidth(workbench) {
  switch (workbench.querySelector('[data-terminal-control="width"]')?.value) {
    case "80x20":
      return "80x20";
    case "64x18":
      return "64x18";
    case "20x18":
      return "20x18";
    default:
      return "100x30";
  }
}

function readTerminalTheme(workbench) {
  return workbench.querySelector('[data-terminal-control="theme"]')?.value === "light"
    ? "light"
    : "dark";
}

function readTerminalScenario(workbench) {
  switch (workbench.querySelector('[data-terminal-control="scenario"]')?.value) {
    case "idle":
      return "idle";
    case "tool":
      return "tool";
    case "error":
      return "error";
    case "approval":
      return "approval";
    case "task":
      return "task";
    case "session":
      return "session";
    default:
      return "streaming";
  }
}

function readState(workbench) {
  return {
    width: readTerminalWidth(workbench),
    theme: readTerminalTheme(workbench),
    scenario: readTerminalScenario(workbench),
    expanded: Boolean(
      workbench.querySelector('[data-terminal-control="expanded"]')?.checked,
    ),
    armed: workbench.dataset.terminalArmed === "true",
    filter: workbench.dataset.terminalFilter,
    selection: workbench.dataset.terminalSelection,
    notice: workbench.dataset.terminalNotice,
  };
}

function describeState(state) {
  const [columns, rows] = state.width.split("x");
  const armed = state.armed ? ", confirmation armed" : "";
  const filter =
    state.scenario === "session" && state.filter === "" ? ", filter empty" : "";
  const notice = state.notice ? `, ${state.notice}` : "";
  return `${columns} by ${rows}, ${state.theme}, ${state.scenario}${armed}${filter}${notice}`;
}

function applySessionPickerState(stage, state) {
  if (state.scenario !== "session") return;

  const filter = state.filter ?? "car";
  const normalizedFilter = filter.toLowerCase();
  const filterInput = stage?.querySelector("[data-terminal-filter-input]");
  if (filterInput) filterInput.value = filter;

  const rows = [...(stage?.querySelectorAll(".terminal-picker-row") ?? [])];
  const visibleRows = rows.filter((row) => {
    const label = row.querySelector("strong")?.textContent || "";
    const description = row.querySelector("small")?.textContent || "";
    const matches =
      !normalizedFilter || `${label} ${description}`.toLowerCase().includes(normalizedFilter);
    row.hidden = !matches;
    row.classList.remove("is-selected");
    const marker = row.querySelector("span");
    if (marker) marker.textContent = " ";
    return matches;
  });
  const selection = Number.isInteger(Number(state.selection)) ? Number(state.selection) : 0;
  const selectedRow = visibleRows[selection];
  selectedRow?.classList.add("is-selected");
  const selectedMarker = selectedRow?.querySelector("span");
  if (selectedMarker) selectedMarker.textContent = "›";

  const empty = stage?.querySelector(".terminal-picker-empty");
  if (empty) empty.hidden = visibleRows.length > 0;
}

function applyRenderedState(stage, state) {
  const noticeRow = stage?.querySelector(".terminal-system-row");
  if (state.scenario === "idle" && state.notice && noticeRow) {
    noticeRow.textContent = state.notice;
  }
  applySessionPickerState(stage, state);
}

function renderWorkbench(workbench, { focusFrame = false } = {}) {
  const stage = workbench.querySelector("[data-terminal-stage]");
  const status = workbench.querySelector("[data-terminal-status]");
  const state = readState(workbench);
  if (stage) {
    stage.innerHTML = terminalShellMarkup({
      width: state.width,
      theme: state.theme,
      scenario: state.scenario,
      expanded: state.expanded,
      armed: state.armed,
      filter: state.scenario === "session" ? "" : undefined,
      selection: state.scenario === "session" ? undefined : state.selection,
    });
    applyRenderedState(stage, state);
  }
  if (status) status.textContent = describeState(state);
  if (focusFrame) {
    const focusTarget =
      state.scenario === "session"
        ? stage?.querySelector("[data-terminal-filter-input]")
        : stage?.querySelector("[data-terminal-frame]");
    focusTarget?.focus();
    if (focusTarget?.matches?.("[data-terminal-filter-input]")) {
      focusTarget.setSelectionRange(focusTarget.value.length, focusTarget.value.length);
    }
  }
}

function setScenario(workbench, scenario) {
  const control = workbench.querySelector('[data-terminal-control="scenario"]');
  if (control) control.value = scenario;
  delete workbench.dataset.terminalArmed;
  delete workbench.dataset.terminalFilter;
  delete workbench.dataset.terminalSelection;
}

function handleDecision(workbench, action) {
  const scenario = readState(workbench).scenario;
  if (
    action === "deny" ||
    action === "dismiss" ||
    action === "hide" ||
    action === "close-picker"
  ) {
    setScenario(workbench, "idle");
    workbench.dataset.terminalNotice = {
      deny: "approval denied",
      dismiss: "task dismissed",
      hide: "task hidden locally",
      "close-picker": "session picker closed",
    }[action];
    renderWorkbench(workbench, { focusFrame: true });
    return;
  }

  if (workbench.dataset.terminalArmed === "true") {
    setScenario(workbench, "idle");
    workbench.dataset.terminalNotice =
      scenario === "approval" ? "approval allowed once" : "task started in worktree";
  } else {
    workbench.dataset.terminalSelection = action;
    workbench.dataset.terminalArmed = "true";
    delete workbench.dataset.terminalNotice;
  }
  renderWorkbench(workbench, { focusFrame: true });
}

function moveTerminalSelection(workbench, scenario, direction, optionCount) {
  const actions =
    scenario === "approval"
      ? ["deny", "allow"]
      : scenario === "task"
        ? ["start", "dismiss"]
        : Array.from({ length: optionCount }, (_, index) => String(index));
  const defaultSelection = scenario === "task" ? "dismiss" : actions[0];
  const current = workbench.dataset.terminalSelection || defaultSelection;
  if (actions.length === 0) return;
  const nextIndex = Math.max(0, Math.min(actions.length - 1, actions.indexOf(current) + direction));
  workbench.dataset.terminalSelection = actions[nextIndex];
  delete workbench.dataset.terminalArmed;
  delete workbench.dataset.terminalNotice;
  renderWorkbench(workbench, { focusFrame: true });
}

export function getTerminalFrameKeyAction({
  key,
  ctrlKey = false,
  scenario,
  filter,
  selectedAction,
}) {
  if (key === "Escape" && ["approval", "task", "session"].includes(scenario)) {
    if (scenario === "session" && filter !== "") return "clear-filter";
    if (scenario === "task") return "hide";
    return scenario === "approval" ? "deny" : "close-picker";
  }
  if (["approval", "task", "session"].includes(scenario)) {
    if (key === "ArrowUp" || (ctrlKey && key.toLowerCase() === "p")) return "previous";
    if (key === "ArrowDown" || (ctrlKey && key.toLowerCase() === "n")) return "next";
  }
  if (key === "Enter" && ["approval", "task"].includes(scenario)) {
    return selectedAction || null;
  }
  if (key === "Enter" && scenario === "session") return "open-session";
  return null;
}

export function bindTerminalUi(root = globalThis.document) {
  const workbenches = [...root.querySelectorAll("[data-terminal-workbench]")];
  const cleanups = [];

  for (const workbench of workbenches) {
    const form = workbench.querySelector("form");
    const onSubmit = (event) => event.preventDefault();
    const onChange = () => {
      delete workbench.dataset.terminalArmed;
      delete workbench.dataset.terminalFilter;
      delete workbench.dataset.terminalSelection;
      delete workbench.dataset.terminalNotice;
      renderWorkbench(workbench);
    };
    const onClick = (event) => {
      const decision = event.target.closest?.("[data-terminal-decision]");
      if (decision && workbench.contains(decision)) {
        handleDecision(workbench, decision.dataset.terminalDecision);
      }
    };
    const onInput = (event) => {
      if (!event.target.matches?.("[data-terminal-filter-input]")) return;
      workbench.dataset.terminalFilter = event.target.value;
      workbench.dataset.terminalSelection = "0";
      delete workbench.dataset.terminalNotice;
      renderWorkbench(workbench, { focusFrame: true });
    };
    const onKeyDown = (event) => {
      const frame = event.target.closest?.("[data-terminal-frame]");
      if (!frame || !workbench.contains(frame)) return;
      const decisionButton = event.target.closest?.("[data-terminal-decision]");
      if (decisionButton && (event.key === "Enter" || event.key === " ")) return;
      const state = readState(workbench);
      const selectedAction = frame.querySelector(
        "[data-terminal-decision].is-selected",
      )?.dataset.terminalDecision;
      const action = getTerminalFrameKeyAction({
        key: event.key,
        ctrlKey: event.ctrlKey,
        scenario: state.scenario,
        filter: state.filter,
        selectedAction,
      });
      if (!action) return;
      if (action === "open-session" && !frame.querySelector(".terminal-picker-row.is-selected")) {
        return;
      }
      event.preventDefault();
      if (action === "clear-filter") {
        workbench.dataset.terminalFilter = "";
        renderWorkbench(workbench, { focusFrame: true });
      } else if (action === "previous" || action === "next") {
        moveTerminalSelection(
          workbench,
          state.scenario,
          action === "previous" ? -1 : 1,
          frame.querySelectorAll(".terminal-picker-row:not([hidden])").length,
        );
      } else if (action === "open-session") {
        setScenario(workbench, "idle");
        workbench.dataset.terminalNotice = "selected session opened";
        renderWorkbench(workbench, { focusFrame: true });
      } else {
        handleDecision(workbench, action);
      }
    };

    form?.addEventListener("submit", onSubmit);
    workbench.addEventListener("change", onChange);
    workbench.addEventListener("click", onClick);
    workbench.addEventListener("input", onInput);
    workbench.addEventListener("keydown", onKeyDown);
    cleanups.push(() => {
      form?.removeEventListener("submit", onSubmit);
      workbench.removeEventListener("change", onChange);
      workbench.removeEventListener("click", onClick);
      workbench.removeEventListener("input", onInput);
      workbench.removeEventListener("keydown", onKeyDown);
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}
