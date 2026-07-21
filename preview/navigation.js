export const introductionPage = {
  id: "overview",
  label: "Home",
  path: "",
  keywords: "home overview carapace visual contract",
};

export const referenceAreas = [
  {
    id: "foundations",
    label: "Foundations",
    description: "Tokens, type, layout, and visual properties",
    path: "foundations/",
    pages: [
      {
        id: "foundations",
        label: "Introduction",
        path: "foundations/",
        keywords: "visual foundation system",
      },
      {
        id: "foundation-tokens",
        label: "Design tokens",
        path: "foundations/tokens/",
        keywords: "variables catalog values copy",
      },
      {
        id: "foundation-colors",
        label: "Colors",
        path: "foundations/colors/",
        keywords: "palette theme light dark semantic color",
      },
      {
        id: "foundation-typography",
        label: "Typography",
        path: "foundations/typography/",
        keywords: "type font scale text",
      },
      {
        id: "foundation-layout",
        label: "Layout",
        path: "foundations/layout/",
        keywords: "spacing width grid breakpoint",
      },
      {
        id: "foundation-shape-depth",
        label: "Shape and depth",
        path: "foundations/shape-and-depth/",
        keywords: "radius border shadow elevation",
      },
      {
        id: "foundation-motion",
        label: "Motion",
        path: "foundations/motion/",
        keywords: "duration easing transition animation",
      },
      {
        id: "foundation-base",
        label: "Base styles",
        path: "foundations/base/",
        keywords: "reset focus selection screen reader reduced motion baseline",
      },
    ],
  },
  {
    id: "interface",
    label: "Components",
    description: "Shared component primitives",
    path: "interface/",
    pages: [
      {
        id: "interface",
        label: "Overview",
        path: "interface/",
        hiddenFromSidebar: true,
        keywords: "controls components interaction",
      },
      {
        id: "interface-primitives",
        label: "Shared primitives",
        path: "interface/primitives/",
        hiddenFromSidebar: true,
        keywords: "exported css classes component catalog",
      },
      {
        id: "primitive-autocomplete",
        label: "Autocomplete",
        path: "interface/primitives/autocomplete/",
        keywords: "oc-autocomplete suggestions listbox free entry input",
      },
      {
        id: "primitive-avatar",
        label: "Avatar",
        path: "interface/primitives/avatar/",
        keywords: "oc-avatar image fallback initials sizes presence status identity",
      },
      {
        id: "primitive-badge",
        label: "Badge",
        path: "interface/primitives/badge/",
        keywords: "oc-badge status success warning error metadata",
      },
      {
        id: "primitive-banner",
        label: "Banner",
        path: "interface/primitives/banner/",
        keywords: "oc-banner notice status information warning error",
      },
      {
        id: "primitive-breadcrumbs",
        label: "Breadcrumbs",
        path: "interface/primitives/breadcrumbs/",
        keywords: "oc-breadcrumbs hierarchy navigation current page",
      },
      {
        id: "primitive-button",
        label: "Button",
        path: "interface/primitives/button/",
        keywords: "oc-button primary secondary ghost sizes disabled action",
      },
      {
        id: "primitive-clipboard-text",
        label: "Clipboard Text",
        path: "interface/primitives/clipboard-text/",
        keywords: "oc-clipboard-text copy code value clipboard",
      },
      {
        id: "primitive-code-highlighted",
        label: "Code Highlighted",
        path: "interface/primitives/code-highlighted/",
        keywords: "oc-code-highlighted syntax code language tokens",
      },
      {
        id: "primitive-collapsible",
        label: "Collapsible",
        path: "interface/primitives/collapsible/",
        keywords: "oc-collapsible details summary disclosure expand collapse",
      },
      {
        id: "primitive-combobox",
        label: "Combobox",
        path: "interface/primitives/combobox/",
        keywords: "oc-combobox searchable options listbox keyboard selection",
      },
      {
        id: "primitive-command-palette",
        label: "Command Palette",
        path: "interface/primitives/command-palette/",
        keywords: "oc-command-palette dialog actions search keyboard command",
      },
      {
        id: "primitive-date-picker",
        label: "Date Picker",
        path: "interface/primitives/date-picker/",
        keywords: "oc-date-picker date calendar native input form",
      },
      {
        id: "primitive-dialog",
        label: "Dialog",
        path: "interface/primitives/dialog/",
        keywords: "oc-dialog modal confirmation focus native",
      },
      {
        id: "primitive-dropdown",
        label: "Dropdown",
        path: "interface/primitives/dropdown/",
        keywords: "oc-dropdown menu actions trigger escape",
      },
      {
        id: "primitive-empty",
        label: "Empty",
        path: "interface/primitives/empty/",
        keywords: "oc-empty no results blank state action",
      },
      {
        id: "primitive-flow",
        label: "Flow",
        path: "interface/primitives/flow/",
        keywords: "oc-flow steps sequence dependency current",
      },
      {
        id: "primitive-grid",
        label: "Grid",
        path: "interface/primitives/grid/",
        keywords: "oc-grid columns responsive layout gap",
      },
      {
        id: "primitive-layer-card",
        label: "Layer Card",
        path: "interface/primitives/layer-card/",
        keywords: "oc-layer-card tray nested surface hierarchy navigation feature",
      },
      {
        id: "primitive-link",
        label: "Link",
        path: "interface/primitives/link/",
        keywords: "oc-link navigation inline standalone muted disabled",
      },
      {
        id: "primitive-loader",
        label: "Loader",
        path: "interface/primitives/loader/",
        keywords: "oc-loader spinner loading progress busy status",
      },
      {
        id: "primitive-menu-bar",
        label: "Menu Bar",
        path: "interface/primitives/menu-bar/",
        keywords: "oc-menubar menu bar grouped commands application",
      },
      {
        id: "primitive-meter",
        label: "Meter",
        path: "interface/primitives/meter/",
        keywords: "oc-meter measurement range capacity score native",
      },
      {
        id: "primitive-pagination",
        label: "Pagination",
        path: "interface/primitives/pagination/",
        keywords: "oc-pagination pages previous next current navigation",
      },
      {
        id: "primitive-popover",
        label: "Popover",
        path: "interface/primitives/popover/",
        keywords: "oc-popover anchored content native light dismiss",
      },
      {
        id: "primitive-provider-logo",
        label: "Provider Logo",
        path: "interface/primitives/provider-logo/",
        keywords: "oc-provider-logo integration brand mark identity",
      },
      {
        id: "primitive-sidebar",
        label: "Sidebar",
        path: "interface/primitives/sidebar/",
        keywords: "oc-sidebar navigation rail current page header footer",
      },
      {
        id: "primitive-skeleton-line",
        label: "Skeleton Line",
        path: "interface/primitives/skeleton-line/",
        keywords: "oc-skeleton-line loading placeholder progress content",
      },
      {
        id: "primitive-table",
        label: "Table",
        path: "interface/primitives/table/",
        keywords: "oc-table data rows columns responsive overflow",
      },
      {
        id: "primitive-table-of-contents",
        label: "Table of Contents",
        path: "interface/primitives/table-of-contents/",
        keywords: "oc-table-of-contents in page navigation anchors current location",
      },
      {
        id: "primitive-tabs",
        label: "Tabs",
        path: "interface/primitives/tabs/",
        keywords: "oc-tabs tablist panels selection keyboard",
      },
      {
        id: "primitive-text",
        label: "Text",
        path: "interface/primitives/text/",
        keywords: "oc-text body secondary muted small mono typography",
      },
      {
        id: "primitive-toolbar",
        label: "Toolbar",
        path: "interface/primitives/toolbar/",
        keywords: "oc-toolbar grouped direct actions formatting controls",
      },
      {
        id: "primitive-toast",
        label: "Toast",
        path: "interface/primitives/toast/",
        keywords: "oc-toast notification status feedback dismiss",
      },
      {
        id: "primitive-tooltip",
        label: "Tooltip",
        path: "interface/primitives/tooltip/",
        keywords: "oc-tooltip hover focus accessible description label",
      },
      {
        id: "primitive-app-surface",
        label: "App surface",
        path: "interface/primitives/app-surface/",
        keywords: "oc-app-surface root wrapper background color font",
      },
      {
        id: "primitive-hero",
        label: "Hero",
        path: "interface/primitives/hero/",
        keywords: "oc-hero oc-hero-title oc-hero-lede",
      },
      {
        id: "primitive-section",
        label: "Section",
        path: "interface/primitives/section/",
        keywords: "oc-section header heading eyebrow title copy",
      },
      {
        id: "primitive-card",
        label: "Card",
        path: "interface/primitives/card/",
        keywords: "oc-card oc-card-interactive surface link",
      },
      {
        id: "primitive-action",
        label: "Action",
        path: "interface/primitives/action/",
        keywords: "oc-action primary secondary ghost icon button link",
      },
      {
        id: "primitive-segmented",
        label: "Segmented control",
        path: "interface/primitives/segmented-control/",
        keywords: "oc-segmented item aria selected pressed",
      },
      {
        id: "primitive-pill",
        label: "Pill",
        path: "interface/primitives/pill/",
        keywords: "oc-pill label metadata",
      },
      {
        id: "primitive-input",
        label: "Input",
        path: "interface/primitives/input/",
        keywords: "oc-field oc-input label helper error disabled form",
      },
      {
        id: "primitive-checkbox",
        label: "Checkbox",
        path: "interface/primitives/checkbox/",
        keywords: "oc-check oc-checkbox checked disabled form selection",
      },
      {
        id: "primitive-radio",
        label: "Radio",
        path: "interface/primitives/radio/",
        keywords: "oc-radio-group oc-radio-option oc-radio single selection",
      },
      {
        id: "primitive-switch",
        label: "Switch",
        path: "interface/primitives/switch/",
        keywords: "oc-switch-label oc-switch settings immediate toggle",
      },
      {
        id: "primitive-select",
        label: "Select",
        path: "interface/primitives/select/",
        keywords: "oc-select-wrap oc-select native options form",
      },
      {
        id: "primitive-input-area",
        label: "Input Area",
        path: "interface/primitives/input-area/",
        keywords: "oc-textarea multiline resize form message",
      },
      {
        id: "primitive-label",
        label: "Label",
        path: "interface/primitives/label/",
        keywords: "oc-label required optional description form",
      },
      {
        id: "primitive-input-group",
        label: "Input Group",
        path: "interface/primitives/input-group/",
        keywords: "oc-input-group addon prefix suffix input",
      },
      {
        id: "primitive-sensitive-input",
        label: "Sensitive Input",
        path: "interface/primitives/sensitive-input/",
        keywords: "oc-sensitive-input password secret reveal toggle",
      },
      {
        id: "interface-examples",
        label: "Interaction examples",
        path: "interface/interaction-examples/",
        group: "Examples",
        hiddenFromSidebar: true,
        keywords: "dialog form controls states",
      },
    ],
  },
  {
    id: "agent-components",
    label: "Agent Components",
    description: "Conversation, message, input, and tool components",
    path: "agent-components/agent-chat/",
    pages: [
      {
        id: "agent-chat",
        label: "Agent Chat",
        path: "agent-components/agent-chat/",
        keywords: "oc-agent-chat conversation messages suggestions input",
      },
      {
        id: "attachment-button",
        label: "Attachment Button",
        path: "agent-components/attachment-button/",
        keywords: "oc-agent-attachment-button attach upload file composer",
      },
      {
        id: "bash-tool",
        label: "Bash Tool",
        path: "agent-components/bash-tool/",
        keywords: "oc-agent-bash-tool terminal command output status",
      },
      {
        id: "error-message",
        label: "Error Message",
        path: "agent-components/error-message/",
        keywords: "oc-agent-error-message failure retry recovery alert",
      },
      {
        id: "file-attachment",
        label: "File Attachment",
        path: "agent-components/file-attachment/",
        keywords: "oc-agent-file-attachment file upload progress remove composer",
      },
      {
        id: "edit-tool",
        label: "Edit Tool",
        path: "agent-components/edit-tool/",
        keywords: "oc-agent-edit-tool file patch diff changes",
      },
      {
        id: "generic-tool",
        label: "Generic Tool",
        path: "agent-components/generic-tool/",
        keywords: "oc-agent-tool generic invocation result status",
      },
      {
        id: "message-list",
        label: "Message List",
        path: "agent-components/message-list/",
        keywords: "oc-agent-message-list transcript messages streaming history",
      },
      {
        id: "mcp-tool",
        label: "MCP Tool",
        path: "agent-components/mcp-tool/",
        keywords: "oc-agent-mcp-tool server connector capability call",
      },
      {
        id: "input-bar",
        label: "Composer",
        path: "agent-components/input-bar/",
        keywords: "oc-agent-input-bar composer textarea send stop attachments",
      },
      {
        id: "markdown",
        label: "Markdown",
        path: "agent-components/markdown/",
        keywords: "oc-agent-markdown formatted response headings lists code links",
      },
      {
        id: "suggestions",
        label: "Suggestions",
        path: "agent-components/suggestions/",
        keywords: "oc-agent-suggestions suggested prompts actions input composer",
      },
      {
        id: "spiral-loader",
        label: "Spiral Loader",
        path: "agent-components/spiral-loader/",
        keywords: "oc-agent-spiral-loader pending progress working",
      },
      {
        id: "subagent-tool",
        label: "Subagent Tool",
        path: "agent-components/subagent-tool/",
        keywords: "oc-agent-subagent-tool delegated worker task status",
      },
      {
        id: "text-shimmer",
        label: "Text Shimmer",
        path: "agent-components/text-shimmer/",
        keywords: "oc-agent-text-shimmer streaming pending progress text",
      },
      {
        id: "thinking-tool",
        label: "Thinking Tool",
        path: "agent-components/thinking-tool/",
        keywords: "oc-agent-thinking-tool reasoning progress summary disclosure",
      },
      {
        id: "todo-tool",
        label: "Todo Tool",
        path: "agent-components/todo-tool/",
        keywords: "oc-agent-todo-tool task checklist progress status",
      },
      {
        id: "tool-group",
        label: "Tool Group",
        path: "agent-components/tool-group/",
        keywords: "oc-agent-tool-group grouped invocations progress tools",
      },
      {
        id: "user-message",
        label: "User Message",
        path: "agent-components/user-message/",
        keywords: "oc-agent-user-message conversation prompt author",
      },
      {
        id: "model-picker",
        label: "Model Picker",
        path: "agent-components/model-picker/",
        keywords: "oc-agent-model-picker model selection provider capability",
      },
      {
        id: "plan-tool",
        label: "Plan Tool",
        path: "agent-components/plan-tool/",
        keywords: "oc-agent-plan-tool steps progress execution plan",
      },
      {
        id: "question-tool",
        label: "Question Tool",
        path: "agent-components/question-tool/",
        keywords: "oc-agent-question-tool clarification choices answer approval",
      },
      {
        id: "search-tool",
        label: "Search Tool",
        path: "agent-components/search-tool/",
        keywords: "oc-agent-search-tool query result sources web workspace",
      },
      {
        id: "mode-selector",
        label: "Mode Selector",
        path: "agent-components/mode-selector/",
        keywords: "oc-agent-mode-selector execution mode planning agent",
      },
      {
        id: "send-button",
        label: "Send Button",
        path: "agent-components/send-button/",
        keywords: "oc-agent-send-button send submit stop streaming message",
      },
    ],
  },
  {
    id: "charts",
    label: "Charts",
    description: "Data visualization components",
    path: "interface/charts/",
    pages: [
      {
        id: "chart-base",
        label: "Charts",
        path: "interface/charts/",
        keywords: "oc-chart visualization plot axes series data",
      },
      {
        id: "chart-colors",
        label: "Colors",
        path: "interface/charts/colors/",
        keywords: "oc-chart-colors series palette semantic data visualization",
      },
      {
        id: "chart-timeseries",
        label: "Timeseries",
        path: "interface/charts/timeseries/",
        keywords: "oc-timeseries temporal line trend series data visualization",
      },
      {
        id: "chart-maps",
        label: "Maps",
        path: "interface/charts/maps/",
        keywords: "oc-map geographic region location choropleth data visualization",
      },
      {
        id: "chart-sankey",
        label: "Sankey",
        path: "interface/charts/sankey/",
        keywords: "oc-sankey flow volume source destination nodes links",
      },
      {
        id: "chart-custom",
        label: "Custom Chart",
        path: "interface/charts/custom-chart/",
        keywords: "oc-custom-chart bespoke visualization slots annotation summary",
      },
    ],
  },
  {
    id: "blocks",
    label: "Blocks",
    description: "Reusable interface sections",
    path: "interface/blocks/page-header/",
    pages: [
      {
        id: "block-page-header",
        label: "Page Header",
        path: "interface/blocks/page-header/",
        keywords: "oc-page-header title description actions breadcrumb page",
      },
      {
        id: "block-resource-list",
        label: "Resource List",
        path: "interface/blocks/resource-list/",
        keywords: "oc-resource-list linked rows title description metadata",
      },
      {
        id: "block-delete-resource",
        label: "Delete Resource",
        path: "interface/blocks/delete-resource/",
        keywords: "oc-delete-resource destructive confirmation danger irreversible",
      },
    ],
  },
  {
    id: "compositions",
    label: "Compositions",
    description: "Product, content, and public surfaces",
    path: "compositions/",
    pages: [
      {
        id: "compositions",
        label: "Overview",
        path: "compositions/",
        keywords: "layouts surfaces patterns",
      },
      {
        id: "composition-product",
        label: "Product surfaces",
        path: "compositions/product/",
        keywords: "application app workflow",
      },
      {
        id: "composition-content",
        label: "Content surfaces",
        path: "compositions/content/",
        keywords: "documentation article prose",
      },
      {
        id: "composition-public",
        label: "Public surfaces",
        path: "compositions/public/",
        keywords: "marketing website landing",
      },
    ],
  },
  {
    id: "applications",
    label: "Applications",
    description: "Shared app shells, settings, operations, and workspaces",
    path: "applications/settings/",
    pages: [
      {
        id: "application-settings",
        label: "Settings",
        path: "applications/settings/",
        keywords: "application settings preferences toggle switch form pane",
      },
      {
        id: "application-operations",
        label: "Operations",
        path: "applications/operations/",
        keywords: "application channels automation master detail status pane",
      },
      {
        id: "application-workspace",
        label: "Workspace",
        path: "applications/workspace/",
        keywords: "application agent workspace inspector dock split pane session",
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    description: "Adoption, adapters, skills, and release guidance",
    path: "resources/",
    pages: [
      {
        id: "resources",
        label: "Overview",
        path: "resources/",
        keywords: "adoption documentation guidance",
      },
      {
        id: "resource-getting-started",
        label: "Getting started",
        path: "resources/getting-started/",
        keywords: "install setup usage quickstart",
      },
      {
        id: "resource-package-exports",
        label: "Package exports",
        path: "resources/package-exports/",
        keywords: "entry points imports css package contract",
      },
      {
        id: "resource-theming",
        label: "Theming",
        path: "resources/theming/",
        keywords: "light dark mode color scheme theme",
      },
      {
        id: "resource-adapters",
        label: "Consumer adapters",
        path: "resources/consumer-adapters/",
        keywords: "integration framework package",
      },
      {
        id: "resource-tailwind",
        label: "Tailwind",
        path: "resources/tailwind/",
        keywords: "css utility adapter",
      },
      {
        id: "resource-skills",
        label: "Skills",
        path: "resources/skills/",
        keywords: "agent guidance audit",
      },
      {
        id: "resource-brand",
        label: "Brand and assets",
        path: "resources/brand-and-assets/",
        keywords: "identity voice typography logo imagery license rights",
      },
      {
        id: "resource-governance",
        label: "Governance",
        path: "resources/governance/",
        keywords: "ownership consumers promotion contribution compatibility",
      },
      {
        id: "resource-design-audit",
        label: "Design audit",
        path: "resources/design-audit/",
        keywords: "compliance drift rubric severity report fix policy",
      },
      {
        id: "resource-accessibility",
        label: "Accessibility",
        path: "resources/accessibility/",
        keywords: "a11y keyboard focus contrast semantics",
      },
      {
        id: "resource-release",
        label: "Release",
        path: "resources/release/",
        keywords: "version changelog tag stable",
      },
    ],
  },
];

export const referencePages = referenceAreas.flatMap((area) =>
  area.pages.map((page) => ({ ...page, areaId: area.id, areaLabel: area.label })),
);

export function compareReferenceLabels(left, right) {
  return left.label.localeCompare(right.label);
}

const stableReferenceIds = new Set([
  "primitive-action",
  "primitive-app-surface",
  "primitive-card",
  "primitive-hero",
  "primitive-pill",
  "primitive-section",
  "primitive-segmented",
]);

const candidateReferenceIds = new Set([
  "block-resource-list",
  "primitive-badge",
  "primitive-banner",
  "primitive-checkbox",
  "primitive-empty",
  "primitive-input",
  "primitive-input-area",
  "primitive-label",
  "primitive-loader",
  "primitive-radio",
  "primitive-select",
  "primitive-skeleton-line",
  "primitive-switch",
  "primitive-table",
  "application-settings",
  "application-operations",
  "application-workspace",
]);

const labAreaIds = new Set(["interface", "agent-components", "charts", "blocks", "applications"]);

export function getReferenceMaturity(id) {
  if (stableReferenceIds.has(id)) return "Stable";
  if (candidateReferenceIds.has(id)) return "Candidate";
  return labAreaIds.has(getReferencePage(id)?.areaId) ? "Lab" : undefined;
}

const sequencedAreaIds = new Set([
  "foundations",
  "interface",
  "agent-components",
  "charts",
  "blocks",
  "applications",
]);

const adjacentReferenceSequences = referenceAreas
  .filter((area) => sequencedAreaIds.has(area.id))
  .map((area) => {
    const pages = area.pages.filter(
      (page) => !page.hiddenFromSidebar && page.id !== area.id,
    );
    const orderedPages = area.id === "foundations" ? pages : [...pages].sort(compareReferenceLabels);
    return orderedPages.map((page) => page.id);
  });

export function getReferencePage(id) {
  return referencePages.find((page) => page.id === id);
}

export function getReferenceArea(id) {
  const page = getReferencePage(id);
  return referenceAreas.find((area) => area.id === (page?.areaId || id));
}

export function getAdjacentReferencePages(id) {
  const sequence = adjacentReferenceSequences.find((pageIds) => pageIds.includes(id));
  const index = sequence?.indexOf(id) ?? -1;

  return {
    previous: index > 0 ? getReferencePage(sequence[index - 1]) : undefined,
    next:
      sequence && index >= 0 && index < sequence.length - 1
        ? getReferencePage(sequence[index + 1])
        : undefined,
  };
}
