import { test, expect } from "@playwright/test";
test("apple is an independent complete journey", async ({ page }) => {
  await page.goto("/apple");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await expect(page.locator(".a-signin")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Sell your products. Run your store.",
  );
  await expect(page.locator(".a-hero")).toContainText(
    "Manage your online storefront, orders, stock, and customers in one place.",
  );
  await expect(page.locator(".a-hero")).toContainText(
    "One store today. Room for more when you need it.",
  );
  await expect(page.locator(".a-overview")).toContainText(
    "Run your Store from one place.",
  );
  await expect(page.locator('.a-applications button[aria-pressed="true"]')).toHaveText(
    "Storefront",
  );
  await page.getByRole("button", { name: "Inventory" }).click();
  await expect(page.locator('.a-applications button[aria-pressed="true"]')).toHaveText(
    "Inventory",
  );
  await expect(page.locator("#connected")).toContainText("Discover and choose");
  await expect(page.locator("#connected")).toContainText(
    "Reservation is a separate inventory state",
  );
  await expect(page.locator("#connected")).toContainText(
    "not one guaranteed simultaneous update",
  );
  await expect(page.locator("#sell")).toContainText(
    "Present and sell products",
  );
  await expect(page.locator("#sell")).toContainText("Optional in-person path");
  await expect(page.locator("#catalog")).toContainText(
    "Catalog and merchandising",
  );
  await expect(page.locator("#pos")).toContainText(
    "online selling does not depend on it",
  );
  await expect(page.locator("#operate")).toContainText(
    "Keep orders and stock under control",
  );
  await expect(page.locator("#operate")).toContainText("Replenish");
  await expect(page.locator("#operate")).toContainText("Fulfil");
  await expect(page.locator("#understand")).toContainText(
    "Understand customers and sales",
  );
  await expect(page.locator("#understand")).toContainText("Financial records");
  await expect(page.locator("#business")).toContainText(
    "When one store becomes more",
  );
  await expect(page.locator("#business")).toContainText(
    "Two separate stock ledgers",
  );
  await expect(page.locator("#business")).not.toContainText("shared inventory");
  await expect(page.locator("#faq")).toContainText(
    "Can I use Jizrak for one Store?",
  );
  await expect(page.locator("#faq")).toContainText(
    "POS is an optional in-person sales path",
  );
  await expect(page.locator("#faq details")).toHaveCount(4);
  const majorSections = await page
    .locator("main > section")
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(majorSections.indexOf("connected")).toBe(1);
  expect(majorSections.indexOf("connected")).toBeLessThan(
    majorSections.indexOf("business"),
  );
  expect(majorSections.indexOf("connected")).toBeLessThan(
    majorSections.indexOf("sell"),
  );
  expect(majorSections.indexOf("understand")).toBeLessThan(
    majorSections.indexOf("business"),
  );
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
    "faq",
    "features",
    "demo",
    "start",
  ])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#features details")).toHaveCount(17);
  await page.locator("#group-17 summary").click();
  await expect(page.locator("#group-17")).toContainText(
    "Installable PWA and cached assets; web push when configured;",
  );
  await expect(page.locator("main")).not.toContainText(
    "restricted Platform Super Admin recovery",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
});
import AxeBuilder from "@axe-core/playwright";
import coverage from "../docs/apple-content-coverage.json" with { type: "json" };
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: exact copy, disclosures, themes and responsive accessibility`, async ({
    page,
  }) => {
    await page.addInitScript(
      (locale) => localStorage.setItem("jizrak.locale", locale),
      locale,
    );
    await page.goto("/apple");
    await page.waitForFunction(
      () => document.documentElement.dataset.hydrated === "true",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await page.locator("#features summary").first().click();
    await page
      .getByRole("button", {
        name: locale === "en" ? "العربية" : "English",
        exact: true,
      })
      .press("Enter");
    await expect(page.locator("#features details").first()).toHaveAttribute(
      "open",
      "",
    );
    await expect(
      page.getByRole("button", {
        name: locale === "en" ? "English" : "العربية",
        exact: true,
      }),
    ).toBeFocused();
    await page
      .getByRole("button", {
        name: locale === "en" ? "English" : "العربية",
        exact: true,
      })
      .press("Enter");
    await page
      .locator("main details")
      .evaluateAll((elements) =>
        elements.forEach((element) => element.setAttribute("open", "")),
      );
    const text = await page.locator(".apple-page").innerText();
    for (const entry of coverage.entries.filter(
      (entry) =>
        entry.locale === locale &&
        ["visible", "expanded"].includes(entry.state) &&
        !["copyright", "footer-nav"].includes(entry.id),
    ))
      expect(text, entry.id).toContain(entry.text);
    for (const theme of ["light", "dark"]) {
      await page.getByRole("combobox").selectOption(theme);
      for (const width of [320, 375, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${theme} ${width}`,
        ).toBe(true);
      }
      const result = await new AxeBuilder({ page })
        .include(".apple-page")
        .analyze();
      expect(result.violations).toEqual([]);
    }
  });
}
test("native fallback and route-local anchors work without JavaScript", async ({
  browser,
}) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto("/apple");

  await expect(page.locator("h1")).toHaveText(
    "Sell your products. Run your store.",
  );
  await expect(page.locator("#connected")).toContainText(
    "The Store reserves availability",
  );
  await expect(page.locator("#sell")).toContainText(
    "Cart, shipping, and payment",
  );
  await expect(page.locator("#operate")).toContainText("Know what can be sold");
  await expect(page.locator("#understand")).toContainText("See the patterns");
  await expect(page.locator("#business")).toContainText(
    "Add another Store without combining its records with the first.",
  );
  await expect(page.locator("#faq")).toContainText(
    "Exact onboarding requirements are not published here",
  );
  await expect(page.locator("#faq")).toContainText(
    "cash on delivery where enabled",
  );
  await page.locator("#group-17 summary").click();
  await expect(page.locator("#group-17 p")).toBeVisible();
  const hrefs = await page
    .locator('a[href^="/apple#"]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")!),
    );
  for (const href of hrefs)
    await expect(page.locator(href.replace("/apple", ""))).toHaveCount(1);
  await expect(page.locator("link[rel=canonical]")).toHaveCount(1);
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    /\/apple$/,
  );
  await page.close();
});
test("mobile navigation dismisses, restores focus and survives rapid input", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/apple");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  const trigger = page.locator(".a-menu > summary");
  // A native summary exposes a button role in Chromium.
  await trigger.click();
  await expect(trigger).toHaveAccessibleName("Close navigation");
  expect(
    await trigger.evaluate((el) => getComputedStyle(el, "::after").content),
  ).toBe("none");
  await page.locator("h1").evaluate((el) => {
    el.setAttribute("tabindex", "-1");
    el.focus();
  });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator(".a-menu")).not.toHaveAttribute("open", "");
  await trigger.click();
  await page.mouse.click(8, 850);
  await expect(page.locator(".a-menu")).not.toHaveAttribute("open", "");
  await trigger.click();
  await page.locator('.a-menu a[href="/apple#features"]').click();
  await expect(page.locator(".a-menu")).not.toHaveAttribute("open", "");
  await expect(page).toHaveURL(/\/apple#features$/);
});

