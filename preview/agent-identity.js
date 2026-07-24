import { avatarFixtureUrl } from "./avatar-fixtures.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const collaborationParticipants = [
  { name: "Shelly", role: "Leader", message: "Pulling the specialist findings into one clear answer." },
  {
    name: "Barnacle",
    role: "Research",
    message: "The compact transcript pattern matches the strongest application surfaces.",
  },
  {
    name: "Scampi",
    role: "Interface",
    message: "Avatar, author, role, and message now read as one conversational unit.",
  },
  {
    name: "Krill",
    role: "Systems",
    message: "Motion stays isolated to four transform-only avatar layers.",
  },
];

const avatarIntrinsicSizes = {
  xs: 20,
  sm: 24,
  lg: 32,
};

export function agentAvatarMarkup(
  name,
  { size = "xs", activity = "", labelled = false, animated = false } = {},
) {
  const safeName = escapeHtml(name);
  const intrinsicSize = avatarIntrinsicSizes[size] ?? 40;
  const activityAttribute = activity ? ` data-state="${escapeHtml(activity)}"` : "";
  /* Thinking is a motion state: the identity itself boils, not just the ring. */
  const boiling = animated || activity === "thinking";
  const accessibleName = labelled ? ` role="img" aria-label="${safeName}"` : "";
  return `<span class="oc-avatar oc-avatar-${size} oc-avatar-pixel"${activityAttribute}${accessibleName}><img class="oc-avatar-image" src="${avatarFixtureUrl(name, { animated: boiling })}" alt="" width="${intrinsicSize}" height="${intrinsicSize}" /></span>`;
}

export function agentAvatarStackMarkup(
  participants = collaborationParticipants,
  { state = "", labelled = true } = {},
) {
  const names = participants.map(({ name }) => name);
  const stateAttribute = state ? ` data-state="${escapeHtml(state)}"` : "";
  const accessibleName = labelled
    ? ` role="img" aria-label="${escapeHtml(names.join(", "))}"`
    : ' aria-hidden="true"';
  const avatars = participants
    .map(({ name }) => agentAvatarMarkup(name, { size: "xs", animated: state === "thinking" }))
    .join("");
  return `<span class="oc-avatar-stack oc-agent-collaboration-facepile"${stateAttribute}${accessibleName}>${avatars}</span>`;
}

export function attributedMessageMarkup({
  author = "agent",
  name,
  role = "",
  message = "",
  content = "",
  activity = "",
  listItem = false,
  avatar = "",
} = {}) {
  const roleMarkup = role
    ? `<span class="oc-agent-message-role">${escapeHtml(role)}</span>`
    : "";
  const body =
    content ||
    `<div class="oc-agent-message-bubble"><p>${escapeHtml(message)}</p></div>`;
  const roleAttribute = listItem ? ' role="listitem"' : "";
  const avatarMarkup = avatar || agentAvatarMarkup(name, { activity });
  const contentMarkup = `<div class="oc-agent-message-content">
    <header class="oc-agent-message-author"><strong>${escapeHtml(name)}</strong>${roleMarkup}</header>
    ${body}
  </div>`;
  /* User turns mirror the layout: content first, avatar trailing on the right. */
  const inner =
    author === "user"
      ? `${contentMarkup}
  ${avatarMarkup}`
      : `${avatarMarkup}
  ${contentMarkup}`;
  return `<article class="oc-agent-attributed-message" data-author="${escapeHtml(author)}"${roleAttribute}>
  ${inner}
</article>`;
}

export function collaborationTranscriptMarkup({
  state = "thinking",
  elapsed = "5s",
  summary,
} = {}) {
  const active = state === "thinking";
  const failed = state === "error";
  const visibleParticipants = collaborationParticipants.slice(0, 2);
  const messages = visibleParticipants
    .map((participant, index) =>
      attributedMessageMarkup({
        ...participant,
        listItem: true,
      }),
    )
    .join("");
  const status = failed ? "Agents paused" : active ? "Agents thinking" : "Agents ready";
  const resolvedSummary =
    summary ||
    (failed
      ? "Collaboration stopped before the specialists could finish"
      : "Collaborating with the team on application parity");
  const stream = failed
    ? `<div class="oc-agent-error-message" role="alert"><strong>Collaboration stopped</strong><p>Retry the request or choose another model.</p></div>`
    : `<div class="oc-agent-collaboration-stream" role="list">${messages}</div>`;

  return `<section class="oc-agent-collaboration" data-variant="transcript" data-state="${escapeHtml(state)}" aria-label="Multi-agent collaboration">
  <header class="oc-agent-collaboration-presence" role="status">
    ${agentAvatarStackMarkup(collaborationParticipants, { state: active ? "thinking" : "" })}
    <strong>${status}</strong>
    <span aria-hidden="true">·</span>
    <time aria-hidden="true" data-collab-elapsed>${escapeHtml(elapsed)}</time>
  </header>
  <p class="oc-agent-collaboration-summary">${escapeHtml(resolvedSummary)}</p>
  ${stream}
</section>`;
}
