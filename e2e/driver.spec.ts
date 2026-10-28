import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Driver demo flow", () => {
  test("login and dashboard map render", async ({ page }) => {
    await page.goto("http://localhost:3002/login");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole("button", { name: /continue to dashboard/i }).click();
    await page.waitForURL("**/dashboard**", { timeout: 60_000 });
    await page.screenshot({ path: path.join("e2e-screenshots", "driver-dashboard.png"), fullPage: true });
    const goOnline = page.getByRole("button", { name: /^Go online$/i });
    if (await goOnline.isVisible()) await goOnline.click();
    await expect(page.getByRole("button", { name: "Accept" })).toBeVisible({ timeout: 55_000 });
    await page.screenshot({ path: path.join("e2e-screenshots", "driver-incoming.png"), fullPage: true });
  });
});
