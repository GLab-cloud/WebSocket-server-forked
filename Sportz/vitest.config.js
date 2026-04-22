import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/ws/vitest.setup.js"],
  },
});
