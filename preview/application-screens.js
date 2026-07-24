import { agentIcon } from "./agent-components.js";
import {
  applicationModelControlsMarkup,
  escapeAttribute,
} from "./application-model-controls.js";

const openClawMarkUrl = new URL("./assets/openclaw-mark.png", import.meta.url).href;

function navigationItem({ icon, label, meta = "", current = false, view = "" } = {}) {
  const viewHook = view ? ` data-workbench-application-view="${escapeAttribute(view)}"` : "";
  return `<li><a class="oc-app-navigation-item" href="#"${current ? ' aria-current="page"' : ""} data-workbench-inert-link${viewHook}>
    <span class="oc-app-navigation-icon">${agentIcon(icon)}</span>
    <span class="oc-app-navigation-item-label">${label}</span>
    ${meta ? `<span class="oc-app-navigation-meta">${meta}</span>` : ""}
  </a></li>`;
}

function applicationNavigation({
  current = "Overview",
  navigation = "expanded",
  state = "ready",
  // Screens that own an in-canvas view (operations) mark the matching
  // navigation items so the workbench binder can switch views on click.
  viewHooks = false,
} = {}) {
  const gatewayOffline = state === "offline";
  return `<nav class="oc-app-navigation" aria-label="Application">
  <header class="oc-app-navigation-header">
    <img class="oc-app-navigation-brand" src="${openClawMarkUrl}" alt="" width="32" height="32" />
    <span class="oc-app-navigation-title">OpenClaw</span>
    <button class="oc-app-navigation-collapse" type="button" aria-label="${navigation === "compact" ? "Expand navigation" : "Collapse navigation"}" data-workbench-application-navigation>${agentIcon(navigation === "compact" ? "panel-left-open" : "panel-left-close")}</button>
  </header>
  <div class="oc-app-navigation-context">
    <span class="oc-app-navigation-context-icon">${agentIcon("folder-git-2")}</span>
    <span class="oc-app-navigation-context-copy"><strong>Personal</strong><small>Local workspace</small></span>
    <span class="oc-app-navigation-context-chevron">${agentIcon("chevron")}</span>
  </div>
  <div class="oc-app-navigation-body">
    <section class="oc-app-navigation-section" aria-labelledby="application-nav-workspace">
      <p class="oc-app-navigation-label" id="application-nav-workspace">Workspace</p>
      <ul class="oc-app-navigation-list">
        ${navigationItem({ icon: "layout-dashboard", label: "Overview", current: current === "Overview" })}
        ${navigationItem({ icon: "message-square", label: "Sessions", meta: "4", current: current === "Sessions" })}
        ${navigationItem({ icon: "radio", label: "Channels", meta: "5", current: current === "Channels", view: viewHooks ? "channels" : "" })}
        ${navigationItem({ icon: "calendar-clock", label: "Automation", meta: "3", current: current === "Automation", view: viewHooks ? "automation" : "" })}
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
    <span class="oc-app-navigation-presence" data-state="${gatewayOffline ? "offline" : "online"}" aria-hidden="true"></span>
    <span class="oc-app-navigation-footer-copy"><strong>Gateway ${gatewayOffline ? "offline" : "online"}</strong><small>${gatewayOffline ? "Last seen 4m ago" : "v2026.7.1"}</small></span>
    <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="Gateway details">${agentIcon("chevron-right")}</button>
  </footer>
</nav>`;
}

function statusMarkup(state, labels = {}) {
  const label =
    labels[state] ??
    {
      ready: "Gateway connected",
      offline: "Gateway unavailable",
      loading: "Refreshing status",
      error: "Action required",
      active: "Agent running",
      idle: "Agent idle",
    }[state] ??
    state;
  const tone =
    {
      ready: "success",
      active: "success",
      offline: "error",
      error: "error",
      loading: "info",
      idle: "warning",
    }[state] ?? "info";
  return `<span class="oc-status oc-status-${tone}">
    <span class="oc-status-indicator" aria-hidden="true"></span>
    <span class="oc-status-label">${label}</span>
  </span>`;
}

function applicationVoiceActivityMarkup(state) {
  return `<span class="oc-composer-voice-bars" data-state="${state}" aria-hidden="true">${Array.from(
    { length: 7 },
    () => "<i></i>",
  ).join("")}</span>`;
}

export function applicationTalkToggleMarkup({ voice = "idle" } = {}) {
  const active = voice !== "idle";
  return `<button class="oc-composer-tool${active ? " is-active" : ""}" type="button" aria-label="${active ? "Stop talk mode" : "Start talk mode"}" aria-pressed="${active}" data-workbench-composer-talk data-voice-state="${voice}">${agentIcon(active ? "audio-waveform" : "audio-lines")}</button>`;
}

export function applicationCameraPreviewMarkup({ camera = false } = {}) {
  if (!camera) return "";
  return `<div class="oc-composer-camera-preview" data-workbench-camera-preview>
    <div><span class="oc-composer-camera-person" aria-hidden="true">${agentIcon("user")}</span><span>Camera preview</span></div>
    <button type="button" aria-label="Switch camera" data-workbench-camera-switch>${agentIcon("switch-camera")}</button>
  </div>`;
}

