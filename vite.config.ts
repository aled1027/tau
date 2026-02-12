import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      $core: resolve(__dirname, "src/core"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        chat: resolve(__dirname, "examples/chat/index.html"),
        tutor: resolve(__dirname, "examples/tutor/index.html"),
      },
    },
  },
});
