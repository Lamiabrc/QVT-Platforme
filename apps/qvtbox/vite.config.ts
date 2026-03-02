import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isCapacitor = mode === "capacitor";

  return {
    base: isCapacitor ? "./" : "/",
    server: {
      host: "::",
      port: 8080,
      strictPort: false,
    },
    preview: {
      port: 8080,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "icons/icon-144x144.png"],
        manifest: {
          name: "QVT Box - Réseau social responsable",
          short_name: "QVT Box",
          description:
            "QVT Box réinvente le réseau social avec des bulles de confiance. Privé par défaut. Partage choisi.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#FAF6EE",
          theme_color: "#151515",
          lang: "fr",
          icons: [
            {
              src: "/icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}"],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: isDev,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            ui: ["lucide-react"],
            data: ["@tanstack/react-query"],
          },
        },
      },
    },
    esbuild: {
      drop: isDev ? [] : ["console", "debugger"],
    },
  };
});
