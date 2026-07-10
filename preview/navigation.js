export const referenceAreas = [
  {
    id: "foundations",
    label: "Foundations",
    description: "Tokens, type, layout, and visual properties",
    path: "foundations/",
    pages: [
      {
        id: "foundations",
        label: "Overview",
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
    ],
  },
  {
    id: "interface",
    label: "Interface",
    description: "Shared primitives and interaction examples",
    path: "interface/",
    pages: [
      {
        id: "interface",
        label: "Overview",
        path: "interface/",
        keywords: "controls components interaction",
      },
      {
        id: "interface-primitives",
        label: "Shared primitives",
        path: "interface/primitives/",
        keywords: "exported css classes component catalog",
      },
      {
        id: "primitive-app-surface",
        label: "App surface",
        path: "interface/primitives/app-surface/",
        group: "Primitives",
        keywords: "oc-app-surface root wrapper background color font",
      },
      {
        id: "primitive-hero",
        label: "Hero",
        path: "interface/primitives/hero/",
        group: "Primitives",
        keywords: "oc-hero oc-hero-title oc-hero-lede",
      },
      {
        id: "primitive-section",
        label: "Section",
        path: "interface/primitives/section/",
        group: "Primitives",
        keywords: "oc-section header heading eyebrow title copy",
      },
      {
        id: "primitive-card",
        label: "Card",
        path: "interface/primitives/card/",
        group: "Primitives",
        keywords: "oc-card oc-card-interactive surface link",
      },
      {
        id: "primitive-action",
        label: "Action",
        path: "interface/primitives/action/",
        group: "Primitives",
        keywords: "oc-action primary secondary ghost icon button link",
      },
      {
        id: "primitive-segmented",
        label: "Segmented control",
        path: "interface/primitives/segmented-control/",
        group: "Primitives",
        keywords: "oc-segmented item aria selected pressed",
      },
      {
        id: "primitive-pill",
        label: "Pill",
        path: "interface/primitives/pill/",
        group: "Primitives",
        keywords: "oc-pill label metadata",
      },
      {
        id: "interface-examples",
        label: "Interaction examples",
        path: "interface/interaction-examples/",
        group: "Examples",
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

export function getReferencePage(id) {
  return referencePages.find((page) => page.id === id);
}

export function getReferenceArea(id) {
  const page = getReferencePage(id);
  return referenceAreas.find((area) => area.id === (page?.areaId || id));
}
