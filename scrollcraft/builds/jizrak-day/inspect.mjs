import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('scrollcraft/builds/jizrak-day/lab');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.addInitScript(() => {
  Element.prototype.requestPointerLock = () => Promise.reject(new Error('Disabled in verification'));
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  localStorage.setItem('jizrak.locale', 'en');
  localStorage.setItem('jizrak.theme', 'light');
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(out, 'opening.png') });
await page.locator('#roots').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(out, 'roots.png') });
console.log(JSON.stringify({ errors, title: await page.title(), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) }));
await browser.close();
