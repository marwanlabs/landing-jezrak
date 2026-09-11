import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import fs from "node:fs";

const base = process.env.AUTH_URL || "http://127.0.0.1:4200";
const out = process.env.AUTH_OUT || "scrollcraft/builds/jizrak-auth/lab/final";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const report = [];
async function setup(context, locale = "en", theme = "light") {
  await context.addInitScript(
    ({ locale, theme }) => {
      Element.prototype.requestPointerLock = () =>
        Promise.reject(new Error("disabled"));
      Element.prototype.setPointerCapture = () => {};
      localStorage.setItem("jizrak.locale", locale);
      localStorage.setItem("jizrak.theme", theme);
    },
    { locale, theme },
  );
}
try {
  for (const config of [
    {
      name: "desktop",
      width: 1440,
      height: 1000,
      locale: "en",
      theme: "light",
    },
    { name: "phone", width: 390, height: 844, locale: "en", theme: "light" },
    {
      name: "compact-ar",
      width: 360,
      height: 640,
      locale: "ar",
      theme: "dark",
    },
    {
      name: "desktop-dark",
      width: 1440,
      height: 900,
      locale: "en",
      theme: "dark",
    },
    {
      name: "reduced",
      width: 390,
      height: 844,
      locale: "en",
      theme: "light",
      reducedMotion: "reduce",
    },
  ]) {
    const context = await browser.newContext({
      viewport: { width: config.width, height: config.height },
      reducedMotion: config.reducedMotion,
    });
    await setup(context, config.locale, config.theme);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    for (const mode of ["login", "signup"]) {
      await page.goto(`${base}/${mode}`);
      await page.waitForFunction(
        () => !document.querySelector("fieldset").disabled,
      );
      await page.waitForTimeout(1000);
      assert.equal(
        await page.locator("html").getAttribute("lang"),
        config.locale,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.screenshot({
        path: `${out}/${config.name}-${mode}.png`,
        fullPage: true,
      });
      for (const fraction of [0, 0.5, 1]) {
        await page.evaluate(
          (f) =>
            window.scrollTo(
              0,
              (document.documentElement.scrollHeight - innerHeight) * f,
            ),
          fraction,
        );
        await page.waitForTimeout(100);
        await page.screenshot({
          path: `${out}/${config.name}-${mode}-${fraction}.png`,
        });
      }
      const axe = await new AxeBuilder({ page }).analyze();
      report.push({
        name: config.name,
        mode,
        violations: axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      await page.locator(".auth-submit").click();
      assert.equal(
        await page.locator('[aria-invalid="true"]').count(),
        mode === "signup" ? 4 : 2,
      );
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        mode === "signup" ? "name" : "email",
      );
      if (mode === "signup") {
        await page.locator("#name").fill("Sample Merchant");
        await page.locator("#store").fill("Cedar Studio");
        assert.equal(
          await page.locator(".auth-store-name").textContent(),
          "Cedar Studio",
        );
      }
      await page.locator("#email").fill("sample@example.com");
      await page.locator("#password").fill("sample only password");
      await page.locator(".auth-reveal").click();
      assert.equal(
        await page.locator("#password").getAttribute("type"),
        "text",
      );
      await page.locator(".auth-reveal").click();
      assert.equal(
        await page.locator("#password").getAttribute("type"),
        "password",
      );
      const requests = [];
      page.on("request", (r) => {
        if (r.method() === "POST" || r.url().includes("sample%40"))
          requests.push(r.url());
      });
      await page.locator(".auth-submit").click();
      await page.locator(".auth-result").waitFor();
      assert.equal(await page.locator("#password").inputValue(), "");
      assert.equal(
        await page.evaluate(() => document.activeElement.className),
        "auth-result",
      );
      assert.equal(requests.length, 0);
      assert.equal(new URL(page.url()).search, "");
      assert.equal(
        await page.evaluate(() =>
          JSON.stringify(localStorage).includes("sample"),
        ),
        false,
      );
      await page.screenshot({
        path: `${out}/${config.name}-${mode}-result.png`,
        fullPage: true,
      });
      const resultAxe = await new AxeBuilder({ page }).analyze();
      report.push({
        name: config.name,
        mode: `${mode}-result`,
        violations: resultAxe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      if (config.reducedMotion)
        assert.equal(
          await page
            .locator(".auth-shop")
            .evaluate((el) => getComputedStyle(el).animationName),
          "none",
        );
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`${config.name}: visual states and form checks passed`);
  }
  const context = await browser.newContext();
  await setup(context);
  const page = await context.newPage();
  await page.goto(`${base}/login`);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Skip to form",
  );
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.id), "email");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  assert.equal(await page.locator("#password").count(), 0);
  await page.locator("#email").fill("sample@example.com");
  await page.locator(".auth-submit").click();
  await page
    .getByText("Password recovery is not connected. No reset email was sent.")
    .waitFor();
  await page.getByRole("button", { name: "Back to log in" }).click();
  await page.locator(".auth-switch a").click();
  assert.equal(new URL(page.url()).pathname, "/signup");
  await page.locator(".auth-switch a").click();
  assert.equal(new URL(page.url()).pathname, "/login");
  await context.close();
  const motionContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await setup(motionContext);
  const motionPage = await motionContext.newPage();
  await motionPage.goto(`${base}/signup`);
  await motionPage.waitForFunction(
    () => !document.querySelector("fieldset").disabled,
  );
  assert.equal(
    await motionPage.locator(".auth-specimen").getAttribute("data-arrived"),
    null,
  );
  await motionPage.locator(".auth-specimen").scrollIntoViewIfNeeded();
  await motionPage.waitForFunction(
    () => document.querySelector(".auth-specimen").dataset.arrived === "true",
  );
  const transforms = [];
  for (const time of [0, 300, 850]) {
    await motionPage.evaluate(
      (time) =>
        document.getAnimations().forEach((a) => {
          a.pause();
          a.currentTime = time;
        }),
      time,
    );
    transforms.push(
      await motionPage
        .locator(".auth-shop")
        .evaluate((el) => getComputedStyle(el).transform),
    );
    await motionPage.screenshot({ path: `${out}/motion-${time}.png` });
  }
  assert.equal(
    new Set(transforms).size,
    3,
    "Specimen animation advances through distinct states",
  );
  await motionContext.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  await setup(nojs);
  const staticPage = await nojs.newPage();
  for (const mode of ["login", "signup"]) {
    await staticPage.goto(`${base}/${mode}`);
    assert(await staticPage.locator(".auth-submit").isDisabled());
    assert.equal(
      await staticPage.locator("form").getAttribute("method"),
      "post",
    );
  }
  await nojs.close();
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  assert.equal(
    report.filter((r) => r.violations.length).length,
    0,
    "Accessibility violations: see report.json",
  );
  console.log(
    "Recovery, cross-links, no-JS and all accessibility scans passed.",
  );
} finally {
  await browser.close();
}
