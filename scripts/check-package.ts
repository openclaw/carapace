import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

type PackageJson = {
  exports?: Record<string, string>;
  files?: string[];
  homepage?: string;
  name?: string;
  private?: boolean;
  repository?: {
    url?: string;
  };
  version?: string;
};

const packageJson = JSON.parse(await readFile("package.json", "utf8")) as PackageJson;

if (packageJson.name !== "@openclaw/carapace") {
  throw new Error("Unexpected package name");
}
if (packageJson.repository?.url !== "https://github.com/openclaw/carapace.git") {
  throw new Error("Unexpected package repository");
}
if (packageJson.homepage !== "https://carapace.design/") {
  throw new Error("Unexpected package homepage");
}
if (!packageJson.version) {
  throw new Error("Missing package version");
}
if (packageJson.private !== true) {
  throw new Error("The Git-only package must remain private to prevent accidental npm publishing");
}

for (const [specifier, target] of Object.entries(packageJson.exports ?? {})) {
  if (!existsSync(target)) {
    throw new Error(`Package export ${specifier} points to missing file ${target}`);
  }
}

const result = Bun.spawnSync(["bun", "pm", "pack", "--dry-run"], {
  cwd: process.cwd(),
  stderr: "pipe",
  stdout: "pipe",
});

if (result.exitCode !== 0) {
  throw new Error(new TextDecoder().decode(result.stderr));
}

const output = new TextDecoder().decode(result.stdout);
for (const required of [
  "styles/styles.css",
  "styles/tokens.css",
  "styles/themes.css",
  "styles/themes/product.css",
  "styles/typography.css",
  "styles/base.css",
  "styles/components.css",
  "styles/tailwind.css",
  "styles/compat/clawhub.css",
]) {
  if (!output.includes(required)) {
    throw new Error(`Packed package is missing ${required}`);
  }
}

console.log(`Package exports and packed contents are valid for ${packageJson.version}`);