export function applicationComposerPrimaryMarkup({
  busy = false,
  voice = "idle",
  camera = false,
} = {}) {
  if (busy) {
    return `<button class="oc-composer-primary-button is-stop" type="button" aria-label="Stop response">${agentIcon("square")}</button>`;
  }
  const voiceActive = voice !== "idle";
  if (voiceActive) {
    const voiceLabel =
      {
        connecting: "Connecting",
        listening: "Listening",
        thinking: "Thinking",
        error: "Voice unavailable",
      }[voice] ?? "Listening";
    return `<div class="oc-composer-primary-actions" data-voice-state="${voice}">
      <button class="oc-composer-voice-live${voice === "error" ? " is-error" : ""}" type="button" aria-label="Stop talk mode" data-workbench-composer-talk data-voice-state="${voice}">
        ${voice === "error" ? agentIcon("triangle-alert") : applicationVoiceActivityMarkup(voice)}
        <span>${voiceLabel}</span>${agentIcon("square")}
      </button>
      ${
        voice === "error"
          ? ""
          : `<button class="oc-composer-camera-toggle${camera ? " is-active" : ""}" type="button" aria-label="${camera ? "Turn camera off" : "Turn camera on"}" aria-pressed="${camera}" data-workbench-composer-camera>${agentIcon(camera ? "camera-off" : "camera")}</button>`
      }
    </div>`;
  }
  return `<div class="oc-composer-primary-actions">
    <button class="oc-composer-primary-button" type="submit" aria-label="Send message" data-workbench-composer-send hidden>${agentIcon("arrow-up")}</button>
    <button class="oc-composer-primary-button is-dictation" type="button" aria-label="Hold to dictate" aria-pressed="false" data-workbench-composer-dictation>${agentIcon("mic")}</button>
  </div>`;
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

function settingsNavigationItem({ icon, label, current = false, meta = "" } = {}) {
  return `<button class="oc-settings-navigation-item" type="button"${current ? ' aria-current="page"' : ""}>
    <span class="oc-settings-navigation-icon">${agentIcon(icon)}</span>
    <span>${label}</span>
    ${meta ? `<small>${meta}</small>` : ""}
  </button>`;
}

function settingsNavigation(state) {
  return `<aside class="oc-settings-navigation" aria-label="Settings sections">
  <header class="oc-settings-navigation-header">
    <div>
      <span class="oc-settings-navigation-kicker">Workspace</span>
      <h1>Settings</h1>
    </div>
    <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="Close settings">${agentIcon("close")}</button>
  </header>
  <label class="oc-settings-search">
    <span class="sr-only">Search settings</span>
    ${agentIcon("search")}
    <input type="search" placeholder="Search settings" />
    <kbd>⌘ F</kbd>
  </label>
  <nav class="oc-settings-navigation-list" aria-label="Settings sections">
    <section>
      <p>Application</p>
      ${settingsNavigationItem({ icon: "sliders-horizontal", label: "General", current: true })}
      ${settingsNavigationItem({ icon: "palette", label: "Appearance" })}
      ${settingsNavigationItem({ icon: "bell", label: "Notifications" })}
    </section>
    <section>
      <p>OpenClaw</p>
      ${settingsNavigationItem({ icon: "radio-tower", label: "Gateway", meta: state === "offline" ? "Offline" : "" })}
      ${settingsNavigationItem({ icon: "bot", label: "Agent defaults" })}
      ${settingsNavigationItem({ icon: "shield-check", label: "Permissions" })}
      ${settingsNavigationItem({ icon: "blocks", label: "Skills" })}
    </section>
    <section>
      <p>Advanced</p>
      ${settingsNavigationItem({ icon: "terminal", label: "Execution" })}
      ${settingsNavigationItem({ icon: "file-json", label: "Configuration" })}
      ${settingsNavigationItem({ icon: "bug", label: "Diagnostics" })}
    </section>
  </nav>
  <footer class="oc-settings-navigation-footer">
    ${statusMarkup(state)}
    <span>Changes save automatically</span>
  </footer>
</aside>`;
}

function gatewayIdentity(state) {
  const offline = state === "offline";
  return `<div class="oc-settings-group oc-settings-gateway">
  ${settingsRow({
    title: "Local OpenClaw",
    description: offline ? "Last connected 4 minutes ago." : "Listening on this Mac · 12 ms.",
    control: `<div class="oc-settings-inline-actions">${statusMarkup(state, {
      ready: "Connected",
      offline: "Offline",
    })}<button class="oc-action oc-action-ghost" type="button">${offline ? "Reconnect" : "Details"}</button></div>`,
  })}
</div>`;
}

export function settingsApplicationMarkup({
  density = "compact",
  state = "ready",
} = {}) {
  const offline = state === "offline";
  return `<div class="oc-settings-shell" data-density="${density}">
  ${settingsNavigation(state)}
  <main class="oc-settings-detail" aria-labelledby="settings-general">
    <header class="oc-detail-header">
      <div>
        <h1 id="settings-general">General</h1>
        <p>Startup, appearance, and defaults for this device.</p>
      </div>
      <button class="oc-action oc-action-ghost" type="button">Restore defaults</button>
    </header>
    <div class="oc-settings-detail-scroll">
      ${offline ? `<div class="oc-banner oc-banner-error" role="alert"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Gateway unavailable</strong><p>Gateway-backed changes will sync after reconnecting.</p></div><button class="oc-action oc-action-secondary" type="button">Retry</button></div>` : ""}
      ${gatewayIdentity(state)}
      <section class="oc-settings-section" aria-labelledby="settings-startup">
        <header class="oc-settings-section-header">
          <div class="oc-settings-section-heading">
            <h2 class="oc-settings-section-title" id="settings-startup">Startup</h2>
          </div>
        </header>
        <div class="oc-settings-group">
          ${settingsRow({
            title: "Launch gateway at login",
            description: "Start the local runtime when you sign in.",
            control:
              '<label class="oc-switch-label"><span class="sr-only">Launch gateway at login</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
          })}
          ${settingsRow({
            title: "Show in menu bar",
            description: "Keep connection state and session shortcuts nearby.",
            control:
              '<label class="oc-switch-label"><span class="sr-only">Show in menu bar</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
          })}
          ${settingsRow({
            title: "Update channel",
            description: "Choose stable or prerelease builds.",
            control:
              '<span class="oc-select-wrap"><select class="oc-select" aria-label="Update channel"><option>Stable</option><option>Beta</option><option>Nightly</option></select></span>',
          })}
        </div>
      </section>
      <section class="oc-settings-section" aria-labelledby="settings-interface">
        <header class="oc-settings-section-header">
          <div class="oc-settings-section-heading">
            <h2 class="oc-settings-section-title" id="settings-interface">Interface</h2>
          </div>
        </header>
        <div class="oc-settings-group">
          ${settingsRow({
            title: "Theme",
            description: "Follow the system or use a fixed appearance.",
            control:
              '<div class="oc-segmented" role="group" aria-label="Theme"><button class="oc-segmented-item" type="button" aria-pressed="true">System</button><button class="oc-segmented-item" type="button" aria-pressed="false">Light</button><button class="oc-segmented-item" type="button" aria-pressed="false">Dark</button></div>',
          })}
          ${settingsRow({
            title: "Density",
            description: "Adjust information density.",
            control: `<div class="oc-segmented" role="group" aria-label="Interface density"><button class="oc-segmented-item" type="button" aria-pressed="${density === "comfortable"}">Comfortable</button><button class="oc-segmented-item" type="button" aria-pressed="${density === "compact"}">Compact</button></div>`,
          })}
        </div>
      </section>
      <section class="oc-settings-section" aria-labelledby="settings-defaults">
        <header class="oc-settings-section-header">
          <div class="oc-settings-section-heading">
            <h2 class="oc-settings-section-title" id="settings-defaults">Session defaults</h2>
          </div>
        </header>
        <div class="oc-settings-group">
          ${settingsRow({
            title: "Default workspace",
            description: "Used when a session has no explicit project.",
            stacked: true,
            control:
              '<div class="oc-field"><label class="sr-only" for="settings-workspace">Workspace</label><input class="oc-input" id="settings-workspace" value="~/Projects/openclaw" /></div>',
          })}
        </div>
      </section>
    </div>
  </main>
</div>`;
}

function resourceListItem({ icon, title, description, status, meta, selected = false } = {}) {
  return `<button class="oc-app-resource-list-item" type="button" aria-pressed="${selected}">
  <span class="oc-app-resource-list-icon">${agentIcon(icon)}</span>
  <span class="oc-app-resource-list-copy"><strong>${title}</strong><small>${description}</small></span>
  <span class="oc-app-resource-list-meta">${statusMarkup(status, {
    ready: "Connected",
    active: "Running",
    idle: "Paused",
    error: "Attention",
  })}<small>${meta}</small></span>
</button>`;
}

function activityItem({ icon, title, detail, time, tone = "neutral" } = {}) {
  return `<li class="oc-activity-item" data-tone="${tone}">
  <span class="oc-activity-marker">${agentIcon(icon)}</span>
  <span class="oc-activity-copy"><strong>${title}</strong><small>${detail}</small></span>
  <time>${time}</time>
</li>`;
}

function channelDetail(state) {
  if (state === "loading") {
    return `<div class="oc-pane-body oc-pane-state"><span class="oc-loader" role="status"><span class="oc-loader-spinner" aria-hidden="true"></span>Loading Discord configuration</span></div>`;
  }
  if (state === "error") {
    return `<div class="oc-pane-body oc-pane-state"><div class="oc-banner oc-banner-error" role="alert"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Discord token expired</strong><p>Reconnect the channel before messages can be delivered.</p></div><button class="oc-action oc-action-primary" type="button">Reconnect</button></div></div>`;
  }
  return `<div class="oc-pane-body oc-detail-grid">
    <section class="oc-detail-section" aria-labelledby="channel-connection">
      <header><span class="oc-detail-section-icon">${agentIcon("plug-zap")}</span><div><h3 id="channel-connection">Connection</h3><p>Transport identity and delivery policy.</p></div></header>
      <div class="oc-settings-group">
        ${settingsRow({
          title: "Channel enabled",
          description: "Receive mentions and deliver agent responses.",
          control:
            '<label class="oc-switch-label"><span class="sr-only">Channel enabled</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
        })}
        ${settingsRow({
          title: "Delivery mode",
          description: "Stream partial responses or send complete messages.",
          control:
            '<span class="oc-select-wrap"><select class="oc-select" aria-label="Delivery mode"><option>Stream responses</option><option>Complete messages</option></select></span>',
        })}
        ${settingsRow({
          title: "Default agent",
          description: "Handles new conversations without an explicit route.",
          control:
            '<span class="oc-select-wrap"><select class="oc-select" aria-label="Default agent"><option>Personal</option><option>Release</option><option>Support</option></select></span>',
        })}
      </div>
    </section>
    <section class="oc-detail-section" aria-labelledby="channel-activity">
      <header><span class="oc-detail-section-icon">${agentIcon("activity")}</span><div><h3 id="channel-activity">Recent delivery</h3><p>Live transport events from the gateway.</p></div><button class="oc-action oc-action-ghost" type="button">View logs</button></header>
      <ol class="oc-activity-list">
        ${activityItem({ icon: "arrow-down-left", title: "Mention received", detail: "#release · maintainer", time: "12s", tone: "success" })}
        ${activityItem({ icon: "sparkles", title: "Agent response started", detail: "Personal · GPT-5.5", time: "11s", tone: "info" })}
        ${activityItem({ icon: "check", title: "Message delivered", detail: "1,482 characters · 3 chunks", time: "7s", tone: "success" })}
        ${activityItem({ icon: "heart-pulse", title: "Health check", detail: "Gateway round trip 42 ms", time: "2m" })}
      </ol>
    </section>
  </div>`;
}

function automationDetail(state) {
  if (state === "loading") {
    return `<div class="oc-pane-body oc-pane-state"><span class="oc-loader" role="status"><span class="oc-loader-spinner" aria-hidden="true"></span>Loading automation configuration</span></div>`;
  }
  return `<div class="oc-pane-body oc-detail-grid">
    ${state === "error" ? '<div class="oc-banner oc-banner-error oc-detail-grid-span" role="alert"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Last run failed</strong><p>The release digest could not reach its Discord destination.</p></div><button class="oc-action oc-action-secondary" type="button">Inspect run</button></div>' : ""}
    <section class="oc-detail-section" aria-labelledby="automation-schedule">
      <header><span class="oc-detail-section-icon">${agentIcon("calendar-clock")}</span><div><h3 id="automation-schedule">Schedule</h3><p>Weekdays using the Personal agent.</p></div></header>
      <div class="oc-settings-group">
        ${settingsRow({
          title: "Automation enabled",
          description: "The next run is scheduled for 09:00 local time.",
          control:
            '<label class="oc-switch-label"><span class="sr-only">Automation enabled</span><input class="oc-switch" type="checkbox" role="switch" checked /></label>',
        })}
        ${settingsRow({
          title: "Run time",
          description: "Uses the application timezone.",
          control:
            '<div class="oc-field"><label class="sr-only" for="automation-time">Run time</label><input class="oc-input" id="automation-time" type="time" value="09:00" /></div>',
        })}
        ${settingsRow({
          title: "Destination",
          description: "Deliver the result after a successful run.",
          control:
            '<span class="oc-select-wrap"><select class="oc-select" aria-label="Destination"><option>Discord · #release</option><option>Slack · #shipping</option></select></span>',
        })}
      </div>
    </section>
    <section class="oc-detail-section" aria-labelledby="automation-history">
      <header><span class="oc-detail-section-icon">${agentIcon("history")}</span><div><h3 id="automation-history">Run history</h3><p>Recent executions and outcomes.</p></div><button class="oc-action oc-action-ghost" type="button">Run now</button></header>
      <ol class="oc-activity-list">
        ${activityItem({ icon: state === "error" ? "x" : "check", title: "Release digest", detail: state === "error" ? "Delivery rejected by destination" : "Completed in 1m 42s", time: "Today", tone: state === "error" ? "error" : "success" })}
        ${activityItem({ icon: "check", title: "Release digest", detail: "18 merged changes summarized", time: "Mon", tone: "success" })}
        ${activityItem({ icon: "check", title: "Release digest", detail: "12 merged changes summarized", time: "Fri", tone: "success" })}
      </ol>
    </section>
    <section class="oc-detail-section oc-detail-grid-span" aria-labelledby="automation-task">
      <header><span class="oc-detail-section-icon">${agentIcon("sparkles")}</span><div><h3 id="automation-task">Agent task</h3><p>The instruction sent at each scheduled run.</p></div></header>
      <textarea class="oc-textarea" rows="4" aria-label="Automation prompt">Review merged changes since the last release. Summarize user-facing improvements, active blockers, and the next recommended release action.</textarea>
    </section>
  </div>`;
}

export function operationsApplicationMarkup({
  view = "channels",
  state = "ready",
  navigation = "expanded",
} = {}) {
  const channels = view === "channels";
  return `<div class="oc-app-frame" data-navigation="${navigation}">
  ${applicationNavigation({ current: channels ? "Channels" : "Automation", navigation, viewHooks: true })}
  <main class="oc-app-main">
    <div class="oc-app-content">
      <header class="oc-page-header oc-page-header-compact">
        <div class="oc-page-header-content">
          <h1 class="oc-page-header-title">${channels ? "Channels" : "Automations"}</h1>
          <p class="oc-page-header-description">${channels ? `5 configured · ${state === "error" ? "3" : "4"} connected` : "3 recurring tasks · 2 enabled"}</p>
        </div>
        <div class="oc-page-header-actions">
          <button class="oc-action oc-action-primary" type="button">${agentIcon("plus")} ${channels ? "Add channel" : "New automation"}</button>
        </div>
      </header>
      <section class="oc-pane oc-master-detail" aria-label="${channels ? "Channel configuration" : "Automation configuration"}">
          <section class="oc-pane oc-master-pane" aria-label="${channels ? "Channels" : "Automations"}">
            <header class="oc-pane-header">
              <div class="oc-pane-heading">
                <h2 class="oc-pane-title">${channels ? "Transports" : "Automations"}</h2>
                <p class="oc-pane-description">${channels ? "5 configured" : "3 recurring tasks"}</p>
              </div>
              <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="Filter list">${agentIcon("list-filter")}</button>
            </header>
            <div class="oc-app-resource-search"><span>${agentIcon("search")}</span><input type="search" aria-label="${channels ? "Search channels" : "Search automations"}" placeholder="Filter" /></div>
            <div class="oc-pane-body oc-pane-body-flush">
              <div class="oc-app-resource-list">
                ${
                  channels
                    ? [
                        resourceListItem({
                          icon: "message-circle",
                          title: "Discord",
                          description: "Bot transport",
                          status: state === "error" ? "error" : "ready",
                          meta: "42 ms",
                          selected: true,
                        }),
                        resourceListItem({
                          icon: "send",
                          title: "Telegram",
                          description: "User + bot delivery",
                          status: "ready",
                          meta: "88 ms",
                        }),
                        resourceListItem({
                          icon: "hash",
                          title: "Slack",
                          description: "Workspace app",
                          status: "idle",
                          meta: "Paused",
                        }),
                        resourceListItem({
                          icon: "message-square",
                          title: "WebChat",
                          description: "Embedded client",
                          status: "ready",
                          meta: "18 ms",
                        }),
                        resourceListItem({
                          icon: "message-circle-more",
                          title: "WhatsApp",
                          description: "Business account",
                          status: "ready",
                          meta: "104 ms",
                        }),
                      ].join("")
                    : [
                        resourceListItem({
                          icon: "newspaper",
                          title: "Release digest",
                          description: "Weekdays at 09:00",
                          status: state === "error" ? "error" : "active",
                          meta: "Tomorrow",
                          selected: true,
                        }),
                        resourceListItem({
                          icon: "inbox",
                          title: "Issue triage",
                          description: "Every 2 hours",
                          status: "active",
                          meta: "48m",
                        }),
                        resourceListItem({
                          icon: "archive",
                          title: "Archive sync",
                          description: "Daily at 02:00",
                          status: "idle",
                          meta: "Paused",
                        }),
                      ].join("")
                }
              </div>
            </div>
          </section>
          <section class="oc-pane oc-detail-pane" aria-label="Selected item">
            <header class="oc-pane-header oc-pane-header-identity">
              <span class="oc-pane-identity-icon">${agentIcon(channels ? "message-circle" : "newspaper")}</span>
              <div class="oc-pane-heading">
                <div class="oc-pane-title-row"><h2 class="oc-pane-title">${channels ? "Discord" : "Release digest"}</h2>${statusMarkup(state === "error" ? "error" : channels ? "ready" : "active", { ready: "Connected", active: "Enabled", error: "Needs attention" })}</div>
                <p class="oc-pane-description">${channels ? "OpenClaw bot · 4 routed spaces" : "Personal agent · Discord #release"}</p>
              </div>
              <div class="oc-pane-actions">
                <button class="oc-action oc-action-ghost" type="button">${agentIcon(channels ? "refresh-cw" : "play")} ${channels ? "Check" : "Run now"}</button>
                <button class="oc-action oc-action-primary" type="button">Save changes</button>
                <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="More actions">${agentIcon("ellipsis")}</button>
              </div>
            </header>
            ${channels ? channelDetail(state) : automationDetail(state)}
          </section>
      </section>
    </div>
  </main>
</div>`;
}

function sessionListItem({ title, detail, time, selected = false, active = false } = {}) {
  return `<button class="oc-session-list-item" type="button" aria-pressed="${selected}">
  <span class="oc-session-list-avatar">${agentIcon(active ? "sparkles" : "message-square")}</span>
  <span class="oc-session-list-copy"><strong>${title}</strong><small>${detail}</small></span>
  <time>${time}</time>
</button>`;
}

function workspaceSessions(status) {
  return `<aside class="oc-workspace-sessions" aria-label="Sessions">
  <header class="oc-pane-header">
    <div class="oc-pane-heading"><h2 class="oc-pane-title">Sessions</h2><p class="oc-pane-description">4 open</p></div>
    <button class="oc-action oc-action-icon oc-action-primary" type="button" aria-label="New session">${agentIcon("plus")}</button>
  </header>
  <div class="oc-app-resource-search"><span>${agentIcon("search")}</span><input type="search" aria-label="Search sessions" placeholder="Search sessions" /></div>
  <div class="oc-session-list">
    ${sessionListItem({ title: "Carapace parity", detail: "Design system", time: "now", selected: true, active: status === "active" })}
    ${sessionListItem({ title: "Release validation", detail: "openclaw/openclaw", time: "8m" })}
    ${sessionListItem({ title: "CI queue health", detail: "maintainers", time: "34m" })}
    ${sessionListItem({ title: "Docs navigation", detail: "openclaw/docs", time: "2h" })}
  </div>
  <footer class="oc-workspace-sessions-footer">
    <span>${agentIcon("history")} Recent</span>
    <span>${agentIcon("archive")} Archived</span>
  </footer>
</aside>`;
}

function workspaceConversation(
  status,
  {
    dock = "right",
    inspector = true,
    model = "openai/gpt-5.5",
    picker = false,
    thinking = "high",
    fast = true,
    voice = "idle",
    camera = false,
    modelProvider = "recent",
    modelQuery = "",
    draft = "",
  } = {},
) {
  const inspectorVisible = inspector && dock !== "hidden";
  const dockAction = !inspectorVisible
    ? "Show inspector"
    : dock === "bottom"
      ? "Dock inspector right"
      : "Dock inspector below";
  return `<section class="oc-workspace-conversation" aria-label="Agent workspace">
  <header class="oc-pane-header oc-workspace-conversation-header">
    <div class="oc-pane-heading">
      <div class="oc-pane-title-row"><h2 class="oc-pane-title">Carapace app parity</h2>${statusMarkup(status)}</div>
      <p class="oc-pane-description"><span class="oc-workspace-branch">${agentIcon("git-branch")} feat/app-surface-parity</span><span>Carapace</span></p>
    </div>
    <div class="oc-pane-actions">
      <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="Open terminal">${agentIcon("terminal")}</button>
      <button class="oc-action oc-action-icon oc-action-ghost oc-workspace-inspector-action" type="button" aria-label="${dockAction}" data-workbench-application-dock>${agentIcon("panels-top-left")}</button>
      <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="More actions">${agentIcon("ellipsis")}</button>
    </div>
  </header>
  <div class="oc-pane-body oc-workspace-transcript">
    <article class="oc-workspace-message oc-workspace-message-user">
      <p>Make the application surface quieter, tighter, and closer to the actual OpenClaw apps.</p>
    </article>
    <article class="oc-workspace-message oc-workspace-message-agent">
      <header><span class="oc-workspace-agent-mark"><img src="${openClawMarkUrl}" alt="" /></span><strong>OpenClaw</strong><time>now</time></header>
      <p>I removed duplicate shell chrome, reduced spacing, and brought the actual model and reasoning controls into the composer.</p>
      <div class="oc-workspace-progress">
        <div class="oc-workspace-progress-header"><span>Parity pass</span><strong>3 / 4</strong></div>
        <ol>
          <li data-state="complete">${agentIcon("check")}<span>Remove redundant app chrome</span></li>
          <li data-state="complete">${agentIcon("check")}<span>Compact rows and pane headers</span></li>
          <li data-state="complete">${agentIcon("check")}<span>Integrate model controls</span></li>
          <li data-state="active">${agentIcon("loader-circle")}<span>Add real application screens</span></li>
        </ol>
      </div>
      <details class="oc-workspace-tool" open>
        <summary><span>${agentIcon("terminal")} Edited application anatomy</span><small>6 files</small>${agentIcon("chevron")}</summary>
        <div><code>styles/candidate/application.css</code><span>compact parity</span></div>
      </details>
    </article>
  </div>
  <footer class="oc-workspace-composer">
    <div class="oc-workspace-compose-box">
      ${applicationCameraPreviewMarkup({ camera })}
      <div class="oc-composer-dictation-status" data-workbench-composer-dictation-status hidden aria-live="polite">${applicationVoiceActivityMarkup("listening")}<span>Listening… release to stop</span></div>
      <label class="sr-only" for="workspace-message">Message</label>
      <textarea id="workspace-message" rows="1" placeholder="Message OpenClaw" data-workbench-composer-input>${escapeAttribute(draft)}</textarea>
      <div class="oc-workspace-compose-toolbar">
        <div>
          <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="Attach file">${agentIcon("paperclip")}</button>
          ${applicationTalkToggleMarkup({ voice })}
          ${applicationModelControlsMarkup({
            model,
            thinking,
            fast,
            open: picker,
            modelProvider,
            modelQuery,
          })}
        </div>
        <div class="oc-workspace-compose-actions">
          <span class="oc-context-usage" aria-label="Context usage"><span style="--oc-context-used: 41%"></span><small>41%</small></span>
          ${applicationComposerPrimaryMarkup({ busy: status === "active", voice, camera })}
        </div>
      </div>
    </div>
  </footer>
</section>`;
}

function workspaceInspector(status) {
  return `<aside class="oc-workspace-inspector" aria-label="Inspector">
  <header class="oc-pane-header">
    <div class="oc-pane-heading"><h2 class="oc-pane-title">Inspector</h2><p class="oc-pane-description">Live session context</p></div>
    <button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="Hide inspector" data-workbench-application-inspector-hide>${agentIcon("panel-right-close")}</button>
  </header>
  <div class="oc-inspector-scroll">
    <section class="oc-inspector-section">
      <header><h3>Run</h3>${statusMarkup(status)}</header>
      <dl class="oc-inspector-facts">
        <div><dt>Mode</dt><dd>Agent</dd></div>
        <div><dt>Model</dt><dd>GPT-5.5</dd></div>
        <div><dt>Reasoning</dt><dd>High</dd></div>
        <div><dt>Started</dt><dd>18m ago</dd></div>
      </dl>
    </section>
    <section class="oc-inspector-section">
      <header><h3>Context</h3><span>41%</span></header>
      <div class="oc-inspector-meter" role="meter" aria-label="Context used" aria-valuenow="41" aria-valuemin="0" aria-valuemax="100"><span style="width: 41%"></span></div>
      <p>82k of 200k tokens prepared</p>
    </section>
    <section class="oc-inspector-section">
      <header><h3>Activity</h3><button type="button">View all</button></header>
      <ol class="oc-inspector-activity">
        <li data-state="complete"><span>${agentIcon("file-text")}</span><div><strong>Read instructions</strong><small>AGENTS.md</small></div></li>
        <li data-state="complete"><span>${agentIcon("search")}</span><div><strong>Mapped surfaces</strong><small>Control UI + macOS</small></div></li>
        <li data-state="active"><span>${agentIcon("terminal")}</span><div><strong>Running preview</strong><small>Local development server</small></div></li>
      </ol>
    </section>
    <section class="oc-inspector-section">
      <header><h3>Changed files</h3><span>5</span></header>
      <ul class="oc-inspector-files">
        <li><span>application.css</span><small class="oc-diff-added">+284</small></li>
        <li><span>application-screens.js</span><small class="oc-diff-added">+196</small></li>
        <li><span>lab.css</span><small class="oc-diff-added">+88</small></li>
      </ul>
    </section>
  </div>
</aside>`;
}

export function workspaceApplicationMarkup({
  dock = "right",
  inspector = true,
  status = "active",
  model = "openai/gpt-5.5",
  picker = false,
  thinking = "high",
  fast = true,
  voice = "idle",
  camera = false,
  modelProvider = "recent",
  modelQuery = "",
  draft = "",
} = {}) {
  const showInspector = inspector && dock !== "hidden";
  return `<div class="oc-chat-shell" data-dock="${dock}" data-inspector="${showInspector}">
  <div class="oc-workspace-grid">
    ${workspaceSessions(status)}
    ${workspaceConversation(status, {
      dock,
      inspector,
      model,
      picker,
      thinking,
      fast,
      voice,
      camera,
      modelProvider,
      modelQuery,
      draft,
    })}
    ${showInspector ? workspaceInspector(status) : ""}
  </div>
</div>`;
}

function sessionsTableRow({
  title,
  agent,
  model,
  updated,
  status,
  selected = false,
} = {}) {
  return `<tr${selected ? ' aria-selected="true"' : ""}>
  <td><input class="oc-checkbox" type="checkbox" aria-label="Select ${title}"${selected ? " checked" : ""} /></td>
  <td><div class="oc-session-cell"><strong>${title}</strong><small>${agent}</small></div></td>
  <td>${model}</td>
  <td>${statusMarkup(status, { active: "Running", idle: "Idle", error: "Failed" })}</td>
  <td><time>${updated}</time></td>
  <td><button class="oc-action oc-action-icon oc-action-ghost" type="button" aria-label="Actions for ${title}">${agentIcon("ellipsis")}</button></td>
</tr>`;
}

export function sessionsApplicationMarkup({
  state = "ready",
  navigation = "expanded",
} = {}) {
  const empty = state === "empty";
  const loading = state === "loading";
  const failed = state === "error";
  return `<div class="oc-app-frame" data-navigation="${navigation}">
  ${applicationNavigation({ current: "Sessions", navigation })}
  <main class="oc-app-main">
    <div class="oc-app-content oc-session-content">
      <header class="oc-page-header oc-page-header-compact">
        <div class="oc-page-header-content">
          <h1 class="oc-page-header-title">Sessions</h1>
          <p class="oc-page-header-description">${empty ? "No matching sessions" : failed ? "Session data unavailable" : "24 sessions · 3 running"}</p>
        </div>
        <div class="oc-page-header-actions">
          <button class="oc-action oc-action-primary" type="button">${agentIcon("plus")} New session</button>
        </div>
      </header>
      <div class="oc-session-toolbar">
        <label class="oc-search-field"><span class="sr-only">Search sessions</span>${agentIcon("search")}<input type="search" placeholder="Search sessions" /></label>
        <div class="oc-segmented" role="group" aria-label="Session scope">
          <button class="oc-segmented-item" type="button" aria-pressed="true">All</button>
          <button class="oc-segmented-item" type="button" aria-pressed="false">Running</button>
          <button class="oc-segmented-item" type="button" aria-pressed="false">Unread</button>
        </div>
        <button class="oc-action oc-action-ghost" type="button">${agentIcon("list-filter")} Filters</button>
      </div>
      ${
        failed
          ? `<div class="oc-pane-state" role="alert"><div class="oc-empty"><span class="oc-empty-icon">${agentIcon("triangle-alert")}</span><h2 class="oc-empty-title">Could not load sessions</h2><p class="oc-empty-description">The gateway did not return the session collection.</p><button class="oc-action oc-action-secondary" type="button">${agentIcon("refresh-cw")} Retry</button></div></div>`
          : empty
          ? `<div class="oc-pane-state"><div class="oc-empty"><span class="oc-empty-icon">${agentIcon("messages-square")}</span><h2 class="oc-empty-title">No sessions found</h2><p class="oc-empty-description">Try another filter or start a new session.</p></div></div>`
          : `<div class="oc-table-wrap oc-session-table-wrap"${loading ? ' aria-busy="true"' : ""}>
        <table class="oc-table oc-session-table">
          <thead><tr><th scope="col"><span class="sr-only">Select</span></th><th scope="col">Session</th><th scope="col">Model</th><th scope="col">State</th><th scope="col">Updated</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead>
          <tbody>
            ${
              loading
                ? `<tr><td colspan="6"><span class="oc-loader" role="status"><span class="oc-loader-spinner" aria-hidden="true"></span>Loading sessions</span></td></tr>`
                : [
                    sessionsTableRow({
                      title: "Carapace parity",
                      agent: "Personal · openclaw/carapace",
                      model: "GPT-5.5",
                      updated: "now",
                      status: "active",
                      selected: true,
                    }),
                    sessionsTableRow({
                      title: "Release validation",
                      agent: "Release · openclaw/openclaw",
                      model: "Claude Opus",
                      updated: "8m",
                      status: "idle",
                    }),
                    sessionsTableRow({
                      title: "CI queue health",
                      agent: "Operations · maintainers",
                      model: "Claude Opus 4.8",
                      updated: "34m",
                      status: "idle",
                    }),
                    sessionsTableRow({
                      title: "Provider auth repro",
                      agent: "Debug · openclaw/openclaw",
                      model: "GPT-5.5",
                      updated: "2h",
                      status: "error",
                    }),
                  ].join("")
            }
          </tbody>
        </table>
      </div>`
      }
    </div>
  </main>
</div>`;
}

export function quickChatApplicationMarkup({
  status = "idle",
  model = "openai/gpt-5.5",
  picker = false,
  thinking = "high",
  fast = true,
  modelProvider = "recent",
  modelQuery = "",
  draft = "",
} = {}) {
  const running = status === "active";
  const failed = status === "error";
  const hasDraft = Boolean(draft.trim());
  const reply = running
    ? "Reviewing the captured page and current workspace…"
    : "Quick Chat could not reach the gateway. Check the connection and try again.";
  const primaryAction = failed
    ? `<button class="oc-quick-chat-send is-error" type="button" aria-label="Retry connection">${agentIcon("refresh-cw")}</button>`
    : running
      ? `<button class="oc-quick-chat-send" type="button" aria-label="Stop response">${agentIcon("square")}</button>`
      : `<button class="oc-quick-chat-send" type="submit" aria-label="Send message" data-workbench-composer-send${hasDraft ? "" : " hidden"}>${agentIcon("arrow-up-circle")}</button>`;
  const dictationAction = running || failed
    ? `<button class="oc-quick-chat-action" type="button" aria-label="Dictate">${agentIcon("mic")}</button>`
    : `<button class="oc-quick-chat-action" type="button" aria-label="Hold to dictate" aria-pressed="false" data-workbench-composer-dictation${hasDraft ? " hidden" : ""}>${agentIcon("mic")}</button>`;
  return `<div class="oc-quick-chat-stage">
  <section class="oc-quick-chat" data-state="${status}" aria-label="Quick Chat">
    <form class="oc-quick-chat-input-row" data-workbench-quick-chat-form>
      <button class="oc-quick-chat-agent" type="button" aria-label="Select agent"><img src="${openClawMarkUrl}" alt="" /></button>
      ${applicationModelControlsMarkup({
        model,
        thinking,
        fast,
        open: picker,
        modelProvider,
        modelQuery,
      })}
      <label class="sr-only" for="quick-chat-message">Message</label>
      <textarea id="quick-chat-message" rows="1" placeholder="Message OpenClaw" data-workbench-composer-input>${escapeAttribute(draft)}</textarea>
      <button class="oc-quick-chat-action" type="button" aria-label="Continue a recent conversation" data-compact-hide>${agentIcon("history")}</button>
      ${dictationAction}
      <button class="oc-quick-chat-action is-optional" type="button" aria-label="Attach text from current app">${agentIcon("file-text")}</button>
      <button class="oc-quick-chat-action is-optional" type="button" aria-label="Capture screenshot">${agentIcon("camera")}</button>
      ${primaryAction}
    </form>
    <div class="oc-quick-chat-context">
      <span>${agentIcon("file-text")} Safari — OpenClaw docs (842 chars)</span>
      <button type="button" aria-label="Clear captured context">${agentIcon("x")}</button>
    </div>
    ${
      running || failed
        ? `<div class="oc-quick-chat-reply">
      <span class="oc-quick-chat-agent"><img src="${openClawMarkUrl}" alt="" /></span>
      <p>${reply}</p>
    </div>`
        : ""
    }
  </section>
</div>`;
}

export const applicationScreenMarkup = {
  settings: settingsApplicationMarkup(),
  operations: operationsApplicationMarkup(),
  workspace: workspaceApplicationMarkup(),
  sessions: sessionsApplicationMarkup(),
  "quick-chat": quickChatApplicationMarkup(),
};
