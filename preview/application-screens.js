import { agentIcon } from "./agent-components.js";

function navigationItem({ icon, label, meta = "", current = false } = {}) {
  return `<li><a class="oc-app-navigation-item" href="#"${current ? ' aria-current="page"' : ""} data-workbench-inert-link>
    <span class="oc-app-navigation-icon">${agentIcon(icon)}</span>
    <span class="oc-app-navigation-item-label">${label}</span>
    ${meta ? `<span class="oc-app-navigation-meta">${meta}</span>` : ""}
  </a></li>`;
}

function applicationNavigation({ current = "Overview", navigation = "expanded" } = {}) {
  return `<nav class="oc-app-navigation" aria-label="Application">
  <header class="oc-app-navigation-header">
    <span class="oc-app-navigation-mark" aria-hidden="true">OC</span>
    <span class="oc-app-navigation-title">OpenClaw</span>
  </header>
  <div class="oc-app-navigation-body">
    <section class="oc-app-navigation-section" aria-labelledby="application-nav-workspace">
      <p class="oc-app-navigation-label" id="application-nav-workspace">Workspace</p>
      <ul class="oc-app-navigation-list">
        ${navigationItem({ icon: "layout-dashboard", label: "Overview", current: current === "Overview" })}
        ${navigationItem({ icon: "message-square", label: "Sessions", meta: "4", current: current === "Sessions" })}
        ${navigationItem({ icon: "radio", label: "Channels", meta: "6", current: current === "Channels" })}
        ${navigationItem({ icon: "calendar-clock", label: "Automation", meta: "3", current: current === "Automation" })}
      </ul>
    </section>
    <section class="oc-app-navigation-section" aria-labelledby="application-nav-system">
      <p class="oc-app-navigation-label" id="application-nav-system">System</p>
      <ul class="oc-app-navigation-list">
        ${navigationItem({ icon: "activity", label: "Activity", current: current === "Activity" })}
        ${navigationItem({ icon: "settings", label: "Settings", current: current === "Settings" })}
      </ul>
    </section>
  </div>
  <footer class="oc-app-navigation-footer">
    <span class="oc-app-navigation-mark" aria-hidden="true">VK</span>
    <span class="oc-app-navigation-item-label">Personal workspace</span>
  </footer>
</nav>`;
}

function statusMarkup(state, labels = {}) {
  const label = labels[state] ?? {
    ready: "Gateway connected",
    offline: "Gateway unavailable",
    loading: "Refreshing status",
    error: "Action required",
    active: "Agent running",
    idle: "Agent idle",
  }[state] ?? state;
  const tone = {
    ready: "success",
    active: "success",
    offline: "error",
    error: "error",
    loading: "info",
    idle: "warning",
  }[state] ?? "info";
  return `<span class="oc-status oc-status-${tone}" role="status">
    <span class="oc-status-indicator" aria-hidden="true"></span>
    <span class="oc-status-label">${label}</span>
  </span>`;
}

function settingsRow({ title, description, control, stacked = false } = {}) {
  return `<div class="oc-settings-row${stacked ? " oc-settings-row-stacked" : ""}">
  <div class="oc-settings-row-content">
    <p class="oc-settings-row-title">${title}</p>
    <p class="oc-settings-row-description">${description}</p>
  </div>
  <div class="oc-settings-row-control">${control}</div>
</div>`;
}

