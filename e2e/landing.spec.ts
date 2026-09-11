import { test, expect } from "@playwright/test";

test("the root and feature guide are public while retired routes stay unavailable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".jizrak-world")).toBeVisible();
  await expect(page.locator("h1")).toContainText("Your business.");
  const canonical = await page.locator("link[rel=canonical]").getAttribute("href");
  expect(new URL(canonical!).pathname).toBe("/");

  await page.getByRole("link", { name: "Features", exact: true }).click();
  await expect(page).toHaveURL(/\/features$/);
  await expect(page.locator("h1")).toContainText("Your store.");
  await expect(page).toHaveTitle(/Jizrak features/);
  await expect(page.locator("link[rel=canonical]")).toHaveCount(1);
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /\/features$/);

  for (const retiredPath of ["/apple", "/prototype/workflow-items"]) {
    const response = await page.goto(retiredPath);
    expect(response?.status()).toBe(404);
    await expect(page.locator(".jizrak-world")).toHaveCount(0);
  }
});
