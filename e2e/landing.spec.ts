import { test, expect } from "@playwright/test";

test("the promoted root is the only public landing route", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".jizrak-world")).toBeVisible();
  await expect(page.locator("h1")).toContainText("Your business.");
  const canonical = await page.locator("link[rel=canonical]").getAttribute("href");
  expect(new URL(canonical!).pathname).toBe("/");

  for (const retiredPath of ["/apple", "/prototype/workflow-items"]) {
    const response = await page.goto(retiredPath);
    expect(response?.status()).toBe(404);
    await expect(page.locator(".jizrak-world")).toHaveCount(0);
  }
});