export function settingsApplicationMarkup({
  navigation = "expanded",
  density = "comfortable",
  state = "ready",
} = {}) {
  const offline = state === "offline";
  return `<div class="oc-app-frame" data-navigation="${navigation}">
  ${applicationNavigation({ current: "Settings", navigation })}
  <main class="oc-app-main">
    <header class="oc-page-header">
      <div class="oc-page-header-content">
        <p class="oc-page-header-kicker">Application settings</p>
        <h1 class="oc-page-header-title">Preferences</h1>
        <p class="oc-page-header-description">Tune gateway behavior, notifications, appearance, and agent defaults.</p>
      </div>
      <div class="oc-page-header-actions">
        ${statusMarkup(state)}
        <button class="oc-action oc-action-secondary" type="button">Check connection</button>
      </div>
    </header>
    <div class="oc-pane-layout">
      <div class="oc-settings-page" data-density="${density}">
        ${offline ? `<div class="oc-banner oc-banner-error" role="alert"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Gateway unavailable</strong><p>Changes remain local until the gateway reconnects.</p></div></div>` : ""}
        <section class="oc-settings-section" aria-labelledby="settings-general">
          <header class="oc-settings-section-header">
            <div class="oc-settings-section-heading">
              <h2 class="oc-settings-section-title" id="settings-general">General</h2>
              <p class="oc-settings-section-description">Common application behavior across desktop and browser surfaces.</p>
            </div>
          </header>
          <div class="oc-settings-group">
            ${settingsRow({
              title: "Launch gateway at login",
              description: "Keep local channels and scheduled tasks available after sign-in.",
              control: '<label class="oc-switch-label"><span class="sr-only">Launch gateway at login</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
            })}
            ${settingsRow({
              title: "Menu bar presence",
              description: "Show connection state and quick actions outside the main window.",
              control: '<label class="oc-switch-label"><span class="sr-only">Menu bar presence</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
            })}
            ${settingsRow({
              title: "Update channel",
              description: "Choose when this installation receives compatible releases.",
              control: '<span class="oc-select-wrap"><select class="oc-select" aria-label="Update channel"><option>Stable</option><option>Beta</option><option>Nightly</option></select></span>',
            })}
          </div>
        </section>
        <section class="oc-settings-section" aria-labelledby="settings-appearance">
          <header class="oc-settings-section-header">
            <div class="oc-settings-section-heading">
              <h2 class="oc-settings-section-title" id="settings-appearance">Appearance</h2>
              <p class="oc-settings-section-description">The product theme follows the same semantic roles on every surface.</p>
            </div>
          </header>
          <div class="oc-settings-group">
            ${settingsRow({
              title: "Theme",
              description: "Use system appearance or select a persistent mode.",
              control: '<div class="oc-segmented" aria-label="Theme"><button class="oc-segmented-item" type="button" aria-pressed="true">System</button><button class="oc-segmented-item" type="button" aria-pressed="false">Light</button><button class="oc-segmented-item" type="button" aria-pressed="false">Dark</button></div>',
            })}
            ${settingsRow({
              title: "Interface density",
              description: "Reduce row height while preserving control targets and readable labels.",
              control: `<div class="oc-segmented" aria-label="Interface density"><button class="oc-segmented-item" type="button" aria-pressed="${density === "comfortable"}">Comfortable</button><button class="oc-segmented-item" type="button" aria-pressed="${density === "compact"}">Compact</button></div>`,
            })}
          </div>
        </section>
        <section class="oc-settings-section" aria-labelledby="settings-agents">
          <header class="oc-settings-section-header">
            <div class="oc-settings-section-heading">
              <h2 class="oc-settings-section-title" id="settings-agents">Agent defaults</h2>
              <p class="oc-settings-section-description">Defaults apply to new sessions and remain editable per session.</p>
            </div>
            <div class="oc-settings-section-actions">
              <button class="oc-action oc-action-ghost" type="button">Reset</button>
            </div>
          </header>
          <div class="oc-settings-group">
            ${settingsRow({
              title: "Default workspace",
              description: "The starting directory used when a session has no explicit workspace.",
              stacked: true,
              control: '<div class="oc-field"><label class="oc-field-label" for="settings-workspace">Workspace</label><input class="oc-input" id="settings-workspace" value="~/Projects/openclaw" /></div>',
            })}
          </div>
        </section>
      </div>
    </div>
  </main>
</div>`;
}

function operationListItem({ title, description, status, selected = false } = {}) {
  return `<button class="oc-settings-row oc-settings-row-interactive" type="button" aria-selected="${selected}">
  <span class="oc-settings-row-content">
    <span class="oc-settings-row-title">${title}</span>
    <span class="oc-settings-row-description">${description}</span>
  </span>
  ${statusMarkup(status, {
    ready: "Connected",
    active: "Running",
    idle: "Paused",
    error: "Needs attention",
  })}
</button>`;
}

