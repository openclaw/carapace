const avatarPalettes = [
  ["#1b1b20", "#ff5c46", "#ffd166", "#8be28b"],
  ["#15161a", "#6d7cff", "#ff7ac6", "#a8f0e0"],
  ["#1a1715", "#ff8f3d", "#f9dc5c", "#5ed0c7"],
  ["#17151d", "#a978ff", "#ff6b8a", "#7ee787"],
];

function hashAvatarSeed(seed) {
  let hash = 2166136261;
  for (const character of seed) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }
  return hash >>> 0;
}

function avatarPreviewUrl(seed) {
  const hash = hashAvatarSeed(seed);
  const palette = avatarPalettes[hash % avatarPalettes.length];
  const pixels = [];

  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const bit = (hash >>> ((row * 3 + column) % 24)) & 1;
      if (!bit && row !== 2) continue;
      const color = palette[1 + ((hash >>> ((row + column) % 16)) % 3)];
      for (const mirroredColumn of new Set([column, 4 - column])) {
        pixels.push(
          `<rect x="${mirroredColumn * 8}" y="${row * 8}" width="8" height="8" fill="${color}"/>`,
        );
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" shape-rendering="crispEdges"><rect width="40" height="40" fill="${palette[0]}"/>${pixels.join("")}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function avatarExample(id, label, purpose, markup) {
  return {
    id,
    label,
    purpose,
    markup,
    previewMarkup: markup.replaceAll('src="avatar.jpg"', `src="${avatarPreviewUrl(label)}"`),
  };
}

function componentExample(id, label, purpose, markup) {
  return { id, label, purpose, markup };
}

export const avatarWorkbenchExamples = [
  avatarExample(
    "small",
    "Small",
    "Compact fallback identity for dense rows and metadata.",
    `<span class="oc-avatar oc-avatar-sm" role="img" aria-label="OpenClaw">
  <span class="oc-avatar-fallback" aria-hidden="true">OC</span>
</span>`,
  ),
  avatarExample(
    "default",
    "Default",
    "Image-backed identity at the standard interface size.",
    `<span class="oc-avatar oc-avatar-pixel">
  <img
    class="oc-avatar-image"
    src="avatar.jpg"
    alt="OpenClaw mascot"
    width="40"
    height="40"
  />
</span>`,
  ),
  avatarExample(
    "large",
    "Large",
    "Prominent fallback identity for profiles and focused surfaces.",
    `<span class="oc-avatar oc-avatar-lg" role="img" aria-label="Vyctor Brzezowski">
  <span class="oc-avatar-fallback" aria-hidden="true">VB</span>
</span>`,
  ),
  avatarExample(
    "presence",
    "Presence",
    "Status-enhanced identity paired with an explicit text state.",
    `<span class="primitive-avatar-presence">
  <span class="oc-avatar oc-avatar-pixel">
    <img
      class="oc-avatar-image"
      src="avatar.jpg"
      alt=""
      width="40"
      height="40"
    />
    <span class="oc-avatar-status" aria-hidden="true"></span>
  </span>
  <span>OpenClaw · Online</span>
</span>`,
  ),
];

export const buttonWorkbenchExamples = [
  componentExample(
    "primary",
    "Primary",
    "The single highest-priority action in a local decision group.",
    `<button class="oc-button oc-button-primary" type="button">
  Save changes
</button>`,
  ),
  componentExample(
    "secondary",
    "Secondary",
    "A supporting action that remains visible without competing with the primary action.",
    `<button class="oc-button oc-button-secondary" type="button">
  Preview
</button>`,
  ),
  componentExample(
    "ghost",
    "Ghost",
    "A low-emphasis action for dismissal or optional adjacent behavior.",
    `<button class="oc-button oc-button-ghost" type="button">
  Cancel
</button>`,
  ),
  componentExample(
    "disabled",
    "Disabled",
    "An unavailable action whose reason is visible or immediately inferable.",
    `<button class="oc-button oc-button-secondary" type="button" disabled>
  Unavailable
</button>`,
  ),
];

const componentWorkbenchReferences = {
  "primitive-avatar": {
    examples: avatarWorkbenchExamples,
    usage: [
      {
        title: "When to use",
        items: [
          "Represent a person or agent where identity must remain recognizable at a glance.",
          "Use Provider Logo instead for integration marks and brand lockups.",
        ],
      },
      {
        title: "Choose a variant",
        examples: avatarWorkbenchExamples,
      },
      {
        title: "Accessibility",
        items: [
          "Give fallback-only avatars an image role and an accessible name; hide their initials from assistive technology.",
          "Use an empty image alt when adjacent text already names the same person or agent.",
          "Pair a visual status indicator with visible text or an equivalent accessible state.",
        ],
      },
    ],
  },
  "primitive-button": {
    examples: buttonWorkbenchExamples,
    usage: [
      {
        title: "When to use",
        items: [
          "Use Button for in-place actions; use Link when activating the control changes location.",
          "Keep one primary action in each local decision group.",
        ],
      },
      {
        title: "Choose a variant",
        examples: buttonWorkbenchExamples,
      },
      {
        title: "Accessibility",
        items: [
          "Use the native button element and set its type explicitly inside forms.",
          "Name icon-only buttons with an accessible label.",
          "Disable an action only when its unavailable state and recovery path are clear.",
        ],
      },
    ],
  },
};

export function createFallbackComponentWorkbenchReference(title, items) {
  const normalizedItems = items.map((item) => item.trim()).filter(Boolean);
  if (!normalizedItems.length) return undefined;

  return {
    usage: [
      {
        title: title.trim() || "Guidance",
        items: normalizedItems,
      },
    ],
  };
}

export function getComponentWorkbenchReference(pageId) {
  return componentWorkbenchReferences[pageId];
}

export function formatComponentWorkbenchCode(examples) {
  return examples
    .map(({ label, markup }) => `<!-- ${label} -->\n${markup}`)
    .join("\n\n");
}

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const rawTextElements = new Set(["code", "pre", "script", "style", "textarea"]);

function tagName(token) {
  return token.match(/^<\/?\s*([\w:-]+)/)?.[1]?.toLowerCase();
}

function isClosingTag(token) {
  return /^<\//.test(token);
}

function isSelfContainedTag(token) {
  const name = tagName(token);
  return /\/>$/.test(token) || (name ? voidElements.has(name) : false);
}

function formatOpeningTag(token, indent) {
  if (token.length + indent.length <= 100 || !/\s/.test(token.slice(1, -1))) {
    return [indent + token];
  }

  const match = token.match(/^<([\w:-]+)([\s\S]*?)(\/?)>$/);
  if (!match) return [indent + token];

  const [, name, attributesSource, selfClosing] = match;
  const attributes = attributesSource.match(/[\w:@.-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g);
  if (!attributes?.length) return [indent + token];

  return [
    `${indent}<${name}`,
    ...attributes.map((attribute) => `${indent}  ${attribute.trim()}`),
    `${indent}${selfClosing ? "/>" : ">"}`,
  ];
}

function tokenizeMarkup(source) {
  const tokens = [];
  let cursor = 0;

  while (cursor < source.length) {
    if (source.startsWith("<!--", cursor)) {
      const end = source.indexOf("-->", cursor + 4);
      const tokenEnd = end === -1 ? source.length : end + 3;
      tokens.push(source.slice(cursor, tokenEnd));
      cursor = tokenEnd;
      continue;
    }

    if (source[cursor] !== "<") {
      const end = source.indexOf("<", cursor);
      const tokenEnd = end === -1 ? source.length : end;
      tokens.push(source.slice(cursor, tokenEnd));
      cursor = tokenEnd;
      continue;
    }

    let quote = null;
    let end = cursor + 1;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (quote) {
        if (character === quote) quote = null;
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === ">") {
        end += 1;
        break;
      }
    }

    const token = source.slice(cursor, end);
    tokens.push(token);
    cursor = end;

    const name = tagName(token);
    if (!name || isClosingTag(token) || isSelfContainedTag(token) || !rawTextElements.has(name)) {
      continue;
    }

    const closingStart = source.toLowerCase().indexOf(`</${name}`, cursor);
    if (closingStart === -1) {
      if (cursor < source.length) tokens.push(source.slice(cursor));
      break;
    }
    if (closingStart > cursor) tokens.push(source.slice(cursor, closingStart));
    cursor = closingStart;
  }

  return tokens.filter((token) => token.trim());
}

export function formatWorkbenchMarkup(source) {
  const tokens = tokenizeMarkup(source.trim());
  const lines = [];
  let depth = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const indent = "  ".repeat(Math.max(0, depth));

    if (token.startsWith("<!--")) {
      lines.push(indent + token.trim());
      continue;
    }

    if (!token.startsWith("<")) {
      const parentName = tagName(tokens[index - 1] ?? "");
      const text = rawTextElements.has(parentName ?? "")
        ? token.trim()
        : token.replace(/\s+/g, " ").trim();
      if (text) lines.push(indent + text);
      continue;
    }

    if (isClosingTag(token)) {
      depth = Math.max(0, depth - 1);
      lines.push(`${"  ".repeat(depth)}${token.trim()}`);
      continue;
    }

    const name = tagName(token);
    const text = tokens[index + 1]?.replace(/\s+/g, " ").trim();
    const closing = tokens[index + 2];
    const isReadableLeaf =
      name &&
      !rawTextElements.has(name) &&
      text &&
      closing &&
      isClosingTag(closing) &&
      tagName(closing) === name &&
      `${token}${text}${closing}`.length + indent.length <= 100;

    if (isReadableLeaf) {
      lines.push(`${indent}${token.trim()}${text}${closing.trim()}`);
      index += 2;
      continue;
    }

    lines.push(...formatOpeningTag(token.trim(), indent));
    if (!isSelfContainedTag(token)) depth += 1;
  }

  return lines.join("\n");
}
