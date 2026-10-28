import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const shot = (name: string) => path.join("e2e-screenshots", "reference-capture", name);

const refImage = path.join(
  process.cwd(),
  "e2e-screenshots",
  "almosafar-ui-reference.jpg"
);

test.beforeAll(() => {
  fs.mkdirSync(path.join("e2e-screenshots", "reference-capture"), { recursive: true });
  const asset = path.join(
    process.cwd(),
    "..",
    ".cursor",
    "projects",
    "c-Users-Admin-Desktop-uber-clone",
    "assets",
    "c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_645eddc59b47b47ed6b5ee0a8fda9c48_images_a_clean_infographic_mockup_collage_on_a_white_back-c19bb41e-63ce-4c67-aabd-062b7a23749c.jpg"
  );
  const localRef = path.join(process.cwd(), "e2e-screenshots", "almosafar-ui-reference.jpg");
  if (!fs.existsSync(localRef) && fs.existsSync(asset)) {
    fs.copyFileSync(asset, localRef);
  }
});

test.describe("Passenger — 17-screen journey (capture)", () => {
  test("screens 1–17", async ({ page }) => {
    await page.goto("http://localhost:3001/");
    await page.waitForTimeout(800);
    await page.screenshot({ path: shot("p01-splash.png"), fullPage: true });

    await page.goto("http://localhost:3001/onboarding");
    await expect(page.getByText(/Move around Baghdad/i)).toBeVisible();
    await page.screenshot({ path: shot("p02-onboarding.png"), fullPage: true });

    await page.goto("http://localhost:3001/login");
    await page.screenshot({ path: shot("p03-login.png"), fullPage: true });
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/home**", { timeout: 60_000 });
    await expect(page.getByText(/Where to/i)).toBeVisible({ timeout: 60_000 });
    await page.screenshot({ path: shot("p04-home-map.png"), fullPage: true });

    await page.getByRole("button", { name: /Where to\?/i }).click();
    await page.screenshot({ path: shot("p05-location-search.png"), fullPage: true });

    await page.goto("http://localhost:3001/booking/route");
    await expect(page.getByRole("heading", { name: /choose a ride/i })).toBeVisible({
      timeout: 30_000,
    });
    await page.screenshot({ path: shot("p06-vehicles.png"), fullPage: true });

    await page.goto("http://localhost:3001/booking/confirm");
    await expect(page.getByRole("heading", { name: /confirm ride/i })).toBeVisible({
      timeout: 30_000,
    });
    await page.screenshot({ path: shot("p07-confirm.png"), fullPage: true });

    await page.goto("http://localhost:3001/ride/searching/demo-placeholder");
    await page.waitForTimeout(500);
    await page.screenshot({ path: shot("p08-searching-layout.png"), fullPage: true });

    await page.goto("http://localhost:3001/home/history");
    await page.screenshot({ path: shot("p14-history.png"), fullPage: true });
    await page.goto("http://localhost:3001/home/profile");
    await page.screenshot({ path: shot("p15-profile.png"), fullPage: true });
    await page.goto("http://localhost:3001/payments");
    await page.screenshot({ path: shot("p16-payments.png"), fullPage: true });
    await page.goto("http://localhost:3001/settings");
    await page.screenshot({ path: shot("p17-settings.png"), fullPage: true });
  });
});

test.describe("Driver — 9-screen journey (capture)", () => {
  test("screens 1–9", async ({ page }) => {
    await page.goto("http://localhost:3002/login");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.screenshot({ path: shot("d01-login.png"), fullPage: true });
    await page.getByRole("button", { name: /continue to dashboard/i }).click();
    await page.waitForURL("**/dashboard**", { timeout: 60_000 });
    await page.screenshot({ path: shot("d02-dashboard.png"), fullPage: true });
    const goOnline = page.getByRole("button", { name: /^Go online$/i });
    if (await goOnline.isVisible()) await goOnline.click();
    await expect(page.getByRole("button", { name: "Accept" })).toBeVisible({ timeout: 45_000 });
    await page.screenshot({ path: shot("d03-incoming.png"), fullPage: true });
    await page.goto("http://localhost:3002/earnings");
    await page.screenshot({ path: shot("d08-earnings.png"), fullPage: true });
    await page.goto("http://localhost:3002/settings");
    await page.screenshot({ path: shot("d09-profile-settings.png"), fullPage: true });
  });
});

test.describe("Admin dashboard (capture)", () => {
  test("desktop dashboard", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("http://localhost:3000/login");
    await page.locator("button[type=submit]").click();
    await page.waitForURL("**/dashboard**", { timeout: 60_000 });
    await expect(page.getByText(/Total rides/i)).toBeVisible();
    await page.screenshot({ path: shot("a01-dashboard.png"), fullPage: true });
  });
});

test.describe("Reference collage sanity", () => {
  test("reference asset exists for manual comparison", async () => {
    const localRef = path.join(process.cwd(), "e2e-screenshots", "almosafar-ui-reference.jpg");
    expect(fs.existsSync(localRef)).toBeTruthy();
  });
});
