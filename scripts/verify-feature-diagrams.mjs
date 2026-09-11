import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const out = 'scrollcraft/builds/jizrak-features/lab/diagrams';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript(() => {
      Element.prototype.requestPointerLock = () => Promise.reject(new Error('disabled'));
      Element.prototype.setPointerCapture = () => {};
      localStorage.setItem('jizrak.locale', 'en');
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4100/features');
    await page.waitForSelector('.f-ready');
    for (const selector of ['.stage-line', '.f-store-map']) {
      const values = [];
      for (const fraction of [.84, .45, .84]) {
        await page.locator(selector).evaluate((el, fraction) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * fraction, behavior: 'instant' }), fraction);
        await page.waitForTimeout(150);
        values.push(await page.locator(selector).evaluate(el => Number(el.style.getPropertyValue('--diagram-progress'))));
      }
      assert(values[1] > values[0] + .5, `${selector} draws forward`);
      assert(Math.abs(values[2] - values[0]) < .03, `${selector} reverses`);
      await page.screenshot({ path: `${out}/${width}-${selector.slice(1)}.png` });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(150);
    for (const selector of ['.stage-line', '.f-store-map']) {
      assert.equal(await page.locator(selector).evaluate(el => el.style.getPropertyValue('--diagram-progress')), '1');
    }
    await context.close();
    console.log(`${width}: forward, reverse, and reduced motion passed`);
  }
} finally { await browser.close(); }
