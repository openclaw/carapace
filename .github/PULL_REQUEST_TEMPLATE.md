<!--
Optional linked context:
Add a visible `Closes #<issue-number>` or `Related: #<issue-number>` line
below this comment.

Required PR title:
type: user-facing description
Use a parenthesized scope only when it adds clarity:
fix(auth): login redirect loops when session cookie is expired

Types: feat, fix, improve, refactor, docs, chore.
For fixes, describe the user-visible symptom and trigger:
fix: task list fails to load when user has no environments
Avoid implementation details such as:
fix: add null check to task query

**MUST:** Keep **Allow edits from maintainers** enabled for this PR so maintainers
can help update the branch when needed.
-->

## What Problem This Solves

<!--
Describe the concrete user, product, or operational problem.
In 1–3 plain sentences, say who is affected, what happens today, and why it
matters to them. For a bug, name the trigger if known. For a feature or internal
work, describe the need in the actual workflow without inventing harm.
Could a reader understand the problem without knowing your proposed fix?

Good: "Background checks can use up a new user's model allowance before they've
asked the assistant to monitor anything."
Bad: "Turn off periodic checks on fresh installs."
-->

## User Impact

<!--
"User impact: <what users, operators, or developers can now do or expect>."
Lead with the concrete outcome in plain language, usually one sentence.
For internal-only changes, say there is no user-visible change; do not invent a benefit.
Keep important risks, breaking changes, migrations, and required user actions visible here.
-->

## Why This Change Was Made

<!--
Briefly explain how the change addresses the problem without repeating the impact.
With the problem or task and its value established above, describe the chosen
approach and any material alternatives or tradeoffs.
Keep the body short. Leave file lists, internal acronyms, and root-cause walkthroughs
in the diff or optional <details>; include technical detail only when it explains
behavior or a material tradeoff. Do not hide risks or required actions in <details>.
-->

## Evidence

<!--
Show the most useful proof that this change works. Screenshots, screencasts,
terminal output, focused tests, CI results, live observations, redacted logs,
and artifact links are all useful. Include before/after evidence for visual
changes when it clarifies the result.

Reviewers will inspect the code, tests, and CI. Use this section to make the
validation easy to understand, not to restate the diff.
Summarize what was checked and the result; note meaningful gaps. Link long output
or put it in optional <details>, keeping the useful evidence summary visible.
Put those outcomes before commands or logs; a command alone does not explain
what passed, failed, or remains unverified. For example, when actually verified:
- Command-only: "Ran bun run pack:check."
  Outcome-first: "The package includes every declared CSS entry point;
  bun run pack:check passed."
-->
