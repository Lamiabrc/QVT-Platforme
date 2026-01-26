import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    /**
     * ⚠️ Correction majeure :
     * - "./" casse sur Vercel (chemins relatifs → MIME errors)
     * - "/" garantit des assets propres, même dans un sous-domaine (zena.qvtbox.com)
     * - fonctionne aussi si ton projet est dans /zena (car Vercel réécrit correctement)
     */
    base: "/",

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
    ].filter(Boolean),

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
