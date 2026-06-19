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
      "@game-tracker/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      "@game-tracker/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@game-tracker/domain": path.resolve(__dirname, "../../packages/domain/src/index.ts"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  esbuild: {
    jsx: "automatic",
  },
});

