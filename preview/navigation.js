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
        keywords: "oc-autocomplete suggestions datalist input native",
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

const adjacentReferenceSequences = [
  [
    "foundation-tokens",
    "foundation-colors",
    "foundation-typography",
    "foundation-layout",
    "foundation-shape-depth",
    "foundation-motion",
    "foundation-base",
  ],
  [
    "primitive-action",
    "primitive-app-surface",
    "primitive-autocomplete",
    "primitive-badge",
    "primitive-banner",
    "primitive-breadcrumbs",
    "primitive-button",
    "primitive-card",
    "primitive-checkbox",
    "primitive-clipboard-text",
    "primitive-code-highlighted",
    "primitive-collapsible",
    "primitive-input-area",
    "primitive-input-group",
    "primitive-input",
    "primitive-label",
    "primitive-hero",
    "primitive-pill",
    "primitive-radio",
    "primitive-section",
    "primitive-segmented",
    "primitive-sensitive-input",
    "primitive-select",
    "primitive-switch",
  ],
];

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
