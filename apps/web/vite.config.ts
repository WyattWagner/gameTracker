import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@game-tracker/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      "@game-tracker/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@game-tracker/domain": path.resolve(__dirname, "../../packages/domain/src/index.ts"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
      "/uploads": "http://localhost:3001",
    },
  },
});