function channelDetail(state) {
  if (state === "loading") {
    return `<div class="oc-pane-body"><span class="oc-loader" role="status"><span class="oc-loader-spinner" aria-hidden="true"></span>Loading Discord configuration</span></div>`;
  }
  if (state === "error") {
    return `<div class="oc-pane-body"><div class="oc-banner oc-banner-error" role="alert"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Discord token expired</strong><p>Reconnect the channel before messages can be delivered.</p></div><button class="oc-action oc-action-secondary" type="button">Reconnect</button></div></div>`;
  }
  return `<div class="oc-pane-body">
    <div class="oc-settings-page">
      <section class="oc-settings-section" aria-labelledby="channel-connection">
        <header class="oc-settings-section-header"><div class="oc-settings-section-heading"><h3 class="oc-settings-section-title" id="channel-connection">Connection</h3><p class="oc-settings-section-description">Transport state and delivery policy for this channel.</p></div></header>
        <div class="oc-settings-group">
          ${settingsRow({
            title: "Channel enabled",
            description: "Receive mentions and deliver agent responses.",
            control: '<label class="oc-switch-label"><span class="sr-only">Channel enabled</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
          })}
          ${settingsRow({
            title: "Delivery mode",
            description: "Stream partial responses or deliver complete messages.",
            control: '<span class="oc-select-wrap"><select class="oc-select" aria-label="Delivery mode"><option>Stream responses</option><option>Complete messages</option></select></span>',
          })}
        </div>
      </section>
      <section class="oc-settings-section" aria-labelledby="channel-routing">
        <header class="oc-settings-section-header"><div class="oc-settings-section-heading"><h3 class="oc-settings-section-title" id="channel-routing">Routing</h3><p class="oc-settings-section-description">Choose the default agent and mention behavior.</p></div></header>
        <div class="oc-settings-group">
          ${settingsRow({
            title: "Default agent",
            description: "Handles new conversations when no route is specified.",
            control: '<span class="oc-select-wrap"><select class="oc-select" aria-label="Default agent"><option>Personal</option><option>Release</option><option>Support</option></select></span>',
          })}
        </div>
      </section>
    </div>
  </div>`;
}

function automationDetail(state) {
  return `<div class="oc-pane-body">
  <div class="oc-settings-page">
    ${state === "error" ? '<div class="oc-banner oc-banner-error" role="alert"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Last run failed</strong><p>The release digest could not reach its destination.</p></div></div>' : ""}
    <section class="oc-settings-section" aria-labelledby="automation-schedule">
      <header class="oc-settings-section-header"><div class="oc-settings-section-heading"><h3 class="oc-settings-section-title" id="automation-schedule">Schedule</h3><p class="oc-settings-section-description">Runs every weekday using the personal workspace.</p></div></header>
      <div class="oc-settings-group">
        ${settingsRow({
          title: "Automation enabled",
          description: "The next run is scheduled for 09:00 local time.",
          control: '<label class="oc-switch-label"><span class="sr-only">Automation enabled</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
        })}
        ${settingsRow({
          title: "Run time",
          description: "Uses the application timezone.",
          control: '<div class="oc-field"><label class="sr-only" for="automation-time">Run time</label><input class="oc-input" id="automation-time" type="time" value="09:00" /></div>',
        })}
      </div>
    </section>
    <section class="oc-settings-section" aria-labelledby="automation-prompt">
      <header class="oc-settings-section-header"><div class="oc-settings-section-heading"><h3 class="oc-settings-section-title" id="automation-prompt">Task</h3><p class="oc-settings-section-description">The agent receives this instruction at each scheduled run.</p></div></header>
      <div class="oc-settings-group">
        ${settingsRow({
          title: "Release digest",
          description: "Summarize merged changes and current release blockers.",
          stacked: true,
          control: '<textarea class="oc-textarea" rows="4" aria-label="Automation prompt">Review merged changes since the last release and prepare a concise digest.</textarea>',
        })}
      </div>
    </section>
  </div>
</div>`;
}

