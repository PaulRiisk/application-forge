import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // offline support: precache the whole build (app shell, fonts, images)
    // so the deployed page keeps working without network after one visit.
    // woff2 only — every service-worker-capable browser also speaks woff2,
    // caching the woff fallbacks would just double the font payload
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "placeholder_cv.png"],
      manifest: {
        name: "Application Forge",
        short_name: "Forge",
        description:
          "Bewerbungsmappen-Editor: Deckblatt, Anschreiben, Lebenslauf, Über mich — komplett im Browser, ohne Backend.",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2046c6",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
    }),
  ],
  base: command === "build" ? "/application-forge/" : "/",
}));
