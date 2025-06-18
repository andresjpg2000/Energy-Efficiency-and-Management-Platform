import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/users": "http://localhost:3000",
      "/notifications": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/energy-consumptions": "http://localhost:3000",
      "/energy-productions": "http://localhost:3000",
      "/housings": "http://localhost:3000",
      "/widgets": "http://localhost:3000",
      "/equipments": "http://localhost:3000",
      "/suppliers": "http://localhost:3000",
    },
  },
});
