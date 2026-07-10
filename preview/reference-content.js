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
  return `<section aria-labelledby="token-reference-title"><div class="section-heading"><div><p class="eyebrow">Token reference</p><h2 id="token-reference-title">Canonical variables</h2></div><p data-token-summary aria-live="polite"><span data-token-count></span> variables in this view.</p></div><div class="token-tools"><nav class="token-group-nav" data-token-group-nav aria-label="Token groups"></nav><label class="token-filter"><span>Filter variables</span><span class="token-filter-field"><input type="search" data-token-filter placeholder="Search by token name or group" autocomplete="off" /><button type="button" data-clear-token-filter hidden>Clear</button></span></label></div><div class="token-catalog" data-token-grid${groups ? ` data-token-groups="${groups}"` : ""}></div></section>`;
}

function guidanceList(items) {
  return `<ul class="guidance-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

const contents = {
  "foundation-tokens": () =>
    `${pageIntro("Foundations", "Design tokens", "The complete canonical variable contract, resolved directly from the active package styles.")}${tokenSection()}`,

  "foundation-colors": () =>
    `${pageIntro("Foundations", "Colors", "Fixed palette sources and theme-aware semantic roles for backgrounds, text, borders, actions, and operational feedback.")}
    <section aria-labelledby="color-model"><div class="section-heading"><div><p class="eyebrow">Model</p><h2 id="color-model">Choose intent before value</h2></div></div>
      <div class="principle-grid">
        <article><h3>Palette</h3><p>Fixed source colors. Direct use is reserved for documented exceptions.</p></article>
        <article><h3>Semantic</h3><p>Theme-aware roles for page, surface, text, accent, and borders.</p></article>
        <article><h3>Product</h3><p>Opt-in status, input, selection, chart, and diff roles for operational UI.</p></article>
      </div>
    </section>
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
    ${tokenSection("motion")}`,

  "interface-primitives": () =>
    `${pageIntro("Interface", "Shared primitives", "Framework-neutral classes exported by components.css. Consumers keep their own content and behavior.")}
    <div class="scope-note"><strong>Canonical scope</strong><p>Every page below documents classes already exported by components.css. No local example is promoted into the contract.</p></div>
    <section aria-labelledby="primitive-index"><div class="section-heading"><div><p class="eyebrow">Index</p><h2 id="primitive-index">Primitive families</h2></div><span class="oc-pill">7 references</span></div>
      <div class="reference-card-grid primitive-index-grid">
        <a class="reference-card" href="./app-surface/"><span>.oc-app-surface</span><strong>App surface</strong><p>Root visual context for an application surface.</p></a>
        <a class="reference-card" href="./hero/"><span>.oc-hero</span><strong>Hero</strong><p>Centered introduction with title and lede roles.</p></a>
        <a class="reference-card" href="./section/"><span>.oc-section</span><strong>Section</strong><p>Reusable heading, copy, and action structure.</p></a>
        <a class="reference-card" href="./card/"><span>.oc-card</span><strong>Card</strong><p>Static and interactive shared surfaces.</p></a>
        <a class="reference-card" href="./action/"><span>.oc-action</span><strong>Action</strong><p>Primary, secondary, ghost, and icon variants.</p></a>
        <a class="reference-card" href="./segmented-control/"><span>.oc-segmented</span><strong>Segmented control</strong><p>Compact selection among peer views.</p></a>
        <a class="reference-card" href="./pill/"><span>.oc-pill</span><strong>Pill</strong><p>Compact non-interactive metadata.</p></a>
      </div>
    </section>`,

  "primitive-app-surface": () =>
    `${pageIntro("Interface primitive", "App surface", "Establishes the canonical background, foreground, typography, and component surface aliases for an application subtree.")}
    <section aria-labelledby="app-surface-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="app-surface-preview">Root visual context</h2></div><span class="oc-pill">.oc-app-surface</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-app-surface-demo"><strong>OpenClaw application</strong><p>Children inherit the canonical interface foundation.</p></div></div>
    </section>
    <section aria-labelledby="app-surface-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="app-surface-markup">Apply once at the surface root</h2></div></div>${codeBlock(`<main class="oc-app-surface">\n  <!-- Consumer-owned application -->\n</main>`, "html")}</section>
    <section aria-labelledby="app-surface-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="app-surface-guidance">Ownership boundary</h2></div></div>${guidanceList(["Use it as the visual context for an application subtree.", "Keep routing, data, and behavior in the consumer.", "Do not nest it merely to create another card or panel."])}</section>`,

  "primitive-hero": () =>
    `${pageIntro("Interface primitive", "Hero", "A centered introduction with explicit title and supporting-copy roles.")}
    <section aria-labelledby="hero-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="hero-preview">Default composition</h2></div><span class="oc-pill">.oc-hero</span></div>
      <div class="specimen-frame oc-app-surface"><div class="oc-hero"><h3 class="oc-hero-title">Build where your work already lives.</h3><p class="oc-hero-lede">A shared visual introduction with consumer-owned content and actions.</p></div></div>
    </section>
    <section aria-labelledby="hero-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="hero-markup">Three explicit roles</h2></div></div>${codeBlock(`<div class="oc-hero">\n  <h1 class="oc-hero-title">Build with OpenClaw</h1>\n  <p class="oc-hero-lede">Supporting copy.</p>\n</div>`, "html")}</section>
    <section aria-labelledby="hero-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="hero-guidance">Keep the introduction literal</h2></div></div>${guidanceList(["Use one clear title and one supporting lede.", "Keep actions and media consumer-owned.", "The exported responsive rule reduces title size below 42rem."])}</section>`,

  "primitive-section": () =>
    `${pageIntro("Interface primitive", "Section", "A framework-neutral structure for headings, supporting copy, and an optional adjacent action.")}
    <section aria-labelledby="section-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="section-preview">Heading with action</h2></div><span class="oc-pill">.oc-section</span></div>
      <div class="specimen-frame oc-app-surface"><section class="oc-section"><header class="oc-section-header"><div class="oc-section-heading"><p class="oc-eyebrow">Featured</p><h3 class="oc-section-title">Build with OpenClaw</h3><p class="oc-section-copy">Shared hierarchy without owning the page or its content.</p></div><a class="oc-action oc-action-secondary" href="#section-guidance">Browse</a></header></section></div>
    </section>
    <section aria-labelledby="section-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="section-markup">Composable heading structure</h2></div></div>${codeBlock(`<section class="oc-section">\n  <header class="oc-section-header">\n    <div class="oc-section-heading">\n      <p class="oc-eyebrow">Featured</p>\n      <h2 class="oc-section-title">Build with OpenClaw</h2>\n      <p class="oc-section-copy">Supporting copy.</p>\n    </div>\n  </header>\n</section>`, "html")}</section>
    <section aria-labelledby="section-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="section-guidance">Responsive by structure</h2></div></div>${guidanceList(["Keep the semantic heading level appropriate to the page.", "Use the adjacent action only when the section has a clear next step.", "Below 42rem, the header stacks and aligns to the start."])}</section>`,

  "primitive-card": () =>
    `${pageIntro("Interface primitive", "Card", "A shared surface with an opt-in interactive state for whole-card actions.")}
    <section aria-labelledby="card-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="card-preview">Static and interactive</h2></div><span class="oc-pill">.oc-card</span></div>
      <div class="specimen-frame primitive-card-grid oc-app-surface"><article class="oc-card primitive-card-demo"><strong>Static surface</strong><p>Use for a genuinely grouped content unit.</p></article><a class="oc-card oc-card-interactive primitive-card-demo" href="#card-guidance"><strong>Interactive surface</strong><p>Hover, focus, and press use the exported state contract.</p></a></div>
    </section>
    <section aria-labelledby="card-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="card-markup">Interaction is opt-in</h2></div></div>${codeBlock(`<a class="oc-card oc-card-interactive" href="/destination">\n  Interactive card content\n</a>`, "html")}</section>
    <section aria-labelledby="card-guidance"><div class="section-heading"><div><p class="eyebrow">States</p><h2 id="card-guidance">Hover, focus, and active</h2></div></div>${guidanceList(["Use the interactive class only when the whole surface acts as one control.", "The consumer chooses the correct semantic element and accessible name.", "Reduced-motion mode removes the interactive transform."])}</section>`,

  "primitive-action": () =>
    `${pageIntro("Interface primitive", "Action", "Shared action hierarchy for buttons and links, including a compact icon-only form.")}
    <section aria-labelledby="action-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="action-preview">Exported variants</h2></div><span class="oc-pill">.oc-action</span></div>
      <div class="specimen-frame oc-app-surface"><div class="primitive-row"><button class="oc-action oc-action-primary" type="button">Primary action</button><button class="oc-action oc-action-secondary" type="button">Secondary</button><button class="oc-action oc-action-ghost" type="button">Ghost</button><button class="oc-action oc-action-icon" type="button" aria-label="Add item">+</button></div></div>
    </section>
    <section aria-labelledby="action-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="action-markup">Variant classes express hierarchy</h2></div></div>${codeBlock(`<button class="oc-action oc-action-primary" type="button">\n  Primary action\n</button>`, "html")}</section>
    <section aria-labelledby="action-states"><div class="section-heading"><div><p class="eyebrow">States</p><h2 id="action-states">Responsive interaction feedback</h2></div></div>${guidanceList(["Primary, secondary, and ghost variants cover visual hierarchy.", "Hover, focus-visible, and active states are exported.", "Icon-only actions require a consumer-provided accessible name.", "Disabled and loading behavior remain consumer-owned until canonically implemented."])}</section>`,

  "primitive-segmented": () =>
    `${pageIntro("Interface primitive", "Segmented control", "A compact visual group for selecting among peer views or modes.")}
    <section aria-labelledby="segmented-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="segmented-preview">Pressed and selected states</h2></div><span class="oc-pill">.oc-segmented</span></div>
      <div class="specimen-frame primitive-row oc-app-surface"><div class="oc-segmented" aria-label="Preview mode"><button class="oc-segmented-item" type="button" aria-pressed="true">Preview</button><button class="oc-segmented-item" type="button" aria-pressed="false">Code</button></div><div class="oc-segmented" role="tablist" aria-label="Reference area"><button class="oc-segmented-item" role="tab" aria-selected="true">Tokens</button><button class="oc-segmented-item" role="tab" aria-selected="false">Type</button></div></div>
    </section>
    <section aria-labelledby="segmented-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="segmented-markup">State follows interaction semantics</h2></div></div>${codeBlock(`<div class="oc-segmented" aria-label="Display mode">\n  <button class="oc-segmented-item" aria-pressed="true">Preview</button>\n  <button class="oc-segmented-item" aria-pressed="false">Code</button>\n</div>`, "html")}</section>
    <section aria-labelledby="segmented-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="segmented-guidance">Consumer-owned selection</h2></div></div>${guidanceList(["Use aria-pressed for toggle buttons or aria-selected for tabs.", "Keep labels short and options structurally equivalent.", "Selection behavior and keyboard management remain consumer-owned."])}</section>`,

  "primitive-pill": () =>
    `${pageIntro("Interface primitive", "Pill", "A compact, non-interactive label for short metadata.")}
    <section aria-labelledby="pill-preview"><div class="section-heading"><div><p class="eyebrow">Preview</p><h2 id="pill-preview">Short metadata</h2></div><span class="oc-pill">.oc-pill</span></div>
      <div class="specimen-frame primitive-row oc-app-surface"><span class="oc-pill">Stable</span><span class="oc-pill">Official</span><span class="oc-pill">v0.0.1</span></div>
    </section>
    <section aria-labelledby="pill-markup"><div class="section-heading"><div><p class="eyebrow">Markup</p><h2 id="pill-markup">Inline label</h2></div></div>${codeBlock(`<span class="oc-pill">Stable</span>`, "html")}</section>
    <section aria-labelledby="pill-guidance"><div class="section-heading"><div><p class="eyebrow">Guidance</p><h2 id="pill-guidance">Metadata, not interaction</h2></div></div>${guidanceList(["Keep the label short enough to scan inline.", "Use status tokens when the label communicates status.", "Do not style a button as a pill without a canonical interactive contract."])}</section>`,

  "interface-examples": () =>
    `${pageIntro("Interface", "Interaction examples", "Preview-only examples that exercise canonical foundations without claiming a shared component contract.")}
    <div class="scope-note"><strong>Ownership boundary</strong><p>These controls demonstrate states and density. Their behavior and markup remain consumer-owned.</p></div>
    <section aria-labelledby="control-examples"><div class="section-heading"><div><p class="eyebrow">Examples</p><h2 id="control-examples">Controls and states</h2></div><button class="button button-secondary button-small" type="button" data-open-dialog>Open dialog</button></div>
      <div class="control-grid"><form class="form-sample"><label>Search skills<input type="search" placeholder="Search by name or capability" /></label><label>Category<select><option>All categories</option><option>Developer tools</option><option>Communication</option></select></label><label class="check-row"><input type="checkbox" checked />Include verified publishers</label><div class="button-row"><button class="button button-primary" type="button">Apply filters</button><button class="button button-secondary" type="reset">Reset</button></div></form>
      <div class="state-sample"><div class="segmented" aria-label="Display density"><button type="button" aria-pressed="true">Comfortable</button><button type="button" aria-pressed="false">Compact</button></div><button class="button button-danger" type="button">Remove access</button><button class="button button-secondary" type="button" disabled>Processing</button><div class="status-row"><span class="badge badge-success">Ready</span><span class="badge badge-warning">Review</span><span class="badge badge-error">Blocked</span><span class="badge badge-info">Official</span></div></div></div>
    </section>
    <dialog><form method="dialog"><div class="dialog-heading"><div><p class="eyebrow">Confirmation</p><h2>Publish this package?</h2></div><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><p>The release will preserve the current semantic token and skill contract.</p><div class="button-row"><button class="button button-secondary" value="cancel">Cancel</button><button class="button button-primary" value="confirm">Publish</button></div></form></dialog>`,

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
      <article class="prose-sample"><p class="lead">Skills are versioned instruction bundles that teach an agent how to use the same visual contract as the runtime package.</p><h3>Install the focused guidance</h3><p>Choose the branch that matches the work. Product UI, public pages, brand artifacts, and audits have different ownership boundaries.</p>${codeBlock(`npx skills add "openclaw/design-system#v0.0.1" --copy --yes`, "shell")}<blockquote>Runtime assets and skills always release together.</blockquote></article>
    </section>`,

  "composition-public": () =>
    `${pageIntro("Compositions", "Public surfaces", "Open, content-led compositions for public pages without turning every section into a card.")}
    <section aria-labelledby="public-specimen"><div class="section-heading"><div><p class="eyebrow">Specimen</p><h2 id="public-specimen">Literal value first</h2></div></div>
      <div class="marketing-sample"><div><p class="eyebrow">OpenClaw Skills</p><h3>Give your agent the tools for the job.</h3><p>Install reusable capabilities for development, communication, research, and operations.</p><div class="button-row"><button class="button button-primary" type="button">Browse skills</button><button class="button button-secondary" type="button">Read the guide</button></div></div><aside><strong>4,200+</strong><span>community skills</span></aside></div>
    </section>
    <section aria-labelledby="public-rules"><div class="section-heading"><div><p class="eyebrow">Structure</p><h2 id="public-rules">Composition rules</h2></div></div>${guidanceList(["Show the literal product, project, place, person, or offer immediately.", "Use cards only for repeated comparable items.", "Keep one primary action per decision area."])}</section>`,

  "resource-getting-started": () =>
    `${pageIntro("Resources", "Getting started", "Install an immutable release, import the contract, and keep application behavior in the consumer.")}
    <section aria-labelledby="install-package"><div class="section-heading"><div><p class="eyebrow">Install</p><h2 id="install-package">Git-tagged package</h2></div></div>${codeBlock(`bun add "git+https://github.com/openclaw/design-system.git#v0.0.1"`, "shell")}</section>
    <section aria-labelledby="import-contract"><div class="section-heading"><div><p class="eyebrow">Import</p><h2 id="import-contract">Complete contract</h2></div></div>${codeBlock(`@import "@openclaw/design-system";`)}</section>
    <section aria-labelledby="ownership"><div class="section-heading"><div><p class="eyebrow">Ownership</p><h2 id="ownership">What stays local</h2></div></div>${guidanceList(["Routes, data, and product behavior remain in the consumer.", "Use shared visual primitives before creating one-off styling.", "Promote implementation only after at least two consumers share it."])}</section>`,

  "resource-theming": () =>
    `${pageIntro("Resources", "Theming", "Light and dark themes resolve the same semantic contract. Theme switching remains application-owned.")}
    <section aria-labelledby="theme-selector"><div class="section-heading"><div><p class="eyebrow">Selector</p><h2 id="theme-selector">Public-site contract</h2></div></div>${codeBlock(`<html data-theme="light">\n<html data-theme="dark">`, "html")}</section>
    <section aria-labelledby="theme-rules"><div class="section-heading"><div><p class="eyebrow">Parity</p><h2 id="theme-rules">Both themes carry the same intent</h2></div></div>${guidanceList(["Choose semantic variables instead of theme-specific raw values.", "Validate hierarchy, contrast, focus, and content in both modes.", "Persist user preference in the consuming application."])}</section>`,

  "resource-adapters": () =>
    `${pageIntro("Resources", "Consumer adapters", "Focused entry points support controlled adoption without moving framework or route ownership into the package.")}
    <section aria-labelledby="adapter-css"><div class="section-heading"><div><p class="eyebrow">Plain CSS and Astro</p><h2 id="adapter-css">Controlled imports</h2></div></div>${codeBlock(`@import "@openclaw/design-system/tokens.css";\n@import "@openclaw/design-system/themes.css";\n@import "@openclaw/design-system/typography.css";\n@import "@openclaw/design-system/components.css";`)}</section>
    <section aria-labelledby="adapter-static"><div class="section-heading"><div><p class="eyebrow">Static documentation</p><h2 id="adapter-static">Compare before reset</h2></div></div><p class="section-copy">Import tokens, themes, and typography before the documentation shell. Add base styles only after navigation, prose, search, code, and diagrams have been compared in a browser.</p></section>
    <section aria-labelledby="adapter-compat"><div class="section-heading"><div><p class="eyebrow">Compatibility</p><h2 id="adapter-compat">Migration is explicit</h2></div></div><p class="section-copy">The product theme and ClawHub aliases are opt-in transition layers, not another design system.</p></section>`,

  "resource-tailwind": () =>
    `${pageIntro("Resources", "Tailwind", "A thin Tailwind 4 adapter maps canonical custom properties into utilities without owning components.")}
    <section aria-labelledby="tailwind-order"><div class="section-heading"><div><p class="eyebrow">Import order</p><h2 id="tailwind-order">Foundations before adapter</h2></div></div>${codeBlock(`@import "@openclaw/design-system/tokens.css";\n@import "@openclaw/design-system/themes.css";\n@import "@openclaw/design-system/typography.css";\n@import "@openclaw/design-system/components.css";\n@import "@openclaw/design-system/themes/product.css";\n@import "@openclaw/design-system/tailwind.css";`)}</section>
    <section aria-labelledby="tailwind-boundary"><div class="section-heading"><div><p class="eyebrow">Boundary</p><h2 id="tailwind-boundary">Utilities, not behavior</h2></div></div><p class="section-copy">Applications continue to own Radix, React, routes, states, and product-specific layout.</p></section>`,

  "resource-skills": () =>
    `${pageIntro("Resources", "Skills", "Versioned guidance ships with the runtime assets so agents and applications use the same contract.")}
    <section aria-labelledby="skill-router"><div class="section-heading"><div><p class="eyebrow">Router</p><h2 id="skill-router">Install the design router</h2></div></div>${codeBlock(`npx skills add "openclaw/design-system#v0.0.1" --copy --yes`, "shell")}</section>
    <section aria-labelledby="focused-skills"><div class="section-heading"><div><p class="eyebrow">Focused guidance</p><h2 id="focused-skills">Four ownership branches</h2></div></div><div class="principle-grid"><article><h3>Brand</h3><p>Identity, typography, logos, imagery, and voice.</p></article><article><h3>Design system</h3><p>Product UI, tokens, themes, primitives, and adapters.</p></article><article><h3>Marketing pages</h3><p>Public composition, navigation, SEO, and responsive layout.</p></article><article><h3>Design audit</h3><p>Drift, token misuse, component substitution, and accessibility.</p></article></div></section>`,

  "resource-accessibility": () =>
    `${pageIntro("Resources", "Accessibility", "The shared contract and audit guidance define a small set of non-negotiable interface checks.")}
    <section aria-labelledby="a11y-checks"><div class="section-heading"><div><p class="eyebrow">Checks</p><h2 id="a11y-checks">Interaction must remain legible</h2></div></div>${guidanceList(["Every interactive control has an accessible name.", "Keyboard focus remains visible, reachable, and coherent.", "Hover, focus, disabled, loading, invalid, and selected states are distinct.", "Light and dark themes preserve content, hierarchy, and contrast.", "Semantic heading order and accessible navigation survive responsive layouts."])}</section>`,

  "resource-release": () =>
    `${pageIntro("Resources", "Release", "Runtime CSS and agent guidance move together under one stable semantic version.")}
    <section aria-labelledby="release-current"><div class="release-panel"><div><p class="eyebrow">Current release</p><h2 id="release-current">v0.0.1</h2></div><span>Stable</span></div></section>
    <section aria-labelledby="release-contract"><div class="section-heading"><div><p class="eyebrow">Contract</p><h2 id="release-contract">Immutable Git tags</h2></div></div>${guidanceList(["The release tag must match package.json.", "Runtime assets and skills always release together.", "Consumers install a stable Git tag and validate migration locally.", "npm publication is intentionally disabled."])}</section>`,
};

export const referenceContentIds = Object.keys(contents);

export function renderReferenceContent() {
  const mount = document.querySelector("[data-reference-content]");
  if (!mount) return;
  const render = contents[document.body.dataset.previewPage];
  if (render) mount.innerHTML = render();
}
