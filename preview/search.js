const typeOrder = ["Page", "Primitive", "Token"];

function normalize(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

function scoreEntry(entry, query) {
  if (!query) return 0;

  const label = normalize(entry.label);
  const detail = normalize(entry.detail);
  const keywords = normalize(entry.keywords);
  if (label === query) return 0;
  if (label.startsWith(query)) return 1;
  if (label.includes(query)) return 2;
  if (detail.includes(query)) return 3;
  if (keywords.includes(query)) return 4;
  return Number.POSITIVE_INFINITY;
}

export function rankSearchEntries(entries, value, limit = 12) {
  const query = normalize(value);
  const ranked = entries
    .map((entry, index) => ({ entry, index, score: scoreEntry(entry, query) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((left, right) => {
      if (left.score !== right.score) return left.score - right.score;
      const leftType = typeOrder.indexOf(left.entry.type);
      const rightType = typeOrder.indexOf(right.entry.type);
      if (leftType !== rightType) return leftType - rightType;
      return left.index - right.index;
    });

  return {
    matches: ranked.slice(0, limit).map(({ entry }) => entry),
    total: ranked.length,
  };
}

export function groupSearchResults(entries) {
  const types = [
    ...typeOrder.filter((type) => entries.some((entry) => entry.type === type)),
    ...new Set(entries.map((entry) => entry.type).filter((type) => !typeOrder.includes(type))),
  ];

  return types.map((type) => ({
    type,
    entries: entries.filter((entry) => entry.type === type),
  }));
}
