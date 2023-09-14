import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      "/public-transport/": {
        target: "http://v0.ovapi.nl/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/public-transport/, ""),
      },
    },
  },
});

