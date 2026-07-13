import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { parse } from "yaml";

const root = process.cwd();
const skillFiles = [
  "openclaw-design/SKILL.md",
  "openclaw-brand/SKILL.md",
  "openclaw-carapace/SKILL.md",
  "openclaw-design-system/SKILL.md",
  "openclaw-marketing-pages/SKILL.md",
  "openclaw-design-audit/SKILL.md",
];

if (existsSync("SKILL.md")) {
  throw new Error(
    "keep every skill in a top-level directory so `npx skills update` discovers the full set",
  );
}

function parseFrontmatter(source: string, path: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    throw new Error(`${path} is missing YAML frontmatter`);
  }

  const frontmatter = parse(match[1]) as {
    description?: unknown;
    name?: unknown;
  };

  if (typeof frontmatter.name !== "string" || !/^[a-z0-9-]+$/.test(frontmatter.name)) {
    throw new Error(`${path} has an invalid skill name`);
  }
  if (typeof frontmatter.description !== "string" || frontmatter.description.length < 30) {
    throw new Error(`${path} needs a useful description`);
  }
}

for (const skillFile of skillFiles) {
  const source = await readFile(skillFile, "utf8");
  parseFrontmatter(source, skillFile);

  if (source.includes("[TODO") || source.includes("TODO:")) {
    throw new Error(`${skillFile} still contains scaffold TODOs`);
  }

  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+\.md)\)/g)) {
    const target = match[1];
    if (/^https?:\/\//.test(target)) continue;

    const resolved = join(root, dirname(skillFile), target);
    if (!existsSync(resolved)) {
      throw new Error(
        `${skillFile} links to missing reference ${relative(root, resolved)}`,
      );
    }
  }

}

const rootSkill = await readFile("openclaw-design/SKILL.md", "utf8");
if (/\]\(openclaw-[^)]+\/SKILL\.md\)/.test(rootSkill)) {
  throw new Error(
    "openclaw-design/SKILL.md must route by installed skill name, not source-repository sibling links",
  );
}

console.log(`Validated ${skillFiles.length} skills`);
