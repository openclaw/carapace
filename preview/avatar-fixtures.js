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
  { name: "Mina", role: "Product" },
  { name: "Atlas", role: "Research" },
  { name: "Sora", role: "Interface" },
  { name: "Quinn", role: "Systems" },
  { name: "Planner", role: "Planning" },
  { name: "Builder", role: "Build" },
  { name: "Reviewer", role: "Review" },
  { name: "Scout", role: "Discovery" },
];

function hashAvatarSeed(seed) {
  let hash = 2166136261;
  for (const character of seed) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }
  return hash >>> 0;
}

export function avatarFixtureUrl(seed) {
  const hash = hashAvatarSeed(seed);
  const palette = avatarPalettes[hash % avatarPalettes.length];
  const skin = ["#f5c7a9", "#d99b75", "#9f6547", "#6f4433"][(hash >>> 3) % 4];
  const hair = palette[1 + ((hash >>> 7) % 3)];
  const shirt = palette[1 + ((hash >>> 11) % 3)];
  const eyeOffset = (hash >>> 15) % 2;
  const fringe = (hash >>> 17) % 3;
  const expression = (hash >>> 19) % 3;
  const background = (hash >>> 21) % 3;
  const accessory =
    hash & 1
      ? `<rect x="4" y="17" width="7" height="2" fill="${palette[2]}"/><rect x="29" y="17" width="7" height="2" fill="${palette[2]}"/>`
      : `<rect x="6" y="8" width="5" height="4" fill="${palette[3]}"/><rect x="29" y="8" width="5" height="4" fill="${palette[3]}"/>`;
  const hairPixels = [
    `<rect x="8" y="5" width="24" height="5" fill="${hair}"/>`,
    `<rect x="5" y="9" width="30" height="5" fill="${hair}"/>`,
    fringe === 0 ? `<rect x="8" y="13" width="8" height="5" fill="${hair}"/>` : "",
    fringe === 1 ? `<rect x="24" y="13" width="8" height="5" fill="${hair}"/>` : "",
    fringe === 2 ? `<rect x="16" y="13" width="8" height="4" fill="${hair}"/>` : "",
  ].join("");
  const backgroundPixels = [
    `<rect x="3" y="3" width="5" height="5" fill="${palette[1]}" opacity=".8"/><rect x="32" y="30" width="5" height="5" fill="${palette[2]}" opacity=".7"/>`,
    `<rect x="2" y="28" width="6" height="6" fill="${palette[3]}" opacity=".65"/><rect x="31" y="4" width="7" height="4" fill="${palette[1]}" opacity=".75"/>`,
    `<rect x="2" y="2" width="36" height="4" fill="${palette[2]}" opacity=".5"/><rect x="2" y="34" width="36" height="4" fill="${palette[3]}" opacity=".5"/>`,
  ][background];
  const mouth = [
    `<rect x="17" y="26" width="6" height="2" fill="#7d3f4c"/>`,
    `<rect x="16" y="26" width="8" height="3" fill="#7d3f4c"/><rect x="18" y="26" width="4" height="1" fill="#fff" opacity=".7"/>`,
    `<rect x="18" y="26" width="4" height="4" fill="#7d3f4c"/>`,
  ][expression];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" shape-rendering="crispEdges"><rect width="40" height="40" fill="${palette[0]}"/>${backgroundPixels}<rect x="4" y="4" width="32" height="32" rx="6" fill="${palette[3]}" opacity=".18"/>${accessory}<rect x="8" y="10" width="24" height="23" fill="${skin}"/>${hairPixels}<rect x="${12 + eyeOffset}" y="19" width="4" height="4" fill="#19191d"/><rect x="${24 - eyeOffset}" y="19" width="4" height="4" fill="#19191d"/>${mouth}<rect x="5" y="33" width="30" height="7" fill="${shirt}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
