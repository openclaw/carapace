import { exampleDialogAttribute } from "./interaction.js";

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
    <section aria-labelledby="primitive-index"><div class="section-heading"><div><p class="eyebrow">Index</p><h2 id="primitive-index">Primitive families</h2></div><span class="oc-pill">22 references</span></div>
      <div class="reference-card-grid primitive-index-grid">
        <a class="reference-card" href="./autocomplete/"><span>.oc-autocomplete</span><strong>Autocomplete</strong><p>Text entry with native suggestions.</p></a>
        <a class="reference-card" href="./badge/"><span>.oc-badge</span><strong>Badge</strong><p>Compact status and metadata labels.</p></a>
        <a class="reference-card" href="./banner/"><span>.oc-banner</span><strong>Banner</strong><p>Persistent contextual notices.</p></a>
        <a class="reference-card" href="./breadcrumbs/"><span>.oc-breadcrumbs</span><strong>Breadcrumbs</strong><p>Current location within a hierarchy.</p></a>
        <a class="reference-card" href="./button/"><span>.oc-button</span><strong>Button</strong><p>Explicit button variants and sizes.</p></a>
        <a class="reference-card" href="./clipboard-text/"><span>.oc-clipboard-text</span><strong>Clipboard Text</strong><p>Copyable literal values.</p></a>
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

export const referenceContentIds = Object.keys(contents);

export function getReferenceContent(id) {
  return contents[id]?.() ?? "";
}

export function renderReferenceContent() {
  const mount = document.querySelector("[data-reference-content]");
  if (!mount) return;
  const content = getReferenceContent(document.body.dataset.previewPage);
  if (content) mount.innerHTML = content;
}
