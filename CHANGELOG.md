# Changelog

Releases are Git tags (`vX.Y.Z`) matching `package.json`; each tag also gets
auto-generated notes on its GitHub release. This file summarizes the
user-facing arc per release.

## 0.2.0 — 2026-07-24

Application-surface parity ([#30](https://github.com/openclaw/carapace/pull/30)).

### Changes

- Agent chat matures: basic, multi-user (real photo avatars trailing right-aligned bubbles), multi-agent, media, empty, suggestions, and attachments examples, with live submit, suggestion, and attachment demos.
- Model picker reworked: compact fixed-width trigger and menu, flush search, reasoning slider with clickable tick labels, response-speed toggle, and in-place updates with no re-render flash; context-size metadata removed.
- Composer: send anchored far right with the mic to its left, drafts grow to a cap then scroll, and a working-context row (project, machine, branch chips) mirrors the openclaw link/pull flow.
- Agent depth: approval card and queue, tool key-values, JSON collapse, work grouping, turn recap, compaction, activity indicator, plan/question variants, subagent tool with animated running avatar, and collaboration transcript with live timer.
- Identity avatars: deterministic generated art per seed with mosaic/quad/rings styles, presence dots, speaking ring, and a boiling thinking state used across facepiles and the homepage.
- Application chrome: summary strip, session indicators, split pane, log stream, menu panel, option cards, command palette, hovercards, lightbox, table shell redesign, and reworked application screens.
- Brand Banner primitive: reusable artwork band with anchor, effect (fade, wash, grid), variant (classic, close-up, mirrored, emerge), tone palettes, and a dither/pixelate/duotone shader; crustacean artwork family (crab, lobster, shrimp, hermit crab) generated in one pipeline plus the OpenClaw mark.
- Composition pages folded into Blocks; the compositions overview route is removed.

### Fixes

- Preview runtime cleanup: registered missing icons, wired dead controls, split oversized modules and tests, exact-class CSS contracts per candidate entry, full-width component pages, and Firefox rendering fixes (SVG intrinsic sizes, AVIF encoding, clip-path avatars).

## 0.1.0 — 2026-07-08

Initial preview site, stable `styles/components.css` contract, candidate
entries, tokens, and the component workbench.
