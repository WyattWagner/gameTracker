import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
  resolve: {
    alias: {
      "@game-tracker/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@game-tracker/shared": path.resolve(__dirname, "../../packages/shared/src"),
    },
  },
  esbuild: {
    jsx: "automatic",
  },
});

