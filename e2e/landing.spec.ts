import { test, expect, type Page } from "@playwright/test";
async function ready(page: Page) {
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".landing")?.dataset.motionState ===
      "ready",
  );
  await page.evaluate(() => document.fonts.ready);
}
import AxeBuilder from "@axe-core/playwright";

test("blocked GSAP after hydration fails open in normal motion mode", async ({
  page,
}) => {
  await page.route("**/*LandingMotion*", (route) => route.abort());
  await page.goto("/");
  await ready(page);
  await expect(page.locator(".hero-headline")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-body")).toHaveCSS("opacity", "1");
  for (const path of await page.locator(".hero .network-lines path").all())
    await expect(path).toHaveCSS("stroke-dashoffset", "0px");
});
test("text spacing, 200% text scale and forced colors preserve access", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await page.setViewportSize({ width: 720, height: 900 });
  await page.addStyleTag({
    content:
      "html{font-size:200%}p{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p[lang=ar]{letter-spacing:normal!important}",
  });
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    )
    .toBe(true);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator("h1")).toBeVisible();
  await page.locator(".feature-atlas summary").first().click();
  await expect(page.locator(".feature-atlas details").first()).toHaveAttribute(
    "open",
    "",
  );
});
test("slow fonts preserve the bilingual static fallback", async ({ page }) => {
  await page.route("**/*.woff2", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".hero .cta.start")).toBeVisible();
  await ready(page);
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    )
    .toBe(true);
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: selected-language journey, all atlas groups and anchors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      (locale) => localStorage.setItem("jizrak.locale", locale),
      locale,
    );
    await page.goto("/");
    await ready(page);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveAttribute("lang", locale);
    for (const id of [
      "top",
      "connected",
      "business",
      "sell",
      "catalog",
      "inventory",
      "purchasing",
      "orders",
      "pos",
      "customers",
      "understand",
      "identity",
      "operate",
      "features",
      "demo",
      "start",
    ]) {
      const s = page.locator(`#${id}`);
      expect(await s.locator(`[lang="${locale}"]`).count()).toBeGreaterThan(0);
      await expect(
        s.locator(`[lang="${locale === "en" ? "ar" : "en"}"]`),
      ).toHaveCount(0);
      await expect(s.locator("h1,h2").first()).toHaveAttribute(
        "id",
        `${id}-heading`,
      );
    }
    for (const summary of await page.locator(".feature-atlas summary").all()) {
      await summary.click();
      await expect(summary).toHaveAttribute("aria-expanded", "true");
    }
    await expect(page.locator(".feature-atlas details[open]")).toHaveCount(17);
    await expect(page.locator("main .secondary-language")).toHaveCount(0);
    await page.setViewportSize({ width: 375, height: 900 });
    await expect(page.locator(".feature-atlas details[open]")).toHaveCount(17);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const invalid = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href")!)
          .filter(
            (href) => href === "#" || !document.getElementById(href.slice(1)),
          ),
      );
    expect(invalid).toEqual([]);
    await page.locator(".hero .cta.start").click();
    await expect(page).toHaveURL(/#start$/);
    await page.locator(".hero .cta.demo").click();
    await expect(page).toHaveURL(/#demo$/);
    expect(errors).toEqual([]);
  });
  test(`${locale}: responsive widths have no horizontal overflow`, async ({
    page,
  }) => {
    await page.addInitScript(
      (locale) => localStorage.setItem("jizrak.locale", locale),
      locale,
    );
    await page.goto("/");
    await ready(page);
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          { message: `overflow at ${width} ${locale}` },
        )
        .toBe(true);
      await expect(page.locator(".header-row .cta")).toBeVisible();
    }
  });
  for (const theme of ["light", "dark"])
    test(`${locale} ${theme}: accessible landmarks and contrast`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ locale, theme }) => {
          localStorage.setItem("jizrak.locale", locale);
          localStorage.setItem("jizrak.theme", theme);
        },
        { locale, theme },
      );
      await page.goto("/");
      await ready(page);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.filter(
          (v) => v.impact === "serious" || v.impact === "critical",
        ),
      ).toEqual([]);
    });
}
test("locale changes retain section position, focus and open state", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  await page.locator("#inventory").scrollIntoViewIfNeeded();
  const before = await page
    .locator("#inventory")
    .evaluate((el) => el.getBoundingClientRect().top);
  const locale = page.getByRole("button", { name: "العربية", exact: true });
  await locale.evaluate((el) => el.focus({ preventScroll: true }));
  await locale.press("Enter");
  await expect(page.locator("h1")).toHaveAttribute("lang", "ar");
  await expect(
    page.getByRole("button", { name: "English", exact: true }),
  ).toBeFocused();
  const after = await page
    .locator("#inventory")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(after - before)).toBeLessThan(15);
  await page.reload();
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".landing")?.dataset.motionState ===
      "ready",
  );
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".landing")?.dataset.motionState ===
      "ready",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
});
test("theme light/dark/system persists and follows system preference", async ({
  page,
}) => {
  await page.goto("/");
  await ready(page);
  const control = page.getByRole("combobox", { name: "Change color theme" });
  await control.selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".landing")?.dataset.motionState ===
      "ready",
  );
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".landing")?.dataset.motionState ===
      "ready",
  );
  await expect(control).toHaveValue("dark");
  await control.selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await control.selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
test("mobile disclosure, Escape, outside click and breakpoint state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await ready(page);
  const button = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  await button.click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await button.click();
  await page.locator('#mobile-navigation a[href="#sell"]').click();
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await expect(page).toHaveURL(/#sell$/);
  await button.click();
  await page.locator("#sell h2").click();
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await button.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(button).toHaveAttribute("aria-expanded", "false");
});
test("keyboard skip link and native atlas disclosure", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  await expect(page.locator("a,button,select").first()).toHaveClass(
    "skip-link",
  );
  await page.getByRole("link", { name: "Skip to main content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const summary = page.locator(".feature-atlas summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(summary).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(summary).toHaveAttribute("aria-expanded", "false");
});
test("reduced motion and blocked animation keep core content visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/*LandingMotion*", (route) => route.abort());
  await page.goto("/");
  await ready(page);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-headline")).toHaveCSS("opacity", "1");
  await page.locator(".feature-atlas summary").first().click();
  await expect(page.locator(".feature-atlas details").first()).toHaveAttribute(
    "open",
    "",
  );
});
test("JavaScript-disabled HTML retains content and native disclosure", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".feature-atlas details")).toHaveCount(17);
  await page.locator(".feature-atlas summary").first().click();
  await expect(page.locator(".feature-atlas details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.locator(".hero .cta.start").click();
  await expect(page).toHaveURL(/#start$/);
  await context.close();
});
test("unavailable storage still allows locale and theme changes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Unavailable");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Unavailable");
    };
  });
  await page.goto("/");
  await ready(page);
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await page.getByRole("combobox").selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
