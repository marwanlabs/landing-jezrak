import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.requestPointerLock = () => Promise.reject(new Error("Disabled in test"));
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    localStorage.setItem("jizrak.locale", "en");
  });
  await page.goto("/");
  await expect(page.locator(".w-ready")).toBeVisible();
});

test("the merchant can navigate the whole connected business", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your business. All connected.");
  const route = page.locator(".w-route button");
  await expect(route).toHaveCount(5);
  for (let index = 0; index < 5; index++) {
    await route.nth(index).click();
    await expect(page.locator(`[data-index="${index}"]`)).toHaveAttribute("aria-hidden", "false");
    await expect(route.nth(index)).toHaveAttribute("aria-current", "step");
  }
  await expect(page.locator('[data-index="4"]')).toContainText("stock ledger independent");
});

test("merchant choices carry from brand to stock reservation and the close", async ({ page }) => {
  await page.locator(".w-route button").nth(1).click();
  await page.getByRole("button", { name: "Clothing", exact: true }).click();
  await expect(page.locator(".w-store-top")).toContainText("FORME");
  await page.locator(".w-route button").nth(2).click();
  await page.getByRole("button", { name: "Reserve one more", exact: true }).click();
  await expect(page.locator("output")).toHaveText("2");
  await expect(page.locator(".w-reservation-result")).toContainText("22");
  await expect(page.locator(".w-order-slip")).toContainText("Everyday tee");
  await expect(page.locator('[data-index="2"]')).toContainText("Stock is consumed through the supported sale workflow");
  await page.locator(".w-route button").nth(4).click();
  await expect(page.locator('[data-index="4"] .w-small')).toContainText("Clothing");
});

test("details, FAQ, and honest onboarding remain usable", async ({ page }) => {
  await page.locator(".w-header-links button").click();
  await expect(page.locator("dialog")).toBeVisible();
  await expect(page.locator("dialog")).not.toContainText("restricted Platform Super Admin recovery");
  await page.getByText("Do I need to use POS?", { exact: true }).click();
  await expect(page.locator("dialog details[open]")).toContainText("optional in-person sales path");
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Start your Business", exact: true }).click();
  await expect(page.locator("dialog")).toContainText("will be linked here when it is ready");
});

test("Arabic keeps the visitor at the same waypoint", async ({ page }) => {
  await page.locator(".w-route button").nth(2).click();
  await page.locator(".w-language").click();
  await expect(page.locator(".jizrak-world")).toHaveAttribute("dir", "rtl");
  await expect(page.locator('[data-index="2"]')).toHaveAttribute("aria-hidden", "false");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("وراء كل طلب، أنت تدير التفاصيل.");
});

test("compact reduced-motion visitors can reach and operate every waypoint", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".w-ready")).toBeVisible();
  for (let index = 0; index < 5; index++) {
    await page.locator(".w-route button").nth(index).click();
    await expect(page.locator(`[data-index="${index}"]`)).toHaveAttribute("aria-hidden", "false");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Questions?", exact: true }).click();
  await expect(page.locator("dialog")).toBeVisible();
});
