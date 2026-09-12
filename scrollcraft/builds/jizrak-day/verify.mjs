import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.ROOTED_VERIFY_URL || 'http://127.0.0.1:3000';
const out = path.resolve(process.env.ROOTED_VERIFY_OUT || 'scrollcraft/builds/jizrak-day/lab/final');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const reports = [];
for (const mode of [
  { name: 'desktop', width: 1440, height: 900, locale: 'en', theme: 'light' },
  { name: 'phone', width: 390, height: 844, locale: 'en', theme: 'light' },
  { name: 'compact-arabic', width: 360, height: 640, locale: 'ar', theme: 'light' },
  { name: 'arabic', width: 1440, height: 900, locale: 'ar', theme: 'light' },
  { name: 'dark', width: 1440, height: 900, locale: 'en', theme: 'dark' },
  { name: 'reduced', width: 390, height: 844, locale: 'en', theme: 'light', reduced: true },
]) {
  const context = await browser.newContext({ viewport: { width: mode.width, height: mode.height }, reducedMotion: mode.reduced ? 'reduce' : 'no-preference' });
  await context.addInitScript(({ locale, theme }) => {
    Element.prototype.requestPointerLock = () => Promise.reject(new Error('Disabled in verification'));
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    localStorage.setItem('jizrak.locale', locale);
    localStorage.setItem('jizrak.theme', theme);
  }, mode);
  const page = await context.newPage();
  const errors = [];
  const failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', req => failed.push(req.url()));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForSelector('.rooted-page[data-motion]');
  await page.screenshot({ path: path.join(out, `${mode.name}-hero.png`) });
  const overflow = [];
  for (const selector of ['.rd-hero', '.rd-selling', '.rd-beneath', '.rd-operate', '.rd-confidence', '.rd-close']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    if (width.document > width.viewport) overflow.push({ selector, ...width });
  }
  await page.locator('#roots').scrollIntoViewIfNeeded();
  await page.locator('.rd-root-node-4').click();
  await page.waitForTimeout(650);
  await page.screenshot({ path: path.join(out, `${mode.name}-roots.png`) });
  const rootSelection = await page.locator('.rd-root-node-4').getAttribute('aria-pressed');
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  await page.locator('.rd-operate').scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  await page.screenshot({ path: path.join(out, `${mode.name}-operations.png`) });
  await page.locator('.rd-close').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(out, `${mode.name}-close.png`) });
  const brokenImages = await page.locator('img').evaluateAll(imgs => imgs.filter(i => !i.complete || !i.naturalWidth).map(i => i.src));
  reports.push({ mode: mode.name, errors, failed, overflow, brokenImages, rootSelection, violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
  await context.close();
}
const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
const staticPage = await staticContext.newPage();
await staticPage.goto(base, { waitUntil: 'networkidle' });
const noScriptRoots = await staticPage.locator('.rd-static-roots article').count();
const staticHeading = await staticPage.locator('h1').innerText();
await staticPage.screenshot({ path: path.join(out, 'no-script.png') });
reports.push({ mode: 'no-script', noScriptRoots, heading: staticHeading });
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports));
await browser.close();
