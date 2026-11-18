import { defineConfig } from "vite";

// One self-contained ES module: register it once as a dashboard resource.
export default defineConfig({
  define: { __BUILT__: JSON.stringify(new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC") },
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: () => "dieter-rams-theme.js" },
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
  },
});
