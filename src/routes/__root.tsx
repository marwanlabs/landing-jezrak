import {
  createRootRoute,
  HeadContent,
  Scripts,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { PreferenceProvider, preferenceScript } from "../app/preferences";
import { metadata, copy } from "../content";
import { config } from "../app/config";
import { BilingualBlock } from "../components/BilingualBlock";
import { Cta } from "../components/Primitives";
import { NotFoundPage } from "../components/NotFoundPage";
import stylesheet from "../styles/globals.css?url";
const reloadPage = { id: "reload-page", en: "Reload this page", ar: "أعد تحميل الصفحة" };
function RootContent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  return (
    <PreferenceProvider pathname={pathname}>
      <Outlet />
    </PreferenceProvider>
  );
}
export const Route = createRootRoute({
  head: () => {
    const pageUrl = config.site;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: metadata.en.title },
        { name: "description", content: metadata.en.description },
        { name: "theme-color", content: "#F4F1E8" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: metadata.en.title },
        { property: "og:description", content: metadata.en.description },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: `${config.site}/og/jizrak.png` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:image",
          content: `${config.site}/og/jizrak.png`,
        },
        ...(config.review
          ? [{ name: "robots", content: "noindex, nofollow" }]
          : []),
      ],
      links: [
        {
          rel: "preload",
          href: "/fonts/Alexandria-Medium.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        { rel: "stylesheet", href: stylesheet },
        { rel: "icon", href: "/icons/favicon.svg", type: "image/svg+xml" },
        { rel: "mask-icon", href: "/icons/mask.svg", color: "#153C2B" },
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    };
  },
  component: RootContent,
  notFoundComponent: NotFoundPage,
  shellComponent: ({ children }) => (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  ),
  errorComponent: () => (
    <PreferenceProvider>
      <main className="container error-page">
        <section className="error-shell" aria-labelledby="route-error-heading">
          <div className="error-marker" aria-hidden="true"><RefreshCw size={24} /></div>
          <BilingualBlock id="route-error-heading" heading="h1" text={copy.error} />
          <div className="actions">
            <button className="error-reload" type="button" onClick={() => window.location.reload()}>
              <RefreshCw size={17} aria-hidden="true" />
              <BilingualBlock inline text={reloadPage} />
            </button>
            <Cta />
            <Cta kind="demo" />
          </div>
        </section>
      </main>
    </PreferenceProvider>
  ),
});
