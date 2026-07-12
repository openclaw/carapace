import { exampleDialogAttribute } from "./interaction.js";
import { agentReferenceContentIds, getAgentReferenceContent } from "./agent-components.js";

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function codeBlock(code, language = "css") {
  return `<div class="code-block"><div class="code-block-header"><span>${language}</span><button type="button" data-copy-code>Copy</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function pageIntro(eyebrow, title, lede) {
  return `<header class="reference-intro"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${lede}</p></header>`;
}

function tokenSection(groups = "") {
  return `<section class="token-reference" aria-labelledby="token-reference-title"><div class="section-heading"><div><p class="eyebrow">Token reference</p><h2 id="token-reference-title">Canonical variables</h2></div><p data-token-summary aria-live="polite"><span data-token-count></span> tokens</p></div><div class="token-reference-layout"><aside class="token-index"><p>Tokens</p><nav data-token-group-nav aria-label="Token groups"></nav></aside><div class="token-catalog" data-token-grid${groups ? ` data-token-groups="${groups}"` : ""}></div></div></section>`;
}

function guidanceList(items) {
  return `<ul class="guidance-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function referenceTable(headers, rows) {
  return `<div class="table-wrap reference-table"><table><thead><tr>${headers.map((header) => `<th scope="col">${header}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, index) => `${index === 0 ? '<th scope="row">' : "<td>"}${cell}${index === 0 ? "</th>" : "</td>"}`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

export const skillsInstallCommand = `npx skills@1.5.16 add \\
  "openclaw/carapace" \\
  --skill \\
    openclaw-design \\
    openclaw-brand \\
    openclaw-carapace \\
    openclaw-marketing-pages \\
    openclaw-design-audit \\
  --agent codex \\
  --copy \\
  --yes`;

export const skillsUpdateCommand = "npx skills@1.5.16 update --project --yes";

