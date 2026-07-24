// Kept separate from the agent reference content so the component workbench
// can render the frame without importing the full catalog, which would close
// an import cycle through the workbench config.
import { agentIcon } from "./agent-icons.js";

// A declared brand accent is only usable with a foreground the host can put on
// it, so the specimen carries the pair a host would resolve together. This one
// clears AA on the accent it ships with; the frame default cannot, because
// --oc-text-on-accent is tuned for the OpenClaw accent rather than an
// arbitrary third-party one.
export const mcpAppBrand = { accent: "#6d28d9", accentContrast: "#ffffff" };

export function mcpAppFrame({
  name = "Table Booking",
  origin = "reservations",
  accent = "",
  accentContrast = "",
  body = "",
} = {}) {
  const custom = [
    accent ? `--oc-app-accent: ${accent}` : "",
    accentContrast ? `--oc-app-accent-contrast: ${accentContrast}` : "",
  ]
    .filter(Boolean)
    .join("; ");
  const style = custom ? ` style="${custom}"` : "";
  return `<section class="oc-mcp-app"${style}>
    <header class="oc-mcp-app-header">
      <div class="oc-mcp-app-identity">
        <span class="oc-mcp-app-mark" aria-hidden="true">${agentIcon("plug-zap")}</span>
        <span class="oc-mcp-app-name">${name}</span>
        <span class="oc-mcp-app-origin">${origin}</span>
      </div>
      <div class="oc-mcp-app-actions">
        <button type="button" aria-label="Reload app">${agentIcon("refresh-cw")}</button>
        <button type="button" aria-label="Expand app">${agentIcon("maximize-2")}</button>
      </div>
    </header>
    ${body}
  </section>`;
}

export const mcpAppDemoBody = `<div class="oc-mcp-app-body oc-embed-tokens"><div class="oc-mcp-app-demo"><span class="oc-mcp-app-demo-title">Two seats, 7:30 PM</span><span class="oc-mcp-app-demo-copy">Surfaces, text, borders, and geometry resolve from host tokens. The accent stays with the app.</span><div class="oc-mcp-app-demo-actions"><button type="button" class="is-brand">Reserve</button><button type="button">Pick another time</button></div></div></div>`;

const lifecycleStates = {
  loading: {
    icon: "loader-circle",
    title: "Starting Table Booking",
    copy: "The app is loading in its sandbox.",
    actions: "",
  },
  error: {
    icon: "triangle-alert",
    title: "This app failed to load",
    copy: "Reservations returned an error while rendering its surface.",
    actions: `<button class="oc-action oc-action-secondary" type="button">Try again</button>`,
  },
  expired: {
    icon: "history",
    title: "This view expired",
    copy: "The host released the app's lease after a period of inactivity.",
    actions: `<button class="oc-action oc-action-secondary" type="button">Reload app</button>`,
  },
  blocked: {
    icon: "shield-check",
    title: "Let this app run?",
    copy: "Reservations wants to render an interactive surface in this conversation.",
    actions: `<button class="oc-action" type="button">Allow</button><button class="oc-action oc-action-secondary" type="button">Not now</button>`,
  },
};

export function mcpAppState(state = "loading") {
  const { icon, title, copy, actions } = lifecycleStates[state] ?? lifecycleStates.loading;
  const actionsMarkup = actions ? `<div class="oc-mcp-app-state-actions">${actions}</div>` : "";
  return `<div class="oc-mcp-app-state" data-state="${state}" role="status">${agentIcon(icon)}<span class="oc-mcp-app-state-title">${title}</span><span class="oc-mcp-app-state-copy">${copy}</span>${actionsMarkup}</div>`;
}
