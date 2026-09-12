import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
const base = process.env.WORKSPACE_URL || "http://127.0.0.1:4300";
const out =
  process.env.WORKSPACE_OUT || "scrollcraft/builds/jizrak-workspaces/lab/final";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const allRoutes = [
  "/businesses",
  "/businesses/new",
  "/businesses/olive",
  "/stores",
  "/stores/new?businessId=olive",
  "/platform",
  "/platform/business/olive",
  "/platform/lifecycle",
  "/platform/support",
  "/demo",
  "/account",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/recovery",
  "/auth/accept-invite",
];
const routes = process.env.WORKSPACE_ROUTES
  ? process.env.WORKSPACE_ROUTES.split(",")
  : allRoutes;
const report = [];
async function visit(page, path) {
  await page.goto(base + path);
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  await page.waitForTimeout(200);
}
async function contextFor(
  width,
  height,
  locale = "en",
  theme = "light",
  reducedMotion = "no-preference",
) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
  });
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
  return context;
}
try {
  for (const [mode, width, height, locale, theme, reduced] of [
    ["desktop", 1440, 1000, "en", "light"],
    ["phone", 390, 844, "en", "light"],
    ["compact-ar", 360, 640, "ar", "dark"],
    ["reduced", 1440, 900, "en", "dark", "reduce"],
  ]) {
    const context = await contextFor(width, height, locale, theme, reduced);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(base + route);
      await page.waitForSelector(".workspace");
      await page.waitForTimeout(750);
      const key = route.replaceAll(/[^a-z0-9]/gi, "-");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      const headings = await page.locator("h1").count();
      const violations = (
        await new AxeBuilder({ page })
          .include(".workspace")
          .withTags(["wcag2a", "wcag2aa"])
          .analyze()
      ).violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      }));
      await page.screenshot({
        path: `${out}/${mode}${key}.png`,
        fullPage: true,
      });
      report.push({
        mode,
        route,
        status: response.status(),
        overflow,
        headings,
        violations,
        errors: [...errors],
      });
      errors.length = 0;
      console.log(
        `${mode} ${route}: ${response.status()} overflow=${overflow} axe=${violations.map((v) => v.id).join(",")}`,
      );
    }
    await visit(page, "/demo");
    await page.waitForTimeout(700);
    for (const y of [0, 250, 500, 850, 1200]) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/${mode}-motion-${y}.png` });
    }
    await context.close();
  }
  if (process.env.WORKSPACE_SKIP_INTERACTIONS !== "1") {
    const context = await contextFor(1440, 1000);
    const page = await context.newPage();
    await visit(page, "/businesses");
    await page.getByRole("searchbox").fill("not-a-business");
    await page.getByRole("heading", { name: "Nothing here yet." }).waitFor();
    await page.getByRole("button", { name: "Clear search" }).click();
    assert.equal(await page.locator(".ws-card").count(), 3);
    await visit(page, "/businesses/new");
    await page.getByLabel("Business name").fill("Test Workshop");
    await page.getByRole("button", { name: "Create preview" }).click();
    await page.getByRole("link", { name: "Continue to workspace" }).click();
    await page
      .getByRole("heading", { name: "Test Workshop", exact: true })
      .waitFor();
    await visit(page, "/stores/new?businessId=olive");
    await page.getByLabel("Store name", { exact: true }).fill("Test Store");
    await page.getByLabel("Store handle").fill("olive-home");
    await page.getByRole("button", { name: "Create preview" }).click();
    await page.getByRole("alert").waitFor();
    await page.getByLabel("Store handle").fill("test-new-store");
    await page.getByRole("button", { name: "Create preview" }).click();
    await page.getByRole("link", { name: "Continue to workspace" }).click();
    await page.getByText("Test Store", { exact: true }).waitFor();
    await visit(page, "/auth/reset-password");
    await page
      .getByLabel("New password", { exact: true })
      .fill("long-password-123");
    await page.getByLabel("Confirm new password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Preview password reset" }).click();
    await page.getByRole("alert").waitFor();
    await page.getByLabel("Confirm new password").fill("long-password-123");
    await page.getByRole("button", { name: "Preview password reset" }).click();
    await page.getByRole("heading", { name: "Preview complete." }).waitFor();
    await visit(page, "/platform/support");
    await page.getByLabel("Support ticket").fill("SUP-1042");
    await page
      .getByLabel("Reason", { exact: true })
      .fill("Investigate a sample stock discrepancy.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Preview support session" }).click();
    await page.getByRole("button", { name: "Revoke preview session" }).click();
    await page
      .getByText("Session preview revoked.", { exact: false })
      .waitFor();
    await visit(page, "/demo");
    await page.getByRole("button", { name: "Place sample order" }).click();
    assert.equal(
      await page.locator(".ws-stock-number > span").textContent(),
      "23",
    );
    await page.getByRole("button", { name: "Reset the sample" }).click();
    assert.equal(
      await page.locator(".ws-stock-number > span").textContent(),
      "24",
    );
    await page.getByRole("button", { name: "Preview demo launch" }).click();
    await page.getByText("The launch UI is ready.", { exact: false }).waitFor();
    await visit(page, "/auth/recovery?returnTo=https://example.com");
    assert.equal(
      await page
        .getByRole("link", { name: "Return to sign in" })
        .getAttribute("href"),
      "/auth/login?returnTo=%2Fbusinesses",
    );
    await context.close();
    report.push({ interactions: "passed" });
  }
} finally {
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
if (
  report.some(
    (r) =>
      r.overflow ||
      (r.headings && r.headings !== 1) ||
      r.status >= 400 ||
      r.errors?.length ||
      r.violations?.length,
  )
)
  process.exitCode = 1;
