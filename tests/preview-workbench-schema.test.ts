import { describe, expect, test } from "bun:test";
import {
  WORKBENCH_ALL_VALUE,
  getWorkbenchComparison,
  getWorkbenchControlOptions,
  getWorkbenchDefinition,
  normalizeWorkbenchState,
} from "../preview/component-workbench-config.js";
import {
  icon,
} from "../preview/icons.js";

describe("workbench schema contracts", () => {
  test("publishes only real action variants through the workbench schema", () => {
    const definition = getWorkbenchDefinition("primitive-action");

    expect(definition?.controls[0]).toMatchObject({
      id: "variant",
      type: "choice",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Ghost", value: "ghost" },
        { label: "Icon", value: "icon" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { variant: "secondary" })).toEqual({
      variant: "secondary",
    });
    expect(normalizeWorkbenchState(definition, { variant: "loading" })).toEqual({
      variant: WORKBENCH_ALL_VALUE,
    });
  });
  test("publishes ClipboardText action variants through the workbench schema", () => {
    const definition = getWorkbenchDefinition("primitive-clipboard-text");

    expect(definition?.controls[0]).toMatchObject({
      id: "variant",
      type: "choice",
      compare: "rows",
      options: [
        { label: "Label", value: "label" },
        { label: "Icon", value: "icon" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { variant: "label" })).toEqual({
      variant: "label",
    });
    expect(normalizeWorkbenchState(definition, { variant: "ghost" })).toEqual({
      variant: WORKBENCH_ALL_VALUE,
    });
    expect(getWorkbenchComparison(definition, { variant: WORKBENCH_ALL_VALUE })).toMatchObject({
      layout: "rows",
      items: [
        { label: "Label", state: { variant: "label" } },
        { label: "Icon", state: { variant: "icon" } },
      ],
    });
  });
  test("offers All only for comparable visual variants", () => {
    const action = getWorkbenchDefinition("primitive-action");
    const control = action?.controls[0];
    const state = normalizeWorkbenchState(action, { variant: WORKBENCH_ALL_VALUE });

    expect(getWorkbenchControlOptions(control).map(({ label }) => label)).toEqual([
      "All",
      "Primary",
      "Secondary",
      "Ghost",
      "Icon",
    ]);
    expect(getWorkbenchComparison(action, state)).toMatchObject({
      layout: "rows",
      items: [
        { label: "Primary", state: { variant: "primary" } },
        { label: "Secondary", state: { variant: "secondary" } },
        { label: "Ghost", state: { variant: "ghost" } },
        { label: "Icon", state: { variant: "icon" } },
      ],
    });

    const sendButton = getWorkbenchDefinition("send-button");
    expect(getWorkbenchControlOptions(sendButton?.controls[0]).map(({ label }) => label)).toEqual([
      "Idle",
      "Typing",
      "Streaming",
    ]);
    expect(normalizeWorkbenchState(sendButton, { state: WORKBENCH_ALL_VALUE })).toEqual({
      state: "idle",
    });
  });
  test("models Banner tones and its optional adjacent action", () => {
    const definition = getWorkbenchDefinition("primitive-banner");

    expect(definition?.controls).toMatchObject([
      {
        id: "tone",
        type: "choice",
        options: [
          { label: "Default", value: "default" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Information", value: "info" },
        ],
      },
      { id: "action", type: "toggle" },
      { id: "dismissible", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { tone: "success", action: false })).toEqual({
      tone: "success",
      action: false,
      dismissible: false,
    });
    expect(normalizeWorkbenchState(definition, { tone: "unknown", action: "yes" })).toEqual({
      tone: WORKBENCH_ALL_VALUE,
      action: true,
      dismissible: false,
    });
  });
  test("publishes only real Link variants through the workbench schema", () => {
    const definition = getWorkbenchDefinition("primitive-link");

    expect(definition?.controls).toMatchObject([
      {
        id: "variant",
        type: "choice",
        compare: "rows",
        options: [
          { label: "Inline", value: "inline" },
          { label: "Muted", value: "muted" },
          { label: "Standalone", value: "standalone" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(getWorkbenchControlOptions(definition?.controls[0]).map(({ label }) => label)).toEqual([
      "All",
      "Inline",
      "Muted",
      "Standalone",
    ]);
    expect(normalizeWorkbenchState(definition, { variant: "muted", disabled: true })).toEqual({
      variant: "muted",
      disabled: true,
    });
    expect(normalizeWorkbenchState(definition, { variant: "underline", disabled: "yes" })).toEqual({
      variant: WORKBENCH_ALL_VALUE,
      disabled: false,
    });
    expect(
      getWorkbenchComparison(definition, { variant: WORKBENCH_ALL_VALUE, disabled: false }),
    ).toMatchObject({
      layout: "rows",
      items: [
        { label: "Inline", state: { variant: "inline", disabled: false } },
        { label: "Muted", state: { variant: "muted", disabled: false } },
        { label: "Standalone", state: { variant: "standalone", disabled: false } },
      ],
    });
  });
  test("models Table interactive rows and chrome as opt-in behavior", () => {
    const definition = getWorkbenchDefinition("primitive-table");

    expect(definition?.controls).toMatchObject([
      { id: "interactive", label: "Interactive rows", type: "toggle" },
      { id: "chrome", label: "Toolbar and footer", type: "toggle" },
      { id: "selected", label: "Rows selected", type: "toggle" },
      { id: "expandable", label: "Expandable rows", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { interactive: true })).toEqual({
      interactive: true,
      chrome: false,
      selected: false,
      expandable: false,
    });
    expect(normalizeWorkbenchState(definition, { interactive: "yes" })).toMatchObject({
      interactive: false,
    });
    const chrome = definition.markup({ interactive: false, chrome: true, selected: false });
    expect(chrome).toContain("oc-table-toolbar");
    expect(chrome).toContain("oc-table-sort");
    expect(chrome).toContain("oc-table-footer");
    const bulk = definition.markup({ interactive: false, chrome: true, selected: true });
    expect(bulk).toContain("oc-table-bulk-bar");
    expect(bulk).not.toContain("oc-table-toolbar\"");
  });
  test("models native Select values and disabled state without synthetic variants", () => {
    const definition = getWorkbenchDefinition("primitive-select");

    expect(definition?.controls).toMatchObject([
      {
        id: "value",
        type: "choice",
        options: [
          { label: "Balanced", value: "balanced" },
          { label: "Fast", value: "fast" },
          { label: "Deep", value: "deep" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { value: "fast", disabled: true })).toEqual({
      value: "fast",
      disabled: true,
    });
    expect(normalizeWorkbenchState(definition, { value: "unknown", disabled: "yes" })).toEqual({
      value: "balanced",
      disabled: false,
    });
  });
  test("models Input Area states from the shared field contract", () => {
    const definition = getWorkbenchDefinition("primitive-input-area");

    expect(definition?.controls).toMatchObject([
      {
        id: "state",
        type: "choice",
        compare: "stack",
        options: [
          { label: "Default", value: "default" },
          { label: "Invalid", value: "invalid" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      { id: "message", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, {})).toEqual({
      state: WORKBENCH_ALL_VALUE,
      message: true,
    });
    expect(normalizeWorkbenchState(definition, { state: "invalid", message: false })).toEqual({
      state: "invalid",
      message: false,
    });
    expect(normalizeWorkbenchState(definition, { state: "readonly", message: "yes" })).toEqual({
      state: WORKBENCH_ALL_VALUE,
      message: true,
    });
    expect(
      getWorkbenchComparison(definition, normalizeWorkbenchState(definition, {})),
    ).toMatchObject({
      layout: "stack",
      items: [
        { label: "Default", state: { state: "default", message: true } },
        { label: "Invalid", state: { state: "invalid", message: true } },
        { label: "Disabled", state: { state: "disabled", message: true } },
      ],
    });
  });
  test("models Input Group addon positions and field states without inventing readonly", () => {
    const definition = getWorkbenchDefinition("primitive-input-group");

    expect(definition?.controls).toMatchObject([
      {
        id: "addon",
        type: "choice",
        compare: "stack",
        options: [
          { label: "Prefix", value: "prefix" },
          { label: "Suffix", value: "suffix" },
          { label: "Both", value: "both" },
          { label: "Stepper", value: "stepper" },
        ],
      },
      {
        id: "state",
        type: "choice",
        options: [
          { label: "Default", value: "default" },
          { label: "Invalid", value: "invalid" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      { id: "message", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, {})).toEqual({
      addon: WORKBENCH_ALL_VALUE,
      state: "default",
      message: true,
    });
    expect(
      normalizeWorkbenchState(definition, {
        addon: "suffix",
        state: "invalid",
        message: false,
      }),
    ).toEqual({
      addon: "suffix",
      state: "invalid",
      message: false,
    });
    expect(
      normalizeWorkbenchState(definition, {
        addon: "leading",
        state: "readonly",
        message: "yes",
      }),
    ).toEqual({
      addon: WORKBENCH_ALL_VALUE,
      state: "default",
      message: true,
    });
    expect(
      getWorkbenchComparison(definition, normalizeWorkbenchState(definition, {})),
    ).toMatchObject({
      layout: "stack",
      items: [
        {
          label: "Prefix",
          state: { addon: "prefix", state: "default", message: true },
        },
        {
          label: "Suffix",
          state: { addon: "suffix", state: "default", message: true },
        },
        {
          label: "Both",
          state: { addon: "both", state: "default", message: true },
        },
        {
          label: "Stepper",
          state: { addon: "stepper", state: "default", message: true },
        },
      ],
    });
  });
  test("models free-entry Autocomplete values and disabled state", () => {
    const definition = getWorkbenchDefinition("primitive-autocomplete");

    expect(definition?.controls).toMatchObject([
      {
        id: "value",
        type: "choice",
        options: [
          { label: "Empty", value: "" },
          { label: "Action", value: "Action" },
          { label: "Card", value: "Card" },
          { label: "Input", value: "Input" },
          { label: "Select", value: "Select" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { value: "Card", disabled: true })).toEqual({
      value: "Card",
      disabled: true,
    });
  });
  test("keeps Autocomplete focus without rerendering after a selected value", () => {
    const definition = getWorkbenchDefinition("primitive-autocomplete");
    const initialInput = Object.assign(new EventTarget(), {
      value: "Card",
      focused: false,
      focus() {
        this.focused = true;
      },
    });
    const specimen = {
      querySelectorAll: () => [],
      querySelector: (selector) => (selector === "input" ? initialInput : null),
    };

    definition?.bind?.(specimen, {}, (id, value, options) => {
      expect([id, value]).toEqual(["value", "Card"]);
      expect(options).toEqual({ render: false });
    });
    initialInput.dispatchEvent(new Event("change"));

    expect(initialInput.focused).toBe(true);
  });
  test("models only observable Toast demo states", () => {
    const definition = getWorkbenchDefinition("primitive-toast");

    expect(definition?.controls).toMatchObject([
      { id: "visible", type: "toggle" },
      { id: "dismissible", type: "toggle" },
    ]);
    expect(normalizeWorkbenchState(definition, { visible: true, dismissible: false })).toEqual({
      visible: true,
      dismissible: false,
    });
  });
  test("models the Composer status and disabled states documented by the component", () => {
    const definition = getWorkbenchDefinition("input-bar");

    expect(definition?.controls).toMatchObject([
      {
        id: "status",
        type: "choice",
        options: [
          { label: "Ready", value: "ready" },
          { label: "Submitted", value: "submitted" },
          { label: "Streaming", value: "streaming" },
        ],
      },
      { id: "disabled", type: "toggle" },
    ]);
    expect(
      normalizeWorkbenchState(definition, { status: "submitted", disabled: true }),
    ).toMatchObject({
      status: "submitted",
      disabled: true,
    });
  });
  test("models exact Agent input-family variant sets", () => {
    expect(getWorkbenchDefinition("send-button")?.controls[0]).toMatchObject({
      id: "state",
      options: [
        { label: "Idle", value: "idle" },
        { label: "Typing", value: "typing" },
        { label: "Streaming", value: "streaming" },
      ],
    });
    expect(getWorkbenchDefinition("attachment-button")?.controls[0]).toMatchObject({
      id: "icon",
      options: [
        { label: "Plus", value: "plus" },
        { label: "Paperclip", value: "paperclip" },
      ],
    });
    expect(getWorkbenchDefinition("file-attachment")?.controls.map(({ id }) => id)).toEqual([
      "kind",
      "display",
      "removable",
    ]);
    expect(getWorkbenchDefinition("suggestions")?.controls).toMatchObject([
      { id: "disabled", type: "toggle" },
    ]);
    expect(getWorkbenchDefinition("model-picker")?.controls.map(({ id }) => id)).toEqual([
      "model",
      "picker",
      "thinking",
      "fast",
      "locked",
    ]);
    expect(getWorkbenchDefinition("mode-selector")?.controls[0].id).toBe("value");
  });
  test("models documented Error Message examples", () => {
    const definition = getWorkbenchDefinition("error-message");

    expect(definition?.controls).toMatchObject([
      {
        id: "example",
        type: "choice",
        options: [
          { label: "Interrupted", value: "interrupted" },
          { label: "Rate limit", value: "rate-limit" },
        ],
      },
    ]);
  });
  test("models documented Markdown examples", () => {
    const definition = getWorkbenchDefinition("markdown");

    expect(definition?.controls[0]).toMatchObject({
      id: "example",
      type: "choice",
      options: [
        { label: "Release notes", value: "release" },
        { label: "Table and links", value: "table" },
        { label: "Long-form answer", value: "long-form" },
        { label: "Task checklist", value: "tasks" },
        { label: "Streaming update", value: "streaming" },
      ],
    });
  });
  test("models documented Loader sizes and label visibility", () => {
    const definition = getWorkbenchDefinition("primitive-loader");

    expect(definition?.controls).toMatchObject([
      {
        id: "size",
        type: "choice",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { id: "label", type: "toggle" },
    ]);
    expect(getWorkbenchControlOptions(definition?.controls[0]).map(({ label }) => label)).toEqual([
      "All",
      "Small",
      "Medium",
      "Large",
    ]);
    expect(normalizeWorkbenchState(definition, { size: "sm", label: false })).toEqual({
      size: "sm",
      label: false,
    });
    expect(normalizeWorkbenchState(definition, { size: "xl", label: "yes" })).toEqual({
      size: WORKBENCH_ALL_VALUE,
      label: true,
    });
    expect(
      getWorkbenchComparison(
        definition,
        normalizeWorkbenchState(definition, { size: WORKBENCH_ALL_VALUE }),
      ),
    ).toMatchObject({
      layout: "rows",
      items: [
        { label: "Small", state: { size: "sm", label: true } },
        { label: "Medium", state: { size: "md", label: true } },
        { label: "Large", state: { size: "lg", label: true } },
      ],
    });
  });
  test("models documented Skeleton Line count and width variants", () => {
    const definition = getWorkbenchDefinition("primitive-skeleton-line");

    expect(definition?.controls).toMatchObject([
      {
        id: "count",
        type: "choice",
        compare: "stack",
        options: [
          { label: "One", value: "1" },
          { label: "Three", value: "3" },
          { label: "Five", value: "5" },
        ],
      },
      {
        id: "width",
        type: "choice",
        options: [
          { label: "Full", value: "full" },
          { label: "Mixed", value: "mixed" },
          { label: "Short", value: "short" },
        ],
      },
    ]);
    expect(getWorkbenchControlOptions(definition?.controls[0]).map(({ label }) => label)).toEqual([
      "All",
      "One",
      "Three",
      "Five",
    ]);
    expect(normalizeWorkbenchState(definition, { count: "1", width: "short" })).toEqual({
      count: "1",
      width: "short",
    });
    expect(normalizeWorkbenchState(definition, { count: "9", width: "wide" })).toEqual({
      count: WORKBENCH_ALL_VALUE,
      width: "mixed",
    });
    expect(
      getWorkbenchComparison(
        definition,
        normalizeWorkbenchState(definition, { count: WORKBENCH_ALL_VALUE, width: "full" }),
      ),
    ).toMatchObject({
      layout: "stack",
      items: [
        { label: "One", state: { count: "1", width: "full" } },
        { label: "Three", state: { count: "3", width: "full" } },
        { label: "Five", state: { count: "5", width: "full" } },
      ],
    });
  });
  test("models Provider Logo size, label, state, and layout controls", () => {
    const definition = getWorkbenchDefinition("primitive-provider-logo");

    expect(definition?.controls).toMatchObject([
      {
        id: "size",
        type: "choice",
        options: [
          { label: "Tiny", value: "xs" },
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
          { label: "Display", value: "xl" },
        ],
      },
      { id: "label", type: "toggle" },
      { id: "framed", type: "toggle" },
      {
        id: "state",
        type: "choice",
        options: [
          { label: "Default", value: "default" },
          { label: "Selected", value: "selected" },
          { label: "Muted", value: "muted" },
          { label: "Disabled", value: "disabled" },
        ],
      },
      {
        id: "layout",
        type: "choice",
        options: [
          { label: "Lockups", value: "wrap" },
          { label: "Marks", value: "marks" },
          { label: "Picker", value: "picker" },
          { label: "Stack", value: "stack" },
          { label: "Profiles", value: "profiles" },
          { label: "Tiles", value: "tiles" },
        ],
      },
    ]);
    expect(normalizeWorkbenchState(definition, {})).toEqual({
      size: "md",
      label: true,
      framed: false,
      state: "default",
      layout: "wrap",
    });
    expect(
      normalizeWorkbenchState(definition, {
        size: "lg",
        label: false,
        framed: true,
        state: "selected",
        layout: "stack",
      }),
    ).toEqual({
      size: "lg",
      label: false,
      framed: true,
      state: "selected",
      layout: "stack",
    });
    expect(
      normalizeWorkbenchState(definition, {
        size: "xl",
        label: "yes",
        framed: "no",
        state: "unknown",
        layout: "grid",
      }),
    ).toEqual({
      size: "xl",
      label: true,
      framed: false,
      state: "default",
      layout: "wrap",
    });
    expect(
      definition?.markup({
        size: "sm",
        label: true,
        framed: false,
        state: "default",
        layout: "wrap",
      }),
    ).toContain("oc-provider-logo-sm");
    expect(
      definition?.markup({
        size: "md",
        label: false,
        framed: true,
        state: "selected",
        layout: "picker",
      }),
    ).toContain('data-selected="true"');
    expect(
      definition?.markup({
        size: "md",
        label: false,
        framed: true,
        state: "selected",
        layout: "picker",
      }),
    ).toContain('aria-pressed="true"');
    expect(
      definition?.markup({
        size: "md",
        label: false,
        framed: true,
        state: "selected",
        layout: "picker",
      }),
    ).toContain("oc-provider-logo-framed");
    expect(
      definition?.markup({
        size: "lg",
        label: true,
        framed: false,
        state: "muted",
        layout: "stack",
      }),
    ).toContain("oc-provider-logo-muted");
    expect(
      definition?.markup({
        size: "lg",
        label: true,
        framed: false,
        state: "muted",
        layout: "stack",
      }),
    ).not.toContain(" disabled");
    expect(
      definition?.markup({
        size: "lg",
        label: true,
        framed: false,
        state: "disabled",
        layout: "stack",
      }),
    ).toContain(" disabled");

    const createProviderButton = () =>
      Object.assign(new EventTarget(), {
        attributes: {},
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
        toggleAttribute(name, force) {
          if (force) this.attributes[name] = "";
          else delete this.attributes[name];
        },
      });
    const firstProvider = createProviderButton();
    const secondProvider = createProviderButton();
    definition?.bind?.({
      querySelectorAll: () => [firstProvider, secondProvider],
    });
    secondProvider.dispatchEvent(new Event("click"));
    expect(firstProvider.attributes).toEqual({ "aria-pressed": "false" });
    expect(secondProvider.attributes).toEqual({
      "aria-pressed": "true",
      "data-selected": "",
    });
  });
  test("models documented Spiral Loader sizes", () => {
    const definition = getWorkbenchDefinition("spiral-loader");

    expect(definition?.controls[0]).toMatchObject({
      id: "size",
      type: "choice",
      options: [
        { label: "Small", value: "16" },
        { label: "Medium", value: "24" },
        { label: "Large", value: "32" },
      ],
    });
  });
  test("models documented Text Shimmer examples", () => {
    const definition = getWorkbenchDefinition("text-shimmer");

    expect(definition?.controls[0]).toMatchObject({
      id: "example",
      type: "choice",
      options: [
        { label: "Inline status", value: "inline" },
        { label: "Delayed shimmer", value: "delayed" },
        { label: "Fast shimmer", value: "fast" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { example: "fast" })).toEqual({
      example: "fast",
    });
    expect(normalizeWorkbenchState(definition, { example: "unknown" })).toEqual({
      example: WORKBENCH_ALL_VALUE,
    });
  });
  test("models supported User Message content", () => {
    const definition = getWorkbenchDefinition("user-message");

    expect(definition?.controls[0]).toMatchObject({
      id: "content",
      type: "choice",
      options: [
        { label: "Text only", value: "text" },
        { label: "With image", value: "image" },
        { label: "With file", value: "file" },
      ],
    });
    expect(normalizeWorkbenchState(definition, { content: "file" })).toEqual({
      content: "file",
    });
    expect(normalizeWorkbenchState(definition, { content: "unknown" })).toEqual({
      content: WORKBENCH_ALL_VALUE,
    });
  });
  test("models Agent tool lifecycle without synthetic states", () => {
    const interactiveDefinition = getWorkbenchDefinition("interactive-tool");
    expect(interactiveDefinition?.controls).toMatchObject([
      {
        id: "variant",
        type: "choice",
        options: [
          { label: "Terminal", value: "terminal" },
          { label: "Browser preview", value: "browser" },
          { label: "Artifact", value: "artifact" },
        ],
      },
      {
        id: "state",
        type: "choice",
        options: [
          { label: "Running", value: "animating" },
          { label: "Complete", value: "complete" },
          { label: "Failed", value: "failed" },
        ],
      },
      { id: "open", type: "toggle" },
    ]);
    expect(
      normalizeWorkbenchState(interactiveDefinition, {
        variant: "browser",
        state: "failed",
        open: "yes",
      }),
    ).toEqual({
      variant: "browser",
      state: "failed",
      open: true,
    });

    for (const pageId of ["edit-tool", "generic-tool"]) {
      const definition = getWorkbenchDefinition(pageId);
      expect(definition?.controls).toMatchObject([
        {
          id: "state",
          type: "choice",
          options: [
            { label: "Running", value: "animating" },
            { label: "Complete", value: "complete" },
          ],
        },
      ]);
      expect(normalizeWorkbenchState(definition, { state: "pending" })).toEqual({
        state: "complete",
      });
    }

    for (const pageId of [
      "mcp-tool",
      "search-tool",
      "thinking-tool",
      "tool-group",
    ]) {
      const definition = getWorkbenchDefinition(pageId);
      expect(definition?.controls).toMatchObject([
        {
          id: "state",
          type: "choice",
          options: [
            { label: "Running", value: "animating" },
            { label: "Complete", value: "complete" },
          ],
        },
        { id: "open", type: "toggle" },
      ]);
      expect(normalizeWorkbenchState(definition, { state: "pending", open: "yes" })).toEqual({
        state: "complete",
        open: true,
      });
    }

    const subagentDefinition = getWorkbenchDefinition("subagent-tool");
    expect(subagentDefinition?.controls).toMatchObject([
      {
        id: "state",
        type: "choice",
        options: [
          { label: "Running", value: "animating" },
          { label: "Completed", value: "complete" },
          { label: "Failed", value: "failed" },
          { label: "Timed out", value: "timed_out" },
        ],
      },
      {
        id: "agentName",
        type: "choice",
        options: [
          { label: "Barnacle", value: "Barnacle" },
          { label: "Scampi", value: "Scampi" },
          { label: "Krill", value: "Krill" },
        ],
      },
      {
        id: "taskTitle",
        type: "choice",
        options: [
          { label: "Accessibility audit", value: "Accessibility audit" },
          { label: "Control UI parity", value: "Control UI parity" },
          { label: "macOS surface review", value: "macOS surface review" },
        ],
      },
      { id: "open", type: "toggle" },
    ]);
    expect(
      normalizeWorkbenchState(subagentDefinition, {
        state: "timed_out",
        agentName: "Krill",
        taskTitle: "Control UI parity",
        open: "yes",
      }),
    ).toEqual({
      state: "timed_out",
      agentName: "Krill",
      taskTitle: "Control UI parity",
      open: true,
    });
  });
  test("models exact Plan, Todo, and Question states", () => {
    expect(getWorkbenchDefinition("plan-tool")?.controls).toMatchObject([
      {
        id: "state",
        options: [
          { label: "Running", value: "animating" },
          { label: "Complete", value: "complete" },
        ],
      },
      { id: "open", type: "toggle" },
      { id: "approved", type: "toggle" },
    ]);
    expect(getWorkbenchDefinition("todo-tool")?.controls[0]).toMatchObject({
      id: "status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "In progress", value: "in_progress" },
        { label: "Completed", value: "completed" },
      ],
    });
    expect(getWorkbenchDefinition("question-tool")?.controls).toMatchObject([
      {
        id: "state",
        options: [
          { label: "Open", value: "open" },
          { label: "Submitting", value: "submitting" },
          { label: "Answered", value: "answered" },
          { label: "Skipped", value: "skipped" },
          { label: "Error", value: "error" },
        ],
      },
      { id: "allowSkip", type: "toggle" },
    ]);
  });
  test("models Agent Chat examples and ChatStatus values from the reference contract", () => {
    const definition = getWorkbenchDefinition("agent-chat");

    expect(definition?.defaults.example).toBe("multi-user");
    expect(definition?.controls.filter((control) => !control.hidden)).toMatchObject([
      {
        id: "example",
        type: "choice",
        options: [
          { label: "Basic", value: "basic" },
          { label: "Multi-user", value: "multi-user" },
          { label: "Multi-agent", value: "multi-agent" },
          { label: "Media", value: "media" },
          { label: "Empty", value: "empty" },
          { label: "Suggestions", value: "suggestions" },
          { label: "Attachments", value: "attachments" },
        ],
      },
      {
        id: "status",
        type: "choice",
        options: [
          { label: "Ready", value: "ready" },
          { label: "Submitted", value: "submitted" },
          { label: "Streaming", value: "streaming" },
          { label: "Error", value: "error" },
        ],
      },
      { id: "copyToolbar", type: "toggle" },
      {
        id: "voice",
        type: "choice",
        options: [
          { label: "Idle", value: "idle" },
          { label: "Connecting", value: "connecting" },
          { label: "Listening", value: "listening" },
          { label: "Thinking", value: "thinking" },
          { label: "Error", value: "error" },
        ],
      },
    ]);
  });
  test("models transcript status and copy affordance independently", () => {
    const definition = getWorkbenchDefinition("message-list");

    expect(
      normalizeWorkbenchState(definition, {
        status: "streaming",
        copyToolbar: false,
      }),
    ).toEqual({ status: "streaming", copyToolbar: false, meta: false });
  });
  test("keeps Agent Chat model controls in normalized workbench state", () => {
    const definition = getWorkbenchDefinition("agent-chat");

    expect(
      normalizeWorkbenchState(definition, {
        model: "anthropic/claude-opus-4-8",
        picker: true,
        thinking: "medium",
        fast: false,
      }),
    ).toMatchObject({
      model: "anthropic/claude-opus-4-8",
      picker: true,
      thinking: "medium",
      fast: false,
    });
  });
});