export function operationsApplicationMarkup({
  view = "channels",
  state = "ready",
  navigation = "expanded",
} = {}) {
  const channels = view === "channels";
  return `<div class="oc-app-frame" data-navigation="${navigation}">
  ${applicationNavigation({ current: channels ? "Channels" : "Automation", navigation })}
  <main class="oc-app-main">
    <header class="oc-page-header">
      <div class="oc-page-header-content">
        <p class="oc-page-header-kicker">Operations</p>
        <h1 class="oc-page-header-title">${channels ? "Channels" : "Automation"}</h1>
        <p class="oc-page-header-description">${channels ? "Monitor transport state and configure message delivery." : "Manage scheduled agent work and inspect recent runs."}</p>
      </div>
      <div class="oc-page-header-actions">
        ${statusMarkup(state)}
        <button class="oc-action oc-action-primary" type="button">${channels ? "Add channel" : "New automation"}</button>
      </div>
    </header>
    <div class="oc-pane-layout">
      <section class="oc-pane oc-pane-split" aria-label="${channels ? "Channel configuration" : "Automation configuration"}">
        <section class="oc-pane" aria-label="${channels ? "Channels" : "Automations"}">
            <header class="oc-pane-header">
              <div class="oc-pane-heading">
                <h2 class="oc-pane-title">${channels ? "Connected channels" : "Scheduled work"}</h2>
                <p class="oc-pane-description">${channels ? "6 configured transports" : "3 recurring tasks"}</p>
              </div>
            </header>
            <div class="oc-pane-body oc-pane-body-flush">
              <div class="oc-settings-group">
                ${channels
                  ? [
                    operationListItem({ title: "Discord", description: "Bot transport", status: state === "error" ? "error" : "ready", selected: true }),
                    operationListItem({ title: "Telegram", description: "User and bot delivery", status: "ready" }),
                    operationListItem({ title: "Slack", description: "Workspace app", status: "idle" }),
                    operationListItem({ title: "WebChat", description: "Embedded client", status: "ready" }),
                  ].join("")
                  : [
                    operationListItem({ title: "Release digest", description: "Weekdays at 09:00", status: state === "error" ? "error" : "active", selected: true }),
                    operationListItem({ title: "Issue triage", description: "Every 2 hours", status: "active" }),
                    operationListItem({ title: "Archive sync", description: "Daily at 02:00", status: "idle" }),
                  ].join("")}
              </div>
            </div>
        </section>
        <section class="oc-pane" aria-label="Selected item">
            <header class="oc-pane-header">
              <div class="oc-pane-heading">
                <h2 class="oc-pane-title">${channels ? "Discord" : "Release digest"}</h2>
                <p class="oc-pane-description">${channels ? "Connected as OpenClaw" : "Next run tomorrow at 09:00"}</p>
              </div>
              <div class="oc-pane-actions">
                <button class="oc-action oc-action-ghost" type="button">Run check</button>
                <button class="oc-action oc-action-primary" type="button">Save</button>
              </div>
            </header>
            ${channels ? channelDetail(state) : automationDetail(state)}
        </section>
      </section>
    </div>
  </main>
</div>`;
}

function activityRows() {
  return `<div class="oc-settings-group">
  <div class="oc-settings-row">
    <span class="oc-settings-row-content"><span class="oc-settings-row-title">Read repository instructions</span><span class="oc-settings-row-description">AGENTS.md · complete</span></span>
    ${statusMarkup("ready", { ready: "Complete" })}
  </div>
  <div class="oc-settings-row">
    <span class="oc-settings-row-content"><span class="oc-settings-row-title">Run focused tests</span><span class="oc-settings-row-description">tests/application.test.ts</span></span>
    ${statusMarkup("active", { active: "Running" })}
  </div>
  <div class="oc-settings-row">
    <span class="oc-settings-row-content"><span class="oc-settings-row-title">Capture visual evidence</span><span class="oc-settings-row-description">Desktop and mobile themes</span></span>
    ${statusMarkup("idle", { idle: "Queued" })}
  </div>
</div>`;
}

