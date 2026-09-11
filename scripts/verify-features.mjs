import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import fs from "node:fs";

const base = process.env.FEATURE_URL || "http://127.0.0.1:4100";
const out = process.env.FEATURE_OUT || "scrollcraft/builds/jizrak-features/lab";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const results = [];
const safety = () => {
  Element.prototype.requestPointerLock = () =>
    Promise.reject(new Error("Disabled for verification"));
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Document.prototype.exitPointerLock = () => {};
};
try {
  for (const [name, width, height, locale, theme, reducedMotion] of [
    ["desktop", 1440, 900, "en", "light", "no-preference"],
    ["phone", 390, 844, "en", "light", "no-preference"],
    ["compact-ar", 360, 640, "ar", "light", "no-preference"],
    ["dark-ar", 1440, 900, "ar", "dark", "no-preference"],
    ["reduced", 390, 844, "en", "light", "reduce"],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion,
    });
    await context.addInitScript(safety);
    await context.addInitScript(
      ({ locale, theme }) => {
        localStorage.setItem("jizrak.locale", locale);
        localStorage.setItem("jizrak.theme", theme);
      },
      { locale, theme },
    );
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${base}/features`);
    await page.waitForSelector(".f-ready");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${out}/${name}-opening.png` });
    assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
    assert.match(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      /\/features$/,
    );
    assert.match(await page.title(), locale === "ar" ? /ميزات/ : /features/);
    const samples = [];
    for (const [i, id] of [
      "brand",
      "prepare",
      "sell",
      "understand",
      "grow",
      "feature-index",
    ].entries()) {
      await page
        .locator(`#${id}`)
        .evaluate((el) =>
          window.scrollTo({
            top: el.getBoundingClientRect().top + scrollY - 75,
            behavior: "instant",
          }),
        );
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${out}/${name}-${i}.png` });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, `${name}/${id} overflows`);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      samples.push({
        id,
        violations: axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
      // Intermediate frames prove composition across each spread, not only its entry.
      if (name === "desktop" || name === "phone") {
        for (const fraction of [0.35, 0.7]) {
          await page.locator(`#${id}`).evaluate((el, f) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + el.clientHeight * f - 75, behavior: "instant" }), fraction);
          await page.waitForTimeout(100);
          await page.screenshot({ path: `${out}/${name}-${i}-${fraction}.png` });
        }
      }
    }
    if (locale === "en") {
      await page.locator(".f-brand-editor input").fill("STUDIO");
      assert.equal(
        await page.locator(".f-specimen-name").textContent(),
        "STUDIO",
      );
      await page
        .getByRole("button", { name: "Terracotta", exact: true })
        .click();
      assert.equal(
        await page.locator(".f-brand-scene").getAttribute("data-clay"),
        "true",
      );
      await page
        .getByRole("button", { name: "Fewer pieces", exact: true })
        .click();
      assert.equal(
        await page.locator(".f-assembly-result strong").textContent(),
        "3",
      );
      await page
        .getByRole("button", { name: "Place sample order", exact: true })
        .click();
      assert.deepEqual(
        await page.locator(".f-stock-ledger strong").allTextContents(),
        ["24", "1", "23"],
      );
      await page
        .getByRole("button", { name: "Fulfil sample order", exact: true })
        .click();
      assert.deepEqual(
        await page.locator(".f-stock-ledger strong").allTextContents(),
        ["23", "0", "23"],
      );
      assert.match(await page.locator(".f-gross dd").textContent(), /300/);
      await page
        .getByRole("button", { name: "At the counter", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Record sample sale", exact: true })
        .click();
      assert.deepEqual(
        await page.locator(".f-stock-ledger strong").allTextContents(),
        ["23", "0", "23"],
      );
      await page
        .getByRole("button", { name: "Close sample shift", exact: true })
        .click();
      assert.match(
        await page.locator(".f-sale-state").textContent(),
        /Shift closed/,
      );
      await page.screenshot({ path: `${out}/${name}-transaction.png` });
    }
    const trigger = page.locator(".f-prep-notes .f-detail-link").first();
    await trigger.click();
    assert.equal(await page.locator("dialog").evaluate((el) => el.open), true);
    await page.screenshot({ path: `${out}/${name}-drawer.png` });
    const drawerAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await page.keyboard.press("Escape");
    assert.equal(
      await trigger.evaluate((el) => document.activeElement === el),
      true,
    );
    await page
      .locator(".f-search input")
      .fill(locale === "ar" ? "باركود" : "barcode");
    assert.equal(await page.locator(".f-reference-list details").count(), 1);
    await page.locator(".f-reference-list summary").click();
    assert.equal(
      await page.locator(".f-reference-list details").evaluate((el) => el.open),
      true,
    );
    await page.locator(".f-search input").fill("zzzzzzzzz");
    assert.equal(await page.locator(".f-reference-list details").count(), 0);
    await page.locator(".f-no-results button").click();
    assert.equal(await page.locator(".f-reference-list details").count(), 17);
    results.push({
      name,
      errors,
      samples,
      drawerViolations: drawerAxe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
    console.log(name, "checked", JSON.stringify(results.at(-1)));
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.addInitScript(safety);
  const page = await context.newPage();
  await page.goto(`${base}/features`);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator(".f-reference-list details").count(), 17);
  await page.locator(".f-reference-list summary").first().click();
  assert.equal(
    await page
      .locator(".f-reference-list details")
      .first()
      .evaluate((el) => el.open),
    true,
  );
  await context.close();
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(results, null, 2));
  assert.equal(
    results.flatMap((r) => r.errors).length,
    0,
    "Browser/network errors",
  );
  assert.equal(
    results.flatMap((r) => [
      ...r.drawerViolations,
      ...r.samples.flatMap((s) => s.violations),
    ]).length,
    0,
    "Accessibility violations; inspect report.json",
  );
  console.log(
    "All feature journey checks passed, including no-JavaScript disclosure.",
  );
} finally {
  await browser.close();
}
