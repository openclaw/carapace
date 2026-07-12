# Next-release token gaps

Status: candidate map only. This branch does not change the current runtime contract.

The current release is sufficient for general product controls, but complex conversational surfaces repeatedly choose raw dimensions, generic surfaces, or unrelated semantic roles. The next release should promote only values shared by at least two consumers and preserve the existing aliases during adoption.

## Current consumer contract

The three production consumers are pinned to `v0.0.1`. Their current entry-point usage defines the compatibility floor for the next tagged release.

| Consumer | Imported package entry points | Integration shape |
| --- | --- | --- |
| `openclaw/openclaw.ai` | `tokens.css`, `themes.css`, `typography.css`, `components.css` | Uses the canonical theme and component classes directly, with site-specific font and effect overrides. |
| `openclaw/docs` | `tokens.css`, `themes.css`, `typography.css`, `components.css`, `themes/product.css` | Concatenates the package CSS into the generated documentation site and maps canonical roles to local aliases. |
| `openclaw/clawhub` | `tokens.css`, `themes.css`, `typography.css`, `components.css`, `themes/product.css`, `compat/clawhub.css` | Uses canonical classes and tokens behind a compatibility adapter while legacy selectors migrate incrementally. |

Safe extension therefore means:

1. Keep every current export path, token name, class name, theme value, and compatibility alias intact.
2. Add new tokens with complete light and dark resolutions; never repurpose an existing semantic role.
3. Keep component declarations on existing-token fallbacks until all three consumers can adopt the new release independently.
4. Run each consumer's build and contract checks against the packed candidate before tagging.
5. Release token additions separately from consumer adoption so installing the tag does not force a visual migration.

## Highest-priority semantic gaps

| Proposed token | Current fallback | Why it is needed | Primary consumers |
| --- | --- | --- | --- |
| `--oc-surface-message-user` | `--oc-surface-interactive` | Distinguishes authored prompts without using the brand accent as a large fill. | User Message, Agent Chat |
| `--oc-surface-message-assistant` | `transparent` | Keeps assistant responses visually open while preserving an explicit theme role. | Message List, Agent Chat |
| `--oc-surface-composer` | `--oc-bg-surface` | Gives message entry a stable inset surface independent from cards and overlays. | Input Bar, Agent Chat, Question Tool |
| `--oc-surface-tool` | `--oc-surface-card` | Separates executable tool records from generic content cards. | Generic Tool and specialized tools |
| `--oc-surface-code` | `--oc-bg-page` | Provides a theme-aware terminal and code-output surface without borrowing the page background. | Bash Tool, Markdown, Code Highlighted |
| `--oc-border-message` | `--oc-border-subtle` | Allows conversation density to evolve without changing every generic border. | Message bubbles, composer, attachments |
| `--oc-border-tool` | `--oc-border-subtle` | Supports stronger tool grouping and state hierarchy independently. | Tool Group and specialized tools |
| `--oc-text-agent-status` | `--oc-text-muted` | Creates a stable role for streaming, pending, tool, and model metadata. | Message List, Tool cards, loaders |
| `--oc-status-pending-bg` | `--oc-surface-secondary-soft` | Pending work is not success, warning, or error and needs its own role. | Thinking Tool, loaders, Todo Tool |
| `--oc-status-pending-fg` | `--oc-accent-secondary` | Completes the pending-state foreground/background pair. | Thinking Tool, loaders, Todo Tool |

## Geometry and density gaps

| Proposed token | Current repeated value | Why it is needed | Primary consumers |
| --- | --- | --- | --- |
| `--oc-control-height-sm` | `2rem` | Standardizes compact buttons, tabs, suggestions, and toolbar actions. | Suggestions, Toolbar, Segmented Control |
| `--oc-control-height-md` | `2.5rem` | Replaces the most repeated control dimension in the package. | Button, Input, Select, actions |
| `--oc-control-height-lg` | `3rem` | Gives large actions and primary composer controls one shared contract. | Button, Input Bar, dialogs |
| `--oc-icon-size-sm` | `1rem` | Aligns icons and loading marks across compact controls. | Buttons, Loader, status rows |
| `--oc-icon-size-md` | `1.5rem` | Aligns standalone status and tool icons. | Spiral Loader, Tool cards |
| `--oc-avatar-size-sm` | `1.75rem` | Removes repeated avatar dimensions from delegated-work surfaces. | Subagent Tool, message metadata |
| `--oc-composer-min-height` | `2.5rem` | Makes the collapsed message composer intentional and shared. | Input Bar, Agent Chat |
| `--oc-composer-max-height` | `10rem` | Standardizes composer growth before internal scrolling begins. | Input Bar, Agent Chat |
| `--oc-conversation-max-width` | `42rem` | Keeps readable conversational measure consistent across consumers. | Agent Chat, Input Bar, messages |
| `--oc-tool-max-width` | `44rem` | Keeps tool records aligned without reusing editorial content widths. | Tool Group and specialized tools |

## Motion and layering gaps

| Proposed token | Current fallback | Why it is needed | Primary consumers |
| --- | --- | --- | --- |
| `--oc-duration-ambient` | component literals | The current `fast` and `ui` durations are too short for indeterminate shimmer and skeleton motion. | Skeleton Line, Text Shimmer |
| `--oc-duration-progress` | component literals | Gives spinners and progress marks a consistent perceived speed. | Loader, Spiral Loader, upload progress |
| `--oc-ease-in-out` | `--oc-ease-out` | Continuous on-screen movement needs a different curve from entrances and hover feedback. | Progress and disclosure transitions |
| `--oc-opacity-disabled` | `0.5` or `0.55` | Removes inconsistent disabled contrast across controls. | All form controls and actions |
| `--oc-z-popover` | local integers | Prevents dropdown, tooltip, and popover stacking conflicts. | Combobox, Dropdown, Tooltip, Popover |
| `--oc-z-dialog` | browser/default ordering | Documents layering between dialogs, navigation, and transient feedback. | Dialog, Command Palette, Toast |

## Promotion criteria

1. Validate each proposed role in at least two independent consumers.
2. Prefer semantic roles over component-name tokens when the same value serves multiple components.
3. Resolve light, dark, high-contrast, disabled, and reduced-motion behavior before release.
4. Add compatibility aliases only when a shipped consumer already depends on an equivalent literal or local variable.
5. Release tokens and component adoption separately so consumers can migrate without a forced visual change.

## Explicit non-goals for the current release

- No changes to `styles/tokens.css`, `styles/themes.css`, or product theme values.
- No remapping of existing semantic aliases.
- No new runtime dependency.
- No visual change justified only by one preview specimen.
