import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { dirname, resolve } from "node:path";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        "./src/locales/**"
      ),
      runtimeOnly: false,
      //resolve(dirname(fileURLToPath(import.meta.url)), "./"),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    target: "esnext",
    sourcemap: true,
  },
});
