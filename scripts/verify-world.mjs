import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import assert from "node:assert/strict";

const url = process.env.WORLD_URL || "http://127.0.0.1:3000";
const out = process.env.WORLD_OUT || "scrollcraft/builds/jizrak-world/lab/final";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const report = [];
const safety = () => {
  Element.prototype.requestPointerLock = () =>
    Promise.reject(new Error("Disabled for verification"));
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Document.prototype.exitPointerLock = () => {};
};
try {
  for (const [name, width, height, locale, theme, motion] of [
    ["desktop", 1440, 900, "en", "light", "no-preference"],
    ["phone", 390, 844, "en", "light", "no-preference"],
    ["compact-ar", 360, 640, "ar", "light", "no-preference"],
    ["arabic-dark", 1440, 900, "ar", "dark", "no-preference"],
    ["reduced", 390, 844, "en", "light", "reduce"],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: motion,
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
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.goto(url);
    await page.waitForSelector(".w-ready");
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      spacer: document.querySelector("[data-sc-spacer]").offsetHeight,
      fixed: getComputedStyle(document.querySelector("[data-sc-world]"))
        .position,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    assert.equal(geometry.fixed, "fixed");
    assert.equal(geometry.overflow, false);
    assert.ok(Math.abs(geometry.height - geometry.spacer) < 3);
    const scenes = [];
    for (let i = 0; i < 5; i++) {
      await page.locator(".w-route button").nth(i).click();
      await page.waitForTimeout(180);
      const layout = await page.evaluate(() => {
        const copy = [...document.querySelectorAll("[data-sc-copy]")].find(
          (el) => getComputedStyle(el).opacity > 0.85,
        );
        const r = copy?.getBoundingClientRect();
        return {
          index: copy?.dataset.index,
          top: r?.top,
          bottom: r?.bottom,
          header: document.querySelector(".w-header").getBoundingClientRect()
            .bottom,
          nav: document.querySelector(".w-route").getBoundingClientRect().top,
          state:
            document.querySelector("[data-sc-world]").dataset.scVerifyState,
        };
      });
      assert.equal(layout.index, String(i));
      assert.ok(layout.top > layout.header, `${name}: heading overlaps navigation`);
      assert.ok(layout.bottom < layout.nav, `${name}: copy overlaps route`);
      const a11y = await new AxeBuilder({ page }).analyze();
      scenes.push({
        ...layout,
        violations: a11y.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      await page.screenshot({ path: `${out}/${name}-${i}.png` });
      assert.equal(a11y.violations.length, 0, `${name}: accessibility violations`);
    }
    if (locale === "en") {
      await page.locator(".w-route button").nth(1).click();
      await page.waitForTimeout(100);
      await page.getByRole("button", { name: "Clothing", exact: true }).click();
      assert.match(await page.locator(".w-store-top").innerText(), /FORME/);
      await page.locator(".w-route button").nth(2).click();
      await page.waitForTimeout(100);
      await page
        .getByRole("button", { name: "Reserve one more", exact: true })
        .click();
      assert.equal(await page.locator("output").innerText(), "2");
      assert.match(
        await page.locator(".w-reservation-result").innerText(),
        /22/,
      );
      assert.match(
        await page.locator(".w-order-slip").innerText(),
        /Everyday tee/,
      );
      await page.locator(".w-route button").nth(4).click();
      await page.waitForTimeout(100);
      assert.match(
        await page.locator('[data-index="4"] .w-small').innerText(),
        /Clothing/,
      );
      await page
        .getByRole("button", { name: "Questions?", exact: true })
        .click();
      assert.ok(await page.locator("dialog").isVisible());
      await page.locator("dialog summary").first().click();
      assert.ok(
        (await page.locator("dialog details").first().getAttribute("open")) !==
          null,
      );
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("dialog").isVisible(), false);
      await page
        .getByRole("button", { name: "Start your Business", exact: true })
        .click();
      assert.match(await page.locator("dialog").innerText(), /will be linked/);
      await page.keyboard.press("Escape");
    }
    if (name === "desktop") {
      const frames = [];
      for (let sample = 0; sample <= 10; sample++) {
        await page.evaluate(p => scrollTo({top:p*(document.documentElement.scrollHeight-innerHeight),behavior:"instant"}), sample/10);
        await page.waitForTimeout(120);
        const visible = await page.locator("[data-sc-copy]").evaluateAll(els => els.filter(el => Number(getComputedStyle(el).opacity) > .1).length);
        assert.ok(visible <= 1, "Transition paints overlapping copy");
        const pixels = await page.screenshot({path:`${out}/camera-${String(sample).padStart(2,"0")}.png`});
        if (frames.length) assert.ok(!pixels.equals(frames.at(-1)), "Camera stopped changing pixels");
        frames.push(pixels);
      }
      await page.locator(".w-route button").first().click();
      await page.mouse.move(800,300);await page.waitForTimeout(100);
      const before=await page.screenshot({path:`${out}/pointer-before.png`});
      await page.mouse.move(1250,700);await page.waitForTimeout(100);
      const after=await page.screenshot({path:`${out}/pointer-after.png`});
      assert.ok(!before.equals(after), "Pointer depth must change actual pixels");
    }
    assert.equal(errors.length, 0);
    report.push({ name, geometry, scenes, errors });
    console.log(name, JSON.stringify({ geometry, scenes, errors }));
    await context.close();
  }
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(url);
  assert.equal(await page.locator(".w-copy").count(), 5);
  assert.ok(await page.locator("h1").isVisible());
  report.push({ name: "no-javascript", allFiveCopyBlocks: true });
  await context.close();
} finally {
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
