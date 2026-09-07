import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const results = [];
for (const locale of ["en", "ar"])
  for (const theme of ["light", "dark"])
    for (const width of [375, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      await page.addInitScript(
        ({ locale, theme }) => {
          localStorage.setItem("jizrak.locale", locale);
          localStorage.setItem("jizrak.theme", theme);
        },
        { locale, theme },
      );
      await page.goto("http://127.0.0.1:3000/");
      await page.waitForFunction(
        () => document.documentElement.dataset.hydrated === "true",
      );
      await page.evaluate(() => document.fonts.ready);
      await page.locator(".feature-atlas summary").first().click();
      await page.evaluate(() => scrollTo(0, 0));
      const path = `docs/apple-evidence/root-after-${locale}-${theme}-${width}.png`;
      const shot = await page.screenshot({ path, fullPage: true });
      const before = await readFile(path.replace("after", "before"));
      results.push({ locale, theme, width, identical: shot.equals(before) });
      await page.evaluate(() => {
        history.pushState({}, "", "/apple");
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      await page.waitForSelector(".apple-page");
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `docs/apple-evidence/apple-${locale}-${theme}-${width}.png`,
        fullPage: true,
      });
      await page.evaluate(() => {
        history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      await page.waitForSelector(".landing");
      await page.evaluate(() => document.fonts.ready);
      await page.locator(".feature-atlas summary").first().click();
      await page.evaluate(() => scrollTo(0, 0));
      const returned = await page.screenshot({
        path: `docs/apple-evidence/root-return-${locale}-${theme}-${width}.png`,
        fullPage: true,
      });
      results.at(-1).returnIdentical = returned.equals(before);
      results.at(-1).canonical = await page
        .locator("link[rel=canonical]")
        .getAttribute("href");
      await page.close();
    }
await writeFile(
  "docs/apple-evidence/root-comparison.json",
  JSON.stringify(results, null, 2),
);
console.log(results);
await browser.close();
