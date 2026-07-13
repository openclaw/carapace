import { mkdir, rm } from "node:fs/promises";

const destination = "dist/candidate";
const filename = "carapace-candidate.tgz";

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });

const result = Bun.spawnSync(
  [
    "bun",
    "pm",
    "pack",
    "--filename",
    `${destination}/${filename}`,
    "--ignore-scripts",
    "--quiet",
  ],
  { cwd: process.cwd(), stderr: "pipe", stdout: "pipe" },
);

if (result.exitCode !== 0) {
  throw new Error(new TextDecoder().decode(result.stderr));
}

console.log(`${destination}/${filename}`);
