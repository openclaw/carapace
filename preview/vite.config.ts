import { resolve } from "node:path";
import { defineConfig } from "vite";

const previewRoot = resolve(import.meta.dirname);

export default defineConfig({
  root: previewRoot,
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: resolve(previewRoot, "../dist/preview"),
  },
});
