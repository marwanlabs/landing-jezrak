import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
const browser = await chromium.launch();
const measurements = [];
mkdirSync("docs/screenshots", { recursive: true });
for (const locale of ["en", "ar"])
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: 375, height: 900 },
      locale: locale === "ar" ? "ar-EG" : "en-US",
    });
    await context.addInitScript(
      ({ locale, theme }) => {
        localStorage.setItem("jizrak.locale", locale);
        localStorage.setItem("jizrak.theme", theme);
        window.__lab = { lcp: 0, cls: 0, longTaskMs: 0 };
        for (const type of [
          "largest-contentful-paint",
          "layout-shift",
          "longtask",
        ])
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (type === "largest-contentful-paint")
                window.__lab.lcp = entry.startTime;
              if (type === "layout-shift" && !entry.hadRecentInput)
                window.__lab.cls += entry.value;
              if (type === "longtask")
                window.__lab.longTaskMs += Math.max(entry.duration - 50, 0);
            }
          }).observe({ type, buffered: true });
      },
      { locale, theme },
    );
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 100000,
    });
    await page.goto("http://127.0.0.1:4000");
    await page.waitForFunction(
      () => document.documentElement.dataset.hydrated === "true",
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState("networkidle");
    const stats = await page.evaluate(() => ({
      ...window.__lab,
      resources: performance
        .getEntriesByType("resource")
        .map((r) => ({
          name: r.name.split("/").pop(),
          bytes: r.transferSize,
          duration: Math.round(r.duration),
        })),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    measurements.push({
      locale,
      theme,
      viewport: "375 × 900",
      cpuSlowdown: 4,
      network: "150 ms latency, 200 kB/s down, local Nitro server with precompressed assets",
      ...stats,
      seriousOrCritical: accessibility.violations
        .filter((v) => ["serious", "critical"].includes(v.impact))
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    });
    await page.screenshot({
      path: `docs/screenshots/built-mobile-${locale}-${theme}.png`,
    });
    await context.close();
    console.log(
      `Measured ${locale}/${theme}: LCP ${Math.round(stats.lcp)} ms, CLS ${stats.cls.toFixed(3)}`,
    );
  }
const bundle = readdirSync(".output/public/assets")
  .filter((f) => /\.(js|css)$/.test(f))
  .map((name) => {
    const data = readFileSync(`.output/public/assets/${name}`);
    return { name, rawBytes: data.length, gzipBytes: gzipSync(data).length };
  });
writeFileSync(
  "docs/performance.json",
  JSON.stringify(
    {
      kind: "Local synthetic lab observations, not deployed Core Web Vitals or a Lighthouse score",
      measurements,
      bundle,
    },
    null,
    2,
  ) + "\n",
);
await browser.close();
