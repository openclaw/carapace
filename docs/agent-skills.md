# Agent skills

Carapace includes five skills for new installations and one compatibility alias. Install the current skills from the repository's moving default branch:

```bash
npx skills@1.5.16 add \
  "openclaw/carapace" \
  --skill \
    openclaw-design \
    openclaw-brand \
    openclaw-carapace \
    openclaw-marketing-pages \
    openclaw-design-audit \
  --agent codex \
  --copy \
  --yes
```

Refresh every project skill recorded in `skills-lock.json` with the standard updater:

```bash
npx skills@1.5.16 update --project --yes
```

## Routing

Start with `openclaw-design`; it routes work to the focused skill that owns the surface.

| Skill | Use for |
| --- | --- |
| `openclaw-brand` | Identity, typography, logos, imagery, voice, and non-product brand artifacts |
| `openclaw-carapace` | Application UI, semantic tokens, themes, shared primitives, and framework adapters |
| `openclaw-marketing-pages` | Public-page composition, content pages, navigation, SEO, and responsive layout |
| `openclaw-design-audit` | Design drift, token misuse, accessibility, responsive defects, and recurring audits |

`openclaw-design-system` remains available only as a compatibility alias for existing skill locks. New installations should use `openclaw-carapace`.

Runtime CSS stays pinned to a semantic release tag. Agent guidance follows the default branch so `skills update` can refresh it independently.
