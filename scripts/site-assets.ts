import type { Plugin } from "vite";
export function siteAssets(site: string, review: boolean): Plugin {
  const robots = review
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`;
  const escaped = site
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escaped}/</loc></url><url><loc>${escaped}/features</loc></url></urlset>`;
  return {
    name: "jizrak-site-assets",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split("?")[0];
        if (path === "/robots.txt" || path === "/sitemap.xml") {
          response.setHeader(
            "Content-Type",
            path === "/robots.txt"
              ? "text/plain; charset=utf-8"
              : "application/xml; charset=utf-8",
          );
          response.end(path === "/robots.txt" ? robots : sitemap);
        } else next();
      });
    },
    generateBundle() {
      if (this.environment.name === "client") {
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: robots,
        });
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: sitemap,
        });
      }
    },
  };
}
