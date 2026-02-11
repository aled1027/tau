import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        chat: resolve(__dirname, "examples/chat/index.html"),
        tutor: resolve(__dirname, "examples/tutor/index.html"),
      },
    },
  },
});
