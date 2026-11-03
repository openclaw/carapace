import { readFile } from "node:fs/promises";
import { expect, test } from "bun:test";

test("runs CodeQL when a draft PR becomes ready and preserves weekly/manual scans", async () => {
  const workflow = await readFile(".github/workflows/codeql.yml", "utf8");
  const header = workflow.slice(0, workflow.indexOf("\njobs:\n"));

  expect(header).not.toMatch(/^  push:/mu);
  expect(header).toContain("types: [opened, synchronize, reopened, ready_for_review]");
  expect(header).toContain('cron: "31 5 * * 1"');
  expect(header).toContain("  workflow_dispatch:");
  expect(header).toContain(
    "group: codeql-${{ github.workflow }}-${{ github.event_name }}-" +
      "${{ github.event_name == 'workflow_dispatch' && github.run_id || github.event.pull_request.number || github.ref }}",
  );
  expect(header).toContain("cancel-in-progress: ${{ github.event_name == 'pull_request' }}");
});
