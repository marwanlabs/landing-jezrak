import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.requestPointerLock = () =>
      Promise.reject(new Error("Disabled in test"));
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    localStorage.setItem("jizrak.locale", "en");
    localStorage.setItem("jizrak.theme", "light");
  });
  await page.goto("/");
});

test("sales channels and every root expose their own relevant explanation", async ({
  page,
}) => {
  await expect(page.locator("h1")).toHaveText("Your business.Stronger roots.");
  await page
    .getByRole("button", { name: "At the counter", exact: true })
    .click();
  await expect(page.locator(".rd-channel-content")).toContainText(
    "Open a shift",
  );
  await page.getByRole("button", { name: "Online", exact: true }).click();
  await expect(page.locator(".rd-channel-content")).toContainText("bundles");
  const rootButtons = page.locator(".rd-root-node");
  const phrases = [
    "Know what you can promise.",
    "Give every order a clear path.",
    "Keep the next sale possible.",
    "Remember the person behind the purchase.",
    "See the business behind the numbers.",
  ];
  for (let index = 0; index < phrases.length; index++) {
    await rootButtons.nth(index).click();
    await expect(rootButtons.nth(index)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("#rd-root-detail h3")).toHaveText(phrases[index]);
  }
  await expect(page.locator("#rd-root-detail a")).toHaveAttribute(
    "href",
    "/features#understand",
  );
});

test("keyboard, disclosures and onboarding remain usable", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.locator(".rd-skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await page
    .getByText("The right access for each person.", { exact: true })
    .click();
  await expect(page.locator(".rd-principles details").nth(1)).toHaveAttribute(
    "open",
    "",
  );
  await page.locator(".rd-close-content .rd-button").click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.locator("h1")).toBeVisible();
});

test("compact Arabic reduced-motion page retains selection, menu and readable layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".rd-root-node-2").click();
  await page.locator(".rd-language").click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".rd-root-node-2")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("#rd-root-detail h3")).toHaveText(
    "جهّز مخزونك للبيع القادم.",
  );
  await expect(page.locator(".rd-root-stage")).toHaveCSS(
    "position",
    "relative",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator(".rd-menu-button").click();
  await expect(page.locator("#rd-mobile-nav")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#rd-mobile-nav")).toBeHidden();
  await expect(page.locator(".rd-menu-button")).toBeFocused();
});

test("theme switch does not replace the selected root", async ({ page }) => {
  await page.locator(".rd-root-node-4").click();
  await page.locator(".rd-theme").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".rd-root-node-4")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".rd-hero .rd-button")).toBeVisible();
});
