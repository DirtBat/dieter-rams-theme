import { defineConfig } from "vite";

// One self-contained ES module: register it once as a dashboard resource.
export default defineConfig({
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: () => "rams-cards.js" },
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
  },
});
