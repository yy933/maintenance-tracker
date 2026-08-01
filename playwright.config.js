import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", // e2e files directory
  timeout: 30000, // single test timeout (30 seconds)
  use: {
    baseURL: "http://localhost:5173", // Vite / React development server URL
    trace: "on-first-retry",
  },
  // Automatically start the frontend development server before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
