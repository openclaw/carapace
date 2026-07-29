import { initChartHover } from "../js/charts.js";
import { bindComponentWorkbenches } from "./component-workbench.js";
import { renderReferenceContent } from "./reference-content.js";

export function mountReferenceRuntime(root, pageId) {
  renderReferenceContent(root, pageId);
  bindComponentWorkbenches(root);
  initChartHover(root);
}
