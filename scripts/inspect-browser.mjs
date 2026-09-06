import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync("docs/screenshots", { recursive: true });
const browser = await chromium.launch();
for (const locale of ["en", "ar"])
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    await context.addInitScript(
      ({ locale, theme }) => {
        localStorage.setItem("jizrak.locale", locale);
        localStorage.setItem("jizrak.theme", theme);
      },
      { locale, theme },
    );
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000");
    await page.waitForFunction(
      () => document.documentElement.dataset.hydrated === "true",
    );
    await page.waitForFunction(
      () => document.querySelector(".landing")?.dataset.motionState === "ready",
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `docs/screenshots/desktop-${locale}-${theme}.png`,
    });
    await page.setViewportSize({ width: 375, height: 900 });
    await page.screenshot({
      path: `docs/screenshots/mobile-${locale}-${theme}.png`,
    });
    await context.close();
  }
await browser.close();
console.log(
  "Captured both language modes in light/dark, desktop/mobile layouts.",
);