test("mobile stories stay within the reading column in both languages", async ({
  page,
}) => {
  await page.goto("/apple");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  for (const locale of ["en", "ar"]) {
    if (locale === "ar")
      await page.getByRole("button", { name: "العربية", exact: true }).click();
    for (const width of [320, 375, 768]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of ["purchasing", "orders", "identity", "operate"]) {
        const size = await page.locator(`#${id}`).evaluate((el) => ({
          story: el.getBoundingClientRect().width,
          main: el.closest("main")!.getBoundingClientRect().width,
        }));
        expect(size.story, `${locale} ${width} ${id}`).toBeGreaterThan(0);
        expect(size.story, `${locale} ${width} ${id}`).toBeLessThanOrEqual(
          size.main + 1,
        );
      }
    }
  }
});

test("preferences, reading position and presentation remain usable under adverse conditions", async ({
  browser,
}) => {
  const page = await browser.newPage({
    locale: "ar-EG",
    viewport: { width: 320, height: 900 },
    reducedMotion: "reduce",
    colorScheme: "dark",
  });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.route("**/*.woff2", (route) => route.abort());
  await page.goto("/apple#inventory");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator("#inventory").scrollIntoViewIfNeeded();
  const offset = await page
    .locator("#inventory")
    .evaluate((el) => el.getBoundingClientRect().top);
  const languageControl = await page
    .getByRole("button", { name: "English", exact: true })
    .boundingBox();
  expect(languageControl).not.toBeNull();
  // Click the visible sticky control without locator auto-scrolling the reading position.
  await page.mouse.click(
    languageControl!.x + languageControl!.width / 2,
    languageControl!.y + languageControl!.height / 2,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect
    .poll(async () =>
      Math.abs(
        (await page
          .locator("#inventory")
          .evaluate((el) => el.getBoundingClientRect().top)) - offset,
      ),
    )
    .toBeLessThan(120);
  await page.getByRole("combobox").selectOption("system");
  await page.emulateMedia({ colorScheme: "light", forcedColors: "active" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.addStyleTag({ content: "html {font-size:200%}" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.locator("#inventory-details summary").click();
  await expect(page.locator("#inventory-details")).toHaveAttribute("open", "");
  await page.close();
});
test("client route history preserves root presentation and localized metadata", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("jizrak.locale", "ar"));
  await page.goto("/");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  const title = await page.title();
  const before = await page.locator("h1").evaluate((el) => ({
    font: getComputedStyle(el).fontFamily,
    size: getComputedStyle(el).fontSize,
  }));
  await page.evaluate(() => {
    history.pushState({}, "", "/apple");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator(".apple-page")).toBeVisible();
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    /\/apple$/,
  );
  await expect(page).toHaveTitle(title);
  await page.goBack();
  await expect(page.locator(".landing")).toBeVisible();
  await expect(page).toHaveTitle(title);
  expect(
    await page.locator("h1").evaluate((el) => ({
      font: getComputedStyle(el).fontFamily,
      size: getComputedStyle(el).fontSize,
    })),
  ).toEqual(before);
  await expect(page.locator("link[rel=canonical]")).not.toHaveAttribute(
    "href",
    /\/apple$/,
  );
  await page.goForward();
  await expect(page.locator(".apple-page")).toBeVisible();
});

test("section navigation follows the reading position and clears at the introduction", async ({
  page,
}) => {
  await page.goto("/apple");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  const links = page.locator(".a-desktop a");
  await expect(page.locator(".a-desktop a[aria-current]")).toHaveCount(0);
  await links.filter({ hasText: "Sell" }).click();
  await expect(
    page.locator('.a-desktop a[href="/apple#sell"]'),
  ).toHaveAttribute("aria-current", "location");
  await page
    .locator("#inventory")
    .evaluate((element) =>
      window.scrollTo(
        0,
        window.scrollY + element.getBoundingClientRect().top - 100,
      ),
    );
  await expect(
    page.locator('.a-desktop a[href="/apple#operate"]'),
  ).toHaveAttribute("aria-current", "location");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(".a-desktop a[aria-current]")).toHaveCount(0);
});

test("the hero restores the connected commerce capability card", async ({
  page,
}) => {
  await page.goto("/apple");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await expect(page.locator(".a-overview")).toContainText(
    "Run your Store from one place.",
  );
  await expect(page.locator(".a-applications button")).toHaveCount(8);
  await page.getByRole("button", { name: "Multiple Stores" }).click();
  await expect(
    page.locator('.a-applications button[aria-pressed="true"]'),
  ).toHaveText("Multiple Stores");
  await expect(page.locator(".a-capability-detail")).toContainText(
    "under one Business",
  );
});

test("apple navigation and static workflow rails match their responsive affordances", async ({
  page,
}) => {
  await page.goto("/apple");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );

  await page.setViewportSize({ width: 1265, height: 900 });
  await expect(page.locator(".a-desktop")).toBeVisible();
  await expect(page.locator(".a-menu")).not.toBeVisible();

  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.locator(".a-desktop")).not.toBeVisible();
  await expect(page.locator(".a-menu")).toBeVisible();

  await page.locator("#inventory").scrollIntoViewIfNeeded();
  await expect(page.locator("#inventory .stage-line-stage").first()).toHaveCSS(
    "cursor",
    "default",
  );
  await expect(page.locator("#inventory .stage-line-stage").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(
    page.locator("#understand-performance"),
  ).toHaveRole("region");
  await expect(
    page.locator("#understand-performance h2"),
  ).toHaveText("Performance reporting");
  await expect(
    page.locator("#understand-performance .a-details"),
  ).toBeVisible();
  const insightCards = page.locator("#understand .a-insight-card");
  await expect(insightCards).toHaveCount(2);
  for (const card of await insightCards.all()) {
    await expect(card.locator(".a-kicker")).toBeVisible();
    await expect(card.locator(".a-intro h2")).toBeVisible();
    await expect(card.locator(".a-intro .a-body")).toBeVisible();
  }
  const insightHeadingSizes = await page
    .locator("#understand .a-insight-card .a-intro h2")
    .evaluateAll((headings) =>
      headings.map((heading) => getComputedStyle(heading).fontSize),
    );
  expect(new Set(insightHeadingSizes).size).toBe(1);

  await page.setViewportSize({ width: 1265, height: 900 });
  await page.locator("#understand").scrollIntoViewIfNeeded();
  const desktopCardRects = await page
    .locator("#understand .a-insight-card")
    .evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { top: rect.top, width: rect.width };
      }),
    );
  expect(Math.abs(desktopCardRects[1].top - desktopCardRects[0].top)).toBeLessThan(2);
  expect(desktopCardRects[0].width).toBeGreaterThan(400);
  expect(desktopCardRects[1].width).toBeGreaterThan(400);

  await page.setViewportSize({ width: 820, height: 900 });
  await page.locator("#understand").scrollIntoViewIfNeeded();
  const insightCardRects = await page
    .locator("#understand .a-insight-card")
    .evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { left: rect.left, top: rect.top, width: rect.width };
      }),
    );
  expect(insightCardRects).toHaveLength(2);
  expect(insightCardRects[1].top).toBeGreaterThan(insightCardRects[0].top);
  expect(insightCardRects[0].width).toBeGreaterThan(500);
  expect(insightCardRects[1].width).toBeGreaterThan(500);
  for (const card of await insightCards.all()) {
    await expect(card.locator(".a-kicker")).toBeVisible();
    await expect(card.locator(".a-intro h2")).toBeVisible();
    await expect(card.locator(".stage-line")).toBeVisible();
  }

  await page.setViewportSize({ width: 640, height: 900 });
  await page.locator("#understand").scrollIntoViewIfNeeded();
  const narrowCardTops = await page
    .locator("#understand .a-insight-card")
    .evaluateAll((cards) =>
      cards.map((card) => card.getBoundingClientRect().top),
    );
  expect(narrowCardTops[1]).toBeGreaterThan(narrowCardTops[0]);
});
