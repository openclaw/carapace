const tokenDefinitions = [
  ["Page", "--oc-bg-page"],
  ["Surface", "--oc-bg-surface"],
  ["Elevated", "--oc-bg-elevated"],
  ["Primary text", "--oc-text-primary"],
  ["Secondary text", "--oc-text-secondary"],
  ["Muted text", "--oc-text-muted"],
  ["Primary accent", "--oc-accent-primary"],
  ["Accent hover", "--oc-accent-primary-hover"],
  ["Secondary accent", "--oc-accent-secondary"],
];

const root = document.documentElement;
const tokenGrid = document.querySelector("[data-token-grid]");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const dialog = document.querySelector("dialog");
const dialogTrigger = document.querySelector("[data-open-dialog]");

function renderTokens() {
  const styles = getComputedStyle(root);
  tokenGrid.replaceChildren(
    ...tokenDefinitions.map(([label, variable]) => {
      const value = styles.getPropertyValue(variable).trim();
      const swatch = document.createElement("div");
      swatch.className = "swatch";
      swatch.innerHTML = `
        <div class="swatch-color" style="--swatch: ${value}"></div>
        <div class="swatch-meta">
          <strong>${label}</strong>
          <code>${variable} · ${value}</code>
        </div>
      `;
      return swatch;
    }),
  );
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("openclaw-preview-theme", theme);
  renderTokens();
}

for (const button of themeButtons) {
  button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
}

dialogTrigger.addEventListener("click", () => dialog.showModal());

renderTokens();
