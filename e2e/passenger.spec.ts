import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Passenger demo flow", () => {
  test("login, map home, booking screens render", async ({ page }) => {
    await page.goto("http://localhost:3001/login");
    await page.evaluate(() => localStorage.removeItem("almosafar.passenger.booking"));
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/home**", { timeout: 60_000 });
    await expect(page.getByText(/Where to\?/i)).toBeVisible({ timeout: 60_000 });
    await page.screenshot({ path: path.join("e2e-screenshots", "passenger-home.png"), fullPage: true });
    await page.goto("http://localhost:3001/booking/route");
    await expect(page.getByRole("heading", { name: /choose a ride/i })).toBeVisible({ timeout: 45_000 });
    await page.screenshot({ path: path.join("e2e-screenshots", "passenger-route.png"), fullPage: true });
    await page.goto("http://localhost:3001/booking/confirm");
    await expect(page.getByRole("heading", { name: /confirm ride/i })).toBeVisible({ timeout: 30_000 });
    await page.screenshot({ path: path.join("e2e-screenshots", "passenger-confirm.png"), fullPage: true });
  });
});
