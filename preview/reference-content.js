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
  return `<section aria-labelledby="token-reference-title"><div class="section-heading"><div><p class="eyebrow">Token reference</p><h2 id="token-reference-title">Canonical variables</h2></div><p><span data-token-count></span> variables in this view.</p></div><label class="token-filter"><span>Filter variables</span><input type="search" data-token-filter placeholder="Search by token name or group" autocomplete="off" /></label><div class="token-catalog" data-token-grid${groups ? ` data-token-groups="${groups}"` : ""}></div></section>`;
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
    <section aria-labelledby="primitive-actions"><div class="section-heading"><div><p class="eyebrow">Actions</p><h2 id="primitive-actions">Action hierarchy</h2></div><span class="oc-pill">components.css</span></div>
      <div class="specimen-frame"><div class="primitive-row"><button class="oc-action oc-action-primary" type="button">Primary action</button><button class="oc-action oc-action-secondary" type="button">Secondary</button><button class="oc-action oc-action-ghost" type="button">Ghost</button><button class="oc-action oc-action-icon" type="button" aria-label="Add item">+</button></div></div>
      ${codeBlock(`<button class="oc-action oc-action-primary" type="button">\n  Primary action\n</button>`, "html")}
    </section>
    <section aria-labelledby="primitive-surfaces"><div class="section-heading"><div><p class="eyebrow">Surfaces</p><h2 id="primitive-surfaces">Cards and sections</h2></div></div>
      <div class="specimen-frame"><section class="oc-section"><header class="oc-section-header"><div class="oc-section-heading"><p class="oc-eyebrow">Featured</p><h3 class="oc-section-title">Build with OpenClaw</h3><p class="oc-section-copy">Shared visual structure with consumer-owned content.</p></div><button class="oc-action oc-action-secondary" type="button">Browse</button></header><article class="oc-card"><strong>Framework neutral</strong><p>Tokens and shared visual behavior without route or data ownership.</p></article></section></div>
    </section>
    <section aria-labelledby="primitive-selection"><div class="section-heading"><div><p class="eyebrow">Selection</p><h2 id="primitive-selection">Segmented controls and pills</h2></div></div>
      <div class="specimen-frame primitive-row"><div class="oc-segmented" aria-label="Example view"><button class="oc-segmented-item" aria-pressed="true" type="button">Preview</button><button class="oc-segmented-item" aria-pressed="false" type="button">Code</button></div><span class="oc-pill">Stable</span></div>
    </section>`,

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
