import { test, expect } from "@playwright/test";

test.describe("Admin smoke", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await expect(page.locator("body")).toContainText(/admin|sign|login|email/i, {
      timeout: 45_000,
    });
  });
});