const contents = {
  "foundation-tokens": () =>
    `${pageIntro("Foundations", "Design tokens", "Use the shared variables to build consistent color, type, spacing, shape, depth, and motion across OpenClaw interfaces.")}${tokenSection()}`,

  "foundation-colors": () =>
    `${pageIntro("Foundations", "Colors", "Fixed palette sources and theme-aware semantic roles for backgrounds, text, borders, actions, and operational feedback.")}
    <section aria-labelledby="color-model"><div class="section-heading"><div><p class="eyebrow">Model</p><h2 id="color-model">Choose intent before value</h2></div></div>
      <div class="principle-grid">
        <article><h3>Palette</h3><p>Fixed source colors. Direct use is reserved for documented exceptions.</p></article>
        <article><h3>Semantic</h3><p>Theme-aware roles for page, surface, text, accent, and borders.</p></article>
        <article><h3>Product</h3><p>Opt-in status, input, selection, chart, and diff roles for operational UI.</p></article>
      </div>
    </section>
    <section aria-labelledby="color-product-boundary"><div class="section-heading"><div><p class="eyebrow">Ownership</p><h2 id="color-product-boundary">Product roles are opt-in</h2></div></div><p class="section-copy">Status, input, and diff variables come from the product theme. They extend the semantic foundation for operational interfaces without creating a second color system.</p></section>
    ${tokenSection("palette,background,accent,text,border,surface,feedback,status,input,diff")}`,

  "foundation-typography": () =>
    `${pageIntro("Foundations", "Typography", "Four font roles and a compact type scale keep interface, editorial, and technical content distinct.")}
    <section aria-labelledby="type-in-use"><div class="section-heading"><div><p class="eyebrow">Specimens</p><h2 id="type-in-use">Type in use</h2></div></div>
      <div class="type-specimens">
        <div><span class="specimen-label">Display</span><p class="type-display">Agents that work where you do.</p></div>
        <div><span class="specimen-label">Body</span><p class="type-body">OpenClaw connects tools, channels, and models without hiding the operational details that matter.</p></div>
        <div><span class="specimen-label">Editorial</span><p class="type-serif">A useful system should make judgment visible.</p></div>
        <div><span class="specimen-label">Code</span><code class="type-code">openclaw skills install @owner/skill</code></div>
      </div>
    </section>
    <section aria-labelledby="type-assets"><div class="section-heading"><div><p class="eyebrow">Assets</p><h2 id="type-assets">Licensed fonts stay with the consumer</h2></div></div>${guidanceList(["Use Switzer and Sentient only where the consumer holds the appropriate license.", "The package distributes fallback stacks, not font binaries.", "Use the canonical font roles so licensed and fallback typography preserve the same intent."])}</section>
    ${tokenSection("type-scale,font")}`,

  "foundation-layout": () =>
    `${pageIntro("Foundations", "Layout", "A shared spacing scale and two content widths provide rhythm without owning consumer-specific page composition.")}
    <section aria-labelledby="layout-roles"><div class="section-heading"><div><p class="eyebrow">Roles</p><h2 id="layout-roles">Content widths</h2></div></div>
      <div class="width-specimens"><div class="width-specimen width-specimen-wide"><span>Content max</span></div><div class="width-specimen width-specimen-narrow"><span>Content narrow</span></div></div>
    </section>
    ${tokenSection("space,content")}`,

  "foundation-shape-depth": () =>
    `${pageIntro("Foundations", "Shape and depth", "Semantic geometry keeps product UI square while preserving explicit scale values for documented exceptions.")}
    <section aria-labelledby="geometry-rules"><div class="section-heading"><div><p class="eyebrow">Geometry</p><h2 id="geometry-rules">Role before radius</h2></div></div>
      ${guidanceList([
        "Use surface, control, and inset roles for ordinary product UI.",
        "Reserve round geometry for avatars, status dots, and genuinely circular indicators.",
        "Use shadows to communicate elevation, not decoration.",
      ])}
    </section>
    ${tokenSection("radius,shadow")}`,

  "foundation-motion": () =>
    `${pageIntro("Foundations", "Motion", "Shared durations and easing make state changes coherent while leaving behavior in the consumer.")}
    <section aria-labelledby="motion-use"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="motion-use">Motion explains change</h2></div></div>
      ${guidanceList([
        "Use motion for state, progression, and spatial continuity.",
        "Keep repeated navigation and keyboard actions immediate.",
        "Respect reduced-motion preferences in the consuming application.",
      ])}
    </section>
    <section aria-labelledby="motion-reduction"><div class="section-heading"><div><p class="eyebrow">Accessibility</p><h2 id="motion-reduction">The base contract honors reduced motion</h2></div></div><p class="section-copy">When reduced motion is requested, smooth scrolling is disabled and animation and transition durations collapse to an effectively immediate value.</p></section>
    ${tokenSection("motion")}`,

  "foundation-base": () =>
    `${pageIntro("Foundations", "Base styles", "The optional baseline establishes predictable sizing, readable defaults, visible focus, selection, and motion preferences.")}
    <section aria-labelledby="base-contract"><div class="section-heading"><div><p class="eyebrow">Baseline</p><h2 id="base-contract">What base.css owns</h2></div></div>${referenceTable(["Behavior", "Contract"], [["Sizing", "Border-box sizing for every element and pseudo-element."], ["Document", "A 320px minimum width, full-height body, canonical background, text, and body type."], ["Headings", "Balanced wrapping without imposing a heading scale."], ["Selection", "Theme-aware selection color and readable selected text."], ["Focus", "A visible two-pixel focus ring with semantic color."], ["Screen reader text", "A reusable .sr-only utility for visually hidden accessible labels."]])}</section>
    <section aria-labelledby="base-motion"><div class="section-heading"><div><p class="eyebrow">Preference</p><h2 id="base-motion">Reduced motion is built in</h2></div></div>${guidanceList(["Smooth scrolling is disabled when reduced motion is requested.", "Animations run once with an effectively immediate duration.", "Transitions collapse without requiring a consumer-specific override."])}</section>
    <section aria-labelledby="base-import"><div class="section-heading"><div><p class="eyebrow">Adoption</p><h2 id="base-import">Import deliberately</h2></div></div>${codeBlock(`@import "@openclaw/carapace/base.css";`)}<p class="section-copy">Static documentation builders should compare generated navigation, prose, search, code, and diagrams before opting into the baseline.</p></section>`,

  "interface-primitives": () =>
    `${pageIntro("Interface", "Shared primitives", "Framework-neutral classes exported by components.css. Consumers keep their own content and behavior.")}
    <div class="scope-note"><strong>Canonical scope</strong><p>Every page below documents classes already exported by components.css. No local example is promoted into the contract.</p></div>
    <section aria-labelledby="primitive-index"><div class="section-heading"><div><p class="eyebrow">Index</p><h2 id="primitive-index">Primitive families</h2></div><span class="oc-pill">49 references</span></div>
      <div class="reference-card-grid primitive-index-grid">
        <a class="reference-card" href="./autocomplete/"><span>.oc-autocomplete</span><strong>Autocomplete</strong><p>Text entry with native suggestions.</p></a>
        <a class="reference-card" href="./badge/"><span>.oc-badge</span><strong>Badge</strong><p>Compact status and metadata labels.</p></a>
        <a class="reference-card" href="./banner/"><span>.oc-banner</span><strong>Banner</strong><p>Persistent contextual notices.</p></a>
        <a class="reference-card" href="./breadcrumbs/"><span>.oc-breadcrumbs</span><strong>Breadcrumbs</strong><p>Current location within a hierarchy.</p></a>
        <a class="reference-card" href="./button/"><span>.oc-button</span><strong>Button</strong><p>Explicit button variants and sizes.</p></a>
        <a class="reference-card" href="./clipboard-text/"><span>.oc-clipboard-text</span><strong>Clipboard Text</strong><p>Copyable literal values.</p></a>
        <a class="reference-card" href="./code-highlighted/"><span>.oc-code-highlighted</span><strong>Code Highlighted</strong><p>Structured syntax presentation.</p></a>
        <a class="reference-card" href="./collapsible/"><span>.oc-collapsible</span><strong>Collapsible</strong><p>Native expandable disclosure.</p></a>
        <a class="reference-card" href="./combobox/"><span>.oc-combobox</span><strong>Combobox</strong><p>Searchable single selection.</p></a>
        <a class="reference-card" href="./command-palette/"><span>.oc-command-palette</span><strong>Command Palette</strong><p>Searchable action launcher.</p></a>
        <a class="reference-card" href="./date-picker/"><span>.oc-date-picker</span><strong>Date Picker</strong><p>Native calendar date selection.</p></a>
        <a class="reference-card" href="./dialog/"><span>.oc-dialog</span><strong>Dialog</strong><p>Focused modal decisions.</p></a>
        <a class="reference-card" href="./dropdown/"><span>.oc-dropdown</span><strong>Dropdown</strong><p>Compact contextual actions.</p></a>
        <a class="reference-card" href="./empty/"><span>.oc-empty</span><strong>Empty</strong><p>Purposeful no-content states.</p></a>
        <a class="reference-card" href="./flow/"><span>.oc-flow</span><strong>Flow</strong><p>Sequential steps and dependencies.</p></a>
        <a class="reference-card" href="./grid/"><span>.oc-grid</span><strong>Grid</strong><p>Responsive equal-width layouts.</p></a>
        <a class="reference-card" href="./layer-card/"><span>.oc-layer-card</span><strong>Layer Card</strong><p>Stacked surface depth.</p></a>
        <a class="reference-card" href="./link/"><span>.oc-link</span><strong>Link</strong><p>Inline and standalone navigation.</p></a>
        <a class="reference-card" href="./loader/"><span>.oc-loader</span><strong>Loader</strong><p>Indeterminate progress feedback.</p></a>
        <a class="reference-card" href="./menu-bar/"><span>.oc-menubar</span><strong>Menu Bar</strong><p>Grouped application commands.</p></a>
        <a class="reference-card" href="./meter/"><span>.oc-meter</span><strong>Meter</strong><p>Known measurements within a range.</p></a>
        <a class="reference-card" href="./pagination/"><span>.oc-pagination</span><strong>Pagination</strong><p>Navigation across discrete pages.</p></a>
        <a class="reference-card" href="./popover/"><span>.oc-popover</span><strong>Popover</strong><p>Anchored supporting content.</p></a>
        <a class="reference-card" href="./provider-logo/"><span>.oc-provider-logo</span><strong>Provider Logo</strong><p>Integration identity lockups.</p></a>
        <a class="reference-card" href="./app-surface/"><span>.oc-app-surface</span><strong>App surface</strong><p>Root visual context for an application surface.</p></a>
        <a class="reference-card" href="./hero/"><span>.oc-hero</span><strong>Hero</strong><p>Centered introduction with title and lede roles.</p></a>
        <a class="reference-card" href="./section/"><span>.oc-section</span><strong>Section</strong><p>Reusable heading, copy, and action structure.</p></a>
        <a class="reference-card" href="./card/"><span>.oc-card</span><strong>Card</strong><p>Static and interactive shared surfaces.</p></a>
        <a class="reference-card" href="./action/"><span>.oc-action</span><strong>Action</strong><p>Primary, secondary, ghost, and icon variants.</p></a>
        <a class="reference-card" href="./segmented-control/"><span>.oc-segmented</span><strong>Segmented control</strong><p>Compact selection among peer views.</p></a>
        <a class="reference-card" href="./pill/"><span>.oc-pill</span><strong>Pill</strong><p>Compact non-interactive metadata.</p></a>
        <a class="reference-card" href="./input/"><span>.oc-input</span><strong>Input</strong><p>Labeled text entry with helper, error, and disabled states.</p></a>
        <a class="reference-card" href="./checkbox/"><span>.oc-checkbox</span><strong>Checkbox</strong><p>Independent binary selection with native form behavior.</p></a>
        <a class="reference-card" href="./radio/"><span>.oc-radio</span><strong>Radio</strong><p>Single selection from a visible group of options.</p></a>
        <a class="reference-card" href="./switch/"><span>.oc-switch</span><strong>Switch</strong><p>Immediate binary setting with native form behavior.</p></a>
        <a class="reference-card" href="./select/"><span>.oc-select</span><strong>Select</strong><p>Native selection for a compact list of options.</p></a>
        <a class="reference-card" href="./input-area/"><span>.oc-textarea</span><strong>Input Area</strong><p>Multiline text entry with native resizing.</p></a>
        <a class="reference-card" href="./label/"><span>.oc-label</span><strong>Label</strong><p>Visible field naming with required and optional metadata.</p></a>
        <a class="reference-card" href="./input-group/"><span>.oc-input-group</span><strong>Input Group</strong><p>Text input with a structural prefix or suffix.</p></a>
        <a class="reference-card" href="./sensitive-input/"><span>.oc-sensitive-input</span><strong>Sensitive Input</strong><p>Secret entry with an explicit visibility control.</p></a>
        <a class="reference-card" href="./sidebar/"><span>.oc-sidebar</span><strong>Sidebar</strong><p>Persistent navigation with clear current-page state.</p></a>
        <a class="reference-card" href="./skeleton-line/"><span>.oc-skeleton-line</span><strong>Skeleton Line</strong><p>Reserved text space during loading.</p></a>
        <a class="reference-card" href="./table/"><span>.oc-table</span><strong>Table</strong><p>Structured comparison across rows and columns.</p></a>
        <a class="reference-card" href="./table-of-contents/"><span>.oc-table-of-contents</span><strong>Table of Contents</strong><p>Local navigation through page sections.</p></a>
        <a class="reference-card" href="./tabs/"><span>.oc-tabs</span><strong>Tabs</strong><p>Peer views within one local context.</p></a>
        <a class="reference-card" href="./text/"><span>.oc-text</span><strong>Text</strong><p>Readable semantic text roles.</p></a>
        <a class="reference-card" href="./toolbar/"><span>.oc-toolbar</span><strong>Toolbar</strong><p>Grouped direct actions.</p></a>
        <a class="reference-card" href="./toast/"><span>.oc-toast</span><strong>Toast</strong><p>Temporary status feedback.</p></a>
        <a class="reference-card" href="./tooltip/"><span>.oc-tooltip</span><strong>Tooltip</strong><p>Brief labels and supporting descriptions.</p></a>
      </div>
    </section>`,

  "primitive-app-surface": () =>
    `${pageIntro("Interface primitive", "App surface", "Establishes the canonical background, foreground, typography, and component surface aliases for an application subtree.")}
    <section data-section-kind="preview" aria-labelledby="app-surface-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="app-surface-preview">Root visual context</h2></div><span class="oc-pill">.oc-app-surface</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-app-surface-demo"><strong>OpenClaw application</strong><p>Children inherit the canonical interface foundation.</p></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="app-surface-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="app-surface-markup">Apply once at the surface root</h2></div></div>${codeBlock(`<main class="oc-app-surface">\n  <!-- Consumer-owned application -->\n</main>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="app-surface-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="app-surface-guidance">Ownership boundary</h2></div></div>${guidanceList(["Use it as the visual context for an application subtree.", "Keep routing, data, and behavior in the consumer.", "Do not nest it merely to create another card or panel."])}</section>`,

  "primitive-autocomplete": () =>
    `${pageIntro("Component", "Autocomplete", "A labeled text field connected to native suggestions without replacing keyboard or form behavior.")}
    <section data-section-kind="preview" aria-labelledby="autocomplete-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="autocomplete-preview">Known values, free entry</h2></div><span class="oc-pill">.oc-autocomplete</span></div>
      <div class="specimen-frame"><label class="oc-autocomplete"><span class="oc-field-label">Component</span><input class="oc-input" type="text" list="component-options" placeholder="Start typing…" autocomplete="off" /><datalist id="component-options"><option value="Action"></option><option value="Card"></option><option value="Input"></option><option value="Select"></option></datalist></label></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="autocomplete-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="autocomplete-markup">Connect input and datalist</h2></div></div>${codeBlock(`<label class="oc-autocomplete">\n  <span class="oc-field-label">Component</span>\n  <input class="oc-input" list="components" />\n  <datalist id="components">\n    <option value="Action"></option>\n    <option value="Card"></option>\n  </datalist>\n</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="autocomplete-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="autocomplete-guidance">Suggestions do not constrain entry</h2></div></div>${guidanceList(["Use Select when the value must come from a fixed set.", "Keep a visible label even when the placeholder is descriptive.", "Let the browser preserve keyboard, form, and assistive-technology behavior."])}</section>`,

  "primitive-badge": () =>
    `${pageIntro("Component", "Badge", "A compact label for status or short metadata that remains readable without relying on color alone.")}
    <section data-section-kind="preview" aria-labelledby="badge-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="badge-preview">Status variants</h2></div><span class="oc-pill">.oc-badge</span></div>
      <div class="specimen-frame"><div class="primitive-control-row"><span class="oc-badge oc-badge-neutral">Official</span><span class="oc-badge oc-badge-success">Ready</span><span class="oc-badge oc-badge-warning">Pending</span><span class="oc-badge oc-badge-error">Failed</span></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="badge-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="badge-markup">Name the state</h2></div></div>${codeBlock(`<span class="oc-badge oc-badge-success">Ready</span>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="badge-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="badge-guidance">Keep labels short and literal</h2></div></div>${guidanceList(["Use a badge for state or metadata, not as an action.", "Pair semantic color with explicit text.", "Use Pill for neutral taxonomy that does not express status."])}</section>`,

  "primitive-banner": () =>
    `${pageIntro("Component", "Banner", "A persistent contextual notice with an explicit title, supporting message, and optional adjacent action.")}
    <section data-section-kind="preview" aria-labelledby="banner-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="banner-preview">Context before action</h2></div><span class="oc-pill">.oc-banner</span></div>
      <div class="specimen-frame"><div class="oc-banner oc-banner-warning" role="status"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content"><strong class="oc-banner-title">Update available</strong><p>Review the changes before applying the new contract.</p></div><button class="oc-action oc-action-secondary" type="button">Review</button></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="banner-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="banner-markup">Keep the message structural</h2></div></div>${codeBlock(`<div class="oc-banner oc-banner-warning" role="status">\n  <span class="oc-banner-indicator" aria-hidden="true"></span>\n  <div class="oc-banner-content">\n    <strong class="oc-banner-title">Update available</strong>\n    <p>Review the changes before applying.</p>\n  </div>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="banner-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="banner-guidance">Reserve space for durable context</h2></div></div>${guidanceList(["Use Toast for transient confirmation.", "Use role alert only when interruption is necessary.", "Keep the action adjacent and singular when one is required."])}</section>`,

  "primitive-breadcrumbs": () =>
    `${pageIntro("Component", "Breadcrumbs", "A compact navigation trail that communicates the current page within a stable hierarchy.")}
    <section data-section-kind="preview" aria-labelledby="breadcrumbs-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="breadcrumbs-preview">Current location</h2></div><span class="oc-pill">.oc-breadcrumbs</span></div>
      <div class="specimen-frame"><nav class="oc-breadcrumbs" aria-label="Breadcrumb"><ol class="oc-breadcrumbs-list"><li class="oc-breadcrumbs-item"><a href="../../../">Home</a></li><li class="oc-breadcrumbs-item"><a href="../">Components</a></li><li class="oc-breadcrumbs-item"><span aria-current="page">Breadcrumbs</span></li></ol></nav></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="breadcrumbs-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="breadcrumbs-markup">Use an ordered navigation trail</h2></div></div>${codeBlock(`<nav class="oc-breadcrumbs" aria-label="Breadcrumb">\n  <ol class="oc-breadcrumbs-list">\n    <li class="oc-breadcrumbs-item"><a href="/">Home</a></li>\n    <li class="oc-breadcrumbs-item"><span aria-current="page">Components</span></li>\n  </ol>\n</nav>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="breadcrumbs-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="breadcrumbs-guidance">Represent hierarchy, not history</h2></div></div>${guidanceList(["Use the information architecture rather than the browser history.", "Mark only the final item as the current page.", "Keep mobile labels concise so the trail can truncate without hiding location."])}</section>`,

  "primitive-button": () =>
    `${pageIntro("Component", "Button", "A direct action control with clear visual hierarchy, explicit sizes, and native disabled behavior.")}
    <section data-section-kind="preview" aria-labelledby="button-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="button-preview">Action hierarchy</h2></div><span class="oc-pill">.oc-button</span></div>
      <div class="specimen-frame"><div class="primitive-control-row"><button class="oc-button oc-button-primary" type="button">Save changes</button><button class="oc-button oc-button-secondary" type="button">Preview</button><button class="oc-button oc-button-ghost" type="button">Cancel</button><button class="oc-button oc-button-secondary" type="button" disabled>Unavailable</button></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="button-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="button-markup">Use the native element</h2></div></div>${codeBlock(`<button class="oc-button oc-button-primary" type="button">\n  Save changes\n</button>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="button-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="button-guidance">One hierarchy per action set</h2></div></div>${guidanceList(["Use Button for in-place actions and links for navigation.", "Keep one primary action in a local decision group.", "Prefer disabled only when the reason is visible or immediately inferable."])}</section>`,

  "primitive-clipboard-text": () =>
    `${pageIntro("Component", "Clipboard Text", "A compact read-only value with an explicit copy action and accessible status feedback.")}
    <section data-section-kind="preview" aria-labelledby="clipboard-text-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="clipboard-text-preview">Literal value</h2></div><span class="oc-pill">.oc-clipboard-text</span></div>
      <div class="specimen-frame"><div class="oc-clipboard-text"><code class="oc-clipboard-value">@openclaw/design-system</code><button class="oc-clipboard-action" type="button" data-copy-text="@openclaw/design-system">Copy</button></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="clipboard-text-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="clipboard-text-markup">Keep value and action adjacent</h2></div></div>${codeBlock(`<div class="oc-clipboard-text">\n  <code class="oc-clipboard-value">@openclaw/design-system</code>\n  <button class="oc-clipboard-action" type="button">Copy</button>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="clipboard-text-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="clipboard-text-guidance">Copy exactly what is shown</h2></div></div>${guidanceList(["Do not silently normalize or transform the copied value.", "Announce success without moving focus.", "Use a code block when the content is multiline."])}</section>`,

  "primitive-code-highlighted": () =>
    `${pageIntro("Component", "Code Highlighted", "A structured code surface for already-tokenized syntax, with language context and horizontal overflow.")}
    <section data-section-kind="preview" aria-labelledby="code-highlighted-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="code-highlighted-preview">Tokenized source</h2></div><span class="oc-pill">.oc-code-highlighted</span></div>
      <div class="specimen-frame"><div class="oc-code-highlighted"><div class="oc-code-highlighted-header"><span>css</span><span>components.css</span></div><pre><code><span class="oc-code-token-comment">/* Shared action */</span>\n<span class="oc-code-token-keyword">.oc-button</span> {\n  color: <span class="oc-code-token-string">var(--oc-text-primary)</span>;\n}</code></pre></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="code-highlighted-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="code-highlighted-markup">Supply semantic token spans</h2></div></div>${codeBlock(`<div class="oc-code-highlighted">\n  <div class="oc-code-highlighted-header">css</div>\n  <pre><code>Tokenized source</code></pre>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="code-highlighted-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="code-highlighted-guidance">Presentation is separate from parsing</h2></div></div>${guidanceList(["Tokenize and escape source before rendering it.", "Preserve horizontal scrolling instead of wrapping long source lines by default.", "Expose the language when it helps readers interpret the sample."])}</section>`,

  "primitive-collapsible": () =>
    `${pageIntro("Component", "Collapsible", "A native disclosure for optional supporting content that keeps its summary visible at all times.")}
    <section data-section-kind="preview" aria-labelledby="collapsible-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="collapsible-preview">Optional detail</h2></div><span class="oc-pill">.oc-collapsible</span></div>
      <div class="specimen-frame"><details class="oc-collapsible" open><summary class="oc-collapsible-summary">Package requirements</summary><div class="oc-collapsible-content"><p>Import tokens before components and set the theme on the application root.</p></div></details></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="collapsible-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="collapsible-markup">Use details and summary</h2></div></div>${codeBlock(`<details class="oc-collapsible">\n  <summary class="oc-collapsible-summary">Package requirements</summary>\n  <div class="oc-collapsible-content">Supporting content</div>\n</details>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="collapsible-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="collapsible-guidance">Hide supporting detail, not essential decisions</h2></div></div>${guidanceList(["Write a summary that remains meaningful while collapsed.", "Do not place required form fields or critical errors inside a closed disclosure.", "Use multiple independent disclosures instead of recreating exclusive tabs."])}</section>`,

  "primitive-combobox": () =>
    `${pageIntro("Component", "Combobox", "A searchable single-selection control with explicit listbox semantics and complete keyboard navigation.")}
    <section data-section-kind="preview" aria-labelledby="combobox-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="combobox-preview">Search and select</h2></div><span class="oc-pill">.oc-combobox</span></div>
      <div class="specimen-frame"><div class="oc-combobox" data-combobox><div class="oc-combobox-control"><input class="oc-input" type="text" role="combobox" aria-label="Component" aria-autocomplete="list" aria-expanded="false" aria-controls="component-listbox" placeholder="Choose a component…" autocomplete="off" /><button class="oc-combobox-toggle" type="button" aria-label="Toggle options" aria-expanded="false" data-combobox-toggle></button></div><ul class="oc-combobox-listbox" id="component-listbox" role="listbox" hidden><li class="oc-combobox-option" id="component-action" role="option" aria-selected="false">Action</li><li class="oc-combobox-option" id="component-button" role="option" aria-selected="false">Button</li><li class="oc-combobox-option" id="component-card" role="option" aria-selected="false">Card</li><li class="oc-combobox-option" id="component-input" role="option" aria-selected="false">Input</li></ul></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="combobox-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="combobox-markup">Connect combobox and listbox</h2></div></div>${codeBlock(`<div class="oc-combobox">\n  <div class="oc-combobox-control">\n    <input role="combobox" aria-autocomplete="list" aria-controls="options" />\n  </div>\n  <ul id="options" role="listbox">\n    <li role="option">Action</li>\n  </ul>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="combobox-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="combobox-guidance">Use search only when it reduces effort</h2></div></div>${guidanceList(["Use Select for short, fixed lists.", "Keep typed text and selected value synchronized.", "Support arrow keys, Enter, Escape, and a visible active option."])}</section>`,

  "primitive-command-palette": () =>
    `${pageIntro("Component", "Command Palette", "A focused dialog for finding and invoking application actions without reproducing the full navigation.")}
    <section data-section-kind="preview" aria-labelledby="command-palette-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="command-palette-preview">Find an action</h2></div><span class="oc-pill">.oc-command-palette</span></div>
      <div class="specimen-frame"><div data-command-palette><button class="oc-button oc-button-secondary" type="button" data-command-palette-open>Open command palette</button><dialog class="oc-command-palette" aria-label="Commands"><div class="oc-command-palette-search"><input type="search" aria-label="Search commands" placeholder="Search commands…" data-command-palette-input /><kbd>Esc</kbd></div><ul class="oc-command-palette-list"><li><button class="oc-command-palette-item" type="button" data-command-palette-item><span>Open components</span><kbd>G C</kbd></button></li><li><button class="oc-command-palette-item" type="button" data-command-palette-item><span>Inspect design tokens</span><kbd>G T</kbd></button></li><li><button class="oc-command-palette-item" type="button" data-command-palette-item><span>Switch theme</span></button></li></ul></dialog></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="command-palette-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="command-palette-markup">Use a modal dialog</h2></div></div>${codeBlock(`<dialog class="oc-command-palette" aria-label="Commands">\n  <div class="oc-command-palette-search">\n    <input type="search" aria-label="Search commands" />\n  </div>\n  <ul class="oc-command-palette-list">\n    <li><button class="oc-command-palette-item">Open components</button></li>\n  </ul>\n</dialog>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="command-palette-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="command-palette-guidance">Expose actions, not another sitemap</h2></div></div>${guidanceList(["Prioritize frequent actions and direct destinations.", "Keep keyboard shortcuts visible when they are stable.", "Return focus to the trigger after the dialog closes."])}</section>`,

  "primitive-date-picker": () =>
    `${pageIntro("Component", "Date Picker", "A labeled native calendar field that preserves locale, keyboard, validation, and mobile picker behavior.")}
    <section data-section-kind="preview" aria-labelledby="date-picker-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="date-picker-preview">Choose a calendar date</h2></div><span class="oc-pill">.oc-date-picker</span></div>
      <div class="specimen-frame"><label class="oc-date-picker"><span class="oc-field-label">Review date</span><input class="oc-date-input" type="date" value="2026-07-12" min="2026-07-01" /><span class="oc-field-message">Dates use the locale configured by the browser.</span></label></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="date-picker-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="date-picker-markup">Use the native date input</h2></div></div>${codeBlock(`<label class="oc-date-picker">\n  <span class="oc-field-label">Review date</span>\n  <input class="oc-date-input" type="date" />\n</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="date-picker-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="date-picker-guidance">Ask only for precision you need</h2></div></div>${guidanceList(["Use a plain text field when the value is not a calendar date.", "Expose minimum and maximum dates through native attributes.", "Show validation next to the field without replacing the browser picker."])}</section>`,

  "primitive-dialog": () =>
    `${pageIntro("Component", "Dialog", "A native modal surface for a focused decision or short workflow that temporarily blocks the underlying page.")}
    <section data-section-kind="preview" aria-labelledby="dialog-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="dialog-preview">Focused decision</h2></div><span class="oc-pill">.oc-dialog</span></div>
      <div class="specimen-frame"><div data-dialog><button class="oc-button oc-button-secondary" type="button" data-dialog-open>Open dialog</button><dialog class="oc-dialog" aria-labelledby="component-dialog-title"><header class="oc-dialog-header"><h3 class="oc-dialog-title" id="component-dialog-title">Apply changes?</h3><button class="oc-dialog-close" type="button" aria-label="Close dialog" data-dialog-close>×</button></header><div class="oc-dialog-body"><p>The updated settings will be applied to this workspace.</p></div><footer class="oc-dialog-footer"><button class="oc-button oc-button-ghost" type="button" data-dialog-close>Cancel</button><button class="oc-button oc-button-primary" type="button" data-dialog-close>Apply</button></footer></dialog></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="dialog-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="dialog-markup">Label the native dialog</h2></div></div>${codeBlock(`<dialog class="oc-dialog" aria-labelledby="dialog-title">\n  <header class="oc-dialog-header">\n    <h2 class="oc-dialog-title" id="dialog-title">Apply changes?</h2>\n  </header>\n  <div class="oc-dialog-body">Dialog content</div>\n</dialog>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="dialog-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="dialog-guidance">Interrupt only for a focused task</h2></div></div>${guidanceList(["Use a page or inline disclosure for long workflows.", "Give the dialog an accessible title.", "Return focus to the trigger after closing."])}</section>`,

  "primitive-dropdown": () =>
    `${pageIntro("Component", "Dropdown", "A compact contextual menu for a short list of actions associated with one trigger.")}
    <section data-section-kind="preview" aria-labelledby="dropdown-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="dropdown-preview">Contextual actions</h2></div><span class="oc-pill">.oc-dropdown</span></div>
      <div class="specimen-frame"><div class="oc-dropdown" data-dropdown><button class="oc-button oc-button-secondary" type="button" aria-haspopup="menu" aria-expanded="false" data-dropdown-trigger>More actions</button><ul class="oc-dropdown-menu" role="menu" hidden><li><button class="oc-dropdown-item" type="button" role="menuitem">Duplicate</button></li><li><button class="oc-dropdown-item" type="button" role="menuitem">Archive</button></li><li class="oc-dropdown-separator" role="separator"></li><li><button class="oc-dropdown-item oc-dropdown-item-danger" type="button" role="menuitem">Delete</button></li></ul></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="dropdown-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="dropdown-markup">Connect trigger and menu</h2></div></div>${codeBlock(`<div class="oc-dropdown">\n  <button aria-haspopup="menu" aria-expanded="false">More actions</button>\n  <ul class="oc-dropdown-menu" role="menu">\n    <li><button class="oc-dropdown-item" role="menuitem">Duplicate</button></li>\n  </ul>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="dropdown-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="dropdown-guidance">Keep the menu short and contextual</h2></div></div>${guidanceList(["Use visible buttons for frequent or primary actions.", "Close on selection, Escape, and outside interaction.", "Separate destructive actions from routine actions."])}</section>`,

  "primitive-empty": () =>
    `${pageIntro("Component", "Empty", "A purposeful no-content state that explains what is absent and offers the most useful next action.")}
    <section data-section-kind="preview" aria-labelledby="empty-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="empty-preview">No saved views</h2></div><span class="oc-pill">.oc-empty</span></div>
      <div class="specimen-frame"><div class="oc-empty"><div class="oc-empty-content"><span class="oc-empty-icon" aria-hidden="true">◇</span><h3 class="oc-empty-title">No saved views</h3><p class="oc-empty-description">Save a filtered view to return to the same component set later.</p><div class="oc-empty-actions"><button class="oc-button oc-button-primary" type="button">Create view</button></div></div></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="empty-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="empty-markup">Name the absence and next step</h2></div></div>${codeBlock(`<div class="oc-empty">\n  <div class="oc-empty-content">\n    <h2 class="oc-empty-title">No saved views</h2>\n    <p class="oc-empty-description">Save a filtered view to return later.</p>\n    <div class="oc-empty-actions"><button>Create view</button></div>\n  </div>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="empty-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="empty-guidance">The state must help users continue</h2></div></div>${guidanceList(["Distinguish an empty collection from an error or loading state.", "Explain why content is absent only when it is not obvious.", "Offer one primary recovery or creation action."])}</section>`,

  "primitive-flow": () =>
    `${pageIntro("Component", "Flow", "A horizontally readable sequence for a small number of ordered steps or dependencies.")}
    <section data-section-kind="preview" aria-labelledby="flow-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="flow-preview">Release path</h2></div><span class="oc-pill">.oc-flow</span></div>
      <div class="specimen-frame"><div class="oc-flow" aria-label="Release path"><div class="oc-flow-step"><strong>Draft</strong><span>Prepare changes</span></div><span class="oc-flow-connector" aria-hidden="true"></span><div class="oc-flow-step" aria-current="step"><strong>Review</strong><span>Validate contract</span></div><span class="oc-flow-connector" aria-hidden="true"></span><div class="oc-flow-step"><strong>Publish</strong><span>Tag release</span></div></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="flow-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="flow-markup">Mark the current step</h2></div></div>${codeBlock(`<div class="oc-flow" aria-label="Release path">\n  <div class="oc-flow-step">Draft</div>\n  <span class="oc-flow-connector" aria-hidden="true"></span>\n  <div class="oc-flow-step" aria-current="step">Review</div>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="flow-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="flow-guidance">Keep the sequence finite and legible</h2></div></div>${guidanceList(["Use ordered content rather than Flow for long procedural documentation.", "Name each step with a concrete state or action.", "Allow horizontal scrolling instead of compressing labels below readability."])}</section>`,

  "primitive-grid": () =>
    `${pageIntro("Component", "Grid", "A small set of equal-width responsive grid primitives for consumer-owned content.")}
    <section data-section-kind="preview" aria-labelledby="grid-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="grid-preview">Three equal columns</h2></div><span class="oc-pill">.oc-grid</span></div>
      <div class="specimen-frame"><div class="oc-grid oc-grid-3"><article class="oc-card oc-grid-item"><strong>Foundations</strong></article><article class="oc-card oc-grid-item"><strong>Components</strong></article><article class="oc-card oc-grid-item"><strong>Resources</strong></article></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="grid-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="grid-markup">Choose the intended column count</h2></div></div>${codeBlock(`<div class="oc-grid oc-grid-3">\n  <article class="oc-grid-item">First</article>\n  <article class="oc-grid-item">Second</article>\n  <article class="oc-grid-item">Third</article>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="grid-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="grid-guidance">Use grid for repeated peers</h2></div></div>${guidanceList(["Use intrinsic page layout when items are not peers.", "Keep every grid child min-width zero so long content can truncate or wrap.", "All fixed column variants collapse to one column on narrow screens."])}</section>`,

  "primitive-layer-card": () =>
    `${pageIntro("Component", "Layer Card", "A stacked card surface for representing a grouped resource or layered object without adding nested chrome.")}
    <section data-section-kind="preview" aria-labelledby="layer-card-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="layer-card-preview">Grouped resource</h2></div><span class="oc-pill">.oc-layer-card</span></div>
      <div class="specimen-frame"><article class="oc-layer-card"><h3 class="oc-layer-card-title">Component collection</h3><p class="oc-layer-card-copy">Twelve shared controls organized under one contract.</p></article></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="layer-card-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="layer-card-markup">Keep the stack decorative</h2></div></div>${codeBlock(`<article class="oc-layer-card">\n  <h2 class="oc-layer-card-title">Component collection</h2>\n  <p class="oc-layer-card-copy">Twelve shared controls.</p>\n</article>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="layer-card-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="layer-card-guidance">Depth must communicate grouping</h2></div></div>${guidanceList(["Use Card when there is no meaningful stacked relationship.", "Keep the pseudo-layers decorative and hidden from assistive technology.", "Do not nest additional cards solely to increase visual depth."])}</section>`,

  "primitive-link": () =>
    `${pageIntro("Component", "Link", "A navigation primitive for inline references, muted secondary destinations, and standalone directional links.")}
    <section data-section-kind="preview" aria-labelledby="link-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="link-preview">Navigation roles</h2></div><span class="oc-pill">.oc-link</span></div>
      <div class="specimen-frame"><div class="primitive-control-row"><a class="oc-link" href="../../../foundations/">Inline link</a><a class="oc-link oc-link-muted" href="../../../resources/">Muted link</a><a class="oc-link oc-link-standalone" href="../">Browse components</a></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="link-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="link-markup">Use anchors for destinations</h2></div></div>${codeBlock(`<a class="oc-link" href="/foundations/">Foundations</a>\n<a class="oc-link oc-link-standalone" href="/components/">Browse components</a>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="link-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="link-guidance">Navigation remains recognizable</h2></div></div>${guidanceList(["Use Button for actions that do not navigate.", "Keep inline links underlined in prose.", "Use aria-disabled only when a destination must remain visible but unavailable."])}</section>`,

  "primitive-loader": () =>
    `${pageIntro("Component", "Loader", "An indeterminate progress indicator with a visible or assistive-technology label.")}
    <section data-section-kind="preview" aria-labelledby="loader-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="loader-preview">Work in progress</h2></div><span class="oc-pill">.oc-loader</span></div>
      <div class="specimen-frame"><div class="primitive-control-row"><span class="oc-loader oc-loader-sm" role="status"><span class="oc-loader-spinner" aria-hidden="true"></span><span>Loading</span></span><span class="oc-loader" role="status"><span class="oc-loader-spinner" aria-hidden="true"></span><span>Syncing components</span></span><span class="oc-loader oc-loader-lg" role="status"><span class="oc-loader-spinner" aria-hidden="true"></span><span class="visually-hidden">Loading</span></span></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="loader-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="loader-markup">Announce the operation</h2></div></div>${codeBlock(`<span class="oc-loader" role="status">\n  <span class="oc-loader-spinner" aria-hidden="true"></span>\n  <span>Syncing components</span>\n</span>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="loader-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="loader-guidance">Use only while duration is unknown</h2></div></div>${guidanceList(["Use Meter or progress when completion can be measured.", "Keep the current content visible when background work does not block it.", "Provide a status label even when it is visually hidden."])}</section>`,

  "primitive-menu-bar": () =>
    `${pageIntro("Component", "Menu Bar", "A horizontal group of application command menus for dense, recurring workflows.")}
    <section data-section-kind="preview" aria-labelledby="menu-bar-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="menu-bar-preview">Grouped commands</h2></div><span class="oc-pill">.oc-menubar</span></div>
      <div class="specimen-frame"><div class="oc-menubar" role="menubar" aria-label="Editor commands"><div class="oc-dropdown" data-dropdown><button class="oc-menubar-item" type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-dropdown-trigger>File</button><ul class="oc-dropdown-menu" role="menu" hidden><li><button class="oc-dropdown-item" type="button" role="menuitem">New</button></li><li><button class="oc-dropdown-item" type="button" role="menuitem">Export</button></li></ul></div><div class="oc-dropdown" data-dropdown><button class="oc-menubar-item" type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-dropdown-trigger>Edit</button><ul class="oc-dropdown-menu" role="menu" hidden><li><button class="oc-dropdown-item" type="button" role="menuitem">Undo</button></li><li><button class="oc-dropdown-item" type="button" role="menuitem">Redo</button></li></ul></div><button class="oc-menubar-item" type="button" role="menuitem">View</button></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="menu-bar-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="menu-bar-markup">Group top-level commands</h2></div></div>${codeBlock(`<div class="oc-menubar" role="menubar" aria-label="Editor commands">\n  <button class="oc-menubar-item" role="menuitem" aria-haspopup="menu">File</button>\n  <button class="oc-menubar-item" role="menuitem" aria-haspopup="menu">Edit</button>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="menu-bar-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="menu-bar-guidance">Reserve it for application-scale command density</h2></div></div>${guidanceList(["Use Toolbar for direct actions that do not open menus.", "Keep top-level labels stable and short.", "Support directional keyboard movement in the consuming application."])}</section>`,

  "primitive-meter": () =>
    `${pageIntro("Component", "Meter", "A native measurement within a known range, suitable for capacity, quality, or score.")}
    <section data-section-kind="preview" aria-labelledby="meter-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="meter-preview">Storage used</h2></div><span class="oc-pill">.oc-meter</span></div>
      <div class="specimen-frame"><div class="oc-meter"><div class="oc-meter-header"><strong>Storage used</strong><span>64%</span></div><meter class="oc-meter-value" min="0" max="100" value="64">64%</meter><p class="oc-meter-caption">6.4 GB of 10 GB</p></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="meter-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="meter-markup">Expose the numeric range</h2></div></div>${codeBlock(`<div class="oc-meter">\n  <div class="oc-meter-header"><strong>Storage used</strong><span>64%</span></div>\n  <meter class="oc-meter-value" min="0" max="100" value="64">64%</meter>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="meter-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="meter-guidance">Measure state, not task completion</h2></div></div>${guidanceList(["Use progress for an operation moving toward completion.", "Keep the numeric value visible when exactness matters.", "Set low, high, and optimum when the range has qualitative thresholds."])}</section>`,

  "primitive-pagination": () =>
    `${pageIntro("Component", "Pagination", "A navigation control for moving across stable, addressable pages in a larger collection.")}
    <section data-section-kind="preview" aria-labelledby="pagination-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="pagination-preview">Page navigation</h2></div><span class="oc-pill">.oc-pagination</span></div>
      <div class="specimen-frame"><nav class="oc-pagination" aria-label="Results pages"><a class="oc-pagination-link" href="#" aria-label="Previous page">←</a><ol class="oc-pagination-list"><li><a class="oc-pagination-link" href="#">1</a></li><li><a class="oc-pagination-link" href="#" aria-current="page">2</a></li><li><a class="oc-pagination-link" href="#">3</a></li><li><span class="oc-pagination-ellipsis" aria-hidden="true">…</span></li><li><a class="oc-pagination-link" href="#">12</a></li></ol><a class="oc-pagination-link" href="#" aria-label="Next page">→</a></nav></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="pagination-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="pagination-markup">Mark the current page</h2></div></div>${codeBlock(`<nav class="oc-pagination" aria-label="Results pages">\n  <ol class="oc-pagination-list">\n    <li><a class="oc-pagination-link" href="?page=1">1</a></li>\n    <li><a class="oc-pagination-link" href="?page=2" aria-current="page">2</a></li>\n  </ol>\n</nav>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="pagination-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="pagination-guidance">Keep pages addressable</h2></div></div>${guidanceList(["Use Load more for a continuous feed without stable page destinations.", "Preserve the current page in the URL.", "Give previous and next controls explicit accessible names."])}</section>`,

  "primitive-popover": () =>
    `${pageIntro("Component", "Popover", "A lightweight anchored surface for supporting information or a short contextual interaction.")}
    <section data-section-kind="preview" aria-labelledby="popover-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="popover-preview">Supporting context</h2></div><span class="oc-pill">.oc-popover</span></div>
      <div class="specimen-frame"><button class="oc-button oc-button-secondary" type="button" popovertarget="component-popover">Show details</button><div class="oc-popover" id="component-popover" popover><h3 class="oc-popover-title">Component status</h3><p>This component is part of the canonical web contract.</p><div class="oc-popover-actions"><button class="oc-button oc-button-sm oc-button-primary" type="button" popovertarget="component-popover" popovertargetaction="hide">Done</button></div></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="popover-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="popover-markup">Connect the native target</h2></div></div>${codeBlock(`<button popovertarget="details">Show details</button>\n<div class="oc-popover" id="details" popover>\n  Supporting content\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="popover-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="popover-guidance">Keep context lightweight</h2></div></div>${guidanceList(["Use Dialog when the task must block the underlying page.", "Keep the popover associated with one clear trigger.", "Do not place long workflows or critical confirmation inside it."])}</section>`,

  "primitive-provider-logo": () =>
    `${pageIntro("Component", "Provider Logo", "A neutral lockup for an integration mark and provider name, with consumer-owned brand assets.")}
    <section data-section-kind="preview" aria-labelledby="provider-logo-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="provider-logo-preview">Integration identity</h2></div><span class="oc-pill">.oc-provider-logo</span></div>
      <div class="specimen-frame"><div class="primitive-control-row"><span class="oc-provider-logo"><span class="oc-provider-logo-mark" aria-hidden="true">OC</span><span>OpenClaw</span></span><span class="oc-provider-logo oc-provider-logo-muted"><span class="oc-provider-logo-mark" aria-hidden="true">API</span><span>Provider</span></span></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="provider-logo-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="provider-logo-markup">Bring the asset from the consumer</h2></div></div>${codeBlock(`<span class="oc-provider-logo">\n  <span class="oc-provider-logo-mark" aria-hidden="true">\n    <img src="provider.svg" alt="" />\n  </span>\n  <span>Provider</span>\n</span>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="provider-logo-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="provider-logo-guidance">Preserve source brand rules</h2></div></div>${guidanceList(["Keep trademarked artwork in the consumer repository.", "Use an empty image alt when the adjacent name repeats the identity.", "Do not recolor multicolor marks unless the provider explicitly permits it."])}</section>`,

  "primitive-hero": () =>
    `${pageIntro("Interface primitive", "Hero", "A centered introduction with explicit title and supporting-copy roles.")}
    <section data-section-kind="preview" aria-labelledby="hero-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="hero-preview">Default composition</h2></div><span class="oc-pill">.oc-hero</span></div>
      <div class="specimen-frame oc-app-surface"><div class="oc-hero"><h3 class="oc-hero-title">Build where your work already lives.</h3><p class="oc-hero-lede">A shared visual introduction with consumer-owned content and actions.</p></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="hero-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="hero-markup">Three explicit roles</h2></div></div>${codeBlock(`<div class="oc-hero">\n  <h1 class="oc-hero-title">Build with OpenClaw</h1>\n  <p class="oc-hero-lede">Supporting copy.</p>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="hero-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="hero-guidance">Keep the introduction literal</h2></div></div>${guidanceList(["Use one clear title and one supporting lede.", "Keep actions and media consumer-owned.", "The exported responsive rule reduces title size below 42rem."])}</section>`,

  "primitive-section": () =>
    `${pageIntro("Interface primitive", "Section", "A framework-neutral structure for headings, supporting copy, and an optional adjacent action.")}
    <section data-section-kind="preview" aria-labelledby="section-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="section-preview">Heading with action</h2></div><span class="oc-pill">.oc-section</span></div>
      <div class="specimen-frame oc-app-surface"><section class="oc-section"><header class="oc-section-header"><div class="oc-section-heading"><p class="oc-eyebrow">Featured</p><h3 class="oc-section-title">Build with OpenClaw</h3><p class="oc-section-copy">Shared hierarchy without owning the page or its content.</p></div><a class="oc-action oc-action-secondary" href="#section-guidance">Browse</a></header></section></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="section-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="section-markup">Composable heading structure</h2></div></div>${codeBlock(`<section class="oc-section">\n  <header class="oc-section-header">\n    <div class="oc-section-heading">\n      <p class="oc-eyebrow">Featured</p>\n      <h2 class="oc-section-title">Build with OpenClaw</h2>\n      <p class="oc-section-copy">Supporting copy.</p>\n    </div>\n  </header>\n</section>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="section-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="section-guidance">Responsive by structure</h2></div></div>${guidanceList(["Keep the semantic heading level appropriate to the page.", "Use the adjacent action only when the section has a clear next step.", "Below 42rem, the header stacks and aligns to the start."])}</section>`,

  "primitive-card": () =>
    `${pageIntro("Interface primitive", "Card", "A shared surface with an opt-in interactive state for whole-card actions.")}
    <section data-section-kind="preview" aria-labelledby="card-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="card-preview">Static and interactive</h2></div><span class="oc-pill">.oc-card</span></div>
      <div class="specimen-frame primitive-card-grid oc-app-surface"><article class="oc-card primitive-card-demo"><strong>Static surface</strong><p>Use for a genuinely grouped content unit.</p></article><a class="oc-card oc-card-interactive primitive-card-demo" href="#card-guidance"><strong>Interactive surface</strong><p>Hover, focus, and press use the exported state contract.</p></a></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="card-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="card-markup">Interaction is opt-in</h2></div></div>${codeBlock(`<a class="oc-card oc-card-interactive" href="/destination">\n  Interactive card content\n</a>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="card-guidance"><div class="section-heading"><div><p class="eyebrow">States</p><h2 id="card-guidance">Hover, focus, and active</h2></div></div>${guidanceList(["Use the interactive class only when the whole surface acts as one control.", "The consumer chooses the correct semantic element and accessible name.", "Reduced-motion mode removes the interactive transform."])}</section>`,

  "primitive-action": () =>
    `${pageIntro("Interface primitive", "Action", "Shared action hierarchy for buttons and links, including a compact icon-only form.")}
    <section data-section-kind="preview" aria-labelledby="action-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="action-preview">Exported variants</h2></div><span class="oc-pill">.oc-action</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-row"><button class="oc-action oc-action-primary" type="button">Primary action</button><button class="oc-action oc-action-secondary" type="button">Secondary</button><button class="oc-action oc-action-ghost" type="button">Ghost</button><button class="oc-action oc-action-icon" type="button" aria-label="Add item">+</button></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="action-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="action-markup">Variant classes express hierarchy</h2></div></div>${codeBlock(`<button class="oc-action oc-action-primary" type="button">\n  Primary action\n</button>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="action-states"><div class="section-heading"><div><p class="eyebrow">States</p><h2 id="action-states">Responsive interaction feedback</h2></div></div>${guidanceList(["Primary, secondary, and ghost variants cover visual hierarchy.", "Hover, focus-visible, and active states are exported.", "Icon-only actions require a consumer-provided accessible name.", "Disabled and loading behavior remain consumer-owned until canonically implemented."])}</section>`,

  "primitive-segmented": () =>
    `${pageIntro("Interface primitive", "Segmented control", "A compact visual group for selecting among peer views or modes.")}
    <section data-section-kind="preview" aria-labelledby="segmented-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="segmented-preview">Pressed and selected states</h2></div><span class="oc-pill">.oc-segmented</span></div>
      <div class="specimen-frame primitive-row oc-app-surface"><div class="oc-segmented" aria-label="Preview mode"><button class="oc-segmented-item" type="button" aria-pressed="true">Preview</button><button class="oc-segmented-item" type="button" aria-pressed="false">Code</button></div><div class="oc-segmented" role="tablist" aria-label="Reference area"><button class="oc-segmented-item" role="tab" aria-selected="true">Tokens</button><button class="oc-segmented-item" role="tab" aria-selected="false">Type</button></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="segmented-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="segmented-markup">State follows interaction semantics</h2></div></div>${codeBlock(`<div class="oc-segmented" aria-label="Display mode">\n  <button class="oc-segmented-item" aria-pressed="true">Preview</button>\n  <button class="oc-segmented-item" aria-pressed="false">Code</button>\n</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="segmented-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="segmented-guidance">Consumer-owned selection</h2></div></div>${guidanceList(["Use aria-pressed for toggle buttons or aria-selected for tabs.", "Keep labels short and options structurally equivalent.", "Selection behavior and keyboard management remain consumer-owned."])}</section>`,

  "primitive-pill": () =>
    `${pageIntro("Interface primitive", "Pill", "A compact, non-interactive label for short metadata.")}
    <section data-section-kind="preview" aria-labelledby="pill-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="pill-preview">Short metadata</h2></div><span class="oc-pill">.oc-pill</span></div>
      <div class="specimen-frame primitive-row oc-app-surface"><span class="oc-pill">Stable</span><span class="oc-pill">Official</span><span class="oc-pill">v0.1.0</span></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="pill-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="pill-markup">Inline label</h2></div></div>${codeBlock(`<span class="oc-pill">Stable</span>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="pill-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="pill-guidance">Metadata, not interaction</h2></div></div>${guidanceList(["Keep the label short enough to scan inline.", "Use status tokens when the label communicates status.", "Do not style a button as a pill without a canonical interactive contract."])}</section>`,

  "primitive-input": () =>
    `${pageIntro("Interface primitive", "Input", "A labeled text-entry control with canonical focus, helper, error, and disabled states.")}
    <section data-section-kind="preview" aria-labelledby="input-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="input-preview">Field states</h2></div><span class="oc-pill">.oc-input</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-input-grid"><label class="oc-field"><span class="oc-field-label">Skill name</span><input class="oc-input" type="text" placeholder="Search by name" /><span class="oc-field-message">Use a clear, recognizable name.</span></label><label class="oc-field"><span class="oc-field-label">Repository URL</span><input class="oc-input" type="url" value="not-a-url" aria-invalid="true" aria-describedby="input-error" /><span class="oc-field-message" id="input-error">Enter a valid URL.</span></label><label class="oc-field"><span class="oc-field-label">Owner</span><input class="oc-input" type="text" value="openclaw" disabled /></label></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="input-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="input-markup">Associate every field with its label</h2></div></div>${codeBlock(`<label class="oc-field">
  <span class="oc-field-label">Skill name</span>
  <input class="oc-input" type="text" aria-describedby="skill-name-help" />
  <span class="oc-field-message" id="skill-name-help">Use a recognizable name.</span>
</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="input-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="input-guidance">Behavior stays native</h2></div></div>${guidanceList(["Use the correct input type and autocomplete value.", "Keep a visible label; placeholders are examples, not labels.", "Connect helper and error messages with aria-describedby.", "Set aria-invalid only while the current value is invalid."])}</section>`,

  "primitive-checkbox": () =>
    `${pageIntro("Interface primitive", "Checkbox", "An independent binary choice that preserves native form and keyboard behavior.")}
    <section data-section-kind="preview" aria-labelledby="checkbox-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="checkbox-preview">Selection states</h2></div><span class="oc-pill">.oc-checkbox</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-checkbox-stack"><label class="oc-check"><input class="oc-checkbox" type="checkbox" checked /><span>Include verified publishers</span></label><label class="oc-check"><input class="oc-checkbox" type="checkbox" /><span>Show prerelease packages</span></label><label class="oc-check"><input class="oc-checkbox" type="checkbox" disabled /><span>Managed by organization</span></label></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="checkbox-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="checkbox-markup">Keep the input inside its label</h2></div></div>${codeBlock(`<label class="oc-check">
  <input class="oc-checkbox" type="checkbox" name="verified" />
  <span>Include verified publishers</span>
</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="checkbox-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="checkbox-guidance">One independent choice</h2></div></div>${guidanceList(["Use checkboxes when multiple options may be selected independently.", "Write a label that remains clear in checked and unchecked states.", "Use disabled only when the reason is evident nearby.", "Use radio buttons when exactly one option must be chosen."])}</section>`,

  "primitive-radio": () =>
    `${pageIntro("Interface primitive", "Radio", "A native single-choice control for a visible group of mutually exclusive options.")}
    <section data-section-kind="preview" aria-labelledby="radio-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="radio-preview">Single selection</h2></div><span class="oc-pill">.oc-radio</span></div>
      <div class="specimen-frame oc-app-surface"><fieldset class="oc-radio-group"><legend>Default visibility</legend><label class="oc-radio-option"><input class="oc-radio" type="radio" name="visibility-preview" checked /><span>Public</span></label><label class="oc-radio-option"><input class="oc-radio" type="radio" name="visibility-preview" /><span>Private</span></label><label class="oc-radio-option"><input class="oc-radio" type="radio" name="visibility-preview" disabled /><span>Organization only</span></label></fieldset></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="radio-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="radio-markup">Group related options in a fieldset</h2></div></div>${codeBlock(`<fieldset class="oc-radio-group">
  <legend>Default visibility</legend>
  <label class="oc-radio-option">
    <input class="oc-radio" type="radio" name="visibility" value="public" />
    <span>Public</span>
  </label>
</fieldset>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="radio-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="radio-guidance">Make the full set visible</h2></div></div>${guidanceList(["Use radio buttons when one option is required from a small visible set.", "Share one name across every option in the group.", "Use a fieldset and legend to provide the group name.", "Use Select when the option set is long or space is constrained."])}</section>`,

  "primitive-switch": () =>
    `${pageIntro("Interface primitive", "Switch", "An immediate binary setting that preserves native checkbox semantics and keyboard behavior.")}
    <section data-section-kind="preview" aria-labelledby="switch-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="switch-preview">Setting states</h2></div><span class="oc-pill">.oc-switch</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-checkbox-stack"><label class="oc-switch-label"><input class="oc-switch" type="checkbox" checked /><span>Automatic updates</span></label><label class="oc-switch-label"><input class="oc-switch" type="checkbox" /><span>Usage analytics</span></label><label class="oc-switch-label"><input class="oc-switch" type="checkbox" disabled /><span>Organization policy</span></label></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="switch-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="switch-markup">Use native checkbox semantics</h2></div></div>${codeBlock(`<label class="oc-switch-label">
  <input class="oc-switch" type="checkbox" name="automatic-updates" />
  <span>Automatic updates</span>
</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="switch-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="switch-guidance">Apply changes immediately</h2></div></div>${guidanceList(["Use a switch for a setting that takes effect immediately.", "Use a checkbox when the choice is submitted with a larger form.", "Write the label as the setting name, not as an action.", "Expose pending or failed persistence in the consuming application."])}</section>`,

  "primitive-select": () =>
    `${pageIntro("Interface primitive", "Select", "A native compact selector for choosing one value from a known list.")}
    <section data-section-kind="preview" aria-labelledby="select-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="select-preview">Native options</h2></div><span class="oc-pill">.oc-select</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-input-grid"><label class="oc-field"><span class="oc-field-label">Model</span><span class="oc-select-wrap"><select class="oc-select"><option>Claude Sonnet</option><option>GPT</option><option>Gemini</option></select></span><span class="oc-field-message">Choose the default model for new sessions.</span></label><label class="oc-field"><span class="oc-field-label">Managed setting</span><span class="oc-select-wrap"><select class="oc-select" disabled><option>Organization default</option></select></span></label></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="select-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="select-markup">Keep native select semantics</h2></div></div>${codeBlock(`<label class="oc-field">
  <span class="oc-field-label">Model</span>
  <span class="oc-select-wrap">
    <select class="oc-select" name="model">
      <option value="sonnet">Claude Sonnet</option>
      <option value="gpt">GPT</option>
    </select>
  </span>
</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="select-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="select-guidance">Use for compact known lists</h2></div></div>${guidanceList(["Use Select when one value is required from a compact known list.", "Keep the visible label outside the control.", "Order options predictably and avoid placeholder options that look selectable.", "Use Combobox when users need to filter a long list."])}</section>`,

  "primitive-input-area": () =>
    `${pageIntro("Interface primitive", "Input Area", "A multiline text-entry control with native resizing and canonical field states.")}
    <section data-section-kind="preview" aria-labelledby="input-area-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="input-area-preview">Multiline entry</h2></div><span class="oc-pill">.oc-textarea</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-input-grid"><label class="oc-field"><span class="oc-field-label">Instructions</span><textarea class="oc-textarea" placeholder="Describe the task and expected result"></textarea><span class="oc-field-message">Markdown is supported.</span></label><label class="oc-field"><span class="oc-field-label">Archived note</span><textarea class="oc-textarea" disabled>Read-only after archival.</textarea></label></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="input-area-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="input-area-markup">Use the shared field structure</h2></div></div>${codeBlock(`<label class="oc-field">
  <span class="oc-field-label">Instructions</span>
  <textarea class="oc-textarea" name="instructions"></textarea>
</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="input-area-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="input-area-guidance">Reserve space for meaningful text</h2></div></div>${guidanceList(["Use for content that naturally spans multiple lines.", "Keep vertical resizing available unless layout constraints make it unsafe.", "Provide character limits before submission when they exist.", "Use Input for short single-line values."])}</section>`,

  "primitive-label": () =>
    `${pageIntro("Interface primitive", "Label", "A visible field name with compact required, optional, and descriptive metadata.")}
    <section data-section-kind="preview" aria-labelledby="label-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="label-preview">Field naming</h2></div><span class="oc-pill">.oc-label</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-input-grid"><div><label class="oc-label" for="label-name">Skill name <span class="oc-label-required" aria-hidden="true">*</span></label><span class="oc-label-description">Visible to everyone who installs the skill.</span><input class="oc-input" id="label-name" type="text" required /></div><div><label class="oc-label" for="label-note">Internal note <span class="oc-label-optional">Optional</span></label><input class="oc-input" id="label-note" type="text" /></div></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="label-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="label-markup">Associate the label explicitly</h2></div></div>${codeBlock(`<label class="oc-label" for="skill-name">
  Skill name <span class="oc-label-required" aria-hidden="true">*</span>
</label>
<span class="oc-label-description">Visible to installers.</span>
<input class="oc-input" id="skill-name" required />`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="label-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="label-guidance">Name the value, not the control</h2></div></div>${guidanceList(["Keep labels visible and concise.", "Associate labels with controls using for and id or by nesting.", "Announce required state semantically with the required attribute.", "Use descriptions only when they clarify a non-obvious constraint."])}</section>`,

  "primitive-input-group": () =>
    `${pageIntro("Interface primitive", "Input Group", "A single text input with a non-editable prefix or suffix inside one focus boundary.")}
    <section data-section-kind="preview" aria-labelledby="input-group-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="input-group-preview">Prefix and suffix</h2></div><span class="oc-pill">.oc-input-group</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-input-grid"><label class="oc-field"><span class="oc-field-label">Repository</span><span class="oc-input-group"><span class="oc-input-group-addon">github.com/</span><input class="oc-input" type="text" value="openclaw/design-system" /></span></label><label class="oc-field"><span class="oc-field-label">Timeout</span><span class="oc-input-group"><input class="oc-input" type="number" value="30" /><span class="oc-input-group-addon">seconds</span></span></label></div></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="input-group-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="input-group-markup">One field, one focus boundary</h2></div></div>${codeBlock(`<label class="oc-field">
  <span class="oc-field-label">Repository</span>
  <span class="oc-input-group">
    <span class="oc-input-group-addon">github.com/</span>
    <input class="oc-input" type="text" />
  </span>
</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="input-group-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="input-group-guidance">Keep addons structural</h2></div></div>${guidanceList(["Use addons for fixed units, protocols, or namespaces.", "Do not put a second editable control inside the group.", "Keep the complete value understandable to assistive technology.", "Use a separate button when the adjacent element performs an action."])}</section>`,

  "primitive-sensitive-input": () =>
    `${pageIntro("Interface primitive", "Sensitive Input", "A password or secret field with an explicit consumer-owned visibility control.")}
    <section data-section-kind="preview" aria-labelledby="sensitive-input-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="sensitive-input-preview">Hidden and visible values</h2></div><span class="oc-pill">.oc-sensitive-input</span></div>
      <div class="specimen-frame oc-app-surface"><label class="oc-field primitive-input-grid"><span class="oc-field-label">API key</span><span class="oc-sensitive-input"><input class="oc-input" type="password" value="sk-openclaw-example" autocomplete="off" data-sensitive-value /><button class="oc-sensitive-toggle" type="button" aria-pressed="false" data-toggle-sensitive>Show</button></span><span class="oc-field-message">Stored encrypted after submission.</span></label></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="sensitive-input-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="sensitive-input-markup">Name the visibility action</h2></div></div>${codeBlock(`<label class="oc-field">
  <span class="oc-field-label">API key</span>
  <span class="oc-sensitive-input">
    <input class="oc-input" type="password" autocomplete="off" />
    <button class="oc-sensitive-toggle" type="button" aria-pressed="false">Show</button>
  </span>
</label>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="sensitive-input-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="sensitive-input-guidance">Protect secrets without blocking correction</h2></div></div>${guidanceList(["Use type=password for secrets and credentials.", "Let users reveal the current value with an explicitly named button.", "Do not copy or expose the value without a deliberate action.", "Keep storage, validation, and clipboard policy in the consumer."])}</section>`,

  "primitive-sidebar": () =>
    `${pageIntro("Component", "Sidebar", "Persistent navigation for a bounded product area, with explicit structure and current-page state.")}
    <section data-section-kind="preview" aria-labelledby="sidebar-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="sidebar-preview">Primary navigation rail</h2></div><span class="oc-pill">.oc-sidebar</span></div>
      <div class="specimen-frame"><aside class="oc-sidebar" aria-label="Workspace"><header class="oc-sidebar-header"><h3 class="oc-sidebar-title">Workspace</h3></header><nav class="oc-sidebar-nav"><a class="oc-sidebar-link" href="#sidebar-preview" aria-current="page"><span>Overview</span><span aria-hidden="true">01</span></a><a class="oc-sidebar-link" href="#sidebar-markup"><span>Activity</span><span aria-hidden="true">08</span></a><a class="oc-sidebar-link" href="#sidebar-guidance"><span>Settings</span></a></nav><footer class="oc-sidebar-footer">OpenClaw</footer></aside></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="sidebar-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="sidebar-markup">Keep the landmark explicit</h2></div></div>${codeBlock(`<aside class="oc-sidebar" aria-label="Workspace">
  <header class="oc-sidebar-header">
    <h2 class="oc-sidebar-title">Workspace</h2>
  </header>
  <nav class="oc-sidebar-nav">
    <a class="oc-sidebar-link" href="/" aria-current="page">Overview</a>
    <a class="oc-sidebar-link" href="/activity">Activity</a>
  </nav>
  <footer class="oc-sidebar-footer">OpenClaw</footer>
</aside>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="sidebar-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="sidebar-guidance">Navigation stays predictable</h2></div></div>${guidanceList(["Use one sidebar for one bounded navigation context.", "Name the landmark when more than one navigation region exists.", "Mark the current destination with aria-current=page.", "Keep disclosure state and responsive behavior in the consumer."])}</section>`,

  "primitive-skeleton-line": () =>
    `${pageIntro("Component", "Skeleton Line", "A quiet placeholder that reserves text rhythm while content is loading.")}
    <section data-section-kind="preview" aria-labelledby="skeleton-line-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="skeleton-line-preview">Preserve the final rhythm</h2></div><span class="oc-pill">.oc-skeleton-line</span></div><div class="specimen-frame"><div class="primitive-input-grid" aria-hidden="true"><span class="oc-skeleton-line"></span><span class="oc-skeleton-line"></span><span class="oc-skeleton-line oc-skeleton-line-short"></span></div><span class="sr-only">Content is loading</span></div></section>
    <section data-section-kind="markup" aria-labelledby="skeleton-line-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="skeleton-line-markup">Hide visual placeholders</h2></div></div>${codeBlock(`<div aria-hidden="true">
  <span class="oc-skeleton-line"></span>
  <span class="oc-skeleton-line oc-skeleton-line-short"></span>
</div>
<span class="sr-only">Content is loading</span>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="skeleton-line-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="skeleton-line-guidance">Approximate content, not decoration</h2></div></div>${guidanceList(["Match the number and width of lines to the expected content.", "Hide decorative placeholders from assistive technology.", "Expose loading state through adjacent status text or the owning region.", "Reduced-motion preferences remove the sweep animation."])}</section>`,

  "primitive-table": () =>
    `${pageIntro("Component", "Table", "Structured data for scanning and comparing consistent attributes across a set of records.")}
    <section data-section-kind="preview" aria-labelledby="table-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="table-preview">Comparable records</h2></div><span class="oc-pill">.oc-table</span></div><div class="specimen-frame"><div class="oc-table-wrap"><table class="oc-table"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Updated</th></tr></thead><tbody><tr><td>Button</td><td>Stable</td><td>Today</td></tr><tr><td>Dialog</td><td>Stable</td><td>Yesterday</td></tr><tr><td>Table</td><td>Draft</td><td>Now</td></tr></tbody></table></div></div></section>
    <section data-section-kind="markup" aria-labelledby="table-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="table-markup">Preserve native table semantics</h2></div></div>${codeBlock(`<div class="oc-table-wrap">
  <table class="oc-table">
    <thead><tr><th scope="col">Component</th><th scope="col">Status</th></tr></thead>
    <tbody><tr><td>Button</td><td>Stable</td></tr></tbody>
  </table>
</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="table-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="table-guidance">Use tables for comparison</h2></div></div>${guidanceList(["Use a table only when rows share comparable columns.", "Keep native table, header, and scope semantics.", "Wrap wide tables so narrow viewports scroll without clipping the page.", "Move row actions into a clearly labeled final column."])}</section>`,

  "primitive-table-of-contents": () =>
    `${pageIntro("Component", "Table of Contents", "Local navigation for a long page, showing its section structure and current reading position.")}
    <section data-section-kind="preview" aria-labelledby="table-of-contents-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="table-of-contents-preview">Page outline</h2></div><span class="oc-pill">.oc-table-of-contents</span></div><div class="specimen-frame"><nav class="oc-table-of-contents" aria-label="On this page"><p class="oc-table-of-contents-title">On this page</p><ol class="oc-table-of-contents-list"><li><a class="oc-table-of-contents-link" href="#table-of-contents-preview" aria-current="location">Overview</a></li><li><a class="oc-table-of-contents-link" href="#table-of-contents-markup">Markup</a></li><li><a class="oc-table-of-contents-link" href="#table-of-contents-guidance">Guidance</a></li></ol></nav></div></section>
    <section data-section-kind="markup" aria-labelledby="table-of-contents-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="table-of-contents-markup">Link directly to section IDs</h2></div></div>${codeBlock(`<nav class="oc-table-of-contents" aria-label="On this page">
  <p class="oc-table-of-contents-title">On this page</p>
  <ol class="oc-table-of-contents-list">
    <li><a class="oc-table-of-contents-link" href="#overview" aria-current="location">Overview</a></li>
    <li><a class="oc-table-of-contents-link" href="#usage">Usage</a></li>
  </ol>
</nav>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="table-of-contents-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="table-of-contents-guidance">Mirror the visible document</h2></div></div>${guidanceList(["Include only stable headings that help readers navigate.", "Keep link labels identical to their section headings.", "Use aria-current=location for the section in view.", "Let the consumer own scroll observation and responsive placement."])}</section>`,

  "primitive-tabs": () =>
    `${pageIntro("Component", "Tabs", "A keyboard-operable set of peer panels within one local context.")}
    <section data-section-kind="preview" aria-labelledby="tabs-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="tabs-preview">Switch local views</h2></div><span class="oc-pill">.oc-tabs</span></div><div class="specimen-frame"><div class="oc-tabs" data-tabs><div class="oc-tabs-list" role="tablist" aria-label="Component details"><button class="oc-tabs-trigger" id="tab-preview" role="tab" aria-selected="true" aria-controls="panel-preview">Preview</button><button class="oc-tabs-trigger" id="tab-code" role="tab" aria-selected="false" aria-controls="panel-code" tabindex="-1">Code</button><button class="oc-tabs-trigger" id="tab-guidance" role="tab" aria-selected="false" aria-controls="panel-guidance" tabindex="-1">Guidance</button></div><div class="oc-tabs-panel" id="panel-preview" role="tabpanel" aria-labelledby="tab-preview">Rendered component preview.</div><div class="oc-tabs-panel" id="panel-code" role="tabpanel" aria-labelledby="tab-code" hidden>Implementation markup.</div><div class="oc-tabs-panel" id="panel-guidance" role="tabpanel" aria-labelledby="tab-guidance" hidden>Usage guidance.</div></div></div></section>
    <section data-section-kind="markup" aria-labelledby="tabs-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="tabs-markup">Connect every tab to one panel</h2></div></div>${codeBlock(`<div class="oc-tabs" data-tabs>
  <div class="oc-tabs-list" role="tablist" aria-label="Details">
    <button class="oc-tabs-trigger" role="tab" aria-selected="true" aria-controls="preview">Preview</button>
    <button class="oc-tabs-trigger" role="tab" aria-selected="false" aria-controls="code" tabindex="-1">Code</button>
  </div>
  <div class="oc-tabs-panel" id="preview" role="tabpanel">Preview content</div>
  <div class="oc-tabs-panel" id="code" role="tabpanel" hidden>Code content</div>
</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="tabs-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="tabs-guidance">Keep views equivalent</h2></div></div>${guidanceList(["Use tabs for peer views, not sequential steps or primary navigation.", "Keep tab labels short and stable.", "Connect aria-controls and aria-labelledby in both directions.", "Arrow keys move between tabs while Tab moves into the active panel."])}</section>`,

  "primitive-text": () =>
    `${pageIntro("Component", "Text", "Semantic text roles for primary copy, supporting detail, metadata, and literal values.")}
    <section data-section-kind="preview" aria-labelledby="text-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="text-preview">Clear reading hierarchy</h2></div><span class="oc-pill">.oc-text</span></div><div class="specimen-frame primitive-input-grid"><p class="oc-text oc-text-balance">Primary text carries the information required to understand the current context.</p><p class="oc-text oc-text-secondary">Secondary text supports the primary message without competing with it.</p><p class="oc-text oc-text-muted oc-text-small">Muted text is reserved for metadata and low-priority detail.</p><p class="oc-text oc-text-mono oc-text-small">--oc-text-primary</p></div></section>
    <section data-section-kind="markup" aria-labelledby="text-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="text-markup">Combine roles deliberately</h2></div></div>${codeBlock(`<p class="oc-text">Primary information.</p>
<p class="oc-text oc-text-secondary">Supporting context.</p>
<p class="oc-text oc-text-muted oc-text-small">Metadata.</p>
<code class="oc-text oc-text-mono">--oc-text-primary</code>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="text-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="text-guidance">Hierarchy follows meaning</h2></div></div>${guidanceList(["Use primary text for information required to complete the current task.", "Use secondary and muted roles progressively, not decoratively.", "Keep semantic HTML independent from the visual role.", "Use monospace only for literals, code, identifiers, and data."])}</section>`,

  "primitive-toolbar": () =>
    `${pageIntro("Component", "Toolbar", "A compact group of direct, frequently used actions within one working context.")}
    <section data-section-kind="preview" aria-labelledby="toolbar-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="toolbar-preview">Direct formatting actions</h2></div><span class="oc-pill">.oc-toolbar</span></div><div class="specimen-frame"><div class="oc-toolbar" role="toolbar" aria-label="Text formatting"><div class="oc-toolbar-group"><button class="oc-toolbar-button" type="button" aria-label="Bold" aria-pressed="true"><strong>B</strong></button><button class="oc-toolbar-button" type="button" aria-label="Italic" aria-pressed="false"><em>I</em></button></div><div class="oc-toolbar-group"><button class="oc-toolbar-button" type="button">Link</button><button class="oc-toolbar-button" type="button">Code</button></div></div></div></section>
    <section data-section-kind="markup" aria-labelledby="toolbar-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="toolbar-markup">Group related controls</h2></div></div>${codeBlock(`<div class="oc-toolbar" role="toolbar" aria-label="Text formatting">
  <div class="oc-toolbar-group">
    <button class="oc-toolbar-button" type="button" aria-label="Bold" aria-pressed="true">B</button>
    <button class="oc-toolbar-button" type="button" aria-label="Italic" aria-pressed="false">I</button>
  </div>
</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="toolbar-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="toolbar-guidance">Keep frequent actions immediate</h2></div></div>${guidanceList(["Use a toolbar for direct actions, not controls that only open menus.", "Name icon-only buttons with accessible labels.", "Use aria-pressed for persistent toggle actions.", "Keep logical groups visible and preserve DOM order for keyboard use."])}</section>`,

  "primitive-toast": () =>
    `${pageIntro("Component", "Toast", "Temporary, non-blocking feedback for an action that has already completed or changed state.")}
    <section data-section-kind="preview" aria-labelledby="toast-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="toast-preview">Confirmation without interruption</h2></div><span class="oc-pill">.oc-toast</span></div><div class="specimen-frame"><div class="oc-toast-region" aria-label="Notifications"><div class="oc-toast" role="status"><div class="oc-toast-content"><p class="oc-toast-title">Changes saved</p><p class="oc-toast-message">The component reference is up to date.</p></div><button class="oc-toast-close" type="button" aria-label="Dismiss notification">×</button></div></div></div></section>
    <section data-section-kind="markup" aria-labelledby="toast-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="toast-markup">Announce status politely</h2></div></div>${codeBlock(`<div class="oc-toast-region" aria-label="Notifications">
  <div class="oc-toast" role="status">
    <div class="oc-toast-content">
      <p class="oc-toast-title">Changes saved</p>
      <p class="oc-toast-message">The reference is up to date.</p>
    </div>
    <button class="oc-toast-close" type="button" aria-label="Dismiss notification">×</button>
  </div>
</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="toast-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="toast-guidance">Do not hide required decisions</h2></div></div>${guidanceList(["Use status for neutral or successful feedback that does not require immediate action.", "Keep errors near the affected control when correction is required.", "Make dismissal optional unless the message persists.", "Let the consumer own timing, stacking, focus policy, and lifecycle."])}</section>`,

  "primitive-tooltip": () =>
    `${pageIntro("Component", "Tooltip", "A brief label or supporting description revealed by both pointer hover and keyboard focus.")}
    <section data-section-kind="preview" aria-labelledby="tooltip-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="tooltip-preview">Describe an icon action</h2></div><span class="oc-pill">.oc-tooltip</span></div><div class="specimen-frame"><span class="oc-tooltip"><button class="oc-button oc-button-secondary" type="button" aria-describedby="tooltip-copy">Copy</button><span class="oc-tooltip-content" id="tooltip-copy" role="tooltip">Copy component markup</span></span></div></section>
    <section data-section-kind="markup" aria-labelledby="tooltip-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="tooltip-markup">Connect trigger and description</h2></div></div>${codeBlock(`<span class="oc-tooltip">
  <button type="button" aria-describedby="copy-tooltip">Copy</button>
  <span class="oc-tooltip-content" id="copy-tooltip" role="tooltip">Copy component markup</span>
</span>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="tooltip-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="tooltip-guidance">Keep essential meaning visible</h2></div></div>${guidanceList(["Use tooltips for brief supporting labels, never required instructions.", "Reveal the same content on hover and keyboard focus.", "Connect the trigger with aria-describedby.", "Avoid interactive controls inside the tooltip."])}</section>`,

  "chart-base": () =>
    `${pageIntro("Charts", "Charts", "A semantic figure, title, caption, and responsive plot foundation for data visualization.")}
    <section data-section-kind="preview" aria-labelledby="chart-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="chart-preview">A readable plot foundation</h2></div><span class="oc-pill">.oc-chart</span></div><div class="specimen-frame"><figure class="oc-chart"><figcaption class="oc-chart-header"><p class="oc-chart-title">Component adoption</p><p class="oc-chart-caption">Last 6 weeks</p></figcaption><svg class="oc-chart-plot" viewBox="0 0 600 220" role="img" aria-label="Component adoption increased from 12 to 41 consumers over six weeks"><path class="oc-chart-grid-line" d="M0 55H600M0 110H600M0 165H600"/><path class="oc-chart-series" d="M20 180L130 154L240 142L350 105L460 88L580 35"/></svg></figure></div></section>
    <section data-section-kind="markup" aria-labelledby="chart-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="chart-markup">Start with a semantic figure</h2></div></div>${codeBlock(`<figure class="oc-chart">
  <figcaption class="oc-chart-header">
    <p class="oc-chart-title">Component adoption</p>
    <p class="oc-chart-caption">Last 6 weeks</p>
  </figcaption>
  <svg class="oc-chart-plot" viewBox="0 0 600 220" role="img" aria-label="Adoption increased over six weeks">
    <path class="oc-chart-series" d="M20 180L130 154L240 142L350 105L460 88L580 35" />
  </svg>
</figure>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="chart-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="chart-guidance">Data remains understandable</h2></div></div>${guidanceList(["Give every chart a visible title and concise time or scope caption.", "Provide an accessible text alternative that communicates the trend or comparison.", "Do not rely on color alone to distinguish series.", "Keep scales, data transformation, and interaction in the consumer."])}</section>`,

  "chart-colors": () =>
    `${pageIntro("Charts", "Colors", "A restrained semantic series palette built from existing accent and status roles.")}
    <section data-section-kind="preview" aria-labelledby="chart-colors-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="chart-colors-preview">Semantic series roles</h2></div><span class="oc-pill">.oc-chart-colors</span></div><div class="specimen-frame"><div class="oc-chart-colors"><span class="oc-chart-color oc-chart-color-primary">Primary</span><span class="oc-chart-color oc-chart-color-secondary">Secondary</span><span class="oc-chart-color oc-chart-color-success">Success</span><span class="oc-chart-color oc-chart-color-warning">Warning</span><span class="oc-chart-color oc-chart-color-error">Error</span></div></div></section>
    <section data-section-kind="markup" aria-labelledby="chart-colors-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="chart-colors-markup">Assign meaning before color</h2></div></div>${codeBlock(`<div class="oc-chart-colors">
  <span class="oc-chart-color oc-chart-color-primary">Primary</span>
  <span class="oc-chart-color oc-chart-color-secondary">Secondary</span>
  <span class="oc-chart-color oc-chart-color-success">Success</span>
</div>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="chart-colors-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="chart-colors-guidance">Color supports, never replaces</h2></div></div>${guidanceList(["Use primary and secondary accents for neutral series.", "Reserve status colors for data that genuinely carries the matching meaning.", "Pair color with labels, shapes, strokes, or patterns.", "Validate every series against both light and dark themes."])}</section>`,

  "chart-timeseries": () =>
    `${pageIntro("Charts", "Timeseries", "A temporal plot for reading change, direction, and comparison across a shared interval.")}
    <section data-section-kind="preview" aria-labelledby="timeseries-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="timeseries-preview">Compare change over time</h2></div><span class="oc-pill">.oc-timeseries</span></div><div class="specimen-frame"><figure class="oc-chart oc-timeseries"><figcaption class="oc-chart-header"><div><p class="oc-chart-title">Weekly runs</p><p class="oc-chart-caption">Successful and retried tasks</p></div><ul class="oc-timeseries-legend" aria-label="Series"><li><span class="oc-timeseries-key oc-timeseries-key-primary"></span>Successful</li><li><span class="oc-timeseries-key oc-timeseries-key-secondary"></span>Retried</li></ul></figcaption><svg class="oc-chart-plot" viewBox="0 0 640 240" role="img" aria-labelledby="timeseries-title timeseries-description"><title id="timeseries-title">Weekly task runs</title><desc id="timeseries-description">Successful runs rose from 24 to 58 while retried runs fell from 18 to 8 over six weeks.</desc><path class="oc-chart-grid-line" d="M40 40H620M40 100H620M40 160H620M40 220H620"/><path class="oc-timeseries-axis" d="M40 20V220H620"/><path class="oc-timeseries-series oc-timeseries-series-primary" d="M40 184L156 160L272 148L388 112L504 88L620 48"/><path class="oc-timeseries-series oc-timeseries-series-secondary" d="M40 132L156 142L272 156L388 170L504 180L620 194"/><g class="oc-timeseries-points"><circle cx="40" cy="184" r="4"/><circle cx="156" cy="160" r="4"/><circle cx="272" cy="148" r="4"/><circle cx="388" cy="112" r="4"/><circle cx="504" cy="88" r="4"/><circle cx="620" cy="48" r="4"/></g></svg></figure></div></section>
    <section data-section-kind="markup" aria-labelledby="timeseries-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="timeseries-markup">Describe the temporal story</h2></div></div>${codeBlock(`<figure class="oc-chart oc-timeseries">
  <figcaption class="oc-chart-header">
    <p class="oc-chart-title">Weekly runs</p>
    <ul class="oc-timeseries-legend" aria-label="Series">...</ul>
  </figcaption>
  <svg class="oc-chart-plot" viewBox="0 0 640 240" role="img" aria-labelledby="chart-title chart-description">
    <title id="chart-title">Weekly task runs</title>
    <desc id="chart-description">Successful runs rose while retried runs fell over six weeks.</desc>
    <path class="oc-timeseries-series oc-timeseries-series-primary" d="..." />
  </svg>
</figure>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="timeseries-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="timeseries-guidance">Time determines the reading order</h2></div></div>${guidanceList(["Keep intervals consistent and label changes in sampling or missing data.", "Use the same scale when series are meant to be compared directly.", "Pair color with a visible legend and distinct line treatment or points.", "Summarize the meaningful trend in the accessible description."])}</section>`,

  "chart-maps": () =>
    `${pageIntro("Charts", "Maps", "A geographic figure for comparing values by location without obscuring the underlying places.")}
    <section data-section-kind="preview" aria-labelledby="map-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="map-preview">Regional activity</h2></div><span class="oc-pill">.oc-map</span></div><div class="specimen-frame"><figure class="oc-chart oc-map"><figcaption class="oc-chart-header"><div><p class="oc-chart-title">Active workspaces</p><p class="oc-chart-caption">Relative activity by region</p></div><div class="oc-map-scale" aria-label="Activity scale"><span>Lower</span><i></i><i></i><i></i><span>Higher</span></div></figcaption><svg class="oc-map-plot" viewBox="0 0 640 300" role="img" aria-labelledby="map-title map-description"><title id="map-title">Active workspaces by region</title><desc id="map-description">The east and central regions have the highest activity. The north region has the lowest activity.</desc><g class="oc-map-regions"><path class="oc-map-region oc-map-region-low" d="M52 58L210 36L248 126L186 176L72 148Z"><title>North: lower activity</title></path><path class="oc-map-region oc-map-region-medium" d="M248 126L388 60L450 138L356 210L186 176Z"><title>Central: medium activity</title></path><path class="oc-map-region oc-map-region-high" d="M450 138L590 106L606 238L438 270L356 210Z"><title>East: higher activity</title></path><path class="oc-map-region oc-map-region-medium" d="M72 148L186 176L356 210L292 276L104 262Z"><title>South: medium activity</title></path></g></svg></figure></div></section>
    <section data-section-kind="markup" aria-labelledby="map-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="map-markup">Name every region</h2></div></div>${codeBlock(`<figure class="oc-chart oc-map">
  <figcaption class="oc-chart-header">
    <p class="oc-chart-title">Active workspaces</p>
    <div class="oc-map-scale" aria-label="Activity scale">...</div>
  </figcaption>
  <svg class="oc-map-plot" viewBox="0 0 640 300" role="img" aria-labelledby="map-title map-description">
    <title id="map-title">Active workspaces by region</title>
    <desc id="map-description">The east and central regions have the highest activity.</desc>
    <path class="oc-map-region oc-map-region-high" d="..."><title>East: higher activity</title></path>
  </svg>
</figure>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="map-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="map-guidance">Geography must explain the data</h2></div></div>${guidanceList(["Use a map only when location changes how the data should be understood.", "Name regions in accessible text and provide the important comparison outside hover.", "Keep boundaries visible in both themes and never encode values with color alone.", "Let consumers own projections, coordinate data, zoom, and selection behavior."])}</section>`,

  "chart-sankey": () =>
    `${pageIntro("Charts", "Sankey", "A flow diagram for showing how volume moves from sources through stages to destinations.")}
    <section data-section-kind="preview" aria-labelledby="sankey-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="sankey-preview">Volume through a workflow</h2></div><span class="oc-pill">.oc-sankey</span></div><div class="specimen-frame"><figure class="oc-chart oc-sankey"><figcaption class="oc-chart-header"><p class="oc-chart-title">Request outcomes</p><p class="oc-chart-caption">Last 30 days</p></figcaption><svg class="oc-sankey-plot" viewBox="0 0 640 300" role="img" aria-labelledby="sankey-title sankey-description"><title id="sankey-title">Request outcomes</title><desc id="sankey-description">Most requests move from submitted to completed. Smaller flows end in review or blocked.</desc><path class="oc-sankey-link oc-sankey-link-primary" stroke-width="72" d="M90 120C250 120 340 80 510 80"/><path class="oc-sankey-link" stroke-width="34" d="M90 190C250 190 350 180 510 180"/><path class="oc-sankey-link" stroke-width="18" d="M90 238C250 238 350 246 510 246"/><rect class="oc-sankey-node oc-sankey-node-primary" x="60" y="74" width="30" height="184" rx="4"/><rect class="oc-sankey-node" x="510" y="42" width="30" height="76" rx="4"/><rect class="oc-sankey-node" x="510" y="160" width="30" height="40" rx="4"/><rect class="oc-sankey-node" x="510" y="234" width="30" height="24" rx="4"/><text class="oc-sankey-label" x="60" y="278">Submitted</text><text class="oc-sankey-label" x="510" y="34">Completed</text><text class="oc-sankey-label" x="510" y="152">Review</text><text class="oc-sankey-label" x="510" y="226">Blocked</text></svg></figure></div></section>
    <section data-section-kind="markup" aria-labelledby="sankey-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="sankey-markup">Describe the dominant flow</h2></div></div>${codeBlock(`<figure class="oc-chart oc-sankey">
  <figcaption class="oc-chart-header"><p class="oc-chart-title">Request outcomes</p></figcaption>
  <svg class="oc-sankey-plot" viewBox="0 0 640 300" role="img" aria-labelledby="flow-title flow-description">
    <title id="flow-title">Request outcomes</title>
    <desc id="flow-description">Most requests move from submitted to completed.</desc>
    <path class="oc-sankey-link oc-sankey-link-primary" stroke-width="72" d="..." />
    <rect class="oc-sankey-node" x="510" y="42" width="30" height="76" />
  </svg>
</figure>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="sankey-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="sankey-guidance">Flow width must remain meaningful</h2></div></div>${guidanceList(["Use Sankey only when movement and relative volume are the primary story.", "Keep node order stable and label sources and destinations directly.", "Summarize the dominant and exceptional flows outside pointer interaction.", "Let the consumer own layout calculation, aggregation, and filtering."])}</section>`,

  "chart-custom": () =>
    `${pageIntro("Charts", "Custom Chart", "A compositional chart shell for bespoke visuals that still need consistent titles, summaries, and responsive structure.")}
    <section data-section-kind="preview" aria-labelledby="custom-chart-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="custom-chart-preview">Visual and summary together</h2></div><span class="oc-pill">.oc-custom-chart</span></div><div class="specimen-frame"><figure class="oc-chart oc-custom-chart"><div class="oc-custom-chart-visual"><figcaption class="oc-chart-header"><p class="oc-chart-title">Completion distribution</p><p class="oc-chart-caption">Current release</p></figcaption><svg class="oc-chart-plot" viewBox="0 0 420 220" role="img" aria-labelledby="custom-title custom-description"><title id="custom-title">Completion distribution</title><desc id="custom-description">Seventy-two percent complete, eighteen percent in review, and ten percent blocked.</desc><circle cx="210" cy="110" r="72" fill="none" stroke="var(--oc-surface-interactive)" stroke-width="28"/><path d="M210 38A72 72 0 1 1 139 121" fill="none" stroke="var(--oc-accent-primary)" stroke-linecap="round" stroke-width="28"/></svg></div><div class="oc-custom-chart-summary"><p class="oc-custom-chart-value">72%</p><p class="oc-custom-chart-label">Complete</p><p class="oc-custom-chart-detail">18% in review · 10% blocked</p></div></figure></div></section>
    <section data-section-kind="markup" aria-labelledby="custom-chart-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="custom-chart-markup">Keep custom visuals within the contract</h2></div></div>${codeBlock(`<figure class="oc-chart oc-custom-chart">
  <div class="oc-custom-chart-visual">
    <figcaption class="oc-chart-header"><p class="oc-chart-title">Completion distribution</p></figcaption>
    <svg class="oc-chart-plot" role="img" aria-labelledby="title description">…</svg>
  </div>
  <div class="oc-custom-chart-summary">
    <p class="oc-custom-chart-value">72%</p>
    <p class="oc-custom-chart-label">Complete</p>
  </div>
</figure>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="custom-chart-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="custom-chart-guidance">Bespoke does not mean unstructured</h2></div></div>${guidanceList(["Use the shared chart shell before inventing a new surface.", "Keep the key result visible outside the graphic.", "Provide a useful accessible description and preserve source order on narrow screens.", "Promote repeated custom visuals into a named chart component only after stable reuse."])}</section>`,

  "block-page-header": () =>
    `${pageIntro("Block", "Page Header", "A reusable page opening that keeps identity, context, and primary actions in one predictable region.")}
    <section data-section-kind="preview" aria-labelledby="page-header-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="page-header-preview">Context before action</h2></div><span class="oc-pill">.oc-page-header</span></div>
      <div class="specimen-frame oc-app-surface"><header class="oc-page-header"><div class="oc-page-header-content"><p class="oc-page-header-kicker">Workspace</p><h3 class="oc-page-header-title">Agent catalog</h3><p class="oc-page-header-description">Manage the capabilities available to this workspace.</p></div><div class="oc-page-header-actions"><button class="oc-button oc-button-secondary" type="button">Import</button><button class="oc-button oc-button-primary" type="button">New agent</button></div></header></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="page-header-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="page-header-markup">Use a semantic page heading</h2></div></div>${codeBlock(`<header class="oc-page-header">
  <div class="oc-page-header-content">
    <p class="oc-page-header-kicker">Workspace</p>
    <h1 class="oc-page-header-title">Agent catalog</h1>
    <p class="oc-page-header-description">Manage available capabilities.</p>
  </div>
  <div class="oc-page-header-actions">
    <button class="oc-button oc-button-primary" type="button">New agent</button>
  </div>
</header>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="page-header-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="page-header-guidance">Keep the opening decisive</h2></div></div>${guidanceList(["Use the page's single h1 inside the block.", "Keep the description focused on the page's purpose.", "Expose only the actions users need before reading the page.", "On narrow screens, actions follow the content in source order."])}</section>`,

  "block-resource-list": () =>
    `${pageIntro("Block", "Resource List", "A compact collection of related destinations with enough context to choose the right one before navigating.")}
    <section data-section-kind="preview" aria-labelledby="resource-list-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="resource-list-preview">Scan, compare, open</h2></div><span class="oc-pill">.oc-resource-list</span></div>
      <div class="specimen-frame oc-app-surface"><ul class="oc-resource-list"><li class="oc-resource-list-item"><a class="oc-resource-list-link" href="#resource-list-guidance"><span class="oc-resource-list-content"><strong class="oc-resource-list-title">Research agent</strong><span class="oc-resource-list-description">Searches sources and prepares cited summaries.</span></span><span class="oc-resource-list-meta">12 tools</span><span class="oc-resource-list-arrow" aria-hidden="true">→</span></a></li><li class="oc-resource-list-item"><a class="oc-resource-list-link" href="#resource-list-guidance"><span class="oc-resource-list-content"><strong class="oc-resource-list-title">Release agent</strong><span class="oc-resource-list-description">Validates packages and coordinates deployment checks.</span></span><span class="oc-resource-list-meta">8 tools</span><span class="oc-resource-list-arrow" aria-hidden="true">→</span></a></li><li class="oc-resource-list-item"><a class="oc-resource-list-link" href="#resource-list-guidance"><span class="oc-resource-list-content"><strong class="oc-resource-list-title">Support agent</strong><span class="oc-resource-list-description">Triages incoming requests and escalates blockers.</span></span><span class="oc-resource-list-meta">6 tools</span><span class="oc-resource-list-arrow" aria-hidden="true">→</span></a></li></ul></div>
    </section>
    <section data-section-kind="markup" aria-labelledby="resource-list-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="resource-list-markup">Keep each destination atomic</h2></div></div>${codeBlock(`<ul class="oc-resource-list">
  <li class="oc-resource-list-item">
    <a class="oc-resource-list-link" href="/agents/research">
      <span class="oc-resource-list-content">
        <strong class="oc-resource-list-title">Research agent</strong>
        <span class="oc-resource-list-description">Prepares cited summaries.</span>
      </span>
      <span class="oc-resource-list-meta">12 tools</span>
      <span class="oc-resource-list-arrow" aria-hidden="true">→</span>
    </a>
  </li>
</ul>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="resource-list-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="resource-list-guidance">Make the destination clear</h2></div></div>${guidanceList(["Use a list when the resources form one comparable set.", "Make the complete row one link instead of nesting controls.", "Keep descriptions short enough to scan without opening the destination.", "Use metadata only when it helps users distinguish peers."])}</section>`,

  "block-delete-resource": () =>
    `${pageIntro("Block", "Delete Resource", "A bounded destructive action that names the resource, consequence, and explicit next step.")}
    <section data-section-kind="preview" aria-labelledby="delete-resource-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="delete-resource-preview">Destruction stays isolated</h2></div><span class="oc-pill">.oc-delete-resource</span></div><div class="specimen-frame oc-app-surface"><section class="oc-delete-resource" aria-labelledby="delete-agent-title"><div class="oc-delete-resource-content"><h3 class="oc-delete-resource-title" id="delete-agent-title">Delete research agent</h3><p class="oc-delete-resource-description">This removes the agent and its workspace configuration. Conversation history remains available.</p></div><button class="oc-delete-resource-action" type="button">Delete agent</button></section></div></section>
    <section data-section-kind="markup" aria-labelledby="delete-resource-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="delete-resource-markup">Name the target and consequence</h2></div></div>${codeBlock(`<section class="oc-delete-resource" aria-labelledby="delete-agent-title">
  <div class="oc-delete-resource-content">
    <h2 class="oc-delete-resource-title" id="delete-agent-title">Delete research agent</h2>
    <p class="oc-delete-resource-description">This removes the agent and its workspace configuration.</p>
  </div>
  <button class="oc-delete-resource-action" type="button">Delete agent</button>
</section>`, "html")}</section>
    <section data-section-kind="guidance" aria-labelledby="delete-resource-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="delete-resource-guidance">Confirmation matches the risk</h2></div></div>${guidanceList(["Name the exact resource in both the block and confirmation step.", "State what is deleted, retained, and reversible before the action.", "Use a confirmation dialog when the action is irreversible or has broad impact.", "Keep permission checks, confirmation, progress, and recovery in the consumer."])}</section>`,

  "interface-examples": () =>
    `${pageIntro("Interface", "Interaction examples", "Preview-only examples that exercise canonical foundations without claiming a shared component contract.")}
    <div class="scope-note"><strong>Ownership boundary</strong><p>These controls demonstrate states and density. Their behavior and markup remain consumer-owned.</p></div>
    <section aria-labelledby="control-examples"><div class="section-heading"><div><p class="eyebrow">Examples</p><h2 id="control-examples">Controls and states</h2></div><button class="button button-secondary button-small" type="button" data-open-dialog>Open dialog</button></div>
      <div class="control-grid"><form class="form-sample"><label>Search skills<input type="search" placeholder="Search by name or capability" /></label><label>Category<select><option>All categories</option><option>Developer tools</option><option>Communication</option></select></label><label class="check-row"><input type="checkbox" checked />Include verified publishers</label><div class="button-row"><button class="button button-primary" type="button">Apply filters</button><button class="button button-secondary" type="reset">Reset</button></div></form>
      <div class="state-sample"><div class="segmented" aria-label="Display density"><button type="button" aria-pressed="true">Comfortable</button><button type="button" aria-pressed="false">Compact</button></div><button class="button button-danger" type="button">Remove access</button><button class="button button-secondary" type="button" disabled>Processing</button><div class="status-row"><span class="badge badge-success">Ready</span><span class="badge badge-warning">Review</span><span class="badge badge-error">Blocked</span><span class="badge badge-info">Official</span></div></div></div>
    </section>
    <dialog ${exampleDialogAttribute} aria-labelledby="interaction-example-dialog-title"><form method="dialog"><div class="dialog-heading"><div><p class="eyebrow">Confirmation</p><h2 id="interaction-example-dialog-title">Publish this package?</h2></div><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><p>The release will preserve the current semantic token and skill contract.</p><div class="button-row"><button class="button button-secondary" value="cancel">Cancel</button><button class="button button-primary" value="confirm">Publish</button></div></form></dialog>`,

  "composition-product": () =>
    `${pageIntro("Compositions", "Product surfaces", "Dense, quiet, operational layouts composed from stable foundations and consumer-owned behavior.")}
    <section aria-labelledby="product-specimen"><div class="section-heading"><div><p class="eyebrow">Specimen</p><h2 id="product-specimen">Package directory</h2></div><button class="button button-secondary button-small" type="button">Export</button></div>
      <div class="product-toolbar"><div class="tabs" role="tablist" aria-label="Package view"><button role="tab" aria-selected="true">Skills</button><button role="tab" aria-selected="false">Plugins</button><button role="tab" aria-selected="false">Publishers</button></div><span>24 results</span></div>
      <div class="table-wrap"><table><thead><tr><th scope="col">Package</th><th scope="col">Publisher</th><th scope="col">Status</th><th scope="col">Updated</th></tr></thead><tbody><tr><td><strong>design-audit</strong><small>UI compliance checks</small></td><td>openclaw</td><td><span class="badge badge-success">Verified</span></td><td>2m ago</td></tr><tr><td><strong>convex</strong><small>Backend workflow router</small></td><td>openclaw</td><td><span class="badge badge-info">Official</span></td><td>1h ago</td></tr><tr><td><strong>release-notes</strong><small>Draft release summaries</small></td><td>community</td><td><span class="badge badge-warning">Review</span></td><td>Yesterday</td></tr></tbody></table></div>
    </section>
    <section aria-labelledby="product-anatomy"><div class="section-heading"><div><p class="eyebrow">Anatomy</p><h2 id="product-anatomy">Composition roles</h2></div></div>${guidanceList(["Toolbar establishes scope and available actions.", "Table optimizes scanning before detail.", "Status colors communicate meaning rather than decoration."])}</section>`,

  "composition-content": () =>
    `${pageIntro("Compositions", "Content surfaces", "Readable technical guidance with stable hierarchy, measured line length, and useful code context.")}
    <section aria-labelledby="content-specimen"><div class="section-heading"><div><p class="eyebrow">Specimen</p><h2 id="content-specimen">Skill guidance</h2></div></div>
      <article class="prose-sample"><p class="lead">Skills are focused instruction bundles that teach an agent how to apply the shared visual contract.</p><h3>Install the project guidance</h3><p>Install the router and its focused branches, then select guidance by ownership.</p>${codeBlock(skillsInstallCommand, "shell")}<blockquote>Agent guidance follows the repository default branch and updates independently from runtime tags.</blockquote></article>
    </section>`,

  "composition-public": () =>
    `${pageIntro("Compositions", "Public surfaces", "Open, content-led compositions for public pages without turning every section into a card.")}
    <section aria-labelledby="public-specimen"><div class="section-heading"><div><p class="eyebrow">Specimen</p><h2 id="public-specimen">Literal value first</h2></div></div>
      <div class="marketing-sample"><div><p class="eyebrow">OpenClaw Skills</p><h3>Give your agent the tools for the job.</h3><p>Install reusable capabilities for development, communication, research, and operations.</p><div class="button-row"><button class="button button-primary" type="button">Browse skills</button><button class="button button-secondary" type="button">Read the guide</button></div></div><aside><strong>4,200+</strong><span>community skills</span></aside></div>
    </section>
    <section aria-labelledby="public-rules"><div class="section-heading"><div><p class="eyebrow">Structure</p><h2 id="public-rules">Composition rules</h2></div></div>${guidanceList(["Show the literal product, project, place, person, or offer immediately.", "Use cards only for repeated comparable items.", "Keep one primary action per decision area."])}</section>`,

  "resource-getting-started": () =>
    `${pageIntro("Resources", "Getting started", "Install an immutable release, choose the right import boundary, and keep application behavior in the consumer.")}
    <section aria-labelledby="install-package"><div class="section-heading"><div><p class="eyebrow">Install</p><h2 id="install-package">Git-tagged package</h2></div><p>Bun 1.3 or newer</p></div>${codeBlock(`bun add "git+https://github.com/openclaw/carapace.git#v0.1.0"`, "shell")}<p class="section-copy">The package is public and distributed through immutable Git tags. Its private package flag prevents accidental npm publication.</p></section>
    <section aria-labelledby="import-contract"><div class="section-heading"><div><p class="eyebrow">Import</p><h2 id="import-contract">Choose the boundary</h2></div></div><div class="principle-grid"><article><h3>Complete contract</h3><p>Use the root import when the shared baseline and every canonical primitive are desired.</p></article><article><h3>Focused entry points</h3><p>Adopt tokens, themes, typography, base styles, or components independently.</p></article></div>${codeBlock(`@import "@openclaw/carapace";\n\n/* Or adopt focused exports */\n@import "@openclaw/carapace/tokens.css";\n@import "@openclaw/carapace/themes.css";\n@import "@openclaw/carapace/typography.css";\n@import "@openclaw/carapace/components.css";`)}</section>
    <section aria-labelledby="ownership"><div class="section-heading"><div><p class="eyebrow">Ownership</p><h2 id="ownership">What stays local</h2></div></div>${guidanceList(["Routes, data, framework behavior, and product-specific layout remain in the consumer.", "Compose exported visual primitives before creating one-off styling.", "Promote an implementation only after at least two consumers share the same interface and behavior.", "Validate affected routes in a browser, at desktop and mobile sizes, in every supported theme."])}</section>`,

  "resource-package-exports": () =>
    `${pageIntro("Resources", "Package exports", "Every public entry point is versioned with the same runtime and guidance contract.")}
    <section aria-labelledby="package-entry-points"><div class="section-heading"><div><p class="eyebrow">Entry points</p><h2 id="package-entry-points">Import only what the consumer needs</h2></div></div>${referenceTable(["Specifier", "Purpose"], [[".", "Complete contract: tokens, themes, typography, base, and components."], ["./styles.css", "Explicit alias for the complete contract."], ["./tokens.css", "Palette, spacing, type scale, geometry, shadows, motion, and content widths."], ["./themes.css", "Dark and light semantic color roles."], ["./themes/product.css", "Opt-in status, input, and diff roles."], ["./typography.css", "Display, body, editorial, and monospace font stacks."], ["./base.css", "Optional global baseline and accessibility behavior."], ["./components.css", "Framework-neutral visual primitives."], ["./tailwind.css", "Tailwind 4 theme mappings and dark variant."], ["./compat/clawhub.css", "Migration aliases and ClawHub theme compatibility."], ["./package.json", "Package metadata for tooling."]])}</section>
    <section aria-labelledby="package-order"><div class="section-heading"><div><p class="eyebrow">Order</p><h2 id="package-order">Foundations precede adapters</h2></div></div>${codeBlock(`@import "@openclaw/carapace/tokens.css";\n@import "@openclaw/carapace/themes.css";\n@import "@openclaw/carapace/typography.css";\n@import "@openclaw/carapace/components.css";\n@import "@openclaw/carapace/themes/product.css";\n@import "@openclaw/carapace/compat/clawhub.css";\n@import "@openclaw/carapace/tailwind.css";`)}</section>`,

  "resource-theming": () =>
    `${pageIntro("Resources", "Theming", "Light and dark appearances resolve the same semantic roles while theme selection remains application-owned.")}
    <section aria-labelledby="theme-selector"><div class="section-heading"><div><p class="eyebrow">Selector</p><h2 id="theme-selector">Public-site contract</h2></div></div>${codeBlock(`<html data-theme="light">\n<html data-theme="dark">`, "html")}<p class="section-copy">Dark is the default contract when no explicit public-site theme selector is present.</p></section>
    <section aria-labelledby="theme-compat"><div class="section-heading"><div><p class="eyebrow">Compatibility</p><h2 id="theme-compat">ClawHub resolves family, mode, and appearance</h2></div></div>${codeBlock(`<html data-theme-family="claw" data-theme-resolved="light">\n<html data-theme-family="claw" data-theme-resolved="dark">\n<html data-theme-family="claw" data-theme-mode="system">`, "html")}</section>
    <section aria-labelledby="theme-rules"><div class="section-heading"><div><p class="eyebrow">Parity</p><h2 id="theme-rules">Both themes carry the same intent</h2></div></div>${guidanceList(["Choose semantic variables instead of theme-specific raw values.", "Validate hierarchy, contrast, focus, selection, and content in both modes.", "Persist user preference and switching behavior in the consuming application.", "Treat compatibility selectors as migration support, not a second theme system."])}</section>`,

  "resource-adapters": () =>
    `${pageIntro("Resources", "Consumer adapters", "Focused entry points support controlled adoption without moving framework or route ownership into the package.")}
    <section aria-labelledby="adapter-css"><div class="section-heading"><div><p class="eyebrow">Plain CSS and Astro</p><h2 id="adapter-css">Controlled imports</h2></div></div>${codeBlock(`@import "@openclaw/carapace/tokens.css";\n@import "@openclaw/carapace/themes.css";\n@import "@openclaw/carapace/typography.css";\n@import "@openclaw/carapace/components.css";`)}</section>
    <section aria-labelledby="adapter-static"><div class="section-heading"><div><p class="eyebrow">Static documentation</p><h2 id="adapter-static">Compare before reset</h2></div></div><p class="section-copy">Import tokens, themes, and typography before the documentation shell. Add base styles only after navigation, prose, search, code, and diagrams have been compared in a browser.</p></section>
    <section aria-labelledby="adapter-compat"><div class="section-heading"><div><p class="eyebrow">Compatibility</p><h2 id="adapter-compat">Migration is explicit</h2></div></div>${guidanceList(["The product theme and ClawHub aliases are opt-in transition layers.", "The compatibility adapter recognizes resolved light and dark modes plus system mode.", "Remove aliases only after source search and browser validation prove that no consumer uses them.", "Install immutable Git tags and validate each migration in the consumer."])}</section>`,

  "resource-tailwind": () =>
    `${pageIntro("Resources", "Tailwind", "A thin Tailwind 4 adapter maps canonical custom properties into utilities without owning components.")}
    <section aria-labelledby="tailwind-order"><div class="section-heading"><div><p class="eyebrow">Import order</p><h2 id="tailwind-order">Foundations before adapter</h2></div></div>${codeBlock(`@import "@openclaw/carapace/tokens.css";\n@import "@openclaw/carapace/themes.css";\n@import "@openclaw/carapace/typography.css";\n@import "@openclaw/carapace/components.css";\n@import "@openclaw/carapace/themes/product.css";\n@import "@openclaw/carapace/compat/clawhub.css";\n@import "@openclaw/carapace/tailwind.css";`)}</section>
    <section aria-labelledby="tailwind-mapping"><div class="section-heading"><div><p class="eyebrow">Mapping</p><h2 id="tailwind-mapping">Canonical roles become utilities</h2></div></div>${guidanceList(["Colors map background, surface, text, accent, status, and input roles.", "Spacing, type scale, font families, radii, and shadows map directly from canonical variables.", "The dark variant recognizes public-site and resolved consumer theme selectors."])}</section>
    <section aria-labelledby="tailwind-boundary"><div class="section-heading"><div><p class="eyebrow">Boundary</p><h2 id="tailwind-boundary">Utilities, not behavior</h2></div></div><p class="section-copy">Applications continue to own Radix, React, routes, states, and product-specific layout. The adapter does not generate or own components.</p></section>`,

  "resource-skills": () =>
    `${pageIntro("Resources", "Skills", "Project guidance follows the repository default branch so agents can use the latest documented contract.")}
    <section aria-labelledby="skill-router"><div class="section-heading"><div><p class="eyebrow">Install</p><h2 id="skill-router">Add project guidance</h2></div></div>${codeBlock(skillsInstallCommand, "shell")}<p class="section-copy">The router selects one focused branch before interface work and combines branches only when ownership genuinely crosses them.</p><h3>Refresh installed guidance</h3>${codeBlock(skillsUpdateCommand, "shell")}</section>
    <section aria-labelledby="focused-skills"><div class="section-heading"><div><p class="eyebrow">Focused guidance</p><h2 id="focused-skills">Four ownership branches</h2></div></div><div class="principle-grid"><article><h3>openclaw-brand</h3><p>Identity, typography, logos, imagery, voice, and asset rights.</p></article><article><h3>openclaw-carapace</h3><p>Product UI, tokens, themes, primitives, and adapters.</p></article><article><h3>openclaw-marketing-pages</h3><p>Public composition, navigation, SEO, media, and responsive layout.</p></article><article><h3>openclaw-design-audit</h3><p>Drift, token misuse, component substitution, accessibility, and reporting.</p></article></div></section>
    <section aria-labelledby="skill-routing"><div class="section-heading"><div><p class="eyebrow">Routing</p><h2 id="skill-routing">Match guidance to ownership</h2></div></div>${guidanceList(["Start public website work with marketing pages; add brand only when identity changes.", "Start product application work with Carapace guidance.", "Use audit guidance to evaluate drift and apply only narrow deterministic fixes.", "Refresh project guidance with the standard updater."])}</section>`,

  "resource-brand": () =>
    `${pageIntro("Resources", "Brand and assets", "Apply the OpenClaw identity through semantic roles while keeping licensed binaries with their owners.")}
    <section aria-labelledby="brand-identity"><div class="section-heading"><div><p class="eyebrow">Identity</p><h2 id="brand-identity">A restrained, functional visual language</h2></div></div><div class="principle-grid"><article><h3>Color</h3><p>Coral carries primary emphasis. Sea glass is a restrained secondary accent. Status colors remain functional.</p></article><article><h3>Typography</h3><p>Display and body, editorial accent, and code each have explicit semantic roles and fallbacks.</p></article><article><h3>Voice</h3><p>Capable, direct, curious, and human, using plain verbs and specific nouns.</p></article></div></section>
    <section aria-labelledby="brand-assets"><div class="section-heading"><div><p class="eyebrow">Rights</p><h2 id="brand-assets">A public URL is not a redistribution license</h2></div></div>${guidanceList(["Do not copy font binaries, logos, mascot artwork, photos, or illustrations without recorded permission.", "Record source, owner, license, allowed uses, redistribution terms, attribution, and evidence path.", "Keep an asset in its existing consumer when any rights information is unknown.", "Preserve approved logo proportions and colors; do not reconstruct a mark from screenshots."])}</section>`,

  "resource-governance": () =>
    `${pageIntro("Resources", "Governance", "The shared package owns stable visual contracts; consumers own their products, behavior, routes, and composition.")}
    <section aria-labelledby="governance-boundary"><div class="section-heading"><div><p class="eyebrow">Ownership</p><h2 id="governance-boundary">Shared foundation, local product</h2></div></div>${referenceTable(["Repository", "Owns"], [["Carapace", "Tokens, themes, typography, base behavior, framework-neutral visual primitives, thin adapters, and current guidance."], ["Consumer", "Data, routes, application state, framework behavior, page composition, media, and consumer-specific components."]])}</section>
    <section aria-labelledby="governance-promotion"><div class="section-heading"><div><p class="eyebrow">Promotion</p><h2 id="governance-promotion">Reuse must be demonstrated</h2></div></div>${guidanceList(["Keep a component or layout local until at least two consumers share the same interface and behavior.", "Discuss new components, breaking token changes, and large architecture changes before implementation.", "Prefer additive changes because tokens, themes, exports, skill names, and tags are public compatibility surfaces.", "Update project guidance when a public design rule changes."])}</section>
    <section aria-labelledby="governance-contribution"><div class="section-heading"><div><p class="eyebrow">Contribution</p><h2 id="governance-contribution">One logical contract change at a time</h2></div></div>${guidanceList(["Name affected consumers and explain the concrete problem.", "Add or update tests for stylesheet, package, token, or skill contract changes.", "Run the repository checks and report exact validation.", "Do not include credentials, private hosts, local paths, or restricted assets."])}</section>`,

  "resource-design-audit": () =>
    `${pageIntro("Resources", "Design audit", "Audit Carapace drift with deterministic source checks, rendered evidence, stable rule IDs, and explicit fix boundaries.")}
    <section aria-labelledby="audit-model"><div class="section-heading"><div><p class="eyebrow">Model</p><h2 id="audit-model">Mechanical rules and judgment stay distinct</h2></div></div><div class="principle-grid"><article><h3>Mechanical</h3><p>Tokens, duplicate primitives, states, overflow, accessible names, focus, theme parity, and asset rights.</p></article><article><h3>Judgment</h3><p>Action hierarchy, card overuse, typography scale, brand accents, literal subjects, and copy clarity.</p></article></div></section>
    <section aria-labelledby="audit-severity"><div class="section-heading"><div><p class="eyebrow">Severity</p><h2 id="audit-severity">Impact determines priority</h2></div></div>${referenceTable(["Level", "Meaning"], [["Error", "Broken interaction, accessibility barrier, illegible theme, overflow, asset-rights failure, or deterministic contract violation."], ["Warning", "Likely drift or inconsistency with meaningful user impact."], ["Info", "A bounded improvement with limited current impact."]])}</section>
    <section aria-labelledby="audit-output"><div class="section-heading"><div><p class="eyebrow">Evidence</p><h2 id="audit-output">Every finding remains traceable</h2></div></div>${guidanceList(["Include file, line, category, severity, stable rule ID, remediation, reference, and finding kind.", "Produce design-audit.json and design-audit.md with version and consumer SHA.", "Automatically fix only narrow deterministic findings covered by an established rule.", "Require human review for copy, hierarchy, navigation, new abstractions, broad redesign, asset interpretation, and compatibility removal."])}</section>`,

  "resource-accessibility": () =>
    `${pageIntro("Resources", "Accessibility", "The shared baseline, primitives, and audit guidance establish non-negotiable interaction behavior.")}
    <section aria-labelledby="a11y-baseline"><div class="section-heading"><div><p class="eyebrow">Baseline</p><h2 id="a11y-baseline">Accessibility starts before components</h2></div></div>${guidanceList(["Visible focus uses the semantic focus-ring role.", "The .sr-only utility preserves accessible text without visual clutter.", "Reduced-motion preferences disable smooth scrolling and collapse animation timing.", "The document baseline preserves a supported minimum width of 320px."])}</section>
    <section aria-labelledby="a11y-checks"><div class="section-heading"><div><p class="eyebrow">Checks</p><h2 id="a11y-checks">Interaction must remain legible</h2></div></div>${guidanceList(["Every interactive control has an accessible name.", "Keyboard focus remains visible, reachable, and coherent.", "Hover, focus, disabled, loading, invalid, and selected states are distinct.", "Light and dark themes preserve content, hierarchy, and contrast.", "Semantic heading order and accessible navigation survive responsive layouts.", "Text and fixed-format UI do not clip or create accidental horizontal scrolling."])}</section>`,

  "resource-release": () =>
    `${pageIntro("Resources", "Release", "Runtime CSS uses immutable semantic releases. Agent guidance follows the repository default branch.")}
    <section aria-labelledby="release-current"><div class="release-panel"><div><p class="eyebrow">Current release</p><h2 id="release-current">v0.1.0</h2></div><span>Stable</span></div></section>
    <section aria-labelledby="release-contract"><div class="section-heading"><div><p class="eyebrow">Contract</p><h2 id="release-contract">Immutable Git tags</h2></div></div>${guidanceList(["The release tag must match package.json.", "Runtime assets ship under the matching semantic tag.", "Agent guidance follows the repository default branch and the standard skills updater.", "Consumers install a stable Git tag and validate migration locally.", "npm publication is intentionally disabled."])}</section>
    <section aria-labelledby="release-flow"><div class="section-heading"><div><p class="eyebrow">Maintainers</p><h2 id="release-flow">Validate before packaging</h2></div></div>${codeBlock(`bun run check\nbun run release:check v0.1.0\nbun pm pack --destination dist`, "shell")}<p class="section-copy">The release workflow verifies the tag, packs the Git-distributed archive, and publishes it as a GitHub Release asset.</p></section>
    <section aria-labelledby="release-consumer"><div class="section-heading"><div><p class="eyebrow">Consumers</p><h2 id="release-consumer">Migration remains explicit</h2></div></div>${guidanceList(["Pin an immutable semantic tag.", "Review compatibility surfaces and focused imports before updating.", "Validate rendered routes at desktop and mobile sizes.", "Check light and dark themes where supported."])}</section>`,
};

export const referenceContentIds = [...Object.keys(contents), ...agentReferenceContentIds];

export function getReferenceContent(id) {
  return contents[id]?.() ?? getAgentReferenceContent(id);
}

export function renderReferenceContent() {
  const mount = document.querySelector("[data-reference-content]");
  if (!mount) return;
  const content = getReferenceContent(document.body.dataset.previewPage);
  if (content) mount.innerHTML = content;
}
