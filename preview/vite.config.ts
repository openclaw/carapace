import { resolve } from "node:path";
import {
  GHOSTTY_ASSET_PATHS,
  readGhosttyAsset,
} from "@openclaw/libterminal/node";
import { defineConfig, type Plugin } from "vite";
import { createPreviewRouteStubsPlugin } from "./build-routes.js";

const previewRoot = resolve(import.meta.dirname);

function createGhosttyWasmPlugin(): Plugin {
  const assetPath = GHOSTTY_ASSET_PATHS.wasm;

  return {
    name: "carapace-ghostty-wasm",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
        if (pathname !== assetPath) {
          next();
          return;
        }
        const asset = await readGhosttyAsset(pathname);
        if (!asset) {
          next();
          return;
        }
        response.statusCode = 200;
        response.setHeader("cache-control", "no-store");
        response.setHeader("content-type", asset.contentType);
        response.setHeader("x-content-type-options", "nosniff");
        response.end(asset.body);
      });
    },
    async generateBundle() {
      const asset = await readGhosttyAsset(assetPath);
      if (!asset) {
        throw new Error(`Missing Ghostty WASM asset: ${assetPath}`);
      }
      this.emitFile({
        type: "asset",
        fileName: assetPath.slice(1),
        source: asset.body,
      });
    },
  };
}

export default defineConfig({
  root: previewRoot,
  base: "./",
  plugins: [createPreviewRouteStubsPlugin(), createGhosttyWasmPlugin()],
  build: {
    emptyOutDir: true,
    outDir: resolve(previewRoot, "../dist/preview"),
    rollupOptions: {
      input: resolve(previewRoot, "index.html"),
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/react")) return "preview-vendor";
          if (id.includes("/node_modules/lucide/")) return "preview-icons";
          return undefined;
        },
      },
    },
  },
});
