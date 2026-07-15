const actionVariants = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Ghost", value: "ghost" },
  { label: "Icon", value: "icon" },
];

export function actionWorkbenchMarkup({ variant = "primary" } = {}) {
  if (variant === "icon") {
    return '<button class="oc-action oc-action-icon" type="button" aria-label="Add item">\n  +\n</button>';
  }

  const label = variant === "primary"
    ? "Primary action"
    : `${variant.slice(0, 1).toUpperCase()}${variant.slice(1)}`;
  return `<button class="oc-action oc-action-${variant}" type="button">\n  ${label}\n</button>`;
}

const definitions = {
  "primitive-action": {
    defaults: { variant: "primary" },
    controls: [
      {
        id: "variant",
        label: "Variant",
        type: "choice",
        options: actionVariants,
      },
    ],
    markup: actionWorkbenchMarkup,
    render(specimen, state) {
      specimen.innerHTML = `<div class="primitive-row">${actionWorkbenchMarkup(state)}</div>`;
    },
  },
};

export function getWorkbenchDefinition(pageId) {
  return definitions[pageId];
}

export function normalizeWorkbenchState(definition, candidate = {}) {
  if (!definition) return {};
  const state = { ...definition.defaults };

  for (const control of definition.controls) {
    const value = candidate[control.id];
    if (control.type === "choice" && control.options.some((option) => option.value === value)) {
      state[control.id] = value;
    }
  }

  return state;
}