function workspaceInspector(status) {
  return `<section class="oc-pane" aria-label="Inspector">
  <header class="oc-pane-header">
    <div class="oc-pane-heading"><h2 class="oc-pane-title">Inspector</h2><p class="oc-pane-description">Session state and activity</p></div>
    ${statusMarkup(status)}
  </header>
  <div class="oc-pane-body">
    <div class="oc-settings-page">
      <section class="oc-settings-section" aria-labelledby="workspace-session">
        <header class="oc-settings-section-header"><div class="oc-settings-section-heading"><h3 class="oc-settings-section-title" id="workspace-session">Session</h3></div></header>
        <div class="oc-settings-group">
          ${settingsRow({ title: "Mode", description: "Direct task execution", control: '<span class="oc-badge oc-badge-info">Agent</span>' })}
          ${settingsRow({ title: "Model", description: "Current runtime selection", control: '<span class="oc-badge oc-badge-neutral">GPT-5.6</span>' })}
          ${settingsRow({ title: "Context", description: "Prepared prompt capacity", control: '<span class="oc-settings-row-title">41%</span>' })}
        </div>
      </section>
      <section class="oc-settings-section" aria-labelledby="workspace-activity">
        <header class="oc-settings-section-header"><div class="oc-settings-section-heading"><h3 class="oc-settings-section-title" id="workspace-activity">Activity</h3></div></header>
        ${activityRows()}
      </section>
    </div>
  </div>
</section>`;
}

function workspaceConversation(status) {
  return `<section class="oc-pane" aria-label="Agent workspace">
  <header class="oc-pane-header">
    <div class="oc-pane-heading"><h2 class="oc-pane-title">Design system parity</h2><p class="oc-pane-description">feat/app-surface-parity · Carapace</p></div>
    <div class="oc-pane-actions"><button class="oc-action oc-action-icon" type="button" aria-label="Open terminal">${agentIcon("terminal")}</button><button class="oc-action oc-action-icon" type="button" aria-label="More actions">${agentIcon("ellipsis")}</button></div>
  </header>
  <div class="oc-pane-body">
    <div class="application-workspace-transcript">
      <article class="application-workspace-message application-workspace-message-user"><p>Bring the macOS app and Control UI application surfaces to semantic parity.</p></article>
      <article class="application-workspace-message application-workspace-message-agent"><p>I mapped the repeated shell, pane, settings, and status anatomy. The shared layer stays visual; each app keeps its runtime behavior.</p><div class="oc-banner oc-banner-info" role="status"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Candidate contract ready</strong><p>Desktop, tablet, mobile, light, and dark variants are queued for review.</p></div></div></article>
    </div>
  </div>
  <footer class="oc-pane-footer">
    <div class="application-workspace-composer">
      <label class="sr-only" for="workspace-message">Message</label>
      <textarea class="oc-textarea" id="workspace-message" rows="2" placeholder="Send a message to the agent"></textarea>
      <button class="oc-action oc-action-primary" type="button" aria-label="Send message">${agentIcon("arrow-up")}</button>
    </div>
    ${statusMarkup(status)}
  </footer>
</section>`;
}

export function workspaceApplicationMarkup({
  dock = "right",
  inspector = true,
  status = "active",
  navigation = "compact",
} = {}) {
  const showInspector = inspector && dock !== "hidden";
  const split = dock === "bottom" ? "balanced" : "inspector";
  const workspacePanes = showInspector
    ? `<div class="oc-pane oc-pane-split" data-split="${split}">
        ${workspaceConversation(status)}
        ${workspaceInspector(status)}
      </div>`
    : workspaceConversation(status);
  return `<div class="oc-app-frame application-workspace" data-navigation="${navigation}" data-dock="${dock}">
  ${applicationNavigation({ current: "Sessions", navigation })}
  <main class="oc-app-main">
    <header class="oc-page-header">
      <div class="oc-page-header-content">
        <p class="oc-page-header-kicker">Workspace</p>
        <h1 class="oc-page-header-title">Agent sessions</h1>
        <p class="oc-page-header-description">Work with an agent while keeping execution state and tools visible.</p>
      </div>
      <div class="oc-page-header-actions">
        ${statusMarkup(status)}
        <button class="oc-action oc-action-primary" type="button">New session</button>
      </div>
    </header>
    <div class="oc-pane-layout">
      ${workspacePanes}
    </div>
  </main>
</div>`;
}

export const applicationScreenMarkup = {
  settings: settingsApplicationMarkup(),
  operations: operationsApplicationMarkup(),
  workspace: workspaceApplicationMarkup(),
};
