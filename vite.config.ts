import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { validateConfig } from "./scripts/config-rules";
import { siteAssets } from "./scripts/site-assets";
export default defineConfig(({ mode, command, isPreview }) => {
  if (command === "build") process.env.JIZRAK_BUILD_MODE = mode;
  const review =
    mode !== "production" ||
    (isPreview === true && process.env.JIZRAK_BUILD_MODE === "review");
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  validateConfig(env, !review);
  return {
    server: {
      watch: {
        ignored: [
          "**/.tools/**",
          "**/.output/**",
          "**/.nitro/**",
          "**/docs/**",
          "**/test-results/**",
          "**/playwright-report/**",
        ],
      },
    },
    define: { "import.meta.env.VITE_REVIEW": JSON.stringify(review) },
    plugins: [
      tanstackStart({
        prerender: { enabled: true, crawlLinks: false, failOnError: true },
        pages: [{ path: "/" }],
      }),
      nitro({
        preset: "node-server",
        compatibilityDate: "2026-09-06",
        compressPublicAssets: true,
      }),
      tailwind(),
      react(),
      siteAssets(
        (env.VITE_SITE_URL || "http://127.0.0.1:3000").replace(/\/$/, ""),
        review,
      ),
    ],
  };
});
