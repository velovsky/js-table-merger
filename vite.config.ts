import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) =>
  mode === "demo"
    ? {
        root: "demo",
        base: "./",
        build: { outDir: "../dist-demo", emptyOutDir: true },
      }
    : {
        build: {
          lib: {
            entry: "src/index.ts",
            name: "TableMerger",
            formats: ["es", "iife"],
            fileName: (format) => (format === "es" ? "table-merger.js" : "table-merger.iife.js"),
          },
        },
        test: { environment: "jsdom" },
      },
);
