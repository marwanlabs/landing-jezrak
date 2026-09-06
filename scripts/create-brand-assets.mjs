import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
const rootPath =
  "M20 4v17m0-9L9 5m11 12L31 9M20 21v15m0-15L8 28m12-7 12 8M8 28v7m24-6v6";
mkdirSync("public/icons", { recursive: true });
mkdirSync("public/og", { recursive: true });
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#153c2b"/><g transform="translate(12 12)"><path d="${rootPath}" fill="none" stroke="#f4f1e8" stroke-width="2.5"/><circle cx="20" cy="21" r="3" fill="#f4f1e8"/></g></svg>`;
writeFileSync("public/icons/favicon.svg", icon);
writeFileSync(
  "public/icons/mask.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="${rootPath}" fill="none" stroke="black" stroke-width="2.5"/></svg>`,
);
writeFileSync(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "Jizrak — جِذرك",
      short_name: "Jizrak",
      start_url: "/",
      display: "browser",
      background_color: "#F4F1E8",
      theme_color: "#153C2B",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    null,
    2,
  ),
);
const font = readFileSync("public/fonts/Alexandria-Medium.woff2").toString(
  "base64",
);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:Alexandria;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#f4f1e8;color:#153c2b;font-family:Alexandria,sans-serif;width:1200px;height:630px;padding:65px 80px;position:relative;overflow:hidden}.brand{display:flex;align-items:center;gap:25px;font-size:46px;font-weight:500}.brand svg{width:60px;height:60px}h1{font-size:57px;font-weight:500;line-height:1.3;letter-spacing:-2px;max-width:780px;margin:47px 0 18px}.ar{font-size:36px;direction:rtl;text-align:left}footer{font-size:18px;margin-top:45px;color:#59635b}.network{position:absolute;right:-15px;bottom:-12px;width:350px;height:350px;opacity:.38;z-index:-0}.content{position:relative;z-index:1}</style></head><body><div class="content"><div class="brand"><svg viewBox="0 0 40 40"><path d="${rootPath}" fill="none" stroke="currentColor" stroke-width="2.5"/></svg><span>Jizrak — <span lang="ar" dir="rtl">جِذرك</span></span></div><h1>Your idea. Your brand.<br>Your roots.</h1><div lang="ar" class="ar">فكرتك. براندك. جذرك.</div><footer>Connected commerce for every Store.</footer></div><svg class="network" viewBox="0 0 400 400" fill="none" stroke="#4f9368" stroke-width="2"><path d="M200 0v100q0 30-30 30H40q-25 0-25 25v65M200 130h155q25 0 25 25v65M15 240v40q0 30 30 30h130q25 0 25 25v65M380 240v40q0 30-30 30H200"/><rect x="-10" y="195" width="50" height="45" rx="4" fill="#f4f1e8"/><rect x="355" y="195" width="50" height="45" rx="4" fill="#f4f1e8"/></svg></body></html>`;
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og/jizrak.png" });
for (const size of [180, 192, 512]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0">${icon}</body>`);
  await page.screenshot({
    path: `public/icons/${size === 180 ? "apple-touch-icon" : `icon-${size}`}.png`,
  });
}
await browser.close();
console.log(
  "Created Jizrak-only social image, favicon, mask, touch and PWA icons.",
);
