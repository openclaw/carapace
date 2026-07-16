import { resolve } from "node:path";
import { defineConfig } from "vite";
import { createPreviewRouteStubsPlugin } from "./build-routes.js";

const previewRoot = resolve(import.meta.dirname);

export default defineConfig({
  root: previewRoot,
  base: "./",
  plugins: [createPreviewRouteStubsPlugin()],
  build: {
    emptyOutDir: true,
    outDir: resolve(previewRoot, "../dist/preview"),
    rollupOptions: { input: resolve(previewRoot, "index.html") },
  },
});
