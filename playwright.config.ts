import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    ...devices["Pixel 7"],
    trace: "on-first-retry",
    screenshot: "on",
  },
  projects: [
    { name: "passenger", testMatch: /passenger\.spec\.ts/ },
    { name: "driver", testMatch: /driver\.spec\.ts/ },
    { name: "admin", testMatch: /admin\.spec\.ts/ },
    { name: "ui-tour", testMatch: /ui-reference-tour\.spec\.ts/ },
  ],
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : [
        {
          command: "npm run start -w @almosafar/admin",
          url: "http://localhost:3000/login",
          reuseExistingServer: true,
          timeout: 180_000,
        },
        {
          command: "npm run start -w @almosafar/passenger",
          url: "http://localhost:3001/login",
          reuseExistingServer: true,
          timeout: 180_000,
        },
        {
          command: "npm run start -w @almosafar/driver",
          url: "http://localhost:3002/login",
          reuseExistingServer: true,
          timeout: 180_000,
        },
      ],
});
