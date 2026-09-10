import { test, expect } from "@playwright/test";

test("the promoted root is the only public landing route", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".apple-page")).toBeVisible();
  await expect(page.locator("h1")).toContainText("Run your Store");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    /\/$/,
  );

  for (const retiredPath of ["/apple", "/prototype/workflow-items"]) {
    const response = await page.goto(retiredPath);
    expect(response?.status()).toBe(404);
    await expect(page.locator(".apple-page")).toHaveCount(0);
  }
});
