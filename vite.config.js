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

//this api returns an object for a speicific bus stops. each stop has its own latitude and longitude. how do i get them and 
//visualize them on an openlayers map? - https://v0.ovapi.nl/journey/ARR_20230911_28094_1015_0