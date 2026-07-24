const avatarPalettes = [
  ["#1b1b20", "#ff5c46", "#ffd166", "#8be28b"],
  ["#15161a", "#6d7cff", "#ff7ac6", "#a8f0e0"],
  ["#1a1715", "#ff8f3d", "#f9dc5c", "#5ed0c7"],
  ["#17151d", "#a978ff", "#ff6b8a", "#7ee787"],
  ["#15191c", "#54d2d2", "#ffcb77", "#ff6b6b"],
  ["#1b1622", "#f15bb5", "#fee440", "#00bbf9"],
  ["#171b16", "#9be564", "#f5a65b", "#5b8e7d"],
  ["#1b1717", "#ef476f", "#ffd166", "#06d6a0"],
];

export const avatarFixturePeople = [
  { name: "Shelly", role: "Product" },
  { name: "Barnacle", role: "Research" },
  { name: "Scampi", role: "Interface" },
  { name: "Krill", role: "Systems" },
  { name: "Pincer", role: "Planning" },
  { name: "Scuttle", role: "Build" },
  { name: "Mantis", role: "Review" },
  { name: "Krabby", role: "Discovery" },
];

function hashAvatarSeed(seed) {
  let hash = 2166136261;
  for (const character of seed) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }
  return hash >>> 0;
}

function hexToHue(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return Math.round(((h * 60) + 360) % 360);
}

export const avatarStyles = ["mosaic", "quad", "rings"];

export function avatarFixtureUrl(seed, { color, style, animated = false } = {}) {
  // Deterministic identity art: any stable string works as the seed — a
  // name, an email hash, or a hex color via the color option. Each seed
  // owns one analogous hue family and a dense pattern, so identities read
  // as distinct colorful discs rather than sparse cells.
  const hash = hashAvatarSeed(String(seed));
  // Known fixture people get evenly spaced hues so the demo cast is
  // maximally distinct; arbitrary seeds hash across the full wheel.
  const personIndex = avatarFixturePeople.findIndex((person) => person.name === seed);
  const hue = color
    ? hexToHue(color)
    : personIndex >= 0
      ? (personIndex * 137 + 8) % 360
      : hash % 360;
  const selectedStyle = avatarStyles.includes(style)
    ? style
    : avatarStyles[(hash >>> 4) % avatarStyles.length];
  // Analogous palette keeps each avatar cohesive; the accent stays in the
  // same family so two agents never share a look but neither looks noisy.
  const c = [
    `hsl(${hue} 82% 64%)`,
    `hsl(${(hue + 26) % 360} 78% 52%)`,
    `hsl(${(hue + 334) % 360} 72% 44%)`,
    `hsl(${hue} 55% 30%)`,
  ];
  const bg = `hsl(${hue} 42% 15%)`;
  let bits = hash || 1;
  const next = () => {
    bits ^= bits << 13;
    bits ^= bits >>> 17;
    bits ^= bits << 5;
    bits >>>= 0;
    return bits;
  };
  const cells = [];
  const put = (x, y, fill) => cells.push({ x, y, fill });
  const pick = () => {
    const roll = next() % 100;
    if (roll < 42) return c[0];
    if (roll < 68) return c[1];
    if (roll < 86) return c[2];
    return c[3];
  };
  if (selectedStyle === "rings") {
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const ring = Math.max(Math.abs(x - 3.5), Math.abs(y - 3.5)) | 0;
        const ringColor = [c[0], c[1], c[2], c[3]][(ring + (hash % 4)) % 4];
        // per-cell jitter keeps rings lively without breaking the shape
        put(x, y, next() % 100 < 82 ? ringColor : pick());
      }
    }
  } else if (selectedStyle === "quad") {
    for (let y = 0; y < 4; y += 1) {
      for (let x = 0; x < 4; x += 1) {
        const fill = pick();
        put(x, y, fill);
        put(7 - x, y, fill);
        put(x, 7 - y, fill);
        put(7 - x, 7 - y, fill);
      }
    }
  } else {
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 4; x += 1) {
        const fill = pick();
        put(x, y, fill);
        put(7 - x, y, fill);
      }
    }
  }
  // Boiling identity: every cell churns through neighboring tones with
  // stepped (discrete) switches, so the whole disc reads as live static —
  // no easing, no sliding, and the circle never changes size. Negative
  // begins start each cell mid-cycle so the boil is instant. Deterministic
  // per seed; serve the static URL under prefers-reduced-motion.
  const rects = cells
    .map(({ x, y, fill }) => {
      if (!animated) {
        return `<rect x="${x * 5}" y="${y * 5}" width="5" height="5" fill="${fill}"/>`;
      }
      const alt1 = c[next() % 4];
      const alt2 = c[next() % 4];
      const dur = (0.7 + (next() % 11) / 10).toFixed(1);
      const begin = (-((next() % 20) / 10)).toFixed(1);
      return `<rect x="${x * 5}" y="${y * 5}" width="5" height="5" fill="${fill}"><animate attributeName="fill" values="${fill};${alt1};${fill};${alt2}" dur="${dur}s" begin="${begin}s" calcMode="discrete" repeatCount="indefinite"/></rect>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" shape-rendering="crispEdges"><rect width="40" height="40" fill="${bg}"/>${rects}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}




// Default identity: a pixel claw for agents and surfaces without their own
// avatar. Deterministic, matching the generated-people art style.
export function clawAvatarUrl() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" shape-rendering="crispEdges"><rect width="40" height="40" fill="#17151d"/><rect x="4" y="4" width="32" height="32" rx="6" fill="#f5654a" opacity=".14"/><rect x="12" y="6" width="2" height="6" fill="#f5654a"/><rect x="26" y="6" width="2" height="6" fill="#f5654a"/><rect x="10" y="4" width="3" height="3" fill="#ffd166"/><rect x="27" y="4" width="3" height="3" fill="#ffd166"/><rect x="10" y="14" width="20" height="14" fill="#f5654a"/><rect x="8" y="16" width="2" height="8" fill="#e05540"/><rect x="30" y="16" width="2" height="8" fill="#e05540"/><rect x="14" y="18" width="4" height="4" fill="#19191d"/><rect x="22" y="18" width="4" height="4" fill="#19191d"/><rect x="15" y="19" width="1" height="1" fill="#fff"/><rect x="23" y="19" width="1" height="1" fill="#fff"/><rect x="17" y="24" width="6" height="2" fill="#b23a28"/><rect x="4" y="24" width="6" height="8" fill="#f5654a"/><rect x="30" y="24" width="6" height="8" fill="#f5654a"/><rect x="3" y="22" width="4" height="4" fill="#f5654a"/><rect x="33" y="22" width="4" height="4" fill="#f5654a"/><rect x="12" y="28" width="16" height="6" fill="#e05540"/><rect x="14" y="34" width="3" height="3" fill="#b23a28"/><rect x="23" y="34" width="3" height="3" fill="#b23a28"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Resolve an avatar for any identity: known people render their generated
// portrait, everything else falls back to the claw mark.
export function resolveAvatarUrl(name) {
  if (!name) return clawAvatarUrl();
  return avatarFixturePeople.some((person) => person.name === name)
    ? avatarFixtureUrl(name)
    : clawAvatarUrl();
}
