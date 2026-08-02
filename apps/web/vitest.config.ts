import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic"
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    environment: "node",
    setupFiles: ["./src/test/test-runtime.setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"]
  }
});
